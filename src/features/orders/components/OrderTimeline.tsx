import { Check } from 'lucide-react'
import type { OrderStatusHistory } from '../types'

interface OrderTimelineProps {
  history: OrderStatusHistory[]
}

const statusLabels: Record<string, string> = {
  PENDIENTE: 'Pedido recibido',
  CONFIRMADO: 'Confirmado',
  EN_PREP: 'En preparación',
  LISTO: 'Listo',
  ENTREGADO: 'Entregado',
  CANCELADO: 'Cancelado',
}

export function OrderTimeline({ history }: OrderTimelineProps) {
  if (!history?.length) return null

  return (
    <div className="space-y-0">
      {history.map((entry, index) => {
        const isLast = index === history.length - 1
        const estado = entry.estado_codigo || ''
        const label = statusLabels[estado] || estado

        return (
          <div key={entry.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className="w-3 h-3 rounded-full bg-rb-red flex items-center justify-center">
                <Check className="w-2 h-2 text-white" />
              </div>
              {!isLast && <div className="w-px flex-1 bg-outline-variant/50" />}
            </div>
            <div className={`pb-6 ${isLast ? '' : ''}`}>
              <p className={`font-sans text-sm ${isLast ? 'font-bold text-on-surface' : 'text-on-surface-variant'}`}>
                {label}
              </p>
              <p className="text-xs text-on-surface-variant/60">
                {new Date(entry.fecha_cambio).toLocaleString('es-AR', {
                  day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                })}
                {entry.usuario_cambio_id ? ` por usuario #${entry.usuario_cambio_id}` : ''}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
