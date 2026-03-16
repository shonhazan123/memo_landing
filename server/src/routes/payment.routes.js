/**
 * Payment Routes
 * /api/payment - PayPlus payment link generation, webhook, callbacks
 */

import { Router } from 'express'
import PaymentController from '../controllers/payment.controller.js'
import { requireAuth } from '../middleware/auth.middleware.js'

const router = Router()

// POST /api/payment/create-link - Create PayPlus payment page link (requires auth)
router.post('/create-link', requireAuth, PaymentController.createLink.bind(PaymentController))

// POST /api/payment/redeem-code - Validate promo code and grant Pro plan (requires auth)
router.post('/redeem-code', requireAuth, PaymentController.redeemCode.bind(PaymentController))

// PayPlus server-to-server webhook (GET or POST; no auth — verified by secret if set)
router.get('/webhook', PaymentController.webhook.bind(PaymentController))
router.post('/webhook', PaymentController.webhook.bind(PaymentController))

// POST /api/payment/callback - Internal payment result callback (set trial / no_access)
router.post('/callback', PaymentController.callback.bind(PaymentController))

export default router
