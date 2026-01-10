<template>
  <AdminLayout>
    <PageHeader 
      title="Products" 
      subtitle="Manage your product catalog"
    >
      <template #actions>
        <button @click="openCreateModal" class="btn-primary">
          <Plus class="w-4 h-4" />
          Add Product
        </button>
      </template>
    </PageHeader>

    <!-- Loading State -->
    <LoadingSkeleton v-if="isLoading" :count="8" height="64px" />

    <!-- Empty State -->
    <EmptyState
      v-else-if="!products || products.length === 0"
      :icon="Package"
      title="No products found"
      description="Add products to your catalog"
    >
      <template #action>
        <button @click="openCreateModal" class="btn-primary">
          <Plus class="w-4 h-4" />
          Add Product
        </button>
      </template>
    </EmptyState>

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
              <div class="flex gap-2">
                <button 
                  @click="openEditModal(product)" 
                  class="btn-ghost btn-sm"
                  title="Edit"
                >
                  <Pencil class="w-4 h-4" />
                </button>
                <button 
                  @click="openDeleteModal(product)" 
                  class="btn-ghost btn-sm text-red-600 hover:bg-red-50"
                  title="Delete"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Create/Edit Modal -->
    <Modal
      :show="showFormModal"
      :title="isEditing ? 'Edit Product' : 'Create New Product'"
      @close="closeFormModal"
    >
      <ProductForm
        :product="selectedProduct"
        :is-loading="isSubmitting"
        @submit="handleSubmit"
        @cancel="closeFormModal"
      />
    </Modal>

    <!-- Delete Confirmation Modal -->
    <Modal
      :show="showDeleteModal"
      title="Delete Product"
      @close="closeDeleteModal"
    >
      <div class="space-y-4">
        <p class="text-slate-600">
          Are you sure you want to delete <strong>{{ selectedProduct?.name }}</strong>?
          This action cannot be undone.
        </p>
        <div class="flex gap-3">
          <button
            @click="handleDelete"
            class="btn-primary bg-red-600 hover:bg-red-700"
            :disabled="isDeleting"
          >
            {{ isDeleting ? 'Deleting...' : 'Delete Product' }}
          </button>
          <button @click="closeDeleteModal" class="btn-secondary">
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Package, AlertTriangle, CheckCircle, Plus, Pencil, Trash2 } from 'lucide-vue-next'
import AdminLayout from '../layouts/AdminLayout.vue'
import PageHeader from '../components/ui/PageHeader.vue'
import EmptyState from '../components/ui/EmptyState.vue'
import LoadingSkeleton from '../components/ui/LoadingSkeleton.vue'
import Modal from '../components/ui/Modal.vue'
import ProductForm from '../components/ProductForm.vue'
import { 
  useProducts, 
  useCreateProduct, 
  useUpdateProduct, 
  useDeleteProduct 
} from '../composables/useInventory'
import type { Product } from '../types'

const { data: products, isLoading } = useProducts()
const createMutation = useCreateProduct()
const updateMutation = useUpdateProduct()
const deleteMutation = useDeleteProduct()

const showFormModal = ref(false)
const showDeleteModal = ref(false)
const selectedProduct = ref<Product | null>(null)
const isEditing = ref(false)
const isSubmitting = ref(false)
const isDeleting = ref(false)

function openCreateModal() {
  selectedProduct.value = null
  isEditing.value = false
  showFormModal.value = true
}

function openEditModal(product: Product) {
  selectedProduct.value = product
  isEditing.value = true
  showFormModal.value = true
}

function openDeleteModal(product: Product) {
  selectedProduct.value = product
  showDeleteModal.value = true
}

function closeFormModal() {
  showFormModal.value = false
  selectedProduct.value = null
  isEditing.value = false
}

function closeDeleteModal() {
  showDeleteModal.value = false
  selectedProduct.value = null
}

async function handleSubmit(data: any) {
  isSubmitting.value = true
  
  try {
    if (isEditing.value && selectedProduct.value) {
      await updateMutation.mutateAsync({
        id: selectedProduct.value.id,
        data: {
          name: data.name,
          sku: data.sku,
          min_stock: data.min_stock,
        },
      })
    } else {
      await createMutation.mutateAsync(data)
    }
    closeFormModal()
  } catch (error) {
    console.error('Failed to save product:', error)
    alert('Failed to save product. Please try again.')
  } finally {
    isSubmitting.value = false
  }
}

async function handleDelete() {
  if (!selectedProduct.value) return
  
  isDeleting.value = true
  
  try {
    await deleteMutation.mutateAsync(selectedProduct.value.id)
    closeDeleteModal()
  } catch (error) {
    console.error('Failed to delete product:', error)
    alert('Failed to delete product. Please try again.')
  } finally {
    isDeleting.value = false
  }
}
</script>
