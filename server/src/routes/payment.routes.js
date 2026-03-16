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

// POST /api/payment/webhook - PayPlus server-to-server webhook (no auth — verified by secret)
router.post('/webhook', PaymentController.webhook.bind(PaymentController))

// POST /api/payment/callback - Internal payment result callback (set trial / no_access)
router.post('/callback', PaymentController.callback.bind(PaymentController))

export default router
