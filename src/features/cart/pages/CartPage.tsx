import { Link } from 'react-router-dom'
import { ShoppingBag } from 'lucide-react'
import { useCartStore } from '../store/cartStore'
import { CartItem } from '../components/CartItem'
import { CartSummary } from '../components/CartSummary'

export function CartPage() {
  const { items, updateQuantity, removeItem } = useCartStore()

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
      <div className="flex flex-col lg:flex-row gap-stack-lg">
        <div className="flex-1">
          <div className="bg-surface rounded-sm p-4">
            {items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
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
