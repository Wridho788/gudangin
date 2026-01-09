<template>
  <AdminLayout>
    <PageHeader title="Inventory" subtitle="Stock levels and mutations" />

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      <!-- Low Stock Products -->
      <Card title="Low Stock Alert" class="lg:col-span-1">
        <LoadingSkeleton v-if="lowStockLoading" :count="3" />
        <EmptyState
          v-else-if="!lowStockData || lowStockData.length === 0"
          :icon="CheckCircle"
          title="All stock levels healthy"
        />
        <div v-else class="space-y-2">
          <div
            v-for="product in lowStockData"
            :key="product.id"
            class="p-3 border border-red-200 bg-red-50 rounded-lg"
          >
            <p class="font-medium text-slate-900 text-sm">{{ product.name }}</p>
            <p class="text-xs text-slate-600">
              Stock: {{ product.stock }} / Min: {{ product.min_stock }}
            </p>
          </div>
        </div>
      </Card>

      <!-- Quick Actions -->
      <Card title="Quick Actions" class="lg:col-span-2">
        <div class="grid grid-cols-2 gap-4">
          <button class="btn-secondary" @click="showAdjustModal = true">
            <Edit class="w-4 h-4" />
            Adjust Stock
          </button>
          <button class="btn-secondary" @click="showOpnameModal = true">
            <ClipboardCheck class="w-4 h-4" />
            Stock Opname
          </button>
        </div>
      </Card>
    </div>

    <!-- Stock Mutations -->
    <Card title="Recent Stock Mutations">
      <LoadingSkeleton v-if="mutationsLoading" :count="5" />
      <EmptyState
        v-else-if="!mutations || mutations.length === 0"
        :icon="Activity"
        title="No mutations yet"
        description="Stock changes will appear here"
      />
      <div v-else class="table-container">
        <table class="table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Source</th>
              <th>Before</th>
              <th>Change</th>
              <th>After</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="mutation in mutations" :key="mutation.id">
              <td>
                <span class="font-medium text-slate-900">{{ mutation.product_name }}</span>
              </td>
              <td>
                <span class="badge badge-submitted text-xs">{{ mutation.source_type }}</span>
              </td>
              <td>
                <span class="text-slate-600">{{ mutation.qty_before }}</span>
              </td>
              <td>
                <span
                  class="font-medium"
                  :class="mutation.qty_change > 0 ? 'text-green-600' : 'text-red-600'"
                >
                  {{ mutation.qty_change > 0 ? '+' : '' }}{{ mutation.qty_change }}
                </span>
              </td>
              <td>
                <span class="font-medium text-slate-900">{{ mutation.qty_after }}</span>
              </td>
              <td>
                <span class="text-sm text-slate-600">{{ formatDate(mutation.created_at) }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Card>

    <!-- Adjust Stock Modal -->
    <Modal
      :show="showAdjustModal"
      title="Adjust Stock"
      @close="showAdjustModal = false"
    >
      <div class="space-y-4">
        <div class="form-group">
          <label class="form-label">Product</label>
          <select v-model="adjustForm.product_id" class="form-input" required>
            <option value="">Select product</option>
            <option v-for="p in products" :key="p.id" :value="p.id">
              {{ p.name }} (Stock: {{ p.stock }})
            </option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Quantity Change</label>
          <input
            v-model.number="adjustForm.qty_change"
            type="number"
            class="form-input"
            placeholder="Use negative for decrease"
            required
          />
        </div>
        <div class="form-group">
          <label class="form-label">Reason</label>
          <textarea
            v-model="adjustForm.reason"
            class="form-input"
            rows="3"
            required
          ></textarea>
        </div>
      </div>

      <template #footer>
        <button @click="showAdjustModal = false" class="btn-secondary">
          Cancel
        </button>
        <button @click="handleAdjust" class="btn-primary" :disabled="adjustMutation.isPending.value">
          {{ adjustMutation.isPending.value ? 'Adjusting...' : 'Adjust Stock' }}
        </button>
      </template>
    </Modal>

    <!-- Stock Opname Modal -->
    <Modal
      :show="showOpnameModal"
      title="Stock Opname"
      @close="showOpnameModal = false"
    >
      <div class="space-y-4">
        <div class="form-group">
          <label class="form-label">Product</label>
          <select v-model="opnameForm.product_id" class="form-input" required>
            <option value="">Select product</option>
            <option v-for="p in products" :key="p.id" :value="p.id">
              {{ p.name }} (Current: {{ p.stock }})
            </option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Actual Quantity (Physical Count)</label>
          <input
            v-model.number="opnameForm.actual_qty"
            type="number"
            class="form-input"
            required
          />
        </div>
        <div class="form-group">
          <label class="form-label">Reason</label>
          <textarea
            v-model="opnameForm.reason"
            class="form-input"
            rows="3"
            required
          ></textarea>
        </div>
      </div>

      <template #footer>
        <button @click="showOpnameModal = false" class="btn-secondary">
          Cancel
        </button>
        <button @click="handleOpname" class="btn-primary" :disabled="opnameMutation.isPending.value">
          {{ opnameMutation.isPending.value ? 'Submitting...' : 'Submit Opname' }}
        </button>
      </template>
    </Modal>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  CheckCircle,
  Edit,
  ClipboardCheck,
  Activity,
} from 'lucide-vue-next'
import AdminLayout from '../layouts/AdminLayout.vue'
import PageHeader from '../components/ui/PageHeader.vue'
import Card from '../components/ui/Card.vue'
import EmptyState from '../components/ui/EmptyState.vue'
import LoadingSkeleton from '../components/ui/LoadingSkeleton.vue'
import Modal from '../components/ui/Modal.vue'
import {
  useProducts,
  useLowStockProducts,
  useStockMutations,
  useAdjustStock,
  useStockOpname,
} from '../composables/useInventory'

const { data: products } = useProducts()
const { data: lowStockData, isLoading: lowStockLoading } = useLowStockProducts()
const { data: mutations, isLoading: mutationsLoading } = useStockMutations()
const adjustMutation = useAdjustStock()
const opnameMutation = useStockOpname()

const showAdjustModal = ref(false)
const showOpnameModal = ref(false)

const adjustForm = ref({
  product_id: '',
  qty_change: 0,
  reason: '',
})

const opnameForm = ref({
  product_id: '',
  actual_qty: 0,
  reason: '',
})

async function handleAdjust() {
  try {
    await adjustMutation.mutateAsync(adjustForm.value)
    showAdjustModal.value = false
    adjustForm.value = { product_id: '', qty_change: 0, reason: '' }
  } catch (error) {
    console.error('Adjust error:', error)
  }
}

async function handleOpname() {
  try {
    await opnameMutation.mutateAsync(opnameForm.value)
    showOpnameModal.value = false
    opnameForm.value = { product_id: '', actual_qty: 0, reason: '' }
  } catch (error) {
    console.error('Opname error:', error)
  }
}

function formatDate(date: string) {
  return new Date(date).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>
