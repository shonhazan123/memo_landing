/**
 * Google Token Model
 * Database operations for user_google_tokens table using direct PostgreSQL connection
 */

import { query } from '../config/database.js'
import { v4 as uuidv4 } from 'uuid'

/**
 * Google token record structure
 * @typedef {Object} GoogleTokenRecord
 * @property {string} id - UUID
 * @property {string} user_id - Foreign key to users
 * @property {string} provider - Always 'google'
 * @property {string|null} access_token - OAuth access token
 * @property {string|null} refresh_token - OAuth refresh token
 * @property {string|null} expires_at - Token expiry timestamp
 * @property {string[]} scope - Array of granted scopes
 * @property {string|null} token_type - Usually 'Bearer'
 * @property {string} created_at - ISO timestamp
 * @property {string} updated_at - ISO timestamp
 */

class GoogleTokenModel {
  /**
   * Find tokens by user ID
   * @param {string} userId - User UUID
   * @returns {Promise<GoogleTokenRecord|null>}
   */
  async findByUserId(userId) {
    const result = await query(
      'SELECT * FROM user_google_tokens WHERE user_id = $1 AND provider = $2',
      [userId, 'google']
    )
    return result.rows[0] || null
  }

  /**
   * Upsert (insert or update) tokens for a user
   * @param {string} userId - User UUID
   * @param {Object} tokenData - Token data
   * @returns {Promise<GoogleTokenRecord>}
   */
  async upsert(userId, tokenData) {
    // First check if tokens exist
    const existing = await this.findByUserId(userId)
    
    if (existing) {
      // Update existing
      const result = await query(
        `UPDATE user_google_tokens 
         SET access_token = $1, refresh_token = $2, expires_at = $3, 
             scope = $4, token_type = $5, updated_at = NOW()
         WHERE user_id = $6 AND provider = $7
         RETURNING *`,
        [
          tokenData.accessToken || null,
          tokenData.refreshToken || existing.refresh_token, // Keep existing if not provided
          tokenData.expiresAt ? new Date(tokenData.expiresAt).toISOString() : null,
          tokenData.scope || [],
          tokenData.tokenType || 'Bearer',
          userId,
          'google'
        ]
      )
      return result.rows[0]
    } else {
      // Insert new
      const id = uuidv4()
      const result = await query(
        `INSERT INTO user_google_tokens (
          id, user_id, provider, access_token, refresh_token, 
          expires_at, scope, token_type
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *`,
        [
          id,
          userId,
          'google',
          tokenData.accessToken || null,
          tokenData.refreshToken || null,
          tokenData.expiresAt ? new Date(tokenData.expiresAt).toISOString() : null,
          tokenData.scope || [],
          tokenData.tokenType || 'Bearer'
        ]
      )
      return result.rows[0]
    }
  }

  /**
   * Update tokens for a user
   * @param {string} userId - User UUID
   * @param {Object} updates - Token updates
   * @returns {Promise<GoogleTokenRecord>}
   */
  async update(userId, updates) {
    const fields = []
    const values = []
    let paramIndex = 1

    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) {
        const dbKey = key === 'accessToken' ? 'access_token' :
                     key === 'refreshToken' ? 'refresh_token' :
                     key === 'expiresAt' ? 'expires_at' :
                     key === 'tokenType' ? 'token_type' : key
        fields.push(`${dbKey} = $${paramIndex}`)
        values.push(
          dbKey === 'expires_at' && updates[key] 
            ? new Date(updates[key]).toISOString() 
            : updates[key]
        )
        paramIndex++
      }
    })

    if (fields.length === 0) {
      return this.findByUserId(userId)
    }

    fields.push('updated_at = NOW()')
    values.push(userId, 'google')
    
    const result = await query(
      `UPDATE user_google_tokens 
       SET ${fields.join(', ')} 
       WHERE user_id = $${paramIndex} AND provider = $${paramIndex + 1}
       RETURNING *`,
      values
    )
    
    return result.rows[0]
  }

  /**
   * Delete tokens for a user
   * @param {string} userId - User UUID
   * @returns {Promise<void>}
   */
  async delete(userId) {
    await query(
      'DELETE FROM user_google_tokens WHERE user_id = $1 AND provider = $2',
      [userId, 'google']
    )
  }

  /**
   * Check if tokens need refresh (within 5 minutes of expiry)
   * @param {GoogleTokenRecord} tokens - Token record
   * @returns {boolean}
   */
  needsRefresh(tokens) {
    if (!tokens || !tokens.expires_at) return true
    
    const expiryTime = new Date(tokens.expires_at).getTime()
    const bufferTime = 5 * 60 * 1000 // 5 minutes
    
    return Date.now() >= expiryTime - bufferTime
  }
}

export default new GoogleTokenModel()
