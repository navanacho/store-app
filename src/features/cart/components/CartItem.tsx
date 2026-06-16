import { Plus, Minus, Trash2, AlertTriangle } from 'lucide-react'
import type { CartItem as CartItemType } from '../types'

interface CartItemProps {
  item: CartItemType
  stockLimit?: number
  onUpdateQuantity: (id: number, quantity: number) => void
  onRemove: (id: number) => void
}

export function CartItem({ item, stockLimit, onUpdateQuantity, onRemove }: CartItemProps) {
  const atMaxStock = stockLimit != null && item.quantity >= stockLimit

  return (
    <div className="flex flex-col py-4 border-b border-outline-variant/30">
      <div className="flex items-center gap-4">
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
            disabled={atMaxStock}
            className="w-8 h-8 flex items-center justify-center rounded-sm bg-surface-container hover:bg-surface-container-high transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            title={atMaxStock ? 'Stock máximo disponible' : undefined}
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

      {atMaxStock && (
        <div className="flex items-center gap-2 mt-2 ml-[4.5rem] text-xs text-warning">
          <AlertTriangle size={12} />
          <span>Stock máximo disponible ({stockLimit} unid.). No podés agregar más.</span>
        </div>
      )}
    </div>
  )
}
