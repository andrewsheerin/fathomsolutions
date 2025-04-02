import os
import shutil
import pandas as pd
from numpy import *
from datetime import datetime, timedelta
import meteostat
import matplotlib.pyplot as plt
import matplotlib.dates as mdates
import numpy as np
import geopandas as gpd
import warnings
import random

warnings.filterwarnings("ignore", category=FutureWarning)

def get_meteostat_daily(startdate, enddate):
    point = meteostat.Point(lat=41.7260, lon=-71.4304)
    data = meteostat.Daily(point, startdate, enddate)
    rainfall = data.fetch()

    # Change the datetime index format to MM/DD HH
    rainfall.index = [d.strftime('%m/%d') for d in rainfall.index]

    rain_in = []
    for i in rainfall['prcp']:
        rain_in.append(round(i * 0.0393701, 2))

    return rain_in

def buildup_function(acc_i, t, C1, C2, road_length):
    B_i = C1 * (1 - exp(-C2 * t)) * road_length - acc_i
    return round(B_i, 2)

def washoff_function(acc_i, C3, C4, rain_in):
    acc = acc_i * exp(-C3 * rain_in ** C4)
    W_i = acc_i - acc
    return round(W_i, 2)

def solve_for_t(acc_i, C1, C2, road_length):
    t = -log(1 - acc_i / (C1 * road_length)) / C2
    return round(t, 2)

def NoSweepingModule(startdate, enddate, acc_i, params, road_length, user_input, rem_eff):

    C1, C2, C3, C4 = params[0], params[1], params[2], params[3]
    accumulation, washoff, swept, rainfall = [], [], [], [] # initialize empty lists to track
    t_washoff, t_buildup, t_sweep = 0, 0, 0 # initialize totals
    total_buildup, total_washoff, total_swept = [], [], []  # initialize empty lists to track totals

    daterange = pd.date_range(start=startdate, end=enddate, freq='D')
    rain_in = get_meteostat_daily(startdate, enddate)
    t = 0  # time step

    for i in range(len(daterange)):
        if rain_in[i] > 0:
            W_i = washoff_function(acc_i, C3, C4, rain_in[i])
            t_washoff += W_i  # total washoff
            acc_i -= W_i  # update accumulation after washoff
            t = solve_for_t(acc_i, C1, C2, road_length)
            S_i = 0
        else:
            W_i = 0
            t += 1
            B_i = buildup_function(acc_i, t, C1, C2, road_length)
            t_buildup += B_i  # accumulate buildup
            acc_i += B_i  # update accumulation
            S_i = 0

        accumulation.append(round(acc_i, 2))
        washoff.append(round(W_i, 2))
        swept.append(round(S_i, 2))
        total_washoff.append(round(t_washoff, 2))
        total_buildup.append(round(t_buildup, 2))
        total_swept.append(round(t_sweep, 2))
        rainfall.append(round(rain_in[i], 2))


    df = pd.DataFrame({'Date': daterange, 'Accumulation': accumulation, 'Washoff': washoff, 'Swept': swept,
                       'Total Buildup': total_buildup, 'Total Washoff': total_washoff, 'Total Swept': total_swept, 'Rainfall': rainfall})

    return df


def RainThresholdModule(startdate, enddate, acc_i, params, road_length, user_input, rem_eff):

    C1, C2, C3, C4 = params[0], params[1], params[2], params[3]
    accumulation, washoff, swept, rainfall = [], [], [], []  # initialize empty lists to track
    t_washoff, t_buildup, t_sweep = 0, 0, 0  # initialize totals
    total_buildup, total_washoff, total_swept = [], [], []  # initialize empty lists to track totals
    daterange = pd.date_range(start=startdate, end=enddate, freq='D')
    rain_in = get_meteostat_daily(startdate, enddate)
    t = 0  # time step

    rain_threshold = user_input # threshold for rain to trigger sweeping event

    for i in range(len(daterange)):

        if rain_in[i] > 0:
            W_i = washoff_function(acc_i, C3, C4, rain_in[i]) # calculate washoff
            t_washoff += W_i  # total washoff
            acc_i = max(0, acc_i - W_i) # update accumulation after washoff
            t = solve_for_t(acc_i, C1, C2, road_length)
            S_i = 0
        elif i + 1 < len(daterange) and rain_in[i + 1] >= rain_threshold:
            S_i = acc_i * rem_eff # calculate swept
            t_sweep += S_i  # total swept
            acc_i = max(0, acc_i - S_i) # update accumulation after sweeping
            W_i = 0
            t = solve_for_t(acc_i, C1, C2, road_length)
        else:
            t += 1
            B_i = buildup_function(acc_i, t, C1, C2, road_length) # calculate buildup
            t_buildup += B_i  # accumulate buildup
            acc_i = max(0, acc_i + B_i) # update accumulation after buildup
            S_i = 0
            W_i = 0

        accumulation.append(round(acc_i, 2))
        washoff.append(round(W_i, 2))
        swept.append(round(S_i, 2))
        total_washoff.append(round(t_washoff, 2))
        total_buildup.append(round(t_buildup, 2))
        total_swept.append(round(t_sweep, 2))
        rainfall.append(round(rain_in[i], 2))

    df = pd.DataFrame({'Date': daterange, 'Accumulation': accumulation, 'Washoff': washoff, 'Swept': swept,
                       'Total Buildup': total_buildup, 'Total Washoff': total_washoff, 'Total Swept': total_swept,
                       'Rainfall': rainfall})
    return df

