/**
 * User Model
 * Database operations for users table using direct PostgreSQL connection
 */

import { query } from '../config/database.js'
import { v4 as uuidv4 } from 'uuid'

/**
 * User record structure
 * @typedef {Object} UserRecord
 * @property {string} id - UUID
 * @property {string} whatsapp_number - User's WhatsApp number (NOT NULL, UNIQUE)
 * @property {string} plan_type - 'free' | 'standard' | 'pro' (NOT NULL, default 'standard')
 * @property {string} timezone - User timezone (default 'Asia/Jerusalem')
 * @property {Object} settings - User settings JSONB (default '{}')
 * @property {string|null} google_email - User's Google email
 * @property {boolean} onboarding_complete - Whether onboarding is complete (NOT NULL, default false)
 * @property {string|null} onboarding_last_prompt_at - Last onboarding prompt timestamp
 * @property {string} created_at - ISO timestamp (default now())
 * @property {string} updated_at - ISO timestamp (NOT NULL, default now())
 */

class UserModel {
  /**
   * Find user by ID
   * @param {string} id - User UUID
   * @returns {Promise<UserRecord|null>}
   */
  async findById(id) {
    const result = await query(
      'SELECT * FROM users WHERE id = $1',
      [id]
    )
    return result.rows[0] || null
  }


  /**
   * Find user by Google email
   * @param {string} email - Google email
   * @returns {Promise<UserRecord|null>}
   */
  async findByEmail(email) {
    const result = await query(
      'SELECT * FROM users WHERE google_email = $1',
      [email]
    )
    return result.rows[0] || null
  }

  /**
   * Find user by WhatsApp number
   * @param {string} whatsappNumber - WhatsApp number
   * @returns {Promise<UserRecord|null>}
   */
  async findByWhatsappNumber(whatsappNumber) {
    const result = await query(
      'SELECT * FROM users WHERE whatsapp_number = $1',
      [whatsappNumber]
    )
    return result.rows[0] || null
  }

  /**
   * Create a new user (requires whatsapp_number - use findOrCreateByWhatsappNumber instead)
   * @param {Object} userData - User data (must include whatsappNumber)
   * @returns {Promise<UserRecord>}
   */
  async create(userData) {
    if (!userData.whatsappNumber) {
      throw new Error('whatsapp_number is required to create a user')
    }
    
    const id = uuidv4()
    const result = await query(
      `INSERT INTO users (
        id, whatsapp_number, google_email, 
        plan_type, timezone, settings, onboarding_complete
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`,
      [
        id,
        userData.whatsappNumber,
        userData.email || null,
        userData.planType || 'standard',
        userData.timezone || 'Asia/Jerusalem',
        userData.settings || '{}',
        false
      ]
    )
    return result.rows[0]
  }

  /**
   * Find or create user by WhatsApp number (PRIMARY method for user creation)
   * @param {string} whatsappNumber - WhatsApp number
   * @returns {Promise<UserRecord>}
   */
  async findOrCreateByWhatsappNumber(whatsappNumber) {
    let user = await this.findByWhatsappNumber(whatsappNumber)
    
    if (!user) {
      user = await this.create({ whatsappNumber })
    }
    
    return user
  }

  /**
   * Update user by ID
   * @param {string} id - User UUID
   * @param {Object} updates - Fields to update
   * @returns {Promise<UserRecord>}
   */
  async update(id, updates) {
    const fields = []
    const values = []
    let paramIndex = 1

    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) {
        fields.push(`${key} = $${paramIndex}`)
        values.push(updates[key])
        paramIndex++
      }
    })

    if (fields.length === 0) {
      return this.findById(id)
    }

    // Always update updated_at
    fields.push(`updated_at = NOW()`)
    
    values.push(id)
    const result = await query(
      `UPDATE users SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      values
    )
    
    return result.rows[0]
  }

  /**
   * Find user by Google email and update google_email
   * Note: We don't create users here - users must be created via findOrCreateByWhatsappNumber
   * @param {string} email - Google email
   * @returns {Promise<UserRecord|null>}
   */
  async findByEmailAndUpdate(email) {
    const user = await this.findByEmail(email)
    if (user) {
      // Update google_email if it's different
      if (user.google_email !== email) {
        return await this.update(user.id, { google_email: email })
      }
      return user
    }
    return null
  }

  /**
   * Update WhatsApp number
   * @param {string} id - User UUID
   * @param {string} whatsappNumber - WhatsApp number
   * @returns {Promise<UserRecord>}
   */
  async updateWhatsappNumber(id, whatsappNumber) {
    return this.update(id, { whatsapp_number: whatsappNumber })
  }

  /**
   * Mark onboarding as complete
   * @param {string} id - User UUID
   * @returns {Promise<UserRecord>}
   */
  async setOnboardingComplete(id) {
    return this.update(id, { onboarding_complete: true })
  }
}

export default new UserModel()
