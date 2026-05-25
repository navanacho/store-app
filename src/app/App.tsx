import { RouterProvider } from 'react-router-dom'
import { Providers } from './providers'
import { router } from './router'
import { Toaster } from '@/shared/components/Toaster'

export function App() {
  return (
    <Providers>
      <RouterProvider router={router} />
      <Toaster />
    </Providers>
  )
}
