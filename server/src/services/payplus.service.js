/**
 * PayPlus Payment Page Service
 * Generates payment links via PayPlus PaymentPages/generateLink API.
 * @see https://docs.payplus.co.il/reference/post_paymentpages-generatelink
 * @see https://www.payplus.co.il/faq/.../איך-פונים-אל-דף-תשלום-באמצעות-API
 */

// Staging (test) – use during testing period. Production only when PAYPLUS_BASE_URL is set.
// Staging: https://restapidev.payplus.co.il/api/v1.0/PaymentPages/generateLink
const PAYPLUS_PRODUCTION_URL = 'https://restapi.payplus.co.il/api/v1.0'
const PAYPLUS_STAGING_URL = 'https://restapidev.payplus.co.il/api/v1.0'

function getPayPlusBaseUrl() {
  // Explicit override (use for production when ready)
  if (process.env.PAYPLUS_BASE_URL) return process.env.PAYPLUS_BASE_URL
  // Default: staging during testing period. Set PAYPLUS_BASE_URL to production URL when going live.
  return PAYPLUS_STAGING_URL
}

/** Plan IDs and amounts (ILS) - source of truth for pricing. */
const PLAN_AMOUNTS = {
  monthly: { basic: 21, pro: 28, business: 42 },
  annual: { basic: 15, pro: 20, business: 30 },
}

/**
 * Generate a PayPlus payment page link.
 * @param {Object} options
 * @param {number} options.amount - Amount in ILS
 * @param {string} options.planName - Display name for the plan (e.g. "בסיסי")
 * @param {string} [options.customerEmail] - Customer email (optional)
 * @param {string} [options.customerName] - Customer name (optional)
 * @returns {Promise<{ payment_page_link: string, page_request_uid: string }>}
 */
async function generatePaymentLink({ amount, planName, customerEmail, customerName }) {
  const apiKey = process.env.PAYPLUS_API_KEY
  const secretKey = process.env.PAYPLUS_SECRET_KEY
  const paymentPageUid = process.env.PAYPLUS_PAGE_UID

  if (!apiKey || !secretKey || !paymentPageUid) {
    throw new Error(
      'PayPlus is not configured. Set PAYPLUS_API_KEY, PAYPLUS_SECRET_KEY, and PAYPLUS_PAGE_UID in .env'
    )
  }

  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'

  // charge_method: 1 = regular charge (J4). Use 0 for card check only (J2) in staging if needed.
  const chargeMethod = process.env.PAYPLUS_CHARGE_METHOD
    ? Number(process.env.PAYPLUS_CHARGE_METHOD)
    : 1

  const body = {
    payment_page_uid: paymentPageUid,
    charge_method: chargeMethod,
    amount: Number(amount),
    currency_code: 'ILS',
    sendEmailApproval: true,
    sendEmailFailure: false,
    language_code: 'he',
    refURL_success: `${frontendUrl}/pricing?payment=success`,
    refURL_failure: `${frontendUrl}/pricing?payment=failure`,
    refURL_cancel: `${frontendUrl}/pricing?payment=cancel`,
    // more_info (up to 19 chars) - for order/plan tracking in callbacks
    more_info: `${planName}-${amount}`.slice(0, 19),
    items: [
      {
        name: planName,
        quantity: 1,
        value: Math.round(amount * 100), // value in agorot
        price: amount,
      },
    ],
    // PayPlus FAQ: customer (customer_name + email) required for invoice/receipt; send minimal for compatibility
    customer: {
      customer_name: customerName || 'לקוח',
      email: customerEmail || 'guest@test.local',
    },
  }

  const url = `https://restapidev.payplus.co.il/api/v1.0/PaymentPages/generateLink`
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': apiKey,
      'secret-key': secretKey,
    },
    body: JSON.stringify(body),
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    // Log full response in dev to debug 403 (do not log request headers – they contain secrets)
    if (process.env.NODE_ENV !== 'production') {
      console.error('[PayPlus]', response.status, response.statusText, 'Response body:', JSON.stringify(data))
    }
    // 403 = wrong credentials or using production credentials with staging URL (or vice versa)
    const description = data?.results?.description || data?.message
    const code = data?.results?.code
    const detail = description ? `${description}${code != null ? ` (code ${code})` : ''}` : `HTTP ${response.status}`
    const hint = response.status === 403
      ? ' Check: (1) Use staging API KEY + SECRET + PAGE_UID with staging URL. (2) No extra spaces in .env values.'
      : ''
    throw new Error(`PayPlus error ${response.status}: ${detail}.${hint}`)
  }

  if (data?.results?.status !== 'success' || !data?.data?.payment_page_link) {
    throw new Error(data?.results?.description || 'Failed to generate payment link')
  }

  return {
    payment_page_link: data.data.payment_page_link,
    page_request_uid: data.data.page_request_uid,
  }
}

/**
 * Get amount in ILS for a plan and billing period.
 * @param {string} planId - 'basic' | 'pro' | 'business'
 * @param {string} billingPeriod - 'monthly' | 'annual'
 * @returns {number}
 */
function getAmountForPlan(planId, billingPeriod) {
  const period = PLAN_AMOUNTS[billingPeriod]
  if (!period) throw new Error('Invalid billing period')
  const amount = period[planId]
  if (amount == null) throw new Error('Invalid plan')
  return amount
}

/**
 * Get display name for plan ID.
 */
function getPlanDisplayName(planId) {
  const names = { basic: 'בסיסי', pro: 'מקצועי', business: 'עסקי' }
  return names[planId] || planId
}

export default {
  generatePaymentLink,
  getAmountForPlan,
  getPlanDisplayName,
  PLAN_AMOUNTS,
}
