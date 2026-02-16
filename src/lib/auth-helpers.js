/**
 * Auth Helpers
 * Dedicated utility functions for OAuth flow recovery,
 * signup state management, and session marker handling.
 *
 * Keeps AuthContext clean by extracting all persistence
 * and recovery logic into testable, single-responsibility functions.
 */

// ─── Storage Keys ────────────────────────────────────────────
const SIGNUP_STATE_KEY = 'mimo_signup_state'
const OAUTH_REDIRECT_KEY = 'oauth_redirect_pending'
const SIGNUP_STATE_EXPIRY_MS = 24 * 60 * 60 * 1000 // 24 hours

// ─── Signup Steps (shared constant) ─────────────────────────
export const SIGNUP_STEPS = {
  PHONE_NUMBER: 'phone_number',
  GOOGLE_AUTH: 'google_auth',
  WHATSAPP_REDIRECT: 'whatsapp_redirect',
  COMPLETED: 'completed'
}

// ─── Initial State ──────────────────────────────────────────
// Note: userId is only set AFTER Google OAuth completes and the
// user is actually created in the database. Before that we only
// have whatsappNumber (from the phone step).
export const getInitialSignupState = () => ({
  step: SIGNUP_STEPS.PHONE_NUMBER,
  userId: null,
  whatsappNumber: null,          // Set after phone step (frontend-only until Google completes)
  formattedNumber: null,         // Backend-formatted phone (+972...)
  hasGoogleConnection: false,
  googleEmail: null,
  googleName: null,
  googlePicture: null,
  startedAt: Date.now(),
  updatedAt: Date.now()
})

// ═══════════════════════════════════════════════════════════
//  Signup State Persistence (localStorage)
// ═══════════════════════════════════════════════════════════

/**
 * Load signup state from localStorage.
 * Returns null if missing or expired (24h).
 */
export function loadSignupState() {
  try {
    const saved = localStorage.getItem(SIGNUP_STATE_KEY)
    if (!saved) return null

    const state = JSON.parse(saved)

    if (Date.now() - state.startedAt > SIGNUP_STATE_EXPIRY_MS) {
      localStorage.removeItem(SIGNUP_STATE_KEY)
      return null
    }

    return state
  } catch {
    return null
  }
}

/**
 * Persist signup state to localStorage with a fresh updatedAt.
 */
export function saveSignupState(state) {
  try {
    localStorage.setItem(
      SIGNUP_STATE_KEY,
      JSON.stringify({ ...state, updatedAt: Date.now() })
    )
  } catch (e) {
    console.error('Error saving signup state:', e)
  }
}

/**
 * Clear signup state from localStorage entirely.
 */
export function clearSignupState() {
  localStorage.removeItem(SIGNUP_STATE_KEY)
}

// ═══════════════════════════════════════════════════════════
//  OAuth Redirect Marker (sessionStorage)
//
//  Before navigating to Google we set a marker.
//  When the page reloads (or restores from bfcache) we
//  check this marker to decide whether the user abandoned
//  the OAuth flow or is returning from a successful callback.
// ═══════════════════════════════════════════════════════════

/**
 * Mark that we are about to redirect to Google OAuth.
 */
export function setOAuthRedirectPending() {
  sessionStorage.setItem(OAUTH_REDIRECT_KEY, Date.now().toString())
}

/**
 * Check whether an OAuth redirect was in progress.
 */
export function isOAuthRedirectPending() {
  return !!sessionStorage.getItem(OAUTH_REDIRECT_KEY)
}

/**
 * Clear the OAuth redirect marker (on success, cancel, or recovery).
 */
export function clearOAuthRedirectPending() {
  sessionStorage.removeItem(OAUTH_REDIRECT_KEY)
}

// ═══════════════════════════════════════════════════════════
//  Signup State Validation
//
//  Ensures signupState is consistent with actual auth state
//  so the user never sees a stale step.
// ═══════════════════════════════════════════════════════════

/**
 * Check if signupState is stale and should be reset to the phone step.
 *
 * Steps after Google OAuth (whatsapp_redirect, completed) require a
 * valid JWT because the user is now in the DB. The Google step itself
 * only requires a phone number (no JWT needed — user isn't in DB yet).
 *
 * @param {Object} signupState - Current signup state from localStorage
 * @param {boolean} hasValidAuth - Whether we have a verified JWT + user
 */
export function isSignupStateStale(signupState, hasValidAuth) {
  if (!signupState) return false

  const oauthInProgress = isOAuthRedirectPending()

  // Post-Google steps require auth
  const stepRequiresAuth =
    signupState.step === SIGNUP_STEPS.WHATSAPP_REDIRECT ||
    signupState.step === SIGNUP_STEPS.COMPLETED

  if (stepRequiresAuth && !hasValidAuth && !oauthInProgress) return true

  // Google step requires a phone number (not auth)
  if (signupState.step === SIGNUP_STEPS.GOOGLE_AUTH && !signupState.formattedNumber && !oauthInProgress) {
    return true
  }

  return false
}

/**
 * Determine the correct signup step based on the user's DB state.
 * Single source of truth -- avoids duplicating this logic.
 *
 * @param {Object} userData - User profile from backend
 * @returns {string} The signup step constant
 */
export function determineStepFromUser(userData) {
  if (!userData) return SIGNUP_STEPS.PHONE_NUMBER

  if (userData.onboardingComplete) return SIGNUP_STEPS.COMPLETED
  if (userData.whatsappNumber && userData.email) return SIGNUP_STEPS.WHATSAPP_REDIRECT
  if (userData.whatsappNumber) return SIGNUP_STEPS.GOOGLE_AUTH

  return SIGNUP_STEPS.PHONE_NUMBER
}

// ═══════════════════════════════════════════════════════════
//  Error Messages (Hebrew)
// ═══════════════════════════════════════════════════════════

const ERROR_MESSAGES = {
  auth_failed: 'ההתחברות נכשלה. אנא נסה שוב.',
  invalid_state: 'שגיאת אבטחה. אנא נסה שוב.',
  access_denied: 'הגישה נדחתה. אנא אשר את ההרשאות.',
  session_expired: 'ההתחברות פגה. אנא הזן שוב את מספר הטלפון.',
  user_not_found: 'המשתמש לא נמצא. אנא הזן שוב את מספר הטלפון.',
  database_error: 'שגיאת מערכת. אנא נסה שוב מאוחר יותר.',
  default: 'משהו השתבש. אנא נסה שוב.'
}

/**
 * Get a user-facing Hebrew error message for an error code.
 */
export function getErrorMessage(errorCode) {
  return ERROR_MESSAGES[errorCode] || ERROR_MESSAGES.default
}

/**
 * Check whether an API error represents "user not found".
 */
export function isUserNotFoundError(err) {
  return (
    err?.status === 404 ||
    (err?.message && err.message.includes('User not found'))
  )
}

/**
 * Translate a signInWithGoogle catch error into a Hebrew message.
 */
export function getGoogleSignInErrorMessage(err) {
  if (!err?.message) return 'שגיאה בהתחברות'

  if (err.message.includes('Google OAuth is not configured')) {
    return 'הגדרות Google לא הוגדרו. אנא הוסף GOOGLE_CLIENT_ID ו-GOOGLE_CLIENT_SECRET לקובץ .env'
  }
  if (err.message.includes('SERVER_CONNECTION_ERROR')) {
    return 'לא ניתן להתחבר לשרת. אנא ודא שהשרת רץ על פורט 3001'
  }

  return err.message
}
