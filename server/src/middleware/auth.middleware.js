/**
 * Auth Middleware
 * Protects routes that require authentication
 */

import AuthService from '../services/auth.service.js'

/**
 * Require authentication middleware
 * Verifies JWT token and attaches user info to request
 */
export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication required' })
    }
    
    const token = authHeader.split(' ')[1]
    const decoded = AuthService.verifyJWT(token)
    
    if (!decoded) {
      return res.status(401).json({ error: 'Invalid or expired token' })
    }
    
    // Attach user info to request
    req.userId = decoded.userId
    req.userEmail = decoded.email
    req.userPlanType = decoded.planType
    
    next()
  } catch (error) {
    return res.status(401).json({ error: 'Authentication failed' })
  }
}

/**
 * Optional authentication middleware
 * Attaches user info if token is provided, but doesn't require it
 */
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1]
      const decoded = AuthService.verifyJWT(token)
      
      if (decoded) {
        req.userId = decoded.userId
        req.userEmail = decoded.email
        req.userPlanType = decoded.planType
      }
    }
    
    next()
  } catch (error) {
    // Continue without auth
    next()
  }
}

export default { requireAuth, optionalAuth }

