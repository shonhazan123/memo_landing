/**
 * Vercel serverless handler: all /api/* requests are rewritten here (see vercel.json).
 * Restores the original path (passed as query param by rewrite) so Express routing works.
 */
import app from '../server/src/index.js'

export default (req, res) => {
  const path = req.query.path
  if (path != null) {
    const pathStr = Array.isArray(path) ? path.join('/') : path
    const query = { ...req.query }
    delete query.path
    const qs = Object.keys(query).length ? '?' + new URLSearchParams(query).toString() : ''
    req.url = '/api/' + pathStr + qs
  }
  app(req, res)
}
