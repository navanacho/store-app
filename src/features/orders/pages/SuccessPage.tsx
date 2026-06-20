import { useEffect, useRef } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { apiClient } from '@/shared/lib/axios'
import { useCartStore } from '@/features/cart/store/cartStore'
import { LoadingSpinner } from '@/shared/components/LoadingSpinner'

interface ConfirmarPagoResponse {
  estado: string
  pedido_id: number | null
}

export function SuccessPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const clearCart = useCartStore(s => s.clearCart)
  const processed = useRef(false)

  useEffect(() => {
    if (processed.current) return
    processed.current = true

    const paymentId = searchParams.get('payment_id')
    if (!paymentId) {
      // Sin payment_id — no podemos confirmar
      navigate('/cart', { replace: true })
      return
    }

    apiClient.post<ConfirmarPagoResponse>('/pagos/confirm', {
      payment_id: Number(paymentId),
    })
      .then(res => {
        if (res.data.estado === 'approved' && res.data.pedido_id) {
          clearCart()
          navigate(`/orders/${res.data.pedido_id}`, { replace: true })
        } else {
          // Pago no aprobado → redirigir al carrito
          navigate('/cart', { replace: true })
        }
      })
      .catch(() => {
        // Si falla la verificación, intentamos ir al carrito
        navigate('/cart', { replace: true })
      })
  }, [searchParams, navigate, clearCart])

  // Spinner fugaz mientras se verifica
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <LoadingSpinner />
    </div>
  )
}
