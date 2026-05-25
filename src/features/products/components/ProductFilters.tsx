import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { useCategories } from '../hooks/useProducts'
import type { ProductFilters } from '../types'

interface ProductFiltersProps {
  filters: ProductFilters
  onFiltersChange: (filters: ProductFilters) => void
}

export function ProductFilters({ filters, onFiltersChange }: ProductFiltersProps) {
  const { data: categories } = useCategories()
  const [search, setSearch] = useState(filters.search || '')

  useEffect(() => {
    const timer = setTimeout(() => {
      onFiltersChange({ ...filters, search: search || undefined })
    }, 400)
    return () => clearTimeout(timer)
  }, [search])

  return (
    <div className="flex flex-col sm:flex-row gap-stack-md mb-4 sm:mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar productos..."
          className="w-full pl-10 pr-4 py-2.5 bg-surface-container rounded-sm text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-rb-red"
        />
      </div>
      <select
        value={filters.category || ''}
        onChange={(e) => onFiltersChange({ ...filters, category: e.target.value ? Number(e.target.value) : undefined })}
        className="w-full sm:w-auto px-4 py-2.5 bg-surface-container rounded-sm text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-rb-red"
      >
        <option value="">Todas las categorías</option>
        {categories?.map((cat) => (
          <option key={cat.id} value={cat.id}>{cat.name}</option>
        ))}
      </select>
    </div>
  )
}
