/**
 * User Service
 * Business logic for user operations
 */

import UserModel from '../models/User.model.js'

// Mimo WhatsApp number - update this with actual number
const MIMO_WHATSAPP_NUMBER = process.env.MIMO_WHATSAPP_NUMBER || '972501234567'
const MIMO_WELCOME_MESSAGE = 'היי מימו! סיימתי את ההרשמה ואני מוכן להתחיל 🎉'

class UserService {
  /**
   * Get user by ID
   * @param {string} userId - User UUID
   * @returns {Promise<Object|null>}
   */
  async getUserById(userId) {
    const user = await UserModel.findById(userId)
    if (!user) return null
    
    return this.formatUser(user)
  }

  /**
   * Update user's WhatsApp number
   * @param {string} userId - User UUID
   * @param {string} phoneNumber - Raw phone number
   * @returns {Promise<Object>}
   */
  async updateWhatsappNumber(userId, phoneNumber) {
    // Validate and format phone number
    const formattedNumber = this.formatPhoneNumber(phoneNumber)
    
    if (!this.validateIsraeliPhone(formattedNumber)) {
      throw new Error('מספר טלפון לא תקין')
    }
    
    const user = await UserModel.updateWhatsappNumber(userId, formattedNumber)
    return this.formatUser(user)
  }

  /**
   * Create new user with phone number (and optionally Google email)
   * @param {string} phoneNumber - Raw phone number
   * @param {Object|null} googleProfile - Google profile from OAuth (optional)
   * @returns {Promise<Object>}
   */
  async createUserWithPhone(phoneNumber, googleProfile = null) {
    // Validate and format phone number
    const formattedNumber = this.formatPhoneNumber(phoneNumber)
    
    if (!this.validateIsraeliPhone(formattedNumber)) {
      throw new Error('מספר טלפון לא תקין')
    }
    
    // Find or create user by WhatsApp number
    let user = await UserModel.findOrCreateByWhatsappNumber(formattedNumber)
    
    // If we have Google profile, update google_email
    if (googleProfile?.email && !user.google_email) {
      user = await UserModel.update(user.id, { google_email: googleProfile.email })
    }
    
    return this.formatUser(user)
  }

  /**
   * Complete user onboarding
   * @param {string} userId - User UUID
   * @returns {Promise<Object>}
   */
  async completeOnboarding(userId) {
    const user = await UserModel.setOnboardingComplete(userId)
    return this.formatUser(user)
  }

  /**
   * Get WhatsApp URL for starting conversation with Mimo
   * @param {string} customMessage - Optional custom message
   * @returns {Object} WhatsApp info
   */
  getWhatsAppInfo(customMessage) {
    const message = customMessage || MIMO_WELCOME_MESSAGE
    const url = `https://wa.me/${MIMO_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
    
    return {
      number: MIMO_WHATSAPP_NUMBER,
      message,
      url
    }
  }

  /**
   * Format phone number to international format (Israel)
   * @param {string} phone - Raw phone number
   * @returns {string} Formatted phone number
   */
  formatPhoneNumber(phone) {
    // Remove all non-digit characters
    let digits = phone.replace(/\D/g, '')
    
    // Handle Israeli numbers
    if (digits.startsWith('0')) {
      digits = '972' + digits.slice(1)
    }
    
    // Ensure it starts with +
    if (!digits.startsWith('+')) {
      digits = '+' + digits
    }
    
    return digits
  }

  /**
   * Validate Israeli phone number
   * @param {string} phone - Phone number to validate
   * @returns {boolean}
   */
  validateIsraeliPhone(phone) {
    // Remove non-digit characters except +
    const cleaned = phone.replace(/[^\d+]/g, '')
    
    // Israeli mobile pattern: +972-5X-XXX-XXXX or 05X-XXX-XXXX
    const patterns = [
      /^\+972[5][0-9]{8}$/,  // International format with +
      /^972[5][0-9]{8}$/,     // International format without +
      /^0[5][0-9]{8}$/        // Local format
    ]
    
    return patterns.some(pattern => pattern.test(cleaned))
  }

  /**
   * Format user for API response
   * @param {Object} user - Database user record
   * @returns {Object} Formatted user
   */
  formatUser(user) {
    return {
      id: user.id,
      email: user.google_email || null,
      whatsappNumber: user.whatsapp_number,
      planType: user.plan_type,
      timezone: user.timezone,
      onboardingComplete: user.onboarding_complete,
      createdAt: user.created_at
    }
  }
}

export default new UserService()

