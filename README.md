# TTC Transit Delay Analysis (2023–2025)

Where, when and why do TTC subways, streetcars and buses get delayed? This project combines the three delay datasets the TTC publishes separately on the Toronto Open Data Portal, covering January 2023 to January 2025, and compares the modes side by side. It was the final project for DS8007 (Advanced Data Visualization) at Toronto Metropolitan University.

The full write-up with all charts is in [`Project Report.pdf`](Project%20Report.pdf).

## What I found

The causes differ by mode. Bus delays are mostly mechanical, followed by operator and security incidents. Streetcars have a wider mix that includes track and overhead problems. Subway delays are mostly about passengers: disorderly patrons and false alarms.

Subways are by far the most reliable. More than 60% of subway records report no delay or gap at all, and when there is one the gap is usually around 10 minutes. Bus and streetcar delays cluster at round numbers (10, 15, 20 minutes), which suggests they are estimated by hand rather than measured, and gaps of around 20 minutes are common.

Location matters. Bloor station has the most subway incidents, and three of the next four are end-of-line stations (Kennedy, Kipling and Finch). Yorkdale has fewer incidents but long delays when they happen. Spadina is the streetcar outlier. Every top bus hotspot is a subway station with a bus terminal. The two bus routes with the most incidents, 32 Eglinton West and 36 Finch West, run along the corridors that Lines 5 and 6 are being built to serve.

The Scarborough RT, closed in July 2023, had few incidents but the longest average delays of any line, consistent with the reliability problems behind its shutdown.

Timing differs too. Bus and streetcar incidents peak in the afternoon rush around 15:00 to 16:00. Subway incidents are highest between 7 and 9 a.m. and again around 10 p.m. Security incidents on surface routes peak around 5 a.m., before full service begins.

## Data quality

The station and line fields are free text. The subway data originally had 658 distinct station names for a system with about 70 stations, so a large part of the work was mapping these back to real stations. Because the names cannot be matched reliably to station coordinates, the delays could not be put on a map. The report recommends dropdown fields at data entry and automatic delay logging.

## Visual design

Subway charts use the official TTC line colours. Bubble scatter plots show incident count, average delay and service gap together for each station and route. Radial charts show incidents by hour, coloured by average service gap (delay and gap are correlated at 0.95 to 0.96, so only gap is shown). Extreme values were capped so a few multi-hour delays do not flatten everything else.

## Repository layout

```
Datasets/          raw TTC delay data by mode and year, plus GTFS routes and stops
cleaned_data/      cleaned and standardized tables
Plots/             all generated charts
project_code.ipynb cleaning, analysis and plotting
Project Report.pdf final report
requirements.txt
```

To reproduce, install the requirements and run `project_code.ipynb` from the repository root.

Data: Toronto Transit Commission, via the City of Toronto Open Data Portal. License: MIT (see `LICENSE`).
