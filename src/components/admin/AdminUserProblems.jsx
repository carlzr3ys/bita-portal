import { useState, useEffect } from 'react'
import { getApiUrl } from '../../utils/api'

function AdminUserProblems() {
  const [allProblems, setAllProblems] = useState([])
  const [pendingProblems, setPendingProblems] = useState([])
  const [resolvedProblems, setResolvedProblems] = useState([])
  const [selectedProblem, setSelectedProblem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeView, setActiveView] = useState('all') // 'all', 'pending', or 'resolved'

  useEffect(() => {
    console.log('AdminUserProblems component mounted, loading problems...')
    loadAllProblems()
  }, [])

  // Reload when switching views
  useEffect(() => {
    if (activeView === 'all') {
      loadAllProblems()
    } else {
      loadProblemsByStatus()
    }
  }, [activeView])

  const loadAllProblems = async () => {
    setLoading(true)
    try {
      // Load both pending and resolved
      const [pendingRes, resolvedRes] = await Promise.all([
        fetch(getApiUrl('/api/get_admin_contact_requests.php?status=Pending'), { credentials: 'include' }),
        fetch(getApiUrl('/api/get_admin_contact_requests.php?status=Resolved'), { credentials: 'include' })
      ])

      console.log('Pending response status:', pendingRes.status)
      console.log('Resolved response status:', resolvedRes.status)

      const pendingData = await pendingRes.json()
      const resolvedData = await resolvedRes.json()

      console.log('Pending requests response:', pendingData)
      console.log('Resolved requests response:', resolvedData)

      if (!pendingData.success) {
        console.error('Failed to load pending requests:', pendingData.message)
      }
      if (!resolvedData.success) {
        console.error('Failed to load resolved requests:', resolvedData.message)
      }

      const pending = pendingData.success ? pendingData.requests || [] : []
      const resolved = resolvedData.success ? resolvedData.requests || [] : []

      console.log('Parsed pending:', pending.length, 'requests')
      console.log('Parsed resolved:', resolved.length, 'requests')

      setPendingProblems(pending)
      setResolvedProblems(resolved)
      setAllProblems([...pending, ...resolved])
      
      console.log('All problems loaded:', { pending: pending.length, resolved: resolved.length, total: pending.length + resolved.length })
    } catch (error) {
      console.error('Error loading problems:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadProblemsByStatus = async () => {
    setLoading(true)
    try {
      const status = activeView === 'pending' ? 'Pending' : 'Resolved'
      const response = await fetch(getApiUrl(`/api/get_admin_contact_requests.php?status=${status}`), {
        credentials: 'include'
      })
      const result = await response.json()
      
      console.log(`Loading ${status} requests:`, result)
      
      if (result.success) {
        const requests = result.requests || []
        if (activeView === 'pending') {
          setPendingProblems(requests)
        } else {
          setResolvedProblems(requests)
        }
        console.log(`${status} requests loaded:`, requests.length)
      } else {
        console.error('Failed to load requests:', result.message)
      }
    } catch (error) {
      console.error('Error loading problems:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleResolveProblem = async (problemId) => {
    if (!confirm('Mark this problem as resolved/settled?')) return

    try {
      console.log('Resolving problem ID:', problemId)
      
      const response = await fetch(getApiUrl('/api/resolve_contact_request.php'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ request_id: problemId })
      })

      console.log('Resolve response status:', response.status)
      console.log('Resolve response headers:', response.headers)

      const result = await response.json()
      console.log('Resolve API response:', result)

      if (result.success) {
        console.log('Resolve successful, reloading problems...')
        await loadAllProblems()
        if (selectedProblem?.id === problemId) {
          setSelectedProblem(null)
        }
        alert('Problem marked as resolved/settled successfully!')
      } else {
        console.error('Resolve failed:', result.message, result)
        alert(result.message || 'Failed to resolve problem')
      }
    } catch (error) {
      console.error('Error resolving problem:', error)
      alert('Failed to resolve problem: ' + (error.message || 'Network error'))
    }
  }

  const handleUndoneProblem = async (problemId) => {
    if (!confirm('Revert this problem back to pending/not settled?')) return

    try {
      console.log('Undoing resolve for problem ID:', problemId)
      
      const response = await fetch(getApiUrl('/api/undo_resolve_contact_request.php'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ request_id: problemId })
      })

      console.log('Undo resolve response status:', response.status)
      console.log('Undo resolve response headers:', response.headers)

      const result = await response.json()
      console.log('Undo resolve API response:', result)

      if (result.success) {
        console.log('Undo resolve successful, reloading problems...')
        await loadAllProblems()
        if (selectedProblem?.id === problemId) {
          setSelectedProblem(null)
        }
        alert('Problem status reverted to pending successfully!')
      } else {
        console.error('Undo resolve failed:', result.message, result)
        alert(result.message || 'Failed to undo resolve problem')
      }
    } catch (error) {
      console.error('Error undoing resolve problem:', error)
      alert('Failed to undo resolve problem: ' + (error.message || 'Network error'))
    }
  }

  const handleDeleteProblem = async (problemId) => {
    if (!confirm('Are you sure you want to delete this contact request? This action cannot be undone.')) return

    try {
      console.log('Deleting problem ID:', problemId)
      
      const response = await fetch(getApiUrl('/api/delete_contact_request.php'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ request_id: problemId })
      })

      console.log('Delete response status:', response.status)
      console.log('Delete response headers:', response.headers)

      const result = await response.json()
      console.log('Delete API response:', result)

      if (result.success) {
        console.log('Delete successful, reloading problems...')
        await loadAllProblems()
        if (selectedProblem?.id === problemId) {
          setSelectedProblem(null)
        }
        alert('Contact request deleted successfully!')
      } else {
        console.error('Delete failed:', result.message, result)
        alert(result.message || 'Failed to delete contact request')
      }
    } catch (error) {
      console.error('Error deleting problem:', error)
      alert('Failed to delete contact request: ' + (error.message || 'Network error'))
    }
  }

  const formatTime = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`
    return date.toLocaleDateString()
  }

  const getProblemList = () => {
    if (activeView === 'all') return allProblems
    if (activeView === 'pending') return pendingProblems
    return resolvedProblems
  }

  const renderProblemList = () => {
    const problems = getProblemList()

    if (loading) {
      return (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', color: 'var(--primary-color)' }}></i>
        </div>
      )
    }

    if (problems.length === 0) {
      return (
        <div className="admin-empty-state" style={{ 
          textAlign: 'center', 
          padding: '4rem 2rem',
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(96, 165, 250, 0.02))',
          borderRadius: '12px',
          border: '2px dashed rgba(59, 130, 246, 0.2)'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            margin: '0 auto 1.5rem',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(96, 165, 250, 0.05))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <i className="fas fa-headset" style={{ 
              fontSize: '2.5rem', 
              background: 'linear-gradient(135deg, var(--primary-color), var(--accent-color))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              opacity: 0.6
            }}></i>
          </div>
          <p style={{ 
            color: 'var(--text-color)', 
            fontSize: '1rem',
            fontWeight: '500',
            margin: '0'
          }}>
            No {activeView === 'all' ? 'contact requests' : activeView === 'pending' ? 'pending requests' : 'settled requests'}
          </p>
          <p style={{ 
            color: 'var(--text-light)', 
            fontSize: '0.875rem',
            marginTop: '0.5rem'
          }}>
            {activeView === 'all' 
              ? 'All requests will appear here' 
              : activeView === 'pending' 
              ? 'No pending requests at the moment' 
              : 'No settled requests yet'}
          </p>
        </div>
      )
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {problems.map((problem) => (
          <div
            key={problem.id}
            className="admin-item-card contact-request-card"
            style={{
              cursor: 'pointer',
              border: selectedProblem?.id === problem.id 
                ? '2px solid var(--primary-color)' 
                : '1px solid var(--border-color)',
              borderLeft: problem.status === 'Pending' 
                ? '4px solid #ef4444' 
                : '4px solid #10b981',
              background: selectedProblem?.id === problem.id
                ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.08), rgba(96, 165, 250, 0.05))'
                : problem.status === 'Pending'
                ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.03), rgba(255, 255, 255, 0.98))'
                : 'linear-gradient(135deg, rgba(16, 185, 129, 0.03), rgba(255, 255, 255, 0.98))',
              boxShadow: selectedProblem?.id === problem.id
                ? '0 4px 15px rgba(59, 130, 246, 0.2), 0 0 0 1px rgba(59, 130, 246, 0.1)'
                : '0 2px 8px rgba(0, 0, 0, 0.06)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              transform: selectedProblem?.id === problem.id ? 'translateX(4px)' : 'none'
            }}
            onClick={() => {
              // On mobile, don't open details view - show all info in card
              if (window.innerWidth > 768) {
                setSelectedProblem(problem)
              }
            }}
            onMouseEnter={(e) => {
              // Only show hover effect on desktop
              if (window.innerWidth > 768 && selectedProblem?.id !== problem.id) {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.15)'
              }
            }}
            onMouseLeave={(e) => {
              // Only reset hover effect on desktop
              if (window.innerWidth > 768 && selectedProblem?.id !== problem.id) {
                e.currentTarget.style.transform = 'none'
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.06)'
              }
            }}
          >
            <div className="contact-card-inner" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                  <strong style={{ 
                    fontSize: '1rem', 
                    background: 'linear-gradient(135deg, var(--primary-color), var(--accent-color))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    fontWeight: '600'
                  }}>
                    {problem.name}
                  </strong>
                  <span style={{
                    background: problem.status === 'Pending' 
                      ? 'linear-gradient(135deg, #ef4444, #f87171)' 
                      : 'linear-gradient(135deg, #10b981, #34d399)',
                    color: 'white',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '0.7rem',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    boxShadow: problem.status === 'Pending'
                      ? '0 2px 8px rgba(239, 68, 68, 0.3)'
                      : '0 2px 8px rgba(16, 185, 129, 0.3)',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}>
                    {problem.status === 'Pending' ? 'Not Settled' : 'Settled'}
                  </span>
                  {!problem.has_account && (
                    <span style={{
                      background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
                      color: 'white',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '20px',
                      fontSize: '0.7rem',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      boxShadow: '0 2px 8px rgba(245, 158, 11, 0.3)',
                      border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                      No Account
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-light)', marginBottom: '0.25rem' }}>
                  {problem.matric} {problem.user_program && `• ${problem.user_program}`}
                  {problem.phone && ` • ${problem.phone}`}
                  {problem.user_email && ` • ${problem.user_email}`}
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-color)', marginTop: '0.5rem' }}>
                  <div style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    maxWidth: '100%'
                  }}>
                    {problem.message}
                  </div>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '0.5rem' }}>
                  {formatTime(problem.created_at)}
                  {problem.resolved_at && ` • Settled: ${formatTime(problem.resolved_at)}`}
                </div>
              </div>
              <div className="contact-card-actions" style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
                {problem.status === 'Pending' && (
                  <button
                    className="admin-btn-success contact-mark-settled-btn"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleResolveProblem(problem.id)
                    }}
                    style={{ 
                      padding: '0.6rem 1.2rem', 
                      fontSize: '0.875rem', 
                      whiteSpace: 'nowrap',
                      background: 'linear-gradient(135deg, #10b981, #34d399)',
                      border: 'none',
                      borderRadius: '8px',
                      color: 'white',
                      fontWeight: '600',
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      flexShrink: 0
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)'
                      e.currentTarget.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.4)'
                      e.currentTarget.style.background = 'linear-gradient(135deg, #059669, #10b981)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'none'
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)'
                      e.currentTarget.style.background = 'linear-gradient(135deg, #10b981, #34d399)'
                    }}
                  >
                    <i className="fas fa-check" style={{ marginRight: '0.5rem' }}></i>
                    Mark Settled
                  </button>
                )}
                {problem.status === 'Resolved' && (
                  <button
                    className="admin-btn-secondary contact-undo-settled-btn"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleUndoneProblem(problem.id)
                    }}
                    style={{ 
                      padding: '0.6rem 1.2rem', 
                      fontSize: '0.875rem', 
                      whiteSpace: 'nowrap',
                      background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
                      border: 'none',
                      borderRadius: '8px',
                      color: 'white',
                      fontWeight: '600',
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      flexShrink: 0
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)'
                      e.currentTarget.style.boxShadow = '0 6px 20px rgba(245, 158, 11, 0.4)'
                      e.currentTarget.style.background = 'linear-gradient(135deg, #d97706, #f59e0b)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'none'
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(245, 158, 11, 0.3)'
                      e.currentTarget.style.background = 'linear-gradient(135deg, #f59e0b, #fbbf24)'
                    }}
                  >
                    <i className="fas fa-undo" style={{ marginRight: '0.5rem' }}></i>
                    Undone
                  </button>
                )}
                <button
                  className="admin-btn-danger contact-delete-card-btn"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteProblem(problem.id)
                  }}
                  style={{ 
                    padding: '0.6rem 1.2rem', 
                    fontSize: '0.875rem', 
                    whiteSpace: 'nowrap',
                    background: 'linear-gradient(135deg, #ef4444, #f87171)',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                    fontWeight: '600',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    flexShrink: 0
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(239, 68, 68, 0.4)'
                    e.currentTarget.style.background = 'linear-gradient(135deg, #dc2626, #ef4444)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'none'
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)'
                    e.currentTarget.style.background = 'linear-gradient(135deg, #ef4444, #f87171)'
                  }}
                >
                  <i className="fas fa-trash" style={{ marginRight: '0.5rem' }}></i>
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="contact-requests-container" style={{ 
      display: 'flex', 
      gap: '1rem', 
      height: 'calc(100vh - 300px)', 
      minHeight: '600px',
      flexDirection: 'row'
    }}>
      {/* Left Sidebar - Problem List */}
      <div className="contact-requests-sidebar" style={{
        width: '400px',
        maxWidth: '100%',
        borderRight: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(249, 250, 251, 0.98))',
        borderRadius: '8px 0 0 8px',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        flexShrink: 0
      }}>
        <div style={{
          padding: '1rem',
          borderBottom: '2px solid var(--border-color)',
          display: 'flex',
          gap: '0.5rem',
          flexWrap: 'wrap',
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(96, 165, 250, 0.02))'
        }}>
          <button
            className={`admin-tab-button contact-tab-btn ${activeView === 'all' ? 'active' : ''}`}
            onClick={() => {
              setActiveView('all')
              setSelectedProblem(null)
            }}
            style={{ 
              flex: 1, 
              minWidth: '120px', 
              padding: '0.75rem 1rem', 
              fontSize: '0.875rem',
              background: activeView === 'all' 
                ? 'linear-gradient(135deg, var(--primary-color), var(--accent-color))' 
                : 'rgba(255, 255, 255, 0.8)',
              color: activeView === 'all' ? 'white' : 'var(--text-color)',
              border: activeView === 'all' ? 'none' : '1px solid var(--border-color)',
              borderRadius: '8px',
              fontWeight: '600',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: activeView === 'all' 
                ? '0 4px 12px rgba(59, 130, 246, 0.3)' 
                : '0 2px 4px rgba(0, 0, 0, 0.05)'
            }}
          >
            <i className="fas fa-list" style={{ marginRight: '0.5rem' }}></i>
            All ({allProblems.length})
          </button>
          <button
            className={`admin-tab-button contact-tab-btn ${activeView === 'pending' ? 'active' : ''}`}
            onClick={() => {
              setActiveView('pending')
              setSelectedProblem(null)
            }}
            style={{ 
              flex: 1, 
              minWidth: '120px', 
              padding: '0.75rem 1rem', 
              fontSize: '0.875rem',
              background: activeView === 'pending' 
                ? 'linear-gradient(135deg, #ef4444, #f87171)' 
                : 'rgba(255, 255, 255, 0.8)',
              color: activeView === 'pending' ? 'white' : 'var(--text-color)',
              border: activeView === 'pending' ? 'none' : '1px solid var(--border-color)',
              borderRadius: '8px',
              fontWeight: '600',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: activeView === 'pending' 
                ? '0 4px 12px rgba(239, 68, 68, 0.3)' 
                : '0 2px 4px rgba(0, 0, 0, 0.05)'
            }}
          >
            <i className="fas fa-clock" style={{ marginRight: '0.5rem' }}></i>
            Not Settled ({pendingProblems.length})
          </button>
          <button
            className={`admin-tab-button contact-tab-btn ${activeView === 'resolved' ? 'active' : ''}`}
            onClick={() => {
              setActiveView('resolved')
              setSelectedProblem(null)
            }}
            style={{ 
              flex: 1, 
              minWidth: '120px', 
              padding: '0.75rem 1rem', 
              fontSize: '0.875rem',
              background: activeView === 'resolved' 
                ? 'linear-gradient(135deg, #10b981, #34d399)' 
                : 'rgba(255, 255, 255, 0.8)',
              color: activeView === 'resolved' ? 'white' : 'var(--text-color)',
              border: activeView === 'resolved' ? 'none' : '1px solid var(--border-color)',
              borderRadius: '8px',
              fontWeight: '600',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: activeView === 'resolved' 
                ? '0 4px 12px rgba(16, 185, 129, 0.3)' 
                : '0 2px 4px rgba(0, 0, 0, 0.05)'
            }}
          >
            <i className="fas fa-check-circle" style={{ marginRight: '0.5rem' }}></i>
            Settled ({resolvedProblems.length})
          </button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
          {renderProblemList()}
        </div>
      </div>

      {/* Right Side - Problem Details */}
      <div className="contact-requests-details mobile-details-hidden" style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(249, 250, 251, 0.98))',
        borderRadius: '0 8px 8px 0',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        minHeight: '400px'
      }}>
        {selectedProblem ? (
          <>
            {/* Problem Header */}
            <div style={{
              padding: '2rem',
              borderBottom: '2px solid var(--border-color)',
              background: selectedProblem.status === 'Pending'
                ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.08), rgba(255, 87, 87, 0.05))'
                : 'linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(52, 211, 153, 0.05))',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '200px',
                height: '200px',
                background: selectedProblem.status === 'Pending'
                  ? 'radial-gradient(circle, rgba(239, 68, 68, 0.1), transparent)'
                  : 'radial-gradient(circle, rgba(16, 185, 129, 0.1), transparent)',
                borderRadius: '50%',
                transform: 'translate(50%, -50%)',
                pointerEvents: 'none'
              }}></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', position: 'relative', zIndex: 1 }}>
                <div style={{
                  width: '70px',
                  height: '70px',
                  borderRadius: '50%',
                  background: selectedProblem.status === 'Pending' 
                    ? 'linear-gradient(135deg, #ef4444, #f87171)' 
                    : 'linear-gradient(135deg, #10b981, #34d399)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  flexShrink: 0,
                  boxShadow: selectedProblem.status === 'Pending'
                    ? '0 6px 20px rgba(239, 68, 68, 0.4)'
                    : '0 6px 20px rgba(16, 185, 129, 0.4)',
                  border: '3px solid rgba(255, 255, 255, 0.3)',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '-50%',
                    left: '-50%',
                    width: '200%',
                    height: '200%',
                    background: 'linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
                    animation: 'shine 3s infinite',
                    transform: 'rotate(45deg)'
                  }}></div>
                  <span style={{ position: 'relative', zIndex: 1 }}>
                    {selectedProblem.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
                <div style={{ flex: 1, minWidth: 0, position: 'relative', zIndex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                    <strong style={{ 
                      fontSize: '1.5rem', 
                      background: 'linear-gradient(135deg, var(--primary-color), var(--accent-color))',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      fontWeight: '700'
                    }}>
                      {selectedProblem.name}
                    </strong>
                    <span style={{
                      background: selectedProblem.status === 'Pending' 
                        ? 'linear-gradient(135deg, #ef4444, #f87171)' 
                        : 'linear-gradient(135deg, #10b981, #34d399)',
                      color: 'white',
                      padding: '0.375rem 0.875rem',
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      boxShadow: selectedProblem.status === 'Pending'
                        ? '0 4px 12px rgba(239, 68, 68, 0.3)'
                        : '0 4px 12px rgba(16, 185, 129, 0.3)',
                      border: '1px solid rgba(255, 255, 255, 0.3)'
                    }}>
                      {selectedProblem.status === 'Pending' ? 'Not Settled' : 'Settled'}
                    </span>
                    {selectedProblem.user_program && (
                      <span style={{
                        background: 'linear-gradient(135deg, var(--primary-color), var(--accent-color))',
                        color: 'white',
                        padding: '0.375rem 0.875rem',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                        border: '1px solid rgba(255, 255, 255, 0.3)'
                      }}>
                        {selectedProblem.user_program}
                      </span>
                    )}
                    {!selectedProblem.has_account && (
                      <span style={{
                        background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
                        color: 'white',
                        padding: '0.375rem 0.875rem',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
                        border: '1px solid rgba(255, 255, 255, 0.3)'
                      }}>
                        No Account
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>
                    {selectedProblem.matric}
                    {selectedProblem.user_email && ` • ${selectedProblem.user_email}`}
                    {selectedProblem.phone && ` • ${selectedProblem.phone}`}
                  </div>
                </div>
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>
                <div><strong>Problem Reported:</strong> {new Date(selectedProblem.created_at).toLocaleString()}</div>
                {selectedProblem.resolved_at && (
                  <div><strong>Settled On:</strong> {new Date(selectedProblem.resolved_at).toLocaleString()}</div>
                )}
              </div>
            </div>

            {/* Problem Content */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '2rem',
              background: 'linear-gradient(135deg, rgba(249, 250, 251, 0.5), rgba(255, 255, 255, 0.8))'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(249, 250, 251, 0.98))',
                padding: '2rem',
                borderRadius: '16px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(59, 130, 246, 0.05)',
                lineHeight: '1.8',
                whiteSpace: 'pre-wrap',
                wordWrap: 'break-word',
                border: '1px solid var(--border-color)',
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '4px',
                  height: '100%',
                  background: selectedProblem.status === 'Pending'
                    ? 'linear-gradient(180deg, #ef4444, #f87171)'
                    : 'linear-gradient(180deg, #10b981, #34d399)',
                  borderRadius: '16px 0 0 16px'
                }}></div>
                <h4 style={{ 
                  marginTop: 0, 
                  marginBottom: '1.5rem', 
                  background: 'linear-gradient(135deg, var(--primary-color), var(--accent-color))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontSize: '1.25rem',
                  fontWeight: '700',
                  paddingLeft: '1rem'
                }}>
                  <i className="fas fa-comment-alt" style={{ marginRight: '0.5rem', color: 'var(--primary-color)' }}></i>
                  Problem Description
                </h4>
                <div style={{ 
                  color: 'var(--text-color)', 
                  fontSize: '1rem',
                  paddingLeft: '1rem',
                  lineHeight: '1.8'
                }}>
                  {selectedProblem.message}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{
              padding: '1.5rem',
              borderTop: '2px solid var(--border-color)',
              display: 'flex',
              gap: '0.75rem',
              justifyContent: 'flex-end',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(249, 250, 251, 0.98))'
            }}>
              {selectedProblem.status === 'Pending' && (
                <button
                  className="admin-btn-success"
                  onClick={() => handleResolveProblem(selectedProblem.id)}
                  style={{ 
                    padding: '0.875rem 2rem',
                    background: 'linear-gradient(135deg, #10b981, #34d399)',
                    border: 'none',
                    borderRadius: '10px',
                    color: 'white',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(16, 185, 129, 0.35)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 6px 25px rgba(16, 185, 129, 0.45)'
                    e.currentTarget.style.background = 'linear-gradient(135deg, #059669, #10b981)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'none'
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.35)'
                    e.currentTarget.style.background = 'linear-gradient(135deg, #10b981, #34d399)'
                  }}
                >
                  <i className="fas fa-check-circle" style={{ marginRight: '0.5rem' }}></i>
                  Mark as Settled
                </button>
              )}
              {selectedProblem.status === 'Resolved' && (
                <button
                  className="admin-btn-secondary contact-undo-btn"
                  onClick={() => handleUndoneProblem(selectedProblem.id)}
                  style={{ 
                    padding: '0.875rem 2rem',
                    background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
                    border: 'none',
                    borderRadius: '10px',
                    color: 'white',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(245, 158, 11, 0.35)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 6px 25px rgba(245, 158, 11, 0.45)'
                    e.currentTarget.style.background = 'linear-gradient(135deg, #d97706, #f59e0b)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'none'
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(245, 158, 11, 0.35)'
                    e.currentTarget.style.background = 'linear-gradient(135deg, #f59e0b, #fbbf24)'
                  }}
                >
                  <i className="fas fa-undo" style={{ marginRight: '0.5rem' }}></i>
                  Undone
                </button>
              )}
              <button
                className="admin-btn-danger contact-delete-btn"
                onClick={() => handleDeleteProblem(selectedProblem.id)}
                style={{ 
                  padding: '0.875rem 2rem',
                  background: 'linear-gradient(135deg, #ef4444, #f87171)',
                  border: 'none',
                  borderRadius: '10px',
                  color: 'white',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(239, 68, 68, 0.35)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 6px 25px rgba(239, 68, 68, 0.45)'
                  e.currentTarget.style.background = 'linear-gradient(135deg, #dc2626, #ef4444)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none'
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(239, 68, 68, 0.35)'
                  e.currentTarget.style.background = 'linear-gradient(135deg, #ef4444, #f87171)'
                }}
              >
                <i className="fas fa-trash" style={{ marginRight: '0.5rem' }}></i>
                Delete
              </button>
            </div>
          </>
        ) : (
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-light)',
            flexDirection: 'column',
            gap: '1.5rem',
            padding: '3rem',
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.03), rgba(96, 165, 250, 0.01))'
          }}>
            <div style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(96, 165, 250, 0.05))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem'
            }}>
              <i className="fas fa-headset" style={{ 
                fontSize: '3rem', 
                background: 'linear-gradient(135deg, var(--primary-color), var(--accent-color))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                opacity: 0.5
              }}></i>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ 
                color: 'var(--text-color)', 
                fontSize: '1.125rem',
                fontWeight: '600',
                margin: '0 0 0.5rem 0'
              }}>
                Select a Contact Request
              </p>
              <p style={{ 
                color: 'var(--text-light)', 
                fontSize: '0.875rem',
                margin: 0
              }}>
                Choose a request from the list to view details
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminUserProblems

