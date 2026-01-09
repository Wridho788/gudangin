<template>
  <AdminLayout>
    <LoadingSkeleton v-if="isLoading" :count="5" height="80px" />

    <div v-else-if="order">
      <PageHeader :title="`Order ${order.order_number}`" subtitle="Order details and actions">
        <template #actions>
          <RouterLink to="/orders" class="btn-secondary">
            <ArrowLeft class="w-4 h-4" />
            Back
          </RouterLink>
        </template>
      </PageHeader>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Info -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Order Info -->
          <Card title="Order Information">
            <div class="space-y-4">
              <div>
                <span class="text-sm text-slate-600">Status</span>
                <div class="mt-1">
                  <StatusBadge :status="order.status">
                    {{ order.status.toUpperCase() }}
                  </StatusBadge>
                </div>
              </div>
              <div>
                <span class="text-sm text-slate-600">Created By</span>
                <p class="font-medium text-slate-900">{{ order.created_by_name }}</p>
              </div>
              <div>
                <span class="text-sm text-slate-600">Created At</span>
                <p class="font-medium text-slate-900">{{ formatDate(order.created_at) }}</p>
              </div>
              <div v-if="order.approved_by">
                <span class="text-sm text-slate-600">Approved At</span>
                <p class="font-medium text-slate-900">{{ formatDate(order.approved_at!) }}</p>
              </div>
              <div v-if="order.completed_at">
                <span class="text-sm text-slate-600">Completed At</span>
                <p class="font-medium text-slate-900">{{ formatDate(order.completed_at) }}</p>
              </div>
              <div v-if="order.notes">
                <span class="text-sm text-slate-600">Notes</span>
                <p class="text-slate-900">{{ order.notes }}</p>
              </div>
            </div>
          </Card>

          <!-- Items -->
          <Card title="Order Items">
            <div class="table-container">
              <table class="table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in order.items" :key="item.id">
                    <td>
                      <span class="font-medium text-slate-900">{{ item.product_name }}</span>
                    </td>
                    <td>
                      <span class="font-medium text-slate-900">{{ item.qty }}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>

          <!-- Activity Log -->
          <Card title="Activity Timeline">
            <LoadingSkeleton v-if="activityLoading" :count="3" />
            <EmptyState
              v-else-if="!activityData || activityData.length === 0"
              :icon="Activity"
              title="No activity yet"
            />
            <div v-else class="space-y-4">
              <div
                v-for="log in activityData"
                :key="log.id"
                class="flex items-start gap-3"
              >
                <div class="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                  <Activity class="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p class="text-sm text-slate-900">
                    <span class="font-medium">{{ log.actor_role }}</span> 
                    {{ log.action }}
                  </p>
                  <p class="text-xs text-slate-500 mt-1">{{ formatDate(log.created_at) }}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <!-- Actions Panel -->
        <div class="lg:col-span-1">
          <Card title="Actions">
            <div class="space-y-3">
              <!-- Submit -->
              <button
                v-if="order.status === 'draft'"
                @click="handleSubmit"
                class="btn-primary w-full"
                :disabled="submitMutation.isPending.value"
              >
                <Send class="w-4 h-4" />
                {{ submitMutation.isPending.value ? 'Submitting...' : 'Submit for Approval' }}
              </button>

              <!-- Approve -->
              <button
                v-if="order.status === 'submitted' && authStore.canApprove"
                @click="handleApprove"
                class="btn-primary w-full"
                :disabled="approveMutation.isPending.value"
              >
                <CheckCircle class="w-4 h-4" />
                {{ approveMutation.isPending.value ? 'Approving...' : 'Approve Order' }}
              </button>

              <!-- Reject -->
              <button
                v-if="order.status === 'submitted' && authStore.canApprove"
                @click="showRejectModal = true"
                class="btn-danger w-full"
              >
                <XCircle class="w-4 h-4" />
                Reject Order
              </button>

              <!-- Complete -->
              <button
                v-if="order.status === 'approved' && authStore.canComplete"
                @click="handleComplete"
                class="btn-primary w-full"
                :disabled="completeMutation.isPending.value"
              >
                <CheckCircle class="w-4 h-4" />
                {{ completeMutation.isPending.value ? 'Completing...' : 'Complete Order' }}
              </button>

              <!-- Cancel -->
              <button
                v-if="['draft', 'submitted'].includes(order.status)"
                @click="showCancelModal = true"
                class="btn-secondary w-full"
              >
                <X class="w-4 h-4" />
                Cancel Order
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>

    <!-- Reject Modal -->
    <Modal
      :show="showRejectModal"
      title="Reject Order"
      @close="showRejectModal = false"
    >
      <div class="form-group">
        <label class="form-label">Reason for rejection</label>
        <textarea
          v-model="rejectReason"
          class="form-input"
          rows="4"
          placeholder="Explain why this order is being rejected..."
          required
        ></textarea>
      </div>

      <template #footer>
        <button @click="showRejectModal = false" class="btn-secondary">
          Cancel
        </button>
        <button @click="handleReject" class="btn-danger" :disabled="rejectMutation.isPending.value">
          {{ rejectMutation.isPending.value ? 'Rejecting...' : 'Reject Order' }}
        </button>
      </template>
    </Modal>

    <!-- Cancel Modal -->
    <Modal
      :show="showCancelModal"
      title="Cancel Order"
      @close="showCancelModal = false"
    >
      <div class="form-group">
        <label class="form-label">Reason for cancellation</label>
        <textarea
          v-model="cancelReason"
          class="form-input"
          rows="4"
          placeholder="Explain why this order is being cancelled..."
          required
        ></textarea>
      </div>

      <template #footer>
        <button @click="showCancelModal = false" class="btn-secondary">
          Cancel
        </button>
        <button @click="handleCancel" class="btn-danger" :disabled="cancelMutation.isPending.value">
          {{ cancelMutation.isPending.value ? 'Cancelling...' : 'Cancel Order' }}
        </button>
      </template>
    </Modal>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  ArrowLeft,
  Send,
  CheckCircle,
  XCircle,
  X,
  Activity,
} from 'lucide-vue-next'
import AdminLayout from '../layouts/AdminLayout.vue'
import PageHeader from '../components/ui/PageHeader.vue'
import Card from '../components/ui/Card.vue'
import StatusBadge from '../components/ui/StatusBadge.vue'
import EmptyState from '../components/ui/EmptyState.vue'
import LoadingSkeleton from '../components/ui/LoadingSkeleton.vue'
import Modal from '../components/ui/Modal.vue'
import {
  useOrder,
  useSubmitOrder,
  useApproveOrder,
  useRejectOrder,
  useCompleteOrder,
  useCancelOrder,
} from '../composables/useOrders'
import { useActivityLogs } from '../composables/useActivity'
import { useAuthStore } from '../stores/auth.store'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const orderId = route.params.id as string
const { data: order, isLoading } = useOrder(orderId)
const { data: activityData, isLoading: activityLoading } = useActivityLogs('order', orderId)

