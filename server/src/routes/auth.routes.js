/**
 * Auth Routes
 * /api/auth endpoints
 */

import { Router } from 'express'
import AuthController from '../controllers/auth.controller.js'

const router = Router()

// GET /api/auth/google - Initiate Google OAuth
router.get('/google', AuthController.initiateGoogleAuth.bind(AuthController))

// GET /api/auth/google/callback - Handle Google OAuth callback
router.get('/google/callback', AuthController.handleGoogleCallback.bind(AuthController))

// GET /api/auth/me - Get current user (requires auth)
router.get('/me', AuthController.getCurrentUser.bind(AuthController))

// POST /api/auth/refresh - Refresh Google tokens
router.post('/refresh', AuthController.refreshToken.bind(AuthController))

// POST /api/auth/logout - Sign out
router.post('/logout', AuthController.logout.bind(AuthController))

// GET /api/auth/verify - Verify token validity
router.get('/verify', AuthController.verifyToken.bind(AuthController))

export default router

