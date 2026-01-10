import { api } from '../lib/axios'
import type { Product, StockMutation } from '../types'

export const InventoryAPI = {
  /**
   * List all products
   */
  list: () => api.get<Product[]>('/products'),

  /**
   * Get low stock products
   */
  lowStock: () => api.get<Product[]>('/products'),

  /**
   * Get product by ID
   */
  getById: (id: string) =>
    api.get<Product[]>('/products', {
      params: { id: `eq.${id}` },
    }),

  /**
   * Create new product
   */
  create: (payload: {
    name: string
    sku: string
    stock: number
    min_stock: number
  }) =>
    api.post<Product>('/products', payload, {
      headers: { Prefer: 'return=representation' },
    }),

  /**
   * Update product
   */
  update: (id: string, payload: {
    name?: string
    sku?: string
    min_stock?: number
  }) =>
    api.patch<Product>(`/products?id=eq.${id}`, payload, {
      headers: { Prefer: 'return=representation' },
    }),

  /**
   * Delete product
   */
  delete: (id: string) => api.delete(`/products?id=eq.${id}`),

  /**
   * Adjust stock (manual correction)
   */
  adjust: (payload: {
    product_id: string
    qty_change: number
    reason: string
  }) => api.post('/rpc/adjust_stock', payload),

  /**
   * Submit stock opname (inventory count)
   */
  opname: (payload: {
    product_id: string
    actual_qty: number
    reason: string
  }) => api.post('/rpc/submit_stock_opname', payload),

  /**
   * Get stock mutations for a product
   */
  getMutations: (productId: string) =>
    api.get<StockMutation[]>('/v_stock_ledger', {
      params: {
        product_id: `eq.${productId}`,
        order: 'created_at.desc',
      },
    }),

  /**
   * Get all stock mutations
   */
  getAllMutations: (limit: number = 50) =>
    api.get<StockMutation[]>('/v_stock_ledger', {
      params: {
        order: 'created_at.desc',
        limit,
      },
    }),
}
