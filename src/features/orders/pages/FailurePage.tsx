import { Link } from 'react-router-dom'
import { ButtonGeneric } from '@/shared/components/ButtonGeneric'
import { XCircle } from 'lucide-react'

export function FailurePage() {
  return (
    <div className="max-w-lg mx-auto mt-10 p-6 text-center">
      <XCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
      <h1 className="text-2xl font-bold mb-2">Pago cancelado</h1>
      <p className="text-gray-600 mb-6">
        El pago fue cancelado o no pudo completarse. No se realizó ningún cobro.
        Tus productos siguen en el carrito para que puedas reintentar.
      </p>
      <Link to="/cart">
        <ButtonGeneric info="Volver al carrito" type="Secondary" />
      </Link>
    </div>
  )
}
