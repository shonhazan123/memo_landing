/**
 * Period-end revocation job
 * Run daily: revoke access for users who cancelled and whose subscription_period_end <= today.
 * Single responsibility: call subscription.service.revokeExpiredCancellations and log.
 */

import SubscriptionService from '../services/subscription.service.js'
import processLogger from '../lib/processLogger.js'

export async function runPeriodEndRevocation() {
  try {
    const { processedCount, userIds } = await SubscriptionService.revokeExpiredCancellations()
    return { processedCount, userIds }
  } catch (err) {
    processLogger.error('job.period_end_revocation', err, {})
    throw err
  }
}
