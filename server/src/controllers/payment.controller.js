/**
 * Payment Controller
 * Handles creating PayPlus payment links for pricing page purchases and payment callbacks.
 */

import PayPlusService from '../services/payplus.service.js'
import SubscriptionService from '../services/subscription.service.js'
import UserModel from '../models/User.model.js'
import processLogger from '../lib/processLogger.js'

class PaymentController {
  /**
   * POST /api/payment/create-link
   * Create a PayPlus payment page link for the selected plan.
   * Body: { planId: 'basic'|'pro'|'business', billingPeriod: 'monthly'|'annual', customerEmail?, customerName? }
   */
  async createLink(req, res, next) {
    try {
      const { planId, billingPeriod, customerEmail, customerName } = req.body || {}

      if (!planId || !billingPeriod) {
        return res.status(400).json({
          error: 'Missing required fields',
          message: 'planId and billingPeriod are required',
        })
      }

      const amount = PayPlusService.getAmountForPlan(planId, billingPeriod)
      const planName = PayPlusService.getPlanDisplayName(planId)

      const { payment_page_link, page_request_uid } =
        await PayPlusService.generatePaymentLink({
          amount,
          planName,
          customerEmail: customerEmail || undefined,
          customerName: customerName || undefined,
        })

      res.json({
        paymentPageLink: payment_page_link,
        pageRequestUid: page_request_uid,
        amount,
        planName,
      })
    } catch (error) {
      if (error.message?.includes('not configured')) {
        return res.status(503).json({
          error: 'Payment service unavailable',
          message: error.message,
        })
      }
      if (error.message?.includes('Invalid')) {
        return res.status(400).json({
          error: 'Bad request',
          message: error.message,
        })
      }
      next(error)
    }
  }

  /**
   * POST /api/payment/callback
   * PayPlus or internal callback: set trial or active after payment. Body: { userId, status: 'success'|'failure', recurringPaymentUid? }.
   * On success: set trial (subscription_status=trial, subscription_period_end=today+14). On failure: set no_access.
   */
  async callback(req, res, next) {
    try {
      const { userId, status, recurringPaymentUid } = req.body || {}
      if (!userId || !status) {
        return res.status(400).json({ error: 'userId and status required' })
      }

      const user = await UserModel.findById(userId)
      if (!user) {
        return res.status(404).json({ error: 'User not found' })
      }

      if (status === 'success') {
        const firstChargeDate = PayPlusService.getTrialFirstChargeDate()
        await SubscriptionService.setTrial(userId, firstChargeDate, {
          mergeSettings: { first_charge_date: firstChargeDate },
        })
        if (recurringPaymentUid) {
          const settings = user.settings && typeof user.settings === 'object' ? user.settings : {}
          await UserModel.update(userId, { settings: { ...settings, recurring_payment_uid: recurringPaymentUid } })
        }
        processLogger.payment('callback_success', { userId, recurringPaymentUid })
      } else {
        await SubscriptionService.setNoAccess(userId, 'payment_failed')
        processLogger.payment('callback_failure', { userId })
      }

      res.json({ ok: true })
    } catch (error) {
      next(error)
    }
  }
}

export default new PaymentController()
