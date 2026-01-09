<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { orders } from '@/mocks/orders'
import type { Order } from '@/mocks/orders'
import OrderStatusBadge from '@/components/OrderStatusBadge.vue'
import OrderTimeline from '@/components/OrderTimeline.vue'
import OrderActionBar from '@/components/OrderActionBar.vue'

const route = useRoute()
const router = useRouter()
const orderId = route.params.id as string
const userRole = ref<'OWNER' | 'STAFF'>('OWNER') // Mock role

const order = ref<Order | undefined>(orders.find((o) => o.id === orderId))

const formatDate = (timestamp: string) => {
  return new Date(timestamp).toLocaleString('id-ID', {
    day: '2-digit',
    month: 'long',
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

const totalAmount = computed(() => {
  if (!order.value) return 0
  return order.value.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
})

const handleSave = () => {
  alert('Save Draft (dummy action)')
}

const handleSubmit = () => {
  alert('Submit for Approval (dummy action)')
  if (order.value) {
    order.value.status = 'SUBMITTED'
  }
}

const handleApprove = () => {
  alert('Order Approved (dummy action)')
  if (order.value) {
    order.value.status = 'APPROVED'
  }
}

const handleComplete = () => {
  alert('Order Completed (dummy action)')
  if (order.value) {
    order.value.status = 'COMPLETED'
  }
}

const handleCancel = () => {
  if (confirm('Are you sure you want to cancel this order?')) {
    alert('Order Cancelled (dummy action)')
    if (order.value) {
      order.value.status = 'CANCELLED'
    }
  }
}

const goBack = () => {
  router.push('/orders')
}
</script>

<template>
  <div class="min-h-screen bg-bg p-6">
    <div class="max-w-5xl mx-auto">
      <!-- Back Button -->
      <button
        @click="goBack"
        class="mb-6 text-text-soft hover:text-text transition-colors flex items-center gap-2"
      >
        <span>←</span>
        <span>Back to Orders</span>
      </button>

      <div v-if="!order" class="bg-surface border border-border rounded-lg p-8 text-center">
        <p class="text-text-soft">Order not found</p>
      </div>

      <div v-else class="space-y-6">
        <!-- Header -->
        <div class="bg-surface border border-border rounded-lg p-6">
          <div class="flex items-start justify-between mb-4">
            <div>
              <h1 class="text-3xl font-bold text-text mb-2">{{ order.id }}</h1>
              <p class="text-text-soft">Created by {{ order.createdBy }} ({{ order.createdByRole }})</p>
              <p class="text-text-soft text-sm">{{ formatDate(order.createdAt) }}</p>
            </div>
            <OrderStatusBadge :status="order.status" />
          </div>

          <!-- Action Bar -->
          <div class="pt-4 border-t border-border">
            <OrderActionBar
              :status="order.status"
              :role="userRole"
              @save="handleSave"
              @submit="handleSubmit"
              @approve="handleApprove"
              @complete="handleComplete"
              @cancel="handleCancel"
            />
          </div>
        </div>

        <!-- Order Items -->
        <div class="bg-surface border border-border rounded-lg p-6">
          <h2 class="text-xl font-semibold text-text mb-4">Order Items</h2>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-bg border-b border-border">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium text-text-soft uppercase">
                    Product
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-text-soft uppercase">
                    SKU
                  </th>
                  <th class="px-4 py-3 text-right text-xs font-medium text-text-soft uppercase">
                    Qty
                  </th>
                  <th class="px-4 py-3 text-right text-xs font-medium text-text-soft uppercase">
                    Price
                  </th>
                  <th class="px-4 py-3 text-right text-xs font-medium text-text-soft uppercase">
                    Subtotal
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-border">
                <tr v-for="item in order.items" :key="item.id">
                  <td class="px-4 py-3 text-sm text-text">{{ item.productName }}</td>
                  <td class="px-4 py-3 text-sm text-text-soft">{{ item.sku }}</td>
                  <td class="px-4 py-3 text-sm text-text text-right">{{ item.quantity }}</td>
                  <td class="px-4 py-3 text-sm text-text text-right">{{ formatCurrency(item.price) }}</td>
                  <td class="px-4 py-3 text-sm text-text font-medium text-right">
                    {{ formatCurrency(item.price * item.quantity) }}
                  </td>
                </tr>
              </tbody>
              <tfoot class="bg-bg border-t-2 border-border">
                <tr>
                  <td colspan="4" class="px-4 py-3 text-right text-sm font-semibold text-text">
                    Total:
                  </td>
                  <td class="px-4 py-3 text-right text-lg font-bold text-primary">
                    {{ formatCurrency(totalAmount) }}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <!-- Notes -->
        <div v-if="order.notes" class="bg-surface border border-border rounded-lg p-6">
          <h3 class="text-lg font-semibold text-text mb-2">Notes</h3>
          <p class="text-text-soft">{{ order.notes }}</p>
        </div>

        <!-- Timeline -->
        <div class="bg-surface border border-border rounded-lg p-6">
          <OrderTimeline :history="order.statusHistory" />
        </div>
      </div>
    </div>
  </div>
</template>