def AccumulationModule(startdate, enddate, acc_i, params, road_length, user_input, rem_eff):

    C1, C2, C3, C4 = params[0], params[1], params[2], params[3]
    accumulation, washoff, swept, rainfall = [], [], [], []  # initialize empty lists to track
    t_washoff, t_buildup, t_sweep = 0, 0, 0  # initialize totals
    total_buildup, total_washoff, total_swept = [], [], []  # initialize empty lists to track totals
    daterange = pd.date_range(start=startdate, end=enddate, freq='D')
    rain_in = get_meteostat_daily(startdate, enddate)
    t = 0  # time step

    accumulation_threshold = C1 * user_input * road_length

    for i in range(len(daterange)):

        if rain_in[i] > 0:
            W_i = washoff_function(acc_i, C3, C4, rain_in[i]) # calculate washoff
            t_washoff += W_i  # total washoff
            acc_i = max(0, acc_i - W_i) # update accumulation after washoff
            t = solve_for_t(acc_i, C1, C2, road_length)
            S_i = 0
        elif acc_i >= accumulation_threshold:
            S_i = acc_i * rem_eff # calculate swept
            t_sweep += S_i  # total swept
            acc_i = max(0, acc_i - S_i) # update accumulation after sweeping
            W_i = 0
            t = solve_for_t(acc_i, C1, C2, road_length)
        else:
            t += 1
            B_i = buildup_function(acc_i, t, C1, C2, road_length) # calculate buildup
            t_buildup += B_i  # accumulate buildup
            acc_i = max(0, acc_i + B_i) # update accumulation after buildup
            S_i = 0
            W_i = 0

        accumulation.append(round(acc_i, 2))
        washoff.append(round(W_i, 2))
        swept.append(round(S_i, 2))
        total_washoff.append(round(t_washoff, 2))
        total_buildup.append(round(t_buildup, 2))
        total_swept.append(round(t_sweep, 2))
        rainfall.append(round(rain_in[i], 2))

    df = pd.DataFrame({'Date': daterange, 'Accumulation': accumulation, 'Washoff': washoff, 'Swept': swept,
                       'Total Buildup': total_buildup, 'Total Washoff': total_washoff, 'Total Swept': total_swept,
                       'Rainfall': rainfall})
    return df

def DefinedIntervalModule(startdate, enddate, acc_i, params, road_length, user_input, rem_eff):

    C1, C2, C3, C4 = params[0], params[1], params[2], params[3]
    accumulation, washoff, swept, rainfall = [], [], [], []  # initialize empty lists to track
    t_washoff, t_buildup, t_sweep = 0, 0, 0  # initialize totals
    total_buildup, total_washoff, total_swept = [], [], []  # initialize empty lists to track totals
    daterange = pd.date_range(start=startdate, end=enddate, freq='D')
    rain_in = get_meteostat_daily(startdate, enddate)
    t = 0  # time step

    sweeping_indices = [i for i in range(len(daterange)) if i % user_input == 0]  # every defined interval days

    for i in range(len(daterange)):

        if rain_in[i] > 0:
            W_i = washoff_function(acc_i, C3, C4, rain_in[i]) # calculate washoff
            t_washoff += W_i  # total washoff
            acc_i = max(0, acc_i - W_i) # update accumulation after washoff
            t = solve_for_t(acc_i, C1, C2, road_length)
            S_i = 0
        elif i in sweeping_indices:
            S_i = acc_i * rem_eff # calculate swept
            t_sweep += S_i  # total swept
            acc_i = max(0, acc_i - S_i) # update accumulation after sweeping
            W_i = 0
            t = solve_for_t(acc_i, C1, C2, road_length)
        else:
            t += 1
            B_i = buildup_function(acc_i, t, C1, C2, road_length) # calculate buildup
            t_buildup += B_i  # accumulate buildup
            acc_i = max(0, acc_i + B_i) # update accumulation after buildup
            S_i = 0
            W_i = 0

        accumulation.append(round(acc_i, 2))
        washoff.append(round(W_i, 2))
        swept.append(round(S_i, 2))
        total_washoff.append(round(t_washoff, 2))
        total_buildup.append(round(t_buildup, 2))
        total_swept.append(round(t_sweep, 2))
        rainfall.append(round(rain_in[i], 2))

    df = pd.DataFrame({'Date': daterange, 'Accumulation': accumulation, 'Washoff': washoff, 'Swept': swept,
                       'Total Buildup': total_buildup, 'Total Washoff': total_washoff, 'Total Swept': total_swept,
                       'Rainfall': rainfall})
    return df

