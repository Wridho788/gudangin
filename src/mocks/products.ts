export interface Product {
  id: string
  name: string
  sku: string
  stock: number
  price: number
  category: string
  lowStockThreshold: number
  isLowStock: boolean
}

// Dummy data
export const products: Product[] = [
  {
    id: 'PROD-001',
    name: 'Laptop Asus ROG',
    sku: 'ASU-ROG-001',
    stock: 15,
    price: 15000000,
    category: 'Laptop',
    lowStockThreshold: 5,
    isLowStock: false,
  },
  {
    id: 'PROD-002',
    name: 'MacBook Pro M3',
    sku: 'APL-MBP-M3',
    stock: 8,
    price: 25000000,
    category: 'Laptop',
    lowStockThreshold: 5,
    isLowStock: false,
  },
  {
    id: 'PROD-003',
    name: 'Monitor LG UltraWide 34"',
    sku: 'LG-UW-034',
    stock: 22,
    price: 6000000,
    category: 'Monitor',
    lowStockThreshold: 10,
    isLowStock: false,
  },
  {
    id: 'PROD-004',
    name: 'Dell XPS 13',
    sku: 'DEL-XPS-013',
    stock: 3,
    price: 18000000,
    category: 'Laptop',
    lowStockThreshold: 5,
    isLowStock: true,
  },
  {
    id: 'PROD-005',
    name: 'Mouse Logitech MX Master 3',
    sku: 'LOG-MXM-003',
    stock: 45,
    price: 1500000,
    category: 'Accessories',
    lowStockThreshold: 20,
    isLowStock: false,
  },
  {
    id: 'PROD-006',
    name: 'iPad Pro 12.9"',
    sku: 'APL-IPD-129',
    stock: 12,
    price: 16000000,
    category: 'Tablet',
    lowStockThreshold: 8,
    isLowStock: false,
  },
  {
    id: 'PROD-007',
    name: 'Webcam Logitech C920',
    sku: 'LOG-C920',
    stock: 4,
    price: 1500000,
    category: 'Accessories',
    lowStockThreshold: 10,
    isLowStock: true,
  },
  {
    id: 'PROD-008',
    name: 'Keyboard Mechanical',
    sku: 'KEY-MECH-001',
    stock: 28,
    price: 1200000,
    category: 'Accessories',
    lowStockThreshold: 15,
    isLowStock: false,
  },
  {
    id: 'PROD-009',
    name: 'SSD Samsung 1TB',
    sku: 'SAM-SSD-1TB',
    stock: 2,
    price: 2000000,
    category: 'Storage',
    lowStockThreshold: 10,
    isLowStock: true,
  },
  {
    id: 'PROD-010',
    name: 'Headphone Sony WH-1000XM5',
    sku: 'SNY-WH-1000',
    stock: 18,
    price: 5000000,
    category: 'Audio',
    lowStockThreshold: 8,
    isLowStock: false,
  },
]