const submitMutation = useSubmitOrder()
const approveMutation = useApproveOrder()
const rejectMutation = useRejectOrder()
const completeMutation = useCompleteOrder()
const cancelMutation = useCancelOrder()

const showRejectModal = ref(false)
const showCancelModal = ref(false)
const rejectReason = ref('')
const cancelReason = ref('')

async function handleSubmit() {
  try {
    await submitMutation.mutateAsync(orderId)
  } catch (error) {
    console.error('Submit error:', error)
  }
}

async function handleApprove() {
  try {
    await approveMutation.mutateAsync(orderId)
  } catch (error) {
    console.error('Approve error:', error)
  }
}

async function handleReject() {
  try {
    await rejectMutation.mutateAsync({ orderId, reason: rejectReason.value })
    showRejectModal.value = false
    rejectReason.value = ''
  } catch (error) {
    console.error('Reject error:', error)
  }
}

async function handleComplete() {
  try {
    await completeMutation.mutateAsync(orderId)
  } catch (error) {
    console.error('Complete error:', error)
  }
}

async function handleCancel() {
  try {
    await cancelMutation.mutateAsync({ orderId, reason: cancelReason.value })
    showCancelModal.value = false
    cancelReason.value = ''
    router.push('/orders')
  } catch (error) {
    console.error('Cancel error:', error)
  }
}

function formatDate(date: string) {
  return new Date(date).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>
