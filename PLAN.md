# My Dashboard - Project Brief

## What is this?
A single-page analytics dashboard showing monthly business metrics.
Think Shopify admin or a simple Google Analytics view.

## Data
Generate a fake dataset as a JSON file (src/data/metrics.json). 
12 months of data (Jan-Dec 2025), each month containing:
- revenue (dollar amount, trending upward with some variation)
- visitors (number, seasonal pattern - higher in summer)
- conversion (percentage, fluctuates between 2-5%)
- orders (number, correlates loosely with visitors)

## Layout (Vuetify)
- v-app-bar at the top with the dashboqrd title and a month picker
- the month picker should default to showing ALL months
- When a specific month is select, all cards and charts filter to that month. When "All" is selected, show the full year
- Below the app bar: a row of 4 summary cards (v-cards) showing the key metrics: revenue, visitors, conversion, orders
- Below that: one full-width area char showing conversions trend
- use v-container, v-row, v-col for responsive grid layout

## Interactions
- Month picker in the app bar filters EVERYTHING - summary cards show that month's number, charts highlight or filter to that month
- When "ALL" is selected, summary cards show yearly totals/averages and charts show all 12 months
- Cards show a small up/down arrow or color indicating change from the previous month

## Style
- dark theme by default (Vuetify dark theme)
- clean, minimal, lots of whitespace
- charts should use a cohesive color palette of greens and blue - not rainbow
- mobile responsive - cards stack on small screens

## Tech
- Vue 3 + TypeScript + Vuetify 3
- Chart.js via vue-chartjs for all charts
- fake data from a local JSON file (no API calls)
- single page - no routing needed for this app