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
  revenue: number
  visitors: number
  conversion: number
  orders: number
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

const currentView = computed(() => {
  if (selectedMonth.value === 'all') {
    return {
      label: '2025 year view',
      values: dataset,
    }
  }

  return {
    label: dataset.find((item) => item.month === selectedMonth.value)?.label ?? 'Selected month',
    values: dataset.filter((item) => item.month === selectedMonth.value),
  }
})

const summaryCards = computed(() => {
  const currentValues = visibleData.value
  const currentIndex = selectedMonth.value === 'all' ? dataset.length - 1 : dataset.findIndex((item) => item.month === selectedMonth.value)
  const compareIndex = selectedMonth.value === 'all' ? dataset.length - 2 : Math.max(0, currentIndex - 1)
  const previousValues = selectedMonth.value === 'all' ? [previousMonth.value] : [dataset[compareIndex]]

  const revenueCurrent = selectedMonth.value === 'all' ? currentValues.reduce((sum, item) => sum + item.revenue, 0) : currentValues[0].revenue
  const visitorsCurrent = selectedMonth.value === 'all' ? currentValues.reduce((sum, item) => sum + item.visitors, 0) : currentValues[0].visitors
  const conversionCurrent = selectedMonth.value === 'all' ? currentValues.reduce((sum, item) => sum + item.conversion, 0) / currentValues.length : currentValues[0].conversion
  const ordersCurrent = selectedMonth.value === 'all' ? currentValues.reduce((sum, item) => sum + item.orders, 0) : currentValues[0].orders

  const revenuePrev = selectedMonth.value === 'all' ? previousValues[0].revenue : dataset[compareIndex]?.revenue ?? revenueCurrent
  const visitorsPrev = selectedMonth.value === 'all' ? previousValues[0].visitors : dataset[compareIndex]?.visitors ?? visitorsCurrent
  const conversionPrev = selectedMonth.value === 'all' ? previousValues[0].conversion : dataset[compareIndex]?.conversion ?? conversionCurrent
  const ordersPrev = selectedMonth.value === 'all' ? previousValues[0].orders : dataset[compareIndex]?.orders ?? ordersCurrent

  const cards = [
    {
      label: 'Revenue',
      value: selectedMonth.value === 'all' ? formatCurrency(revenueCurrent) : formatCurrency(revenueCurrent),
      delta: calculateDelta(revenueCurrent, revenuePrev),
      tone: revenueCurrent >= revenuePrev ? 'success' : 'error',
      icon: revenueCurrent >= revenuePrev ? 'mdi-arrow-up' : 'mdi-arrow-down',
    },
    {
      label: 'Visitors',
      value: selectedMonth.value === 'all' ? formatCompact(visitorsCurrent) : formatCompact(visitorsCurrent),
      delta: calculateDelta(visitorsCurrent, visitorsPrev),
      tone: visitorsCurrent >= visitorsPrev ? 'success' : 'error',
      icon: visitorsCurrent >= visitorsPrev ? 'mdi-arrow-up' : 'mdi-arrow-down',
    },
    {
      label: 'Conversion',
      value: selectedMonth.value === 'all' ? `${(conversionCurrent).toFixed(1)}%` : `${conversionCurrent.toFixed(1)}%`,
      delta: calculateDelta(conversionCurrent, conversionPrev),
      tone: conversionCurrent >= conversionPrev ? 'success' : 'error',
      icon: conversionCurrent >= conversionPrev ? 'mdi-arrow-up' : 'mdi-arrow-down',
    },
    {
      label: 'Orders',
      value: selectedMonth.value === 'all' ? formatCompact(ordersCurrent) : formatCompact(ordersCurrent),
      delta: calculateDelta(ordersCurrent, ordersPrev),
      tone: ordersCurrent >= ordersPrev ? 'success' : 'error',
      icon: ordersCurrent >= ordersPrev ? 'mdi-arrow-up' : 'mdi-arrow-down',
    },
  ]

  return cards
})

const chartLabels = computed(() => visibleData.value.map((item) => item.label))
const chartValues = computed(() => visibleData.value.map((item) => Number(item.conversion.toFixed(2))))

