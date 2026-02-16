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
   * Validate phone number and check if user is already registered.
   * Does NOT create a user — registration happens after Google OAuth.
   */
  async checkPhone(req, res, next) {
    try {
      const { phoneNumber } = req.body

      if (!phoneNumber) {
        return res.status(400).json({ error: 'Phone number is required' })
      }

      // Format and validate
      const formattedNumber = UserService.formatPhoneNumber(phoneNumber)

      if (!UserService.validateIsraeliPhone(formattedNumber)) {
        return res.status(400).json({ error: 'מספר טלפון לא תקין' })
      }

      // Look up (don't create) existing user by phone
      const existingUser = await UserModel.findByWhatsappNumber(formattedNumber)

      if (existingUser) {
        // Check if fully registered (has Google connection)
        const googleTokens = await GoogleTokenModel.findByUserId(existingUser.id)
        const hasGoogleConnection = !!(googleTokens && googleTokens.refresh_token)

        if (hasGoogleConnection) {
          // Returning user — issue JWT so they can skip to completed/whatsapp
          const jwtToken = AuthService.generateJWT(existingUser)
          return res.json({
            isNewUser: false,
            registered: true,
            user: UserService.formatUser(existingUser),
            hasGoogleConnection: true,
            jwtToken
          })
        }

        // Partial user (phone exists, no Google yet) — continue to Google step
        return res.json({
          isNewUser: false,
          registered: false,
          formattedNumber,
          hasGoogleConnection: false
        })
      }

      // Brand-new phone — not in DB yet. Frontend proceeds to Google step.
      res.json({
        isNewUser: true,
        registered: false,
        formattedNumber,
        hasGoogleConnection: false
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
   * DELETE /api/users/me
   * Delete user account and all associated data
   */
  async deleteAccount(req, res, next) {
    try {
      const deletedUserId = await UserService.deleteUser(req.userId)
      res.json({ success: true, deletedUserId })
    } catch (error) {
      if (error.message === 'User not found') {
        return res.status(404).json({ error: 'User not found' })
      }
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

