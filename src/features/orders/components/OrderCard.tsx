import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import type { Order } from '../types'

const statusColors: Record<string, string> = {
  PENDIENTE: 'bg-warning/20 text-warning',
  CONFIRMADO: 'bg-blue-100 text-blue-700',
  EN_PREP: 'bg-orange-100 text-orange-700',
  LISTO: 'bg-green-100 text-green-700',
  ENTREGADO: 'bg-success/20 text-success',
  CANCELADO: 'bg-danger/20 text-danger',
}

interface OrderCardProps {
  order: Order
}

export function OrderCard({ order }: OrderCardProps) {
  const statusClass = statusColors[order.estado_codigo] || 'bg-surface-container text-on-surface-variant'
  const itemCount = order.detalles?.reduce((s, i) => s + i.cantidad, 0) || 0

  return (
    <Link
      to={`/orders/${order.id}`}
      className="block bg-surface rounded-sm p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <span className="text-data-mono text-on-surface-variant">#{order.id}</span>
            <span className={`text-xs font-sans font-bold px-2 py-0.5 rounded-full ${statusClass}`}>
              {order.estado_codigo}
            </span>
          </div>
          <p className="text-sm text-on-surface-variant">
            {new Date(order.created_at).toLocaleDateString('es-AR', {
              day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
            })}
          </p>
          <p className="text-sm text-on-surface-variant">{itemCount} item(s)</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-bold text-lg text-on-surface">${Number(order.total).toFixed(2)}</span>
          <ChevronRight className="w-5 h-5 text-on-surface-variant" />
        </div>
      </div>
    </Link>
  )
}
