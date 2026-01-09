<template>
  <div class="space-y-3">
    <div
      v-for="i in count"
      :key="i"
      class="animate-pulse bg-slate-100 rounded"
      :style="{ height: height }"
    />
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    count?: number
    height?: string
  }>(),
  {
    count: 3,
    height: '48px',
  }
)
</script>
