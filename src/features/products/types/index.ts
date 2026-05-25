export interface Product {
  id: number
  name: string
  description: string
  /** Decimal serializado como string por el backend */
  base_price: string
  preparation_time?: number
  rating?: number
  image_url?: string
  available?: boolean
  category_id?: number
  category_name?: string
  created_at?: string
  updated_at?: string
  categories?: { id: number; name: string; is_primary: boolean }[]
  ingredients?: { id: number; name: string }[]
}

export interface ProductFilters {
  category?: number
  search?: string
  min_price?: number
  max_price?: number
}

export interface Category {
  id: number
  parent_id?: number
  name: string
  description?: string
  order_display: number
  image_url?: string
}
