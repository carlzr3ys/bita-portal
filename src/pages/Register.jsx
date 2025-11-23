import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { getApiUrl } from '../utils/api'

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    matric: '',
    program: 'BITA',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [matricCard, setMatricCard] = useState(null)
  const [previewImage, setPreviewImage] = useState(null)
  const [errors, setErrors] = useState({})
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [extractedBatch, setExtractedBatch] = useState(null)
  const navigate = useNavigate()

  // Function to extract batch from matric number
  const extractBatch = (matric) => {
    const matricUpper = matric.toUpperCase().trim()
    // Pattern: B03YYXXXXXX where YY is the batch year
    // Example: B032510017 -> 25 -> 2025
    const match = matricUpper.match(/^B03(\d{2})\d+$/)
    if (match) {
      const yearDigits = match[1]
      return '20' + yearDigits // Convert 25 to 2025
    }
    return null
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    // Auto-convert Full Name to uppercase
    const processedValue = name === 'name' ? value.toUpperCase() : value
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }))
    
    // Auto-extract batch when matric number is entered
    if (name === 'matric' && value.trim()) {
      const batch = extractBatch(value)
      setExtractedBatch(batch)
    } else if (name === 'matric' && !value.trim()) {
      setExtractedBatch(null)
    }
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrorMessage('Please upload an image file (PNG, JPG, JPEG)')
        return
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage('File size must be less than 5MB')
        return
      }

      setMatricCard(file)
      setErrorMessage('')

      // Show preview
      const reader = new FileReader()
      reader.onload = (event) => {
        setPreviewImage(event.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeFile = () => {
    setMatricCard(null)
    setPreviewImage(null)
  }

  const validate = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.matric.trim()) {
      newErrors.matric = 'Matric number is required'
    }

    if (!formData.program || formData.program !== 'BITA') {
      newErrors.program = 'Only BITA students can register'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!formData.email.endsWith('@student.utem.edu.my')) {
      newErrors.email = 'Email must be a valid UTEM student email (@student.utem.edu.my)'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (!matricCard) {
      setErrorMessage('Please upload a photo of your matric card')
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0 && matricCard
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')

    if (!validate()) {
      return
    }

    setLoading(true)

    try {
      const submitData = new FormData()
      submitData.append('name', formData.name)
      submitData.append('matric', formData.matric)
      submitData.append('program', formData.program)
      submitData.append('email', formData.email)
      submitData.append('password', formData.password)
      submitData.append('matricCard', matricCard)

      const response = await fetch(getApiUrl('/api/register.php'), {
        method: 'POST',
        credentials: 'include',
        body: submitData
      })

      const result = await response.json()

      if (result.success) {
        setSuccess(true)
      } else {
        setErrorMessage(result.message || 'Registration failed. Please try again.')
      }
    } catch (error) {
      console.error('Registration error:', error)
      setErrorMessage('Registration failed. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="page-content">
        <div className="container">
          <div className="form-container">
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ fontSize: '4rem', color: 'var(--success-color)', marginBottom: '1rem' }}>
                <i className="fas fa-check-circle"></i>
              </div>
              <h2 style={{ color: 'var(--success-color)', marginBottom: '1rem' }}>Registration Submitted!</h2>
              <p style={{ marginBottom: '2rem', color: 'var(--text-color)', lineHeight: '1.6' }}>
                Your registration has been submitted successfully. Please wait for admin approval before you can login.
                <br /><br />
                <strong>You will receive an email at {formData.email} once your registration is approved or rejected.</strong>
                <br /><br />
                You can close this page when you're ready. Once approved, you can login using your email and password.
              </p>
              <Link to="/login" className="btn btn-primary">Go to Login</Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page-content">
      <div className="container">
        <h1 className="page-title">Register for BITA</h1>

        <div className="form-container">
          <h2>Create Your Account</h2>
          <p style={{ marginBottom: '1.5rem', color: 'var(--text-light)' }}>
            Please fill in your information and upload a photo of your matric card. 
            Your registration will be reviewed by admin before approval.
          </p>

          {errorMessage && (
            <div 
              className="error-message"
              style={{
                display: 'block',
                color: 'var(--error-color)',
                padding: '1rem',
                backgroundColor: '#fee2e2',
                borderRadius: '5px',
                marginBottom: '1rem'
              }}
            >
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="form-group">
              <label htmlFor="name">Full Name <span style={{ color: '#ef4444' }}>*</span></label>
              
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                style={{ textTransform: 'uppercase' }}
                required
              />
              {errors.name && <div className="error-message show">{errors.name}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="matric">Matric Number <span style={{ color: '#ef4444' }}>*</span></label>
              <input
                type="text"
                id="matric"
                name="matric"
                value={formData.matric}
                onChange={handleInputChange}
                placeholder="e.g. B032510017"
                style={{ textTransform: 'uppercase' }}
                required
              />
              {errors.matric && <div className="error-message show">{errors.matric}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="program">Program <span style={{ color: '#ef4444' }}>*</span></label>
              <select
                id="program"
                name="program"
                value={formData.program}
                onChange={handleInputChange}
                required
                style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border-color)', borderRadius: '5px', fontSize: '1rem', fontFamily: 'inherit' }}
              >
                <option value="BITA">BITA - Bachelor of Technology (Cloud Computing and Application)</option>
              </select>
              {errors.program && <div className="error-message show">{errors.program}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address <span style={{ color: '#ef4444' }}>*</span></label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your.name@student.utem.edu.my"
                required
              />
              {errors.email && <div className="error-message show">{errors.email}</div>}
              <small style={{ color: 'var(--text-light)' }}>Must be a valid UTEM student email</small>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password <span style={{ color: '#ef4444' }}>*</span></label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                minLength={8}
              />
              {errors.password && <div className="error-message show">{errors.password}</div>}
              <small style={{ color: 'var(--text-light)' }}>Must be at least 8 characters</small>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password <span style={{ color: '#ef4444' }}>*</span></label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
              />
              {errors.confirmPassword && <div className="error-message show">{errors.confirmPassword}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="matricCard">
                Upload Matric Card Photo (FRONT ONLY) <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <small style={{ 
                display: 'block', 
                marginTop: '0.25rem', 
                marginBottom: '0.75rem', 
                color: 'var(--text-light)', 
                fontSize: '0.875rem',
                lineHeight: '1.4'
              }}>
                To ensure that you are a verified BITA (Cloud Computing) student, please upload a clear photo of your matric card front side.
              </small>
              <div 
                className="upload-area"
                style={{ minHeight: '200px', padding: '2rem', cursor: 'pointer' }}
                onClick={() => document.getElementById('matricCard').click()}
              >
                {previewImage ? (
                  <div style={{ textAlign: 'center' }}>
                    <img 
                      src={previewImage} 
                      alt="Matric card preview" 
                      style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '5px', marginBottom: '1rem' }}
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeFile()
                      }}
                      className="btn btn-secondary"
                    >
                      <i className="fas fa-trash" style={{ marginRight: '0.5rem' }}></i>Remove
                    </button>
                  </div>
                ) : (
                  <div className="upload-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="upload-icon" style={{ fontSize: '3rem', color: 'var(--primary-color)', marginBottom: '1rem' }}>
                      <i className="fas fa-cloud-upload-alt"></i>
                    </div>
                    <p style={{ color: 'var(--text-color)', marginBottom: '0.5rem' }}>Click or drag to upload</p>
                    <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>PNG, JPG, JPEG up to 5MB</p>
                  </div>
                )}
              </div>
              <input
                type="file"
                id="matricCard"
                name="matricCard"
                accept="image/png,image/jpeg,image/jpg"
                onChange={handleFileChange}
                style={{ display: 'none' }}
                required
              />
            </div>

            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
              <button 
                type="submit" 
                className="btn btn-primary btn-large"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin" style={{ marginRight: '0.5rem' }}></i>
                    Registering...
                  </>
                ) : (
                  'Register'
                )}
              </button>
            </div>

            <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-light)' }}>
                Already have an account? <Link to="/login" style={{ color: 'var(--primary-color)' }}>Login here</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register

