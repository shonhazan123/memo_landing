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

class AuthService {
  /**
   * Generate Google OAuth authorization URL
   * @param {Object} options
   * @param {string} options.planType - User plan type
   * @param {string} options.state - State token for CSRF protection
   * @returns {string} Authorization URL
   */
  getGoogleAuthUrl(options = {}) {
    const { planType = 'standard', state } = options
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

  /**
   * Handle Google OAuth callback
   * @param {string} code - Authorization code from Google
   * @param {string} userId - User UUID (user must exist from phone number step)
   * @returns {Promise<{user: Object, tokens: Object, jwtToken: string}>}
   */
  async handleGoogleCallback(code, userId) {
    if (!userId) {
      throw new Error('User ID is required. Please provide phone number first.')
    }
    
    // Verify user exists
    const user = await UserModel.findById(userId)
    if (!user) {
      throw new Error('User not found')
    }
    const oauth2Client = createOAuth2Client()
    
    // Exchange code for tokens
    const { tokens } = await oauth2Client.getToken(code)
    oauth2Client.setCredentials(tokens)
    
    // Get user profile from Google
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client })
    const { data: profile } = await oauth2.userinfo.get()
    
    // Update user's Google email if not set or different
    if (!user.google_email || user.google_email !== profile.email) {
      await UserModel.update(user.id, { google_email: profile.email })
      user.google_email = profile.email
    }
    
    // Store/update Google tokens
    const normalizedScopes = tokens.scope ? tokens.scope.split(' ') : getScopesForPlan('standard')
    
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
      tokens: {
        accessToken: tokens.access_token,
        expiresAt: tokens.expiry_date
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

