import { Plus, Minus, Trash2 } from 'lucide-react'
import type { CartItem as CartItemType } from '../types'

interface CartItemProps {
  item: CartItemType
  onUpdateQuantity: (id: number, quantity: number) => void
  onRemove: (id: number) => void
}

export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  return (
    <div className="flex items-center gap-4 py-4 border-b border-outline-variant/30">
      <div className="w-16 h-16 bg-surface-container-high rounded-sm flex items-center justify-center overflow-hidden shrink-0">
        {item.image_url ? (
          <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-xs font-display text-on-surface-variant/20">RB</span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-sans font-semibold text-on-surface truncate">{item.name}</p>
        <p className="text-sm text-on-surface-variant">${Number(item.price).toFixed(2)} c/u</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
          className="w-8 h-8 flex items-center justify-center rounded-sm bg-surface-container hover:bg-surface-container-high transition-colors"
        >
          <Minus className="w-3 h-3" />
        </button>
        <span className="w-8 text-center font-sans text-sm">{item.quantity}</span>
        <button
          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
          className="w-8 h-8 flex items-center justify-center rounded-sm bg-surface-container hover:bg-surface-container-high transition-colors"
        >
          <Plus className="w-3 h-3" />
        </button>
      </div>
      <p className="w-20 text-right font-sans font-semibold text-on-surface">
        ${(Number(item.price) * item.quantity).toFixed(2)}
      </p>
      <button
        onClick={() => onRemove(item.id)}
        className="p-2 text-on-surface-variant hover:text-rb-red transition-colors"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  )
}