def UnscheduledModule(startdate, enddate, acc_i, params, road_length, user_input, rem_eff):

    C1, C2, C3, C4 = params[0], params[1], params[2], params[3]
    accumulation, washoff, swept, rainfall = [], [], [], []  # initialize empty lists to track
    t_washoff, t_buildup, t_sweep = 0, 0, 0  # initialize totals
    total_buildup, total_washoff, total_swept = [], [], []  # initialize empty lists to track totals
    daterange = pd.date_range(start=startdate, end=enddate, freq='D')
    rain_in = get_meteostat_daily(startdate, enddate)
    t = 0  # time step

    random_sweeps = random.sample(range(len(daterange)), user_input)  # random sweep days

    for i in range(len(daterange)):

        if rain_in[i] > 0:
            W_i = washoff_function(acc_i, C3, C4, rain_in[i]) # calculate washoff
            t_washoff += W_i  # total washoff
            acc_i = max(0, acc_i - W_i) # update accumulation after washoff
            t = solve_for_t(acc_i, C1, C2, road_length)
            S_i = 0
        elif i in random_sweeps:
            S_i = acc_i * rem_eff # calculate swept
            t_sweep += S_i  # total swept
            acc_i = max(0, acc_i - S_i) # update accumulation after sweeping
            W_i = 0
            t = solve_for_t(acc_i, C1, C2, road_length)
        else:
            t += 1
            B_i = buildup_function(acc_i, t, C1, C2, road_length) # calculate buildup
            t_buildup += B_i  # accumulate buildup
            acc_i = max(0, acc_i + B_i) # update accumulation after buildup
            S_i = 0
            W_i = 0

        accumulation.append(round(acc_i, 2))
        washoff.append(round(W_i, 2))
        swept.append(round(S_i, 2))
        total_washoff.append(round(t_washoff, 2))
        total_buildup.append(round(t_buildup, 2))
        total_swept.append(round(t_sweep, 2))
        rainfall.append(round(rain_in[i], 2))

    df = pd.DataFrame({'Date': daterange, 'Accumulation': accumulation, 'Washoff': washoff, 'Swept': swept,
                       'Total Buildup': total_buildup, 'Total Washoff': total_washoff, 'Total Swept': total_swept,
                       'Rainfall': rainfall})
    return df

def simulate_plotting(df, path):
    # PLOTTING!
    fig, ax = plt.subplots(figsize=(10, 4))

    ax.set_facecolor('whitesmoke')
    ax.plot(df['Date'], df['Accumulation'], label='Buildup', color='darkolivegreen', zorder=1)
    ax.bar(df['Date'], df['Washoff'], label='Washoff', color='cornflowerblue', zorder=2)
    ax.bar(df['Date'], df['Swept'], label='Swept', color='indianred', zorder=3)
    # ax.plot(df['Date'], df['Total Buildup'], label='Total Buildup', color='green')
    # ax.plot(df['Date'], df['Total Washoff'], label='Total Washoff', color='blue')
    # ax.plot(df['Date'], df['Total Swept'], label='Total Swept', color='red')

    # Formatting
    ax.set_xlim(pd.Timestamp(df['Date'].iloc[0]), pd.Timestamp(df['Date'].iloc[-1]))
    ax.xaxis.set_major_formatter(mdates.DateFormatter('%B'))
    ax.xaxis.set_major_locator(mdates.DayLocator(bymonthday=15))
    ax.set_ylabel("Pounds")
    ax.legend(loc='lower center', bbox_to_anchor=(0.5, 1.02), ncol=3, frameon=False)
    ax.spines['bottom'].set_zorder(10)
    ax.spines['bottom'].set_zorder(10)

    plt.tight_layout()
    plt.savefig(path)

def summarize_sweeping_module(df, road_length_ft, sweeping_cost):
    total_buildup = df['Total Buildup'].iloc[-1] # pounds
    total_washoff = df['Total Washoff'].iloc[-1] # pounds
    total_swept = df['Total Swept'].iloc[-1] # pounds
    total_rainfall = df['Rainfall'].sum() # inches
    num_sweeps = df[df['Swept'] > 0].shape[0] # number of sweeps
    miles_swept = num_sweeps * (road_length_ft / 5280)  # miles
    total_cost = miles_swept * sweeping_cost # dollars
    cost_efficiency = total_swept / total_cost if total_cost > 0 else 0 # pounds per dollar

    summary = {
        'Total Buildup (lbs)': total_buildup,
        'Total Washoff (lbs)': total_washoff,
        'Total Swept (lbs)': total_swept,
        'Total Rainfall (inches)': total_rainfall,
        'Number of Sweeps': num_sweeps,
        'Miles Swept': round(miles_swept, 2),
        'Total Cost ($)': round(total_cost, 2),
        'Cost Efficiency (lbs/$)': round(cost_efficiency, 2)
    }
    return summary


