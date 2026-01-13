<script setup lang="ts">
import { ref } from 'vue'
import type { StockActionPayload } from '../types/inventory'

const props = defineProps<{ productId: string }>()
const emit = defineEmits<{
  (e: 'submit', payload: StockActionPayload): void
  (e: 'close'): void
}>()

const qty = ref(0)
const note = ref('')

const handleSubmit = () => {
  if (qty.value === 0) return
  
  emit('submit', {
    productId: props.productId,
    qty: qty.value,
    note: note.value
  })
  
  // Reset form
  qty.value = 0
  note.value = ''
}
</script>

<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click.self="emit('close')">
    <div class="bg-white rounded-lg p-6 w-full max-w-md">
      <h3 class="text-lg font-semibold mb-4">Stock Adjustment</h3>

      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Adjustment Quantity</label>
          <input 
            type="number" 
            v-model.number="qty" 
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter adjustment (positive or negative)"
          />
          <p class="text-xs text-gray-500 mt-1">Use negative value to decrease, positive to increase</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Reason</label>
          <textarea 
            v-model="note" 
            placeholder="Enter reason for adjustment" 
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div class="flex justify-end space-x-2 mt-6">
        <button 
          @click="emit('close')"
          class="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
        >
          Cancel
        </button>
        <button 
          @click="handleSubmit"
          :disabled="qty === 0"
          class="px-4 py-2 text-white bg-yellow-600 rounded-md hover:bg-yellow-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Submit
        </button>
      </div>
    </div>
  </div>
</template>
