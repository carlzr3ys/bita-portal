import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Members() {
  const { isAuthenticated } = useAuth()
  const [members, setMembers] = useState([])
  const [allMembers, setAllMembers] = useState([]) // Store all members for filtering
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [yearFilter, setYearFilter] = useState('all')
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/members' } } })
      return
    }
    loadMembers()
  }, [isAuthenticated, navigate])

  const loadMembers = async () => {
    try {
      const response = await fetch('/api/get_members.php', {
        credentials: 'include'
      })
      const result = await response.json()

      if (result.success && result.members) {
        setAllMembers(result.members)
        setMembers(result.members)
      }
    } catch (error) {
      console.error('Error loading members:', error)
    } finally {
      setLoading(false)
    }
  }

  // Filter members based on search query and year filter
  useEffect(() => {
    let filtered = [...allMembers]

    // Apply year filter
    if (yearFilter !== 'all') {
      filtered = filtered.filter(member => String(member.year) === yearFilter)
    }

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      filtered = filtered.filter(member => {
        const name = (member.name || '').toLowerCase()
        const matric = (member.matric || '').toLowerCase()
        const email = (member.email || '').toLowerCase()
        const emailAlt = (member.email_alt || '').toLowerCase()
        
        return name.includes(query) || 
               matric.includes(query) || 
               email.includes(query) ||
               emailAlt.includes(query)
      })
    }

    setMembers(filtered)
  }, [searchQuery, yearFilter, allMembers])

  // BITA course is 3 years only
  const availableYears = [3, 2, 1] // Year 3, Year 2, Year 1

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
        <h1 className="page-title">BITA Members</h1>
        <p className="page-subtitle" style={{ 
          textAlign: 'center', 
          marginBottom: '1.5rem', 
          color: 'var(--text-light)',
          fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
          padding: '0 1rem'
        }}>
          Connect with current BITA students
        </p>

        {/* Search Bar */}
        <div className="members-search-container">
          <div className="members-search-wrapper">
            <i className="fas fa-search members-search-icon"></i>
            <input
              type="text"
              placeholder="Search by name, matric number, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="members-search-input"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="members-search-clear"
                title="Clear search"
              >
                <i className="fas fa-times"></i>
              </button>
            )}
          </div>
        </div>

        {/* Year Filter Tabs */}
        <div className="members-year-filter-tabs">
          <button
            onClick={() => setYearFilter('all')}
            className={`members-year-tab ${yearFilter === 'all' ? 'active' : ''}`}
          >
            <span>All Years</span>
          </button>
          <button
            onClick={() => setYearFilter('1')}
            className={`members-year-tab ${yearFilter === '1' ? 'active' : ''}`}
          >
            <span>Year 1</span>
          </button>
          <button
            onClick={() => setYearFilter('2')}
            className={`members-year-tab ${yearFilter === '2' ? 'active' : ''}`}
          >
            <span>Year 2</span>
          </button>
          <button
            onClick={() => setYearFilter('3')}
            className={`members-year-tab ${yearFilter === '3' ? 'active' : ''}`}
          >
            <span>Year 3</span>
          </button>
        </div>

        {/* Search Results Info */}
        {(searchQuery || yearFilter !== 'all') && (
          <div className="members-search-results-info">
            <i className="fas fa-info-circle"></i>
            <span>
              {members.length === 0 
                ? 'No members found'
                : `Found ${members.length} member${members.length !== 1 ? 's' : ''}`
              }
              {searchQuery && ` matching "${searchQuery}"`}
              {yearFilter !== 'all' && ` in Year ${yearFilter}`}
            </span>
            {(searchQuery || yearFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('')
                  setYearFilter('all')
                }}
                className="members-search-clear-all"
              >
                Clear filters
              </button>
            )}
          </div>
        )}

        <div className="members-grid" id="membersGrid">
          {members.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--text-light)', gridColumn: '1 / -1' }}>
              No members found.
            </p>
          ) : (
            members.map((member) => (
              <Link 
                key={member.id} 
                to={`/profile/${member.id}`}
                className="member-card"
                style={{ 
                  textDecoration: 'none', 
                  color: 'inherit',
                  display: 'block',
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  WebkitTapHighlightColor: 'rgba(37, 99, 235, 0.1)',
                  touchAction: 'manipulation'
                }}
                onMouseEnter={(e) => {
                  if (window.innerWidth > 768) {
                    e.currentTarget.style.transform = 'translateY(-3px)'
                    e.currentTarget.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.15)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (window.innerWidth > 768) {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = ''
                  }
                }}
                onTouchStart={(e) => {
                  e.currentTarget.style.transform = 'scale(0.98)'
                  e.currentTarget.style.opacity = '0.9'
                }}
                onTouchEnd={(e) => {
                  setTimeout(() => {
                    e.currentTarget.style.transform = ''
                    e.currentTarget.style.opacity = ''
                  }, 150)
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <div className="member-avatar" style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem',
                    color: 'white',
                    fontWeight: 'bold',
                    marginRight: '0.75rem',
                    flexShrink: 0
                  }}>
                    {member.name ? member.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <h3 className="member-name" style={{ 
                      margin: 0, 
                      color: 'var(--text-color)',
                      fontSize: '1rem',
                      fontWeight: '600',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      lineHeight: '1.3'
                    }}>
                      {member.name || 'N/A'}
                    </h3>
                    <p className="member-matric" style={{ 
                      margin: 0, 
                      color: 'var(--text-light)', 
                      fontSize: '0.8rem',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      marginTop: '0.125rem'
                    }}>
                      {member.matric || 'N/A'}
                    </p>
                  </div>
                </div>
                
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(2, 1fr)', 
                  gap: '0.5rem',
                  marginBottom: '0.75rem'
                }}>
                  {member.year && (
                    <div>
                      <span style={{ color: 'var(--text-light)', fontSize: '0.75rem' }}>Year</span>
                      <p style={{ margin: '0.25rem 0 0', color: 'var(--text-color)', fontSize: '0.85rem', fontWeight: '500' }}>{member.year}</p>
                    </div>
                  )}
                  {member.batch && (
                    <div>
                      <span style={{ color: 'var(--text-light)', fontSize: '0.75rem' }}>Batch</span>
                      <p style={{ margin: '0.25rem 0 0', color: 'var(--text-color)', fontSize: '0.85rem', fontWeight: '500' }}>{member.batch}</p>
                    </div>
                  )}
                </div>


                <div style={{ 
                  marginTop: '0.75rem', 
                  paddingTop: '0.75rem', 
                  borderTop: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.5rem'
                }}>
                  {(member.linkedin || member.instagram || member.facebook || member.twitter) ? (
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      {member.instagram && (
                        <a 
                          href={member.instagram} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="member-social-link"
                          style={{ color: 'var(--primary-color)', fontSize: '0.9rem' }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <i className="fab fa-instagram"></i>
                        </a>
                      )}
                      {member.linkedin && (
                        <a 
                          href={member.linkedin} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="member-social-link"
                          style={{ color: 'var(--primary-color)', fontSize: '0.9rem' }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <i className="fab fa-linkedin"></i>
                        </a>
                      )}
                      {member.facebook && (
                        <a 
                          href={member.facebook} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="member-social-link"
                          style={{ color: 'var(--primary-color)', fontSize: '0.9rem' }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <i className="fab fa-facebook"></i>
                        </a>
                      )}
                      {member.twitter && (
                        <a 
                          href={member.twitter} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="member-social-link"
                          style={{ color: 'var(--primary-color)', fontSize: '0.9rem' }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <i className="fab fa-twitter"></i>
                        </a>
                      )}
                    </div>
                  ) : (
                    <div></div>
                  )}
                  <span className="member-view-link" style={{ 
                    color: 'var(--primary-color)', 
                    fontSize: '0.8rem',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}>
                    View <i className="fas fa-arrow-right" style={{ fontSize: '0.7rem' }}></i>
                  </span>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default Members

