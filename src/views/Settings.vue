<template>
  <AdminLayout>
    <PageHeader title="Settings" subtitle="Manage your preferences" />

    <div class="max-w-3xl space-y-6">
      <!-- User Info -->
      <Card title="User Information">
        <div class="space-y-4">
          <div>
            <span class="text-sm text-slate-600">Name</span>
            <p class="font-medium text-slate-900">{{ authStore.profile?.full_name }}</p>
          </div>
          <div>
            <span class="text-sm text-slate-600">Email</span>
            <p class="font-medium text-slate-900">{{ authStore.user?.email }}</p>
          </div>
          <div>
            <span class="text-sm text-slate-600">Role</span>
            <div class="mt-1">
              <span
                class="badge"
                :class="{
                  'badge-completed': authStore.role === 'owner',
                  'badge-approved': authStore.role === 'admin',
                  'badge-submitted': authStore.role === 'staff',
                }"
              >
                {{ authStore.role?.toUpperCase() }}
              </span>
            </div>
          </div>
        </div>
      </Card>

      <!-- Preferences -->
      <Card title="Display Preferences">
        <div class="form-group">
          <label class="form-label">Density Mode</label>
          <select v-model="selectedDensity" @change="handleDensityChange" class="form-input">
            <option value="comfortable">Comfortable (Default)</option>
            <option value="compact">Compact (For Operational Use)</option>
          </select>
          <p class="text-xs text-slate-500 mt-1">
            Compact mode displays more data in less space
          </p>
        </div>
      </Card>

      <!-- Danger Zone -->
      <Card title="Danger Zone">
        <div class="space-y-4">
          <div class="p-4 border border-red-200 bg-red-50 rounded-lg">
            <p class="text-sm text-red-900 font-medium mb-2">Sign Out</p>
            <p class="text-sm text-red-700 mb-4">
              You will be signed out and redirected to the login page.
            </p>
            <button @click="handleSignOut" class="btn-danger">
              <LogOut class="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </Card>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { LogOut } from 'lucide-vue-next'
import AdminLayout from '../layouts/AdminLayout.vue'
import PageHeader from '../components/ui/PageHeader.vue'
import Card from '../components/ui/Card.vue'
import { useAuthStore } from '../stores/auth.store'
import { usePreferencesStore } from '../stores/preferences.store'

const router = useRouter()
const authStore = useAuthStore()
const preferencesStore = usePreferencesStore()

const selectedDensity = ref(preferencesStore.density)

function handleDensityChange() {
  preferencesStore.setDensity(selectedDensity.value)
}

async function handleSignOut() {
  await authStore.signOut()
  router.push('/login')
}
</script>
