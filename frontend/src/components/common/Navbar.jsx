import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Moon, Sun } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { isDark, toggle } = useTheme()
  const location = useLocation()

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/')

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-dark-800 border-b border-gray-200 dark:border-dark-700 backdrop-blur-md bg-opacity-95 dark:bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-400 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-bold">AI</span>
            </div>
            <span className="font-bold text-xl text-gray-900 dark:text-white hidden sm:inline">
              AI Tools
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className={`font-medium transition-colors ${isActive('/') && !isActive('/tools') && !isActive('/prompts') && !isActive('/learning') && !isActive('/about') && !isActive('/contact') ? 'text-primary-600' : 'text-gray-700 dark:text-gray-300 hover:text-primary-600'}`}
            >
              Home
            </Link>
            <Link
              to="/tools"
              className={`font-medium transition-colors ${isActive('/tools') ? 'text-primary-600' : 'text-gray-700 dark:text-gray-300 hover:text-primary-600'}`}
            >
              Tools
            </Link>
            <Link
              to="/prompts"
              className={`font-medium transition-colors ${isActive('/prompts') ? 'text-primary-600' : 'text-gray-700 dark:text-gray-300 hover:text-primary-600'}`}
            >
              Prompts
            </Link>
            <Link
              to="/learning"
              className={`font-medium transition-colors ${isActive('/learning') ? 'text-primary-600' : 'text-gray-700 dark:text-gray-300 hover:text-primary-600'}`}
            >
              Learning Zone
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={toggle}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-gray-700" />}
            </button>

            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4 border-t border-gray-200 dark:border-dark-700">
            <Link to="/" className="block py-2 text-gray-700 dark:text-gray-300 hover:text-primary-600" onClick={() => setIsOpen(false)}>
              Home
            </Link>
            <Link to="/tools" className="block py-2 text-gray-700 dark:text-gray-300 hover:text-primary-600" onClick={() => setIsOpen(false)}>
              Tools
            </Link>
            <Link to="/prompts" className="block py-2 text-gray-700 dark:text-gray-300 hover:text-primary-600" onClick={() => setIsOpen(false)}>
              Prompts
            </Link>
            <Link to="/learning" className="block py-2 text-gray-700 dark:text-gray-300 hover:text-primary-600" onClick={() => setIsOpen(false)}>
              Learning Zone
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
