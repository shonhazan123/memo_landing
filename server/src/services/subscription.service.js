/**
 * Subscription Service
 * Single responsibility: subscription state, cancel-at-period-end, period-end revocation, access check.
 * All subscription logic goes here for clear debugging and tracking (uses processLogger).
 */

import UserModel from '../models/User.model.js'
import PayPlusService from './payplus.service.js'
import processLogger from '../lib/processLogger.js'

const VALID_ACTIVE_STATUSES = ['active', 'trial', 'cancelled_pending']

/**
 * Check if the user has paid access (including trial and cancelled-pending until period end).
 * @param {Object} user - User record with subscription_status, subscription_period_end
 * @returns {boolean}
 */
function hasPaidAccess(user) {
  if (!user) return false
  const status = user.subscription_status || 'active'
  if (VALID_ACTIVE_STATUSES.includes(status)) {
    if (status === 'cancelled_pending') {
      const end = user.subscription_period_end
      if (!end) return true // no period end set, keep access until set
      return new Date(end) >= new Date(new Date().toISOString().slice(0, 10))
    }
    return true
  }
  return false
}

/**
 * Cancel subscription: set cancel_at_period_end, cancel recurring in PayPlus. Do not delete user.
 * @param {string} userId - User UUID
 * @param {string|null} recurringPaymentUid - PayPlus recurring_payment_uid from settings (if any)
 * @returns {Promise<{ subscriptionPeriodEnd: string|null, cancelAtPeriodEnd: boolean }>}
 */
async function cancelSubscription(userId, recurringPaymentUid = null) {
  const user = await UserModel.findById(userId)
  if (!user) {
    processLogger.error('subscription.cancel', new Error('User not found'), { userId })
    throw new Error('User not found')
  }

  await UserModel.setCancelAtPeriodEnd(userId)
  processLogger.subscription('cancel', {
    userId,
    subscriptionStatus: user.subscription_status,
    subscriptionPeriodEnd: user.subscription_period_end,
    cancelAtPeriodEnd: true,
  })

  if (recurringPaymentUid && typeof PayPlusService.cancelRecurring === 'function') {
    try {
      await PayPlusService.cancelRecurring(recurringPaymentUid)
      processLogger.payment('recurring_cancelled', { userId, recurringPaymentUid })
    } catch (err) {
      processLogger.error('subscription.cancel_payplus', err, { userId })
      // Do not throw: DB state is correct; PayPlus can be retried or manual
    }
  }

  const updated = await UserModel.findById(userId)
  return {
    subscriptionPeriodEnd: updated?.subscription_period_end ?? user.subscription_period_end,
    cancelAtPeriodEnd: true,
  }
}

/**
 * Revoke access for users whose cancel_at_period_end is true and subscription_period_end <= today.
 * Called by daily job; does not charge.
 * @returns {Promise<{ processedCount: number, userIds: string[] }>}
 */
async function revokeExpiredCancellations() {
  const users = await UserModel.findUsersForPeriodEndRevocation()
  const userIds = []

  for (const u of users) {
    try {
      await UserModel.updateSubscription(u.id, {
        subscription_status: 'no_access',
        cancel_at_period_end: false,
      })
      userIds.push(u.id)
      processLogger.subscription('revoke_at_period_end', {
        userId: u.id,
        subscriptionPeriodEnd: u.subscription_period_end,
      })
    } catch (err) {
      processLogger.error('job.period_end_revocation', err, { userId: u.id })
    }
  }

  if (userIds.length > 0) {
    processLogger.job('period_end_revocation', { processedCount: userIds.length, userIds })
  }

  return { processedCount: userIds.length, userIds }
}

/**
 * Set user to trial: subscription_status = 'trial', subscription_period_end = firstChargeDate (e.g. today + 14).
 * @param {string} userId - User UUID
 * @param {string} firstChargeDate - ISO date 'YYYY-MM-DD'
 * @param {Object} [options] - optional: { mergeSettings: { key: value } } to merge into user settings (e.g. first_charge_date)
 * @returns {Promise<UserRecord>}
 */
async function setTrial(userId, firstChargeDate, options = {}) {
  const updates = {
    subscription_status: 'trial',
    subscription_period_end: firstChargeDate,
  }
  let user = await UserModel.updateSubscription(userId, updates)
  if (options.mergeSettings && typeof options.mergeSettings === 'object') {
    const current = user.settings && typeof user.settings === 'object' ? user.settings : {}
    const next = { ...current, ...options.mergeSettings }
    await UserModel.update(userId, { settings: next })
    user = await UserModel.findById(userId)
  }
  processLogger.subscription('trial_started', {
    userId,
    subscriptionPeriodEnd: firstChargeDate,
  })
  return user
}

/**
 * Set subscription to active (e.g. after first charge callback) and set next period end.
 * @param {string} userId - User UUID
 * @param {string} nextPeriodEnd - ISO date 'YYYY-MM-DD'
 * @returns {Promise<UserRecord>}
 */
async function setActive(userId, nextPeriodEnd) {
  await UserModel.updateSubscription(userId, {
    subscription_status: 'active',
    subscription_period_end: nextPeriodEnd,
    cancel_at_period_end: false,
  })
  processLogger.subscription('active_after_charge', { userId, subscriptionPeriodEnd: nextPeriodEnd })
  return UserModel.findById(userId)
}

/**
 * Set subscription to no_access (e.g. payment failed webhook). Do not delete user.
 * @param {string} userId - User UUID
 * @param {string} [reason] - 'payment_failed' or 'revoked'
 * @returns {Promise<UserRecord>}
 */
async function setNoAccess(userId, reason = 'revoked') {
  const status = reason === 'payment_failed' ? 'payment_failed' : 'no_access'
  await UserModel.updateSubscription(userId, { subscription_status: status })
  processLogger.subscription('no_access', { userId, reason })
  return UserModel.findById(userId)
}

export default {
  hasPaidAccess,
  cancelSubscription,
  revokeExpiredCancellations,
  setTrial,
  setActive,
  setNoAccess,
}
