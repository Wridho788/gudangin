import { defineStore } from 'pinia'
import { ref } from 'vue'

export type DensityMode = 'comfortable' | 'compact'

export const usePreferencesStore = defineStore('preferences', () => {
  const density = ref<DensityMode>('comfortable')

  function setDensity(mode: DensityMode) {
    density.value = mode
    localStorage.setItem('ui-density', mode)
  }

  function loadDensity() {
    const saved = localStorage.getItem('ui-density') as DensityMode
    if (saved && ['comfortable', 'compact'].includes(saved)) {
      density.value = saved
    }
  }

  // Load on init
  loadDensity()

  return {
    density,
    setDensity,
    loadDensity,
  }
})
