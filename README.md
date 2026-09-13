# FastForward Logistics Dashboard

A single-page operations dashboard for FastForward Logistics, built with Vue 3, TypeScript, Vuetify, and Chart.js. The dashboard gives leadership a quick read on operational performance across shipment volume, on-time delivery, regional carryover performance, and exception tracking.

## Project purpose

This app was created to replace spreadsheet-heavy status reviews with a cleaner executive view for the VP of Operations. It consolidates key operational KPIs into a compact dashboard where users can:

- review the latest month or year-to-date performance
- filter all cards and charts by month using the app bar selector
- compare values against the previous month
- monitor shipment flow and service reliability at a glance

## Business brief

FastForward Logistics is a mid-size freight and supply chain company. The dashboard highlights four core operational metrics:

- Shipment Volume
- On-time Delivery Rate
- Regional Performance
- Open Exceptions

The view is designed for internal leadership meetings and operational reporting, with a clean, executive-style layout and a dark theme by default.

## Features

- App bar with dashboard title and month picker
- KPI cards for the four primary logistics metrics
- Month-based filtering across summary cards and charts
- Year view when “All months” is selected
- Trend visualization for shipment volume
- Supporting side-by-side charts for delivery rate and regional performance
- Dark mode toggle using an icon button
- Mobile-friendly, responsive Vuetify layout
- Local fake dataset stored in JSON, with no external API dependency

## Tech stack

- Vue 3
- TypeScript
- Vite
- Vuetify 3
- Chart.js via vue-chartjs
- Local JSON dataset

## Data model

The app loads monthly operational data from the local file at src/data/metrics.json.

Each entry includes:

- month
- label
- shipmentVolume
- onTimeDeliveryRate
- regionalPerformance
- openExceptions

The dataset contains 12 months of 2025 data, with values designed to trend upward while reflecting realistic seasonal variation.

## Dashboard layout

The UI is organized as a single-page dashboard:

1. App bar with company name and month selector
2. Four summary cards below the header
3. Two side-by-side charts below the KPI cards
4. Full-width shipment volume trend chart at the bottom of the main content area

## Project structure

```text
lesson_eight/
├─ PLAN.md
├─ README.md
├─ index.html
├─ package.json
├─ public/
├─ src/
│  ├─ App.vue
│  ├─ main.ts
│  ├─ style.css
│  ├─ data/
│  │  └─ metrics.json
│  └─ plugins/
│     └─ vuetify.ts
├─ tsconfig.json
├─ tsconfig.app.json
├─ tsconfig.node.json
├─ vite.config.ts
├─ node_modules/
└─ dist/
```

## Getting started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Notes

- The project uses a local JSON dataset rather than a backend or API service.
- The default theme is dark, with a manually toggled light/dark icon control in the app bar.
- The month selector filters all relevant cards and charts, making the dashboard act as a single operational control point.
- This is designed as a lightweight internal analytics page rather than a multi-page application.

## Completion status

The project is implemented and runs as a Vue dashboard app for FastForward Logistics operational reporting.
