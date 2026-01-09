<script setup lang="ts">
import { ref } from 'vue'
import { products } from '@/mocks/products'

const allProducts = ref(products)

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)
}
</script>

<template>
  <div class="min-h-screen bg-bg p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-text mb-2">Products</h1>
        <p class="text-text-soft">View all products and stock levels</p>
      </div>

      <!-- Products Table -->
      <div class="bg-surface border border-border rounded-lg overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-bg border-b border-border">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-text-soft uppercase tracking-wider">
                  Product Name
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-text-soft uppercase tracking-wider">
                  SKU
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-text-soft uppercase tracking-wider">
                  Category
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-text-soft uppercase tracking-wider">
                  Stock
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-text-soft uppercase tracking-wider">
                  Price
                </th>
                <th class="px-6 py-3 text-center text-xs font-medium text-text-soft uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border">
              <tr
                v-for="product in allProducts"
                :key="product.id"
                class="hover:bg-bg transition-colors"
              >
                <td class="px-6 py-4">
                  <span class="text-sm font-medium text-text">{{ product.name }}</span>
                </td>
                <td class="px-6 py-4">
                  <span class="text-sm text-text-soft">{{ product.sku }}</span>
                </td>
                <td class="px-6 py-4">
                  <span class="text-sm text-text">{{ product.category }}</span>
                </td>
                <td class="px-6 py-4 text-right">
                  <span
                    :class="[
                      'text-sm font-medium',
                      product.isLowStock ? 'text-danger' : 'text-text',
                    ]"
                  >
                    {{ product.stock }}
                  </span>
                </td>
                <td class="px-6 py-4 text-right">
                  <span class="text-sm font-medium text-text">{{ formatCurrency(product.price) }}</span>
                </td>
                <td class="px-6 py-4 text-center">
                  <span
                    v-if="product.isLowStock"
                    class="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-danger/10 text-danger border border-danger/30"
                  >
                    Low Stock
                  </span>
                  <span
                    v-else-if="product.stock === 0"
                    class="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-surface text-text-soft border border-border"
                  >
                    Out of Stock
                  </span>
                  <span
                    v-else
                    class="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-success/10 text-success border border-success/30"
                  >
                    Available
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Summary -->
      <div class="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-surface border border-border rounded-lg p-6">
          <p class="text-text-soft text-sm mb-1">Total Products</p>
          <p class="text-2xl font-bold text-text">{{ allProducts.length }}</p>
        </div>
        <div class="bg-surface border border-border rounded-lg p-6">
          <p class="text-text-soft text-sm mb-1">Low Stock Items</p>
          <p class="text-2xl font-bold text-danger">
            {{ allProducts.filter((p) => p.isLowStock).length }}
          </p>
        </div>
        <div class="bg-surface border border-border rounded-lg p-6">
          <p class="text-text-soft text-sm mb-1">Out of Stock</p>
          <p class="text-2xl font-bold text-text-soft">
            {{ allProducts.filter((p) => p.stock === 0).length }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
