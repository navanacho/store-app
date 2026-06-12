import { Link } from 'react-router-dom'
import { ShoppingCart } from 'lucide-react'
import type { Product } from '../types'

interface ProductCardProps {
  product: Product
  onAddToCart: (product: Product) => void
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <div className="bg-surface rounded-sm overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
      <Link to={`/products/${product.id}`} className="block">
        <div className="aspect-[4/3] bg-surface-container-high flex items-center justify-center overflow-hidden">
          {product.image_urls?.[0] ? (
            <img src={product.image_urls[0]} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-4xl font-display text-on-surface-variant/20">RB</span>
          )}
        </div>
      </Link>
      <div className="p-4 flex flex-col flex-1 gap-stack-sm">
        <Link to={`/products/${product.id}`}>
          <h3 className="font-sans font-semibold text-on-surface">{product.name}</h3>
        </Link>
        {product.categories?.[0] && (
          <span className="text-xs text-on-surface-variant/60 uppercase tracking-wider">{product.categories[0].name}</span>
        )}
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="font-bold text-lg text-rb-red">${Number(product.base_price).toFixed(2)}</span>
          <button
            onClick={(e) => { e.preventDefault(); onAddToCart(product) }}
            className="bg-rb-red text-white p-2 rounded-sm hover:bg-rb-red-hover transition-colors"
            aria-label="Agregar al carrito"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
