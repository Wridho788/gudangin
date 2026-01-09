<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { products } from '@/mocks/products'

const router = useRouter()

interface OrderItem {
  productId: string
  productName: string
  sku: string
  quantity: number
  price: number
}

const selectedProduct = ref<string>('')
const quantity = ref<number>(1)
const orderItems = ref<OrderItem[]>([])
const notes = ref<string>('')

const availableProducts = computed(() => {
  return products.filter((p) => p.stock > 0)
})

const selectedProductDetail = computed(() => {
  return products.find((p) => p.id === selectedProduct.value)
})

const totalAmount = computed(() => {
  return orderItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
})

const totalItems = computed(() => {
  return orderItems.value.reduce((sum, item) => sum + item.quantity, 0)
})

const canAddItem = computed(() => {
  return selectedProduct.value && quantity.value > 0
})

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)
}

const addItem = () => {
  if (!selectedProductDetail.value) return

  const existingItem = orderItems.value.find(
    (item) => item.productId === selectedProduct.value
  )

  if (existingItem) {
    existingItem.quantity += quantity.value
  } else {
    orderItems.value.push({
      productId: selectedProductDetail.value.id,
      productName: selectedProductDetail.value.name,
      sku: selectedProductDetail.value.sku,
      quantity: quantity.value,
      price: selectedProductDetail.value.price,
    })
  }

  // Reset
  selectedProduct.value = ''
  quantity.value = 1
}

const removeItem = (productId: string) => {
  orderItems.value = orderItems.value.filter((item) => item.productId !== productId)
}

const saveDraft = () => {
  if (orderItems.value.length === 0) {
    alert('Please add at least one item')
    return
  }
  alert('Order saved as draft (dummy action)')
  router.push('/orders')
}

const submitOrder = () => {
  if (orderItems.value.length === 0) {
    alert('Please add at least one item')
    return
  }
  alert('Order submitted for approval (dummy action)')
  router.push('/orders')
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

      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-text mb-2">Create New Order</h1>
        <p class="text-text-soft">Add items to create a new order</p>
      </div>

      <!-- Add Item Section -->
      <div class="bg-surface border border-border rounded-lg p-6 mb-6">
        <h2 class="text-xl font-semibold text-text mb-4">Add Item</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-text mb-2">Product</label>
            <select
              v-model="selectedProduct"
              class="w-full px-4 py-2 bg-bg border border-border rounded-md text-text focus:outline-none focus:border-primary"
            >
              <option value="">Select a product</option>
              <option v-for="product in availableProducts" :key="product.id" :value="product.id">
                {{ product.name }} ({{ product.sku }}) - Stock: {{ product.stock }} - {{ formatCurrency(product.price) }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-text mb-2">Quantity</label>
            <input
              v-model.number="quantity"
              type="number"
              min="1"
              :max="selectedProductDetail?.stock"
              class="w-full px-4 py-2 bg-bg border border-border rounded-md text-text focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        <div class="mt-4">
          <button
            @click="addItem"
            :disabled="!canAddItem"
            :class="[
              'px-4 py-2 rounded-md font-medium transition-colors',
              canAddItem
                ? 'bg-primary text-white hover:bg-primary-hover'
                : 'bg-surface text-text-soft cursor-not-allowed',
            ]"
          >
            Add to Order
          </button>
        </div>
      </div>

      <!-- Order Items List -->
      <div class="bg-surface border border-border rounded-lg p-6 mb-6">
        <h2 class="text-xl font-semibold text-text mb-4">Order Items</h2>

        <div v-if="orderItems.length === 0" class="text-center py-8 text-text-soft">
          No items added yet. Start by selecting a product above.
        </div>

        <div v-else class="overflow-x-auto">
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
                <th class="px-4 py-3 text-xs font-medium text-text-soft uppercase">
                  Action
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border">
              <tr v-for="item in orderItems" :key="item.productId">
                <td class="px-4 py-3 text-sm text-text">{{ item.productName }}</td>
                <td class="px-4 py-3 text-sm text-text-soft">{{ item.sku }}</td>
                <td class="px-4 py-3 text-sm text-text text-right">{{ item.quantity }}</td>
                <td class="px-4 py-3 text-sm text-text text-right">{{ formatCurrency(item.price) }}</td>
                <td class="px-4 py-3 text-sm text-text font-medium text-right">
                  {{ formatCurrency(item.price * item.quantity) }}
                </td>
                <td class="px-4 py-3 text-center">
                  <button
                    @click="removeItem(item.productId)"
                    class="text-danger hover:text-danger/80 text-sm font-medium"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            </tbody>
            <tfoot class="bg-bg border-t-2 border-border">
              <tr>
                <td colspan="4" class="px-4 py-3 text-right text-sm font-semibold text-text">
                  Total ({{ totalItems }} items):
                </td>
                <td colspan="2" class="px-4 py-3 text-right text-lg font-bold text-primary">
                  {{ formatCurrency(totalAmount) }}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <!-- Notes -->
      <div class="bg-surface border border-border rounded-lg p-6 mb-6">
        <label class="block text-sm font-medium text-text mb-2">Notes (Optional)</label>
        <textarea
          v-model="notes"
          rows="3"
          placeholder="Add any notes about this order..."
          class="w-full px-4 py-2 bg-bg border border-border rounded-md text-text focus:outline-none focus:border-primary resize-none"
        ></textarea>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-4">
        <button
          @click="saveDraft"
          :disabled="orderItems.length === 0"
          :class="[
            'px-6 py-3 rounded-md font-medium transition-colors',
            orderItems.length > 0
              ? 'bg-surface border border-border text-text hover:bg-border'
              : 'bg-surface text-text-soft cursor-not-allowed',
          ]"
        >
          Save as Draft
        </button>
        <button
          @click="submitOrder"
          :disabled="orderItems.length === 0"
          :class="[
            'px-6 py-3 rounded-md font-medium transition-colors',
            orderItems.length > 0
              ? 'bg-primary text-white hover:bg-primary-hover'
              : 'bg-surface text-text-soft cursor-not-allowed',
          ]"
        >
          Submit for Approval
        </button>
      </div>
    </div>
  </div>
</template>
