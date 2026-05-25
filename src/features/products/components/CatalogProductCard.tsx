import { Link } from 'react-router-dom'
import { ShoppingCart, Star, Clock, ChefHat } from 'lucide-react'
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
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
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
            {product.category_name && (
              <span className="text-xs text-on-surface-variant/60 uppercase tracking-wider">
                {product.category_name}
              </span>
            )}
          </div>
          {product.rating && (
            <div className="flex items-center gap-1 text-sm text-on-surface-variant shrink-0">
              <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
              {product.rating}
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-on-surface-variant leading-relaxed line-clamp-2">
          {product.description}
        </p>

        {/* Meta: ingredients + prep time */}
        <div className="flex flex-wrap items-center gap-3 mt-1">
          {product.preparation_time && (
            <span className="flex items-center gap-1 text-xs text-on-surface-variant/70">
              <Clock className="w-3.5 h-3.5" />
              {product.preparation_time} min
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
          <div>
            <span className="text-2xl font-bold text-rb-red">
              ${Number(product.base_price).toFixed(2)}
            </span>
          </div>
          <button
            onClick={() => onAddToCart(product)}
            className="flex items-center gap-2 bg-rb-red text-white text-sm font-sans font-bold uppercase tracking-wider px-5 py-2.5 rounded-sm hover:bg-rb-red-hover transition-colors shadow-red"
          >
            <ShoppingCart className="w-4 h-4" />
            Agregar
          </button>
        </div>
      </div>
    </div>
  )
}
