import { createBrowserRouter } from 'react-router-dom'
import { MainLayout } from '@/shared/layouts/MainLayout'
import { AuthLayout } from '@/shared/layouts/AuthLayout'
import { NotFoundPage } from '@/shared/components/NotFoundPage'
import { RootErrorPage } from '@/shared/components/RootErrorPage'
import { HomePage } from '@/features/products/pages/HomePage'
import { CatalogPage } from '@/features/products/pages/CatalogPage'
import { ProductDetailPage } from '@/features/products/pages/ProductDetailPage'
import { CartPage } from '@/features/cart/pages/CartPage'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { RegisterPage } from '@/features/auth/pages/RegisterPage'
import { OrdersPage } from '@/features/orders/pages/OrdersPage'
import { OrderDetailPage } from '@/features/orders/pages/OrderDetailPage'
import { CheckoutPage } from '@/features/orders/pages/CheckoutPage'
import { SuccessPage } from '@/features/orders/pages/SuccessPage'
import { FailurePage } from '@/features/orders/pages/FailurePage'
import { AddressesPage } from '@/features/addresses/pages/AddressesPage'
import { ProtectedRoute } from './ProtectedRoute'

export const router = createBrowserRouter([
  // Auth routes — sin sidebar, centradas
  {
    element: <AuthLayout />,
    errorElement: <RootErrorPage />,
    children: [
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
    ],
  },

  // App routes — con sidebar y footer
  {
    path: '/',
    errorElement: <RootErrorPage />,
    element: <MainLayout />,
    children: [
      // Públicas
      { index: true, element: <HomePage /> },
      { path: 'products', element: <CatalogPage /> },
      { path: 'products/:id', element: <ProductDetailPage /> },
      { path: 'cart', element: <CartPage /> },

      // Protegidas
      {
        element: <ProtectedRoute />,
        children: [
          { path: 'checkout', element: <CheckoutPage /> },
          { path: 'orders', element: <OrdersPage /> },
          { path: 'orders/:id', element: <OrderDetailPage /> },
          { path: 'orders/:id/success', element: <SuccessPage /> },
          { path: 'orders/:id/failure', element: <FailurePage /> },
          { path: 'addresses', element: <AddressesPage /> },
        ],
      },

      // Catch-all (solo dentro del MainLayout)
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
