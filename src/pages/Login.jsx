import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useAdmin } from '../context/AdminContext'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { login, isAuthenticated } = useAuth()
  const { adminLogin, isAdmin } = useAdmin()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (isAuthenticated && !isAdmin) {
      const from = location.state?.from?.pathname || '/dashboard'
      navigate(from, { replace: true })
    } else if (isAdmin) {
      navigate('/admin/dashboard', { replace: true })
    }
  }, [isAuthenticated, isAdmin, navigate, location])

  const validateEmail = (email) => {
    // Remove validation for admin emails - allow any email format
    // Admin emails might not be @student.utem.edu.my
    setEmailError('')
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Clear previous errors
    setEmailError('')
    setPasswordError('')
    setLoginError('')

    // Validate
    if (!email.trim()) {
      setEmailError('Email is required')
      return
    }

    if (!password) {
      setPasswordError('Password is required')
      return
    }

    setLoading(true)

    try {
      // Try admin login first (check if email is admin email)
      // If email doesn't match student pattern, try admin login first
      const isStudentEmail = email.endsWith('@student.utem.edu.my')
      
      if (!isStudentEmail) {
        // Try admin login first for non-student emails
        const adminResult = await adminLogin(email, password)
        if (adminResult.success) {
          navigate('/admin/dashboard', { replace: true })
          return
        }
      } else {
        // For student emails, also try admin login (in case admin uses student email)
        const adminResult = await adminLogin(email, password)
        if (adminResult.success) {
          navigate('/admin/dashboard', { replace: true })
          return
        }
      }

      // If admin login failed, try user login
      const result = await login(email, password)
      
      if (result.success) {
        const from = location.state?.from?.pathname || '/dashboard'
        navigate(from, { replace: true })
      } else {
        setLoginError(result.message || 'Login failed. Please check your credentials.')
      }
    } catch (error) {
      console.error('Login error:', error)
      setLoginError('Login failed. Please check your connection and try again.')
    } finally {
      setLoading(false)
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

