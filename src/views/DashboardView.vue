<script setup lang="ts">
import { ref } from 'vue'
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js'
import { Bar, Doughnut, Line } from 'vue-chartjs'

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Filler,
)

const statCards = [
  { label: 'Revenue', value: '$128.4K', trend: '+18.2%', accent: 'teal' },
  { label: 'Orders', value: '3,482', trend: '+9.4%', accent: 'indigo' },
  { label: 'Conversion', value: '5.8%', trend: '+1.3%', accent: 'amber' },
  { label: 'Customers', value: '14,920', trend: '+12.1%', accent: 'deep-purple' },
]

const salesData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
  datasets: [
    {
      label: 'Sales',
      data: [42, 58, 49, 75, 69, 88, 96],
      borderRadius: 8,
      backgroundColor: '#8b5cf6',
      borderColor: '#8b5cf6',
      borderWidth: 2,
      tension: 0.4,
      fill: false,
    },
  ],
}

const trafficData = {
  labels: ['Organic', 'Paid', 'Email', 'Direct', 'Social'],
  datasets: [
    {
      label: 'Traffic Source',
      data: [38, 22, 18, 12, 10],
      backgroundColor: ['#14b8a6', '#6366f1', '#f59e0b', '#ec4899', '#06b6d4'],
      borderWidth: 0,
    },
  ],
}

const engagementData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: 'Engagement',
      data: [28, 34, 32, 56, 42, 61, 58],
      borderColor: '#22c55e',
      backgroundColor: 'rgba(34, 197, 94, 0.18)',
      borderWidth: 3,
      fill: true,
      tension: 0.4,
    },
  ],
}

const recentOrders = ref([
  { id: '#1042', customer: 'Maya Chen', total: '$1,260', status: 'Paid' },
  { id: '#1049', customer: 'Ian Ross', total: '$840', status: 'Processing' },
  { id: '#1056', customer: 'Ava Patel', total: '$2,410', status: 'Paid' },
  { id: '#1061', customer: 'Noah Kim', total: '$560', status: 'Pending' },
])

const activityFeed = ref([
  'New lead from product demo request',
  'Quarterly campaign reached 84% of target',
  'Inventory alert resolved for warehouse B',
  'Support tickets dropped by 14% this week',
])

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: { color: 'rgba(148, 163, 184, 0.12)' },
      ticks: { color: '#64748b' },
    },
    x: {
      grid: { display: false },
      ticks: { color: '#64748b' },
    },
  },
}

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '68%',
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        usePointStyle: true,
        boxWidth: 10,
        color: '#475569',
      },
    },
  },
}
</script>

