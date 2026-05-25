import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ProductGrid } from '../components/ProductGrid'
import { ProductFilters } from '../components/ProductFilters'
import type { ProductFilters as Filters } from '../types'

export function HomePage() {
  const [filters, setFilters] = useState<Filters>({})

  return (
    <div className="flex flex-col">
      {/* Hero — ocupa la mitad superior de la pantalla */}
      <section className="relative bg-rb-ink text-white min-h-[40vh] sm:min-h-[50vh] px-4 overflow-hidden flex items-center justify-center">
        {/* Background image con opacidad */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: 'url(https://mir-s3-cdn-cf.behance.net/project_modules/max_3840_webp/10edf2225889243.682f5d9449387.png)' }}
        />
        {/* Overlay sutil para legibilidad */}
        <div className="absolute inset-0 bg-rb-ink/50" />

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <p className="text-white/80 text-sm sm:text-base lg:text-lg max-w-xs sm:max-w-lg mx-auto mb-6 sm:mb-8">
            El sabor del rock en cada mordida. Hamburguesas artesanales con la actitud que te gusta.
          </p>
          <Link
            to="/products"
            className="inline-block bg-rb-red text-white font-sans font-bold uppercase tracking-wider px-6 sm:px-8 py-3 rounded-sm hover:bg-rb-red-hover transition-colors shadow-red text-sm sm:text-base"
          >
            Hacé tu pedido
          </Link>
        </div>
      </section>

      {/* Productos — ocupa la mitad inferior */}
      <section id="products" className="flex-1 max-w-7xl mx-auto px-4 py-6 sm:py-12">
        <h2 className="text-headline-md text-on-surface mb-4 sm:mb-6">Nuestras hamburguesas</h2>
        <ProductFilters filters={filters} onFiltersChange={setFilters} />
        <ProductGrid filters={filters} />
      </section>
    </div>
  )
}
