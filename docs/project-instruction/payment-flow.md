# Payment Flow (PayPlus)

## Overview

When a user clicks the purchase/try button on a pricing plan (Pricing page), they are sent to **PayPlus** hosted payment page. The flow uses [PayPlus PaymentPages Generate Link API](https://docs.payplus.co.il/reference/post_paymentpages-generatelink).

**Key principles:**

- The user **must be authenticated** before initiating a payment.
- The backend **checks the user's current plan** and blocks duplicate or invalid purchases.
- A **payment session** is created to prevent duplicate charges.
- The user's plan is **only updated after a confirmed webhook** from PayPlus — never on frontend redirect.

## Flow

1. **User** selects a plan (בסיסי / מקצועי / עסקי) and billing period (חודשי / שנתי) on `/pricing`.
2. **User** clicks the CTA button ("נסה בחינם").
3. **Frontend** checks `isAuthenticated` (from `AuthContext`):
   - If **not authenticated**: redirects to `/signup?returnTo=/pricing?plan=<planId>&billing=<period>`. After login/signup, the user returns to `/pricing` with the plan pre-selected.
   - If **authenticated**: calls `POST /api/payment/create-link` with `{ planId, billingPeriod }`.
4. **Backend** (`requireAuth` middleware verifies JWT):
   a. Validates `planId` and `billingPeriod`.
   b. Loads user from DB and checks current `plan_type` and `subscription_status`.
   c. **Same plan block**: request sends `planId` (basic/pro/business); backend maps `basic` → `standard` for DB comparison. If `user.plan_type === selectedPlanForDb` and subscription is active/trial/cancelled_pending, returns **409** with message.
   d. **Downgrade block**: if selected plan rank < current plan rank, returns **400**.
   e. **Duplicate session check**: if a pending payment session already exists for this user+plan+period, returns **409**.
   f. Creates a `payment_sessions` row with `status = 'pending'`, generates an idempotency key.
   g. Calls PayPlus `PaymentPages/generateLink` with amount, plan name, customer info, `refURL_callback` pointing to `POST /api/payment/webhook`, and `more_info_1 = sessionId`.
   h. Stores `page_request_uid` on the payment session.
5. **Backend** returns `{ paymentPageLink, pageRequestUid, amount, planName }`.
6. **Frontend** redirects the user to `paymentPageLink` (PayPlus hosted page).
7. **User** completes or cancels payment on PayPlus.
8. PayPlus **redirects the user** back to `/pricing?payment=success|failure|cancel` (frontend display only).
9. PayPlus **sends a server-to-server webhook** to `POST /api/payment/webhook`.
10. **Webhook handler** verifies the payload, finds the payment session, and:
    - On **success**: updates `users.plan_type`, sets `subscription_status = 'trial'`, `subscription_period_end = today + 14`; marks session `completed`.
    - On **failure**: marks session `failed`; user plan remains **unchanged**.

## Plan IDs and amounts (server-side)

Defined in `server/src/services/payplus.service.js`:

| planId   | Monthly (ILS) | Annual per month (ILS) | Annual total on payment page (ILS) |
|----------|----------------|-------------------------|--------------------------------------|
| basic    | 21             | 15                      | 180                                  |
| pro      | 28             | 20                      | 240                                  |
| business | 42             | 30                      | 360                                  |

For **monthly**, the PayPlus payment page shows the normal monthly price and recurring is set to charge **every 1 month**. For **annual**, it shows the full year amount and recurring is set to charge **every 12 months** (once a year). Amounts are enforced on the server; the frontend only sends `planId` and `billingPeriod`. The backend sends PayPlus `recurring_settings` with `recurring_type: 2` (monthly), `recurring_range: 1` (monthly) or `12` (yearly), and `jump_payments: 14` for the 14-day trial before the first charge.

## Plan types (DB vs pricing)

- **Database** (`users.plan_type`): `free`, `standard`, `pro`, `business` (default `standard`). Other systems (e.g. another app) read these values unchanged.
- **Pricing page / API request** (`planId`): `basic`, `pro`, `business` (product naming).
- **Mapping**: In the payment flow, `basic` is mapped to `standard` when comparing with the DB or when writing after webhook success. So a user who buys "בסיסי" (basic) gets `plan_type = 'standard'` in the DB.

Plan rank for upgrade detection: `free (0) < standard/basic (1) < pro (2) < business (3)`.

Migration `002_plan_type_alignment.sql` adds `business` to the allowed values; DB keeps `standard` (no `basic`).

## Payment sessions

The `payment_sessions` table (`003_payment_sessions.sql`) tracks each payment attempt:

| Column | Description |
|--------|-------------|
| `id` | UUID, primary key |
| `user_id` | FK to users |
| `plan_id` | Selected plan (basic/pro/business) |
| `billing_period` | monthly or annual |
| `status` | pending / completed / failed / expired |
| `amount` | Charge amount in ILS |
| `payplus_page_request_uid` | PayPlus page_request_uid for webhook correlation |
| `payplus_transaction_uid` | Transaction UID from webhook |
| `idempotency_key` | Unique key (userId+planId+billingPeriod+timestamp) |
| `expires_at` | Auto-expires pending sessions after 30 minutes |

**Duplicate prevention:**
- Before calling PayPlus, the backend checks for an existing `pending` session for the same user+plan+period. If found, it rejects with 409.
- Sessions expire after 30 minutes so the user can retry.

## Environment variables

Set in server `.env` (or Vercel env):

| Variable            | Description |
|---------------------|-------------|
| `PAYPLUS_API_KEY`   | PayPlus API key (from PayPlus dashboard) |
| `PAYPLUS_SECRET_KEY`| PayPlus secret key |
| `PAYPLUS_PAGE_UID`  | UID of the Payment Page in PayPlus |
| `PAYPLUS_BASE_URL`  | Optional. **Default is staging** (`https://restapidev.payplus.co.il/api/v1.0`) during testing. When going live, set to `https://restapi.payplus.co.il/api/v1.0` |
| `PAYPLUS_CHARGE_METHOD` | Optional. Default `1` (regular charge J4). Use `0` for card check only (J2) in staging. |
| `PAYPLUS_WEBHOOK_SECRET` | Optional. If set, incoming webhooks must include this value in the `x-payplus-secret` header. |
| `FRONTEND_URL`      | Base URL of the site (used for success/failure/cancel redirects) |
| `BACKEND_URL`       | Base URL of the backend (used for `refURL_callback` webhook URL). Default `http://localhost:3001`. |

If PayPlus env vars are missing, `POST /api/payment/create-link` returns 503 with a message that payment is not configured.

### Testing (Staging)

Per [PayPlus FAQ](https://www.payplus.co.il/faq/סליקה-אינטרנטית/חיבור-והרשאות-API/איך-פונים-אל-דף-תשלום-באמצעות-API):

1. **Request must be server-side** -- Do not call PayPlus from the frontend (e.g. localhost). Our flow is correct: the frontend calls our backend, and the backend calls PayPlus.
2. **Staging URL for tests** -- The app uses **staging by default**: `https://restapidev.payplus.co.il/api/v1.0/PaymentPages/generateLink`. You do not need to set `PAYPLUS_BASE_URL` during testing. When going live, set `PAYPLUS_BASE_URL=https://restapi.payplus.co.il/api/v1.0`.
3. **Test credentials** -- Get from PayPlus: API KEY, SECRET KEY, and Payment Page UID for the **staging** environment. Set `PAYPLUS_API_KEY`, `PAYPLUS_SECRET_KEY`, and `PAYPLUS_PAGE_UID` in `server/.env`. **Important:** You must use **staging** credentials with the staging URL; production credentials will return 403.
4. **If you get 403** -- Forbidden usually means: (a) API key or secret is wrong or has leading/trailing spaces, (b) you are using production credentials with the staging URL, or (c) the Payment Page UID is for the other environment. Double-check all three values in the PayPlus dashboard for the **test/staging** environment.
5. **Optional** -- Test with Postman first to verify the request/response before using the UI.
6. **charge_method** -- `1` = regular charge (J4). For simulation only (no real charge), set `PAYPLUS_CHARGE_METHOD=0` (J2) in staging.

## API

### POST /api/payment/create-link (requires auth)

**Request body:**

- `planId` (required): `'basic'` | `'pro'` | `'business'`
- `billingPeriod` (required): `'monthly'` | `'annual'`

**Response (200):**

```json
{
  "paymentPageLink": "https://payments.payplus.co.il/...",
  "pageRequestUid": "uuid",
  "amount": 21,
  "planName": "בסיסי"
}
```

**Errors:**

- 400 -- Missing or invalid `planId` / `billingPeriod`, or downgrade attempt
- 401 -- Not authenticated
- 404 -- User not found
- 409 -- Duplicate subscription (same plan already active) or payment already in progress
- 503 -- PayPlus not configured (missing env)

### POST /api/payment/webhook (no auth -- verified by secret)

PayPlus server-to-server callback. Called automatically by PayPlus after payment completes or fails.

The handler:
1. Optionally verifies `x-payplus-secret` header against `PAYPLUS_WEBHOOK_SECRET`.
2. Finds the `payment_session` by `page_request_uid`.
3. On success (`status_code = '000'`): updates `users.plan_type`, sets subscription to trial, marks session completed.
4. On failure: marks session failed; user plan unchanged.

Always returns 200 to prevent PayPlus retries.

### POST /api/payment/callback (legacy/internal)

Internal callback to set subscription state. Body: `userId`, `status` ('success' | 'failure'), optional `recurringPaymentUid`. On success, sets user to trial (subscription_period_end = today + 14). On failure, sets subscription_status to no_access.

The **webhook** is the primary source of truth for payment confirmation. This endpoint is kept for backward compatibility and manual testing.

## Frontend

- **Pricing page** (`src/pages/Pricing.jsx`): Each plan has a `planId`. On CTA click, `handlePurchaseClick(plan)`:
  1. Checks `isAuthenticated` (from `useAuth`). If not authenticated, redirects to `/signup?returnTo=/pricing?plan=<id>&billing=<period>`.
  2. Calls `api.payment.createLink(plan.planId, billingPeriod)` then redirects to `paymentPageLink`.
  3. Handles 401 (redirect to signup), 409 (show "already subscribed" message), and other errors.
- Billing period is initialized from `?billing=` query param (for return-from-signup flow).
- **API client** (`src/api/client.js`): `api.payment.createLink(planId, billingPeriod)`.

## Callbacks (frontend redirect)

After payment, PayPlus redirects to:

- Success: `/pricing?payment=success`
- Failure: `/pricing?payment=failure`
- Cancel: `/pricing?payment=cancel`

These redirects are **display only** -- the user's plan is NOT updated on redirect. Plan changes happen exclusively through the webhook.

On return to `/pricing?payment=...`, the Pricing page first shows a full-page loading screen (spinner + "טוען...") for about one second. It then shows a floating confirmation card (success, failure, or cancel) as an overlay. The query param is cleared automatically after 8 seconds.

## 14-day trial and subscription state

- **Trial**: 14-day free trial; first charge occurs **after** 14 days. Implemented via PayPlus `start_date` = today + 14 and `instant_first_payment: false` when using RecurringPayments/Add. The site stores `subscription_status = 'trial'` and `subscription_period_end` = first charge date (today + 14) in the `users` table; optionally `settings.first_charge_date` for UI.
- **Trial end date**: Shown in Settings when `subscription_status === 'trial'`; use `subscription_period_end` or `settings.first_charge_date`.
- **After first charge**: When PayPlus sends a webhook after the first charge, set `subscription_status = 'active'` and `subscription_period_end` = next period end (e.g. +1 month).

## Payment failure handling

- If the webhook reports failure: user's `plan_type` and `subscription_status` remain **unchanged**.
- The `payment_sessions` row is marked `status = 'failed'`.
- Frontend: user is redirected to `/pricing?payment=failure`; existing UI behaviour shows the failure message.

## Files

| Area | Files |
|------|-------|
| Controller | `server/src/controllers/payment.controller.js` |
| Routes | `server/src/routes/payment.routes.js` |
| PayPlus service | `server/src/services/payplus.service.js` |
| Subscription service | `server/src/services/subscription.service.js` |
| Payment session model | `server/src/models/PaymentSession.model.js` |
| User model | `server/src/models/User.model.js` |
| Frontend pricing | `src/pages/Pricing.jsx` |
| API client | `src/api/client.js` |
| Migrations | `server/src/database/migrations/002_plan_type_alignment.sql`, `003_payment_sessions.sql` |
| Schema | `server/src/database/schema.sql` |
