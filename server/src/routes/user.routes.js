/**
 * User Routes
 * /api/users endpoints
 */

import { Router } from 'express'
import UserController from '../controllers/user.controller.js'
import { requireAuth, optionalAuth } from '../middleware/auth.middleware.js'

const router = Router()

// GET /api/users/me - Get current user profile (requires auth)
router.get('/me', requireAuth, UserController.getProfile.bind(UserController))

// POST /api/users/check-phone - Check if user exists and Google status (public)
router.post('/check-phone', UserController.checkPhone.bind(UserController))

// PUT /api/users/me/phone - Update phone number (requires auth)
router.put('/me/phone', requireAuth, UserController.updatePhone.bind(UserController))

// POST /api/users/me/complete-onboarding - Complete onboarding (requires auth)
router.post('/me/complete-onboarding', requireAuth, UserController.completeOnboarding.bind(UserController))

// GET /api/users/whatsapp-info - Get WhatsApp info (public)
router.get('/whatsapp-info', UserController.getWhatsAppInfo.bind(UserController))

export default router

