<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div>
      <label for="name" class="block text-sm font-medium text-slate-700 mb-1">
        Product Name *
      </label>
      <input
        id="name"
        v-model="form.name"
        type="text"
        required
        class="input"
        placeholder="e.g., Laptop Dell XPS 15"
      />
    </div>

    <div>
      <label for="sku" class="block text-sm font-medium text-slate-700 mb-1">
        SKU *
      </label>
      <input
        id="sku"
        v-model="form.sku"
        type="text"
        required
        class="input font-mono"
        placeholder="e.g., LPT-DELL-XPS15"
      />
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div>
        <label for="stock" class="block text-sm font-medium text-slate-700 mb-1">
          Initial Stock *
        </label>
        <input
          id="stock"
          v-model.number="form.stock"
          type="number"
          min="0"
          required
          :disabled="isEdit"
          class="input"
          placeholder="0"
        />
        <p v-if="isEdit" class="text-xs text-slate-500 mt-1">
          Stock cannot be changed directly. Use stock adjustment.
        </p>
      </div>

      <div>
        <label for="min_stock" class="block text-sm font-medium text-slate-700 mb-1">
          Min. Stock *
        </label>
        <input
          id="min_stock"
          v-model.number="form.min_stock"
          type="number"
          min="0"
          required
          class="input"
          placeholder="10"
        />
      </div>
    </div>

    <div class="flex gap-3 pt-4">
      <button type="submit" class="btn-primary" :disabled="isLoading">
        {{ isLoading ? 'Saving...' : (isEdit ? 'Update Product' : 'Create Product') }}
      </button>
      <button type="button" @click="$emit('cancel')" class="btn-secondary">
        Cancel
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Product } from '../types'

interface Props {
  product?: Product | null
  isLoading?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  submit: [data: {
    name: string
    sku: string
    stock: number
    min_stock: number
  }]
  cancel: []
}>()

const isEdit = ref(!!props.product)

const form = ref({
  name: '',
  sku: '',
  stock: 0,
  min_stock: 10,
})

// Populate form when editing
watch(
  () => props.product,
  (product) => {
    if (product) {
      isEdit.value = true
      form.value = {
        name: product.name,
        sku: product.sku,
        stock: product.stock,
        min_stock: product.min_stock,
      }
    }
  },
  { immediate: true }
)

function handleSubmit() {
  emit('submit', form.value)
}
</script>
