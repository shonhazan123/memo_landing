/**
 * Payment Controller
 * Handles creating PayPlus payment links, subscription checks,
 * duplicate prevention via payment sessions, and webhook processing.
 */

import PayPlusService from '../services/payplus.service.js'
import SubscriptionService from '../services/subscription.service.js'
import UserModel from '../models/User.model.js'
import PaymentSessionModel from '../models/PaymentSession.model.js'
import processLogger from '../lib/processLogger.js'

// DB plan_type: free, standard, pro, business. Pricing UI sends planId: basic, pro, business (basic maps to standard).
const PLAN_RANK = { free: 0, standard: 1, basic: 1, pro: 2, business: 3 }
const ACTIVE_STATUSES = ['active', 'trial', 'cancelled_pending']

/** Map pricing planId to DB plan_type (basic -> standard). */
function planIdToDbPlan(planId) {
  return planId === 'basic' ? 'standard' : planId
}

class PaymentController {
  /**
   * POST /api/payment/create-link
   * Protected by requireAuth middleware — req.userId is always set.
   * Body: { planId: 'basic'|'pro'|'business', billingPeriod: 'monthly'|'annual' }
   */
  async createLink(req, res, next) {
    try {
      const { planId, billingPeriod } = req.body || {}

      if (!planId || !billingPeriod) {
        return res.status(400).json({
          error: 'Missing required fields',
          message: 'planId and billingPeriod are required',
        })
      }

      // ── Load user and subscription state ──
      const user = await UserModel.findById(req.userId)
      if (!user) {
        return res.status(404).json({ error: 'User not found' })
      }

      const currentPlan = user.plan_type || 'free'
      const currentStatus = user.subscription_status || 'active'
      const selectedPlanForDb = planIdToDbPlan(planId)

      // ── Same plan block (compare DB value: standard vs basic) ──
      if (
        currentPlan === selectedPlanForDb &&
        ACTIVE_STATUSES.includes(currentStatus)
      ) {
        return res.status(409).json({
          error: 'Duplicate subscription',
          message: 'יש לך כבר מנוי פעיל לתוכנית זו.',
        })
      }

      // ── Downgrade block (optional — prevent paying for a lower plan) ──
      if (
        ACTIVE_STATUSES.includes(currentStatus) &&
        (PLAN_RANK[selectedPlanForDb] ?? 0) < (PLAN_RANK[currentPlan] ?? 0)
      ) {
        return res.status(400).json({
          error: 'Downgrade not supported via payment',
          message: 'לא ניתן לשדרג לתוכנית נמוכה יותר דרך תשלום. פנה לתמיכה.',
        })
      }

      // ── Prevent duplicate pending sessions ──
      const existingSession = await PaymentSessionModel.findPendingSession(
        user.id,
        planId,
        billingPeriod
      )
      if (existingSession) {
        return res.status(409).json({
          error: 'Payment in progress',
          message: 'תהליך תשלום כבר פעיל עבור תוכנית זו. נסה שוב בעוד מספר דקות.',
        })
      }

      // ── Compute amount and create payment session ──
      const amount = PayPlusService.getChargeAmountForPlan(planId, billingPeriod)
      const idempotencyKey = `${user.id}_${planId}_${billingPeriod}_${Date.now()}`

      const session = await PaymentSessionModel.create({
        userId: user.id,
        planId,
        billingPeriod,
        amount,
        idempotencyKey,
      })

      // ── Generate PayPlus link ──
      const planName = PayPlusService.getPlanDisplayName(planId)
      const itemName = billingPeriod === 'annual' ? `${planName} (שנתי)` : planName

      const { payment_page_link, page_request_uid } =
        await PayPlusService.generatePaymentLink({
          amount,
          planName: itemName,
          billingPeriod,
          customerEmail: user.google_email || undefined,
          customerName: user.name || undefined,
          sessionId: session.id,
        })

      await PaymentSessionModel.setPageRequestUid(session.id, page_request_uid)

      processLogger.payment('link_created', {
        userId: user.id,
        planId,
        billingPeriod,
        amount,
        sessionId: session.id,
        pageRequestUid: page_request_uid,
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
   * POST /api/payment/webhook
   * PayPlus server-to-server callback (IPN / refURL_callback).
   * Verifies the payment and updates user subscription + payment session.
   * No auth middleware — verified by PayPlus secret or payload signature.
   */
  async webhook(req, res, next) {
    try {
      // Normalize payload: PayPlus may send POST JSON (body) or GET (query). Body might be raw string.
      let payload = req.body
      if (typeof payload === 'string' && payload.length > 0) {
        try {
          payload = JSON.parse(payload)
        } catch {
          payload = {}
        }
      }
      if (!payload || typeof payload !== 'object' || Object.keys(payload).length === 0) {
        payload = req.query || {}
      }

      const transaction = payload.transaction || {}
      const transactionUid = transaction.uid || payload.transaction_uid
      const pageRequestUid =
        transaction.payment_request_uid || payload.page_request_uid || payload.payment_request_uid
      const paymentStatus =
        transaction.status_code ?? payload.transaction?.status_code ?? payload.status_code
      const moreInfo1Raw = transaction.more_info_1 ?? payload.more_info_1
      const moreInfo1 = moreInfo1Raw != null ? String(moreInfo1Raw) : undefined

      processLogger.payment('webhook_received', {
        transactionUid,
        pageRequestUid,
        paymentStatus,
        paymentStatusType: typeof paymentStatus,
        moreInfo1,
        method: req.method,
      })

      // Verify webhook secret if configured
      const webhookSecret = process.env.PAYPLUS_WEBHOOK_SECRET
      if (webhookSecret) {
        const providedSecret =
          req.headers['x-payplus-secret'] ||
          req.headers['authorization']?.replace('Bearer ', '')
        if (providedSecret !== webhookSecret) {
          processLogger.payment('webhook_unauthorized', { providedSecret: '***' })
          return res.status(401).json({ error: 'Unauthorized' })
        }
      }

      // Find the payment session: by payment_request_uid first, then by more_info_1 (we send session id there)
      let session = null
      if (pageRequestUid) {
        session = await PaymentSessionModel.findByPageRequestUid(pageRequestUid)
      }
      if (!session && moreInfo1) {
        session = await PaymentSessionModel.findById(moreInfo1)
      }

      if (!session) {
        processLogger.payment('webhook_session_not_found', {
          pageRequestUid,
          moreInfo1,
          transactionUid,
        })
        return res.status(200).json({ ok: true, warning: 'Session not found' })
      }

      if (session.status === 'completed') {
        processLogger.payment('webhook_already_completed', { sessionId: session.id })
        return res.status(200).json({ ok: true, info: 'Already processed' })
      }

      const userId = session.user_id
      const user = await UserModel.findById(userId)
      if (!user) {
        processLogger.payment('webhook_user_not_found', { userId, sessionId: session.id })
        return res.status(200).json({ ok: true, warning: 'User not found' })
      }

      // PayPlus status_code: 000 or 0 = success (approved); accept string or number
      const statusStr = paymentStatus != null ? String(paymentStatus).trim() : ''
      const isSuccess =
        statusStr === '000' || statusStr === '0' || statusStr === '00' || paymentStatus === 0

      processLogger.payment('webhook_status_check', {
        sessionId: session.id,
        paymentStatus: statusStr || paymentStatus,
        isSuccess,
      })

      if (isSuccess) {
        // 1) Update user subscription (trial + period end)
        await UserModel.updateSubscription(userId, {
          subscription_status: 'trial',
          subscription_period_end: PayPlusService.getTrialFirstChargeDate(),
        })
        // 2) Update user plan to the paid plan
        const planTypeForDb = planIdToDbPlan(session.plan_id)
        await UserModel.update(userId, { plan_type: planTypeForDb })

        // Store recurring payment UID if present (PayPlus: transaction.recurring_charge_information.recurring_uid)
        const recurringPaymentUid =
          transaction.recurring_charge_information?.recurring_uid ||
          payload.recurring_payment?.uid
        if (recurringPaymentUid) {
          const settings = user.settings && typeof user.settings === 'object' ? user.settings : {}
          await UserModel.update(userId, {
            settings: {
              ...settings,
              recurring_payment_uid: recurringPaymentUid,
              first_charge_date: PayPlusService.getTrialFirstChargeDate(),
            },
          })
        }

        // 3) Mark payment session completed (so UI shows success, not pending)
        await PaymentSessionModel.setCompleted(session.id, transactionUid)
        processLogger.payment('webhook_success', {
          userId,
          sessionId: session.id,
          planId: session.plan_id,
          planTypeForDb,
          transactionUid,
        })
      } else {
        // Payment failed — do NOT change user plan
        await PaymentSessionModel.setFailed(session.id)
        processLogger.payment('webhook_failure', {
          userId,
          sessionId: session.id,
          paymentStatus,
          transactionUid,
        })
      }

      res.status(200).json({ ok: true })
    } catch (error) {
      processLogger.error('payment.webhook', error, { body: req.body })
      res.status(200).json({ ok: true, error: 'Internal error logged' })
    }
  }

  /**
   * POST /api/payment/callback
   * Internal or legacy callback: set trial or active after payment.
   * Body: { userId, status: 'success'|'failure', recurringPaymentUid? }
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
