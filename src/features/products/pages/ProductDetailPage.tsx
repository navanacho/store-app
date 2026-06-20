import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, ShoppingCart, Clock, AlertCircle } from 'lucide-react'
import { useProductById } from '../hooks/useProducts'
import { useCartStore } from '@/features/cart/store/cartStore'
import { LoadingSpinner } from '@/shared/components/LoadingSpinner'
import { isProductAvailable } from '../types'

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const productId = id ? Number(id) : undefined
  const { data: product, isLoading, isError } = useProductById(productId)
  const addItem = useCartStore((s) => s.addItem)

  if (isLoading) return <LoadingSpinner />
  if (isError || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col items-center gap-4 text-on-surface-variant">
          <AlertCircle className="w-12 h-12" />
          <p>Producto no encontrado</p>
          <Link to="/" className="text-rb-red hover:underline">Volver al catálogo</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-on-surface-variant hover:text-rb-red transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" />
        Volver al catálogo
      </Link>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-lg">
        <div className="aspect-square bg-surface-container-high rounded-sm flex items-center justify-center overflow-hidden">
          {product.image_urls?.[0] ? (
            <img src={product.image_urls[0]} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-6xl font-display text-on-surface-variant/20">RB</span>
          )}
        </div>
        <div className="flex flex-col gap-stack-md">
          <h1 className="text-headline-md text-on-surface">{product.name}</h1>
          {product.categories?.[0] && (
            <span className="text-sm text-on-surface-variant/60 uppercase tracking-wider">{product.categories[0].name}</span>
          )}
          <p className="text-on-surface-variant leading-relaxed">{product.description}</p>
          {product.ingredients && product.ingredients.length > 0 && (
            <div>
              <h3 className="font-sans font-semibold text-sm text-on-surface mb-2">Ingredientes</h3>
              <div className="flex flex-wrap gap-2">
                {product.ingredients.map((ing) => (
                  <span key={ing.id} className="bg-surface-container px-3 py-1 rounded-full text-xs text-on-surface-variant">
                    {ing.name}
                  </span>
                ))}
              </div>
            </div>
          )}
          {product.prep_time_min && (
            <div className="flex items-center gap-2 text-sm text-on-surface-variant">
              <Clock className="w-4 h-4" />
              Tiempo de preparación: {product.prep_time_min} min
            </div>
          )}
          <div className="flex items-center justify-between pt-4 mt-auto border-t border-outline-variant">
            <span className="text-3xl font-bold text-rb-red">${Number(product.base_price).toFixed(2)}</span>
            <div className="flex items-center gap-3">
              {!isProductAvailable(product) && (
                <span className="text-sm text-on-surface-variant/70 font-semibold">
                  Producto agotado
                </span>
              )}
              <button
                onClick={() => {
                  if (!isProductAvailable(product)) return
                  addItem({ id: product.id, name: product.name, price: Number(product.base_price), image_url: product.image_urls?.[0], quantity: 1 })
                }}
                disabled={!isProductAvailable(product)}
                className={`flex items-center gap-2 font-sans font-bold uppercase tracking-wider px-6 py-3 rounded-sm transition-colors ${
                  isProductAvailable(product)
                    ? 'bg-rb-red text-white hover:bg-rb-red-hover shadow-red'
                    : 'bg-outline-variant text-on-surface-variant/50 cursor-not-allowed'
                }`}
              >
                <ShoppingCart className="w-5 h-5" />
                {isProductAvailable(product) ? 'Agregar al carrito' : 'Sin stock'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
