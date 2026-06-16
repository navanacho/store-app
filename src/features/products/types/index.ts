export interface Product {
  id: number
  name: string
  description: string
  /** Decimal serializado como string por el backend */
  base_price: string
  prep_time_min?: number
  image_urls: string[]
  available?: boolean
  /** Stock calculado en vivo: MIN(stock_ingredientes) para productos con receta */
  available_stock: number
  stock_quantity?: number
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
