import { ShoppingCart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCartStore } from '../store/cartStore'

export function CartBadge() {
  const count = useCartStore((s) => s.items.reduce((acc, i) => acc + i.quantity, 0))

  return (
    <Link to="/cart" className="relative text-white/80 hover:text-white transition-colors">
      <ShoppingCart className="w-5 h-5" />
      {count > 0 && (
        <span className="absolute -top-2 -right-2 bg-rb-red text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
          {count > 9 ? '9+' : count}
        </span>
      )}
    </Link>
  )
}
