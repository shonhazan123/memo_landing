/**
 * Auth Context
 * Provides authentication state and methods across the application.
 *
 * All persistence helpers, error messages, and validation logic
 * live in lib/auth-helpers.js to keep this file focused on
 * React state management and user-facing actions.
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import api, { setToken, clearToken } from '../api/client'
import {
  SIGNUP_STEPS,
  getInitialSignupState,
  loadSignupState,
  saveSignupState,
  clearSignupState,
  setOAuthRedirectPending,
  clearOAuthRedirectPending,
  isOAuthRedirectPending,
  isSignupStateStale,
  determineStepFromUser,
  getErrorMessage,
  isUserNotFoundError,
  getGoogleSignInErrorMessage
} from '../lib/auth-helpers'

// Re-export for components that import from here
export { SIGNUP_STEPS }

// ─── Context ─────────────────────────────────────────────
const AuthContext = createContext(null)

// ═══════════════════════════════════════════════════════════
//  Provider
// ═══════════════════════════════════════════════════════════

export const AuthProvider = ({ children }) => {
  // ── Core auth state ──────────────────────────────────
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [error, setError] = useState(null)

  // ── Signup wizard state (persisted in localStorage) ──
  const [signupState, setSignupState] = useState(
    () => loadSignupState() || getInitialSignupState()
  )

  // ── OAuth redirect state (NOT persisted — lives only in React) ──
  // Separate from isLoading so an external redirect never locks the UI.
  const [isRedirectingToOAuth, setIsRedirectingToOAuth] = useState(false)

  // ─────────────────────────────────────────────────────
  //  Helper: update + persist signup state in one call
  // ─────────────────────────────────────────────────────
  const updateSignupState = useCallback((patch) => {
    setSignupState((prev) => {
      const next = { ...prev, ...patch }
      saveSignupState(next)
      return next
    })
  }, [])

  const resetToPhoneStep = useCallback((keepPhone = null) => {
    const fresh = {
      ...getInitialSignupState(),
      whatsappNumber: keepPhone
    }
    setSignupState(fresh)
    saveSignupState(fresh)
  }, [])

  // ═══════════════════════════════════════════════════════
  //  1. Initialize auth on mount
  // ═══════════════════════════════════════════════════════

  useEffect(() => {
    const initAuth = async () => {
      try {
        setIsLoading(true)

        // ── Read URL params from OAuth callback ──────────
        const urlParams = new URLSearchParams(window.location.search)
        const tokenFromUrl = urlParams.get('token')
        const stepFromUrl = urlParams.get('step')
        const errorFromUrl = urlParams.get('error')

        // Always clear the OAuth redirect marker on a fresh page load
        // (either the callback brought us here, or the user abandoned)
        clearOAuthRedirectPending()

        // ── Handle OAuth error redirect ──────────────────
        if (errorFromUrl) {
          setError(getErrorMessage(errorFromUrl))
          window.history.replaceState({}, '', window.location.pathname)
          setIsLoading(false)
          return
        }

        // ── Handle successful OAuth callback token ───────
        if (tokenFromUrl) {
          setToken(tokenFromUrl)
          window.history.replaceState({}, '', window.location.pathname)
        }

        // ── Verify existing JWT ──────────────────────────
        const hasValidToken = await verifyExistingToken()

        if (hasValidToken) {
          const ok = await loadUserProfile(stepFromUrl)
          if (!ok) {
            // User was deleted or profile fetch failed → full reset
            handleAuthInvalid()
          }
        } else {
          handleAuthInvalid()
        }
      } catch (err) {
        console.error('Auth init error:', err)
        handleAuthInvalid()
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ═══════════════════════════════════════════════════════
  //  2. bfcache & tab-switch recovery
  //
  //  If the user navigated to Google and pressed back,
  //  the browser may restore the page from bfcache with
  //  isRedirectingToOAuth still true. These listeners
  //  detect that and reset the redirect flag.
  // ═══════════════════════════════════════════════════════

  useEffect(() => {
    const handlePageShow = (e) => {
      if (e.persisted) {
        // Page restored from bfcache → stop showing redirect spinner
        setIsRedirectingToOAuth(false)
        clearOAuthRedirectPending()
      }
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isRedirectingToOAuth) {
        // User switched back to this tab while redirect spinner was showing
        setIsRedirectingToOAuth(false)
        clearOAuthRedirectPending()
      }
    }

    window.addEventListener('pageshow', handlePageShow)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.removeEventListener('pageshow', handlePageShow)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [isRedirectingToOAuth])

  // ═══════════════════════════════════════════════════════
  //  Private helpers (used by initAuth)
  // ═══════════════════════════════════════════════════════

  /** Returns true if the stored JWT is structurally valid. */
  async function verifyExistingToken() {
    try {
      const result = await api.auth.verifyToken()
      return result?.valid || false
    } catch (err) {
      console.warn('Backend not available for token verify:', err.message)
      return false
    }
  }

  /**
   * Fetch user profile from backend and sync signupState.
   * Returns true on success, false if user no longer exists.
   */
  async function loadUserProfile(stepOverride) {
    try {
      const { user: userData } = await api.auth.getCurrentUser()
      setUser(userData)
      setIsAuthenticated(true)

      let step = determineStepFromUser(userData)

      // Allow the URL to override step (e.g. from OAuth callback)
      if (stepOverride && Object.values(SIGNUP_STEPS).includes(stepOverride)) {
        step = stepOverride
      }

      updateSignupState({
        step,
        userId: userData.id,
        whatsappNumber: userData.whatsappNumber,
        hasGoogleConnection: !!userData.email,
        googleEmail: userData.email || null
      })

      return true
    } catch (err) {
      console.warn('Failed to load user profile:', err.message)
      return false
    }
  }

  /**
   * Called whenever we determine auth is invalid (token expired,
   * user deleted, etc.). Resets BOTH auth state AND signupState
   * so the two never get out of sync.
   */
  function handleAuthInvalid() {
    clearToken()
    setIsAuthenticated(false)
    setUser(null)

    // If signupState points to a step that requires auth, reset it.
    // This prevents the "stuck on Google step with stale userId" bug.
    if (isSignupStateStale(signupState, false)) {
      resetToPhoneStep()
    }
  }

  // ═══════════════════════════════════════════════════════
  //  Public actions
  // ═══════════════════════════════════════════════════════

  // ── Submit phone number ────────────────────────────────
  const submitPhoneNumber = useCallback(async (phoneNumber) => {
    setError(null)
    setIsLoading(true)

    try {
      const result = await api.users.checkPhone(phoneNumber)

      if (result.jwtToken) {
        setToken(result.jwtToken)
      }

      setUser(result.user)
      setIsAuthenticated(true)

      updateSignupState({
        step: result.hasGoogleConnection
          ? SIGNUP_STEPS.WHATSAPP_REDIRECT
          : SIGNUP_STEPS.GOOGLE_AUTH,
        userId: result.user.id,
        whatsappNumber: result.user.whatsappNumber,
        hasGoogleConnection: result.hasGoogleConnection,
        googleEmail: result.user.email || null
      })

      return { success: true, shouldConnectGoogle: result.shouldConnectGoogle }
    } catch (err) {
      console.error('Submit phone error:', err)
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setIsLoading(false)
    }
  }, [updateSignupState])

  // ── Go back to phone step ─────────────────────────────
  const goBackToPhoneStep = useCallback(() => {
    clearToken()
    clearOAuthRedirectPending()
    setUser(null)
    setIsAuthenticated(false)
    setError(null)
    setIsRedirectingToOAuth(false)
    resetToPhoneStep(signupState.whatsappNumber || null)
  }, [signupState.whatsappNumber, resetToPhoneStep])

  // ── Cancel OAuth redirect (manual escape hatch) ───────
  const cancelOAuthRedirect = useCallback(() => {
    setIsRedirectingToOAuth(false)
    clearOAuthRedirectPending()
  }, [])

  // ── Sign in with Google ────────────────────────────────
  const signInWithGoogle = useCallback(async () => {
    if (!signupState.userId) {
      setError('אנא הזן מספר טלפון תחילה')
      return
    }

    setError(null)

    try {
      // Fetch the Google auth URL from backend
      const { authUrl } = await api.auth.getGoogleAuthUrl(
        signupState.userId,
        'standard'
      )

      // Mark redirect BEFORE navigating away
      setIsRedirectingToOAuth(true)
      setOAuthRedirectPending()

      // Navigate to Google (leaves the SPA)
      window.location.href = authUrl
    } catch (err) {
      console.error('Sign in with Google error:', err)
      setIsRedirectingToOAuth(false)
      clearOAuthRedirectPending()

      // User was deleted → go back to phone
      if (isUserNotFoundError(err)) {
        goBackToPhoneStep()
        setError('המשתמש לא נמצא. אנא הזן שוב את מספר הטלפון.')
        return
      }

      setError(getGoogleSignInErrorMessage(err))
    }
  }, [signupState.userId, goBackToPhoneStep])

  // ── Sign out ───────────────────────────────────────────
  const signOut = useCallback(async () => {
    setIsLoading(true)

    try {
      await api.auth.logout()
    } catch (err) {
      console.error('Sign out error:', err)
    } finally {
      clearToken()
      clearOAuthRedirectPending()
      clearSignupState()
      setIsAuthenticated(false)
      setUser(null)
      setSignupState(getInitialSignupState())
      setIsLoading(false)
    }
  }, [])

  // ── Complete onboarding ────────────────────────────────
  const completeOnboarding = useCallback(async () => {
    setError(null)

    try {
      const { user: updatedUser, whatsapp } = await api.users.completeOnboarding()
      setUser(updatedUser)
      updateSignupState({ step: SIGNUP_STEPS.COMPLETED })
      return { success: true, whatsapp }
    } catch (err) {
      console.error('Complete onboarding error:', err)
      setError(err.message)
      return { success: false, error: err.message }
    }
  }, [updateSignupState])

  // ── Get WhatsApp URL ───────────────────────────────────
  const getWhatsAppUrl = useCallback(async (customMessage) => {
    try {
      const info = await api.users.getWhatsAppInfo(customMessage)
      return info.url
    } catch (err) {
      console.error('Get WhatsApp URL error:', err)
      return 'https://wa.me/972501234567'
    }
  }, [])

  // ── Full reset (clears everything) ─────────────────────
  const resetSignupFlow = useCallback(() => {
    clearSignupState()
    clearOAuthRedirectPending()
    setSignupState(getInitialSignupState())
    setError(null)
  }, [])

  // ═══════════════════════════════════════════════════════
  //  Context value
  // ═══════════════════════════════════════════════════════

  const value = {
    // State
    isLoading,
    isAuthenticated,
    isRedirectingToOAuth,
    user,
    error,
    signupState,
    currentStep: signupState.step,

    // Auth actions
    signInWithGoogle,
    signOut,

    // Signup flow actions
    submitPhoneNumber,
    completeOnboarding,
    goBackToPhoneStep,
    cancelOAuthRedirect,
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

// ═══════════════════════════════════════════════════════════
//  Hook
// ═══════════════════════════════════════════════════════════

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext
