import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Dashboard() {
  const { isAuthenticated, user } = useAuth()
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email_alt: '',
    year: '',
    batch: '',
    bio: '',
    description: '',
    instagram: '',
    facebook: '',
    twitter: '',
    linkedin: '',
    tiktok: ''
  })
  const [saving, setSaving] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/dashboard' } } })
      return
    }

    fetchUserData()
  }, [isAuthenticated, navigate])

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/get_user.php', {
        credentials: 'include'
      })
      const result = await response.json()

      if (result.success && result.user) {
        setUserData(result.user)
        setFormData({
          name: result.user.name || '',
          phone: result.user.phone || '',
          email_alt: result.user.email_alt || '',
          year: result.user.year || '',
          batch: result.user.batch || '',
          bio: result.user.bio || '',
          description: result.user.description || '',
          instagram: result.user.instagram || '',
          facebook: result.user.facebook || '',
          twitter: result.user.twitter || '',
          linkedin: result.user.linkedin || '',
          tiktok: result.user.tiktok || ''
        })
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

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
    // Reset form data to original user data
    if (userData) {
      setFormData({
        name: userData.name || '',
        phone: userData.phone || '',
        email_alt: userData.email_alt || '',
        year: userData.year || '',
        batch: userData.batch || '',
        bio: userData.bio || '',
        description: userData.description || '',
        instagram: userData.instagram || '',
        facebook: userData.facebook || '',
        twitter: userData.twitter || '',
        linkedin: userData.linkedin || '',
        tiktok: userData.tiktok || ''
      })
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch('/api/update_profile.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      })

      const result = await response.json()

      if (result.success) {
        setIsEditing(false)
        fetchUserData() // Reload user data
        alert('Profile updated successfully!')
      } else {
        alert(result.message || 'Failed to update profile')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const getSocialMediaIcons = () => {
    const socialMedia = []
    
    if (userData?.instagram) {
      socialMedia.push({ name: 'instagram', url: userData.instagram, icon: 'fab fa-instagram', color: '#E4405F' })
    }
    if (userData?.facebook) {
      socialMedia.push({ name: 'facebook', url: userData.facebook, icon: 'fab fa-facebook', color: '#1877F2' })
    }
    if (userData?.twitter) {
      socialMedia.push({ name: 'twitter', url: userData.twitter, icon: 'fab fa-twitter', color: '#1DA1F2' })
    }
    if (userData?.linkedin) {
      socialMedia.push({ name: 'linkedin', url: userData.linkedin, icon: 'fab fa-linkedin', color: '#0A66C2' })
    }
    if (userData?.tiktok) {
      socialMedia.push({ name: 'tiktok', url: userData.tiktok, icon: 'fab fa-tiktok', color: '#000000' })
    }

    return socialMedia
  }

  if (loading) {
    return (
      <div className="page-content">
        <div className="container">
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <i className="fas fa-spinner fa-spin" style={{ fontSize: '3rem', color: 'var(--primary-color)' }}></i>
          </div>
        </div>
      </div>
    )
  }

  const socialMedia = getSocialMediaIcons()

  return (
    <div className="page-content">
      <div className="container">
        <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h1 className="page-title" style={{ margin: 0 }}>My Profile</h1>
          {!isEditing && (
            <button onClick={handleEdit} className="btn btn-primary dashboard-edit-btn" style={{ padding: '0.75rem 1.5rem', whiteSpace: 'nowrap' }}>
              <i className="fas fa-edit" style={{ marginRight: '0.5rem' }}></i>Edit Profile
            </button>
          )}
        </div>
        
        <div className="form-container">
          {!isEditing ? (
            <>
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <div style={{ fontSize: '4rem', color: 'var(--primary-color)', marginBottom: '1rem' }}>
                  <i className="fas fa-user-circle"></i>
                </div>
                <h2>{userData?.name || 'User'}</h2>
                {userData?.bio && (
                  <p style={{ color: 'var(--text-light)', marginTop: '0.5rem', fontStyle: 'italic' }}>
                    {userData.bio}
                  </p>
                )}
                
                {/* Social Media Icons */}
                {socialMedia.length > 0 && (
                  <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1.5rem', flexWrap: 'wrap' }}>
                    {socialMedia.map((social) => (
                      <a
                        key={social.name}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '45px',
                          height: '45px',
                          borderRadius: '50%',
                          background: social.color,
                          color: 'white',
                          fontSize: '1.5rem',
                          textDecoration: 'none',
                          transition: 'all 0.3s ease',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-3px) scale(1.1)'
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0) scale(1)'
                          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)'
                        }}
                      >
                        <i className={social.icon}></i>
                      </a>
                    ))}
                  </div>
                )}
              </div>

              <div className="confirmation-card">
                <h3 style={{ color: 'var(--primary-color)', marginBottom: '1.5rem' }}>Profile Information</h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                  <div className="confirmation-item">
                    <label>Name:</label>
                    <span>{userData?.name || '-'}</span>
                  </div>
                  <div className="confirmation-item">
                    <label>Matric Number:</label>
                    <span>{userData?.matric || '-'}</span>
                  </div>
                  <div className="confirmation-item">
                    <label>Email:</label>
                    <span className="email-text">{userData?.email || '-'}</span>
                  </div>
                  {userData?.email_alt && (
                    <div className="confirmation-item">
                      <label>Alternate Email:</label>
                      <span className="email-text">{userData.email_alt}</span>
                    </div>
                  )}
                  <div className="confirmation-item">
                    <label>Program:</label>
                    <span>{userData?.program || '-'}</span>
                  </div>
                  {userData?.year && (
                    <div className="confirmation-item">
                      <label>Year:</label>
                      <span>{userData.year}</span>
                    </div>
                  )}
                  {userData?.batch && (
                    <div className="confirmation-item">
                      <label>Batch:</label>
                      <span>{userData.batch}</span>
                    </div>
                  )}
                  {userData?.phone && (
                    <div className="confirmation-item">
                      <label>Phone:</label>
                      <span>{userData.phone}</span>
                    </div>
                  )}
                  <div className="confirmation-item">
                    <label>Status:</label>
                    <span style={{ color: 'var(--success-color)', fontWeight: '600' }}>Verified</span>
                  </div>
                </div>

                {userData?.description && (
                  <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--primary-color)' }}>About Me:</label>
                    <p style={{ color: 'var(--text-color)', lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>
                      {userData.description}
                    </p>
                  </div>
                )}
              </div>

              <div className="dashboard-actions" style={{ marginTop: '2rem', textAlign: 'center' }}>
                <Link to="/modules" className="btn btn-primary btn-large">Explore Modules</Link>
                <Link to="/members" className="btn btn-secondary" style={{ marginLeft: '1rem' }}>View Members</Link>
              </div>
            </>
          ) : (
            <form onSubmit={handleSave}>
              <h2 style={{ color: 'var(--primary-color)', marginBottom: '1.5rem' }}>Edit Profile</h2>

              <div className="form-group">
                <label htmlFor="name">Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                <div className="form-group">
                  <label htmlFor="year">Year</label>
                  <input
                    type="text"
                    id="year"
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    placeholder="e.g., Year 2"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="batch">Batch</label>
                  <input
                    type="text"
                    id="batch"
                    name="batch"
                    value={formData.batch}
                    onChange={handleInputChange}
                    placeholder="e.g., 2024"
                    readOnly
                    style={{ 
                      backgroundColor: 'var(--bg-light)', 
                      cursor: 'not-allowed',
                      opacity: 0.7
                    }}
                    title="Batch is automatically extracted from your matric number and cannot be changed. Contact admin if you need to update it."
                  />
                  <small style={{ 
                    display: 'block', 
                    marginTop: '0.25rem', 
                    color: 'var(--text-light)', 
                    fontSize: '0.8rem'
                  }}>
                    <i className="fas fa-lock" style={{ marginRight: '0.25rem' }}></i>
                    Batch is auto-extracted from matric number. Contact admin to change.
                  </small>
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="e.g., +60123456789"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email_alt">Alternate Email</label>
                  <input
                    type="email"
                    id="email_alt"
                    name="email_alt"
                    value={formData.email_alt}
                    onChange={handleInputChange}
                    placeholder="personal@email.com"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="bio">Bio</label>
                <input
                  type="text"
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Short bio or tagline"
                  maxLength={200}
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">About Me</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="5"
                  placeholder="Tell us about yourself..."
                />
              </div>

              <h3 style={{ color: 'var(--primary-color)', marginTop: '2rem', marginBottom: '1rem' }}>Social Media</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                <div className="form-group">
                  <label htmlFor="instagram">
                    <i className="fab fa-instagram" style={{ marginRight: '0.5rem', color: '#E4405F' }}></i>
                    Instagram
                  </label>
                  <input
                    type="url"
                    id="instagram"
                    name="instagram"
                    value={formData.instagram}
                    onChange={handleInputChange}
                    placeholder="https://instagram.com/username"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="facebook">
                    <i className="fab fa-facebook" style={{ marginRight: '0.5rem', color: '#1877F2' }}></i>
                    Facebook
                  </label>
                  <input
                    type="url"
                    id="facebook"
                    name="facebook"
                    value={formData.facebook}
                    onChange={handleInputChange}
                    placeholder="https://facebook.com/username"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="twitter">
                    <i className="fab fa-twitter" style={{ marginRight: '0.5rem', color: '#1DA1F2' }}></i>
                    Twitter
                  </label>
                  <input
                    type="url"
                    id="twitter"
                    name="twitter"
                    value={formData.twitter}
                    onChange={handleInputChange}
                    placeholder="https://twitter.com/username"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="linkedin">
                    <i className="fab fa-linkedin" style={{ marginRight: '0.5rem', color: '#0A66C2' }}></i>
                    LinkedIn
                  </label>
                  <input
                    type="url"
                    id="linkedin"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleInputChange}
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="tiktok">
                    <i className="fab fa-tiktok" style={{ marginRight: '0.5rem', color: '#000000' }}></i>
                    TikTok
                  </label>
                  <input
                    type="url"
                    id="tiktok"
                    name="tiktok"
                    value={formData.tiktok}
                    onChange={handleInputChange}
                    placeholder="https://tiktok.com/@username"
                  />
                </div>
              </div>

              <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="btn btn-secondary"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <i className="fas fa-spinner fa-spin" style={{ marginRight: '0.5rem' }}></i>
                      Saving...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save" style={{ marginRight: '0.5rem' }}></i>
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard

