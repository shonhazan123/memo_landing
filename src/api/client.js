/**
 * API Client
 * Makes HTTP requests to the backend server
 * - If running on localhost (dev or preview), always use backend at :3001.
 * - Else if VITE_API_URL is set, use it.
 * - Otherwise (deployed) use same-origin /api.
 */
function getApiBaseUrl() {
  if (typeof window !== 'undefined' && window.location?.hostname === 'localhost') return 'http://localhost:3001/api'
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL
  return '/api'
}
const API_BASE_URL = getApiBaseUrl()

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
  const base = getApiBaseUrl()
  const url = `${base}${endpoint}`
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
     * @param {string} phoneNumber - Formatted phone number from phone step
     * @param {string} planType - User plan type
     * @param {string|null} redirectTo - Frontend path after OAuth (e.g. '/settings')
     * @param {string|null} userName - Display name for settings.user_name (optional)
     * @returns {Promise<{authUrl: string}>}
     */
    getGoogleAuthUrl: async (phoneNumber, planType = 'standard', redirectTo = null, userName = null) => {
      let url = `/auth/google?phoneNumber=${encodeURIComponent(phoneNumber)}&planType=${planType}`
      if (redirectTo) url += `&redirectTo=${encodeURIComponent(redirectTo)}`
      if (userName) url += `&userName=${encodeURIComponent(userName)}`
      return request(url)
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
     * Validate phone number and check if user is already registered.
     * Does NOT create a user in the database.
     * @param {string} phoneNumber - User's phone number
     * @param {string|null} userName - Display name for settings.user_name (optional)
     * @returns {Promise<{isNewUser: boolean, registered: boolean, formattedNumber?: string, user?: Object, jwtToken?: string, hasGoogleConnection: boolean}>}
     */
    checkPhone: async (phoneNumber, userName = null) => {
      const body = { phoneNumber }
      if (userName != null && String(userName).trim()) body.userName = String(userName).trim()
      return request('/users/check-phone', {
        method: 'POST',
        body: JSON.stringify(body)
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
    },

    /**
     * Delete user account and all associated data
     * @returns {Promise<{success: boolean, deletedUserId: string}>}
     */
    deleteAccount: async () => {
      return request('/users/me', { method: 'DELETE' })
    }
  },

  // Payment (PayPlus) - create link and redirect to payment page
  payment: {
    /**
     * Create a PayPlus payment page link for a pricing plan.
     * @param {string} planId - 'basic' | 'pro' | 'business'
     * @param {string} billingPeriod - 'monthly' | 'annual'
     * @param {Object} [options] - optional customerEmail, customerName
     * @returns {Promise<{ paymentPageLink: string, pageRequestUid: string, amount: number, planName: string }>}
     */
    createLink: async (planId, billingPeriod, options = {}) => {
      return request('/payment/create-link', {
        method: 'POST',
        body: JSON.stringify({
          planId,
          billingPeriod,
          customerEmail: options.customerEmail,
          customerName: options.customerName,
        }),
      })
    },
  },
}

export default api

