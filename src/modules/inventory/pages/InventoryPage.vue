<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useInventory } from '../hooks/useInventory'
import StockInModal from '../components/StockInModal.vue'
import StockOutModal from '../components/StockOutModal.vue'
import StockAdjustModal from '../components/StockAdjustModal.vue'
import type { StockActionPayload } from '../types/inventory'

const {
  items,
  loading,
  error,
  fetchInventory,
  stockIn,
  stockOut,
  adjustStock
} = useInventory()

const selectedProductId = ref<string | null>(null)
const activeModal = ref<'stock-in' | 'stock-out' | 'adjust' | null>(null)

onMounted(fetchInventory)

const openModal = (productId: string, modalType: 'stock-in' | 'stock-out' | 'adjust') => {
  selectedProductId.value = productId
  activeModal.value = modalType
}

const closeModal = () => {
  selectedProductId.value = null
  activeModal.value = null
}

const handleStockIn = async (payload: StockActionPayload) => {
  try {
    await stockIn(payload)
    closeModal()
  } catch (e: any) {
    alert(`Error: ${e.message}`)
  }
}

const handleStockOut = async (payload: StockActionPayload) => {
  try {
    await stockOut(payload)
    closeModal()
  } catch (e: any) {
    alert(`Error: ${e.message}`)
  }
}

const handleAdjustStock = async (payload: StockActionPayload) => {
  try {
    await adjustStock(payload)
    closeModal()
  } catch (e: any) {
    alert(`Error: ${e.message}`)
  }
}
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-semibold mb-6">Inventory Management</h1>

    <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
      {{ error }}
    </div>

    <div v-if="loading" class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      <p class="mt-2 text-gray-600">Loading inventory...</p>
    </div>

    <div v-else class="bg-white rounded-lg shadow overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-50 border-b">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">On Hand</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Reserved</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Available</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>

        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="item in items" :key="item.product_id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {{ item.sku }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ item.name }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
              {{ item.on_hand }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
              {{ item.reserved }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold" :class="{
              'text-green-600': item.available > 10,
              'text-yellow-600': item.available > 0 && item.available <= 10,
              'text-red-600': item.available <= 0
            }">
              {{ item.available }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div class="flex justify-end space-x-2">
                <button 
                  @click="openModal(item.product_id, 'stock-in')"
                  class="text-blue-600 hover:text-blue-900 px-3 py-1 rounded border border-blue-300 hover:bg-blue-50"
                >
                  Stock In
                </button>
                <button 
                  @click="openModal(item.product_id, 'stock-out')"
                  class="text-red-600 hover:text-red-900 px-3 py-1 rounded border border-red-300 hover:bg-red-50"
                >
                  Stock Out
                </button>
                <button 
                  @click="openModal(item.product_id, 'adjust')"
                  class="text-yellow-600 hover:text-yellow-900 px-3 py-1 rounded border border-yellow-300 hover:bg-yellow-50"
                >
                  Adjust
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="items.length === 0" class="text-center py-12">
        <p class="text-gray-500">No inventory items found</p>
      </div>
    </div>

    <StockInModal
      v-if="selectedProductId && activeModal === 'stock-in'"
      :productId="selectedProductId"
      @submit="handleStockIn"
      @close="closeModal"
    />

    <StockOutModal
      v-if="selectedProductId && activeModal === 'stock-out'"
      :productId="selectedProductId"
      @submit="handleStockOut"
      @close="closeModal"
    />

    <StockAdjustModal
      v-if="selectedProductId && activeModal === 'adjust'"
      :productId="selectedProductId"
      @submit="handleAdjustStock"
      @close="closeModal"
    />
  </div>
</template>
