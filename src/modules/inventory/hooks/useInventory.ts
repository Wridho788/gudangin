import { ref } from 'vue'
import { inventoryApi } from '../api/inventory.api'
import type { ProductStock, StockActionPayload } from '../types/inventory'

export function useInventory() {
  const items = ref<ProductStock[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchInventory() {
    loading.value = true
    try {
      items.value = await inventoryApi.getInventory()
    } catch (e: any) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  async function stockIn(payload: StockActionPayload) {
    await inventoryApi.stockIn(payload)
    await fetchInventory()
  }

  async function stockOut(payload: StockActionPayload) {
    await inventoryApi.stockOut(payload)
    await fetchInventory()
  }

  async function adjustStock(payload: StockActionPayload) {
    await inventoryApi.adjustStock(payload)
    await fetchInventory()
  }

  return {
    items,
    loading,
    error,
    fetchInventory,
    stockIn,
    stockOut,
    adjustStock
  }
}
