import { useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, AlertCircle } from 'lucide-react'
import { useOrderById, useCancelOrder } from '../hooks/useOrders'
import { useOrderWebSocket } from '../hooks/useOrderWebSocket'
import { OrderTimeline } from '../components/OrderTimeline'
import { useOrderHistory } from '../hooks/useOrders'
import { LoadingSpinner } from '@/shared/components/LoadingSpinner'
import { ConfirmModal } from '@/shared/components/ConfirmModal'

const statusLabels: Record<string, string> = {
  PENDIENTE: 'Pendiente',
  CONFIRMADO: 'Confirmado',
  EN_PREP: 'En preparación',
  LISTO: 'Listo',
  ENTREGADO: 'Entregado',
  CANCELADO: 'Cancelado',
}

export function OrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const orderId = id ? Number(id) : undefined
  const { data: order, isLoading, isError } = useOrderById(orderId)
  const { data: history } = useOrderHistory(orderId)
  const cancelMutation = useCancelOrder()

  // Recibir actualizaciones en tiempo real del pedido
  useOrderWebSocket(orderId ? [orderId] : undefined)
  
  const confirmCancelRef = useRef<HTMLDialogElement>(null)

  function handleCancelClick() {
    confirmCancelRef.current?.showModal()
  }

  function handleConfirmCancel() {
    cancelMutation.mutate(order!.id, {
      onSuccess: () => {
        confirmCancelRef.current?.close()
      },
    })
  }

  if (isLoading) return <LoadingSpinner />
  if (isError || !order) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <div className="flex flex-col items-center gap-4 text-on-surface-variant">
          <AlertCircle className="w-12 h-12" />
          <p>Pedido no encontrado</p>
          <Link to="/orders" className="text-rb-red hover:underline">Volver a mis pedidos</Link>
        </div>
      </div>
    )
  }

  const canCancel = order.estado_codigo === 'PENDIENTE' || order.estado_codigo === 'CONFIRMADO'

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link to="/orders" className="inline-flex items-center gap-2 text-sm text-on-surface-variant hover:text-rb-red transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" />
        Mis pedidos
      </Link>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-headline-md text-on-surface">
            Pedido #{order.id}
          </h1>
          <p className="text-sm text-on-surface-variant mt-1">
            {new Date(order.created_at).toLocaleDateString('es-AR', {
              day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
            })}
          </p>
        </div>
        <span className="text-sm font-sans font-bold px-3 py-1 rounded-full bg-warning/20 text-warning">
          {statusLabels[order.estado_codigo] || order.estado_codigo}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-stack-lg">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface rounded-sm p-4">
            <h3 className="font-sans font-bold text-on-surface mb-3">Items</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-on-surface-variant/60 border-b border-outline-variant/30">
                  <th className="text-left py-2 font-medium">Producto</th>
                  <th className="text-center py-2 font-medium">Cant.</th>
                  <th className="text-right py-2 font-medium">Precio</th>
                  <th className="text-right py-2 font-medium">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.detalles?.map((item) => (
                  <tr key={item.id} className="border-b border-outline-variant/10">
                    <td className="py-2 text-on-surface">{item.producto_nombre}</td>
                    <td className="py-2 text-center text-on-surface-variant">{item.cantidad}</td>
                    <td className="py-2 text-right text-on-surface-variant">${Number(item.producto_precio_unitario).toFixed(2)}</td>
                    <td className="py-2 text-right font-semibold text-on-surface">${Number(item.subtotal).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={3} className="py-2 text-right font-bold text-on-surface">Total</td>
                  <td className="py-2 text-right font-bold text-on-surface">${Number(order.total).toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {history && history.length > 0 && (
            <div className="bg-surface rounded-sm p-4">
              <h3 className="font-sans font-bold text-on-surface mb-3">Estado del pedido</h3>
              <OrderTimeline history={history} />
            </div>
          )}
        </div>

        <div className="space-y-4">
          {order.direccion_entrega_id && (
            <div className="bg-surface rounded-sm p-4">
              <h3 className="font-sans font-bold text-sm text-on-surface mb-2">Dirección de entrega</h3>
              <p className="text-sm text-on-surface-variant">ID: {order.direccion_entrega_id}</p>
            </div>
          )}
          {order.forma_pago_id && (
            <div className="bg-surface rounded-sm p-4">
              <h3 className="font-sans font-bold text-sm text-on-surface mb-2">Forma de pago</h3>
              <p className="text-sm text-on-surface-variant">ID: {order.forma_pago_id}</p>
            </div>
          )}
          {canCancel && (
            <button
              onClick={handleCancelClick}
              disabled={cancelMutation.isPending}
              className="w-full bg-danger/10 text-danger font-sans font-bold uppercase tracking-wider text-sm py-3 rounded-sm hover:bg-danger/20 transition-colors disabled:opacity-50"
            >
              {cancelMutation.isPending ? 'Cancelando...' : 'Cancelar pedido'}
            </button>
          )}
        </div>
      </div>

      {/* ── Modal de confirmación para cancelar pedido ─────────────── */}
      <ConfirmModal
        dialogRef={confirmCancelRef}
        title="Cancelar pedido"
        message={
          <>
            ¿Estás seguro de cancelar el pedido{' '}
            <strong className="text-rb-bone">#{order.id}</strong>?
            <br />
            <span className="text-rb-bone/50 text-[13px] mt-1 block">
              Esta acción es irreversible.
            </span>
          </>
        }
        confirmLabel="Cancelar pedido"
        onConfirm={handleConfirmCancel}
        onCancel={() => confirmCancelRef.current?.close()}
        isPending={cancelMutation.isPending}
      />
    </div>
  )
}