<template>
  <v-app>
    <v-app-bar color="deep-purple-darken-3" flat>
      <v-app-bar-title>Northstar Dashboard</v-app-bar-title>
      <v-spacer />
      <v-btn variant="text" prepend-icon="mdi-bell-outline">Alerts</v-btn>
      <v-btn variant="flat" color="white" class="text-deep-purple-darken-3">Export</v-btn>
    </v-app-bar>

    <v-main class="dashboard-shell">
      <v-container fluid class="pa-6">
        <div class="d-flex align-center justify-space-between mb-6">
          <div>
            <p class="text-overline text-primary mb-1">Overview</p>
            <h1 class="text-h4 font-weight-bold text-grey-darken-4">Performance snapshot</h1>
          </div>
          <v-btn color="deep-purple-darken-3" prepend-icon="mdi-plus">New report</v-btn>
        </div>

        <v-row>
          <v-col v-for="card in statCards" :key="card.label" cols="12" md="3" sm="6">
            <v-card class="stat-card" rounded="xl" elevation="0">
              <v-card-text class="pa-4">
                <div class="d-flex align-center justify-space-between mb-3">
                  <span class="text-body-2 text-medium-emphasis">{{ card.label }}</span>
                  <v-avatar :color="`${card.accent}-lighten-5`" size="38">
                    <v-icon :color="`${card.accent}`">mdi-trending-up</v-icon>
                  </v-avatar>
                </div>
                <div class="text-h4 font-weight-bold text-grey-darken-4">{{ card.value }}</div>
                <div class="mt-2 d-flex align-center gap-2">
                  <span class="text-caption font-weight-medium text-success">{{ card.trend }}</span>
                  <span class="text-caption text-medium-emphasis">vs last month</span>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <v-row class="mt-2">
          <v-col cols="12" lg="8">
            <v-card class="chart-card" rounded="xl" elevation="0">
              <v-card-title class="d-flex align-center justify-space-between pa-5 pb-0">
                <span class="text-h6 font-weight-bold">Monthly revenue</span>
                <v-chip color="deep-purple-lighten-5" text-color="deep-purple-darken-3" size="small">+14.8%</v-chip>
              </v-card-title>
              <v-card-text class="pa-5 pt-4">
                <div style="height: 320px;">
                  <Bar :data="salesData" :options="chartOptions" />
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" lg="4">
            <v-card class="chart-card" rounded="xl" elevation="0">
              <v-card-title class="pa-5 pb-0 text-h6 font-weight-bold">Traffic sources</v-card-title>
              <v-card-text class="pa-5 pt-4">
                <div style="height: 220px;">
                  <Doughnut :data="trafficData" :options="doughnutOptions" />
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <v-row class="mt-2">
          <v-col cols="12" lg="7">
            <v-card class="chart-card" rounded="xl" elevation="0">
              <v-card-title class="pa-5 pb-0 text-h6 font-weight-bold">Engagement trend</v-card-title>
              <v-card-text class="pa-5 pt-4">
                <div style="height: 280px;">
                  <Line :data="engagementData" :options="chartOptions" />
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" lg="5">
            <v-card class="chart-card" rounded="xl" elevation="0">
              <v-card-title class="pa-5 pb-0 text-h6 font-weight-bold">Recent orders</v-card-title>
              <v-card-text class="pa-0">
                <v-list lines="two" density="comfortable">
                  <v-list-item v-for="order in recentOrders" :key="order.id" class="pa-0 px-4">
                    <template #prepend>
                      <v-avatar color="deep-purple-lighten-5" size="36">
                        <v-icon color="deep-purple-darken-3">mdi-shopping</v-icon>
                      </v-avatar>
                    </template>
                    <v-list-item-title>{{ order.customer }}</v-list-item-title>
                    <v-list-item-subtitle>{{ order.id }}</v-list-item-subtitle>
                    <template #append>
                      <div class="d-flex flex-column align-end">
                        <span class="font-weight-bold text-grey-darken-4">{{ order.total }}</span>
                        <v-chip
                          :color="order.status === 'Paid' ? 'green-lighten-5' : order.status === 'Processing' ? 'amber-lighten-5' : 'blue-lighten-5'"
                          :text-color="order.status === 'Paid' ? 'green-darken-2' : order.status === 'Processing' ? 'amber-darken-2' : 'blue-darken-2'"
                          size="x-small"
                          class="mt-1"
                        >
                          {{ order.status }}
                        </v-chip>
                      </div>
                    </template>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <v-row class="mt-2">
          <v-col cols="12">
            <v-card class="chart-card" rounded="xl" elevation="0">
              <v-card-title class="pa-5 pb-0 text-h6 font-weight-bold">Activity feed</v-card-title>
              <v-card-text class="pa-5 pt-4">
                <v-timeline truncate-line="both" density="compact">
                  <v-timeline-item v-for="item in activityFeed" :key="item" dot-color="deep-purple-lighten-1">
                    <div class="text-body-1 text-grey-darken-3">{{ item }}</div>
                  </v-timeline-item>
                </v-timeline>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
.dashboard-shell {
  background: linear-gradient(180deg, #f7f5ff 0%, #f8fafc 100%);
}

.stat-card {
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(148, 163, 184, 0.12);
}

.chart-card {
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(148, 163, 184, 0.12);
}
</style>
