import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getApiUrl } from '../utils/api'

function UserProfile() {
  const { id } = useParams()
  const { isAuthenticated, user } = useAuth()
  const [profileUser, setProfileUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/profile/${id}` } } })
      return
    }

    // If viewing own profile, redirect to dashboard
    if (user && parseInt(id) === user.id) {
      navigate('/dashboard')
      return
    }

    fetchUserProfile()
  }, [id, isAuthenticated, user, navigate])

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(getApiUrl(`/api/get_user_profile.php?id=${id}`), {
        credentials: 'include'
      })
      const result = await response.json()

      if (result.success && result.user) {
        setProfileUser(result.user)
      } else {
        setError(result.message || 'User not found')
      }
    } catch (error) {
      console.error('Error loading profile:', error)
      setError('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const getSocialMediaIcons = (user) => {
    const socialLinks = []
    
    if (user.instagram) {
      socialLinks.push(
        <a key="instagram" href={user.instagram} target="_blank" rel="noopener noreferrer" className="social-link">
          <i className="fab fa-instagram"></i>
        </a>
      )
    }
    if (user.facebook) {
      socialLinks.push(
        <a key="facebook" href={user.facebook} target="_blank" rel="noopener noreferrer" className="social-link">
          <i className="fab fa-facebook"></i>
        </a>
      )
    }
    if (user.twitter) {
      socialLinks.push(
        <a key="twitter" href={user.twitter} target="_blank" rel="noopener noreferrer" className="social-link">
          <i className="fab fa-twitter"></i>
        </a>
      )
    }
    if (user.linkedin) {
      socialLinks.push(
        <a key="linkedin" href={user.linkedin} target="_blank" rel="noopener noreferrer" className="social-link">
          <i className="fab fa-linkedin"></i>
        </a>
      )
    }
    if (user.tiktok) {
      socialLinks.push(
        <a key="tiktok" href={user.tiktok} target="_blank" rel="noopener noreferrer" className="social-link">
          <i className="fab fa-tiktok"></i>
        </a>
      )
    }
    
    return socialLinks
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

  if (error || !profileUser) {
    return (
      <div className="page-content">
        <div className="container">
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <i className="fas fa-exclamation-circle" style={{ fontSize: '3rem', color: 'var(--error-color)', marginBottom: '1rem' }}></i>
            <h2>Profile Not Found</h2>
            <p style={{ color: 'var(--text-light)', marginBottom: '2rem' }}>{error || 'The user profile you are looking for does not exist or is not verified.'}</p>
            <Link to="/members" className="btn btn-primary">
              <i className="fas fa-arrow-left" style={{ marginRight: '0.5rem' }}></i>
              Back to Members
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page-content">
      <div className="container">
        <div style={{ marginBottom: '1.5rem' }}>
          <Link 
            to="/members" 
            style={{ 
              color: 'var(--primary-color)', 
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              fontSize: '0.95rem',
              fontWeight: '500'
            }}
          >
            <i className="fas fa-arrow-left" style={{ marginRight: '0.5rem' }}></i>
            Back to Members
          </Link>
        </div>

        <div className="profile-container" style={{ 
          maxWidth: '800px', 
          margin: '0 auto',
          background: 'var(--card-bg)',
          borderRadius: '12px',
          padding: '2rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div className="profile-avatar" style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              fontSize: '3rem',
              color: 'white',
              fontWeight: 'bold'
            }}>
              {profileUser.name ? profileUser.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <h1 className="profile-name" style={{ marginBottom: '0.5rem' }}>{profileUser.name || 'N/A'}</h1>
            <p className="profile-matric" style={{ color: 'var(--text-light)', fontSize: '1.1rem' }}>{profileUser.matric || 'N/A'}</p>
            {profileUser.program && (
              <p className="profile-program" style={{ color: 'var(--primary-color)', fontWeight: '500', marginTop: '0.5rem' }}>{profileUser.program}</p>
            )}
          </div>

          <div className="profile-info-grid" style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '1.5rem',
            marginBottom: '2rem'
          }}>
            {profileUser.year && (
              <div className="info-card">
                <i className="fas fa-calendar-alt" style={{ color: 'var(--primary-color)', marginRight: '0.5rem' }}></i>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <strong>Year</strong>
                  <p>{profileUser.year}</p>
                </div>
              </div>
            )}
            {profileUser.batch && (
              <div className="info-card">
                <i className="fas fa-users" style={{ color: 'var(--primary-color)', marginRight: '0.5rem' }}></i>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <strong>Batch</strong>
                  <p>{profileUser.batch}</p>
                </div>
              </div>
            )}
            {profileUser.email && (
              <div className="info-card">
                <i className="fas fa-envelope" style={{ color: 'var(--primary-color)', marginRight: '0.5rem' }}></i>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <strong>Email</strong>
                  <p style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>{profileUser.email}</p>
                </div>
              </div>
            )}
            {profileUser.phone && (
              <div className="info-card">
                <i className="fas fa-phone" style={{ color: 'var(--primary-color)', marginRight: '0.5rem' }}></i>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <strong>Phone</strong>
                  <p style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>{profileUser.phone}</p>
                </div>
              </div>
            )}
          </div>

          {profileUser.bio && (
            <div className="profile-section" style={{ marginBottom: '1.5rem' }}>
              <h3 className="profile-section-title" style={{ marginBottom: '0.75rem', color: 'var(--text-color)', fontSize: '1.1rem', fontWeight: '600' }}>About</h3>
              <p className="profile-section-content" style={{ color: 'var(--text-light)', lineHeight: '1.6', fontSize: '0.95rem' }}>{profileUser.bio}</p>
            </div>
          )}

          {profileUser.description && (
            <div className="profile-section" style={{ marginBottom: '1.5rem' }}>
              <h3 className="profile-section-title" style={{ marginBottom: '0.75rem', color: 'var(--text-color)', fontSize: '1.1rem', fontWeight: '600' }}>Description</h3>
              <p className="profile-section-content" style={{ color: 'var(--text-light)', lineHeight: '1.6', fontSize: '0.95rem' }}>{profileUser.description}</p>
            </div>
          )}

          {getSocialMediaIcons(profileUser).length > 0 && (
            <div className="profile-social" style={{ 
              marginTop: '1.5rem', 
              paddingTop: '1.5rem', 
              borderTop: '1px solid var(--border-color)',
              textAlign: 'center'
            }}>
              <h3 className="profile-section-title" style={{ marginBottom: '1rem', color: 'var(--text-color)', fontSize: '1.1rem', fontWeight: '600' }}>Connect</h3>
              <div className="profile-social-links" style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                {getSocialMediaIcons(profileUser)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserProfile

