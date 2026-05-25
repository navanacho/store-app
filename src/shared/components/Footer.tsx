import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="bg-rb-ink text-white/80">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-stack-lg">
          <div className="flex flex-col gap-stack-sm">
            <span className="font-display text-headline-md text-white">Rock 'N Burger</span>
            <p className="text-sm text-white/60 max-w-xs">
              El sabor del rock en cada mordida. Hamburguesas artesanales con actitud.
            </p>
          </div>

          <div className="flex flex-col gap-stack-sm">
            <span className="font-sans text-label-caps text-white">Navegación</span>
            <Link to="/" className="text-sm hover:text-white transition-colors">Inicio</Link>
            <Link to="/products" className="text-sm hover:text-white transition-colors">Catálogo</Link>
            <Link to="/contact" className="text-sm hover:text-white transition-colors">Contacto</Link>
          </div>

          <div className="flex flex-col gap-stack-sm">
            <span className="font-sans text-label-caps text-white">Seguinos</span>
            <a href="#" className="text-sm hover:text-white transition-colors">Instagram</a>
            <a href="#" className="text-sm hover:text-white transition-colors">Facebook</a>
            <a href="#" className="text-sm hover:text-white transition-colors">Twitter / X</a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 text-center text-xs text-white/40">
          &copy; {new Date().getFullYear()} Rock 'N Burger. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  )
}
