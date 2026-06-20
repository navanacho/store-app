import { useProducts } from '../hooks/useProducts'
import { useCartStore } from '@/features/cart/store/cartStore'
import { ProductCard } from './ProductCard'
import { LoadingSpinner } from '@/shared/components/LoadingSpinner'
import type { ProductFilters } from '../types'
import { isProductAvailable } from '../types'
import type { Product } from '../types'

interface ProductGridProps {
  filters?: ProductFilters
}

export function ProductGrid({ filters }: ProductGridProps) {
  const { data: products, isLoading, isError } = useProducts(filters)
  const addItem = useCartStore((s) => s.addItem)

  const handleAddToCart = (product: Product) => {
    if (!isProductAvailable(product)) return
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-stack-md">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
      ))}
    </div>
  )
}