const revenueChartDataset = computed(() => ({
  labels: chartLabels.value,
  datasets: [
    {
      label: 'Monthly revenue',
      data: visibleData.value.map((item) => item.revenue),
      backgroundColor: theme.value === 'dark' ? '#4ade80' : '#16a34a',
      borderRadius: 8,
      borderSkipped: false,
    },
  ],
}))

const visitorsChartDataset = computed(() => ({
  labels: chartLabels.value,
  datasets: [
    {
      label: 'Visitors',
      data: visibleData.value.map((item) => item.visitors),
      borderColor: theme.value === 'dark' ? '#38bdf8' : '#0284c7',
      backgroundColor: 'rgba(56, 189, 248, 0.18)',
      borderWidth: 3,
      pointBackgroundColor: '#38bdf8',
      pointBorderColor: '#e2e8f0',
      pointRadius: 4,
      fill: true,
      tension: 0.35,
    },
  ],
}))

const chartDataset = computed(() => ({
  labels: chartLabels.value,
  datasets: [
    {
      label: 'Conversion',
      data: chartValues.value,
      borderColor: '#4ade80',
      backgroundColor: 'rgba(74, 222, 128, 0.18)',
      borderWidth: 3,
      pointBackgroundColor: chartLabels.value.map((_, index) => {
        if (selectedMonth.value === 'all') return '#8b5cf6'
        return index === 0 ? '#4ade80' : '#38bdf8'
      }),
      pointBorderColor: '#e2e8f0',
      pointRadius: chartLabels.value.map((_, index) => {
        if (selectedMonth.value === 'all') return 4
        return index === 0 ? 6 : 3
      }),
      pointHoverRadius: 6,
      fill: true,
      tension: 0.35,
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

const chartOptions = computed(() => ({
  ...baseChartOptions.value,
  plugins: {
    ...baseChartOptions.value.plugins,
    tooltip: {
      callbacks: {
        label: (context: { parsed: { y: number | null } }) => `${(context.parsed.y ?? 0).toFixed(1)}% conversion`,
      },
    },
  },
  scales: {
    ...baseChartOptions.value.scales,
    y: {
      ...baseChartOptions.value.scales.y,
      beginAtZero: false,
      suggestedMin: 2,
      suggestedMax: 5.5,
      ticks: {
        ...baseChartOptions.value.scales.y.ticks,
        callback: (value: string | number) => `${value}%`,
      },
    },
  },
}))

const revenueChartOptions = computed(() => ({
  ...baseChartOptions.value,
  scales: {
    ...baseChartOptions.value.scales,
    y: {
      ...baseChartOptions.value.scales.y,
      ticks: {
        ...baseChartOptions.value.scales.y.ticks,
        callback: (value: string | number) => `$${Number(value) / 1000}k`,
      },
    },
  },
}))

const visitorsChartOptions = computed(() => ({
  ...baseChartOptions.value,
  scales: {
    ...baseChartOptions.value.scales,
    y: {
      ...baseChartOptions.value.scales.y,
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
    trendUp: diff >= 0,
  }
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

function formatCompact(value: number) {
  return new Intl.NumberFormat('en-US', {
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
          <span class="text-h6 font-weight-medium">Dashboard</span>
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
          <p class="text-overline text-primary mb-2">Overview</p>
          <h1 class="text-h4 font-weight-bold mb-0">{{ currentView.label }}</h1>
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
                <span class="text-h6 font-weight-medium">Monthly revenue</span>
                <v-chip color="primary" variant="tonal" size="small">Revenue</v-chip>
              </v-card-title>

              <v-card-text class="pa-5">
                <div style="height: 300px;">
                  <Bar :data="revenueChartDataset" :options="revenueChartOptions" />
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
                <span class="text-h6 font-weight-medium">Visitors over time</span>
                <v-chip color="primary" variant="tonal" size="small">Traffic</v-chip>
              </v-card-title>

              <v-card-text class="pa-5">
                <div style="height: 300px;">
                  <Line :data="visitorsChartDataset" :options="visitorsChartOptions" />
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
                <span class="text-h6 font-weight-medium">Conversion trend</span>
                <v-chip color="primary" variant="tonal" size="small">{{ selectedMonth === 'all' ? 'Annual view' : 'Selected month' }}</v-chip>
              </v-card-title>

              <v-card-text class="pa-5">
                <div style="height: 350px;">
                  <Line :data="chartDataset" :options="chartOptions" />
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
