import { useState } from 'react'
import { CatalogGrid } from '../components/CatalogGrid'
import { ProductFilters } from '../components/ProductFilters'
import { PageHeader } from '@/shared/components/PageHeader'
import type { ProductFilters as Filters } from '../types'

export function CatalogPage() {
  const [filters, setFilters] = useState<Filters>({})

  return (
    <div className="flex flex-col gap-stack-lg max-w-7xl mx-auto px-4 py-8">
      <PageHeader
        title="Catálogo completo"
        subtitle="Explorá todas nuestras hamburguesas artesanales. Filtralas por categoría o buscá por nombre."
      />

      <ProductFilters filters={filters} onFiltersChange={setFilters} />

      <CatalogGrid filters={filters} />
    </div>
  )
}
