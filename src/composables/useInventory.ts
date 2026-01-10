import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { InventoryAPI } from '../services/inventory.service'

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data } = await InventoryAPI.list()
      return data
    },
  })
}

export function useProduct(productId: string) {
  return useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      const { data } = await InventoryAPI.getById(productId)
      return data[0]
    },
    enabled: !!productId,
  })
}

export function useLowStockProducts() {
  return useQuery({
    queryKey: ['products', 'low-stock'],
    queryFn: async () => {
      const { data } = await InventoryAPI.lowStock()
      // Filter client-side: products where stock < min_stock
      return data.filter((product) => product.stock < product.min_stock)
    },
  })
}

export function useStockMutations(productId?: string) {
  return useQuery({
    queryKey: productId
      ? ['stock-mutations', productId]
      : ['stock-mutations'],
    queryFn: async () => {
      if (productId) {
        const { data } = await InventoryAPI.getMutations(productId)
        return data
      } else {
        const { data } = await InventoryAPI.getAllMutations()
        return data
      }
    },
  })
}

export function useAdjustStock() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: InventoryAPI.adjust,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({
        queryKey: ['product', variables.product_id],
      })
      queryClient.invalidateQueries({ queryKey: ['stock-mutations'] })
    },
  })
}

export function useStockOpname() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: InventoryAPI.opname,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({
        queryKey: ['product', variables.product_id],
      })
      queryClient.invalidateQueries({ queryKey: ['stock-mutations'] })
    },
  })
}

export function useCreateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: InventoryAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}

export function useUpdateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      InventoryAPI.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['product', variables.id] })
    },
  })
}

export function useDeleteProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: InventoryAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}
