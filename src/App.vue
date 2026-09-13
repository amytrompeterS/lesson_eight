<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js'
import { Bar, Line } from 'vue-chartjs'
import metrics from './data/metrics.json'

type MetricMonth = {
  month: string
  label: string
  shipmentVolume: number
  onTimeDeliveryRate: number
  regionalPerformance: number
  openExceptions: number
}

const dataset = metrics as MetricMonth[]

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler)

const selectedMonth = ref('all')
const theme = ref<'dark' | 'light'>('dark')
const isDarkTheme = computed(() => theme.value === 'dark')

const monthOptions = [
  { title: 'All months', value: 'all' },
  ...dataset.map((item) => ({ title: item.label, value: item.month })),
]

const visibleData = computed(() => {
  if (selectedMonth.value === 'all') return dataset
  return dataset.filter((item) => item.month === selectedMonth.value)
})

const previousMonth = computed(() => dataset[dataset.length - 2])

const summaryCards = computed(() => {
  const currentValues = visibleData.value
  const currentIndex = selectedMonth.value === 'all' ? dataset.length - 1 : dataset.findIndex((item) => item.month === selectedMonth.value)
  const compareIndex = selectedMonth.value === 'all' ? dataset.length - 2 : Math.max(0, currentIndex - 1)
  const previousValues = selectedMonth.value === 'all' ? [previousMonth.value] : [dataset[compareIndex]]

  const shipmentVolumeCurrent = selectedMonth.value === 'all'
    ? currentValues.reduce((sum, item) => sum + item.shipmentVolume, 0)
    : currentValues[0].shipmentVolume
  const onTimeCurrent = selectedMonth.value === 'all'
    ? currentValues.reduce((sum, item) => sum + item.onTimeDeliveryRate, 0) / currentValues.length
    : currentValues[0].onTimeDeliveryRate
  const regionalCurrent = selectedMonth.value === 'all'
    ? currentValues.reduce((sum, item) => sum + item.regionalPerformance, 0)
    : currentValues[0].regionalPerformance
  const exceptionsCurrent = selectedMonth.value === 'all'
    ? currentValues.reduce((sum, item) => sum + item.openExceptions, 0)
    : currentValues[0].openExceptions

  const shipmentPrev = selectedMonth.value === 'all' ? previousValues[0].shipmentVolume : dataset[compareIndex]?.shipmentVolume ?? shipmentVolumeCurrent
  const onTimePrev = selectedMonth.value === 'all' ? previousValues[0].onTimeDeliveryRate : dataset[compareIndex]?.onTimeDeliveryRate ?? onTimeCurrent
  const regionalPrev = selectedMonth.value === 'all' ? previousValues[0].regionalPerformance : dataset[compareIndex]?.regionalPerformance ?? regionalCurrent
  const exceptionsPrev = selectedMonth.value === 'all' ? previousValues[0].openExceptions : dataset[compareIndex]?.openExceptions ?? exceptionsCurrent

  return [
    {
      label: 'Shipment Volume',
      value: formatCompact(shipmentVolumeCurrent),
      delta: calculateDelta(shipmentVolumeCurrent, shipmentPrev),
      tone: shipmentVolumeCurrent >= shipmentPrev ? 'success' : 'error',
      icon: shipmentVolumeCurrent >= shipmentPrev ? 'mdi-arrow-up' : 'mdi-arrow-down',
    },
    {
      label: 'On-time Delivery Rate',
      value: `${onTimeCurrent.toFixed(1)}%`,
      delta: calculateDelta(onTimeCurrent, onTimePrev),
      tone: onTimeCurrent >= onTimePrev ? 'success' : 'error',
      icon: onTimeCurrent >= onTimePrev ? 'mdi-arrow-up' : 'mdi-arrow-down',
    },
    {
      label: 'Regional Performance',
      value: formatCurrencyCompact(regionalCurrent),
      delta: calculateDelta(regionalCurrent, regionalPrev),
      tone: regionalCurrent >= regionalPrev ? 'success' : 'error',
      icon: regionalCurrent >= regionalPrev ? 'mdi-arrow-up' : 'mdi-arrow-down',
    },
    {
      label: 'Open Exceptions',
      value: formatCompact(exceptionsCurrent),
      delta: calculateDelta(exceptionsCurrent, exceptionsPrev),
      tone: exceptionsCurrent <= exceptionsPrev ? 'success' : 'error',
      icon: exceptionsCurrent <= exceptionsPrev ? 'mdi-arrow-down' : 'mdi-arrow-up',
    },
  ]
})

const onTimeChartData = computed(() => ({
  labels: visibleData.value.map((item) => item.label),
  datasets: [
    {
      label: 'On-time Delivery Rate',
      data: visibleData.value.map((item) => item.onTimeDeliveryRate),
      backgroundColor: theme.value === 'dark' ? '#34d399' : '#10b981',
      borderRadius: 8,
      borderSkipped: false,
      maxBarThickness: 42,
    },
  ],
}))

