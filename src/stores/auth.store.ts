import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@supabase/supabase-js'
import type { UserProfile } from '../types'
import { AuthAPI } from '../services/auth.service'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const profile = ref<UserProfile | null>(null)
  const ready = ref(false)
  const loading = ref(false)

  const isAuthenticated = computed(() => !!user.value)
  const role = computed(() => profile.value?.role)
  const isOwner = computed(() => role.value === 'owner')
  const isAdmin = computed(() => role.value === 'admin')
  const isStaff = computed(() => role.value === 'staff')
  const canApprove = computed(() => isOwner.value || isAdmin.value)
  const canComplete = computed(() => isOwner.value || isAdmin.value)

  async function bootstrap() {
    try {
      loading.value = true
      const currentUser = await AuthAPI.getCurrentUser()
      user.value = currentUser

      if (currentUser) {
        const userProfile = await AuthAPI.getProfile(currentUser.id)
        profile.value = userProfile
      }
    } catch (error) {
      console.error('Bootstrap error:', error)
      user.value = null
      profile.value = null
    } finally {
      ready.value = true
      loading.value = false
    }
  }

  async function signIn(email: string, password: string) {
    try {
      loading.value = true
      const { user: authUser } = await AuthAPI.signIn(email, password)
      user.value = authUser

      if (authUser) {
        const userProfile = await AuthAPI.getProfile(authUser.id)
        profile.value = userProfile
      }
    } finally {
      loading.value = false
    }
  }

  async function signOut() {
    try {
      loading.value = true
      await AuthAPI.signOut()
      user.value = null
      profile.value = null
    } finally {
      loading.value = false
    }
  }

  return {
    user,
    profile,
    ready,
    loading,
    isAuthenticated,
    role,
    isOwner,
    isAdmin,
    isStaff,
    canApprove,
    canComplete,
    bootstrap,
    signIn,
    signOut,
  }
})
