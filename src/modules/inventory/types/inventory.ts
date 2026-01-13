export type ProductStock = {
  product_id: string
  name: string
  sku: string

  on_hand: number
  reserved: number
  available: number
}

export type StockActionPayload = {
  productId: string
  qty: number
  note: string
}
