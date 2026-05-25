import { useQuery } from '@tanstack/react-query'
import { getProducts, getProductById, getCategories } from '../services/productService'
import type { ProductFilters } from '../types'

export function useProducts(filters?: ProductFilters) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => getProducts(filters),
    staleTime: 60_000,
  })
}

export function useProductById(id: number | undefined) {
  return useQuery({
    queryKey: ['products', id],
    queryFn: () => getProductById(id!),
    enabled: id != null && id > 0,
  })
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
    staleTime: 5 * 60_000,
  })
}
