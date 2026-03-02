/**
 * Payment Controller
 * Handles creating PayPlus payment links for pricing page purchases.
 */

import PayPlusService from '../services/payplus.service.js'

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
}

export default new PaymentController()
