import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ShoppingBag, Loader2, AlertTriangle, ArrowLeft } from 'lucide-react'
import { useCartStore } from '@/features/cart/store/cartStore'
import { useCreateOrder } from '../hooks/useOrders'
import { useShippingConfig } from '../hooks/useShippingConfig'
import { useAddresses, useCreateAddress } from '@/features/addresses/hooks/useAddresses'
import { useQuery, useMutation } from '@tanstack/react-query'
import { apiClient } from '@/shared/lib/axios'
import { getProductById } from '@/features/products/services/productService'
import { toast, extractErrorMessage } from '@/shared/lib/toast'
import { LoadingSpinner } from '@/shared/components/LoadingSpinner'
import type { CreateAddressDto } from '@/features/addresses/types'

interface PaymentMethod {
  id: number
  nombre: string
  descripcion?: string
}

interface ListResponse<T> {
  data: T[]
  total: number
}

export function CheckoutPage() {
  const navigate = useNavigate()
  const { items, clearCart, shippingOption } = useCartStore()
  const createOrderMutation = useCreateOrder()
  const { data: shippingConfig } = useShippingConfig()
  const { data: addresses, isLoading: addressesLoading } = useAddresses()
  const createAddressMutation = useCreateAddress()

  const createPreferenceMutation = useMutation({
    mutationFn: (pedidoId: number) =>
      apiClient.post('/pagos/create-preference', { pedido_id: pedidoId }).then(r => r.data),
    onError: (err) => {
      toast.error('Error al conectar con MercadoPago', extractErrorMessage(err))
      setRedirecting(false)
    },
  })

  const { data: paymentMethods } = useQuery<PaymentMethod[]>({
    queryKey: ['payment-methods'],
    queryFn: async () => {
      const { data } = await apiClient.get<ListResponse<PaymentMethod>>('/pagos')
      return data.data
    },
  })

  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null)
  const [selectedPaymentId, setSelectedPaymentId] = useState<number | null>(null)
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isValidatingStock, setIsValidatingStock] = useState(false)
  const [stockErrors, setStockErrors] = useState<{ name: string; available: number; requested: number }[] | null>(null)
  const [redirecting, setRedirecting] = useState(false)
  const [newAddress, setNewAddress] = useState<CreateAddressDto>({
    alias: '',
    calle: '',
    numero: '',
    ciudad: '',
    provincia: '',
    codigo_postal: '',
  })
  const total = items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0)
  // Display value — el backend es la fuente de verdad
  const costoEnvio = shippingOption === 'delivery' ? (shippingConfig?.delivery ?? 0) : 0
  const totalWithShipping = total + costoEnvio

  const handleCreateAddress = async (e: React.FormEvent) => {
    e.preventDefault()
    createAddressMutation.mutate(newAddress, {
      onSuccess: (data) => {
        setSelectedAddressId(data.id)
        setShowAddressForm(false)
        setNewAddress({ alias: '', calle: '', numero: '', ciudad: '', provincia: '', codigo_postal: '' })
      },
    })
  }

  const handleConfirmOrder = async () => {
    if (!selectedPaymentId) return
    if (shippingOption === 'delivery' && !selectedAddressId) return

    // ── Validar stock actual de cada producto ────────────────
    setStockErrors(null)
    setIsValidatingStock(true)

    const errors: { name: string; available: number; requested: number }[] = []
    for (const item of items) {
      try {
        const product = await getProductById(item.id)
        if (item.quantity > product.available_stock) {
          errors.push({
            name: product.name,
            available: product.available_stock,
            requested: item.quantity,
          })
        }
      } catch {
        // Si falla la consulta, dejamos pasar
      }
    }

    setIsValidatingStock(false)

    if (errors.length > 0) {
      setStockErrors(errors)
      for (const err of errors) {
        toast.error(
          'Stock insuficiente',
          `${err.name}: pediste ${err.requested}, disponible ${err.available}`,
        )
      }
      return
    }

    const selectedMethod = paymentMethods?.find(p => p.id === selectedPaymentId)
    const isMercadoPago = selectedMethod?.nombre?.toLowerCase().includes('mercadopago') ||
                          selectedMethod?.nombre?.toLowerCase().includes('mercado pago')

    setIsSubmitting(true)
    createOrderMutation.mutate(
      {
        direccion_entrega_id: shippingOption === 'delivery' ? selectedAddressId! : (selectedAddressId ?? 1),
        forma_pago_id: selectedPaymentId,
        tipo_envio: shippingOption,
        detalles: items.map((i) => ({ producto_id: i.id, cantidad: i.quantity })),
      },
      {
        onSuccess: (order) => {
          clearCart()
          if (isMercadoPago) {
            setRedirecting(true)
            createPreferenceMutation.mutate(order.id, {
              onSuccess: (data) => {
                if (data.init_point) {
                  window.location.href = data.init_point
                }
              },
            })
          } else {
            navigate(`/orders/${order.id}`)
          }
        },
      },
    )
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <ShoppingBag className="w-16 h-16 mx-auto text-on-surface-variant mb-4" />
        <h2 className="font-display text-headline-md text-on-surface">Tu carrito está vacío</h2>
        <p className="text-on-surface-variant mt-2">Agregá productos antes de hacer el checkout</p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link
        to="/cart"
        className="inline-flex items-center gap-1.5 text-sm text-on-surface-variant hover:text-on-surface transition-colors mb-4"
      >
        <ArrowLeft size={16} />
        Volver al carrito
      </Link>
      <h1 className="text-headline-md text-on-surface mb-6">Checkout</h1>

      <div className="space-y-6">
        <div className="bg-surface rounded-sm p-4">
          <h3 className="font-sans font-bold text-on-surface mb-3">Resumen del pedido</h3>
          {items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm py-1">
              <span className="text-on-surface-variant">{item.name} x{item.quantity}</span>
              <span className="text-on-surface">${(Number(item.price) * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="border-t border-outline-variant/30 pt-2 mt-2 space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-on-surface-variant">Subtotal</span>
              <span className="text-on-surface">${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-on-surface-variant">Envío</span>
              <span className="text-on-surface">{costoEnvio === 0 ? 'Gratis' : `$${costoEnvio.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between font-bold text-on-surface pt-2 border-t border-outline-variant/30">
              <span>Total</span>
              <span>${totalWithShipping.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {shippingOption === 'delivery' && (
        <div className="bg-surface rounded-sm p-4">
          <h3 className="font-sans font-bold text-on-surface mb-3">Dirección de entrega</h3>
          {addressesLoading ? (
            <LoadingSpinner />
          ) : addresses && addresses.length > 0 && !showAddressForm ? (
            <div className="space-y-2">
              {addresses.map((addr) => (
                <label key={addr.id} className="flex items-center gap-3 p-3 rounded-sm border border-outline-variant/30 cursor-pointer hover:bg-surface-container transition-colors">
                  <input
                    type="radio"
                    name="address"
                    checked={selectedAddressId === addr.id}
                    onChange={() => setSelectedAddressId(addr.id)}
                    className="accent-rb-red"
                  />
                  <div className="text-sm">
                    <p className="text-on-surface font-medium">{addr.alias}</p>
                    <p className="text-on-surface-variant/60">{addr.calle} {addr.numero}, {addr.ciudad}</p>
                  </div>
                </label>
              ))}
              <button
                onClick={() => setShowAddressForm(true)}
                className="text-sm text-rb-red hover:underline mt-2"
              >
                + Agregar nueva dirección
              </button>
            </div>
          ) : (
            <form onSubmit={handleCreateAddress} className="space-y-3">
              <input
                type="text"
                placeholder="Alias (ej: Casa, Trabajo)"
                value={newAddress.alias}
                onChange={(e) => setNewAddress({ ...newAddress, alias: e.target.value })}
                required
                className="w-full px-4 py-2.5 bg-surface-container rounded-sm text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-rb-red"
              />
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Calle"
                  value={newAddress.calle}
                  onChange={(e) => setNewAddress({ ...newAddress, calle: e.target.value })}
                  required
                  className="flex-1 px-4 py-2.5 bg-surface-container rounded-sm text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-rb-red"
                />
                <input
                  type="text"
                  placeholder="Número"
                  value={newAddress.numero}
                  onChange={(e) => setNewAddress({ ...newAddress, numero: e.target.value })}
                  required
                  className="w-28 px-4 py-2.5 bg-surface-container rounded-sm text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-rb-red"
                />
              </div>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Ciudad"
                  value={newAddress.ciudad}
                  onChange={(e) => setNewAddress({ ...newAddress, ciudad: e.target.value })}
                  required
                  className="flex-1 px-4 py-2.5 bg-surface-container rounded-sm text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-rb-red"
                />
                <input
                  type="text"
                  placeholder="Provincia"
                  value={newAddress.provincia}
                  onChange={(e) => setNewAddress({ ...newAddress, provincia: e.target.value })}
                  required
                  className="flex-1 px-4 py-2.5 bg-surface-container rounded-sm text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-rb-red"
                />
              </div>
              <input
                type="text"
                placeholder="Código postal"
                value={newAddress.codigo_postal}
                onChange={(e) => setNewAddress({ ...newAddress, codigo_postal: e.target.value })}
                className="w-full px-4 py-2.5 bg-surface-container rounded-sm text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-rb-red"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={createAddressMutation.isPending}
                  className="bg-rb-red text-white text-sm font-sans font-bold uppercase tracking-wider px-4 py-2 rounded-sm hover:bg-rb-red-hover transition-colors"
                >
                  {createAddressMutation.isPending ? 'Guardando...' : 'Guardar dirección'}
                </button>
                {addresses && addresses.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowAddressForm(false)}
                    className="text-sm text-on-surface-variant hover:text-on-surface"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
        )}

        <div className="bg-surface rounded-sm p-4">
          <h3 className="font-sans font-bold text-on-surface mb-3">Forma de pago</h3>
          {paymentMethods && paymentMethods.length > 0 ? (
            <div className="space-y-2">
              {paymentMethods.map((pm) => (
                <label key={pm.id} className="flex items-center gap-3 p-3 rounded-sm border border-outline-variant/30 cursor-pointer hover:bg-surface-container transition-colors">
                  <input
                    type="radio"
                    name="payment"
                    checked={selectedPaymentId === pm.id}
                    onChange={() => setSelectedPaymentId(pm.id)}
                    className="accent-rb-red"
                  />
                  <div className="text-sm">
                    <p className="text-on-surface font-medium">{pm.nombre}</p>
                    {pm.descripcion && <p className="text-on-surface-variant/60">{pm.descripcion}</p>}
                  </div>
                </label>
              ))}
            </div>
          ) : (
            <p className="text-sm text-on-surface-variant">Cargando formas de pago...</p>
          )}
        </div>

        <button
          onClick={handleConfirmOrder}
          disabled={!selectedPaymentId || (shippingOption === 'delivery' && !selectedAddressId) || createOrderMutation.isPending || isValidatingStock || redirecting}
          className="w-full bg-rb-red text-white font-sans font-bold uppercase tracking-wider py-4 rounded-sm hover:bg-rb-red-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-red flex items-center justify-center gap-2"
        >
          {createOrderMutation.isPending || isValidatingStock || redirecting ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : null}
          {isValidatingStock ? 'Validando stock...' : redirecting ? 'Redirigiendo a MercadoPago...' : createOrderMutation.isPending ? 'Procesando...' : 'Confirmar pedido'}
        </button>

        {createOrderMutation.isError && (
          <div className="bg-danger/10 text-danger text-sm p-3 rounded-sm">
            Error al crear el pedido. Intentalo de nuevo.
          </div>
        )}
      </div>
    </div>
  )
}
