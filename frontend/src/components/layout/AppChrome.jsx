import { useLocation } from 'react-router-dom'
import { Navbar } from '../common/Navbar'
import { Footer } from '../common/Footer'

export function AppChrome({ children }) {
  const { pathname } = useLocation()
  const isAdminRoute = pathname.startsWith('/admin')

  if (isAdminRoute) {
    return <>{children}</>
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
