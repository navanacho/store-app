import { Link } from 'react-router-dom'
import { ShoppingBag, AlertTriangle } from 'lucide-react'
import { useQueries } from '@tanstack/react-query'
import { useCartStore } from '../store/cartStore'
import { getProductById } from '@/features/products/services/productService'
import { CartItem } from '../components/CartItem'
import { CartSummary } from '../components/CartSummary'

export function CartPage() {
  const { items, updateQuantity, removeItem } = useCartStore()

  // Fetch stock actual de cada producto en el carrito
  const stockResults = useQueries({
    queries: items.map((item) => ({
      queryKey: ['product-stock', item.id],
      queryFn: () => getProductById(item.id),
      staleTime: 10_000,
    })),
  })

  const stockMap: Record<number, number | undefined> = {}
  for (const result of stockResults) {
    if (result.data) {
      // Para productos con receta, available_stock es el stock real;
      // para standalone, available_stock es 0, usamos stock_quantity
      const limit = result.data.available_stock > 0
        ? result.data.available_stock
        : result.data.stock_quantity
      stockMap[result.data.id] = limit && limit > 0 ? limit : undefined
    }
  }

  const hasStockErrors = items.some(
    (item) => stockMap[item.id] != null && item.quantity > stockMap[item.id]!,
  )

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center gap-4 text-on-surface-variant">
          <ShoppingBag className="w-16 h-16" />
          <h2 className="text-headline-md text-on-surface">Tu carrito está vacío</h2>
          <p className="text-sm">Agregá productos del catálogo para empezar tu pedido</p>
          <Link
            to="/"
            className="bg-rb-red text-white font-sans font-bold uppercase tracking-wider px-6 py-3 rounded-sm hover:bg-rb-red-hover transition-colors"
          >
            Ver catálogo
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-headline-md text-on-surface mb-6">Tu carrito</h1>

      {hasStockErrors && (
        <div className="flex items-center gap-2 bg-danger/10 border border-danger/30 rounded-sm px-4 py-3 mb-4 text-sm text-danger">
          <AlertTriangle size={16} />
          <span>
            Algunos productos superan el stock disponible. Ajustá las cantidades antes de continuar.
          </span>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-stack-lg">
        <div className="flex-1">
          <div className="bg-surface rounded-sm p-4">
            {items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                stockLimit={stockMap[item.id]}
                onUpdateQuantity={updateQuantity}
                onRemove={removeItem}
              />
            ))}
          </div>
        </div>
        <div className="w-full lg:w-80">
          <CartSummary />
        </div>
      </div>
    </div>
  )
}
