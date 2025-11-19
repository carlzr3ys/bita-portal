import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdmin } from '../../context/AdminContext'
import { useTheme } from '../../context/ThemeContext'
import { getUploadsUrl } from '../../utils/api'
import AdminUserProblems from '../../components/admin/AdminUserProblems'

function AdminDashboard() {
  const { isAdmin, admin, adminLogout } = useAdmin()
  const { isDarkMode, toggleTheme } = useTheme()
  const [isThemeAnimating, setIsThemeAnimating] = useState(false)

  const handleThemeClick = () => {
    setIsThemeAnimating(true)
    toggleTheme()
    setTimeout(() => {
      setIsThemeAnimating(false)
    }, 600)
  }
  const [stats, setStats] = useState({ pending: 0, total: 0 })
  const [pendingUsers, setPendingUsers] = useState([])
  const [allUsers, setAllUsers] = useState([])
  const [admins, setAdmins] = useState([])
  const [adminLogs, setAdminLogs] = useState([])
  const [categories, setCategories] = useState([])
  const [categoryTree, setCategoryTree] = useState([])
  const [allFiles, setAllFiles] = useState([])
  const [loadingAllFiles, setLoadingAllFiles] = useState(false)
  const [activeTab, setActiveTab] = useState('pending') // 'pending', 'all', 'admins', 'logs', 'categories', 'user-problems', 'all-files'
  const [loading, setLoading] = useState(true)
  const [showUserModal, setShowUserModal] = useState(false)
  const [showAdminModal, setShowAdminModal] = useState(false)
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    level: 1,
    parent_id: null,
    description: '',
    display_order: 0
  })
  const [editingUser, setEditingUser] = useState(null)
  const [editingAdmin, setEditingAdmin] = useState(null)
  const [userForm, setUserForm] = useState({
    name: '',
    matric: '',
    email: '',
    password: '',
    program: 'BITA',
    year: '',
    batch: '',
    phone: '',
    email_alt: '',
    bio: '',
    description: '',
    instagram: '',
    facebook: '',
    twitter: '',
    linkedin: '',
    tiktok: ''
  })
  const [adminForm, setAdminForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'moderator'
  })
  const isSuperAdmin = admin?.role === 'superadmin'
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAdmin) {
      navigate('/login', { state: { from: { pathname: '/admin/dashboard' } } })
      return
    }
    loadData()
  }, [isAdmin, navigate])

  const loadData = async () => {
    try {
      // Load stats
      const statsResponse = await fetch('/api/get_admin_stats.php', {
        credentials: 'include'
      })
      const statsResult = await statsResponse.json()
      if (statsResult.success) {
        setStats({
          pending: statsResult.pending_count || 0,
          total: statsResult.total_users || 0
        })
      }

      // Load pending users
      const pendingResponse = await fetch('/api/get_pending_users.php', {
        credentials: 'include'
      })
      const pendingResult = await pendingResponse.json()
      if (pendingResult.success && pendingResult.users) {
        setPendingUsers(pendingResult.users)
      }

      // Load all users
      const allUsersResponse = await fetch('/api/get_all_users.php', {
        credentials: 'include'
      })
      const allUsersResult = await allUsersResponse.json()
      if (allUsersResult.success && allUsersResult.users) {
        setAllUsers(allUsersResult.users)
      }

      // Load admins (superadmin only)
      if (isSuperAdmin) {
        const adminsResponse = await fetch('/api/get_admins.php', {
          credentials: 'include'
        })
        const adminsResult = await adminsResponse.json()
        if (adminsResult.success && adminsResult.admins) {
          setAdmins(adminsResult.admins)
        }

        // Load admin logs
        const logsResponse = await fetch('/api/get_admin_logs.php', {
          credentials: 'include'
        })
        const logsResult = await logsResponse.json()
        if (logsResult.success && logsResult.logs) {
          setAdminLogs(logsResult.logs)
        }
      }

      // Load categories
      const categoriesResponse = await fetch('/api/get_categories.php', {
        credentials: 'include'
      })
      const categoriesResult = await categoriesResponse.json()
      if (categoriesResult.success) {
        setCategories(categoriesResult.categories || [])
        setCategoryTree(categoriesResult.tree || [])
      }
    } catch (error) {
      console.error('Error loading admin data:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadAllFiles = async () => {
    setLoadingAllFiles(true)
    try {
      console.log('Loading all module files...')
      const response = await fetch('/api/get_all_module_files.php', {
        credentials: 'include'
      })
      console.log('All files response status:', response.status)
      
      const result = await response.json()
      console.log('All files result:', result)
      
      if (result.success) {
        console.log('All files loaded:', result.files)
        console.log('Total files:', result.count)
        setAllFiles(result.files || [])
      } else {
        console.error('Failed to load all files:', result.message)
        alert('Failed to load files: ' + (result.message || 'Unknown error'))
      }
    } catch (error) {
      console.error('Error loading all files:', error)
      alert('Error loading files: ' + error.message)
    } finally {
      setLoadingAllFiles(false)
    }
  }

  useEffect(() => {
    if (activeTab === 'all-files') {
      loadAllFiles()
    }
  }, [activeTab, isAdmin])

  const handleApprove = async (userId) => {
    if (!confirm('Are you sure you want to approve this user?')) return

    try {
      const response = await fetch('/api/approve_user.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ user_id: userId })
      })

      const result = await response.json()
      if (result.success) {
        loadData() // Reload data
        // Show success message with email status
        const emailStatus = result.email_sent 
          ? ' ✅ Email notification sent to user.' 
          : ' ⚠️ Email notification could not be sent (check logs).'
        alert(result.message + emailStatus)
      } else {
        alert(result.message || 'Failed to approve user')
      }
    } catch (error) {
      console.error('Error approving user:', error)
      alert('Failed to approve user')
    }
  }

  const handleReject = async (userId) => {
    const reason = prompt('Please provide a reason for rejection (optional):')
    if (reason === null) return // User cancelled

    try {
      const response = await fetch('/api/reject_user.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ user_id: userId, reason: reason || '' })
      })

      const result = await response.json()
      if (result.success) {
        loadData() // Reload data
        // Show success message with email status
        const emailStatus = result.email_sent 
          ? ' ✅ Email notification sent to user.' 
          : ' ⚠️ Email notification could not be sent (check logs).'
        alert(result.message + emailStatus)
      } else {
        alert(result.message || 'Failed to reject user')
      }
    } catch (error) {
      console.error('Error rejecting user:', error)
      alert('Failed to reject user')
    }
  }

  const handleLogout = async () => {
    if (confirm('Are you sure you want to logout?')) {
      await adminLogout()
      navigate('/')
    }
  }

  const handleAddUser = () => {
    setEditingUser(null)
    setUserForm({
      name: '',
      matric: '',
      email: '',
      password: '',
      program: 'BITA',
      year: '',
      batch: '',
      phone: '',
      email_alt: '',
      bio: '',
      description: '',
      instagram: '',
      facebook: '',
      twitter: '',
      linkedin: '',
      tiktok: ''
    })
    setShowUserModal(true)
  }

  const handleEditUser = async (user) => {
    // Fetch full user data including profile fields
    try {
      const response = await fetch(`/api/get_user_by_id.php?id=${user.id}`, {
        credentials: 'include'
      })
      const result = await response.json()
      
      if (result.success && result.user) {
        const fullUser = result.user
        setEditingUser(fullUser)
        setUserForm({
          name: fullUser.name || '',
          matric: fullUser.matric || '',
          email: fullUser.email || '',
          password: '',
          program: fullUser.program || 'BITA',
          year: fullUser.year || '',
          batch: fullUser.batch || '',
          phone: fullUser.phone || '',
          email_alt: fullUser.email_alt || '',
          bio: fullUser.bio || '',
          description: fullUser.description || '',
          instagram: fullUser.instagram || '',
          facebook: fullUser.facebook || '',
          twitter: fullUser.twitter || '',
          linkedin: fullUser.linkedin || '',
          tiktok: fullUser.tiktok || ''
        })
        setShowUserModal(true)
      } else {
        // Fallback to basic user data
        setEditingUser(user)
        setUserForm({
          name: user.name || '',
          matric: user.matric || '',
          email: user.email || '',
          password: '',
          program: user.program || 'BITA',
          year: user.year || '',
          batch: user.batch || '',
          phone: user.phone || '',
          email_alt: user.email_alt || '',
          bio: user.bio || '',
          description: user.description || '',
          instagram: user.instagram || '',
          facebook: user.facebook || '',
          twitter: user.twitter || '',
          linkedin: user.linkedin || '',
          tiktok: user.tiktok || ''
        })
        setShowUserModal(true)
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
      // Fallback to basic user data
      setEditingUser(user)
      setUserForm({
        name: user.name || '',
        matric: user.matric || '',
        email: user.email || '',
        password: '',
        program: user.program || 'BITA',
        year: user.year || '',
        batch: user.batch || '',
        phone: user.phone || '',
        email_alt: user.email_alt || '',
        bio: user.bio || '',
        description: user.description || '',
        instagram: user.instagram || '',
        facebook: user.facebook || '',
        twitter: user.twitter || '',
        linkedin: user.linkedin || '',
        tiktok: user.tiktok || ''
      })
      setShowUserModal(true)
    }
  }

  const handleSaveUser = async (e) => {
    e.preventDefault()

    try {
      if (editingUser) {
        // Update user - build update data with all profile fields
        const updateData = {
          user_id: editingUser.id,
          name: userForm.name,
          matric: userForm.matric,
          email: userForm.email,
          program: userForm.program,
          year: userForm.year || null,
          batch: userForm.batch || null,
          phone: userForm.phone || null,
          email_alt: userForm.email_alt || null,
          bio: userForm.bio || null,
          description: userForm.description || null,
          instagram: userForm.instagram || null,
          facebook: userForm.facebook || null,
          twitter: userForm.twitter || null,
          linkedin: userForm.linkedin || null,
          tiktok: userForm.tiktok || null
        }
        
        // Only include password if provided
        if (userForm.password && userForm.password.trim()) {
          updateData.password = userForm.password
        }

        const response = await fetch('/api/update_user.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify(updateData)
        })

        const result = await response.json()
        if (result.success) {
          setShowUserModal(false)
          loadData()
          alert('User updated successfully')
        } else {
          alert(result.message || 'Failed to update user')
        }
      } else {
        // Add new user
        const response = await fetch('/api/add_user.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({
            ...userForm,
            is_verified: true
          })
        })

        const result = await response.json()
        if (result.success) {
          setShowUserModal(false)
          loadData()
          alert('User created successfully')
        } else {
          alert(result.message || 'Failed to create user')
        }
      }
    } catch (error) {
      console.error('Error saving user:', error)
      alert('Failed to save user')
    }
  }

  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return

    try {
      const response = await fetch('/api/delete_user.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ user_id: userId })
      })

      const result = await response.json()
      if (result.success) {
        loadData()
        alert('User deleted successfully')
      } else {
        alert(result.message || 'Failed to delete user')
      }
    } catch (error) {
      console.error('Error deleting user:', error)
      alert('Failed to delete user')
    }
  }

  const handleAddAdmin = () => {
    setEditingAdmin(null)
    setAdminForm({
      name: '',
      email: '',
      password: '',
      role: 'moderator'
    })
    setShowAdminModal(true)
  }

  const handleEditAdmin = (adminData) => {
    setEditingAdmin(adminData)
    setAdminForm({
      name: adminData.name || '',
      email: adminData.email || '',
      password: '',
      role: adminData.role || 'moderator'
    })
    setShowAdminModal(true)
  }

  const handleSaveAdmin = async (e) => {
    e.preventDefault()

    try {
      const response = await fetch('/api/save_admin.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          ...(editingAdmin && { admin_id: editingAdmin.id }),
          ...adminForm,
          ...(editingAdmin && !adminForm.password && { password: '' }) // Empty string if editing without password
        })
      })

      const result = await response.json()
      if (result.success) {
        setShowAdminModal(false)
        loadData()
        alert(editingAdmin ? 'Admin updated successfully' : 'Admin created successfully')
      } else {
        alert(result.message || `Failed to ${editingAdmin ? 'update' : 'create'} admin`)
      }
    } catch (error) {
      console.error('Error saving admin:', error)
      alert(`Failed to ${editingAdmin ? 'update' : 'create'} admin`)
    }
  }

  const handleDeleteAdmin = async (adminId) => {
    if (!confirm('Are you sure you want to delete this admin? This action cannot be undone.')) return

    try {
      const response = await fetch('/api/delete_admin.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ admin_id: adminId })
      })

      const result = await response.json()
      if (result.success) {
        loadData()
        alert('Admin deleted successfully')
      } else {
        alert(result.message || 'Failed to delete admin')
      }
    } catch (error) {
      console.error('Error deleting admin:', error)
      alert('Failed to delete admin')
    }
  }

  const handleDeleteFile = async (fileId) => {
    try {
      const response = await fetch(`/api/delete_module_file.php?id=${fileId}`, {
        method: 'DELETE',
        credentials: 'include'
      })
      const result = await response.json()
      if (result.success) {
        alert(result.message || 'File deleted successfully')
        loadAllFiles()
      } else {
        alert(result.message || 'Failed to delete file')
      }
    } catch (error) {
      console.error('Error deleting file:', error)
      alert('Failed to delete file')
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <i className="fas fa-spinner fa-spin" style={{ fontSize: '3rem', color: 'var(--primary-color)' }}></i>
      </div>
    )
  }

  return (
    <div className="admin-dashboard-wrapper">
      {/* Admin Header */}
      <div className="admin-header">
        <div className="admin-header-content">
          <h1>
            <i className="fas fa-shield-alt" style={{ marginRight: '0.5rem' }}></i>
            Admin Dashboard
          </h1>
          <div className="admin-header-actions">
            <div className="admin-user-info">
              <i className="fas fa-user-circle"></i>
              <span>{admin?.name || 'Admin'}</span>
              {admin?.role === 'superadmin' && (
                <span className="admin-badge" style={{ background: '#fbbf24', color: '#92400e' }}>
                  Super Admin
                </span>
              )}
            </div>
            <button
              onClick={handleThemeClick}
              className={`theme-toggle admin-theme-toggle ${isThemeAnimating ? 'animating' : ''}`}
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              <i className={`fas fa-${isDarkMode ? 'sun' : 'moon'}`}></i>
            </button>
            <button onClick={handleLogout} className="btn-admin-logout">
              <i className="fas fa-sign-out-alt" style={{ marginRight: '0.5rem' }}></i>
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Admin Container */}
      <div className="admin-container">
        {/* Stats Cards */}
        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <h3 className="admin-stat-label">Pending Approvals</h3>
            <div className="admin-stat-value">{stats.pending}</div>
          </div>
          <div className="admin-stat-card">
            <h3 className="admin-stat-label">Total Users</h3>
            <div className="admin-stat-value">{stats.total}</div>
          </div>
        </div>

        {/* Super Admin Management Section */}
        {isSuperAdmin && (
          <div className="admin-management-section">
            <div className="admin-section-header">
              <h2>
                <i className="fas fa-users-cog" style={{ marginRight: '0.5rem', color: '#fbbf24' }}></i>
                Admin Management
              </h2>
              <button
                onClick={handleAddAdmin}
                className="admin-btn admin-btn-primary"
              >
                <i className="fas fa-user-plus"></i>
                Create New Admin
              </button>
            </div>

            {admins.length === 0 ? (
              <div className="admin-empty-state">
                <i className="fas fa-users"></i>
                <p>No admins found</p>
              </div>
            ) : (
              <div>
                {admins.map((adminItem) => {
                  const isOtherSuperAdmin = adminItem.role === 'superadmin' && adminItem.id !== admin?.id
                  const canEdit = !isOtherSuperAdmin
                  const canDelete = !isOtherSuperAdmin && adminItem.id !== admin?.id

                  return (
                    <div key={adminItem.id} className="admin-item-card admin-card-layout">
                      <div className="admin-card-info">
                        <h4 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>{adminItem.name}</h4>
                        <p style={{ margin: '0.25rem 0', color: '#666', fontSize: '0.9rem' }}>
                          <i className="fas fa-envelope" style={{ marginRight: '0.5rem' }}></i>
                          {adminItem.email}
                        </p>
                        <p style={{ margin: '0.25rem 0', color: '#666', fontSize: '0.9rem' }}>
                          <i className="fas fa-calendar" style={{ marginRight: '0.5rem' }}></i>
                          Created: {formatDate(adminItem.created_at)}
                        </p>
                        {adminItem.last_login && (
                          <p style={{ margin: '0.25rem 0', color: '#666', fontSize: '0.9rem' }}>
                            <i className="fas fa-clock" style={{ marginRight: '0.5rem' }}></i>
                            Last login: {formatDate(adminItem.last_login)}
                          </p>
                        )}
                        <span className="admin-badge" style={{
                          background: adminItem.role === 'superadmin' ? '#fbbf24' : '#3b82f6',
                          color: adminItem.role === 'superadmin' ? '#92400e' : 'white',
                          marginTop: '0.5rem'
                        }}>
                          {adminItem.role === 'superadmin' ? 'Super Admin' : 'Moderator'}
                        </span>
                        {isOtherSuperAdmin && (
                          <p style={{ color: '#ef4444', marginTop: '0.5rem', fontSize: '0.85rem' }}>
                            <i className="fas fa-lock" style={{ marginRight: '0.5rem' }}></i>
                            Protected: Cannot edit other super admins
                          </p>
                        )}
                      </div>
                      <div className="admin-card-actions">
                        <button
                          onClick={() => handleEditAdmin(adminItem)}
                          disabled={!canEdit}
                          className={`admin-btn admin-btn-primary ${!canEdit ? '' : ''}`}
                        >
                          <i className="fas fa-edit"></i>
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteAdmin(adminItem.id)}
                          disabled={!canDelete}
                          className={`admin-btn admin-btn-danger ${!canDelete ? '' : ''}`}
                        >
                          <i className="fas fa-trash"></i>
                          Delete
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Tabs */}
        <div className="admin-tabs">
          <button
            onClick={() => setActiveTab('pending')}
            className={`admin-tab-button ${activeTab === 'pending' ? 'active' : ''}`}
          >
            <i className="fas fa-clock"></i>
            Pending ({stats.pending})
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`admin-tab-button ${activeTab === 'all' ? 'active' : ''}`}
          >
            <i className="fas fa-users"></i>
            Users ({stats.total})
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`admin-tab-button ${activeTab === 'categories' ? 'active' : ''}`}
          >
            <i className="fas fa-folder-tree"></i>
            Categories
          </button>
          <button
            onClick={() => setActiveTab('user-problems')}
            className={`admin-tab-button ${activeTab === 'user-problems' ? 'active' : ''}`}
          >
            <i className="fas fa-headset"></i>
            Contact Requests
          </button>
          <button
            onClick={() => setActiveTab('all-files')}
            className={`admin-tab-button ${activeTab === 'all-files' ? 'active' : ''}`}
          >
            <i className="fas fa-file-upload"></i>
            All Files ({allFiles.length})
          </button>
          {isSuperAdmin && (
            <>
              <button
                onClick={() => setActiveTab('admins')}
                className={`admin-tab-button ${activeTab === 'admins' ? 'active' : ''}`}
              >
                <i className="fas fa-users-cog"></i>
                Admins ({admins.length})
              </button>
              <button
                onClick={() => setActiveTab('logs')}
                className={`admin-tab-button ${activeTab === 'logs' ? 'active' : ''}`}
              >
                <i className="fas fa-list-alt"></i>
                Admin Logs
              </button>
            </>
          )}
        </div>

        {/* Pending Users Section */}
        {activeTab === 'pending' && (
        <div className="admin-tab-content">
          <div className="admin-content-header">
            <h2>
              <i className="fas fa-clock" style={{ marginRight: '0.5rem' }}></i>
              Pending Registration Requests
            </h2>
            <button
              onClick={loadData}
              className="admin-btn admin-btn-primary"
            >
              <i className="fas fa-sync-alt"></i>
              Refresh
            </button>
          </div>

          {pendingUsers.length === 0 ? (
            <div className="admin-empty-state">
              <i className="fas fa-check-circle"></i>
              <p>No pending registration requests</p>
            </div>
          ) : (
            <div>
              {pendingUsers.map((user) => (
                <div key={user.id} className="admin-item-card">
                  <div className="admin-item-info-grid">
                    <div>
                      <label className="admin-item-label">Name:</label>
                      <span className="admin-item-value">{user.name || 'N/A'}</span>
                    </div>
                    <div>
                      <label className="admin-item-label">Matric:</label>
                      <span className="admin-item-value">{user.matric || 'N/A'}</span>
                    </div>
                    <div>
                      <label className="admin-item-label">Email:</label>
                      <span className="admin-item-value">{user.email || 'N/A'}</span>
                    </div>
                    <div>
                      <label style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.25rem', display: 'block' }}>Program:</label>
                      <span style={{ fontWeight: '600', color: '#333' }}>{user.program || 'N/A'}</span>
                    </div>
                  </div>
                  {(user.matric_card || user.matric_card_path) && (
                    <div style={{ marginBottom: '1rem' }}>
                      <img
                        src={getUploadsUrl(user.matric_card || user.matric_card_path)}
                        alt="Matric Card"
                        style={{
                          maxWidth: '100%',
                          maxHeight: '300px',
                          borderRadius: '5px',
                          border: '1px solid #e0e0e0',
                          cursor: 'pointer'
                        }}
                        onClick={() => window.open(getUploadsUrl(user.matric_card || user.matric_card_path), '_blank')}
                      />
                    </div>
                  )}
                  <div className="admin-action-buttons" style={{ marginTop: '1rem' }}>
                    <button
                      onClick={() => handleApprove(user.id)}
                      className="admin-btn admin-btn-success"
                    >
                      <i className="fas fa-check"></i>
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(user.id)}
                      className="admin-btn admin-btn-danger"
                    >
                      <i className="fas fa-times"></i>
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        )}

        {/* All Users Section */}
        {activeTab === 'all' && (
        <div className="admin-tab-content">
          <div className="admin-content-header">
            <h2>
              <i className="fas fa-users" style={{ marginRight: '0.5rem' }}></i>
              All Users
            </h2>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                onClick={handleAddUser}
                className="admin-btn admin-btn-success"
              >
                <i className="fas fa-user-plus"></i>
                Add New User
              </button>
              <button
                onClick={loadData}
                className="admin-btn admin-btn-primary"
              >
                <i className="fas fa-sync-alt"></i>
                Refresh
              </button>
            </div>
          </div>

          {allUsers.length === 0 ? (
            <div className="admin-empty-state">
              <i className="fas fa-users"></i>
              <p>No users found</p>
            </div>
          ) : (
            <div>
              {allUsers.map((user) => (
                <div key={user.id} className="admin-item-card admin-card-layout">
                  <div className="admin-item-info-grid">
                    <div>
                      <label className="admin-item-label">Name:</label>
                      <span className="admin-item-value">{user.name || 'N/A'}</span>
                    </div>
                    <div>
                      <label className="admin-item-label">Matric:</label>
                      <span className="admin-item-value">{user.matric || 'N/A'}</span>
                    </div>
                    <div>
                      <label className="admin-item-label">Email:</label>
                      <span className="admin-item-value">{user.email || 'N/A'}</span>
                    </div>
                    <div>
                      <label className="admin-item-label">Program:</label>
                      <span className="admin-item-value">{user.program || 'N/A'}</span>
                    </div>
                  </div>
                  <div className="admin-card-actions">
                    <button
                      onClick={() => handleEditUser(user)}
                      className="admin-btn admin-btn-primary"
                    >
                      <i className="fas fa-edit"></i>
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="admin-btn admin-btn-danger"
                    >
                      <i className="fas fa-trash"></i>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        )}

        {/* User Modal */}
        {showUserModal && (
          <div className="admin-modal-overlay" onClick={() => setShowUserModal(false)}>
            <div className="admin-modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="admin-modal-header">
                <h2>{editingUser ? 'Edit User' : 'Add New User'}</h2>
                <button onClick={() => setShowUserModal(false)} className="admin-modal-close">
                  &times;
                </button>
              </div>

              <form onSubmit={handleSaveUser} style={{ maxHeight: '80vh', overflowY: 'auto', paddingRight: '0.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Name *</label>
                    <input
                      type="text"
                      required
                      value={userForm.name}
                      onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                      className="admin-form-input"
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">Matric Number *</label>
                    <input
                      type="text"
                      required
                      value={userForm.matric}
                      onChange={(e) => setUserForm({ ...userForm, matric: e.target.value.toUpperCase() })}
                      className="admin-form-input"
                      style={{ textTransform: 'uppercase' }}
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">Email *</label>
                    <input
                      type="email"
                      required
                      value={userForm.email}
                      onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                      className="admin-form-input"
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">Alternate Email</label>
                    <input
                      type="email"
                      value={userForm.email_alt}
                      onChange={(e) => setUserForm({ ...userForm, email_alt: e.target.value })}
                      className="admin-form-input"
                      placeholder="Optional"
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">
                      Password {editingUser ? '(leave blank to keep current)' : '*'}
                    </label>
                    <input
                      type="password"
                      required={!editingUser}
                      value={userForm.password}
                      onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                      minLength={editingUser ? 0 : 8}
                      className="admin-form-input"
                    />
                    {editingUser && (
                      <small className="admin-form-help">Leave blank to keep current password</small>
                    )}
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">Program *</label>
                    <select
                      required
                      value={userForm.program}
                      onChange={(e) => setUserForm({ ...userForm, program: e.target.value })}
                      className="admin-form-select"
                    >
                      <option value="BITA">BITA - Bachelor of Technology (Cloud Computing and Application)</option>
                    </select>
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">Year</label>
                    <input
                      type="text"
                      value={userForm.year}
                      onChange={(e) => setUserForm({ ...userForm, year: e.target.value })}
                      className="admin-form-input"
                      placeholder="e.g., Year 1, Year 2, Year 3"
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">Batch</label>
                    <input
                      type="text"
                      value={userForm.batch}
                      onChange={(e) => setUserForm({ ...userForm, batch: e.target.value })}
                      className="admin-form-input"
                      placeholder="e.g., 2024, 2025"
                    />
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">Phone</label>
                    <input
                      type="tel"
                      value={userForm.phone}
                      onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
                      className="admin-form-input"
                      placeholder="e.g., +60123456789"
                    />
                  </div>
                </div>

                <div className="admin-form-group" style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
                  <label className="admin-form-label">Bio</label>
                  <input
                    type="text"
                    value={userForm.bio}
                    onChange={(e) => setUserForm({ ...userForm, bio: e.target.value })}
                    className="admin-form-input"
                    placeholder="Short bio (optional)"
                  />
                </div>

                <div className="admin-form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="admin-form-label">Description</label>
                  <textarea
                    value={userForm.description}
                    onChange={(e) => setUserForm({ ...userForm, description: e.target.value })}
                    className="admin-form-input"
                    rows="3"
                    placeholder="Detailed description about yourself (optional)"
                  />
                </div>

                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                  <h4 style={{ marginBottom: '0.75rem', color: 'var(--primary-color)', fontSize: '0.95rem' }}>
                    <i className="fas fa-share-alt" style={{ marginRight: '0.5rem' }}></i>
                    Social Media Links (Optional)
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                    <div className="admin-form-group">
                      <label className="admin-form-label">
                        <i className="fab fa-instagram" style={{ marginRight: '0.5rem', color: '#E4405F' }}></i>
                        Instagram
                      </label>
                      <input
                        type="url"
                        value={userForm.instagram}
                        onChange={(e) => setUserForm({ ...userForm, instagram: e.target.value })}
                        className="admin-form-input"
                        placeholder="https://instagram.com/username"
                      />
                    </div>

                    <div className="admin-form-group">
                      <label className="admin-form-label">
                        <i className="fab fa-facebook" style={{ marginRight: '0.5rem', color: '#1877F2' }}></i>
                        Facebook
                      </label>
                      <input
                        type="url"
                        value={userForm.facebook}
                        onChange={(e) => setUserForm({ ...userForm, facebook: e.target.value })}
                        className="admin-form-input"
                        placeholder="https://facebook.com/username"
                      />
                    </div>

                    <div className="admin-form-group">
                      <label className="admin-form-label">
                        <i className="fab fa-twitter" style={{ marginRight: '0.5rem', color: '#1DA1F2' }}></i>
                        Twitter
                      </label>
                      <input
                        type="url"
                        value={userForm.twitter}
                        onChange={(e) => setUserForm({ ...userForm, twitter: e.target.value })}
                        className="admin-form-input"
                        placeholder="https://twitter.com/username"
                      />
                    </div>

                    <div className="admin-form-group">
                      <label className="admin-form-label">
                        <i className="fab fa-linkedin" style={{ marginRight: '0.5rem', color: '#0A66C2' }}></i>
                        LinkedIn
                      </label>
                      <input
                        type="url"
                        value={userForm.linkedin}
                        onChange={(e) => setUserForm({ ...userForm, linkedin: e.target.value })}
                        className="admin-form-input"
                        placeholder="https://linkedin.com/in/username"
                      />
                    </div>

                    <div className="admin-form-group">
                      <label className="admin-form-label">
                        <i className="fab fa-tiktok" style={{ marginRight: '0.5rem', color: '#000000' }}></i>
                        TikTok
                      </label>
                      <input
                        type="url"
                        value={userForm.tiktok}
                        onChange={(e) => setUserForm({ ...userForm, tiktok: e.target.value })}
                        className="admin-form-input"
                        placeholder="https://tiktok.com/@username"
                      />
                    </div>
                  </div>
                </div>

                <div className="admin-modal-footer" style={{ marginTop: '1.5rem' }}>
                  <button
                    type="button"
                    onClick={() => setShowUserModal(false)}
                    className="admin-btn-cancel"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="admin-btn admin-btn-primary"
                  >
                    {editingUser ? 'Update User' : 'Add User'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Admins Tab (Superadmin only) */}
        {isSuperAdmin && activeTab === 'admins' && (
          <div className="admin-tab-content">
            <div className="admin-content-header">
              <h2>
                <i className="fas fa-users-cog" style={{ marginRight: '0.5rem' }}></i>
                All Admins
              </h2>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <button
                  onClick={handleAddAdmin}
                  className="admin-btn admin-btn-success"
                >
                  <i className="fas fa-user-plus"></i>
                  Add New Admin
                </button>
                <button
                  onClick={loadData}
                  className="admin-btn admin-btn-primary"
                >
                  <i className="fas fa-sync-alt"></i>
                  Refresh
                </button>
              </div>
            </div>

            {admins.length === 0 ? (
              <div className="admin-empty-state">
                <i className="fas fa-users"></i>
                <p>No admins found</p>
              </div>
            ) : (
              <div>
                {admins.map((adminItem) => {
                  const isOtherSuperAdmin = adminItem.role === 'superadmin' && adminItem.id !== admin?.id
                  const canEdit = !isOtherSuperAdmin
                  const canDelete = !isOtherSuperAdmin && adminItem.id !== admin?.id

                  return (
                    <div key={adminItem.id} className="admin-item-card admin-card-layout">
                      <div className="admin-card-info">
                        <h4 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>{adminItem.name}</h4>
                        <p style={{ margin: '0.25rem 0', color: '#666', fontSize: '0.9rem' }}>
                          <i className="fas fa-envelope" style={{ marginRight: '0.5rem' }}></i>
                          {adminItem.email}
                        </p>
                        <p style={{ margin: '0.25rem 0', color: '#666', fontSize: '0.9rem' }}>
                          <i className="fas fa-calendar" style={{ marginRight: '0.5rem' }}></i>
                          Created: {formatDate(adminItem.created_at)}
                        </p>
                        {adminItem.last_login && (
                          <p style={{ margin: '0.25rem 0', color: '#666', fontSize: '0.9rem' }}>
                            <i className="fas fa-clock" style={{ marginRight: '0.5rem' }}></i>
                            Last login: {formatDate(adminItem.last_login)}
                          </p>
                        )}
                        <span className="admin-badge" style={{
                          background: adminItem.role === 'superadmin' ? '#fbbf24' : '#3b82f6',
                          color: adminItem.role === 'superadmin' ? '#92400e' : 'white',
                          marginTop: '0.5rem'
                        }}>
                          {adminItem.role === 'superadmin' ? 'Super Admin' : 'Moderator'}
                        </span>
                        {isOtherSuperAdmin && (
                          <p style={{ color: '#ef4444', marginTop: '0.5rem', fontSize: '0.85rem' }}>
                            <i className="fas fa-lock" style={{ marginRight: '0.5rem' }}></i>
                            Protected: Cannot edit other super admins
                          </p>
                        )}
                      </div>
                      <div className="admin-card-actions">
                        <button
                          onClick={() => handleEditAdmin(adminItem)}
                          disabled={!canEdit}
                          className={`admin-btn admin-btn-primary ${!canEdit ? '' : ''}`}
                        >
                          <i className="fas fa-edit"></i>
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteAdmin(adminItem.id)}
                          disabled={!canDelete}
                          className={`admin-btn admin-btn-danger ${!canDelete ? '' : ''}`}
                        >
                          <i className="fas fa-trash"></i>
                          Delete
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Categories Management Section */}
        {activeTab === 'categories' && (
          <CategoryManagement
            categories={categories}
            categoryTree={categoryTree}
            onRefresh={loadData}
          />
        )}

        {/* User Problems Section */}
        {activeTab === 'user-problems' && (
          <div className="admin-tab-content" style={{ padding: 0, overflow: 'hidden' }}>
            <AdminUserProblems />
          </div>
        )}

        {/* All Files Section */}
        {activeTab === 'all-files' && (
          <div className="admin-tab-content">
            <div className="admin-content-header">
              <h2>
                <i className="fas fa-file-upload" style={{ marginRight: '0.5rem' }}></i>
                All Uploaded Files
              </h2>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <button
                  onClick={loadAllFiles}
                  className="admin-btn admin-btn-primary"
                >
                  <i className="fas fa-sync-alt"></i>
                  Refresh
                </button>
              </div>
            </div>

            {loadingAllFiles ? (
              <div className="admin-empty-state">
                <i className="fas fa-spinner fa-spin" style={{ fontSize: '3rem', color: 'var(--primary-color)' }}></i>
                <p>Loading files...</p>
              </div>
            ) : allFiles.length === 0 ? (
              <div className="admin-empty-state">
                <i className="fas fa-file-upload"></i>
                <p>No files uploaded yet</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {allFiles.map((file, index) => (
                  <div key={file.id} className="admin-item-card admin-card-layout" style={{ animationDelay: `${index * 0.05}s` }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                        {file.is_pinned && (
                          <i className="fas fa-thumbtack" style={{ color: '#f59e0b', fontSize: '0.875rem' }} title="Pinned by admin"></i>
                        )}
                        <h4 style={{ margin: 0, color: '#333', fontSize: '1rem', fontWeight: '600', wordBreak: 'break-word' }}>
                          {file.file_name}
                        </h4>
                        <span 
                          className={`admin-file-visibility admin-file-visibility-${(file.visibility || 'Public').toLowerCase().replace(' ', '-')}`}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            padding: '0.125rem 0.5rem',
                            borderRadius: '6px',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            background: file.visibility === 'Public' 
                              ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(22, 163, 74, 0.05))'
                              : file.visibility === 'Private'
                              ? 'linear-gradient(135deg, rgba(251, 191, 36, 0.1), rgba(217, 119, 6, 0.05))'
                              : 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(124, 58, 237, 0.05))',
                            border: file.visibility === 'Public'
                              ? '1px solid rgba(34, 197, 94, 0.3)'
                              : file.visibility === 'Private'
                              ? '1px solid rgba(251, 191, 36, 0.3)'
                              : '1px solid rgba(139, 92, 246, 0.3)',
                            color: file.visibility === 'Public'
                              ? '#047857'
                              : file.visibility === 'Private'
                              ? '#b45309'
                              : '#6b21a8'
                          }}
                          title={`Visibility: ${file.visibility || 'Public'}`}
                        >
                          <i className={`fas fa-${file.visibility === 'Public' ? 'globe' : file.visibility === 'Private' ? 'lock' : 'shield-alt'}`}></i>
                          <span>{file.visibility || 'Public'}</span>
                        </span>
                      </div>
                      
                      <div 
                        className="admin-file-path"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          marginBottom: '0.75rem',
                          padding: '0.5rem 0.75rem',
                          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08), rgba(96, 165, 250, 0.05))',
                          border: '1px solid rgba(59, 130, 246, 0.2)',
                          borderRadius: '6px',
                          fontSize: '0.875rem',
                          color: '#333'
                        }}
                      >
                        <i className="fas fa-folder-tree" style={{ color: '#3b82f6', fontSize: '0.875rem', flexShrink: 0 }}></i>
                        <span style={{ fontWeight: '500', color: '#333', wordBreak: 'break-word' }}>
                          {file.category_path || file.week_name || 'Unknown Location'}
                        </span>
                      </div>

                      <div className="admin-item-info-grid" style={{ marginBottom: '0.5rem' }}>
                        <div>
                          <label className="admin-item-label">Uploaded by:</label>
                          <span className="admin-item-value">
                            {file.uploader_name} ({file.uploader_matric})
                          </span>
                        </div>
                        <div>
                          <label className="admin-item-label">Size:</label>
                          <span className="admin-item-value">{file.file_size_formatted}</span>
                        </div>
                        <div>
                          <label className="admin-item-label">Uploaded:</label>
                          <span className="admin-item-value">{new Date(file.created_at).toLocaleDateString()}</span>
                        </div>
                        <div>
                          <label className="admin-item-label">Views:</label>
                          <span className="admin-item-value">{file.views || 0}</span>
                        </div>
                        <div>
                          <label className="admin-item-label">Downloads:</label>
                          <span className="admin-item-value">{file.downloads || 0}</span>
                        </div>
                      </div>

                      {file.description && (
                        <p style={{ margin: '0.5rem 0 0 0', color: '#666', fontSize: '0.9rem', lineHeight: '1.5', wordBreak: 'break-word' }}>
                          <strong>Description:</strong> {file.description}
                        </p>
                      )}
                    </div>

                    <div className="admin-card-actions">
                      <button
                        onClick={() => window.open(`/${file.file_path}`, '_blank')}
                        className="admin-btn admin-btn-primary"
                        title="Download"
                      >
                        <i className="fas fa-download"></i>
                        Download
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete "${file.file_name}"?`)) {
                            handleDeleteFile(file.id)
                          }
                        }}
                        className="admin-btn admin-btn-danger"
                        title="Delete"
                      >
                        <i className="fas fa-trash"></i>
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Admin Logs Tab (Superadmin only) */}
        {isSuperAdmin && activeTab === 'logs' && (
          <div className="admin-tab-content">
            <div className="admin-content-header">
              <h2>
                <i className="fas fa-list-alt" style={{ marginRight: '0.5rem' }}></i>
                Admin Activity Logs
              </h2>
              <button
                onClick={loadData}
                className="admin-btn admin-btn-primary"
              >
                <i className="fas fa-sync-alt"></i>
                Refresh
              </button>
            </div>

            {adminLogs.length === 0 ? (
              <div className="admin-empty-state">
                <i className="fas fa-list-alt"></i>
                <p>No admin logs found</p>
              </div>
            ) : (
              <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                {adminLogs.map((log) => (
                  <div key={log.id} className="admin-item-card">
                    <div style={{ flex: 1 }}>
                      <div style={{ 
                        display: 'flex', 
                        gap: '0.75rem', 
                        alignItems: 'center', 
                        marginBottom: '0.75rem',
                        flexWrap: 'wrap'
                      }}>
                        <span style={{
                          padding: '0.25rem 0.75rem',
                          borderRadius: '20px',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          background: getActionColor(log.action),
                          color: 'white',
                          whiteSpace: 'nowrap'
                        }}>
                          {log.action.toUpperCase()}
                        </span>
                        <span style={{ color: '#666', fontSize: '0.9rem', fontWeight: '500' }}>
                          {log.admin_name}
                        </span>
                        <span style={{ color: '#999', fontSize: '0.85rem' }}>
                          {formatDate(log.created_at)}
                        </span>
                      </div>
                      <p style={{ margin: '0.5rem 0', color: '#333', fontWeight: '500', fontSize: '0.95rem' }}>
                        {log.action === 'create' && `Created ${log.target_type}: ${log.target_name || 'N/A'}`}
                        {log.action === 'update' && `Updated ${log.target_type}: ${log.target_name || 'N/A'}`}
                        {log.action === 'delete' && `Deleted ${log.target_type}: ${log.target_name || 'N/A'}`}
                        {log.action === 'approve' && `Approved ${log.target_type}: ${log.target_name || 'N/A'}`}
                        {log.action === 'reject' && `Rejected ${log.target_type}: ${log.target_name || 'N/A'}`}
                      </p>
                      {log.details && (
                        <p style={{ margin: '0.5rem 0', color: '#666', fontSize: '0.85rem', lineHeight: '1.5' }}>
                          <strong>Details:</strong> {log.details}
                        </p>
                      )}
                      {log.ip_address && (
                        <p style={{ margin: '0.5rem 0 0 0', color: '#999', fontSize: '0.75rem' }}>
                          <i className="fas fa-network-wired" style={{ marginRight: '0.5rem' }}></i>
                          IP: {log.ip_address}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Admin Modal */}
        {showAdminModal && (
          <div className="admin-modal-overlay" onClick={() => setShowAdminModal(false)}>
            <div className="admin-modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="admin-modal-header">
                <h2>{editingAdmin ? 'Edit Admin' : 'Add New Admin'}</h2>
                <button onClick={() => setShowAdminModal(false)} className="admin-modal-close">
                  &times;
                </button>
              </div>

              <form onSubmit={handleSaveAdmin}>
                <div className="admin-form-group">
                  <label className="admin-form-label">Name *</label>
                  <input
                    type="text"
                    required
                    value={adminForm.name}
                    onChange={(e) => setAdminForm({ ...adminForm, name: e.target.value })}
                    className="admin-form-input"
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Email *</label>
                  <input
                    type="email"
                    required
                    value={adminForm.email}
                    onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
                    className="admin-form-input"
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">
                    Password {editingAdmin ? '(leave blank to keep current)' : '*'}
                  </label>
                  <input
                    type="password"
                    required={!editingAdmin}
                    value={adminForm.password}
                    onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                    minLength={editingAdmin ? 0 : 8}
                    className="admin-form-input"
                  />
                  {editingAdmin && (
                    <small className="admin-form-help">Leave blank to keep current password</small>
                  )}
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Role *</label>
                  <select
                    required
                    value={adminForm.role}
                    onChange={(e) => setAdminForm({ ...adminForm, role: e.target.value })}
                    disabled={editingAdmin && editingAdmin.id === admin?.id && admin?.role === 'superadmin'}
                    className="admin-form-select"
                  >
                    <option value="moderator">Moderator</option>
                    <option value="superadmin">Super Admin</option>
                  </select>
                  {editingAdmin && editingAdmin.id === admin?.id && admin?.role === 'superadmin' && (
                    <small className="admin-form-help">Cannot change your own role from superadmin</small>
                  )}
                </div>

                <div className="admin-modal-footer">
                  <button
                    type="button"
                    onClick={() => setShowAdminModal(false)}
                    className="admin-btn-cancel"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="admin-btn admin-btn-primary"
                  >
                    {editingAdmin ? 'Update Admin' : 'Create Admin'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function getActionColor(action) {
  const colors = {
    'create': '#10b981',
    'update': '#3b82f6',
    'delete': '#ef4444',
    'approve': '#10b981',
    'reject': '#ef4444'
  }
  return colors[action] || '#667eea'
}

// Category Management Component
function CategoryManagement({ categories, categoryTree, onRefresh }) {
  const [expandedCategories, setExpandedCategories] = useState({})
  const [showModal, setShowModal] = useState(false)
  const [showFileUploadModal, setShowFileUploadModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [parentCategory, setParentCategory] = useState(null)
  const [selectedWeek, setSelectedWeek] = useState(null)
  const [files, setFiles] = useState([])
  const [loadingFiles, setLoadingFiles] = useState(false)
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    level: 1,
    parent_id: null,
    description: '',
    display_order: 0
  })

  const levelNames = {
    1: 'Category',
    2: 'Subcategory',
    3: 'Subject',
    4: 'Type',
    5: 'Week'
  }

  const toggleExpand = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }))
  }

  const handleAddCategory = (level, parent = null) => {
    setEditingCategory(null)
    setParentCategory(parent)
    
    // Ensure level is valid integer
    const validLevel = parseInt(level) || 1
    if (validLevel < 1 || validLevel > 5) {
      alert('Invalid level. Level must be between 1 and 5.')
      return
    }
    
    setCategoryForm({
      name: '',
      level: validLevel,
      parent_id: parent?.id || null,
      description: '',
      display_order: 0
    })
    
    console.log('Adding category - Level:', validLevel, 'Parent:', parent)
    setShowModal(true)
  }

  const handleEditCategory = (category) => {
    setEditingCategory(category)
    setParentCategory(categories.find(c => c.id === category.parent_id) || null)
    setCategoryForm({
      name: category.name,
      level: category.level,
      parent_id: category.parent_id,
      description: category.description || '',
      display_order: category.display_order || 0
    })
    setShowModal(true)
  }

  const handleDeleteCategory = async (category) => {
    if (!confirm(`Are you sure you want to delete "${category.name}"? ${category.level < 5 ? 'This will also delete all child categories.' : ''}`)) return

    try {
      const response = await fetch(`/api/delete_category.php?id=${category.id}`, {
        method: 'DELETE',
        credentials: 'include'
      })
      const result = await response.json()
      if (result.success) {
        alert(result.message || 'Category deleted successfully')
        onRefresh()
      } else {
        alert(result.message || 'Failed to delete category')
      }
    } catch (error) {
      console.error('Error deleting category:', error)
      alert('Failed to delete category')
    }
  }

  const handleUploadFile = async (week) => {
    setSelectedWeek(week)
    setShowFileUploadModal(true)
    loadFiles(week.id)
  }

  const loadFiles = async (weekId) => {
    setLoadingFiles(true)
    try {
      const response = await fetch(`/api/get_week_files.php?week_id=${weekId}`, {
        credentials: 'include'
      })
      const result = await response.json()
      if (result.success) {
        setFiles(result.files || [])
      }
    } catch (error) {
      console.error('Error loading files:', error)
    } finally {
      setLoadingFiles(false)
    }
  }

  const handleFileUpload = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    formData.append('week_id', selectedWeek.id)
    
    try {
      const response = await fetch('/api/upload_module_file.php', {
        method: 'POST',
        credentials: 'include',
        body: formData
      })
      const result = await response.json()
      if (result.success) {
        alert(result.message || 'File uploaded successfully')
        e.target.reset()
        loadFiles(selectedWeek.id)
        onRefresh()
      } else {
        alert(result.message || 'Failed to upload file')
      }
    } catch (error) {
      console.error('Error uploading file:', error)
      alert('Failed to upload file')
    }
  }

  const handleDeleteFile = async (file) => {
    if (!confirm(`Are you sure you want to delete "${file.file_name}"?`)) return

    try {
      const response = await fetch(`/api/delete_module_file.php?id=${file.id}`, {
        method: 'DELETE',
        credentials: 'include'
      })
      const result = await response.json()
      if (result.success) {
        alert(result.message || 'File deleted successfully')
        loadFiles(selectedWeek.id)
      } else {
        alert(result.message || 'Failed to delete file')
      }
    } catch (error) {
      console.error('Error deleting file:', error)
      alert('Failed to delete file')
    }
  }

  const handleDownloadFile = (file) => {
    window.open(`/${file.file_path}`, '_blank')
  }

  const handleSaveCategory = async (e) => {
    e.preventDefault()

    try {
      const url = editingCategory ? '/api/update_category.php' : '/api/create_category.php'
      const method = editingCategory ? 'PUT' : 'POST'
      
      // Ensure level is a valid integer between 1 and 5
      const formData = { ...categoryForm }
      formData.level = parseInt(formData.level) || 1
      
      if (formData.level < 1 || formData.level > 5) {
        alert('Level must be between 1 and 5')
        return
      }
      
      const payload = editingCategory ? { id: editingCategory.id, ...formData } : formData
      
      console.log('Saving category:', payload)
      
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(payload)
      })

      const result = await response.json()
      if (result.success) {
        setShowModal(false)
        onRefresh()
        alert(result.message || 'Category saved successfully')
      } else {
        alert(result.message || 'Failed to save category')
        console.error('Category save error:', result)
      }
    } catch (error) {
      console.error('Error saving category:', error)
      alert('Failed to save category: ' + (error.message || 'Network error'))
    }
  }

  const renderCategoryTree = (items, level = 1, parentPath = '') => {
    if (!items || items.length === 0) return null

    return (
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {items.map((item) => {
          // Ensure item has required properties
          if (!item || !item.id || !item.name || item.level === undefined || item.level === null) {
            console.error('Invalid category item:', item)
            return null
          }
          
          const hasChildren = item.children && item.children.length > 0
          const isExpanded = expandedCategories[item.id]
          const currentPath = parentPath ? `${parentPath} > ${item.name}` : item.name
          const itemLevel = parseInt(item.level) || 1

          return (
            <li key={item.id} className="admin-category-item" style={{ marginBottom: '0.5rem' }}>
              <div className="admin-category-card" style={{
                display: 'flex',
                flexDirection: 'column',
                padding: '0.75rem',
                background: '#f9fafb',
                borderRadius: '6px',
                border: '1px solid #e5e7eb',
                gap: '0.75rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', width: '100%' }}>
                  {hasChildren && (
                    <button
                      onClick={() => toggleExpand(item.id)}
                      className="admin-category-expand-btn"
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '0.25rem',
                        fontSize: '0.875rem',
                        color: '#6b7280',
                        flexShrink: 0
                      }}
                    >
                      <i className={`fas fa-chevron-${isExpanded ? 'down' : 'right'}`}></i>
                    </button>
                  )}
                  {!hasChildren && <span style={{ width: '24px', flexShrink: 0 }}></span>}
                  
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.25rem' }}>
                      <span className="admin-category-level-badge" style={{
                        background: '#3b82f6',
                        color: 'white',
                        padding: '0.125rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        whiteSpace: 'nowrap'
                      }}>
                        {levelNames[itemLevel] || `Level ${itemLevel}`}
                      </span>
                      <strong style={{ color: '#1f2937', fontSize: '0.95rem', wordBreak: 'break-word' }}>{item.name}</strong>
                    </div>
                    {item.description && (
                      <div style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.25rem', wordBreak: 'break-word' }}>
                        {item.description}
                      </div>
                    )}
                    <div style={{ fontSize: '0.75rem', color: '#9ca3af', wordBreak: 'break-word' }}>
                      Path: {currentPath}
                    </div>
                  </div>
                </div>

                <div className="admin-category-actions" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', width: '100%' }}>
                  {itemLevel < 5 && (() => {
                    const nextLevel = itemLevel + 1
                    return (
                      <button
                        key={`add-${nextLevel}-${item.id}`}
                        onClick={() => {
                          console.log('Adding next level:', nextLevel, 'Current item level:', itemLevel, 'Item:', item)
                          if (nextLevel >= 1 && nextLevel <= 5) {
                            handleAddCategory(nextLevel, item)
                          } else {
                            alert('Invalid level: ' + nextLevel)
                          }
                        }}
                        className="admin-btn admin-btn-primary admin-category-btn"
                        style={{ padding: '0.5rem 0.75rem', fontSize: '0.875rem', whiteSpace: 'nowrap', flex: '1 1 auto', minWidth: 'fit-content' }}
                      >
                        <i className="fas fa-folder-plus"></i> <span className="admin-category-btn-text">Add {levelNames[nextLevel] || `Level ${nextLevel}`}</span>
                      </button>
                    )
                  })()}
                  {itemLevel === 5 && (
                    <button
                      onClick={() => handleUploadFile(item)}
                      className="admin-btn admin-btn-primary admin-category-btn"
                      style={{ padding: '0.5rem 0.75rem', fontSize: '0.875rem', background: '#10b981', whiteSpace: 'nowrap', flex: '1 1 auto', minWidth: 'fit-content' }}
                    >
                      <i className="fas fa-file-upload"></i> <span className="admin-category-btn-text">Upload File</span>
                    </button>
                  )}
                  <button
                    onClick={() => handleEditCategory(item)}
                    className="admin-btn admin-btn-primary admin-category-btn"
                    style={{ padding: '0.5rem 0.75rem', fontSize: '0.875rem', whiteSpace: 'nowrap', flex: '1 1 auto', minWidth: 'fit-content' }}
                  >
                    <i className="fas fa-edit"></i> <span className="admin-category-btn-text">Edit</span>
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(item)}
                    className="admin-btn admin-btn-danger admin-category-btn"
                    style={{ padding: '0.5rem 0.75rem', fontSize: '0.875rem', whiteSpace: 'nowrap', flex: '1 1 auto', minWidth: 'fit-content' }}
                  >
                    <i className="fas fa-trash"></i> <span className="admin-category-btn-text">Delete</span>
                  </button>
                </div>
              </div>

              {hasChildren && isExpanded && (
                <div className="admin-category-children" style={{ marginLeft: '1.5rem', marginTop: '0.5rem' }}>
                  {renderCategoryTree(item.children, level + 1, currentPath)}
                </div>
              )}
            </li>
          )
        })}
      </ul>
    )
  }

  return (
    <div className="admin-tab-content">
      <div className="admin-content-header">
        <h2>
          <i className="fas fa-folder-tree" style={{ marginRight: '0.5rem', color: '#10b981' }}></i>
          Module Categories
        </h2>
        <button
          onClick={() => handleAddCategory(1)}
          className="admin-btn admin-btn-primary"
        >
          <i className="fas fa-plus"></i>
          Add Category
        </button>
      </div>

      <div className="admin-category-tree-box" style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        {categoryTree.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
            <i className="fas fa-folder-open" style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}></i>
            <p>No categories yet. Start by creating a Category (e.g., "Year 1").</p>
            <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
              Structure: Category → Subcategory → Subject → Type → Week
            </p>
          </div>
        ) : (
          renderCategoryTree(categoryTree)
        )}
      </div>

      {/* Category Modal */}
      {showModal && (
        <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="admin-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>{editingCategory ? 'Edit Category' : `Add ${levelNames[categoryForm.level]}`}</h3>
              <button onClick={() => setShowModal(false)} className="admin-modal-close">
                <i className="fas fa-times"></i>
              </button>
            </div>

            <form onSubmit={handleSaveCategory}>
              {parentCategory && (
                <div style={{ marginBottom: '1rem', padding: '0.75rem', background: '#f3f4f6', borderRadius: '6px' }}>
                  <small style={{ color: '#6b7280' }}>Parent: {parentCategory.name}</small>
                </div>
              )}

              <div className="admin-form-group">
                <label className="admin-form-label">Name *</label>
                <input
                  type="text"
                  required
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  className="admin-form-input"
                  placeholder={`Enter ${levelNames[categoryForm.level]?.toLowerCase() || 'name'}`}
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Description</label>
                <textarea
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  className="admin-form-input"
                  rows="3"
                  placeholder="Optional description"
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Display Order</label>
                <input
                  type="number"
                  value={categoryForm.display_order}
                  onChange={(e) => setCategoryForm({ ...categoryForm, display_order: parseInt(e.target.value) || 0 })}
                  className="admin-form-input"
                  min="0"
                />
                <small className="admin-form-help">Lower numbers appear first</small>
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="admin-btn-cancel"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-btn admin-btn-primary"
                >
                  {editingCategory ? 'Update Category' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* File Upload Modal */}
      {showFileUploadModal && selectedWeek && (
        <div className="admin-modal-overlay" onClick={() => setShowFileUploadModal(false)}>
          <div className="admin-modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '700px' }}>
            <div className="admin-modal-header">
              <h3>Files in "{selectedWeek.name}"</h3>
              <button onClick={() => setShowFileUploadModal(false)} className="admin-modal-close">
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <form onSubmit={handleFileUpload}>
                <div className="admin-form-group">
                  <label className="admin-form-label">Upload File *</label>
                  <input
                    type="file"
                    name="file"
                    required
                    className="admin-form-input"
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.zip,.rar,.jpg,.jpeg,.png,.gif"
                  />
                  <small className="admin-form-help">Max size: 50MB. Allowed: PDF, DOC, PPT, XLS, TXT, ZIP, Images</small>
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Description</label>
                  <textarea
                    name="description"
                    className="admin-form-input"
                    rows="3"
                    placeholder="Optional file description"
                  />
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => setShowFileUploadModal(false)}
                    className="admin-btn-cancel"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="admin-btn admin-btn-primary"
                    style={{ background: '#10b981' }}
                  >
                    <i className="fas fa-upload"></i> Upload
                  </button>
                </div>
              </form>
            </div>

            {/* Files List */}
            <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1.5rem' }}>
              <h4 style={{ marginBottom: '1rem', color: '#1f2937' }}>Uploaded Files</h4>
              {loadingFiles ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', color: '#3b82f6' }}></i>
                </div>
              ) : files.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#6b7280', padding: '2rem' }}>No files uploaded yet</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {files.map((file) => (
                    <div key={file.id} style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0.75rem',
                      background: '#f9fafb',
                      borderRadius: '6px',
                      border: '1px solid #e5e7eb',
                      gap: '1rem'
                    }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                          <i className="fas fa-file" style={{ color: '#3b82f6' }}></i>
                          <strong style={{ color: '#1f2937', fontSize: '0.95rem' }}>{file.file_name}</strong>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                          {file.file_size_formatted} • Uploaded by {file.uploader_name} ({file.uploader_matric}) • {new Date(file.created_at).toLocaleDateString()}
                        </div>
                        {file.description && (
                          <div style={{ fontSize: '0.85rem', color: '#4b5563', marginTop: '0.25rem' }}>
                            {file.description}
                          </div>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => handleDownloadFile(file)}
                          className="admin-btn admin-btn-primary"
                          style={{ padding: '0.5rem 0.75rem', fontSize: '0.875rem' }}
                        >
                          <i className="fas fa-download"></i>
                        </button>
                        <button
                          onClick={() => handleDeleteFile(file)}
                          className="admin-btn admin-btn-danger"
                          style={{ padding: '0.5rem 0.75rem', fontSize: '0.875rem' }}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard

