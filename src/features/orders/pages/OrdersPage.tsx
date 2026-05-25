import { useOrders } from '../hooks/useOrders'
import { OrderCard } from '../components/OrderCard'
import { LoadingSpinner } from '@/shared/components/LoadingSpinner'
import { PageHeader } from '@/shared/components/PageHeader'
import { Link } from 'react-router-dom'
import { PackageOpen } from 'lucide-react'

export function OrdersPage() {
  const { data: orders, isLoading, isError } = useOrders()

  if (isLoading) return <LoadingSpinner />

  if (isError) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center text-on-surface-variant">
        Error al cargar los pedidos
      </div>
    )
  }

  if (!orders?.length) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex flex-col items-center gap-4 text-on-surface-variant">
          <PackageOpen className="w-16 h-16" />
          <h2 className="text-headline-md text-on-surface">No tenés pedidos todavía</h2>
          <p className="text-body-sm text-on-surface-variant">Explorá nuestro catálogo y hacé tu primer pedido</p>
          <Link
            to="/"
            className="bg-rb-red text-white font-sans font-bold uppercase tracking-wider px-6 py-3 rounded-sm hover:bg-rb-red-hover transition-colors"
          >
            Ver catálogo
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-stack-lg max-w-3xl mx-auto px-4 py-8">
      <PageHeader title="Mis pedidos" subtitle="Seguí el estado de tus órdenes." />
      <div className="space-y-3">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  )
}
