/**
 * PaymentSession Model
 * Database operations for payment_sessions table.
 */

import { query } from '../config/database.js'
import { v4 as uuidv4 } from 'uuid'

class PaymentSessionModel {
  /**
   * Find a pending session for a given user and plan.
   * Only returns sessions that haven't expired.
   * @param {string} userId
   * @param {string} planId
   * @param {string} billingPeriod
   * @returns {Promise<Object|null>}
   */
  async findPendingSession(userId, planId, billingPeriod) {
    const result = await query(
      `SELECT * FROM payment_sessions
       WHERE user_id = $1 AND plan_id = $2 AND billing_period = $3
         AND status = 'pending'
         AND (expires_at IS NULL OR expires_at > NOW())
       ORDER BY created_at DESC LIMIT 1`,
      [userId, planId, billingPeriod]
    )
    return result.rows[0] || null
  }

  /**
   * Create a new payment session.
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  async create(data) {
    const id = uuidv4()
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000) // 30 minutes

    const result = await query(
      `INSERT INTO payment_sessions
        (id, user_id, plan_id, billing_period, status, amount, idempotency_key, expires_at)
       VALUES ($1, $2, $3, $4, 'pending', $5, $6, $7)
       RETURNING *`,
      [
        id,
        data.userId,
        data.planId,
        data.billingPeriod,
        data.amount,
        data.idempotencyKey,
        expiresAt,
      ]
    )
    return result.rows[0]
  }

  /**
   * Update PayPlus identifiers after link generation.
   * @param {string} sessionId
   * @param {string} pageRequestUid
   * @returns {Promise<Object>}
   */
  async setPageRequestUid(sessionId, pageRequestUid) {
    const result = await query(
      `UPDATE payment_sessions SET payplus_page_request_uid = $1, updated_at = NOW()
       WHERE id = $2 RETURNING *`,
      [pageRequestUid, sessionId]
    )
    return result.rows[0]
  }

  /**
   * Find session by PayPlus page_request_uid (used by webhook).
   * @param {string} pageRequestUid
   * @returns {Promise<Object|null>}
   */
  async findByPageRequestUid(pageRequestUid) {
    const result = await query(
      `SELECT * FROM payment_sessions WHERE payplus_page_request_uid = $1 LIMIT 1`,
      [pageRequestUid]
    )
    return result.rows[0] || null
  }

  /**
   * Find session by ID.
   * @param {string} id
   * @returns {Promise<Object|null>}
   */
  async findById(id) {
    const result = await query(
      `SELECT * FROM payment_sessions WHERE id = $1`,
      [id]
    )
    return result.rows[0] || null
  }

  /**
   * Mark session as completed.
   * @param {string} sessionId
   * @param {string} [transactionUid] - PayPlus transaction UID
   * @returns {Promise<Object>}
   */
  async setCompleted(sessionId, transactionUid = null) {
    const result = await query(
      `UPDATE payment_sessions
       SET status = 'completed', payplus_transaction_uid = COALESCE($1, payplus_transaction_uid), updated_at = NOW()
       WHERE id = $2 RETURNING *`,
      [transactionUid, sessionId]
    )
    return result.rows[0]
  }

  /**
   * Mark session as failed.
   * @param {string} sessionId
   * @returns {Promise<Object>}
   */
  async setFailed(sessionId) {
    const result = await query(
      `UPDATE payment_sessions SET status = 'failed', updated_at = NOW()
       WHERE id = $1 RETURNING *`,
      [sessionId]
    )
    return result.rows[0]
  }

  /**
   * Expire old pending sessions (called by cleanup job or inline).
   * @returns {Promise<number>} count of expired sessions
   */
  async expireOldSessions() {
    const result = await query(
      `UPDATE payment_sessions SET status = 'expired', updated_at = NOW()
       WHERE status = 'pending' AND expires_at IS NOT NULL AND expires_at <= NOW()`
    )
    return result.rowCount
  }
}

export default new PaymentSessionModel()
