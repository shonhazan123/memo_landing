/**
 * Auth Context
 * Provides authentication state and methods across the application
 * Uses HTTP requests to backend server
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import api, { setToken, clearToken } from '../api/client'

// Signup flow steps (new order: phone first, then Google if needed)
export const SIGNUP_STEPS = {
  PHONE_NUMBER: 'phone_number',
  GOOGLE_AUTH: 'google_auth',
  WHATSAPP_REDIRECT: 'whatsapp_redirect',
  COMPLETED: 'completed'
}

// Local storage key for signup state
const SIGNUP_STATE_KEY = 'mimo_signup_state'

// Create context
const AuthContext = createContext(null)

/**
 * Get initial signup state
 */
const getInitialState = () => ({
  step: SIGNUP_STEPS.PHONE_NUMBER,
  userId: null,
  whatsappNumber: null,
  hasGoogleConnection: false,
  googleEmail: null,
  googleName: null,
  googlePicture: null,
  startedAt: Date.now(),
  updatedAt: Date.now()
})

/**
 * Load signup state from localStorage
 */
const loadSignupState = () => {
  try {
    const saved = localStorage.getItem(SIGNUP_STATE_KEY)
    if (!saved) return null
    
    const state = JSON.parse(saved)
    
    // Check if state is expired (24 hours)
    const expiryTime = 24 * 60 * 60 * 1000
    if (Date.now() - state.startedAt > expiryTime) {
      localStorage.removeItem(SIGNUP_STATE_KEY)
      return null
    }
    
    return state
  } catch {
    return null
  }
}

/**
 * Save signup state to localStorage
 */
const saveSignupState = (state) => {
  try {
    localStorage.setItem(SIGNUP_STATE_KEY, JSON.stringify({
      ...state,
      updatedAt: Date.now()
    }))
  } catch (e) {
    console.error('Error saving signup state:', e)
  }
}

/**
 * Auth Provider Component
 */
