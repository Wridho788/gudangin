<template>
  <AdminLayout>
    <PageHeader
      title="Dashboard"
      subtitle="Overview of your warehouse operations"
    />

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card>
        <template #default>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-slate-600">Total Orders Today</p>
              <p class="text-3xl font-bold text-slate-900 mt-2">
                {{ ordersData?.length || 0 }}
              </p>
            </div>
            <div class="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <ShoppingCart class="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </template>
      </Card>

      <Card v-if="authStore.canApprove">
        <template #default>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-slate-600">Pending Approval</p>
              <p class="text-3xl font-bold text-amber-600 mt-2">
                {{ pendingApproval }}
              </p>
            </div>
            <div class="w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center">
              <Clock class="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </template>
      </Card>

      <Card>
        <template #default>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-slate-600">Low Stock Items</p>
              <p class="text-3xl font-bold text-red-600 mt-2">
                {{ lowStockData?.length || 0 }}
              </p>
            </div>
            <div class="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
              <AlertTriangle class="w-6 h-6 text-red-600" />
            </div>
          </div>
        </template>
      </Card>

      <Card>
        <template #default>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-slate-600">Completed Today</p>
              <p class="text-3xl font-bold text-emerald-600 mt-2">
                {{ completedToday }}
              </p>
            </div>
            <div class="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center">
              <CheckCircle class="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </template>
      </Card>
    </div>

    <!-- Two Column Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Recent Orders -->
      <Card title="Recent Orders">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-slate-900">Recent Orders</h3>
            <RouterLink to="/orders" class="text-sm font-medium text-blue-600 hover:text-blue-700">
              View All
            </RouterLink>
          </div>
        </template>

        <LoadingSkeleton v-if="ordersLoading" :count="5" />
        <EmptyState
          v-else-if="!recentOrders.length"
          :icon="ShoppingCart"
          title="No orders yet"
          description="Create your first order to get started"
        >
          <template #action>
            <RouterLink to="/orders/new" class="btn-primary">
              <Plus class="w-4 h-4" />
              Create Order
            </RouterLink>
          </template>
        </EmptyState>
        <div v-else class="space-y-3">
          <div
            v-for="order in recentOrders"
            :key="order.id"
            @click="router.push(`/orders/${order.id}`)"
            class="p-4 border border-slate-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer"
          >
            <div class="flex items-start justify-between mb-2">
              <div>
                <p class="font-medium text-slate-900">{{ order.order_number }}</p>
                <p class="text-sm text-slate-600">by {{ order.created_by_name }}</p>
              </div>
              <StatusBadge :status="order.status">{{ order.status.toUpperCase() }}</StatusBadge>
            </div>
            <p class="text-xs text-slate-500">{{ formatDate(order.created_at) }}</p>
          </div>
        </div>
      </Card>

      <!-- Low Stock Alert -->
      <Card title="Low Stock Alert">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-slate-900">Low Stock Alert</h3>
            <RouterLink to="/inventory" class="text-sm font-medium text-blue-600 hover:text-blue-700">
              View Inventory
            </RouterLink>
          </div>
        </template>

        <LoadingSkeleton v-if="lowStockLoading" :count="5" />
        <EmptyState
          v-else-if="!lowStockData || lowStockData.length === 0"
          :icon="CheckCircle"
          title="All stock levels healthy"
          description="No products are currently low on stock"
        />
        <div v-else class="space-y-3">
          <div
            v-for="product in lowStockData"
            :key="product.id"
            class="p-4 border border-red-200 bg-red-50 rounded-lg"
          >
            <div class="flex items-start justify-between">
              <div>
                <p class="font-medium text-slate-900">{{ product.name }}</p>
                <p class="text-sm text-slate-600">SKU: {{ product.sku }}</p>
              </div>
              <span class="badge badge-rejected">
                {{ product.stock }} / {{ product.min_stock }}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </div>

    <!-- Recent Activity -->
    <Card title="Recent Activity" class="mt-6">
      <LoadingSkeleton v-if="activityLoading" :count="5" />
      <EmptyState
        v-else-if="!activityData || activityData.length === 0"
        :icon="Activity"
        title="No recent activity"
        description="Activity logs will appear here"
      />
      <div v-else class="space-y-3">
        <div
          v-for="log in activityData"
          :key="log.id"
          class="flex items-start gap-3 p-3 border border-slate-200 rounded-lg"
        >
          <div class="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Activity class="w-4 h-4 text-slate-600" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm text-slate-900">
              <span class="font-medium">{{ log.actor_role }}</span> 
              {{ log.action }} 
              <span class="font-medium">{{ log.entity_type }}</span>
            </p>
            <p class="text-xs text-slate-500 mt-1">{{ formatDate(log.created_at) }}</p>
          </div>
        </div>
      </div>
    </Card>
  </AdminLayout>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  ShoppingCart,
  Clock,
  AlertTriangle,
  CheckCircle,
  Activity,
  Plus,
} from 'lucide-vue-next'
import AdminLayout from '../layouts/AdminLayout.vue'
import PageHeader from '../components/ui/PageHeader.vue'
import Card from '../components/ui/Card.vue'
import StatusBadge from '../components/ui/StatusBadge.vue'
import EmptyState from '../components/ui/EmptyState.vue'
import LoadingSkeleton from '../components/ui/LoadingSkeleton.vue'
import { useOrders } from '../composables/useOrders'
import { useLowStockProducts } from '../composables/useInventory'
import { useActivityLogs } from '../composables/useActivity'
import { useAuthStore } from '../stores/auth.store'

const router = useRouter()
const authStore = useAuthStore()

const { data: ordersData, isLoading: ordersLoading } = useOrders()
const { data: lowStockData, isLoading: lowStockLoading } = useLowStockProducts()
const { data: activityData, isLoading: activityLoading } = useActivityLogs()

const recentOrders = computed(() => ordersData.value?.slice(0, 5) || [])

const pendingApproval = computed(() => {
  return ordersData.value?.filter((o) => o.status === 'submitted').length || 0
})

const completedToday = computed(() => {
  const today = new Date().toDateString()
  return (
    ordersData.value?.filter((o) => {
      return o.status === 'completed' && new Date(o.completed_at || '').toDateString() === today
    }).length || 0
  )
})

function formatDate(date: string) {
  return new Date(date).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>
