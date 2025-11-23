import { createContext, useContext, useState, useEffect } from 'react'
import { getApiUrl } from '../utils/api'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      // Node.js endpoint: /api/auth/check_session (bukan /api/check_session.php)
      const apiUrl = getApiUrl('/api/auth/check_session')
      console.log('🔍 [AUTH] Checking session:', apiUrl)
      
      const response = await fetch(apiUrl, {
        credentials: 'include'
      })
      
      console.log('📡 [AUTH] Session check response status:', response.status)
      
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text()
        console.error('❌ [AUTH] Non-JSON response in session check:', textResponse.substring(0, 200))
        setIsAuthenticated(false)
        setUser(null)
        setLoading(false)
        return
      }
      
      const result = await response.json()
      console.log('📦 [AUTH] Session check result:', result)
      
      if (result.success && result.authenticated) {
        console.log('✅ [AUTH] User authenticated')
        setIsAuthenticated(true)
        setUser({
          id: result.user_id,
          name: result.user_name,
          email: result.user_email
        })
      } else {
        console.log('ℹ️ [AUTH] User not authenticated')
        setIsAuthenticated(false)
        setUser(null)
      }
    } catch (error) {
      console.error('❌ [AUTH] Session check error:', error)
      console.error('❌ [AUTH] Error details:', {
        name: error.name,
        message: error.message
      })
      
      if (error.message && (error.message.includes('Failed to fetch') || error.message.includes('NetworkError'))) {
        console.error('🌐 [AUTH] Backend connection error during session check!')
      }
      
      setIsAuthenticated(false)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    // Node.js endpoint: /api/auth/login (bukan /api/login.php)
    const apiUrl = getApiUrl('/api/auth/login')
    console.log('🌐 [AUTH] Attempting user login to:', apiUrl)
    
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      })
      
      console.log('📡 [AUTH] Login response status:', response.status, response.statusText)
      
      // Check if response is JSON
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text()
        console.error('❌ [AUTH] Non-JSON response received:', textResponse.substring(0, 200))
        
        // Check for database connection errors in HTML response
        if (textResponse.includes('MySQL Connection failed') || textResponse.includes('Database connection')) {
          console.error('🗄️ [AUTH] Database connection error detected in response!')
          return { success: false, message: 'Database connection error. Please contact administrator.' }
        }
        
        return { success: false, message: 'Backend server error. Invalid response format.' }
      }
      
      const result = await response.json()
      console.log('📦 [AUTH] Login response data:', result)
      
      if (result.success) {
        console.log('✅ [AUTH] User login successful')
        setIsAuthenticated(true)
        setUser(result.user)
        return { success: true }
      } else {
        console.warn('⚠️ [AUTH] User login failed:', result.message)
        
        // Check for database errors in message
        if (result.message && (result.message.includes('Database') || result.message.includes('database') || result.message.includes('MySQL'))) {
          console.error('🗄️ [AUTH] Database error in login response!')
        }
        
        return { success: false, message: result.message }
      }
    } catch (error) {
      console.error('❌ [AUTH] Login request error:', error)
      console.error('❌ [AUTH] Error details:', {
        name: error.name,
        message: error.message,
        type: error.constructor.name
      })
      
      // Detect specific error types
      if (error.message && (error.message.includes('Failed to fetch') || error.message.includes('NetworkError') || error.message.includes('network'))) {
        console.error('🌐 [AUTH] Network/Backend connection error detected!')
        return { success: false, message: 'Cannot connect to backend server. Please check your internet connection.' }
      }
      
      if (error.message && error.message.includes('timeout')) {
        console.error('⏱️ [AUTH] Request timeout detected!')
        return { success: false, message: 'Request timeout. Backend server may be slow. Please try again.' }
      }
      
      return { success: false, message: 'Login failed. Please try again.' }
    }
  }

  const logout = async () => {
    try {
      // Node.js endpoint: /api/auth/logout (bukan /api/logout.php)
      await fetch(getApiUrl('/api/auth/logout'), {
        method: 'POST',
        credentials: 'include'
      })
      setIsAuthenticated(false)
      setUser(null)
    } catch (error) {
      console.error('Logout error:', error)
      setIsAuthenticated(false)
      setUser(null)
    }
  }

  const value = {
    isAuthenticated,
    user,
    loading,
    checkAuth,
    login,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

