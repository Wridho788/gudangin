<script setup lang="ts">
import type { StatusHistoryItem } from '@/mocks/orders'

interface Props {
  history: StatusHistoryItem[]
}

defineProps<Props>()

const formatDate = (timestamp: string) => {
  return new Date(timestamp).toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const statusLabels: Record<string, string> = {
  DRAFT: 'Order Created',
  SUBMITTED: 'Submitted for Approval',
  APPROVED: 'Approved',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
}
</script>

<template>
  <div class="space-y-4">
    <h3 class="text-lg font-semibold text-text">Status Timeline</h3>
    <div class="relative">
      <div
        class="absolute left-2 top-0 bottom-0 w-0.5 bg-border"
        style="height: calc(100% - 2rem)"
      ></div>
      <div class="space-y-6">
        <div
          v-for="(item, index) in history"
          :key="index"
          class="relative pl-8"
        >
          <div
            class="absolute left-0 top-1.5 h-5 w-5 rounded-full border-2 border-primary bg-surface flex items-center justify-center"
          >
            <div class="h-2 w-2 rounded-full bg-primary"></div>
          </div>
          <div class="bg-surface border border-border rounded-md p-4">
            <div class="flex items-start justify-between mb-1">
              <h4 class="font-medium text-text">{{ statusLabels[item.status] }}</h4>
              <span class="text-xs text-text-soft">{{ formatDate(item.timestamp) }}</span>
            </div>
            <p class="text-sm text-text-soft">
              by {{ item.actor }} ({{ item.role }})
            </p>
            <p v-if="item.notes" class="text-sm text-text mt-2">{{ item.notes }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
