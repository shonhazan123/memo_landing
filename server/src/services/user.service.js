/**
 * User Service
 * Business logic for user operations
 */

import UserModel from '../models/User.model.js'
import GoogleTokenModel from '../models/GoogleToken.model.js'

// Mimo WhatsApp number - update this with actual number
const MIMO_WHATSAPP_NUMBER = process.env.MIMO_WHATSAPP_NUMBER || '972501234567'
const MIMO_WELCOME_MESSAGE = "היי דונה , איך את יכולה לעזור לי ? 🤔"

/** PostgreSQL TIME as HH:mm for <input type="time"> and APIs */
const MORNING_BRIEF_TIME_RE = /^([01]?\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/

class UserService {
  /**
   * Normalize DB TIME value to HH:mm (24h)
   * @param {string|Date|null|undefined} raw
   * @returns {string}
   */
  formatMorningBriefTime(raw) {
    if (raw == null) return '08:00'
    if (typeof raw === 'string') {
      const m = raw.trim().match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?/)
      if (!m) return '08:00'
      const h = String(Math.min(23, parseInt(m[1], 10))).padStart(2, '0')
      return `${h}:${m[2]}`
    }
    if (raw instanceof Date && !Number.isNaN(raw.getTime())) {
      const h = String(raw.getUTCHours()).padStart(2, '0')
      const min = String(raw.getUTCMinutes()).padStart(2, '0')
      return `${h}:${min}`
    }
    return '08:00'
  }

  /**
   * Validate and normalize morning brief time for PostgreSQL (HH:mm or HH:mm:ss)
   * @param {string} value
   * @returns {string} HH:mm:ss
   */
  parseMorningBriefTimeForDb(value) {
    if (typeof value !== 'string' || !MORNING_BRIEF_TIME_RE.test(value.trim())) {
      throw new Error('Invalid morning brief time')
    }
    const trimmed = value.trim()
    const parts = trimmed.split(':')
    const h = String(parseInt(parts[0], 10)).padStart(2, '0')
    const m = parts[1].padStart(2, '0')
    const s = parts[2] != null ? parts[2].padStart(2, '0') : '00'
    return `${h}:${m}:${s}`
  }

  /**
   * Get user by ID
   * @param {string} userId - User UUID
   * @returns {Promise<Object|null>}
   */
  async getUserById(userId) {
    const user = await UserModel.findById(userId)
    if (!user) return null

    const googleTokens = await GoogleTokenModel.findByUserId(userId)
    return this.formatUser(user, googleTokens)
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
   * Delete user account and all associated data
   * @param {string} userId - User UUID
   * @returns {Promise<string>} Deleted user ID
   */
  async deleteUser(userId) {
    const deletedId = await UserModel.delete(userId)
    return deletedId
  }

  /**
   * Update morning brief send time (authorized user only; caller must pass userId from JWT)
   * @param {string} userId
   * @param {string} morningBriefTime - HH:mm or HH:mm:ss
   * @returns {Promise<Object>} formatted user
   */
  async updateMorningBriefTime(userId, morningBriefTime) {
    const sqlTime = this.parseMorningBriefTimeForDb(morningBriefTime)
    const user = await UserModel.update(userId, { morning_brief_time: sqlTime })
    const googleTokens = await GoogleTokenModel.findByUserId(userId)
    return this.formatUser(user, googleTokens)
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
   * @param {Object|null} googleTokens - Google token record (optional)
   * @returns {Object} Formatted user
   */
  formatUser(user, googleTokens = null) {
    const settings = user.settings && typeof user.settings === 'object'
      ? user.settings
      : (typeof user.settings === 'string' ? (() => { try { return JSON.parse(user.settings) } catch { return {} } })() : {})
    return {
      id: user.id,
      email: user.google_email || null,
      name: user.name || settings?.user_name || null,
      whatsappNumber: user.whatsapp_number,
      planType: user.plan_type,
      timezone: user.timezone,
      morningBriefTime: this.formatMorningBriefTime(user.morning_brief_time),
      onboardingComplete: user.onboarding_complete,
      createdAt: user.created_at,
      googleScopes: googleTokens?.scope || [],
      // Subscription (policy: access at period end, no user delete on cancel)
      subscriptionStatus: user.subscription_status || 'active',
      subscriptionPeriodEnd: user.subscription_period_end || null,
      cancelAtPeriodEnd: !!user.cancel_at_period_end,
      firstChargeDate: settings?.first_charge_date || null,
    }
  }
}

export default new UserService()

