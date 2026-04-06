/**
 * Safe redirect path validation for post-auth navigation.
 * Prevents open-redirect attacks by allowlisting internal paths.
 */

const ALLOWED_PREFIXES = ['/settings', '/pricing']

/**
 * Validate and return a safe internal redirect path, or null.
 * @param {string|null|undefined} raw - The raw redirect value from a query param.
 * @returns {string|null}
 */
export function getSafeRedirectPath(raw) {
  if (typeof raw !== 'string') return null

  const trimmed = raw.trim()

  if (!trimmed.startsWith('/') || trimmed.startsWith('//') || trimmed.includes('://')) {
    return null
  }

  const pathname = trimmed.split('?')[0].split('#')[0]
  if (ALLOWED_PREFIXES.some(prefix => pathname === prefix || pathname.startsWith(prefix + '/'))) {
    return trimmed
  }

  return null
}
