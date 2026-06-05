import { Link } from 'react-router-dom'
import { Bike, Store } from 'lucide-react'
import { useCartStore } from '../store/cartStore'
import { useAuthStore } from '@/features/auth/store/authStore'
import { useShippingConfig } from '@/features/orders/hooks/useShippingConfig'

export function CartSummary() {
  const items = useCartStore((s) => s.items)
  const shippingOption = useCartStore((s) => s.shippingOption)
  const setShippingOption = useCartStore((s) => s.setShippingOption)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const { data: shippingConfig } = useShippingConfig()

  const subtotal = items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0)
  const costoEnvio = shippingOption === 'delivery' ? (shippingConfig?.delivery ?? 0) : 0
  const total: number = subtotal + costoEnvio

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
          <span>{costoEnvio === 0 ? 'Gratis' : `$${costoEnvio.toFixed(2)}`}</span>
        </div>
        <div className="border-t border-outline-variant/30 pt-2 flex justify-between font-bold text-on-surface">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      <div className="border-t border-outline-variant/30 pt-4 space-y-2">
        <p className="text-xs font-sans font-bold text-on-surface-variant uppercase tracking-wider">
          Tipo de envío
        </p>
        <label className="flex items-center gap-3 p-3 rounded-sm border border-outline-variant/30 cursor-pointer hover:bg-surface-container transition-colors">
          <input
            type="radio"
            name="cart-shipping"
            checked={shippingOption === 'delivery'}
            onChange={() => setShippingOption('delivery')}
            className="accent-rb-red"
          />
          <Bike className="w-5 h-5 text-on-surface-variant flex-shrink-0" />
          <div className="text-sm">
            <p className="text-on-surface font-medium">Delivery</p>
            <p className="text-on-surface-variant/60">${(shippingConfig?.delivery ?? 0).toFixed(2)}</p>
          </div>
        </label>
        <label className="flex items-center gap-3 p-3 rounded-sm border border-outline-variant/30 cursor-pointer hover:bg-surface-container transition-colors">
          <input
            type="radio"
            name="cart-shipping"
            checked={shippingOption === 'pickup'}
            onChange={() => setShippingOption('pickup')}
            className="accent-rb-red"
          />
          <Store className="w-5 h-5 text-on-surface-variant flex-shrink-0" />
          <div className="text-sm">
            <p className="text-on-surface font-medium">Retiro en local</p>
            <p className="text-on-surface-variant/60">Gratis</p>
          </div>
        </label>
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
