<script setup lang="ts">
import type { OrderStatus } from '@/mocks/orders'

interface Props {
  status: OrderStatus
}

defineProps<Props>()

const statusConfig: Record<OrderStatus, { class: string; label: string }> = {
  DRAFT: { class: 'bg-surface text-text-soft border border-border', label: 'Draft' },
  SUBMITTED: { class: 'bg-warning/10 text-warning border border-warning/30', label: 'Submitted' },
  APPROVED: { class: 'bg-primary/10 text-primary border border-primary/30', label: 'Approved' },
  COMPLETED: { class: 'bg-success/10 text-success border border-success/30', label: 'Completed' },
  CANCELLED: { class: 'bg-danger/10 text-danger border border-danger/30', label: 'Cancelled' },
}
</script>

<template>
  <span
    :class="[
      'inline-flex items-center px-3 py-1 rounded-md text-sm font-medium',
      statusConfig[status].class,
    ]"
  >
    {{ statusConfig[status].label }}
  </span>
</template>
