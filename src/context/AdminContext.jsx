import { createContext, useContext, useState, useEffect } from 'react'
import { getApiUrl } from '../utils/api'

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
      const response = await fetch(getApiUrl('/api/check_admin_session.php'), {
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
    const apiUrl = getApiUrl('/api/admin_login.php')
    console.log('🌐 [ADMIN] Attempting admin login to:', apiUrl)
    
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      })
      
      console.log('📡 [ADMIN] Admin login response status:', response.status, response.statusText)
      
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text()
        console.error('❌ [ADMIN] Non-JSON response:', textResponse.substring(0, 200))
        
        if (textResponse.includes('MySQL Connection failed') || textResponse.includes('Database connection')) {
          console.error('🗄️ [ADMIN] Database connection error detected!')
          return { success: false, message: 'Database connection error. Please contact administrator.' }
        }
        
        return { success: false, message: 'Backend server error. Invalid response format.' }
      }
      
      const result = await response.json()
      console.log('📦 [ADMIN] Admin login response:', result)
      
      if (result.success) {
        console.log('✅ [ADMIN] Admin login successful')
        setIsAdmin(true)
        setAdmin(result.admin)
        return { success: true, isAdmin: true }
      } else {
        console.warn('⚠️ [ADMIN] Admin login failed:', result.message)
        
        if (result.message && (result.message.includes('Database') || result.message.includes('database') || result.message.includes('MySQL'))) {
          console.error('🗄️ [ADMIN] Database error detected!')
        }
        
        return { success: false, message: result.message }
      }
    } catch (error) {
      console.error('❌ [ADMIN] Admin login error:', error)
      console.error('❌ [ADMIN] Error details:', {
        name: error.name,
        message: error.message
      })
      
      if (error.message && (error.message.includes('Failed to fetch') || error.message.includes('NetworkError'))) {
        console.error('🌐 [ADMIN] Network/Backend connection error!')
        return { success: false, message: 'Cannot connect to backend server. Please check your internet connection.' }
      }
      
      return { success: false, message: 'Admin login failed. Please try again.' }
    }
  }

  const adminLogout = async () => {
    try {
      await fetch(getApiUrl('/api/admin_logout.php'), {
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

