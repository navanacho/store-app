import { useProducts } from '../hooks/useProducts'
import { useCartStore } from '@/features/cart/store/cartStore'
import { CatalogProductCard } from './CatalogProductCard'
import { LoadingSpinner } from '@/shared/components/LoadingSpinner'
import type { ProductFilters } from '../types'
import type { Product } from '../types'

interface CatalogGridProps {
  filters?: ProductFilters
}

export function CatalogGrid({ filters }: CatalogGridProps) {
  const { data: products, isLoading, isError } = useProducts(filters)
  const addItem = useCartStore((s) => s.addItem)

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: Number(product.base_price),
      image_url: product.image_urls?.[0],
      quantity: 1,
    })
  }

  if (isLoading) return <LoadingSpinner />
  if (isError) return <div className="text-center py-8 text-on-surface-variant">Error al cargar productos</div>
  if (!products?.length) return <div className="text-center py-8 text-on-surface-variant">No hay productos disponibles</div>

  return (
    <div className="flex flex-col gap-4">
      {products.map((product) => (
        <CatalogProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
      ))}
    </div>
  )
}
