import { supabase } from '@/lib/supabase'
import type { StockActionPayload } from '../types/inventory'

export const inventoryApi = {
  async getInventory() {
    const { data, error } = await supabase
      .from('product_stock_summary')
      .select(`
        product_id,
        on_hand,
        reserved,
        available,
        products (
          name,
          sku
        )
      `)

    if (error) throw error

    return data.map((row: any) => ({
      product_id: row.product_id,
      name: row.products.name,
      sku: row.products.sku,
      on_hand: row.on_hand,
      reserved: row.reserved,
      available: row.available
    }))
  },

  async stockIn(payload: StockActionPayload) {
    const { error } = await supabase.rpc('rpc_stock_in', {
      p_product_id: payload.productId,
      p_qty: payload.qty,
      p_note: payload.note
    })

    if (error) throw error
  },

  async stockOut(payload: StockActionPayload) {
    const { error } = await supabase.rpc('rpc_stock_out_manual', {
      p_product_id: payload.productId,
      p_qty: payload.qty,
      p_note: payload.note
    })

    if (error) throw error
  },

  async adjustStock(payload: StockActionPayload) {
    const { error } = await supabase.rpc('rpc_stock_adjustment', {
      p_product_id: payload.productId,
      p_qty: payload.qty,
      p_reason: payload.note
    })

    if (error) throw error
  }
}
