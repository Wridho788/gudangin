export type OrderStatus = 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'COMPLETED' | 'CANCELLED'

export interface OrderItem {
  id: string
  productId: string
  productName: string
  sku: string
  quantity: number
  price: number
}

export interface Order {
  id: string
  createdBy: string
  createdByRole: 'OWNER' | 'STAFF'
  createdAt: string
  status: OrderStatus
  items: OrderItem[]
  totalItems: number
  totalAmount: number
  notes?: string
  statusHistory: StatusHistoryItem[]
}

export interface StatusHistoryItem {
  status: OrderStatus
  timestamp: string
  actor: string
  role: 'OWNER' | 'STAFF'
  notes?: string
}

// Dummy data
export const orders: Order[] = [
  {
    id: 'ORD-2026-001',
    createdBy: 'Budi Santoso',
    createdByRole: 'STAFF',
    createdAt: '2026-01-09T08:30:00',
    status: 'SUBMITTED',
    totalItems: 3,
    totalAmount: 4500000,
    items: [
      {
        id: '1',
        productId: 'PROD-001',
        productName: 'Laptop Asus ROG',
        sku: 'ASU-ROG-001',
        quantity: 2,
        price: 15000000,
      },
      {
        id: '2',
        productId: 'PROD-005',
        productName: 'Mouse Logitech MX Master 3',
        sku: 'LOG-MXM-003',
        quantity: 5,
        price: 1500000,
      },
    ],
    statusHistory: [
      {
        status: 'DRAFT',
        timestamp: '2026-01-09T08:30:00',
        actor: 'Budi Santoso',
        role: 'STAFF',
      },
      {
        status: 'SUBMITTED',
        timestamp: '2026-01-09T09:00:00',
        actor: 'Budi Santoso',
        role: 'STAFF',
        notes: 'Order untuk cabang Surabaya',
      },
    ],
  },
  {
    id: 'ORD-2026-002',
    createdBy: 'Siti Nurhaliza',
    createdByRole: 'STAFF',
    createdAt: '2026-01-08T14:20:00',
    status: 'APPROVED',
    totalItems: 5,
    totalAmount: 12000000,
    items: [
      {
        id: '3',
        productId: 'PROD-003',
        productName: 'Monitor LG UltraWide 34"',
        sku: 'LG-UW-034',
        quantity: 3,
        price: 6000000,
      },
      {
        id: '4',
        productId: 'PROD-007',
        productName: 'Webcam Logitech C920',
        sku: 'LOG-C920',
        quantity: 10,
        price: 1500000,
      },
    ],
    statusHistory: [
      {
        status: 'DRAFT',
        timestamp: '2026-01-08T14:20:00',
        actor: 'Siti Nurhaliza',
        role: 'STAFF',
      },
      {
        status: 'SUBMITTED',
        timestamp: '2026-01-08T14:45:00',
        actor: 'Siti Nurhaliza',
        role: 'STAFF',
      },
      {
        status: 'APPROVED',
        timestamp: '2026-01-08T16:00:00',
        actor: 'Ahmad Owner',
        role: 'OWNER',
        notes: 'Disetujui untuk pengiriman segera',
      },
    ],
  },
  {
    id: 'ORD-2026-003',
    createdBy: 'Ahmad Owner',
    createdByRole: 'OWNER',
    createdAt: '2026-01-07T10:00:00',
    status: 'COMPLETED',
    totalItems: 2,
    totalAmount: 8000000,
    items: [
      {
        id: '5',
        productId: 'PROD-002',
        productName: 'MacBook Pro M3',
        sku: 'APL-MBP-M3',
        quantity: 2,
        price: 25000000,
      },
    ],
    statusHistory: [
      {
        status: 'DRAFT',
        timestamp: '2026-01-07T10:00:00',
        actor: 'Ahmad Owner',
        role: 'OWNER',
      },
      {
        status: 'SUBMITTED',
        timestamp: '2026-01-07T10:05:00',
        actor: 'Ahmad Owner',
        role: 'OWNER',
      },
      {
        status: 'APPROVED',
        timestamp: '2026-01-07T10:10:00',
        actor: 'Ahmad Owner',
        role: 'OWNER',
      },
      {
        status: 'COMPLETED',
        timestamp: '2026-01-07T15:30:00',
        actor: 'Ahmad Owner',
        role: 'OWNER',
        notes: 'Barang sudah dikirim dan diterima',
      },
    ],
  },
  {
    id: 'ORD-2026-004',
    createdBy: 'Rina Wijaya',
    createdByRole: 'STAFF',
    createdAt: '2026-01-09T07:00:00',
    status: 'DRAFT',
    totalItems: 1,
    totalAmount: 1200000,
    items: [
      {
        id: '6',
        productId: 'PROD-008',
        productName: 'Keyboard Mechanical',
        sku: 'KEY-MECH-001',
        quantity: 4,
        price: 1200000,
      },
    ],
    statusHistory: [
      {
        status: 'DRAFT',
        timestamp: '2026-01-09T07:00:00',
        actor: 'Rina Wijaya',
        role: 'STAFF',
      },
    ],
  },
  {
    id: 'ORD-2026-005',
    createdBy: 'Budi Santoso',
    createdByRole: 'STAFF',
    createdAt: '2026-01-06T11:30:00',
    status: 'CANCELLED',
    totalItems: 2,
    totalAmount: 3000000,
    items: [
      {
        id: '7',
        productId: 'PROD-010',
        productName: 'Headphone Sony WH-1000XM5',
        sku: 'SNY-WH-1000',
        quantity: 5,
        price: 5000000,
      },
    ],
    statusHistory: [
      {
        status: 'DRAFT',
        timestamp: '2026-01-06T11:30:00',
        actor: 'Budi Santoso',
        role: 'STAFF',
      },
      {
        status: 'SUBMITTED',
        timestamp: '2026-01-06T11:45:00',
        actor: 'Budi Santoso',
        role: 'STAFF',
      },
      {
        status: 'CANCELLED',
        timestamp: '2026-01-06T13:00:00',
        actor: 'Ahmad Owner',
        role: 'OWNER',
        notes: 'Stok tidak mencukupi',
      },
    ],
  },
]
