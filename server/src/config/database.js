/**
 * Database Configuration
 * Direct PostgreSQL connection (no Supabase API keys needed)
 */

import pg from 'pg'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const { Pool } = pg

// Get directory name for ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load environment variables - try server folder first, then project root
const serverEnvPath = path.resolve(__dirname, '../.env')
const rootEnvPath = path.resolve(__dirname, '../../.env')

dotenv.config({ path: serverEnvPath })
dotenv.config({ path: rootEnvPath }) // This will not override existing variables

// Database connection configuration
const dbConfig = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'postgres',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
}

// Validate database credentials
if (!dbConfig.host || !dbConfig.user || !dbConfig.password) {
  console.warn('⚠️ Database credentials not found.')
  console.warn('   Please set DB_HOST, DB_USER, and DB_PASSWORD in your .env file')
}

// Create connection pool
let pool = null

try {
  pool = new Pool(dbConfig)
  console.log('✅ Database connection pool created successfully')
  
  // Test connection
  pool.query('SELECT NOW()', (err, res) => {
    if (err) {
      console.error('❌ Database connection test failed:', err.message)
    } else {
      console.log('✅ Database connection test successful')
    }
  })
} catch (error) {
  console.error('❌ Failed to create database pool:', error.message)
  pool = null
}

/**
 * Execute a query
 * @param {string} text - SQL query
 * @param {any[]} params - Query parameters
 * @returns {Promise<{rows: any[], rowCount: number}>}
 */
export const query = async (text, params) => {
  if (!pool) {
    throw new Error('Database pool not initialized. Please check your DB credentials in .env file')
  }
  
  try {
    const result = await pool.query(text, params)
    return result
  } catch (error) {
    console.error('Database query error:', error)
    throw error
  }
}

/**
 * Get a client from the pool for transactions
 * @returns {Promise<pg.PoolClient>}
 */
export const getClient = async () => {
  if (!pool) {
    throw new Error('Database pool not initialized. Please check your DB credentials in .env file')
  }
  
  return await pool.connect()
}

export default pool
