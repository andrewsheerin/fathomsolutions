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

# Simulation parameters

# Roads
road = 'DATA/OneSweepingSegement.shp'

# Read the shapefile
road_gdf = gpd.read_file(road)
road_length = road_gdf['geometry'].length.sum()  # in meters
road_length_ft = road_length * 3.28084  # convert to feet

# Parameters
params = {
    'C1': 0.6,  # buildup coefficient
    'C2': 0.2,  # buildup rate
    'C3': 3.2,  # washoff coefficient
    'C4': 2.7  # washoff exponent
}

C1 = params['C1']
C2 = params['C2']
C3 = params['C3']
C4 = params['C4']

rem_eff = 0.8 # sweeping removal efficiency

rain_threshold = 1.0  # threshold for rain to trigger washoff
accumulation_cutoff = 0.95 # accumulation cutoff for washoff
defined_interval = 14 # defined interval for sweeping
unschduled_sweeping = 5 # number of unscheduled sweeps

startdate = datetime(2023, 3, 1)  # start date
enddate = datetime(2023, 6, 30)  # end date

params = [C1, C2, C3, C4]  # parameters for buildup and washoff functions
df = NoSweepingModule(startdate, enddate, 0, [C1, C2, C3, C4], road_length_ft, '', rem_eff)
df = RainThresholdModule(startdate, enddate, 0, [C1, C2, C3, C4], road_length_ft, rain_threshold, rem_eff)
df = AccumulationModule(startdate, enddate, 0, [C1, C2, C3, C4], road_length_ft, accumulation_cutoff, rem_eff)
df = DefinedIntervalModule(startdate, enddate, 0, [C1, C2, C3, C4], road_length_ft, defined_interval, rem_eff)
df = UnscheduledModule(startdate, enddate, 0, [C1, C2, C3, C4], road_length_ft, unschduled_sweeping, rem_eff)
print(df.to_string())

# plot the results
fig, ax = plt.subplots(figsize=(10, 4))

ax.set_facecolor('whitesmoke')
ax.plot(df['Date'], df['Accumulation'], label='Buildup', color='darkolivegreen', zorder=1)
ax.bar(df['Date'], df['Washoff'], label='Washoff', color='cornflowerblue', zorder=2)
ax.bar(df['Date'], df['Swept'], label='Swept', color='indianred', zorder=3)
# ax.plot(df['Date'], df['Total Buildup'], label='Total Buildup', color='green')
# ax.plot(df['Date'], df['Total Washoff'], label='Total Washoff', color='blue')
# ax.plot(df['Date'], df['Total Swept'], label='Total Swept', color='red')

# Formatting
ax.set_xlim(pd.Timestamp(startdate), pd.Timestamp(enddate))
ax.xaxis.set_major_formatter(mdates.DateFormatter('%B'))
ax.xaxis.set_major_locator(mdates.DayLocator(bymonthday=15))
ax.set_ylabel("Pounds")
ax.legend(loc='lower center', bbox_to_anchor=(0.5, 1.02), ncol=3, frameon=False)
ax.spines['bottom'].set_zorder(10)
ax.spines['bottom'].set_zorder(10)

plt.tight_layout()
plt.show()



# Simulation of buildup and washoff for a road segment



''''
dates = pd.date_range(start=startdate, end=enddate, freq='D')
# Initialize lists to store results
buildup_results = []
washoff_results = []
# Run the simulation for each day

for i, t in enumerate(range(len(dates))):
    # Calculate buildup
    B_i = lulc_buildup_function(acc_i, t, params['C1'], params['C2'], road_length_ft)
    buildup_results.append(B_i)

    # Calculate washoff
    if i < len(rain_in):
        W_i = washoff_function(B_i, params, rain_in[i])
        washoff_results.append(W_i)
        acc_i = max(0, B_i - W_i)  # update accumulation
    else:
        washoff_results.append(0)  # no rain means no washoff
        acc_i = B_i
    # Print progress
    if (i + 1) % 30 == 0:
        print(f"Processed {i + 1} days out of {len(dates)}")
# Create a DataFrame to store the results
results_df = pd.DataFrame({
    'Date': dates,
    'Buildup': buildup_results,
    'Washoff': washoff_results
})

# Print the results
print("Simulation results:")
print(results_df)
# Plot the results
plt.figure(figsize=(12, 6))
plt.plot(results_df['Date'], results_df['Buildup'], label='Buildup', color='blue')
plt.plot(results_df['Date'], results_df['Washoff'], label='Washoff', color='orange')
plt.title('Buildup and Washoff Simulation Results')
plt.xlabel('Date')
plt.ylabel('Accumulation (ft)')
plt.xticks(rotation=45)
plt.gca().xaxis.set_major_formatter(mdates.DateFormatter('%m/%d'))
plt.gca().xaxis.set_major_locator(mdates.DayLocator(interval=30))
plt.legend()
plt.tight_layout()
# plt.savefig('DATA/simulation_plot.png', dpi=300)
plt.show()

'''