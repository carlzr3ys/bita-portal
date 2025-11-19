import { createContext, useContext, useState, useEffect } from 'react'

const AdminContext = createContext()

export function AdminProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(false)
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAdminAuth()
  }, [])

  const checkAdminAuth = async () => {
    try {
      const response = await fetch('/api/check_admin_session.php', {
        credentials: 'include'
      })
      const result = await response.json()
      
      if (result.success && result.authenticated) {
        setIsAdmin(true)
        setAdmin(result.admin)
      } else {
        setIsAdmin(false)
        setAdmin(null)
      }
    } catch (error) {
      console.error('Admin auth check error:', error)
      setIsAdmin(false)
      setAdmin(null)
    } finally {
      setLoading(false)
    }
  }

  const adminLogin = async (email, password) => {
    try {
      const response = await fetch('/api/admin_login.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      })
      
      const result = await response.json()
      
      if (result.success) {
        setIsAdmin(true)
        setAdmin(result.admin)
        return { success: true, isAdmin: true }
      } else {
        return { success: false, message: result.message }
      }
    } catch (error) {
      console.error('Admin login error:', error)
      return { success: false, message: 'Admin login failed. Please try again.' }
    }
  }

  const adminLogout = async () => {
    try {
      await fetch('/api/admin_logout.php', {
        credentials: 'include'
      })
      setIsAdmin(false)
      setAdmin(null)
    } catch (error) {
      console.error('Admin logout error:', error)
      setIsAdmin(false)
      setAdmin(null)
    }
  }

  const value = {
    isAdmin,
    admin,
    loading,
    checkAdminAuth,
    adminLogin,
    adminLogout
  }

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider')
  }
  return context
}

