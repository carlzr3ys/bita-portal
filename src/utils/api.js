/**
 * API Configuration
 * 
 * Gets API base URL from environment variable or falls back to relative path
 * In production (Netlify), this will use VITE_API_URL from environment variables
 * In development, it uses relative paths which work with Vite proxy
 */

export const API_BASE_URL = import.meta.env.VITE_API_URL || ''
export const UPLOADS_BASE_URL = import.meta.env.VITE_UPLOADS_URL || import.meta.env.VITE_API_URL || ''

/**
 * Get full API URL
 * @param {string} endpoint - API endpoint (e.g., '/api/login.php')
 * @returns {string} Full API URL
 */
export function getApiUrl(endpoint) {
  if (API_BASE_URL) {
    // Remove leading slash from endpoint if API_BASE_URL ends with slash
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
    return `${API_BASE_URL}${cleanEndpoint}`
  }
  // Use relative path (works with Vite proxy in dev)
  return endpoint
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

