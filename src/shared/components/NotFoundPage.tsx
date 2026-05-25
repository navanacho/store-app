import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <span className="font-display text-display-lg text-rb-red">404</span>
      <p className="text-on-surface-variant text-lg mt-2">Página no encontrada</p>
      <p className="text-on-surface-variant/60 text-sm mt-1 mb-6">
        La página que buscás no existe o fue movida.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 bg-rb-red text-white text-sm font-sans font-bold uppercase tracking-wider px-6 py-3 rounded-md hover:bg-rb-red-hover transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver al inicio
      </Link>
    </div>
  )
}
