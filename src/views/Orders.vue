<template>
  <AdminLayout>
    <PageHeader title="Orders" subtitle="Manage and process incoming orders">
      <template #actions>
        <RouterLink to="/orders/new" class="btn-primary">
          <Plus class="w-4 h-4" />
          Create Order
        </RouterLink>
      </template>
    </PageHeader>

    <!-- Filters -->
    <div class="mb-6 flex items-center gap-4">
      <select v-model="filterStatus" class="form-input w-48">
        <option value="">All Status</option>
        <option value="draft">Draft</option>
        <option value="submitted">Submitted</option>
        <option value="approved">Approved</option>
        <option value="completed">Completed</option>
        <option value="rejected">Rejected</option>
      </select>
    </div>

    <!-- Loading State -->
    <LoadingSkeleton v-if="isLoading" :count="8" height="64px" />

    <!-- Empty State -->
    <EmptyState
      v-else-if="!filteredOrders.length"
      :icon="ShoppingCart"
      title="No orders found"
      description="Create your first order to get started"
    >
      <template #action>
        <RouterLink to="/orders/new" class="btn-primary">
          <Plus class="w-4 h-4" />
          Create Order
        </RouterLink>
      </template>
    </EmptyState>

    <!-- Orders Table -->
    <div v-else class="table-container">
      <table class="table">
        <thead>
          <tr>
            <th>Order Number</th>
            <th>Status</th>
            <th>Created By</th>
            <th>Created At</th>
            <th>Items</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in filteredOrders" :key="order.id" @click="goToDetail(order.id)">
            <td>
              <span class="font-medium text-slate-900">{{ order.order_number }}</span>
            </td>
            <td>
              <StatusBadge :status="order.status">
                {{ order.status.toUpperCase() }}
              </StatusBadge>
            </td>
            <td>
              <span class="text-slate-700">{{ order.created_by_name }}</span>
            </td>
            <td>
              <span class="text-slate-600 text-sm">{{ formatDate(order.created_at) }}</span>
            </td>
            <td>
              <span class="text-slate-600">{{ order.items?.length || 0 }} items</span>
            </td>
            <td>
              <button
                @click.stop="goToDetail(order.id)"
                class="btn-ghost btn text-sm"
              >
                <Eye class="w-4 h-4" />
                View
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ShoppingCart, Plus, Eye } from 'lucide-vue-next'
import AdminLayout from '../layouts/AdminLayout.vue'
import PageHeader from '../components/ui/PageHeader.vue'
import StatusBadge from '../components/ui/StatusBadge.vue'
import EmptyState from '../components/ui/EmptyState.vue'
import LoadingSkeleton from '../components/ui/LoadingSkeleton.vue'
import { useOrders } from '../composables/useOrders'

const router = useRouter()
const { data: orders, isLoading } = useOrders()

const filterStatus = ref('')

const filteredOrders = computed(() => {
  if (!orders.value) return []
  if (!filterStatus.value) return orders.value
  return orders.value.filter((o) => o.status === filterStatus.value)
})

function goToDetail(id: string) {
  router.push(`/orders/${id}`)
}

function formatDate(date: string) {
  return new Date(date).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>
