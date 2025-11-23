import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLecturer } from '../../context/LecturerContext'
import { useTheme } from '../../context/ThemeContext'
import { getApiUrl } from '../../utils/api'

function LecturerDashboard() {
  const { isLecturer, lecturer, lecturerLogout } = useLecturer()
  const { isDarkMode, toggleTheme } = useTheme()
  const [isThemeAnimating, setIsThemeAnimating] = useState(false)
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('upload-management') // 'upload-management', 'view-files'
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLecturer) {
      navigate('/login', { state: { from: { pathname: '/lecturer/dashboard' } } })
      return
    }
    loadFiles()
  }, [isLecturer, navigate])

  const handleThemeClick = () => {
    setIsThemeAnimating(true)
    toggleTheme()
    setTimeout(() => {
      setIsThemeAnimating(false)
    }, 600)
  }

  const loadFiles = async () => {
    try {
      setLoading(true)
      const response = await fetch(getApiUrl('/api/manage_upload_permissions.php'), {
        credentials: 'include'
      })
      const result = await response.json()
      
      if (result.success && result.files) {
        setFiles(result.files)
      } else {
        console.error('Failed to load files:', result.message)
      }
    } catch (error) {
      console.error('Error loading files:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleUploadPermission = async (fileId, currentStatus) => {
    try {
      const response = await fetch(getApiUrl('/api/manage_upload_permissions.php'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          file_id: fileId,
          upload_allowed: !currentStatus
        })
      })
      
      const result = await response.json()
      
      if (result.success) {
        // Update local state
        setFiles(files.map(file => 
          file.id === fileId 
            ? { ...file, upload_allowed: result.upload_allowed }
            : file
        ))
        alert('Upload permission updated successfully!')
      } else {
        alert('Failed to update permission: ' + result.message)
      }
    } catch (error) {
      console.error('Error updating permission:', error)
      alert('Error updating permission. Please try again.')
    }
  }

  const filteredFiles = files.filter(file => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      file.file_name?.toLowerCase().includes(query) ||
      file.title?.toLowerCase().includes(query) ||
      file.uploader_name?.toLowerCase().includes(query) ||
      file.category_name?.toLowerCase().includes(query)
    )
  })

  const handleLogout = async () => {
    await lecturerLogout()
    navigate('/login')
  }

  if (!isLecturer) {
    return null
  }

  return (
    <div className={`lecturer-dashboard ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="lecturer-header">
        <div className="lecturer-header-content">
          <h1>Lecturer Dashboard</h1>
          <div className="lecturer-header-actions">
            <button
              className={`theme-toggle ${isDarkMode ? 'dark' : 'light'} ${isThemeAnimating ? 'animating' : ''}`}
              onClick={handleThemeClick}
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
        <div className="lecturer-info">
          <p>Welcome, <strong>{lecturer?.name}</strong> ({lecturer?.email})</p>
        </div>
      </div>

      <div className="lecturer-tabs">
        <button
          className={`lecturer-tab ${activeTab === 'upload-management' ? 'active' : ''}`}
          onClick={() => setActiveTab('upload-management')}
        >
          📁 Upload Management
        </button>
        <button
          className={`lecturer-tab ${activeTab === 'view-files' ? 'active' : ''}`}
          onClick={() => setActiveTab('view-files')}
        >
          👁️ View All Files
        </button>
        <button
          className={`lecturer-tab ${activeTab === 'user-view' ? 'active' : ''}`}
          onClick={() => navigate('/modules')}
        >
          👤 User View (Modules)
        </button>
      </div>

      <div className="lecturer-content">
        {activeTab === 'upload-management' && (
          <div className="upload-management-section">
            <div className="section-header">
              <h2>Manage Upload Permissions</h2>
              <p>Control which file types users can upload</p>
              <div className="search-bar">
                <input
                  type="text"
                  placeholder="Search files by name, uploader, or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>
            </div>

            {loading ? (
              <div className="loading">Loading files...</div>
            ) : filteredFiles.length === 0 ? (
              <div className="empty-state">No files found.</div>
            ) : (
              <div className="files-grid">
                {filteredFiles.map((file) => (
                  <div key={file.id} className={`file-card ${file.upload_allowed ? 'allowed' : 'not-allowed'}`}>
                    <div className="file-card-header">
                      <h3>{file.title || file.file_name}</h3>
                      <span className={`permission-badge ${file.upload_allowed ? 'allowed' : 'not-allowed'}`}>
                        {file.upload_allowed ? '✅ Allowed' : '❌ Not Allowed'}
                      </span>
                    </div>
                    <div className="file-card-body">
                      <p><strong>File:</strong> {file.file_name}</p>
                      <p><strong>Category:</strong> {file.category_name || 'Uncategorized'}</p>
                      <p><strong>Uploader:</strong> {file.uploader_name || 'Unknown'} ({file.uploader_matric || 'N/A'})</p>
                      <p><strong>Uploaded:</strong> {new Date(file.uploaded_at).toLocaleDateString()}</p>
                      {file.description && (
                        <p><strong>Description:</strong> {file.description}</p>
                      )}
                    </div>
                    <div className="file-card-actions">
                      <button
                        className={`toggle-btn ${file.upload_allowed ? 'disable' : 'enable'}`}
                        onClick={() => toggleUploadPermission(file.id, file.upload_allowed)}
                      >
                        {file.upload_allowed ? '🚫 Disallow' : '✅ Allow'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'view-files' && (
          <div className="view-files-section">
            <div className="section-header">
              <h2>All Uploaded Files</h2>
              <p>View all files uploaded by users</p>
              <div className="search-bar">
                <input
                  type="text"
                  placeholder="Search files..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>
            </div>

            {loading ? (
              <div className="loading">Loading files...</div>
            ) : filteredFiles.length === 0 ? (
              <div className="empty-state">No files found.</div>
            ) : (
              <div className="files-table">
                <table>
                  <thead>
                    <tr>
                      <th>File Name</th>
                      <th>Title</th>
                      <th>Category</th>
                      <th>Uploader</th>
                      <th>Upload Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFiles.map((file) => (
                      <tr key={file.id}>
                        <td>{file.file_name}</td>
                        <td>{file.title || '-'}</td>
                        <td>{file.category_name || 'Uncategorized'}</td>
                        <td>{file.uploader_name || 'Unknown'}</td>
                        <td>{new Date(file.uploaded_at).toLocaleDateString()}</td>
                        <td>
                          <span className={`status-badge ${file.upload_allowed ? 'allowed' : 'not-allowed'}`}>
                            {file.upload_allowed ? '✅ Allowed' : '❌ Not Allowed'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default LecturerDashboard

