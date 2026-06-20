import { Link } from 'react-router-dom'
import { ShoppingCart, Clock, ChefHat } from 'lucide-react'
import { isProductAvailable } from '../types'
import type { Product } from '../types'

interface CatalogProductCardProps {
  product: Product
  onAddToCart: (product: Product) => void
}

export function CatalogProductCard({ product, onAddToCart }: CatalogProductCardProps) {
  return (
    <div className="bg-surface rounded-sm overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row">
      {/* Image */}
      <Link to={`/products/${product.id}`} className="block md:w-48 shrink-0">
        <div className="aspect-[4/3] md:aspect-square bg-surface-container-high flex items-center justify-center overflow-hidden">
          {product.image_urls?.[0] ? (
            <img src={product.image_urls[0]} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-4xl font-display text-on-surface-variant/20">RB</span>
          )}
        </div>
      </Link>

      {/* Info */}
      <div className="p-4 md:p-5 flex flex-col flex-1 gap-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <Link to={`/products/${product.id}`}>
              <h3 className="font-display text-headline-md text-on-surface hover:text-rb-red transition-colors">
                {product.name}
              </h3>
            </Link>
            {product.categories?.[0] && (
              <span className="text-xs text-on-surface-variant/60 uppercase tracking-wider">
                {product.categories[0].name}
              </span>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-on-surface-variant leading-relaxed line-clamp-2">
          {product.description}
        </p>

        {/* Meta: ingredients + prep time */}
        <div className="flex flex-wrap items-center gap-3 mt-1">
          {product.prep_time_min && (
            <span className="flex items-center gap-1 text-xs text-on-surface-variant/70">
              <Clock className="w-3.5 h-3.5" />
              {product.prep_time_min} min
            </span>
          )}
          {product.ingredients && product.ingredients.length > 0 && (
            <span className="flex items-center gap-1 text-xs text-on-surface-variant/70">
              <ChefHat className="w-3.5 h-3.5" />
              {product.ingredients.slice(0, 3).map((i) => i.name).join(', ')}
              {product.ingredients.length > 3 && '...'}
            </span>
          )}
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between mt-auto pt-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-rb-red">
              ${Number(product.base_price).toFixed(2)}
            </span>
            {!isProductAvailable(product) && (
              <span className="text-xs bg-surface-container-high text-on-surface-variant px-2 py-0.5 rounded-sm font-semibold uppercase tracking-wider">
                Sin stock
              </span>
            )}
          </div>
          <button
            onClick={() => onAddToCart(product)}
            disabled={!isProductAvailable(product)}
            className={`flex items-center gap-2 text-sm font-sans font-bold uppercase tracking-wider px-5 py-2.5 rounded-sm transition-colors ${
              isProductAvailable(product)
                ? 'bg-rb-red text-white hover:bg-rb-red-hover shadow-red'
                : 'bg-outline-variant text-on-surface-variant/50 cursor-not-allowed'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            {isProductAvailable(product) ? 'Agregar' : 'Sin stock'}
          </button>
        </div>
      </div>
    </div>
  )
}
