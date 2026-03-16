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
 * Uses recurring_settings so monthly = charge every 1 month, annual = charge every 12 months.
 * @param {Object} options
 * @param {number} options.amount - Amount in ILS (per charge: monthly = 1 month, annual = full year)
 * @param {string} options.planName - Display name for the plan (e.g. "בסיסי")
 * @param {string} options.billingPeriod - 'monthly' | 'annual' (sets recurring interval)
 * @param {string} [options.customerEmail] - Customer email (optional)
 * @param {string} [options.customerName] - Customer name (optional)
 * @param {string} [options.sessionId] - Payment session ID for webhook correlation
 * @returns {Promise<{ payment_page_link: string, page_request_uid: string }>}
 */
async function generatePaymentLink({ amount, planName, billingPeriod, customerEmail, customerName, sessionId }) {
  const apiKey = process.env.PAYPLUS_API_KEY
  const secretKey = process.env.PAYPLUS_SECRET_KEY
  const paymentPageUid = process.env.PAYPLUS_PAGE_UID

  if (!apiKey || !secretKey || !paymentPageUid) {
    throw new Error(
      'PayPlus is not configured. Set PAYPLUS_API_KEY, PAYPLUS_SECRET_KEY, and PAYPLUS_PAGE_UID in .env'
    )
  }

  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'
  // Hardcoded production backend URL for PayPlus webhook callback (same host as create-link).
  const backendUrl = 'https://donnai.io'

  const chargeMethod = 3 // Recurring

  // recurring_type 2 = monthly; recurring_range 1 = every 1 month, 12 = every 12 months (yearly)
  const recurringRange = billingPeriod === 'annual' ? 12 : 1

  const body = {
    payment_page_uid: paymentPageUid,
    charge_method: chargeMethod,
    amount: Number(amount),
    currency_code: 'ILS',
    sendEmailApproval: true,
    sendEmailFailure: true,
    language_code: 'he',
    refURL_success: `${frontendUrl}/pricing?payment=success`,
    refURL_failure: `${frontendUrl}/pricing?payment=failure`,
    refURL_cancel: `${frontendUrl}/pricing?payment=cancel`,
    refURL_callback: `${backendUrl}/api/payment/webhook`,
    more_info: `${planName}-${amount}`.slice(0, 19),
    items: [
      {
        name: planName,
        quantity: 1,
        value: Math.round(amount * 100),
        price: amount,
      },
    ],
    customer: {
      customer_name: customerName || 'לקוח',
      email: customerEmail || 'guest@test.local',
    },
    recurring_settings: {
      instant_first_payment: false,
      recurring_type: 2, // monthly
      recurring_range: recurringRange, // 1 = every month, 12 = every 12 months (yearly)
      number_of_charges: 0, // unlimited
      start_date_on_payment_date: true,
      start_date: 1, // day of month when start_date_on_payment_date is used
      jump_payments: 14, // 14 days free trial before first charge
      successful_invoice: false,
      customer_failure_email: true,
      send_customer_success_email: true,
    },
  }

  if (sessionId) {
    body.more_info_1 = sessionId
  }

  const url ='https://restapidev.payplus.co.il/api/v1.0/PaymentPages/generateLink'
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
 * Get amount in ILS for a plan and billing period (per-month rate).
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
 * Get the charge amount to send to PayPlus: monthly = per-month price, annual = full year total (12 × per-month).
 * @param {string} planId - 'basic' | 'pro' | 'business'
 * @param {string} billingPeriod - 'monthly' | 'annual'
 * @returns {number}
 */
function getChargeAmountForPlan(planId, billingPeriod) {
  const perMonth = getAmountForPlan(planId, billingPeriod)
  if (billingPeriod === 'annual') return perMonth * 12
  return perMonth
}

/**
 * Get display name for plan ID.
 */
function getPlanDisplayName(planId) {
  const names = { basic: 'בסיסי', pro: 'מקצועי', business: 'עסקי' }
  return names[planId] || planId
}

/**
 * Cancel a recurring payment in PayPlus so no future charges occur.
 * Requires PAYPLUS_TERMINAL_UID when PayPlus expects it in the body.
 * @param {string} recurringPaymentUid - PayPlus recurring_payment_uid (from user settings or callback)
 * @returns {Promise<void>}
 */
async function cancelRecurring(recurringPaymentUid) {
  const apiKey = process.env.PAYPLUS_API_KEY
  const secretKey = process.env.PAYPLUS_SECRET_KEY
  const terminalUid = process.env.PAYPLUS_TERMINAL_UID

  if (!apiKey || !secretKey) {
    throw new Error('PayPlus is not configured')
  }
  const baseUrl = getPayPlusBaseUrl()
  const url = `${baseUrl}RecurringPayments/DeleteRecurring/${recurringPaymentUid}`

  const body = {}
  if (terminalUid) body.terminal_uid = terminalUid

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
    const description = data?.results?.description || data?.message
    throw new Error(description || `PayPlus cancel recurring failed: ${response.status}`)
  }

  if (data?.results?.status !== 'success') {
    throw new Error(data?.results?.description || 'Failed to cancel recurring payment')
  }
}

/**
 * Compute first charge date for 14-day trial (today + 14 days, ISO date string).
 * @returns {string} 'YYYY-MM-DD'
 */
function getTrialFirstChargeDate() {
  const d = new Date()
  d.setDate(d.getDate() + 14)
  return d.toISOString().slice(0, 10)
}

export default {
  generatePaymentLink,
  getAmountForPlan,
  getChargeAmountForPlan,
  getPlanDisplayName,
  getTrialFirstChargeDate,
  cancelRecurring,
  PLAN_AMOUNTS,
}
