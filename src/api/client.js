/**
 * API Client
 * Makes HTTP requests to the backend server
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

/**
 * Get stored auth token
 * @returns {string|null}
 */
const getToken = () => {
  return localStorage.getItem('mimo_auth_token')
}

/**
 * Store auth token
 * @param {string} token
 */
export const setToken = (token) => {
  localStorage.setItem('mimo_auth_token', token)
}

/**
 * Clear auth token
 */
export const clearToken = () => {
  localStorage.removeItem('mimo_auth_token')
}

/**
 * Make an API request
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Fetch options
 * @returns {Promise<Object>}
 */
const request = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`
  const token = getToken()
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  }
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  
  // Create abort controller for timeout
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout
  
  try {
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include', // Include cookies for session
      signal: controller.signal
    })
    
    clearTimeout(timeoutId)
    
    // Handle non-JSON responses
    const contentType = response.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`)
      }
      return { success: true }
    }
    
    const data = await response.json()
    
    if (!response.ok) {
      // Create error with full message from server
      const error = new Error(data.message || data.error || `HTTP error ${response.status}`)
      error.status = response.status
      error.data = data
      throw error
    }
    
    return data
  } catch (error) {
    clearTimeout(timeoutId)
    
    // Handle network errors (connection refused, timeout, etc.)
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      // Connection refused or network error
      throw new Error('SERVER_CONNECTION_ERROR')
    }
    if (error.name === 'AbortError') {
      throw new Error('REQUEST_TIMEOUT')
    }
    throw error
  }
}

/**
 * API methods
 */
const api = {
  // Auth endpoints
  auth: {
    /**
     * Get Google OAuth URL
     * @param {string} userId - User UUID (from phone number step)
     * @param {string} planType - User plan type
     * @returns {Promise<{authUrl: string}>}
     */
    getGoogleAuthUrl: async (userId, planType = 'standard') => {
      return request(`/auth/google?userId=${userId}&planType=${planType}`)
    },
    
    /**
     * Get current authenticated user
     * @returns {Promise<{user: Object}>}
     */
    getCurrentUser: async () => {
      return request('/auth/me')
    },
    
    /**
     * Verify token validity
     * @returns {Promise<{valid: boolean}>}
     */
    verifyToken: async () => {
      try {
        return await request('/auth/verify')
      } catch (error) {
        // If server is not available, return invalid token
        if (error.message === 'SERVER_CONNECTION_ERROR') {
          return { valid: false }
        }
        throw error
      }
    },
    
    /**
     * Refresh Google access token
     * @returns {Promise<{tokens: Object}>}
     */
    refreshToken: async () => {
      return request('/auth/refresh', { method: 'POST' })
    },
    
    /**
     * Sign out
     * @returns {Promise<{success: boolean}>}
     */
    logout: async () => {
      const result = await request('/auth/logout', { method: 'POST' })
      clearToken()
      return result
    }
  },
  
  // User endpoints
  users: {
    /**
     * Check phone number and Google connection status
     * @param {string} phoneNumber - User's phone number
     * @returns {Promise<{user: Object, hasGoogleConnection: boolean, jwtToken: string, shouldConnectGoogle: boolean}>}
     */
    checkPhone: async (phoneNumber) => {
      return request('/users/check-phone', {
        method: 'POST',
        body: JSON.stringify({ phoneNumber })
      })
    },
    
    /**
     * Get current user profile
     * @returns {Promise<{user: Object}>}
     */
    getProfile: async () => {
      return request('/users/me')
    },
    
    /**
     * Update phone number
     * @param {string} phoneNumber
     * @returns {Promise<{user: Object}>}
     */
    updatePhone: async (phoneNumber) => {
      return request('/users/me/phone', {
        method: 'PUT',
        body: JSON.stringify({ phoneNumber })
      })
    },
    
    /**
     * Complete onboarding
     * @returns {Promise<{user: Object, whatsapp: Object}>}
     */
    completeOnboarding: async () => {
      return request('/users/me/complete-onboarding', { method: 'POST' })
    },
    
    /**
     * Get WhatsApp info
     * @param {string} message - Optional custom message
     * @returns {Promise<{number: string, message: string, url: string}>}
     */
    getWhatsAppInfo: async (message) => {
      const params = message ? `?message=${encodeURIComponent(message)}` : ''
      return request(`/users/whatsapp-info${params}`)
    }
  }
}

export default api

