/**
 * User Controller
 * Handles user-related HTTP requests
 */

import UserService from '../services/user.service.js'
import UserModel from '../models/User.model.js'
import GoogleTokenModel from '../models/GoogleToken.model.js'
import AuthService from '../services/auth.service.js'

class UserController {
  /**
   * GET /api/users/me
   * Get current user profile
   */
  async getProfile(req, res, next) {
    try {
      const user = await UserService.getUserById(req.userId)
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' })
      }
      
      res.json({ user })
    } catch (error) {
      next(error)
    }
  }

  /**
   * POST /api/users/check-phone
   * Check if user exists by phone number and Google connection status
   */
  async checkPhone(req, res, next) {
    try {
      const { phoneNumber } = req.body
      
      if (!phoneNumber) {
        return res.status(400).json({ error: 'Phone number is required' })
      }
      
      // Format and validate phone number
      const formattedNumber = UserService.formatPhoneNumber(phoneNumber)
      
      if (!UserService.validateIsraeliPhone(formattedNumber)) {
        return res.status(400).json({ error: 'מספר טלפון לא תקין' })
      }
      
      // Find or create user by WhatsApp number
      const user = await UserModel.findOrCreateByWhatsappNumber(formattedNumber)
      
      // Check if user has Google tokens
      const googleTokens = await GoogleTokenModel.findByUserId(user.id)
      const hasGoogleConnection = !!(googleTokens && googleTokens.refresh_token)
      
      // Generate JWT for the user
      const jwtToken = AuthService.generateJWT(user)
      
      res.json({
        user: UserService.formatUser(user),
        hasGoogleConnection,
        jwtToken,
        shouldConnectGoogle: !hasGoogleConnection
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * PUT /api/users/me/phone
   * Update or create user with WhatsApp number
   */
  async updatePhone(req, res, next) {
    try {
      const { phoneNumber } = req.body
      
      if (!phoneNumber) {
        return res.status(400).json({ error: 'Phone number is required' })
      }
      
      let user
      
      // Check if user exists (from JWT)
      if (req.userId) {
        // Existing user - update phone
        user = await UserService.updateWhatsappNumber(req.userId, phoneNumber)
      } else {
        // New user - create with phone number
        // Check if we have Google profile in session from OAuth
        const googleProfile = req.session?.googleProfile
        const googleTokens = req.session?.googleTokens
        
        user = await UserService.createUserWithPhone(phoneNumber, googleProfile)
        
        // If we have Google tokens, link them now
        if (googleTokens && user) {
          const GoogleTokenModel = (await import('../models/GoogleToken.model.js')).default
          await GoogleTokenModel.upsert(user.id, {
            accessToken: googleTokens.accessToken,
            refreshToken: googleTokens.refreshToken,
            expiresAt: googleTokens.expiresAt,
            scope: [],
            tokenType: 'Bearer'
          })
          
          // Clear session data
          delete req.session.googleProfile
          delete req.session.googleTokens
        }
      }
      
      res.json({ user })
    } catch (error) {
      if (error.message === 'מספר טלפון לא תקין') {
        return res.status(400).json({ error: error.message })
      }
      next(error)
    }
  }

  /**
   * POST /api/users/me/complete-onboarding
   * Mark user onboarding as complete
   */
  async completeOnboarding(req, res, next) {
    try {
      const user = await UserService.completeOnboarding(req.userId)
      
      res.json({
        user,
        whatsapp: UserService.getWhatsAppInfo()
      })
    } catch (error) {
      next(error)
    }
  }

  /**
   * GET /api/users/whatsapp-info
   * Get WhatsApp info for starting conversation
   */
  async getWhatsAppInfo(req, res, next) {
    try {
      const { message } = req.query
      const info = UserService.getWhatsAppInfo(message)
      
      res.json(info)
    } catch (error) {
      next(error)
    }
  }
}

export default new UserController()

