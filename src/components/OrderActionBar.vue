<script setup lang="ts">
import type { OrderStatus } from '@/mocks/orders'

interface Props {
  status: OrderStatus
  role: 'OWNER' | 'STAFF'
}

const props = defineProps<Props>()

const emit = defineEmits<{
  save: []
  submit: []
  approve: []
  complete: []
  cancel: []
}>()

// State matrix rules
const canSave = props.status === 'DRAFT'
const canSubmit = props.status === 'DRAFT' && props.role === 'STAFF'
const canApprove = props.status === 'SUBMITTED' && props.role === 'OWNER'
const canComplete = props.status === 'APPROVED' && props.role === 'OWNER'
const canCancel = props.role === 'OWNER' && ['DRAFT', 'SUBMITTED', 'APPROVED'].includes(props.status)
</script>

<template>
  <div class="flex items-center gap-3 flex-wrap">
    <button
      v-if="canSave"
      @click="emit('save')"
      class="px-4 py-2 bg-surface border border-border text-text rounded-md hover:bg-border transition-colors"
    >
      Save Draft
    </button>

    <button
      v-if="canSubmit"
      @click="emit('submit')"
      class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover transition-colors"
    >
      Submit for Approval
    </button>

    <button
      v-if="canApprove"
      @click="emit('approve')"
      class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover transition-colors"
    >
      Approve Order
    </button>

    <button
      v-if="canComplete"
      @click="emit('complete')"
      class="px-4 py-2 bg-success text-white rounded-md hover:bg-success/90 transition-colors"
    >
      Mark as Completed
    </button>

    <button
      v-if="canCancel"
      @click="emit('cancel')"
      class="px-4 py-2 bg-danger text-white rounded-md hover:bg-danger/90 transition-colors"
    >
      Cancel Order
    </button>

    <div v-if="!canSave && !canSubmit && !canApprove && !canComplete && !canCancel" class="text-text-soft text-sm">
      No actions available for this order
    </div>
  </div>
</template>
