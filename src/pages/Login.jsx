import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useAdmin } from '../context/AdminContext'
import { useLecturer } from '../context/LecturerContext'
import { getApiUrl } from '../utils/api'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { login, isAuthenticated } = useAuth()
  const { adminLogin, isAdmin } = useAdmin()
  const { lecturerLogin, isLecturer } = useLecturer()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (isAuthenticated && !isAdmin && !isLecturer) {
      const from = location.state?.from?.pathname || '/dashboard'
      navigate(from, { replace: true })
    } else if (isAdmin) {
      navigate('/admin/dashboard', { replace: true })
    } else if (isLecturer) {
      navigate('/lecturer/dashboard', { replace: true })
    }
  }, [isAuthenticated, isAdmin, isLecturer, navigate, location])

  const validateEmail = (email) => {
    // Remove validation for admin emails - allow any email format
    // Admin emails might not be @student.utem.edu.my
    setEmailError('')
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    console.log('🔵 [LOGIN] Form submitted')
    console.log('📧 Email:', email ? email.substring(0, 3) + '***' : 'empty')
    
    // Clear previous errors
    setEmailError('')
    setPasswordError('')
    setLoginError('')

    // Validate
    if (!email.trim()) {
      setEmailError('Email is required')
      console.warn('⚠️ [LOGIN] Email validation failed: Email is required')
      return
    }

    if (!password) {
      setPasswordError('Password is required')
      console.warn('⚠️ [LOGIN] Password validation failed: Password is required')
      return
    }

    setLoading(true)
    console.log('⏳ [LOGIN] Starting login process...')

    try {
      // Check backend connectivity first
      const apiUrl = getApiUrl('/api/test_backend')
      console.log('🔗 [LOGIN] Testing backend connection:', apiUrl)
      
      try {
        const backendTest = await fetch(apiUrl, {
          method: 'GET',
          credentials: 'include',
          signal: AbortSignal.timeout(5000) // 5 second timeout
        })
        
        if (!backendTest.ok) {
          console.error('❌ [LOGIN] Backend not responding:', backendTest.status, backendTest.statusText)
          setLoginError('Backend server is not responding. Please try again later.')
          setLoading(false)
          return
        }
        
        const backendResult = await backendTest.json()
        console.log('✅ [LOGIN] Backend connection OK:', backendResult)
      } catch (backendError) {
        console.error('❌ [LOGIN] Backend connection failed:', backendError.message)
        if (backendError.name === 'AbortError' || backendError.name === 'TimeoutError') {
          setLoginError('Backend connection timeout. The server may be slow or unavailable. Please try again.')
        } else if (backendError.message.includes('Failed to fetch') || backendError.message.includes('NetworkError')) {
          setLoginError('Cannot connect to backend server. Please check your internet connection.')
        } else {
          setLoginError('Backend server error. Please try again later.')
        }
        setLoading(false)
        return
      }

      // Try lecturer login first (check if email is lecturer email)
      const isStudentEmail = email.endsWith('@student.utem.edu.my')
      console.log('👤 [LOGIN] Email type:', isStudentEmail ? 'Student' : 'Non-student')
      
      if (!isStudentEmail) {
        console.log('🔍 [LOGIN] Trying lecturer login...')
        const lecturerResult = await lecturerLogin(email, password)
        console.log('📊 [LOGIN] Lecturer login result:', lecturerResult.success ? '✅ Success' : '❌ Failed')
        
        if (lecturerResult.success) {
          console.log('✅ [LOGIN] Lecturer login successful, redirecting to lecturer dashboard')
          navigate('/lecturer/dashboard', { replace: true })
          return
        }
        
        console.log('🔍 [LOGIN] Trying admin login...')
        const adminResult = await adminLogin(email, password)
        console.log('📊 [LOGIN] Admin login result:', adminResult.success ? '✅ Success' : '❌ Failed')
        
        if (adminResult.success) {
          console.log('✅ [LOGIN] Admin login successful, redirecting to admin dashboard')
          navigate('/admin/dashboard', { replace: true })
          return
        }
      } else {
        console.log('🔍 [LOGIN] Trying lecturer login (student email)...')
        const lecturerResult = await lecturerLogin(email, password)
        console.log('📊 [LOGIN] Lecturer login result:', lecturerResult.success ? '✅ Success' : '❌ Failed')
        
        if (lecturerResult.success) {
          console.log('✅ [LOGIN] Lecturer login successful, redirecting to lecturer dashboard')
          navigate('/lecturer/dashboard', { replace: true })
          return
        }
        
        console.log('🔍 [LOGIN] Trying admin login (student email)...')
        const adminResult = await adminLogin(email, password)
        console.log('📊 [LOGIN] Admin login result:', adminResult.success ? '✅ Success' : '❌ Failed')
        
        if (adminResult.success) {
          console.log('✅ [LOGIN] Admin login successful, redirecting to admin dashboard')
          navigate('/admin/dashboard', { replace: true })
          return
        }
      }

      // If lecturer and admin login failed, try user login
      console.log('🔍 [LOGIN] Trying user login...')
      const result = await login(email, password)
      console.log('📊 [LOGIN] User login result:', result.success ? '✅ Success' : '❌ Failed', result.message || '')
      
      if (result.success) {
        console.log('✅ [LOGIN] User login successful, redirecting to dashboard')
        const from = location.state?.from?.pathname || '/dashboard'
        navigate(from, { replace: true })
      } else {
        console.error('❌ [LOGIN] User login failed:', result.message)
        setLoginError(result.message || 'Login failed. Please check your credentials.')
      }
    } catch (error) {
      console.error('❌ [LOGIN] Unexpected error:', error)
      console.error('❌ [LOGIN] Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      })
      
      // Check for specific error types
      if (error.message && error.message.includes('database') || error.message && error.message.includes('Database')) {
        setLoginError('Database connection error. Please contact administrator.')
        console.error('🗄️ [LOGIN] Database connection error detected!')
      } else if (error.message && (error.message.includes('Failed to fetch') || error.message.includes('NetworkError'))) {
        setLoginError('Cannot connect to backend server. Please check your internet connection.')
        console.error('🌐 [LOGIN] Network/Backend connection error detected!')
      } else {
        setLoginError('Login failed. Please check your connection and try again.')
      }
    } finally {
      setLoading(false)
      console.log('🏁 [LOGIN] Login process completed')
    }
  }

  return (
    <div className="page-content">
      <div className="container">
        <h1 className="page-title">Login to BITA</h1>

        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (emailError) validateEmail(e.target.value)
                }}
                placeholder="Enter your email (student or admin)"
                required
              />
              {emailError && (
                <div className="error-message show">{emailError}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {passwordError && (
                <div className="error-message show">{passwordError}</div>
              )}
            </div>

            {loginError && (
              <div 
                className="error-message"
                style={{
                  display: 'block',
                  color: 'var(--error-color)',
                  padding: '1rem',
                  backgroundColor: '#fee2e2',
                  borderRadius: '5px',
                  marginTop: '1rem'
                }}
              >
                {loginError}
              </div>
            )}

            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
              <button 
                type="submit" 
                className="btn btn-primary btn-large"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin" style={{ marginRight: '0.5rem' }}></i>
                    Logging in...
                  </>
                ) : (
                  'Login'
                )}
              </button>
            </div>

            <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-light)' }}>
                Don't have an account? <Link to="/register" style={{ color: 'var(--primary-color)' }}>Register here</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login

