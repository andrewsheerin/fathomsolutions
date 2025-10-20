from simulate_functions import *
from pprint import pprint
# Simulation parameters

# Roads
road = 'DATA/OneSweepingSegment.shp'

# Read the shapefile
road_gdf = gpd.read_file(road)
road_length = road_gdf['geometry'].length.sum()  # in meters
road_length_ft = road_length * 3.28084  # convert to feet
road_length_miles = road_length_ft / 5280  # convert to miles
sweeping_cost = 100  # cost per mile

print(f"Road length: {round(road_length_miles, 2)} miles")

# Parameters
params = {'Residential': {'Bmax': 0.62, 'Kb': 0.66},
          'Commercial': {'Bmax': 0.78, 'Kb': 0.90},
          'Forest': {'Bmax': 0.64, 'Kb': 1.0},
          'Other': {'Bmax': 0.67, 'Kb': 0.86},
          'C3': 3.37,
          'C4': 2.38}


params = {
    'C1': 0.67,  # buildup coefficient
    'C2': 0.86,  # buildup rate
    'C3': 3.37,  # washoff coefficient
    'C4': 2.38   # washoff exponent
}

C1 = params['C1']
C2 = params['C2']
C3 = params['C3']
C4 = params['C4']

rem_eff = 0.8 # sweeping removal efficiency
rain_threshold = 0.8  # threshold for rain to trigger washoff
accumulation_cutoff = 0.95 # accumulation cutoff for washoff
defined_interval = 14 # defined interval for sweeping
unscheduled_sweeping = 5 # number of unscheduled sweeps

startdate = datetime(2023, 3, 1)  # start date
enddate = datetime(2023, 6, 30)  # end date

params = [C1, C2, C3, C4]  # parameters for buildup and washoff functions
df1 = NoSweepingModule(startdate, enddate, 0, [C1, C2, C3, C4], road_length_ft, '', rem_eff)
df2 = RainThresholdModule(startdate, enddate, 0, [C1, C2, C3, C4], road_length_ft, rain_threshold, rem_eff)
# df = AccumulationModule(startdate, enddate, 0, [C1, C2, C3, C4], road_length_ft, accumulation_cutoff, rem_eff)
df3 = DefinedIntervalModule(startdate, enddate, 0, [C1, C2, C3, C4], road_length_ft, defined_interval, rem_eff)
# df = UnscheduledModule(startdate, enddate, 0, [C1, C2, C3, C4], road_length_ft, unscheduled_sweeping, rem_eff)

df1_summary = summarize_sweeping_module(df1, road_length_ft, sweeping_cost)
df2_summary = summarize_sweeping_module(df2, road_length_ft, sweeping_cost)
df3_summary = summarize_sweeping_module(df3, road_length_ft, sweeping_cost)

# Print summaries
print("No Sweeping Module Summary:")
pprint(df1_summary)
print("\nRain Threshold Module Summary:")
pprint(df2_summary)
print("\nDefined Interval Module Summary:")
pprint(df3_summary)


dfs = [df1, df3, df2]
titles = ['Baseline: No sweeping', 'Defined Interval: Sweep every 14 days', 'Rain Threshold: Sweep before >0.8-inch rain event']

# PLOTTING!
fig, ax = plt.subplots(nrows=3, sharex=True, sharey=True, figsize=(10, 6))

for a, df, title in zip(ax, dfs, titles):

    a.plot(df['Date'], df['Accumulation'], label='Buildup', color='darkolivegreen', zorder=1)
    a.bar(df['Date'], df['Washoff'], label='Washoff', color='cornflowerblue', zorder=2)
    a.bar(df['Date'], df['Swept'], label='Swept', color='indianred', zorder=3)

    # Formatting
    a.set_facecolor('whitesmoke')
    a.set_title(title)
    a.set_xlim(pd.Timestamp(startdate), pd.Timestamp(enddate))
    a.xaxis.set_major_formatter(mdates.DateFormatter('%B'))
    a.xaxis.set_major_locator(mdates.DayLocator(bymonthday=15))
    a.set_ylabel("Pounds")
    a.spines['bottom'].set_zorder(10)
    a.spines['bottom'].set_zorder(10)

    if a == ax[0]:
        a.legend(loc='lower center', bbox_to_anchor=(0.5, 1.15), ncol=3, frameon=False)


plt.tight_layout(rect=[0, 0, 1, 0.99])
plt.savefig('sweeping_modules.png', dpi=300)
plt.show()