// Order types
export type OrderStatus = 'draft' | 'submitted' | 'approved' | 'rejected' | 'completed'

export interface Order {
  id: string
  order_number: string
  status: OrderStatus
  created_at: string
  created_by: string
  created_by_name?: string
  approved_by?: string
  approved_at?: string
  completed_at?: string
  notes?: string
  items?: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  product_name?: string
  qty: number
  created_at: string
}

// Product types
export interface Product {
  id: string
  name: string
  sku: string
  stock: number
  min_stock: number
  is_low_stock?: boolean
  created_at: string
}

// Stock mutation types
export type MutationDirection = 'in' | 'out'
export type MutationSource = 'order' | 'adjustment' | 'opname'

export interface StockMutation {
  id: string
  product_id: string
  product_name?: string
  source_type: MutationSource
  source_id?: string
  qty_before: number
  qty_change: number
  qty_after: number
  actor_id: string
  actor_name?: string
  reason?: string
  created_at: string
}

// Activity log types
export interface ActivityLog {
  id: string
  actor_id: string
  actor_role: string
  entity_type: string
  entity_id: string
  action: string
  before_state?: any
  after_state?: any
  created_at: string
}

// User types
export type UserRole = 'owner' | 'admin' | 'staff'

export interface UserProfile {
  user_id: string
  role: UserRole
  full_name: string
  email?: string
  created_at: string
}

// API response types
export interface ApiResponse<T> {
  data: T
  error?: string
}
