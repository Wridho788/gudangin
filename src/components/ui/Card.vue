<template>
  <div class="card">
    <div v-if="title || $slots.header" class="card-header">
      <h3 v-if="title" class="text-lg font-semibold text-slate-900">{{ title }}</h3>
      <slot name="header" />
    </div>
    <div class="card-body">
      <slot />
    </div>
    <div v-if="$slots.footer" class="px-6 py-4 border-t border-slate-200">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title?: string
}>()
</script>
