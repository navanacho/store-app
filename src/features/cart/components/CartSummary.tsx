import { Link } from 'react-router-dom'
import { useCartStore } from '../store/cartStore'
import { useAuthStore } from '@/features/auth/store/authStore'

export function CartSummary() {
  const items = useCartStore((s) => s.items)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  const subtotal = items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0)
  const shipping: number = 0
  const total: number = subtotal + shipping

  return (
    <div className="bg-surface rounded-sm p-6 space-y-4">
      <h3 className="font-sans font-bold text-on-surface">Resumen del pedido</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between text-on-surface-variant">
          <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-on-surface-variant">
          <span>Envío</span>
          <span>{shipping === 0 ? 'Gratis' : `$${shipping.toFixed(2)}`}</span>
        </div>
        <div className="border-t border-outline-variant/30 pt-2 flex justify-between font-bold text-on-surface">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
      <Link
        to={isAuthenticated ? '/checkout' : '/login'}
        className="block w-full bg-rb-red text-white text-center font-sans font-bold uppercase tracking-wider py-3 rounded-sm hover:bg-rb-red-hover transition-colors shadow-red"
      >
        Iniciar pedido
      </Link>
    </div>
  )
}
