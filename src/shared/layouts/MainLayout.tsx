import { Outlet } from 'react-router-dom'
import { StoreSidebar } from '@/shared/components/StoreSidebar'
import { Footer } from '@/shared/components/Footer'

export function MainLayout() {
  return (
    <div className="min-h-screen flex bg-rb-bone">
      <StoreSidebar />

      <div className="flex-1 flex flex-col lg:ml-sidebar min-h-screen">
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  )
}
