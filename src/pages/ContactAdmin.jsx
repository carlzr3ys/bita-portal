import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getApiUrl } from '../utils/api'

function ContactAdmin() {
  const { isAuthenticated, user } = useAuth()
  const navigate = useNavigate()
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    phone: '',
    message: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/contact-admin' } } })
      return
    }

    fetchUserData()
  }, [isAuthenticated, navigate])

  const fetchUserData = async () => {
    try {
      const response = await fetch(getApiUrl('/api/get_user.php'), {
        credentials: 'include'
      })
      const result = await response.json()

      if (result.success && result.user) {
        setUserData(result.user)
      } else {
        navigate('/login')
      }
    } catch (error) {
      console.error('Error loading user data:', error)
      navigate('/login')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    // Validate form data
    if (!formData.message || formData.message.trim() === '') {
      alert('Message is required!')
      setSubmitting(false)
      return
    }

    console.log('Submitting form data:', formData)
    console.log('User data:', userData)

    try {
      const response = await fetch(getApiUrl('/api/contact_admin.php'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          phone: formData.phone || '',
          message: formData.message
        })
      })

      console.log('Response status:', response.status)
      console.log('Response headers:', response.headers)

      const result = await response.json()

      console.log('API Response:', result)

      if (result.success) {
        setSuccess(true)
        setFormData({
          phone: '',
          message: ''
        })
        if (result.debug && result.debug.record) {
          console.log('Data successfully inserted:', result.debug.record)
        }
        setTimeout(() => {
          setSuccess(false)
        }, 5000)
      } else {
        console.error('API Error:', result)
        console.error('Debug Info:', result.debug)
        const errorMsg = result.message || 'Failed to submit request. Please try again.'
        const debugMsg = result.debug ? `\n\nDebug Info:\n${JSON.stringify(result.debug, null, 2)}` : ''
        alert(errorMsg + debugMsg)
      }
    } catch (error) {
      console.error('Error submitting request:', error)
      alert('Failed to submit request. Please check your connection and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading || !isAuthenticated || !userData) {
    return (
      <div className="page-content">
        <div className="container" style={{ textAlign: 'center', padding: '3rem' }}>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', color: 'var(--primary-color)' }}></i>
          <p style={{ marginTop: '1rem', color: 'var(--text-light)' }}>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="page-content">
      <div className="container">
        <h1 className="page-title">Contact Admin</h1>
        <p style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--text-light)' }}>
          Have a question or need assistance? Fill out the form below and our admin team will get back to you soon.
        </p>

        <div className="form-container">
          {success && (
            <div
              className="success-message show"
              style={{
                padding: '1rem',
                backgroundColor: '#d1fae5',
                color: 'var(--success-color)',
                borderRadius: '5px',
                marginBottom: '1.5rem',
                textAlign: 'center'
              }}
            >
              <i className="fas fa-check-circle" style={{ marginRight: '0.5rem' }}></i>
              Your request has been submitted successfully! Admin will contact you soon.
            </div>
          )}

          <form id="contactForm" onSubmit={handleSubmit}>
            {/* User Info Display (Read-only) */}
            <div className="form-group">
              <label>Your Information</label>
              <div style={{
                padding: '1rem',
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(96, 165, 250, 0.05))',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                marginBottom: '1rem'
              }}>
                <div style={{ marginBottom: '0.5rem' }}>
                  <strong style={{ color: 'var(--primary-color)' }}>Name:</strong> {userData.name}
                </div>
                <div style={{ marginBottom: '0.5rem' }}>
                  <strong style={{ color: 'var(--primary-color)' }}>Matric:</strong> {userData.matric}
                </div>
                <div>
                  <strong style={{ color: 'var(--primary-color)' }}>Email:</strong> {userData.email}
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number (optional)"
                style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border-color)', borderRadius: '5px', fontSize: '1rem', fontFamily: 'inherit' }}
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">
                Message <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <small style={{ 
                display: 'block', 
                marginTop: '0.25rem', 
                marginBottom: '0.75rem', 
                color: 'var(--text-light)', 
                fontSize: '0.875rem',
                lineHeight: '1.4'
              }}>
                Describe your problem or question. We'll get back to you as soon as possible.
              </small>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="8"
                placeholder="Type your message here..."
                required
                style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border-color)', borderRadius: '5px', fontSize: '1rem', fontFamily: 'inherit', resize: 'vertical' }}
              ></textarea>
            </div>

            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
              <button
                type="submit"
                className="btn btn-primary btn-large"
                disabled={submitting || !formData.message.trim()}
              >
                {submitting ? (
                  <>
                    <i className="fas fa-spinner fa-spin" style={{ marginRight: '0.5rem' }}></i>
                    Submitting...
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane" style={{ marginRight: '0.5rem' }}></i>
                    Submit Request
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ContactAdmin
