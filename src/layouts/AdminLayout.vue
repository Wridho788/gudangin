<template>
  <div class="min-h-screen bg-slate-50" :data-density="density">
    <Sidebar />
    <div class="lg:pl-64">
      <Topbar />
      <main class="px-6 py-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Sidebar from './Sidebar.vue'
import Topbar from './Topbar.vue'
import { usePreferencesStore } from '../stores/preferences.store'

const preferencesStore = usePreferencesStore()
const density = computed(() => preferencesStore.density)
</script>
