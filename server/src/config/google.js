/**
 * Google OAuth Configuration
 */

import { google } from 'googleapis'
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

// Google OAuth credentials
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || process.env.VITE_GOOGLE_CLIENT_SECRET
export const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || process.env.VITE_GOOGLE_REDIRECT_URI || 'http://localhost:3001/api/auth/google/callback'

// Validate Google OAuth credentials
if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  console.warn('⚠️ Google OAuth credentials not found.')
  console.warn('   Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in your .env file')
  console.warn('   Get credentials from: https://console.cloud.google.com/apis/credentials')
}

// OAuth scopes based on plan type
export const SCOPES = {
  base: [
    'openid',
    'email',
    'profile'
  ],
  calendar: [
    'https://www.googleapis.com/auth/calendar'
  ],
  gmail: [
    'https://www.googleapis.com/auth/gmail.modify',
    'https://www.googleapis.com/auth/gmail.send'
  ]
}

/**
 * Get scopes based on user plan type
 * @param {string} planType - 'free' | 'standard' | 'pro'
 * @returns {string[]} Array of OAuth scopes
 */
export const getScopesForPlan = (planType = 'standard') => {
  const scopes = [...SCOPES.base]
  
  switch (planType) {
    case 'pro':
      scopes.push(...SCOPES.calendar, ...SCOPES.gmail)
      break
    case 'standard':
      scopes.push(...SCOPES.calendar)
      break
    case 'free':
    default:
      // Only base scopes
      break
  }
  
  return scopes
}

/**
 * Create a new OAuth2 client
 * @returns {google.auth.OAuth2} OAuth2 client
 * @throws {Error} If Google OAuth credentials are missing
 */
export const createOAuth2Client = () => {
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    throw new Error(
      'Google OAuth credentials are missing. ' +
      'Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in your .env file. ' +
      'Get credentials from: https://console.cloud.google.com/apis/credentials'
    )
  }
  
  return new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI
  )
}

export default {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI,
  SCOPES,
  getScopesForPlan,
  createOAuth2Client
}

