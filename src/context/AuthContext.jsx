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
  // Merge loaded state with defaults so new keys (e.g. userName) always exist
  const [signupState, setSignupState] = useState(() => {
    const defaults = getInitialSignupState()
    const loaded = loadSignupState()
    return loaded ? { ...defaults, ...loaded } : defaults
  })

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

        // ── Detect if this is a settings OAuth redirect ──
        const isSettingsRedirect = window.location.pathname === '/settings' && !!tokenFromUrl

        // ── Verify existing JWT ──────────────────────────
        const hasValidToken = await verifyExistingToken()

        if (hasValidToken) {
          const ok = await loadUserProfile(stepFromUrl, isSettingsRedirect)
          if (!ok) {
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
   * When isSettingsRedirect is true, skip signup state updates.
   */
  async function loadUserProfile(stepOverride, isSettingsRedirect = false) {
    try {
      const { user: userData } = await api.auth.getCurrentUser()
      setUser(userData)
      setIsAuthenticated(true)

      // Skip signup state updates when returning from settings OAuth reconnect
      if (!isSettingsRedirect) {
        let step = determineStepFromUser(userData)

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
      }

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
  // Validates the phone and checks if the user is already registered.
  // Does NOT create a user in the database.
  const submitPhoneNumber = useCallback(async (phoneNumber, userName = null) => {
    setError(null)
    setIsLoading(true)

    try {
      const result = await api.users.checkPhone(phoneNumber, userName)

      // Case 1: Returning user — already fully registered with Google
      if (result.registered && result.jwtToken) {
        setToken(result.jwtToken)
        setUser(result.user)
        setIsAuthenticated(true)

        updateSignupState({
          step: result.user.onboardingComplete
            ? SIGNUP_STEPS.COMPLETED
            : SIGNUP_STEPS.WHATSAPP_REDIRECT,
          userId: result.user.id,
          whatsappNumber: result.user.whatsappNumber,
          formattedNumber: result.formattedNumber || result.user.whatsappNumber,
          userName: userName ?? null,
          hasGoogleConnection: true,
          googleEmail: result.user.email || null
        })

        return { success: true, shouldConnectGoogle: false }
      }

      // Case 2: New or partial user — proceed to Google step
      // No user created in DB yet; just store the phone and name locally.
      updateSignupState({
        step: SIGNUP_STEPS.GOOGLE_AUTH,
        whatsappNumber: phoneNumber,
        formattedNumber: result.formattedNumber,
        userName: userName ?? null,
        hasGoogleConnection: false
      })

      return { success: true, shouldConnectGoogle: true }
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
  // Uses the formatted phone number (not userId) — user is not in DB yet.
  const signInWithGoogle = useCallback(async () => {
    const phoneNumber = signupState.formattedNumber || signupState.whatsappNumber
    if (!phoneNumber) {
      setError('אנא הזן מספר טלפון תחילה')
      return
    }

    setError(null)

    try {
      // Fetch the Google auth URL — phone and optional userName encoded in the signed state token
      const { authUrl } = await api.auth.getGoogleAuthUrl(
        phoneNumber,
        'standard',
        null,
        signupState.userName
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

      setError(getGoogleSignInErrorMessage(err))
    }
  }, [signupState.formattedNumber, signupState.whatsappNumber, signupState.userName])

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

  // ── Disconnect (frontend-only, DB untouched) ──────────
  const disconnect = useCallback(() => {
    clearToken()
    clearOAuthRedirectPending()
    clearSignupState()
    setIsAuthenticated(false)
    setUser(null)
    setError(null)
    setSignupState(getInitialSignupState())
  }, [])

  // ── Reconnect Google (switch account from settings) ───
  const reconnectGoogle = useCallback(async () => {
    const phoneNumber = user?.whatsappNumber
    if (!phoneNumber) return

    setError(null)
    try {
      const { authUrl } = await api.auth.getGoogleAuthUrl(
        phoneNumber,
        user.planType || 'standard',
        '/settings'
      )
      setIsRedirectingToOAuth(true)
      setOAuthRedirectPending()
      window.location.href = authUrl
    } catch (err) {
      console.error('Reconnect Google error:', err)
      setIsRedirectingToOAuth(false)
      clearOAuthRedirectPending()
      setError(getGoogleSignInErrorMessage(err))
    }
  }, [user])

  // ── Delete account (removes user from DB) ─────────────
  const deleteAccount = useCallback(async () => {
    try {
      await api.users.deleteAccount()
      clearToken()
      clearOAuthRedirectPending()
      clearSignupState()
      setIsAuthenticated(false)
      setUser(null)
      setSignupState(getInitialSignupState())
      return { success: true }
    } catch (err) {
      console.error('Delete account error:', err)
      setError(err.message)
      return { success: false, error: err.message }
    }
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
    disconnect,
    reconnectGoogle,
    deleteAccount,

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
