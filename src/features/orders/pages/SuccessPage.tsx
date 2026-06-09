import { useEffect, useState } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import { apiClient } from '@/shared/lib/axios'
import { ButtonGeneric } from '@/shared/components/ButtonGeneric'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'

export function SuccessPage() {
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const [estado, setEstado] = useState<'verificando' | 'aprobado' | 'rechazado'>('verificando')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const paymentId = searchParams.get('payment_id')
    if (!id) return

    apiClient.post('/pagos/confirm', {
      pedido_id: Number(id),
      payment_id: paymentId ? Number(paymentId) : undefined,
    })
      .then(res => {
        setEstado(res.data.estado === 'aprobado' ? 'aprobado' : 'rechazado')
      })
      .catch(err => {
        setError(err?.response?.data?.detail || 'Error al verificar el pago')
        setEstado('rechazado')
      })
  }, [id, searchParams])

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 text-center">
      {estado === 'verificando' && (
        <>
          <Loader2 className="w-16 h-16 mx-auto mb-4 animate-spin text-blue-500" />
          <h1 className="text-2xl font-bold mb-2">Verificando pago...</h1>
          <p className="text-gray-600">Estamos confirmando tu pago con MercadoPago</p>
        </>
      )}

      {estado === 'aprobado' && (
        <>
          <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
          <h1 className="text-2xl font-bold mb-2">¡Pago aprobado!</h1>
          <p className="text-gray-600 mb-6">
            Tu pedido #{id} fue confirmado. Ya lo estamos preparando.
          </p>
          <Link to="/products">
            <ButtonGeneric info="Seguir comprando" />
          </Link>
        </>
      )}

      {estado === 'rechazado' && (
        <>
          <XCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
          <h1 className="text-2xl font-bold mb-2">Pago no procesado</h1>
          <p className="text-gray-600 mb-6">
            {error || 'El pago no pudo ser procesado. Podés intentar de nuevo desde el detalle del pedido.'}
          </p>
          <Link to={`/orders/${id}`}>
            <ButtonGeneric info="Ver pedido" />
          </Link>
        </>
      )}
    </div>
  )
}
