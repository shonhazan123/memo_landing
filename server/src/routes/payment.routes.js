/**
 * Payment Routes
 * /api/payment - PayPlus payment link generation
 */

import { Router } from 'express'
import PaymentController from '../controllers/payment.controller.js'

const router = Router()

// POST /api/payment/create-link - Create PayPlus payment page link for pricing plan
router.post('/create-link', PaymentController.createLink.bind(PaymentController))

// POST /api/payment/callback - Payment result callback (set trial / no_access)
router.post('/callback', PaymentController.callback.bind(PaymentController))

export default router
