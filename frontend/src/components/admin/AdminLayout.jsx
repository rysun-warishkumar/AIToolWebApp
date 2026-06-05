import { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Wrench, BookMarked, GraduationCap, LogOut, Menu, X, ExternalLink } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
  { icon: Wrench, label: 'Tools', path: '/admin/tools' },
  { icon: BookMarked, label: 'Prompts', path: '/admin/prompts' },
  { icon: GraduationCap, label: 'Articles', path: '/admin/articles' },
]

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { admin, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-dark-900">
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } shrink-0 bg-white dark:bg-dark-800 border-r border-gray-200 dark:border-dark-700 transition-all duration-300 flex flex-col sticky top-0 h-screen`}
      >
        <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-dark-700">
          {sidebarOpen && (
            <Link to="/admin" className="font-bold text-primary-600">
              Admin Panel
            </Link>
          )}
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 hover:bg-gray-100 dark:hover:bg-dark-700 rounded"
            aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                  isActive
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700'
                }`
              }
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {sidebarOpen && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-dark-700 space-y-3">
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 ${
              sidebarOpen ? 'px-4' : 'justify-center'
            }`}
          >
            <ExternalLink className="w-4 h-4 shrink-0" />
            {sidebarOpen && 'View public site'}
          </Link>
          {sidebarOpen && (
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400 px-4">Logged in as</p>
              <p className="font-medium text-sm truncate px-4">{admin?.email}</p>
            </div>
          )}
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/40 transition-colors text-sm"
          >
            <LogOut className="w-4 h-4" />
            {sidebarOpen && 'Logout'}
          </button>
        </div>
      </aside>

      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  )
}
