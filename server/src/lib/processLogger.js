/**
 * Process / Audit Logger
 * Single place to log validation, subscription, and payment-related operations
 * for debugging and tracking. Use in services and jobs; do not log secrets.
 */

const PREFIX = '[Mimo]'

function formatPayload(action, meta = {}) {
  const timestamp = new Date().toISOString()
  return { timestamp, action, ...meta }
}

function log(level, action, meta = {}) {
  const payload = formatPayload(action, meta)
  const msg = `${PREFIX} ${action}`
  if (level === 'error') {
    console.error(msg, payload)
  } else if (level === 'warn') {
    console.warn(msg, payload)
  } else {
    console.log(msg, payload)
  }
}

export const processLogger = {
  /**
   * Log user validation / auth-related steps (e.g. check-phone, token verify).
   * @param {string} action - e.g. 'validation.check_phone', 'validation.token_verify'
   * @param {Object} meta - { userId?, phoneNumber?, isNewUser?, registered? }
   */
  validation(action, meta = {}) {
    log('info', `validation.${action}`, meta)
  },

  /**
   * Log subscription state changes: cancel, period-end revocation, trial start.
   * @param {string} action - e.g. 'subscription.cancel', 'subscription.revoke_at_period_end', 'subscription.trial_started'
   * @param {Object} meta - { userId, subscriptionStatus?, subscriptionPeriodEnd?, cancelAtPeriodEnd? }
   */
  subscription(action, meta = {}) {
    log('info', `subscription.${action}`, meta)
  },

  /**
   * Log payment / PayPlus events: link_created, callback_success, callback_failure, recurring_cancelled.
   * @param {string} action - e.g. 'payment.link_created', 'payment.callback_success', 'payment.recurring_cancelled'
   * @param {Object} meta - { userId?, planId?, amount?, pageRequestUid? } — no card data
   */
  payment(action, meta = {}) {
    log('info', `payment.${action}`, meta)
  },

  /**
   * Log job/scheduled task runs (e.g. period-end revocation cron).
   * @param {string} action - e.g. 'job.period_end_revocation'
   * @param {Object} meta - { processedCount?, userIds? }
   */
  job(action, meta = {}) {
    log('info', `job.${action}`, meta)
  },

  /**
   * Log errors in validation/subscription/payment flow (no stack in production if desired).
   * @param {string} context - e.g. 'subscription.cancel', 'payment.callback'
   * @param {Error|string} err
   * @param {Object} meta - { userId? }
   */
  error(context, err, meta = {}) {
    const message = err instanceof Error ? err.message : String(err)
    log('error', `error.${context}`, { ...meta, message })
  },
}

export default processLogger
