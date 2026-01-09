<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    @click.self="handleClose"
  >
    <div
      class="bg-white rounded-lg shadow-lg w-full max-w-md mx-4"
      role="dialog"
      aria-modal="true"
    >
      <div class="flex items-center justify-between px-6 py-4 border-b border-slate-200">
        <h3 class="text-lg font-semibold text-slate-900">{{ title }}</h3>
        <button
          @click="handleClose"
          class="text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <div class="px-6 py-4">
        <slot />
      </div>

      <div
        v-if="$slots.footer"
        class="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-200"
      >
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { X } from 'lucide-vue-next'

const props = defineProps<{
  show: boolean
  title: string
}>()

const emit = defineEmits<{
  close: []
}>()

function handleClose() {
  emit('close')
}
</script>
