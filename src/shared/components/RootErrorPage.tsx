import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom'

export function RootErrorPage() {
  const error = useRouteError()

  const message = isRouteErrorResponse(error)
    ? error.statusText
    : error instanceof Error
      ? error.message
      : 'Ocurrió un error inesperado'

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <h1 className="font-display text-headline-md text-rb-red">Algo salió mal</h1>
      <p className="text-on-surface-variant text-sm mt-2 mb-8 max-w-md text-center">
        {message}
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 bg-rb-red text-white text-sm font-sans font-bold uppercase tracking-wider px-6 py-3 rounded-md hover:bg-rb-red-hover transition-colors"
      >
        Volver al inicio
      </Link>
    </div>
  )
}
