<template>
  <span class="badge" :class="badgeClass">
    <component v-if="icon" :is="icon" class="w-3 h-3" />
    <slot />
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { OrderStatus } from '../../types'

const props = defineProps<{
  status: OrderStatus
  icon?: any
}>()

const badgeClass = computed(() => {
  const map: Record<OrderStatus, string> = {
    draft: 'badge-draft',
    submitted: 'badge-submitted',
    approved: 'badge-approved',
    rejected: 'badge-rejected',
    completed: 'badge-completed',
  }
  return map[props.status] || 'badge-draft'
})
</script>
