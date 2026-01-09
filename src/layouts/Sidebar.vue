<template>
  <aside
    class="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 overflow-y-auto scrollbar-thin"
  >
    <div class="flex items-center gap-3 px-6 py-5 border-b border-slate-200">
      <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
        <Package class="w-5 h-5 text-white" />
      </div>
      <h1 class="text-xl font-bold text-slate-900">Gudangin</h1>
    </div>

    <nav class="px-3 py-4 space-y-1">
      <RouterLink
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="nav-item"
        active-class="nav-item-active"
      >
        <component :is="item.icon" class="w-5 h-5" />
        <span>{{ item.label }}</span>
      </RouterLink>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { LayoutDashboard, ShoppingCart, Package, Warehouse, Settings } from 'lucide-vue-next'

const navItems = [
  {
    label: 'Dashboard',
    path: '/',
    icon: LayoutDashboard,
  },
  {
    label: 'Orders',
    path: '/orders',
    icon: ShoppingCart,
  },
  {
    label: 'Products',
    path: '/products',
    icon: Package,
  },
  {
    label: 'Inventory',
    path: '/inventory',
    icon: Warehouse,
  },
  {
    label: 'Settings',
    path: '/settings',
    icon: Settings,
  },
]
</script>

<style scoped>
.nav-item {
  @apply flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-slate-700;
  @apply hover:bg-slate-50 transition-colors;
}

.nav-item-active {
  @apply bg-blue-50 text-blue-700;
}
</style>
