<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { dashboardSummary, recentOrders, activityLogs } from '@/mocks/dashboard'
import OrderStatusBadge from '@/components/OrderStatusBadge.vue'

const router = useRouter()
const summary = ref(dashboardSummary)
const orders = ref(recentOrders)
const logs = ref(activityLogs)
const userRole = ref<'OWNER' | 'STAFF'>('OWNER') // Mock role

const formatDate = (timestamp: string) => {
  return new Date(timestamp).toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)
}

const goToOrder = (orderId: string) => {
  router.push(`/orders/${orderId}`)
}
</script>

<template>
  <div class="min-h-screen bg-bg p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-text mb-2">Dashboard</h1>
        <p class="text-text-soft">Snapshot operasional Gudangin ERP</p>
      </div>

      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-surface border border-border rounded-lg p-6">
          <div class="flex items-center justify-between mb-2">
            <p class="text-text-soft text-sm">Total Orders Today</p>
          </div>
          <p class="text-3xl font-bold text-text">{{ summary.totalOrdersToday }}</p>
        </div>

        <div v-if="userRole === 'OWNER'" class="bg-surface border border-border rounded-lg p-6">
          <div class="flex items-center justify-between mb-2">
            <p class="text-text-soft text-sm">Pending Approval</p>
          </div>
          <p class="text-3xl font-bold text-warning">{{ summary.pendingApproval }}</p>
        </div>

        <div class="bg-surface border border-border rounded-lg p-6">
          <div class="flex items-center justify-between mb-2">
            <p class="text-text-soft text-sm">Low Stock</p>
          </div>
          <p class="text-3xl font-bold text-danger">{{ summary.lowStockCount }}</p>
        </div>

        <div class="bg-surface border border-border rounded-lg p-6">
          <div class="flex items-center justify-between mb-2">
            <p class="text-text-soft text-sm">Completed Today</p>
          </div>
          <p class="text-3xl font-bold text-success">{{ summary.completedToday }}</p>
        </div>
      </div>

      <!-- Two Column Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Recent Orders -->
        <div class="bg-surface border border-border rounded-lg p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-semibold text-text">Recent Orders</h2>
            <router-link
              to="/orders"
              class="text-primary hover:text-primary-hover text-sm font-medium"
            >
              View All
            </router-link>
          </div>
          <div class="space-y-3">
            <div
              v-for="order in orders"
              :key="order.id"
              @click="goToOrder(order.id)"
              class="bg-bg border border-border rounded-md p-4 cursor-pointer hover:border-primary transition-colors"
            >
              <div class="flex items-start justify-between mb-2">
                <div>
                  <p class="font-medium text-text">{{ order.id }}</p>
                  <p class="text-sm text-text-soft">by {{ order.createdBy }}</p>
                </div>
                <OrderStatusBadge :status="order.status" />
              </div>
              <div class="flex items-center justify-between text-sm">
                <span class="text-text-soft">{{ order.totalItems }} items</span>
                <span class="text-text font-medium">{{ formatCurrency(order.totalAmount) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Activity Log -->
        <div class="bg-surface border border-border rounded-lg p-6">
          <h2 class="text-xl font-semibold text-text mb-4">Recent Activity</h2>
          <div class="space-y-3">
            <div
              v-for="log in logs.slice(0, 5)"
              :key="log.id"
              class="bg-bg border border-border rounded-md p-4"
            >
              <div class="flex items-start justify-between mb-1">
                <p class="text-sm font-medium text-text">{{ log.action.replace(/_/g, ' ') }}</p>
                <span class="text-xs text-text-soft">{{ formatDate(log.timestamp) }}</span>
              </div>
              <p class="text-sm text-text-soft mb-1">
                {{ log.actor }} ({{ log.role }}) → {{ log.entityId }}
              </p>
              <p v-if="log.notes" class="text-xs text-text-soft italic">{{ log.notes }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