const regionalChartData = computed(() => ({
  labels: visibleData.value.map((item) => item.label),
  datasets: [
    {
      label: 'Regional Performance',
      data: visibleData.value.map((item) => item.regionalPerformance),
      borderColor: theme.value === 'dark' ? '#60a5fa' : '#2563eb',
      backgroundColor: 'rgba(96, 165, 250, 0.18)',
      borderWidth: 3,
      fill: true,
      tension: 0.35,
      pointBackgroundColor: '#60a5fa',
      pointRadius: 4,
    },
  ],
}))

const shipmentChartData = computed(() => ({
  labels: visibleData.value.map((item) => item.label),
  datasets: [
    {
      label: 'Shipment Volume',
      data: visibleData.value.map((item) => item.shipmentVolume),
      borderColor: '#4ade80',
      backgroundColor: 'rgba(74, 222, 128, 0.18)',
      borderWidth: 3,
      fill: true,
      tension: 0.35,
      pointBackgroundColor: '#4ade80',
      pointRadius: 4,
    },
  ],
}))

const baseChartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        color: theme.value === 'dark' ? '#cbd5e1' : '#475569',
      },
    },
    y: {
      grid: {
        color: theme.value === 'dark' ? 'rgba(148, 163, 184, 0.12)' : 'rgba(71, 85, 105, 0.12)',
      },
      ticks: {
        color: theme.value === 'dark' ? '#cbd5e1' : '#475569',
      },
    },
  },
}))

const onTimeChartOptions = computed(() => ({
  ...baseChartOptions.value,
  plugins: {
    ...baseChartOptions.value.plugins,
    tooltip: {
      callbacks: {
        label: (context: { parsed: { y: number | null } }) => `${(context.parsed.y ?? 0).toFixed(1)}% on-time`,
      },
    },
  },
  scales: {
    ...baseChartOptions.value.scales,
    y: {
      ...baseChartOptions.value.scales.y,
      beginAtZero: false,
      suggestedMin: 88,
      suggestedMax: 100,
      ticks: {
        ...baseChartOptions.value.scales.y.ticks,
        callback: (value: string | number) => `${value}%`,
      },
    },
  },
}))

const regionalChartOptions = computed(() => ({
  ...baseChartOptions.value,
  plugins: {
    ...baseChartOptions.value.plugins,
    tooltip: {
      callbacks: {
        label: (context: { parsed: { y: number | null } }) => `$${(context.parsed.y ?? 0).toLocaleString()} performance`,
      },
    },
  },
  scales: {
    ...baseChartOptions.value.scales,
    y: {
      ...baseChartOptions.value.scales.y,
      beginAtZero: false,
      ticks: {
        ...baseChartOptions.value.scales.y.ticks,
        callback: (value: string | number) => `$${Number(value) / 1000}k`,
      },
    },
  },
}))

const chartOptions = computed(() => ({
  ...baseChartOptions.value,
  plugins: {
    ...baseChartOptions.value.plugins,
    tooltip: {
      callbacks: {
        label: (context: { parsed: { y: number | null } }) => `${(context.parsed.y ?? 0).toLocaleString()} shipments`,
      },
    },
  },
  scales: {
    ...baseChartOptions.value.scales,
    y: {
      ...baseChartOptions.value.scales.y,
      beginAtZero: false,
      ticks: {
        ...baseChartOptions.value.scales.y.ticks,
        callback: (value: string | number) => `${Number(value) / 1000}k`,
      },
    },
  },
}))

function calculateDelta(current: number, previous: number) {
  const diff = current - previous
  const pct = previous === 0 ? 0 : (diff / previous) * 100
  return {
    value: `${pct >= 0 ? '+' : ''}${pct.toFixed(1)}%`,
    tone: diff >= 0 ? 'success' : 'error',
  }
}

function formatCompact(value: number) {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value)
}

function formatCurrencyCompact(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value)
}
</script>

