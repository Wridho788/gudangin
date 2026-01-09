<template>
  <AdminLayout>
    <PageHeader title="Create Order" subtitle="Create a new order">
      <template #actions>
        <RouterLink to="/orders" class="btn-secondary">
          <ArrowLeft class="w-4 h-4" />
          Back
        </RouterLink>
      </template>
    </PageHeader>

    <div class="max-w-3xl">
      <Card title="Order Items">
        <div class="space-y-4">
          <div
            v-for="(item, index) in items"
            :key="index"
            class="flex items-start gap-4"
          >
            <div class="flex-1 grid grid-cols-2 gap-4">
              <div class="form-group">
                <label class="form-label">Product</label>
                <select
                  v-model="item.product_id"
                  class="form-input"
                  required
                >
                  <option value="">Select product</option>
                  <option
                    v-for="product in products"
                    :key="product.id"
                    :value="product.id"
                  >
                    {{ product.name }} (Stock: {{ product.stock }})
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">Quantity</label>
                <input
                  v-model.number="item.qty"
                  type="number"
                  class="form-input"
                  min="1"
                  required
                />
              </div>
            </div>

            <button
              @click="removeItem(index)"
              class="btn-ghost mt-7"
              :disabled="items.length === 1"
            >
              <Trash2 class="w-4 h-4 text-red-600" />
            </button>
          </div>

          <button @click="addItem" class="btn-secondary w-full">
            <Plus class="w-4 h-4" />
            Add Item
          </button>
        </div>

        <template #footer>
          <div class="flex items-center justify-end gap-2">
            <RouterLink to="/orders" class="btn-secondary">
              Cancel
            </RouterLink>
            <button
              @click="handleSubmit"
              class="btn-primary"
              :disabled="createMutation.isPending.value || !isValid"
            >
              <Save class="w-4 h-4" />
              {{ createMutation.isPending.value ? 'Creating...' : 'Create Order' }}
            </button>
          </div>
        </template>
      </Card>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, Plus, Trash2, Save } from 'lucide-vue-next'
import AdminLayout from '../layouts/AdminLayout.vue'
import PageHeader from '../components/ui/PageHeader.vue'
import Card from '../components/ui/Card.vue'
import { useProducts } from '../composables/useInventory'
import { useCreateOrder } from '../composables/useOrders'

const router = useRouter()
const { data: products } = useProducts()
const createMutation = useCreateOrder()

const items = ref([
  { product_id: '', qty: 1 },
])

const isValid = computed(() => {
  return items.value.every((item) => item.product_id && item.qty > 0)
})

function addItem() {
  items.value.push({ product_id: '', qty: 1 })
}

function removeItem(index: number) {
  if (items.value.length > 1) {
    items.value.splice(index, 1)
  }
}

async function handleSubmit() {
  try {
    await createMutation.mutateAsync({ items: items.value })
    router.push('/orders')
  } catch (error) {
    console.error('Create error:', error)
  }
}
</script>
