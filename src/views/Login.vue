<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-50 px-4">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-xl mb-4">
          <Package class="w-8 h-8 text-white" />
        </div>
        <h1 class="text-3xl font-bold text-slate-900">Gudangin</h1>
        <p class="text-slate-600 mt-2">Warehouse Management System</p>
      </div>

      <div class="card">
        <div class="card-body">
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div class="form-group">
              <label class="form-label">Email</label>
              <input
                v-model="email"
                type="email"
                class="form-input"
                placeholder="admin@example.com"
                required
              />
            </div>

            <div class="form-group">
              <label class="form-label">Password</label>
              <input
                v-model="password"
                type="password"
                class="form-input"
                placeholder="••••••••"
                required
              />
            </div>

            <div v-if="error" class="form-error">
              {{ error }}
            </div>

            <button type="submit" class="btn-primary w-full" :disabled="loading">
              <LogIn class="w-4 h-4" />
              {{ loading ? 'Signing in...' : 'Sign In' }}
            </button>
          </form>
        </div>
      </div>

      <p class="text-center text-sm text-slate-500 mt-4">
        Demo credentials: admin@example.com / password
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Package, LogIn } from 'lucide-vue-next'
import { useAuthStore } from '../stores/auth.store'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

async function handleSubmit() {
  try {
    loading.value = true
    error.value = ''
    await authStore.signIn(email.value, password.value)
    router.push('/dashboard')
  } catch (err: any) {
    error.value = err.message || 'Failed to sign in'
  } finally {
    loading.value = false
  }
}
</script>
