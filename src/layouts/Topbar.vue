<template>
  <header class="sticky top-0 z-40 bg-white border-b border-slate-200">
    <div class="flex items-center justify-between px-6 py-4">
      <div>
        <h2 class="text-lg font-semibold text-slate-900">{{ pageTitle }}</h2>
      </div>

      <div class="flex items-center gap-4">
        <!-- Density Toggle -->
        <button
          @click="toggleDensity"
          class="btn-ghost p-2"
          title="Toggle Density"
        >
          <Maximize2 v-if="density === 'comfortable'" class="w-5 h-5" />
          <Minimize2 v-else class="w-5 h-5" />
        </button>

        <!-- User Menu -->
        <div class="flex items-center gap-3">
          <div class="text-right">
            <p class="text-sm font-medium text-slate-900">
              {{ profile?.full_name || 'User' }}
            </p>
            <p class="text-xs text-slate-500">
              <span
                class="badge"
                :class="{
                  'badge-completed': role === 'owner',
                  'badge-approved': role === 'admin',
                  'badge-submitted': role === 'staff',
                }"
              >
                {{ role?.toUpperCase() }}
              </span>
            </p>
          </div>

          <button @click="handleSignOut" class="btn-ghost p-2" title="Sign Out">
            <LogOut class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { LogOut, Maximize2, Minimize2 } from 'lucide-vue-next'
import { useAuthStore } from '../stores/auth.store'
import { usePreferencesStore } from '../stores/preferences.store'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const preferencesStore = usePreferencesStore()

const profile = computed(() => authStore.profile)
const role = computed(() => authStore.role)
const density = computed(() => preferencesStore.density)

const pageTitle = computed(() => {
  const meta = route.meta.title
  return meta || 'Gudangin'
})

function toggleDensity() {
  const newDensity = density.value === 'comfortable' ? 'compact' : 'comfortable'
  preferencesStore.setDensity(newDensity)
}

async function handleSignOut() {
  await authStore.signOut()
  router.push('/login')
}
</script>
