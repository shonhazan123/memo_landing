/**
 * Auth Controller
 * Handles authentication HTTP requests
 */

import AuthService from '../services/auth.service.js'
import crypto from 'crypto'

class AuthController {
  /**
   * GET /api/auth/google
   * Initiate Google OAuth flow
   */
  async initiateGoogleAuth(req, res, next) {
    try {
      const { planType = 'standard', userId } = req.query
      
      if (!userId) {
        return res.status(400).json({ 
          error: 'User ID is required',
          message: 'Please provide phone number first'
        })
      }
      
      // Verify user exists
      const UserModel = (await import('../models/User.model.js')).default
      const user = await UserModel.findById(userId)
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' })
      }
      
      // Generate state token for CSRF protection
      const state = crypto.randomBytes(32).toString('hex')
      
      // Store state and user ID in session
      req.session.oauthState = state
      req.session.userId = userId
      req.session.planType = planType
      
      // Get authorization URL
      const authUrl = AuthService.getGoogleAuthUrl({
        planType,
        state
      })
      
      // Return URL for frontend to redirect
      res.json({ authUrl })
    } catch (error) {
      // Provide helpful error message for missing credentials
      if (error.message.includes('Google OAuth credentials')) {
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
   * Handle Google OAuth callback
   */
  async handleGoogleCallback(req, res, next) {
    try {
      const { code, state, error: oauthError } = req.query
      
      // Handle OAuth errors
      if (oauthError) {
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'
        return res.redirect(`${frontendUrl}/signup?error=${encodeURIComponent(oauthError)}`)
      }
      
      // Verify state token
      if (state !== req.session.oauthState) {
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'
        return res.redirect(`${frontendUrl}/signup?error=invalid_state`)
      }
      
      // Clear state from session
      delete req.session.oauthState
      
      // Verify state token
      if (state !== req.session.oauthState) {
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'
        return res.redirect(`${frontendUrl}/signup?error=invalid_state`)
      }
      
      // Get user ID from session (should be set when they provided phone number)
      const userId = req.session.userId
      
      if (!userId) {
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'
        return res.redirect(`${frontendUrl}/signup?error=session_expired`)
      }
      
      // Clear state from session
      delete req.session.oauthState
      
      // Handle callback and link tokens to existing user
      const result = await AuthService.handleGoogleCallback(code, userId)
      
      // Store JWT in session
      req.session.jwt = result.jwtToken
      
      // Redirect to frontend with token
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'
      const redirectUrl = new URL(`${frontendUrl}/signup`)
      redirectUrl.searchParams.set('token', result.jwtToken)
      redirectUrl.searchParams.set('step', result.user.onboardingComplete ? 'completed' : 'whatsapp_redirect')
      
      res.redirect(redirectUrl.toString())
    } catch (error) {
      console.error('Google callback error:', error)
      
      // Provide helpful error messages
      let errorCode = 'auth_failed'
      if (error.message && error.message.includes('Invalid API key')) {
        console.error('❌ Supabase API key is invalid!')
        console.error('   Make sure you are using the SERVICE_ROLE key, not the anon key')
        console.error('   Get it from: Supabase Dashboard → Settings → API → service_role key')
        errorCode = 'database_error'
      } else if (error.message && error.message.includes('Supabase client not initialized')) {
        console.error('❌ Supabase is not configured!')
        console.error('   Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env file')
        errorCode = 'database_error'
      }
      
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'
      res.redirect(`${frontendUrl}/signup?error=${errorCode}`)
    }
  }

  /**
   * GET /api/auth/me
   * Get current authenticated user
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
      
      res.json({
        user: {
          id: user.id,
          email: user.google_email,
          name: user.name,
          whatsappNumber: user.whatsapp_number,
          planType: user.plan_type,
          onboardingComplete: user.onboarding_complete
        }
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * POST /api/auth/refresh
   * Refresh Google access token
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
   * POST /api/auth/logout
   * Sign out user
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
      
      // Clear session
      req.session.destroy()
      
      res.json({ success: true })
    } catch (error) {
      next(error)
    }
  }

  /**
   * GET /api/auth/verify
   * Verify if token is valid
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

