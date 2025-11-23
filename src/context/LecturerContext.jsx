import { createContext, useContext, useState, useEffect } from 'react'
import { getApiUrl } from '../utils/api'

const LecturerContext = createContext()

export function LecturerProvider({ children }) {
  const [isLecturer, setIsLecturer] = useState(false)
  const [lecturer, setLecturer] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkLecturerAuth()
  }, [])

  const checkLecturerAuth = async () => {
    try {
      const response = await fetch(getApiUrl('/api/check_lecturer_session.php'), {
        credentials: 'include'
      })
      const result = await response.json()
      
      if (result.success && result.authenticated) {
        setIsLecturer(true)
        setLecturer(result.lecturer)
      } else {
        setIsLecturer(false)
        setLecturer(null)
      }
    } catch (error) {
      console.error('Lecturer auth check error:', error)
      setIsLecturer(false)
      setLecturer(null)
    } finally {
      setLoading(false)
    }
  }

  const lecturerLogin = async (email, password) => {
    const apiUrl = getApiUrl('/api/lecturer_login.php')
    console.log('🌐 [LECTURER] Attempting lecturer login to:', apiUrl)
    
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      })
      
      console.log('📡 [LECTURER] Lecturer login response status:', response.status, response.statusText)
      
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text()
        console.error('❌ [LECTURER] Non-JSON response:', textResponse.substring(0, 200))
        
        if (textResponse.includes('MySQL Connection failed') || textResponse.includes('Database connection')) {
          console.error('🗄️ [LECTURER] Database connection error detected!')
          return { success: false, message: 'Database connection error. Please contact administrator.' }
        }
        
        return { success: false, message: 'Backend server error. Invalid response format.' }
      }
      
      const result = await response.json()
      console.log('📦 [LECTURER] Lecturer login response:', result)
      
      if (result.success) {
        console.log('✅ [LECTURER] Lecturer login successful')
        setIsLecturer(true)
        setLecturer(result.lecturer)
        return { success: true, isLecturer: true }
      } else {
        console.warn('⚠️ [LECTURER] Lecturer login failed:', result.message)
        
        if (result.message && (result.message.includes('Database') || result.message.includes('database') || result.message.includes('MySQL'))) {
          console.error('🗄️ [LECTURER] Database error detected!')
        }
        
        return { success: false, message: result.message }
      }
    } catch (error) {
      console.error('❌ [LECTURER] Lecturer login error:', error)
      console.error('❌ [LECTURER] Error details:', {
        name: error.name,
        message: error.message
      })
      
      if (error.message && (error.message.includes('Failed to fetch') || error.message.includes('NetworkError'))) {
        console.error('🌐 [LECTURER] Network/Backend connection error!')
        return { success: false, message: 'Cannot connect to backend server. Please check your internet connection.' }
      }
      
      return { success: false, message: 'Lecturer login failed. Please try again.' }
    }
  }

  const lecturerLogout = async () => {
    try {
      await fetch(getApiUrl('/api/lecturer_logout.php'), {
        credentials: 'include'
      })
      setIsLecturer(false)
      setLecturer(null)
    } catch (error) {
      console.error('Lecturer logout error:', error)
      setIsLecturer(false)
      setLecturer(null)
    }
  }

  const value = {
    isLecturer,
    lecturer,
    loading,
    checkLecturerAuth,
    lecturerLogin,
    lecturerLogout
  }

  return (
    <LecturerContext.Provider value={value}>
      {children}
    </LecturerContext.Provider>
  )
}

export function useLecturer() {
  const context = useContext(LecturerContext)
  if (!context) {
    throw new Error('useLecturer must be used within LecturerProvider')
  }
  return context
}

