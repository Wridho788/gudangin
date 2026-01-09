<template>
  <AdminLayout>
    <PageHeader title="Products" subtitle="Manage your product catalog" />

    <!-- Loading State -->
    <LoadingSkeleton v-if="isLoading" :count="8" height="64px" />

    <!-- Empty State -->
    <EmptyState
      v-else-if="!products || products.length === 0"
      :icon="Package"
      title="No products found"
      description="Add products to your catalog"
    />

    <!-- Products Table -->
    <div v-else class="table-container">
      <table class="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>SKU</th>
            <th>Stock</th>
            <th>Min Stock</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in products" :key="product.id">
            <td>
              <span class="font-medium text-slate-900">{{ product.name }}</span>
            </td>
            <td>
              <span class="font-mono text-sm text-slate-600">{{ product.sku }}</span>
            </td>
            <td>
              <span class="font-medium" :class="product.is_low_stock ? 'text-red-600' : 'text-slate-900'">
                {{ product.stock }}
              </span>
            </td>
            <td>
              <span class="text-slate-600">{{ product.min_stock }}</span>
            </td>
            <td>
              <span
                v-if="product.is_low_stock"
                class="badge badge-rejected"
              >
                <AlertTriangle class="w-3 h-3" />
                LOW STOCK
              </span>
              <span v-else class="badge badge-approved">
                <CheckCircle class="w-3 h-3" />
                OK
              </span>
            </td>
            <td>
              <button class="btn-ghost btn text-sm">
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
import { Package, AlertTriangle, CheckCircle, Eye } from 'lucide-vue-next'
import AdminLayout from '../layouts/AdminLayout.vue'
import PageHeader from '../components/ui/PageHeader.vue'
import EmptyState from '../components/ui/EmptyState.vue'
import LoadingSkeleton from '../components/ui/LoadingSkeleton.vue'
import { useProducts } from '../composables/useInventory'

const { data: products, isLoading } = useProducts()
</script>