<template>
  <v-app :theme="theme">
    <v-app-bar :color="theme === 'dark' ? 'surface' : 'white'" flat class="border-b-sm border-surface-variant">
      <v-container class="d-flex align-center px-0" fluid>
        <div class="d-flex align-center flex-grow-1 app-bar-left">
          <v-icon color="primary" size="large" class="ml-2 mr-3">mdi-chart-timeline-variant</v-icon>
          <span class="text-h6 font-weight-medium">FastForward Logistics</span>
        </div>

        <v-btn
          :icon="theme === 'dark' ? 'mdi-weather-night' : 'mdi-weather-sunny'"
          variant="text"
          color="primary"
          class="theme-toggle mr-4"
          @click="theme = theme === 'dark' ? 'light' : 'dark'"
        />

        <v-select
          v-model="selectedMonth"
          :items="monthOptions"
          item-title="title"
          item-value="value"
          variant="outlined"
          hide-details
          density="comfortable"
          class="month-picker"
          color="primary"
          width="180"
          prepend-inner-icon="mdi-calendar"
          :menu-props="{ maxHeight: 260 }"
        />
      </v-container>
    </v-app-bar>

    <v-main :class="isDarkTheme ? 'bg-background' : 'bg-grey-lighten-4'">
      <v-container fluid class="py-8 px-6">
        <div class="mb-6">
          <p class="text-overline text-primary mb-2">Operations overview</p>
          <h1 class="text-h4 font-weight-bold mb-0">
            {{ selectedMonth === 'all' ? '2025 year view' : dataset.find((item) => item.month === selectedMonth)?.label ?? 'Selected month' }}
          </h1>
        </div>

        <v-row class="mb-6">
          <v-col v-for="card in summaryCards" :key="card.label" cols="12" sm="6" md="3">
            <v-card
              :class="isDarkTheme ? 'metric-card metric-card-dark' : 'metric-card metric-card-light'"
              rounded="xl"
              variant="flat"
            >
              <v-card-text class="pa-5">
                <div class="d-flex justify-space-between align-center mb-4">
                  <span class="text-caption text-medium-emphasis">{{ card.label }}</span>
                  <v-icon :color="card.tone === 'success' ? 'success' : 'error'" size="small">
                    {{ card.icon }}
                  </v-icon>
                </div>

                <div class="text-h4 font-weight-bold mb-2">{{ card.value }}</div>

                <div class="d-flex align-center" style="gap: 8px;">
                  <span :class="card.tone === 'success' ? 'text-success' : 'text-error'" class="text-caption font-weight-medium">
                    {{ card.delta.value }}
                  </span>
                  <span class="text-caption text-medium-emphasis">vs previous month</span>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <v-row class="mb-6">
          <v-col cols="12" md="6">
            <v-card
              :class="isDarkTheme ? 'chart-card chart-card-dark' : 'chart-card chart-card-light'"
              rounded="xl"
              variant="flat"
            >
              <v-card-title class="d-flex align-center justify-space-between pb-0 pt-5 px-5">
                <span class="text-h6 font-weight-medium">On-time Delivery Rate</span>
                <v-chip color="primary" variant="tonal" size="small">Delivery</v-chip>
              </v-card-title>

              <v-card-text class="pa-5">
                <div style="height: 280px;">
                  <Bar :data="onTimeChartData" :options="onTimeChartOptions" />
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" md="6">
            <v-card
              :class="isDarkTheme ? 'chart-card chart-card-dark' : 'chart-card chart-card-light'"
              rounded="xl"
              variant="flat"
            >
              <v-card-title class="d-flex align-center justify-space-between pb-0 pt-5 px-5">
                <span class="text-h6 font-weight-medium">Regional Performance</span>
                <v-chip color="primary" variant="tonal" size="small">Region</v-chip>
              </v-card-title>

              <v-card-text class="pa-5">
                <div style="height: 280px;">
                  <Line :data="regionalChartData" :options="regionalChartOptions" />
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <v-card
              :class="isDarkTheme ? 'chart-card chart-card-dark' : 'chart-card chart-card-light'"
              rounded="xl"
              variant="flat"
            >
              <v-card-title class="d-flex align-center justify-space-between pb-0 pt-5 px-5">
                <span class="text-h6 font-weight-medium">Shipment volume trend</span>
                <v-chip color="primary" variant="tonal" size="small">{{ selectedMonth === 'all' ? 'Annual view' : 'Selected month' }}</v-chip>
              </v-card-title>

              <v-card-text class="pa-5">
                <div style="height: 360px;">
                  <Line :data="shipmentChartData" :options="chartOptions" />
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
:deep(.v-app-bar) {
  border-bottom: 1px solid rgba(148, 163, 184, 0.12);
}

:deep(.v-toolbar__content) {
  width: 100%;
}

.app-bar-left {
  margin-left: 8px;
}

.theme-toggle {
  min-width: 120px;
}

.month-picker {
  max-width: 220px;
}

.metric-card {
  border: 1px solid rgba(148, 163, 184, 0.12);
}

.metric-card-dark {
  background: rgba(15, 23, 42, 0.92);
}

.metric-card-light {
  background: rgba(255, 255, 255, 0.96);
}

.chart-card {
  border: 1px solid rgba(148, 163, 184, 0.12);
}

.chart-card-dark {
  background: rgba(15, 23, 42, 0.92);
}

.chart-card-light {
  background: rgba(255, 255, 255, 0.96);
}

.text-success {
  color: #4ade80 !important;
}

.text-error {
  color: #f87171 !important;
}
</style>