export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [error, setError] = useState(null)
  const [signupState, setSignupState] = useState(() => loadSignupState() || getInitialState())

  /**
   * Initialize auth state on mount
   */
  useEffect(() => {
    const initAuth = async () => {
      try {
        setIsLoading(true)
        
        // Check URL for token from OAuth callback
        const urlParams = new URLSearchParams(window.location.search)
        const tokenFromUrl = urlParams.get('token')
        const stepFromUrl = urlParams.get('step')
        const errorFromUrl = urlParams.get('error')
        
        // Handle OAuth error
        if (errorFromUrl) {
          setError(getErrorMessage(errorFromUrl))
          // Clean URL
          window.history.replaceState({}, '', window.location.pathname)
          setIsLoading(false)
          return
        }
        
        // Handle token from OAuth callback
        if (tokenFromUrl) {
          setToken(tokenFromUrl)
          // Clean URL
          window.history.replaceState({}, '', window.location.pathname)
        }
        
        // Verify existing token (gracefully handle server unavailable)
        let valid = false
        try {
          const result = await api.auth.verifyToken()
          valid = result?.valid || false
        } catch (err) {
          // If server is not available, just continue without auth
          console.warn('Backend server not available:', err.message)
          valid = false
        }
        
        if (valid) {
          // Get user profile
          try {
            const { user: userData } = await api.auth.getCurrentUser()
            setUser(userData)
            setIsAuthenticated(true)
          
          // Determine current step based on user state
          let currentStep = SIGNUP_STEPS.PHONE_NUMBER
          
          if (userData.onboardingComplete) {
            currentStep = SIGNUP_STEPS.COMPLETED
          } else if (userData.whatsappNumber && userData.email) {
            // Has phone and Google connected
            currentStep = SIGNUP_STEPS.WHATSAPP_REDIRECT
          } else if (userData.whatsappNumber) {
            // Has phone but no Google
            currentStep = SIGNUP_STEPS.GOOGLE_AUTH
          }
          
          // Override with URL step if provided
          if (stepFromUrl && Object.values(SIGNUP_STEPS).includes(stepFromUrl)) {
            currentStep = stepFromUrl
          }
          
          const newState = {
            ...signupState,
            step: currentStep,
            userId: userData.id,
            whatsappNumber: userData.whatsappNumber,
            hasGoogleConnection: !!userData.email,
            googleEmail: userData.email || null
          }
            
            setSignupState(newState)
            saveSignupState(newState)
          } catch (err) {
            // If getting user fails, just reset auth state
            console.warn('Failed to get user profile:', err.message)
            clearToken()
            setIsAuthenticated(false)
            setUser(null)
          }
        } else {
          // No valid token - reset to initial state
          clearToken()
          setIsAuthenticated(false)
          setUser(null)
        }
      } catch (err) {
        console.error('Auth init error:', err)
        clearToken()
        setIsAuthenticated(false)
      } finally {
        setIsLoading(false)
      }
    }
    
    initAuth()
  }, [])

  /**
   * Get error message from error code
   */
  const getErrorMessage = (errorCode) => {
    const errorMessages = {
      'auth_failed': 'ההתחברות נכשלה. אנא נסה שוב.',
      'invalid_state': 'שגיאת אבטחה. אנא נסה שוב.',
      'access_denied': 'הגישה נדחתה. אנא אשר את ההרשאות.',
      'default': 'משהו השתבש. אנא נסה שוב.'
    }
    return errorMessages[errorCode] || errorMessages.default
  }

  /**
   * Submit phone number - check if user exists and Google connection status
   */
  const submitPhoneNumber = useCallback(async (phoneNumber) => {
    setError(null)
    setIsLoading(true)
    
    try {
      const result = await api.users.checkPhone(phoneNumber)
      
      // Store token
      if (result.jwtToken) {
        setToken(result.jwtToken)
      }
      
      // Update state
      const newState = {
        ...signupState,
        step: result.hasGoogleConnection 
          ? SIGNUP_STEPS.WHATSAPP_REDIRECT 
          : SIGNUP_STEPS.GOOGLE_AUTH,
        userId: result.user.id,
        whatsappNumber: result.user.whatsappNumber,
        hasGoogleConnection: result.hasGoogleConnection,
        googleEmail: result.user.email || null
      }
      
      setUser(result.user)
      setIsAuthenticated(true)
      setSignupState(newState)
      saveSignupState(newState)
      
      return { success: true, shouldConnectGoogle: result.shouldConnectGoogle }
    } catch (err) {
      console.error('Submit phone error:', err)
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setIsLoading(false)
    }
  }, [signupState])

  /**
   * Sign in with Google - redirects to backend OAuth URL
   * Requires userId from phone number step
   */
  const signInWithGoogle = useCallback(async () => {
    if (!signupState.userId) {
      setError('אנא הזן מספר טלפון תחילה')
      return
    }
    
    setError(null)
    setIsLoading(true)
    
    try {
      const { authUrl } = await api.auth.getGoogleAuthUrl(signupState.userId, 'standard')
      
      // Redirect to Google OAuth
      window.location.href = authUrl
    } catch (err) {
      console.error('Sign in error:', err)
      
      // Provide helpful error messages in Hebrew
      let errorMessage = 'שגיאה בהתחברות'
      
      if (err.message) {
        if (err.message.includes('Google OAuth is not configured')) {
          errorMessage = 'הגדרות Google לא הוגדרו. אנא הוסף GOOGLE_CLIENT_ID ו-GOOGLE_CLIENT_SECRET לקובץ .env'
        } else if (err.message.includes('SERVER_CONNECTION_ERROR')) {
          errorMessage = 'לא ניתן להתחבר לשרת. אנא ודא שהשרת רץ על פורט 3001'
        } else {
          errorMessage = err.message
        }
      }
      
      setError(errorMessage)
      setIsLoading(false)
    }
  }, [signupState.userId])

  /**
   * Sign out
   */
  const signOut = useCallback(async () => {
    setIsLoading(true)
    
    try {
      await api.auth.logout()
    } catch (err) {
      console.error('Sign out error:', err)
    } finally {
      setIsAuthenticated(false)
      setUser(null)
      localStorage.removeItem(SIGNUP_STATE_KEY)
      setSignupState(getInitialState())
      setIsLoading(false)
    }
  }, [])


  /**
   * Complete onboarding
   */
  const completeOnboarding = useCallback(async () => {
    setError(null)
    
    try {
      const { user: updatedUser, whatsapp } = await api.users.completeOnboarding()
      
      setUser(updatedUser)
      
      const newState = {
        ...signupState,
        step: SIGNUP_STEPS.COMPLETED
      }
      
      setSignupState(newState)
      saveSignupState(newState)
      
      return { success: true, whatsapp }
    } catch (err) {
      console.error('Complete onboarding error:', err)
      setError(err.message)
      return { success: false, error: err.message }
    }
  }, [signupState])

  /**
   * Get WhatsApp URL
   */
  const getWhatsAppUrl = useCallback(async (customMessage) => {
    try {
      const info = await api.users.getWhatsAppInfo(customMessage)
      return info.url
    } catch (err) {
      console.error('Get WhatsApp URL error:', err)
      // Fallback URL
      return 'https://wa.me/972501234567'
    }
  }, [])

  /**
   * Reset signup flow
   */
  const resetSignupFlow = useCallback(() => {
    localStorage.removeItem(SIGNUP_STATE_KEY)
    setSignupState(getInitialState())
    setError(null)
  }, [])

  // Context value
  const value = {
    // Auth state
    isLoading,
    isAuthenticated,
    user,
    error,
    
    // Signup flow state
    signupState,
    currentStep: signupState.step,
    
    // Auth methods
    signInWithGoogle,
    signOut,
    
    // Signup flow methods
    submitPhoneNumber,
    completeOnboarding,
    resetSignupFlow,
    getWhatsAppUrl,
    
    // Constants
    SIGNUP_STEPS
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

/**
 * Hook to use auth context
 */
export const useAuth = () => {
  const context = useContext(AuthContext)
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  
  return context
}

export default AuthContext
