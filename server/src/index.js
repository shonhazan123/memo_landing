/**
 * Mimo Server - Entry Point
 * Express server with MVC architecture
 */

import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import session from 'express-session'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

// Get directory name for ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load environment variables - try server folder first, then project root
const serverEnvPath = path.resolve(__dirname, '../.env')
const rootEnvPath = path.resolve(__dirname, '../../.env')

// Try server folder first, fallback to project root
dotenv.config({ path: serverEnvPath })
dotenv.config({ path: rootEnvPath }) // This will not override existing variables

// Import routes
import authRoutes from './routes/auth.routes.js'
import userRoutes from './routes/user.routes.js'

// Create Express app
const app = express()
const PORT = process.env.SERVER_PORT || 3001

// ===========================================
// MIDDLEWARE
// ===========================================

// Security headers
app.use(helmet())

// CORS - Allow frontend (dev, preview, FRONTEND_URL, and production donnai.io)
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:4173',
  process.env.FRONTEND_URL,
  'https://www.donnai.io',
  'https://donnai.io'
].filter(Boolean)
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true)
    cb(null, false)
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

// Parse JSON bodies
app.use(express.json())

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }))

// Session middleware (for OAuth state)
app.use(session({
  secret: process.env.SESSION_SECRET || 'mimo-session-secret-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax', // Allows cookie on OAuth callback (GET redirect from Google)
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}))

// ===========================================
// ROUTES
// ===========================================

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// API routes
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)

// ===========================================
// ERROR HANDLING
// ===========================================

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err)
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
})

// ===========================================
// START SERVER (skip when running as Vercel serverless)
// ===========================================

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Mimo Server running on http://localhost:${PORT}`)
    console.log(`📡 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`)
  })
}

export default app

