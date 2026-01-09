import { api } from '../lib/axios'
import type { Order } from '../types'

export const OrderAPI = {
  /**
   * List all orders from v_orders view
   */
  list: () =>
    api.get<Order[]>('/v_orders', {
      params: { order: 'created_at.desc' },
    }),

  /**
   * Get single order detail
   */
  getById: (id: string) =>
    api.get<Order[]>('/v_orders', {
      params: { id: `eq.${id}` },
    }),

  /**
   * Create new draft order
   */
  create: (payload: { items: Array<{ product_id: string; qty: number }> }) =>
    api.post('/rpc/create_order', payload),

  /**
   * Submit order for approval
   */
  submit: (orderId: string) =>
    api.post('/rpc/submit_order', { p_order_id: orderId }),

  /**
   * Approve order (admin/owner only)
   */
  approve: (orderId: string) =>
    api.post('/rpc/approve_order', { p_order_id: orderId }),

  /**
   * Reject order (admin/owner only)
   */
  reject: (orderId: string, reason: string) =>
    api.post('/rpc/reject_order', { p_order_id: orderId, p_reason: reason }),

  /**
   * Complete order (execute stock mutation)
   */
  complete: (orderId: string) =>
    api.post('/rpc/complete_order', { p_order_id: orderId }),

  /**
   * Cancel order
   */
  cancel: (orderId: string, reason: string) =>
    api.post('/rpc/cancel_order', { p_order_id: orderId, p_reason: reason }),
}
