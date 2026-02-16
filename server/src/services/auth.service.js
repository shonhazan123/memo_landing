/**
 * Auth Service
 * Business logic for authentication
 */

import { google } from 'googleapis'
import jwt from 'jsonwebtoken'
import { createOAuth2Client, getScopesForPlan } from '../config/google.js'
import UserModel from '../models/User.model.js'
import GoogleTokenModel from '../models/GoogleToken.model.js'

const JWT_SECRET = process.env.JWT_SECRET || 'mimo-jwt-secret-change-in-production'
const JWT_EXPIRES_IN = '7d'
const OAUTH_STATE_EXPIRES_IN = '10m' // State token is short-lived

class AuthService {
  // ═══════════════════════════════════════════════════════
  //  OAuth State — stateless, signed tokens
  //
  //  Instead of storing state in express-session (which can
  //  be lost on server restarts or cross-domain cookie issues),
  //  we encode userId + planType into a signed JWT that is
  //  passed to Google as the `state` parameter. On callback
  //  we verify the signature — no session lookup needed.
  // ═══════════════════════════════════════════════════════

  /**
   * Create a signed OAuth state token.
   * Encodes phoneNumber and planType so the callback can
   * register the user without needing a server-side session.
   * Extensible — add more fields here as the flow grows
   * (e.g. name, payment reference).
   *
   * @param {string} phoneNumber - Formatted phone (+972...)
   * @param {string} planType
   * @returns {string} Signed state token (JWT)
   */
  createOAuthState(phoneNumber, planType = 'standard') {
    return jwt.sign(
      { phoneNumber, planType, purpose: 'oauth_state' },
      JWT_SECRET,
      { expiresIn: OAUTH_STATE_EXPIRES_IN }
    )
  }

  /**
   * Verify and decode an OAuth state token.
   * Returns the payload if valid, null if tampered or expired.
   *
   * @param {string} stateToken
   * @returns {{ phoneNumber: string, planType: string } | null}
   */
  verifyOAuthState(stateToken) {
    try {
      const decoded = jwt.verify(stateToken, JWT_SECRET)
      if (decoded.purpose !== 'oauth_state') return null
      return { phoneNumber: decoded.phoneNumber, planType: decoded.planType }
    } catch {
      return null
    }
  }

  // ═══════════════════════════════════════════════════════
  //  Google OAuth URL
  // ═══════════════════════════════════════════════════════

  /**
   * Generate Google OAuth authorization URL.
   *
   * @param {Object} options
   * @param {string} options.phoneNumber - Formatted phone (encoded into state)
   * @param {string} options.planType    - User plan type
   * @returns {string} Authorization URL
   */
  getGoogleAuthUrl(options = {}) {
    const { phoneNumber, planType = 'standard' } = options

    const state = this.createOAuthState(phoneNumber, planType)

    const oauth2Client = createOAuth2Client()
    const scopes = getScopesForPlan(planType)

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent',
      include_granted_scopes: true,
      state
    })

    return authUrl
  }

  // ═══════════════════════════════════════════════════════
  //  Google OAuth Callback — registers user on completion
  //
  //  This is the ONLY place a new user is created in the DB.
  //  Phone number comes from the signed state token,
  //  Google profile + tokens come from the OAuth exchange.
  // ═══════════════════════════════════════════════════════

  /**
   * Handle Google OAuth callback.
   * Finds or creates the user by phone number, links Google
   * profile and tokens, and returns a JWT.
   *
   * @param {string} code        - Authorization code from Google
   * @param {string} phoneNumber - From the signed state token
   * @param {string} planType    - From the signed state token
   * @returns {Promise<{user: Object, jwtToken: string}>}
   */
  async handleGoogleCallback(code, phoneNumber, planType = 'standard') {
    if (!phoneNumber) {
      throw new Error('Phone number is required.')
    }

    const oauth2Client = createOAuth2Client()

    // Exchange code for tokens
    const { tokens } = await oauth2Client.getToken(code)
    oauth2Client.setCredentials(tokens)

    // Get user profile from Google
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client })
    const { data: profile } = await oauth2.userinfo.get()

    // Find or create the user by phone number (single DB write for new users)
    const user = await UserModel.findOrCreateByWhatsappNumber(phoneNumber)

    // Link Google email
    if (!user.google_email || user.google_email !== profile.email) {
      await UserModel.update(user.id, { google_email: profile.email })
      user.google_email = profile.email
    }

    // Update plan type if provided
    if (planType && planType !== user.plan_type) {
      await UserModel.update(user.id, { plan_type: planType })
      user.plan_type = planType
    }

    // Store/update Google tokens
    const normalizedScopes = tokens.scope
      ? tokens.scope.split(' ')
      : getScopesForPlan(planType)

    await GoogleTokenModel.upsert(user.id, {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresAt: tokens.expiry_date,
      scope: normalizedScopes,
      tokenType: tokens.token_type
    })

    // Generate JWT for frontend
    const jwtToken = this.generateJWT(user)

    return {
      user: {
        id: user.id,
        email: user.google_email,
        name: profile.name || '',
        picture: profile.picture,
        whatsappNumber: user.whatsapp_number,
        planType: user.plan_type,
        onboardingComplete: user.onboarding_complete
      },
      jwtToken
    }
  }

  /**
   * Generate JWT token for user
   * @param {Object} user - User record
   * @returns {string} JWT token
   */
  generateJWT(user) {
    return jwt.sign(
      {
        userId: user.id,
        email: user.google_email,
        planType: user.plan_type
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    )
  }

  /**
   * Verify JWT token
   * @param {string} token - JWT token
   * @returns {Object|null} Decoded payload or null
   */
  verifyJWT(token) {
    try {
      return jwt.verify(token, JWT_SECRET)
    } catch (error) {
      return null
    }
  }

  /**
   * Get user from JWT token
   * @param {string} token - JWT token
   * @returns {Promise<Object|null>} User or null
   */
  async getUserFromToken(token) {
    const decoded = this.verifyJWT(token)
    if (!decoded) return null
    
    const user = await UserModel.findById(decoded.userId)
    return user
  }

  /**
   * Refresh Google access token
   * @param {string} userId - User UUID
   * @returns {Promise<Object>} New tokens
   */
  async refreshGoogleToken(userId) {
    const tokens = await GoogleTokenModel.findByUserId(userId)
    
    if (!tokens || !tokens.refresh_token) {
      throw new Error('No refresh token available')
    }
    
    const oauth2Client = createOAuth2Client()
    oauth2Client.setCredentials({
      refresh_token: tokens.refresh_token
    })
    
    const { credentials } = await oauth2Client.refreshAccessToken()
    
    // Update tokens in database
    await GoogleTokenModel.update(userId, {
      access_token: credentials.access_token,
      expires_at: new Date(credentials.expiry_date).toISOString()
    })
    
    return {
      accessToken: credentials.access_token,
      expiresAt: credentials.expiry_date
    }
  }

  /**
   * Sign out user (clear tokens)
   * @param {string} userId - User UUID
   */
  async signOut(userId) {
    await GoogleTokenModel.delete(userId)
  }
}

export default new AuthService()

