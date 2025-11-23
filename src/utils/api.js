/**
 * API Configuration
 * 
 * Gets API base URL from environment variable or falls back to production URL
 * In production, this will use VITE_API_URL or default to Render backend URL
 * In development, it uses relative paths which work with Vite proxy
 */

// Production backend URL (Render - PHP backend)
const RENDER_BACKEND_URL = 'https://bita-backend-47qt.onrender.com'

// Local Node.js backend URL
const LOCAL_NODE_BACKEND_URL = 'http://localhost:3001'

// Get API base URL from environment variable
// Priority: VITE_API_URL from .env > Local Node.js > Render PHP backend
// For local development with Node.js: Set VITE_API_URL=http://localhost:3001 in .env
// For production: Use VITE_API_URL or fallback to Render URL
export const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.DEV ? LOCAL_NODE_BACKEND_URL : RENDER_BACKEND_URL)

export const UPLOADS_BASE_URL = import.meta.env.VITE_UPLOADS_URL || import.meta.env.VITE_API_URL || API_BASE_URL

/**
 * Get full API URL
 * @param {string} endpoint - API endpoint (e.g., '/api/login.php' or '/login.php')
 * @returns {string} Full API URL
 */
export function getApiUrl(endpoint) {
  // If endpoint already has /api/, use it as is
  // If not, assume it should be /api/endpoint
  let cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
  
  // If endpoint doesn't start with /api/, add it
  if (!cleanEndpoint.startsWith('/api/') && !cleanEndpoint.startsWith('http')) {
    cleanEndpoint = `/api${cleanEndpoint}`
  }
  
  if (API_BASE_URL) {
    // If API_BASE_URL already ends with /api, don't duplicate
    const baseUrl = API_BASE_URL.endsWith('/api') 
      ? API_BASE_URL.slice(0, -4) 
      : API_BASE_URL
    return `${baseUrl}${cleanEndpoint}`
  }
  
  // Use relative path (works with Vite proxy in dev)
  return cleanEndpoint
}

/**
 * Get uploads URL
 * @param {string} path - Upload path (e.g., 'uploads/matric_cards/file.jpg')
 * @returns {string} Full uploads URL
 */
export function getUploadsUrl(path) {
  if (UPLOADS_BASE_URL) {
    // Remove leading slash from path if UPLOADS_BASE_URL ends with slash
    const cleanPath = path.startsWith('/') ? path : `/${path}`
    return `${UPLOADS_BASE_URL}${cleanPath}`
  }
  // Fallback to relative path
  return `/${path}`
}

/**
 * API Fetch Wrapper
 * Automatically prepends API_BASE_URL to API endpoints
 * @param {string} url - API endpoint (e.g., '/api/login.php')
 * @param {object} options - Fetch options
 * @returns {Promise<Response>} Fetch response
 */
export function apiFetch(url, options = {}) {
  const fullUrl = getApiUrl(url)
  return fetch(fullUrl, options)
}

