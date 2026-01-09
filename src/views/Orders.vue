<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { orders } from '@/mocks/orders'
import type { OrderStatus } from '@/mocks/orders'
import OrderStatusBadge from '@/components/OrderStatusBadge.vue'

const router = useRouter()
const allOrders = ref(orders)
const selectedStatus = ref<OrderStatus | 'ALL'>('ALL')

const filteredOrders = computed(() => {
  if (selectedStatus.value === 'ALL') {
    return allOrders.value
  }
  return allOrders.value.filter((order) => order.status === selectedStatus.value)
})

const formatDate = (timestamp: string) => {
  return new Date(timestamp).toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
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

const goToOrderDetail = (orderId: string) => {
  router.push(`/orders/${orderId}`)
}

const goToCreateOrder = () => {
  router.push('/orders/new')
}
</script>

<template>
  <div class="min-h-screen bg-bg p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-text mb-2">Orders</h1>
          <p class="text-text-soft">Manage all orders</p>
        </div>
        <button
          @click="goToCreateOrder"
          class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover transition-colors font-medium"
        >
          + Create Order
        </button>
      </div>

      <!-- Filters -->
      <div class="bg-surface border border-border rounded-lg p-4 mb-6">
        <div class="flex items-center gap-3 flex-wrap">
          <span class="text-text-soft text-sm font-medium">Filter by Status:</span>
          <button
            @click="selectedStatus = 'ALL'"
            :class="[
              'px-3 py-1 rounded-md text-sm font-medium transition-colors',
              selectedStatus === 'ALL'
                ? 'bg-primary text-white'
                : 'bg-bg text-text-soft hover:text-text',
            ]"
          >
            All
          </button>
          <button
            @click="selectedStatus = 'DRAFT'"
            :class="[
              'px-3 py-1 rounded-md text-sm font-medium transition-colors',
              selectedStatus === 'DRAFT'
                ? 'bg-primary text-white'
                : 'bg-bg text-text-soft hover:text-text',
            ]"
          >
            Draft
          </button>
          <button
            @click="selectedStatus = 'SUBMITTED'"
            :class="[
              'px-3 py-1 rounded-md text-sm font-medium transition-colors',
              selectedStatus === 'SUBMITTED'
                ? 'bg-primary text-white'
                : 'bg-bg text-text-soft hover:text-text',
            ]"
          >
            Submitted
          </button>
          <button
            @click="selectedStatus = 'APPROVED'"
            :class="[
              'px-3 py-1 rounded-md text-sm font-medium transition-colors',
              selectedStatus === 'APPROVED'
                ? 'bg-primary text-white'
                : 'bg-bg text-text-soft hover:text-text',
            ]"
          >
            Approved
          </button>
          <button
            @click="selectedStatus = 'COMPLETED'"
            :class="[
              'px-3 py-1 rounded-md text-sm font-medium transition-colors',
              selectedStatus === 'COMPLETED'
                ? 'bg-primary text-white'
                : 'bg-bg text-text-soft hover:text-text',
            ]"
          >
            Completed
          </button>
          <button
            @click="selectedStatus = 'CANCELLED'"
            :class="[
              'px-3 py-1 rounded-md text-sm font-medium transition-colors',
              selectedStatus === 'CANCELLED'
                ? 'bg-primary text-white'
                : 'bg-bg text-text-soft hover:text-text',
            ]"
          >
            Cancelled
          </button>
        </div>
      </div>

      <!-- Orders Table -->
      <div class="bg-surface border border-border rounded-lg overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-bg border-b border-border">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-text-soft uppercase tracking-wider">
                  Order ID
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-text-soft uppercase tracking-wider">
                  Date
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-text-soft uppercase tracking-wider">
                  Created By
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-text-soft uppercase tracking-wider">
                  Items
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-text-soft uppercase tracking-wider">
                  Total
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-text-soft uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border">
              <tr
                v-for="order in filteredOrders"
                :key="order.id"
                @click="goToOrderDetail(order.id)"
                class="hover:bg-bg cursor-pointer transition-colors"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="text-sm font-medium text-primary">{{ order.id }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="text-sm text-text-soft">{{ formatDate(order.createdAt) }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div class="text-sm text-text">{{ order.createdBy }}</div>
                    <div class="text-xs text-text-soft">{{ order.createdByRole }}</div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="text-sm text-text">{{ order.totalItems }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="text-sm font-medium text-text">{{ formatCurrency(order.totalAmount) }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <OrderStatusBadge :status="order.status" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div v-if="filteredOrders.length === 0" class="text-center py-12">
          <p class="text-text-soft">No orders found</p>
        </div>
      </div>
    </div>
  </div>
</template>
