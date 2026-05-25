import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Home,
  Store,
  ShoppingCart,
  ClipboardList,
  MapPin,
  LogIn,
  LogOut,
  User,
  Shield,
  Menu,
  X,
} from 'lucide-react'
import { useAuthStore } from '@/features/auth/store/authStore'
import { useCartStore } from '@/features/cart/store/cartStore'
import { useLogout } from '@/features/auth/hooks/useAuth'

interface NavItem {
  label: string
  icon: typeof Home
  to: string
  requiresAuth: boolean
  requiredRole?: string
}

const navItems: NavItem[] = [
  { label: 'Inicio',       icon: Home,          to: '/',         requiresAuth: false },
  { label: 'Catálogo',     icon: Store,         to: '/products', requiresAuth: false },
  { label: 'Carrito',      icon: ShoppingCart,  to: '/cart',     requiresAuth: false },
  { label: 'Mis pedidos',  icon: ClipboardList, to: '/orders',   requiresAuth: true  },
  { label: 'Direcciones',  icon: MapPin,        to: '/addresses', requiresAuth: true  },
]

export function StoreSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { pathname } = useLocation()
  const { isAuthenticated, user } = useAuthStore()
  const cartCount = useCartStore((s) => s.items.reduce((acc, i) => acc + i.quantity, 0))
  const logoutMutation = useLogout()

  const hasAdminRole = user?.roles?.some((r) => r.rol_code === 'ADMIN') ?? false

  const visibleItems = navItems.filter((item) => {
    if (!item.requiresAuth) return true
    return isAuthenticated
  })

  if (hasAdminRole) {
    visibleItems.push({
      label: 'Panel Admin',
      icon: Shield,
      to: '/admin',
      requiresAuth: true,
    })
  }

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/'
    return pathname.startsWith(path)
  }

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 mb-10">
        <Link to="/" className="text-headline-md text-primary hover:opacity-80 transition-opacity">
          ROCK 'N BURGER
        </Link>
        <p className="text-label-caps text-rb-bone/40 mt-1">STORE</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 px-3" aria-label="Store navigation">
        {visibleItems.map(({ label, icon: Icon, to }) => {
          const active = isActive(to)
          return (
            <Link
              key={label}
              to={to}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-sm transition-colors duration-200 ${
                active
                  ? 'bg-primary-container/10 text-rb-bone font-bold border-l-4 border-primary'
                  : 'text-rb-bone/60 hover:text-rb-bone hover:bg-rb-bone/5'
              }`}
              aria-current={active ? 'page' : undefined}
            >
              <Icon size={20} aria-hidden="true" />
              <span className="font-sans text-sm">
                {label}
                {label === 'Carrito' && cartCount > 0 && (
                  <span className="ml-2 bg-rb-red text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </span>
            </Link>
          )
        })}
      </nav>

      {/* User section */}
      <div className="px-3 mt-auto pb-6 border-t border-rb-bone/10 pt-4">
        {isAuthenticated ? (
          <div className="space-y-2">
            <div className="flex items-center gap-3 px-4 py-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-sans text-rb-bone truncate">
                  {user?.full_name || user?.username || 'Usuario'}
                </p>
                <p className="text-xs text-rb-bone/40 truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={() => {
                logoutMutation.mutate()
              }}
              disabled={logoutMutation.isPending}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-sm text-rb-bone/60 hover:text-rb-bone hover:bg-rb-bone/5 transition-colors text-sm"
            >
              <LogOut size={18} />
              <span className="font-sans">{logoutMutation.isPending ? 'Saliendo...' : 'Cerrar sesión'}</span>
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-sm text-rb-bone/60 hover:text-rb-bone hover:bg-rb-bone/5 transition-colors"
          >
            <LogIn size={18} />
            <span className="font-sans text-sm">Ingresar</span>
          </Link>
        )}
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-rb-ink text-rb-bone p-2.5 rounded-sm shadow-ink"
        aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-sidebar flex-col fixed left-0 top-0 h-screen z-40 bg-rb-ink shadow-xl">
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        >
          <aside
            className="w-72 h-full bg-rb-ink shadow-xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  )
}
