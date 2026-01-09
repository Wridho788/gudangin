import type { OrderStatus } from './orders'

export interface DashboardSummary {
  totalOrdersToday: number
  pendingApproval: number
  lowStockCount: number
  completedToday: number
}

export interface RecentOrder {
  id: string
  createdBy: string
  createdAt: string
  status: OrderStatus
  totalItems: number
  totalAmount: number
}

export interface ActivityLog {
  id: string
  actor: string
  role: 'OWNER' | 'STAFF'
  action: string
  entityType: string
  entityId: string
  timestamp: string
  notes?: string
}

// Dummy data
export const dashboardSummary: DashboardSummary = {
  totalOrdersToday: 2,
  pendingApproval: 1,
  lowStockCount: 3,
  completedToday: 0,
}

export const recentOrders: RecentOrder[] = [
  {
    id: 'ORD-2026-001',
    createdBy: 'Budi Santoso',
    createdAt: '2026-01-09T08:30:00',
    status: 'SUBMITTED',
    totalItems: 3,
    totalAmount: 4500000,
  },
  {
    id: 'ORD-2026-004',
    createdBy: 'Rina Wijaya',
    createdAt: '2026-01-09T07:00:00',
    status: 'DRAFT',
    totalItems: 1,
    totalAmount: 1200000,
  },
  {
    id: 'ORD-2026-002',
    createdBy: 'Siti Nurhaliza',
    createdAt: '2026-01-08T14:20:00',
    status: 'APPROVED',
    totalItems: 5,
    totalAmount: 12000000,
  },
]

export const activityLogs: ActivityLog[] = [
  {
    id: 'LOG-001',
    actor: 'Budi Santoso',
    role: 'STAFF',
    action: 'ORDER_SUBMITTED',
    entityType: 'ORDER',
    entityId: 'ORD-2026-001',
    timestamp: '2026-01-09T09:00:00',
    notes: 'Order untuk cabang Surabaya',
  },
  {
    id: 'LOG-002',
    actor: 'Ahmad Owner',
    role: 'OWNER',
    action: 'ORDER_APPROVED',
    entityType: 'ORDER',
    entityId: 'ORD-2026-002',
    timestamp: '2026-01-08T16:00:00',
    notes: 'Disetujui untuk pengiriman segera',
  },
  {
    id: 'LOG-003',
    actor: 'Ahmad Owner',
    role: 'OWNER',
    action: 'ORDER_COMPLETED',
    entityType: 'ORDER',
    entityId: 'ORD-2026-003',
    timestamp: '2026-01-07T15:30:00',
    notes: 'Barang sudah dikirim dan diterima',
  },
  {
    id: 'LOG-004',
    actor: 'Rina Wijaya',
    role: 'STAFF',
    action: 'ORDER_CREATED',
    entityType: 'ORDER',
    entityId: 'ORD-2026-004',
    timestamp: '2026-01-09T07:00:00',
  },
  {
    id: 'LOG-005',
    actor: 'Ahmad Owner',
    role: 'OWNER',
    action: 'ORDER_CANCELLED',
    entityType: 'ORDER',
    entityId: 'ORD-2026-005',
    timestamp: '2026-01-06T13:00:00',
    notes: 'Stok tidak mencukupi',
  },
]
