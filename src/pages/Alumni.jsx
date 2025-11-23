import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getApiUrl } from '../utils/api'

function Alumni() {
  const { isAuthenticated } = useAuth()
  const [alumni, setAlumni] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/alumni' } } })
      return
    }
    loadAlumni()
  }, [isAuthenticated, navigate])

  const loadAlumni = async () => {
    try {
      const response = await fetch(getApiUrl('/api/get_alumni.php'), {
        credentials: 'include'
      })
      const result = await response.json()

      if (result.success && result.alumni) {
        setAlumni(result.alumni)
      }
    } catch (error) {
      console.error('Error loading alumni:', error)
    } finally {
      setLoading(false)
    }
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

  return (
    <div className="page-content">
      <div className="container">
        <h1 className="page-title">BITA Alumni</h1>
        <p style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--text-light)' }}>
          Connect with BITA graduates from around the world
        </p>

        <div className="alumni-grid" id="alumniGrid">
          {alumni.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--text-light)', gridColumn: '1 / -1' }}>
              No alumni records found.
            </p>
          ) : (
            alumni.map((alum, index) => (
              <div key={index} className="alumni-card">
                <h3>{alum.name || 'N/A'}</h3>
                <p><strong>Matric:</strong> {alum.matric || 'N/A'}</p>
                {alum.batch && <p><strong>Batch:</strong> {alum.batch}</p>}
                {alum.current_company && (
                  <p><strong>Current Position:</strong> {alum.current_company}</p>
                )}
                {alum.bio && (
                  <p style={{ marginTop: '1rem', color: 'var(--text-light)' }}>{alum.bio}</p>
                )}
                {(alum.linkedin || alum.instagram || alum.facebook || alum.twitter) && (
                  <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                    {alum.linkedin && (
                      <a href={alum.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-color)', marginRight: '0.5rem' }}>
                        <i className="fab fa-linkedin"></i>
                      </a>
                    )}
                    {alum.instagram && (
                      <a href={alum.instagram} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-color)', marginRight: '0.5rem' }}>
                        <i className="fab fa-instagram"></i>
                      </a>
                    )}
                    {alum.facebook && (
                      <a href={alum.facebook} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-color)', marginRight: '0.5rem' }}>
                        <i className="fab fa-facebook"></i>
                      </a>
                    )}
                    {alum.twitter && (
                      <a href={alum.twitter} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-color)', marginRight: '0.5rem' }}>
                        <i className="fab fa-twitter"></i>
                      </a>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default Alumni

