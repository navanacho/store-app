import { apiClient } from '@/shared/lib/axios'
import type { Product, ProductFilters, Category } from '../types'

interface ListResponse<T> {
  data: T[]
  total: number
}

export async function getProducts(filters?: ProductFilters): Promise<Product[]> {
  const params = new URLSearchParams()
  if (filters?.category) params.append('category_id', String(filters.category))
  if (filters?.search) params.append('name', filters.search)
  if (filters?.min_price) params.append('min_price', String(filters.min_price))
  if (filters?.max_price) params.append('max_price', String(filters.max_price))

  const query = params.toString()
  const { data } = await apiClient.get<ListResponse<Product>>(`/products${query ? `?${query}` : ''}`)
  return data.data
}

export async function getProductById(id: number): Promise<Product> {
  const { data } = await apiClient.get<Product>(`/products/${id}`)
  return data
}

export async function getCategories(): Promise<Category[]> {
  const { data } = await apiClient.get<{ data: Category[] }>('/categories')
  return data.data
}
