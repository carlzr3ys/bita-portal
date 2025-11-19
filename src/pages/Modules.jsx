import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useAdmin } from '../context/AdminContext'

function Modules() {
  const { isAuthenticated, user } = useAuth()
  const { isAdmin } = useAdmin()
  const [categoryTree, setCategoryTree] = useState([])
  const [expandedCategories, setExpandedCategories] = useState({})
  const [selectedWeek, setSelectedWeek] = useState(null)
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingFiles, setLoadingFiles] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showUploadForm, setShowUploadForm] = useState(false)
  const [uploadFormData, setUploadFormData] = useState({
    title: '',
    description: '',
    file: null,
    visibility: 'Public'
  })
  const [activeView, setActiveView] = useState('browse') // 'browse' or 'my-uploads'
  const [myUploads, setMyUploads] = useState([])
  const [loadingMyUploads, setLoadingMyUploads] = useState(false)
  const [editingFile, setEditingFile] = useState(null)
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    visibility: 'Public'
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [highlightedFileId, setHighlightedFileId] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/modules' } } })
      return
    }
    loadCategories()
  }, [isAuthenticated, navigate])

  const loadCategories = async () => {
    try {
      const response = await fetch('/api/get_categories.php', {
        credentials: 'include'
      })
      const result = await response.json()

      if (result.success) {
        setCategoryTree(result.tree || [])
        console.log('Categories loaded, tree:', result.tree)
      }
    } catch (error) {
      console.error('Error loading categories:', error)
    } finally {
      setLoading(false)
    }
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

  const loadMyUploads = async () => {
    setLoadingMyUploads(true)
    try {
      console.log('Loading my uploads...')
      const response = await fetch('/api/get_my_uploads.php', {
        credentials: 'include'
      })
      console.log('My uploads response status:', response.status)
      
      const result = await response.json()
      console.log('My uploads result:', result)
      
      if (result.success) {
        console.log('My uploads files:', result.files)
        console.log('My uploads count:', result.count)
        setMyUploads(result.files || [])
      } else {
        console.error('Failed to load my uploads:', result.message)
        alert('Failed to load your uploads: ' + (result.message || 'Unknown error'))
      }
    } catch (error) {
      console.error('Error loading my uploads:', error)
      alert('Error loading your uploads: ' + error.message)
    } finally {
      setLoadingMyUploads(false)
    }
  }

  useEffect(() => {
    if (activeView === 'my-uploads') {
      loadMyUploads()
    }
  }, [activeView, isAuthenticated])

  const toggleExpand = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }))
  }

  const handleWeekClick = (week) => {
    console.log('handleWeekClick called with:', week)
    setSelectedWeek(week)
    setShowUploadForm(false) // Display files list first, not upload form
    loadFiles(week.id)
    // Scroll to files section
    setTimeout(() => {
      const filesSection = document.querySelector('.module-files-header')
      if (filesSection) {
        filesSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 300)
  }

  const handleUploadFile = async (e) => {
    e.preventDefault()
    if (!selectedWeek) return

    // Check if file is selected
    if (!uploadFormData.file) {
      alert('Please select a file to upload')
      return
    }

    // Create FormData manually to ensure file is included
    const formData = new FormData()
    formData.append('file', uploadFormData.file)
    formData.append('week_id', selectedWeek.id)
    
    // Combine title and description into description field
    const title = uploadFormData.title.trim()
    const description = uploadFormData.description.trim()
    const combinedDescription = title 
      ? (description ? `${title} - ${description}` : title)
      : description
    
    if (combinedDescription) {
      formData.append('description', combinedDescription)
    }
    
    // Add visibility
    formData.append('visibility', uploadFormData.visibility || 'Public')
    
    try {
      console.log('Uploading file:', {
        fileName: uploadFormData.file?.name,
        fileSize: uploadFormData.file?.size,
        weekId: selectedWeek.id,
        title: uploadFormData.title,
        description: uploadFormData.description
      })

      const response = await fetch('/api/upload_module_file.php', {
        method: 'POST',
        credentials: 'include',
        body: formData
      })

      console.log('Upload response status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Upload response error:', errorText)
        alert('Upload failed: ' + response.status + ' ' + response.statusText)
        return
      }

      const result = await response.json()
      console.log('Upload result:', result)

      if (result.success) {
        alert(result.message || 'File uploaded successfully')
        e.target.reset()
        // Reset file input explicitly
        const fileInput = e.target.querySelector('input[type="file"]')
        if (fileInput) fileInput.value = ''
        setUploadFormData({ title: '', description: '', file: null, visibility: 'Public' })
        setShowUploadForm(false)
        // Wait a bit before reloading files to ensure DB is updated
        setTimeout(() => {
          loadFiles(selectedWeek.id)
          // Also reload My Uploads if we're on that view
          if (activeView === 'my-uploads') {
            loadMyUploads()
          }
        }, 500)
      } else {
        const errorMsg = result.message || 'Failed to upload file'
        console.error('Upload error:', result)
        alert('Upload failed: ' + errorMsg + (result.error_code ? ' (Error: ' + result.error_code + ')' : ''))
      }
    } catch (error) {
      console.error('Error uploading file:', error)
      alert('Failed to upload file: ' + error.message)
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setUploadFormData(prev => ({ ...prev, file }))
      // Auto-fill title with filename without extension if title is empty
      if (!uploadFormData.title.trim()) {
        const fileNameWithoutExt = file.name.replace(/\.[^/.]+$/, '')
        setUploadFormData(prev => ({ ...prev, title: fileNameWithoutExt }))
      }
    }
  }

  const handleDeleteFile = async (file) => {
    if (!confirm(`Are you sure you want to delete "${cleanFileName(file.file_name)}"?`)) return

    try {
      const response = await fetch(`/api/delete_module_file.php?id=${file.id}`, {
        method: 'DELETE',
        credentials: 'include'
      })
      const result = await response.json()
      if (result.success) {
        alert(result.message || 'File deleted successfully')
        if (selectedWeek) {
          loadFiles(selectedWeek.id)
        }
        if (activeView === 'my-uploads') {
          loadMyUploads()
        }
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

  const handleTogglePin = async (file) => {
    if (!isAdmin) return

    try {
      const response = await fetch('/api/toggle_pin_file.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          file_id: file.id,
          is_pinned: !file.is_pinned
        })
      })

      const result = await response.json()
      
      if (result.success) {
        // Reload files to update the list
        if (selectedWeek) {
          loadFiles(selectedWeek.id)
        }
        if (activeView === 'my-uploads') {
          loadMyUploads()
        }
      } else {
        alert(result.message || 'Failed to update pin status')
      }
    } catch (error) {
      console.error('Error toggling pin:', error)
      alert('Failed to update pin status')
    }
  }

  const handleEditFile = (file) => {
    // Parse description to extract title and description if they were combined
    const description = file.description || ''
    const titleMatch = description.match(/^(.+?)(?:\s*-\s*(.+))?$/)
    let title = titleMatch ? titleMatch[1] : file.file_name
    // Clean title by removing leading numbers/zeros
    title = cleanFileName(title)
    const desc = titleMatch && titleMatch[2] ? titleMatch[2] : (description === title ? '' : description)
    
    setEditingFile(file)
    setEditFormData({
      title: title,
      description: desc,
      visibility: file.visibility || 'Public'
    })
  }

  const handleUpdateFile = async (e) => {
    e.preventDefault()
    if (!editingFile) return

    try {
      // Combine title and description
      const title = editFormData.title.trim()
      const description = editFormData.description.trim()
      const combinedDescription = title 
        ? (description ? `${title} - ${description}` : title)
        : description

      console.log('Updating file:', {
        file_id: editingFile.id,
        description: combinedDescription,
        visibility: editFormData.visibility
      })

      const response = await fetch('/api/update_module_file.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          file_id: editingFile.id,
          description: combinedDescription,
          visibility: editFormData.visibility
        })
      })

      console.log('Update response status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Update response error:', errorText)
        alert('Failed to update file: ' + response.status + ' ' + response.statusText)
        return
      }

      const result = await response.json()
      console.log('Update result:', result)
      
      if (result.success) {
        alert(result.message || 'File updated successfully')
        setEditingFile(null)
        setEditFormData({ title: '', description: '', visibility: 'Public' })
        
        // Reload appropriate view
        if (selectedWeek) {
          loadFiles(selectedWeek.id)
        }
        if (activeView === 'my-uploads') {
          loadMyUploads()
        }
      } else {
        alert(result.message || 'Failed to update file')
      }
    } catch (error) {
      console.error('Error updating file:', error)
      alert('Failed to update file: ' + (error.message || 'Unknown error'))
    }
  }

  const handleCancelEdit = () => {
    setEditingFile(null)
    setEditFormData({ title: '', description: '', visibility: 'Public' })
  }

  // Clean file name by removing leading numbers/zeros
  const cleanFileName = (fileName) => {
    if (!fileName || typeof fileName !== 'string') return fileName
    // Remove leading zeros or numbers (with or without space) at the start
    // Examples: "0Roblox" -> "Roblox", "0 Roblox" -> "Roblox", "123 File" -> "File", "00File" -> "File"
    // First trim whitespace
    let cleaned = String(fileName).trim()
    
    // Remove any leading digits (one or more) optionally followed by spaces
    // This handles: "0", "00", "123", "0 ", "123 ", etc.
    cleaned = cleaned.replace(/^\d+\s*/, '')
    
    // Double check: remove any remaining leading zeros (handles edge cases)
    cleaned = cleaned.replace(/^0+/, '')
    
    return cleaned.trim()
  }

  // Filter files based on search query
  const filterFiles = (filesList) => {
    if (!searchQuery.trim()) {
      return filesList
    }

    const query = searchQuery.toLowerCase().trim()

    return filesList.filter(file => {
      // Search in file name
      const fileNameMatch = file.file_name?.toLowerCase().includes(query)
      
      // Search in category path (includes Year, Semester, Subject, Type, Week)
      const pathMatch = file.category_path?.toLowerCase().includes(query) || 
                       file.week_name?.toLowerCase().includes(query)
      
      // Extract and search in specific path components (Year, Semester, Subject, Type, Week)
      let subjectMatch = false
      let semesterMatch = false
      let yearMatch = false
      let typeMatch = false
      
      if (file.category_path) {
        const pathParts = file.category_path.toLowerCase().split('>').map(p => p.trim())
        // Path format: Year > Semester > Subject > Type > Week
        // Index 0: Year, Index 1: Semester, Index 2: Subject, Index 3: Type, Index 4: Week
        yearMatch = pathParts[0]?.includes(query) || false
        semesterMatch = pathParts[1]?.includes(query) || false
        subjectMatch = pathParts[2]?.includes(query) || false
        typeMatch = pathParts[3]?.includes(query) || false
      }
      
      // Search in uploader name
      const uploaderNameMatch = file.uploader_name?.toLowerCase().includes(query)
      
      // Search in uploader matric
      const uploaderMatricMatch = file.uploader_matric?.toLowerCase().includes(query)
      
      // Search in description
      const descriptionMatch = file.description?.toLowerCase().includes(query)

      return fileNameMatch || pathMatch || subjectMatch || semesterMatch || yearMatch || typeMatch || 
             uploaderNameMatch || uploaderMatricMatch || descriptionMatch
    })
  }

  const filteredFiles = filterFiles(files)
  const filteredMyUploads = filterFiles(myUploads)

  // Combine all files for search results (from both views)
  // Only include files that have week_id (can be navigated to)
  const allFilesForSearch = [...files, ...myUploads].filter(file => file.week_id)
  const allFilteredFiles = filterFiles(allFilesForSearch)

  // Find category by ID recursively in tree
  const findCategoryInTree = (tree, categoryId) => {
    for (const item of tree) {
      if (item.id === categoryId) {
        return item
      }
      if (item.children && item.children.length > 0) {
        const found = findCategoryInTree(item.children, categoryId)
        if (found) return found
      }
    }
    return null
  }

  // Find path to category (get all parent IDs from root to target)
  const findPathToCategory = (tree, targetId, path = []) => {
    for (const item of tree) {
      const newPath = [...path, item.id]
      
      // If this is the target, return the path (excluding the target itself, only parents)
      if (item.id === targetId) {
        return path // Return only parents, not the target
      }
      
      // Recursively search in children
      if (item.children && item.children.length > 0) {
        const found = findPathToCategory(item.children, targetId, newPath)
        if (found !== null) {
          return found
        }
      }
    }
    return null
  }

  // Function to expand all parent categories in path
  const expandPathToCategory = (categoryId) => {
    const pathToCategory = findPathToCategory(categoryTree, categoryId)
    
    if (pathToCategory && pathToCategory.length > 0) {
      const newExpanded = { ...expandedCategories }
      
      // Expand all parent categories in the path
      pathToCategory.forEach(parentId => {
        newExpanded[parentId] = true
      })
      
      // Also expand the target category itself if it has children
      const targetCategory = findCategoryInTree(categoryTree, categoryId)
      if (targetCategory && targetCategory.children && targetCategory.children.length > 0) {
        newExpanded[categoryId] = true
      }
      
      setExpandedCategories(newExpanded)
      return true
    }
    return false
  }

  // Fetch category by ID from API (fallback if not in tree)
  const fetchCategoryById = async (categoryId) => {
    try {
      const response = await fetch(`/api/get_category_by_id.php?id=${categoryId}`, {
        credentials: 'include'
      })
      const result = await response.json()
      
      if (result.success && result.category) {
        return result.category
      }
      return null
    } catch (error) {
      console.error('Error fetching category:', error)
      return null
    }
  }

  // Handle click on search result file
  const handleSearchResultClick = async (file) => {
    console.log('Search result clicked:', file)
    
    if (!file.week_id) {
      alert('Unable to locate file: Missing week information')
      return
    }

    // Try to find week category in tree first
    let weekCategory = findCategoryInTree(categoryTree, file.week_id)
    
    // If not found in tree, try to fetch from API
    if (!weekCategory) {
      console.log('Week category not in tree, fetching from API...')
      
      // Reload categories first (maybe it was deleted/added)
      await loadCategories()
      
      // Try again in tree
      weekCategory = findCategoryInTree(categoryTree, file.week_id)
      
      // If still not found, fetch from API directly
      if (!weekCategory) {
        console.log('Still not in tree, fetching category directly...')
        const fetchedCategory = await fetchCategoryById(file.week_id)
        
        if (fetchedCategory) {
          weekCategory = fetchedCategory
          console.log('Found category from API:', weekCategory)
        } else {
          console.error('Week category not found for week_id:', file.week_id)
          alert(`Unable to locate file: Week category (ID: ${file.week_id}) not found. The category may have been deleted.`)
          return
        }
      }
    }

    console.log('Found week category:', weekCategory)

    // Only expand path if category is in tree
    if (categoryTree.length > 0) {
      const pathToWeek = findPathToCategory(categoryTree, file.week_id)
      if (pathToWeek) {
        expandPathToCategory(file.week_id)
      } else {
        // If path not found, reload categories and try again
        console.log('Path not found, reloading categories...')
        await loadCategories()
        const retryPath = findPathToCategory(categoryTree, file.week_id)
        if (retryPath) {
          expandPathToCategory(file.week_id)
        }
      }
    }

    // Clear search query (after getting file info)
    setSearchQuery('')

    // Switch to browse view first
    setActiveView('browse')

    // Wait for view to switch and categories to expand
    setTimeout(async () => {
      // Select the week (even if it's from API, we can still use it)
      setSelectedWeek(weekCategory)
      
      // Load files for this week
      await loadFiles(file.week_id)

      // Wait a bit more for files to render, then highlight
      setTimeout(() => {
        const fileElement = document.getElementById(`file-${file.id}`)
        
        if (fileElement) {
          // Highlight the file
          setHighlightedFileId(file.id)
          
          // Scroll to the file
          fileElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
          
          // Add a slight delay before removing highlight to ensure smooth animation
          setTimeout(() => {
            // Remove highlight after 5 seconds (longer for better visibility)
            setTimeout(() => {
              setHighlightedFileId(null)
            }, 5000)
          }, 1000)
        } else {
          console.warn('File element not found for ID:', file.id)
          // Try again after a longer delay
          setTimeout(() => {
            const retryElement = document.getElementById(`file-${file.id}`)
            if (retryElement) {
              setHighlightedFileId(file.id)
              retryElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
              setTimeout(() => {
                setHighlightedFileId(null)
              }, 5000)
            } else {
              console.error('File still not found after retry. File ID:', file.id)
            }
          }, 1500)
        }
      }, 800) // Increased delay to ensure files are loaded
    }, 500) // Increased delay for category expansion
  }

  const renderCategoryTree = (items, level = 1, parentPath = '') => {
    if (!items || items.length === 0) return null

    const levelNames = {
      1: 'Category',
      2: 'Subcategory',
      3: 'Subject',
      4: 'Type',
      5: 'Week'
    }

    return (
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {items.map((item) => {
          const hasChildren = item.children && item.children.length > 0
          const isExpanded = expandedCategories[item.id]
          const currentPath = parentPath ? `${parentPath} > ${item.name}` : item.name
          // Check if it's a Week - by level (5) or by level name
          const levelName = levelNames[item.level] || `Level ${item.level}`
          const isWeek = item.level === 5 || levelName.toLowerCase() === 'week' || item.name.toUpperCase().includes('WEEK')

          return (
            <li key={item.id} className="category-item" style={{ marginBottom: '0.5rem' }}>
              <div
                className={`category-tab ${isWeek ? 'category-tab-week' : ''} ${isWeek && selectedWeek?.id === item.id ? 'category-tab-selected' : ''}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0.75rem',
                  background: isWeek && selectedWeek?.id === item.id ? '#eff6ff' : '#f9fafb',
                  borderRadius: '6px',
                  border: isWeek && selectedWeek?.id === item.id ? '2px solid var(--primary-color)' : '1px solid #e5e7eb',
                  gap: '0.5rem',
                  cursor: hasChildren ? 'pointer' : (isWeek ? 'pointer' : 'default')
                }}
                onClick={(e) => {
                  // Prevent any default behavior
                  e.preventDefault()
                  e.stopPropagation()
                  
                  // If clicked on expand button, don't trigger body click
                  if (e.target.closest('.category-expand-btn') || e.target.closest('.category-expand-icon')) {
                    return
                  }
                  
                  // If is week, handle week click first (which auto-shows upload form)
                  if (isWeek) {
                    console.log('Week clicked:', item)
                    handleWeekClick(item)
                    return
                  }
                  
                  // If has children, toggle expand
                  if (hasChildren) {
                    toggleExpand(item.id)
                  }
                }}
              >
                {hasChildren && (
                  <span className={`category-expand-icon ${isExpanded ? 'expanded' : ''}`} style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '24px',
                    height: '24px',
                    fontSize: '0.875rem',
                    color: 'var(--text-light)',
                    flexShrink: 0,
                    transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}>
                    <i className={`fas fa-chevron-${isExpanded ? 'down' : 'right'}`}></i>
                  </span>
                )}
                {!hasChildren && <span style={{ width: '24px', flexShrink: 0 }}></span>}
                
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span className="category-level-badge" style={{
                      background: isWeek ? '#10b981' : '#3b82f6',
                      color: 'white',
                      padding: '0.125rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: '600'
                    }}>
                      {levelNames[item.level] || `Level ${item.level}`}
                    </span>
                    <strong className="category-name" style={{ color: 'var(--text-color)', fontSize: '0.95rem' }}>{item.name}</strong>
                    {item.description && (
                      <span className="category-description" style={{ color: 'var(--text-light)', fontSize: '0.875rem' }}>- {item.description}</span>
                    )}
                  </div>
                </div>

                {isWeek && (
                  <span className="category-week-hint" style={{ color: 'var(--primary-color)', fontSize: '0.875rem', whiteSpace: 'nowrap', flexShrink: 0 }}>
                    <i className="fas fa-arrow-right"></i> Click to view
                  </span>
                )}
              </div>

              {hasChildren && (
                <div className={`category-children ${isExpanded ? 'category-children-expanded' : 'category-children-collapsed'}`} style={{ marginLeft: '1.5rem', marginTop: '0.5rem' }}>
                  {isExpanded && renderCategoryTree(item.children, level + 1, currentPath)}
                </div>
              )}
            </li>
          )
        })}
      </ul>
    )
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
    <div className="page-content modules-page">
      <div className="container">
        <div className="modules-header">
          <h1 className="page-title modules-title">
            <i className="fas fa-book-reader" style={{ marginRight: '0.75rem', color: 'var(--primary-color)' }}></i>
            BITA Modules
          </h1>
          <p className="modules-subtitle">
            Browse and upload module files organized by categories
          </p>
        </div>

        <div className="modules-main-grid">
          {/* Categories Tree */}
          <div className="category-tree-container">
            <div className="category-tree-header">
              <h3 className="category-tree-title">
                <i className="fas fa-folder-tree"></i>
                <span>Categories</span>
              </h3>
            </div>
            <div className="category-tree-wrapper">
              {categoryTree.length === 0 ? (
                <p className="category-empty-message">
                  No categories available yet. Contact admin to create categories.
                </p>
              ) : (
                <ul className="category-tree">
                  {renderCategoryTree(categoryTree)}
                </ul>
              )}
            </div>
          </div>

          {/* Files Panel */}
          <div className="modules-files-panel">
            {/* View Tabs */}
            <div className="modules-view-tabs">
              <button
                onClick={() => {
                  setActiveView('browse')
                  setSelectedWeek(null)
                  setShowUploadForm(false)
                }}
                className={`modules-view-tab ${activeView === 'browse' ? 'active' : ''}`}
              >
                <i className="fas fa-folder-open"></i>
                <span>Browse Files</span>
              </button>
              <button
                onClick={() => {
                  setActiveView('my-uploads')
                  setSelectedWeek(null)
                  setShowUploadForm(false)
                }}
                className={`modules-view-tab ${activeView === 'my-uploads' ? 'active' : ''}`}
              >
                <i className="fas fa-cloud-upload-alt"></i>
                <span>My Uploads</span>
              </button>
            </div>

            {/* Search Bar */}
            <div className="modules-search-container">
              <div className="modules-search-wrapper">
                <i className="fas fa-search modules-search-icon"></i>
                <input
                  type="text"
                  placeholder="Search by file name, subject, path, uploader, or matric..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="modules-search-input"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="modules-search-clear"
                    title="Clear search"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                )}
              </div>
              {searchQuery && allFilteredFiles.length > 0 && (
                <div className="modules-search-results-dropdown">
                  <div className="modules-search-results-header">
                    <i className="fas fa-list"></i>
                    <span>Found {allFilteredFiles.length} file{allFilteredFiles.length !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="modules-search-results-list">
                    {allFilteredFiles.slice(0, 10).map((file) => (
                      <div
                        key={file.id}
                        className="modules-search-result-item"
                        onClick={() => handleSearchResultClick(file)}
                      >
                        <div className="modules-search-result-icon">
                          <i className="fas fa-file"></i>
                        </div>
                        <div className="modules-search-result-content">
                          <div className="modules-search-result-name">{cleanFileName(file.file_name)}</div>
                          <div className="modules-search-result-path">
                            <i className="fas fa-folder-tree"></i>
                            <span>{file.category_path || file.week_name || 'Unknown Location'}</span>
                          </div>
                          {file.uploader_name && (
                            <div className="modules-search-result-uploader">
                              <i className="fas fa-user"></i>
                              <span>{file.uploader_name} ({file.uploader_matric})</span>
                            </div>
                          )}
                        </div>
                        <div className="modules-search-result-arrow">
                          <i className="fas fa-chevron-right"></i>
                        </div>
                      </div>
                    ))}
                    {allFilteredFiles.length > 10 && (
                      <div className="modules-search-results-footer">
                        And {allFilteredFiles.length - 10} more file{allFilteredFiles.length - 10 !== 1 ? 's' : ''}...
                      </div>
                    )}
                  </div>
                </div>
              )}
              {searchQuery && allFilteredFiles.length === 0 && (
                <div className="modules-search-results-info modules-search-no-results">
                  <i className="fas fa-search"></i>
                  <span>No files found matching "{searchQuery}"</span>
                </div>
              )}
            </div>

            {/* Browse View */}
            {activeView === 'browse' && selectedWeek ? (
              <div className="modules-files-content">
                <div className="module-files-header">
                  <div className="module-files-header-content">
                    <h3 className="module-files-title">
                      <i className="fas fa-file-alt"></i>
                      <span>Files in <span className="week-name">"{selectedWeek.name}"</span></span>
                    </h3>
                    <button
                      onClick={() => setShowUploadForm(!showUploadForm)}
                      className="btn btn-primary module-upload-toggle-btn"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.875rem 2rem',
                        fontSize: '1rem',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        boxShadow: '0 4px 14px rgba(59, 130, 246, 0.35)'
                      }}
                    >
                      {!showUploadForm && <i className="fas fa-upload"></i>}
                      <span>{showUploadForm ? 'Cancel Upload' : 'Upload File'}</span>
                    </button>
                  </div>
                </div>

                {/* Upload Form - Direct on Page */}
                {showUploadForm && (
                  <div className="module-upload-form-container">
                    <div className="module-upload-form-header">
                      <h4 className="module-upload-form-title">
                        <i className="fas fa-cloud-upload-alt"></i>
                        <span>Upload File to <span className="week-name">"{selectedWeek.name}"</span></span>
                      </h4>
                    </div>
                    <form onSubmit={handleUploadFile} className="module-upload-form">
                      <div className="module-upload-form-group">
                        <label className="module-upload-label">
                          <span>Select File</span>
                          <span className="required-asterisk">*</span>
                        </label>
                        <div className="module-upload-file-wrapper">
                          <input
                            type="file"
                            name="file"
                            id="module-file-input"
                            required
                            onChange={handleFileChange}
                            className="module-upload-file-input"
                            accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.zip,.rar,.jpg,.jpeg,.png,.gif"
                          />
                          <label htmlFor="module-file-input" className="module-upload-file-label">
                            <i className="fas fa-cloud-upload-alt"></i>
                            <span>Choose file or drag & drop here</span>
                          </label>
                        </div>
                        <small className="module-upload-help">
                          Max size: 50MB. Allowed: PDF, DOC, PPT, XLS, TXT, ZIP, Images
                        </small>
                        {uploadFormData.file && (
                          <div className="module-upload-file-selected">
                            <i className="fas fa-check-circle"></i>
                            <span>Selected: <strong>{uploadFormData.file.name}</strong> ({(uploadFormData.file.size / 1024 / 1024).toFixed(2)} MB)</span>
                          </div>
                        )}
                      </div>

                      <div className="module-upload-form-group">
                        <label className="module-upload-label">
                          <span>Title</span>
                          <span className="required-asterisk">*</span>
                        </label>
                        <input
                          type="text"
                          value={uploadFormData.title}
                          onChange={(e) => setUploadFormData(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="Enter file title (e.g., Lab Exercise 1, Lecture Notes Week 1)"
                          required
                          className="module-upload-input"
                        />
                        <small className="module-upload-help">
                          A descriptive title for your file
                        </small>
                      </div>

                      <div className="module-upload-form-group">
                        <label className="module-upload-label">
                          <span>Description</span>
                          <span className="optional-badge">(Optional)</span>
                        </label>
                        <textarea
                          value={uploadFormData.description}
                          onChange={(e) => setUploadFormData(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Add more details about this file (e.g., topics covered, exercise solutions, etc.)"
                          rows="3"
                          className="module-upload-input module-upload-textarea"
                        />
                      </div>

                      <div className="module-upload-form-group">
                        <label className="module-upload-label">
                          <span>Visibility</span>
                          <span className="required-asterisk">*</span>
                        </label>
                        <select
                          value={uploadFormData.visibility}
                          onChange={(e) => setUploadFormData(prev => ({ ...prev, visibility: e.target.value }))}
                          className="module-upload-input"
                          required
                        >
                          <option value="Public">Public - Visible to everyone</option>
                          <option value="Private">Private - Only visible to me</option>
                          <option value="Admin Only">Admin Only - Visible to me and admins</option>
                        </select>
                        <small className="module-upload-help">
                          Control who can see this file. You can change this later.
                        </small>
                      </div>

                      <div className="module-upload-form-actions">
                        <button
                          type="button"
                          onClick={() => {
                            setShowUploadForm(false)
                            setUploadFormData({ title: '', description: '', file: null, visibility: 'Public' })
                          }}
                          className="btn btn-secondary module-upload-cancel-btn"
                        >
                          <span>Cancel</span>
                        </button>
                        <button
                          type="submit"
                          className="btn btn-primary module-upload-submit-btn"
                          disabled={!uploadFormData.file || !uploadFormData.title.trim()}
                        >
                          <i className="fas fa-upload"></i>
                          <span>Upload File</span>
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                <div className="module-files-container">
                  {loadingFiles ? (
                    <div className="module-loading-state">
                      <i className="fas fa-spinner fa-spin"></i>
                      <p>Loading files...</p>
                    </div>
                  ) : files.length === 0 ? (
                    <div className="module-empty-state">
                      <div className="module-empty-icon">
                        <i className="fas fa-cloud-upload-alt"></i>
                      </div>
                      <h4 className="module-empty-title">No files uploaded yet</h4>
                      <p className="module-empty-description">
                        Be the first to share your files with others!
                      </p>
                      <button
                        onClick={() => setShowUploadForm(true)}
                        className="btn btn-primary module-empty-upload-btn"
                      >
                        <i className="fas fa-upload"></i>
                        <span>Upload Your First File</span>
                      </button>
                    </div>
                  ) : filteredFiles.length === 0 ? (
                    <div className="module-empty-state">
                      <div className="module-empty-icon">
                        <i className="fas fa-search"></i>
                      </div>
                      <h4 className="module-empty-title">No files found</h4>
                      <p className="module-empty-description">
                        No files match your search "{searchQuery}"
                      </p>
                      <button
                        onClick={() => setSearchQuery('')}
                        className="btn btn-secondary module-empty-upload-btn"
                      >
                        <i className="fas fa-times"></i>
                        <span>Clear Search</span>
                      </button>
                    </div>
                  ) : (
                    <div className="module-files-list">
                      {filteredFiles.map((file, index) => (
                        <div 
                          id={`file-${file.id}`}
                          key={file.id} 
                          className={`module-file-item ${highlightedFileId === file.id ? 'module-file-highlighted' : ''}`} 
                          style={{ animationDelay: `${index * 0.1}s` }}
                        >
                          <div className="module-file-icon">
                            <i className="fas fa-file"></i>
                          </div>
                          <div className="module-file-content">
                            <h5 className="module-file-name" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              {file.is_pinned === 1 && (
                                <i className="fas fa-thumbtack" style={{ color: '#f59e0b', fontSize: '0.875rem' }} title="Pinned by admin"></i>
                              )}
                              {cleanFileName(file.file_name)}
                            </h5>
                            <div className="module-file-meta">
                              <span className="module-file-size">{file.file_size_formatted}</span>
                              <span className="module-file-separator">•</span>
                              <span 
                                className="module-file-uploader"
                                onClick={() => file.uploaded_by && navigate(`/profile/${file.uploaded_by}`)}
                                style={{ cursor: file.uploaded_by ? 'pointer' : 'default' }}
                                title={file.uploaded_by ? 'View uploader profile' : ''}
                              >
                                <i className="fas fa-user"></i>
                                <span className="uploader-name-link">{file.uploader_name}</span>
                                <span className="uploader-matric">({file.uploader_matric})</span>
                              </span>
                              <span className="module-file-separator">•</span>
                              <span className="module-file-date">
                                <i className="fas fa-calendar"></i>
                                {new Date(file.created_at).toLocaleDateString()}
                              </span>
                              <span className="module-file-separator">•</span>
                              <span 
                                className={`module-file-visibility module-file-visibility-${(file.visibility || 'Public').toLowerCase().replace(' ', '-')}`}
                                title={`Visibility: ${file.visibility || 'Public'}`}
                              >
                                <i className={`fas fa-${file.visibility === 'Public' ? 'globe' : file.visibility === 'Private' ? 'lock' : 'shield-alt'}`}></i>
                                <span>{file.visibility || 'Public'}</span>
                              </span>
                            </div>
                            {file.description && (
                              <p className="module-file-description">{file.description}</p>
                            )}
                          </div>
                          <div className="module-file-actions">
                            {isAdmin && (
                              <button
                                onClick={() => handleTogglePin(file)}
                                className="module-file-pin-btn"
                                title={file.is_pinned ? 'Unpin file' : 'Pin file'}
                                style={{
                                  background: file.is_pinned 
                                    ? 'linear-gradient(135deg, #f59e0b, #fbbf24)' 
                                    : 'linear-gradient(135deg, #6b7280, #9ca3af)',
                                  color: 'white'
                                }}
                              >
                                <i className={`fas fa-thumbtack ${file.is_pinned ? '' : 'fa-rotate-90'}`}></i>
                              </button>
                            )}
                            <button
                              onClick={() => handleDownloadFile(file)}
                              className="module-file-download-btn"
                              title="Download"
                            >
                              <i className="fas fa-download"></i>
                            </button>
                            {file.uploaded_by === user?.id && (
                              <>
                                <button
                                  onClick={() => handleEditFile(file)}
                                  className="module-file-edit-btn"
                                  title="Edit"
                                >
                                  <i className="fas fa-edit"></i>
                                </button>
                                <button
                                  onClick={() => handleDeleteFile(file)}
                                  className="module-file-delete-btn"
                                  title="Delete"
                                >
                                  <i className="fas fa-trash"></i>
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : activeView === 'browse' ? (
              <div className="module-empty-select">
                <div className="module-empty-select-icon">
                  <i className="fas fa-folder-open"></i>
                </div>
                <h4 className="module-empty-select-title">Select a Week</h4>
                <p className="module-empty-select-description">
                  Choose a week folder from the categories to view and upload files
                </p>
              </div>
            ) : null}

            {/* My Uploads View */}
            {activeView === 'my-uploads' && (
              <div className="modules-files-content">
                <div className="module-files-header">
                  <div className="module-files-header-content">
                    <h3 className="module-files-title">
                      <i className="fas fa-cloud-upload-alt"></i>
                      <span>My Uploads</span>
                    </h3>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>
                      {myUploads.length} file{myUploads.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>

                <div className="module-files-container">
                  {loadingMyUploads ? (
                    <div className="module-loading-state">
                      <i className="fas fa-spinner fa-spin"></i>
                      <p>Loading your files...</p>
                    </div>
                  ) : myUploads.length === 0 ? (
                    <div className="module-empty-state">
                      <div className="module-empty-icon">
                        <i className="fas fa-cloud-upload-alt"></i>
                      </div>
                      <h4 className="module-empty-title">No files uploaded yet</h4>
                      <p className="module-empty-description">
                        Start uploading your files to manage them here!
                      </p>
                    </div>
                  ) : filteredMyUploads.length === 0 ? (
                    <div className="module-empty-state">
                      <div className="module-empty-icon">
                        <i className="fas fa-search"></i>
                      </div>
                      <h4 className="module-empty-title">No files found</h4>
                      <p className="module-empty-description">
                        No files match your search "{searchQuery}"
                      </p>
                      <button
                        onClick={() => setSearchQuery('')}
                        className="btn btn-secondary module-empty-upload-btn"
                      >
                        <i className="fas fa-times"></i>
                        <span>Clear Search</span>
                      </button>
                    </div>
                  ) : (
                    <div className="module-files-list">
                      {filteredMyUploads.map((file, index) => (
                        <div key={file.id} className="module-file-item" style={{ animationDelay: `${index * 0.1}s` }}>
                          <div className="module-file-icon">
                            <i className="fas fa-file"></i>
                          </div>
                          <div className="module-file-content">
                            <h5 className="module-file-name" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                              {file.is_pinned === 1 && (
                                <i className="fas fa-thumbtack" style={{ color: '#f59e0b', fontSize: '0.875rem' }} title="Pinned by admin"></i>
                              )}
                              <span style={{ fontWeight: '600' }}>{cleanFileName(file.file_name)}</span>
                            </h5>
                            <div 
                              className="module-file-path"
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
                                color: 'var(--text-color)'
                              }}
                            >
                              <i className="fas fa-folder-tree" style={{ color: 'var(--primary-color)', fontSize: '0.875rem' }}></i>
                              <span style={{ fontWeight: '500', color: 'var(--text-color)' }}>
                                {file.category_path || file.week_name || 'Unknown Location'}
                              </span>
                            </div>
                            <div className="module-file-meta">
                              <span className="module-file-size">{file.file_size_formatted}</span>
                              <span className="module-file-separator">•</span>
                              <span className="module-file-date">
                                <i className="fas fa-calendar"></i>
                                {new Date(file.created_at).toLocaleDateString()}
                              </span>
                              <span className="module-file-separator">•</span>
                              <span 
                                className={`module-file-visibility module-file-visibility-${(file.visibility || 'Public').toLowerCase().replace(' ', '-')}`}
                                title={`Visibility: ${file.visibility || 'Public'}`}
                              >
                                <i className={`fas fa-${file.visibility === 'Public' ? 'globe' : file.visibility === 'Private' ? 'lock' : 'shield-alt'}`}></i>
                                <span>{file.visibility || 'Public'}</span>
                              </span>
                            </div>
                            {file.description && (
                              <p className="module-file-description">{file.description}</p>
                            )}
                          </div>
                          <div className="module-file-actions">
                            {isAdmin && (
                              <button
                                onClick={() => handleTogglePin(file)}
                                className="module-file-pin-btn"
                                title={file.is_pinned ? 'Unpin file' : 'Pin file'}
                                style={{
                                  background: file.is_pinned 
                                    ? 'linear-gradient(135deg, #f59e0b, #fbbf24)' 
                                    : 'linear-gradient(135deg, #6b7280, #9ca3af)',
                                  color: 'white'
                                }}
                              >
                                <i className={`fas fa-thumbtack ${file.is_pinned ? '' : 'fa-rotate-90'}`}></i>
                              </button>
                            )}
                            <button
                              onClick={() => handleDownloadFile(file)}
                              className="module-file-download-btn"
                              title="Download"
                            >
                              <i className="fas fa-download"></i>
                            </button>
                            <button
                              onClick={() => handleEditFile(file)}
                              className="module-file-edit-btn"
                              title="Edit"
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button
                              onClick={() => handleDeleteFile(file)}
                              className="module-file-delete-btn"
                              title="Delete"
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
            )}
          </div>
        </div>

        {/* Edit File Modal */}
        {editingFile && (
          <div className="admin-modal-overlay" onClick={handleCancelEdit}>
            <div className="admin-modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
              <div className="admin-modal-header">
                <h3>Edit File: {cleanFileName(editingFile.file_name)}</h3>
                <button onClick={handleCancelEdit} className="admin-modal-close">
                  <i className="fas fa-times"></i>
                </button>
              </div>

              <form onSubmit={handleUpdateFile} className="module-upload-form">
                <div className="module-upload-form-group">
                  <label className="module-upload-label">
                    <span>Title</span>
                    <span className="required-asterisk">*</span>
                  </label>
                  <input
                    type="text"
                    value={editFormData.title}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter file title"
                    required
                    className="module-upload-input"
                  />
                </div>

                <div className="module-upload-form-group">
                  <label className="module-upload-label">
                    <span>Description</span>
                    <span className="optional-badge">(Optional)</span>
                  </label>
                  <textarea
                    value={editFormData.description}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Add more details about this file"
                    rows="3"
                    className="module-upload-input module-upload-textarea"
                  />
                </div>

                <div className="module-upload-form-group">
                  <label className="module-upload-label">
                    <span>Visibility</span>
                    <span className="required-asterisk">*</span>
                  </label>
                  <select
                    value={editFormData.visibility}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, visibility: e.target.value }))}
                    className="module-upload-input"
                    required
                  >
                    <option value="Public">Public - Visible to everyone</option>
                    <option value="Private">Private - Only visible to me</option>
                    <option value="Admin Only">Admin Only - Visible to me and admins</option>
                  </select>
                  <small className="module-upload-help">
                    Change who can see this file.
                  </small>
                </div>

                <div className="module-upload-form-actions">
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="btn btn-secondary module-upload-cancel-btn"
                  >
                    <span>Cancel</span>
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary module-upload-submit-btn"
                  >
                    <i className="fas fa-save"></i>
                    <span>Save Changes</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* File Upload Modal */}
        {showUploadModal && selectedWeek && (
          <div className="admin-modal-overlay" onClick={() => setShowUploadModal(false)}>
            <div className="admin-modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
              <div className="admin-modal-header">
                <h3>Upload File to "{selectedWeek.name}"</h3>
                <button onClick={() => setShowUploadModal(false)} className="admin-modal-close">
                  <i className="fas fa-times"></i>
                </button>
              </div>

              <form onSubmit={handleUploadFile}>
                <div className="admin-form-group">
                  <label className="admin-form-label">Select File *</label>
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

                <div className="admin-modal-footer">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="admin-btn-cancel"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="admin-btn admin-btn-primary"
                  >
                    <i className="fas fa-upload"></i> Upload
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

export default Modules

