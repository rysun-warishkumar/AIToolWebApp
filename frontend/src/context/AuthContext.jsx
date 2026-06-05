import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if token exists
    const token = localStorage.getItem('authToken')
    if (token) {
      setIsAuthenticated(true)
      // Try to get admin data
      const adminData = localStorage.getItem('admin')
      if (adminData) {
        setAdmin(JSON.parse(adminData))
      }
    }
    setLoading(false)
  }, [])

  const login = (token, adminData) => {
    localStorage.setItem('authToken', token)
    localStorage.setItem('admin', JSON.stringify(adminData))
    setIsAuthenticated(true)
    setAdmin(adminData)
  }

  const logout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('admin')
    setIsAuthenticated(false)
    setAdmin(null)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, admin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
