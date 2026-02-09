/**
 * Vercel serverless catch-all: forwards all /api/* requests to the Express app.
 * Used only when deploying to Vercel; locally the server runs via node server/src/index.js.
 */
import app from '../server/src/index.js'

export default (req, res) => app(req, res)
