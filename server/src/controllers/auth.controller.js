/**
 * Auth Controller
 * Handles authentication HTTP requests.
 *
 * OAuth state is STATELESS — the state parameter sent to Google
 * is a signed JWT containing userId + planType. On callback we
 * verify the signature instead of looking up a server-side session.
 * This eliminates all session-cookie / in-memory-store issues.
 */

import AuthService from '../services/auth.service.js'
import UserService from '../services/user.service.js'

/** Helper: read FRONTEND_URL once, with fallback. */
const getFrontendUrl = () =>
  process.env.FRONTEND_URL || 'http://localhost:5173'

class AuthController {
  // ═══════════════════════════════════════════════════════
  //  Google OAuth
  // ═══════════════════════════════════════════════════════

  /**
   * GET /api/auth/google
   * Initiate Google OAuth flow.
   *
   * Accepts phoneNumber (not userId) — the user is NOT in the DB yet.
   * The phone number is encoded into a signed state token so the
   * callback can create the user after Google auth completes.
   */
  async initiateGoogleAuth(req, res, next) {
    try {
      const { planType = 'standard', phoneNumber, redirectTo, userName } = req.query

      if (!phoneNumber) {
        return res.status(400).json({
          error: 'Phone number is required',
          message: 'Please provide phone number first'
        })
      }

      // Build auth URL — state is a signed JWT with phoneNumber, planType, optional redirectTo, optional userName
      const authUrl = AuthService.getGoogleAuthUrl({
        phoneNumber,
        planType,
        redirectTo: redirectTo || null,
        userName: userName || null
      })

      res.json({ authUrl })
    } catch (error) {
      if (error.message?.includes('Google OAuth credentials')) {
        return res.status(500).json({
          error: 'Google OAuth is not configured',
          message: error.message,
          help: 'Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in your .env file'
        })
      }
      next(error)
    }
  }

  /**
   * GET /api/auth/google/callback
   * Handle Google OAuth callback.
   *
   * 1. Checks for Google-reported errors
   * 2. Verifies + decodes the signed state token (no session lookup)
   * 3. Exchanges the code for tokens
   * 4. Redirects to the frontend with a JWT
   */
  async handleGoogleCallback(req, res, next) {
    try {
      const { code, state, error: oauthError } = req.query
      const frontendUrl = getFrontendUrl()

      // ── Google-reported error (user denied, etc.) ──
      if (oauthError) {
        return res.redirect(
          `${frontendUrl}/signup?error=${encodeURIComponent(oauthError)}`
        )
      }

      // ── Verify signed state token (stateless CSRF check) ──
      if (!state) {
        return res.redirect(`${frontendUrl}/signup?error=invalid_state`)
      }

      const statePayload = AuthService.verifyOAuthState(state)

      if (!statePayload) {
        // Signature invalid or token expired (>10 min)
        return res.redirect(`${frontendUrl}/signup?error=invalid_state`)
      }

      const { phoneNumber, planType, redirectTo, userName } = statePayload

      // ── Exchange code, create/find user, link tokens, persist settings.user_name if provided ──
      const result = await AuthService.handleGoogleCallback(code, phoneNumber, planType, userName || null)

      // ── Redirect to frontend with JWT ──
      // If redirectTo is set (e.g. '/settings'), use that instead of /signup
      const redirectPath = redirectTo || '/signup'
      const redirectUrl = new URL(`${frontendUrl}${redirectPath}`)
      redirectUrl.searchParams.set('token', result.jwtToken)

      // Only set step param for the signup flow
      if (!redirectTo) {
        redirectUrl.searchParams.set(
          'step',
          result.user.onboardingComplete ? 'completed' : 'whatsapp_redirect'
        )
      }

      res.redirect(redirectUrl.toString())
    } catch (error) {
      console.error('Google callback error:', error)

      let errorCode = 'auth_failed'
      if (error.message?.includes('Invalid API key')) {
        console.error('Supabase API key is invalid — use the SERVICE_ROLE key')
        errorCode = 'database_error'
      } else if (error.message?.includes('Supabase client not initialized')) {
        console.error('Supabase not configured — set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
        errorCode = 'database_error'
      } else if (error.message?.includes('User not found')) {
        errorCode = 'user_not_found'
      }

      const frontendUrl = getFrontendUrl()
      res.redirect(`${frontendUrl}/signup?error=${errorCode}`)
    }
  }

  // ═══════════════════════════════════════════════════════
  //  JWT-based endpoints
  // ═══════════════════════════════════════════════════════

  /**
   * GET /api/auth/me — Get current authenticated user
   */
  async getCurrentUser(req, res, next) {
    try {
      const authHeader = req.headers.authorization

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided' })
      }

      const token = authHeader.split(' ')[1]
      const user = await AuthService.getUserFromToken(token)

      if (!user) {
        return res.status(401).json({ error: 'Invalid or expired token' })
      }

      // Use UserService so response includes googleScopes from user_google_tokens
      const formattedUser = await UserService.getUserById(user.id)
      if (!formattedUser) {
        return res.status(401).json({ error: 'User not found' })
      }

      res.json({ user: formattedUser })
    } catch (error) {
      next(error)
    }
  }

  /**
   * POST /api/auth/refresh — Refresh Google access token
   */
  async refreshToken(req, res, next) {
    try {
      const authHeader = req.headers.authorization

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided' })
      }

      const token = authHeader.split(' ')[1]
      const decoded = AuthService.verifyJWT(token)

      if (!decoded) {
        return res.status(401).json({ error: 'Invalid token' })
      }

      const newTokens = await AuthService.refreshGoogleToken(decoded.userId)
      res.json({ tokens: newTokens })
    } catch (error) {
      next(error)
    }
  }

  /**
   * POST /api/auth/logout — Sign out user
   */
  async logout(req, res, next) {
    try {
      const authHeader = req.headers.authorization

      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1]
        const decoded = AuthService.verifyJWT(token)

        if (decoded) {
          await AuthService.signOut(decoded.userId)
        }
      }

      // Destroy session if it exists (belt-and-suspenders)
      if (req.session) {
        req.session.destroy()
      }

      res.json({ success: true })
    } catch (error) {
      next(error)
    }
  }

  /**
   * GET /api/auth/verify — Verify if token is valid
   */
  async verifyToken(req, res, next) {
    try {
      const authHeader = req.headers.authorization

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.json({ valid: false })
      }

      const token = authHeader.split(' ')[1]
      const decoded = AuthService.verifyJWT(token)

      res.json({
        valid: !!decoded,
        ...(decoded && { userId: decoded.userId, email: decoded.email })
      })
    } catch (error) {
      res.json({ valid: false })
    }
  }
}

export default new AuthController()
