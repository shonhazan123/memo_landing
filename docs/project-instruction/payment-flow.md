# Payment Flow (PayPlus)

## Overview

When a user clicks the purchase/try button on a pricing plan (Pricing page), they are sent to **PayPlus** hosted payment page. The flow uses [PayPlus PaymentPages Generate Link API](https://docs.payplus.co.il/reference/post_paymentpages-generatelink).

## Flow

1. **User** selects a plan (בסיסי / מקצועי / עסקי) and billing period (חודשי / שנתי) on `/pricing`.
2. **User** clicks the CTA button ("נסה בחינם").
3. **Frontend** calls `POST /api/payment/create-link` with `{ planId, billingPeriod }`.
4. **Backend** validates `planId` and `billingPeriod`, computes the charge amount, then calls PayPlus `PaymentPages/generateLink` with:
   - `payment_page_uid` – from env (your PayPlus payment page)
   - `amount`, `currency_code` (ILS): for **monthly** = per-month price; for **annual** = full year total (12 × per-month rate, e.g. 180 / 240 / 360)
   - `refURL_success`, `refURL_failure`, `refURL_cancel` – redirect back to `/pricing?payment=success|failure|cancel`
   - `items` – single line item: for monthly the plan name (e.g. "בסיסי"); for annual the plan name plus " (שנתי)" and the full-year amount
5. **Backend** returns `{ paymentPageLink, pageRequestUid, amount, planName }`.
6. **Frontend** redirects the user to `paymentPageLink` (PayPlus hosted page).
7. **User** completes or cancels payment on PayPlus; PayPlus redirects back to our site per the refURLs.

## Plan IDs and amounts (server-side)

Defined in `server/src/services/payplus.service.js`:

| planId   | Monthly (ILS) | Annual per month (ILS) | Annual total on payment page (ILS) |
|----------|----------------|-------------------------|--------------------------------------|
| basic    | 21             | 15                      | 180                                  |
| pro      | 28             | 20                      | 240                                  |
| business | 42             | 30                      | 360                                  |

For **monthly**, the PayPlus payment page shows the normal monthly price. For **annual**, it shows the full year amount (12 × the annual per-month rate). Amounts are enforced on the server; the frontend only sends `planId` and `billingPeriod`.

## Environment variables

Set in server `.env` (or Vercel env):

| Variable            | Description |
|---------------------|-------------|
| `PAYPLUS_API_KEY`   | PayPlus API key (from PayPlus dashboard) |
| `PAYPLUS_SECRET_KEY`| PayPlus secret key |
| `PAYPLUS_PAGE_UID`  | UID of the Payment Page in PayPlus |
| `PAYPLUS_BASE_URL`  | Optional. **Default is staging** (`https://restapidev.payplus.co.il/api/v1.0`) during testing. When going live, set to `https://restapi.payplus.co.il/api/v1.0` |
| `PAYPLUS_CHARGE_METHOD` | Optional. Default `1` (regular charge J4). Use `0` for card check only (J2) in staging. |
| `FRONTEND_URL`      | Base URL of the site (used for success/failure/cancel redirects) |

If PayPlus env vars are missing, `POST /api/payment/create-link` returns 503 with a message that payment is not configured.

### Testing (Staging)

Per [PayPlus FAQ – איך פונים אל דף תשלום באמצעות API](https://www.payplus.co.il/faq/סליקה-אינטרנטית/חיבור-והרשאות-API/איך-פונים-אל-דף-תשלום-באמצעות-API):

1. **Request must be server-side** – Do not call PayPlus from the frontend (e.g. localhost). Our flow is correct: the frontend calls our backend, and the backend calls PayPlus.
2. **Staging URL for tests** – The app uses **staging by default**: `https://restapidev.payplus.co.il/api/v1.0/PaymentPages/generateLink`. You do not need to set `PAYPLUS_BASE_URL` during testing. When going live, set `PAYPLUS_BASE_URL=https://restapi.payplus.co.il/api/v1.0`.
3. **Test credentials** – Get from PayPlus: API KEY, SECRET KEY, and Payment Page UID for the **staging** environment. Set `PAYPLUS_API_KEY`, `PAYPLUS_SECRET_KEY`, and `PAYPLUS_PAGE_UID` in `server/.env`. **Important:** You must use **staging** credentials with the staging URL; production credentials will return 403.
4. **If you get 403** – Forbidden usually means: (a) API key or secret is wrong or has leading/trailing spaces, (b) you are using production credentials with the staging URL, or (c) the Payment Page UID is for the other environment. Double-check all three values in the PayPlus dashboard for the **test/staging** environment.
5. **Optional** – Test with Postman first to verify the request/response before using the UI.
6. **charge_method** – `1` = regular charge (J4). For simulation only (no real charge), set `PAYPLUS_CHARGE_METHOD=0` (J2) in staging.

## API

### POST /api/payment/create-link

**Request body:**

- `planId` (required): `'basic'` | `'pro'` | `'business'`
- `billingPeriod` (required): `'monthly'` | `'annual'`
- `customerEmail` (optional): string
- `customerName` (optional): string

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

- 400 – Missing or invalid `planId` / `billingPeriod`
- 503 – PayPlus not configured (missing env)

## Frontend

- **Pricing page** (`src/pages/Pricing.jsx`): Each plan has a `planId`. On CTA click, `handlePurchaseClick(plan)` calls `api.payment.createLink(plan.planId, billingPeriod)` then redirects to `paymentPageLink`. Loading state and error message are shown. A disclaimer below the pricing cards (Israeli compliance): "בלחיצה על כפתור התשלום הנך מאשר את תנאי השימוש ומדיניות ביטול העסקה בהתאם לחוק הגנת הצרכן", with links to `/terms` and `/cancellation-policy`.
- **API client** (`src/api/client.js`): `api.payment.createLink(planId, billingPeriod, options)`.

## Callbacks

After payment, PayPlus redirects to:

- Success: `/pricing?payment=success`
- Failure: `/pricing?payment=failure`
- Cancel: `/pricing?payment=cancel`

On return to `/pricing?payment=...`, the **Pricing page** first shows a full-page loading screen (spinner + "טוען...") for about one second. It then shows a floating confirmation card (success, failure, or cancel) as an overlay above the full pricing page: a darkened backdrop covers the page, with a centered card (Signup-quality UI: rounded card, gradient icon, same copy as before) and a single confirmation button ("אישור"). Clicking the button or the backdrop dismisses the overlay and clears the `payment` query param so the user is back on the normal pricing page. The query param is also cleared automatically after 8 seconds so the message does not reappear on refresh.

## 14-day trial and subscription state

- **Trial**: 14-day free trial; first charge occurs **after** 14 days. Implemented via PayPlus `start_date` = today + 14 and `instant_first_payment: false` when using RecurringPayments/Add. The site stores `subscription_status = 'trial'` and `subscription_period_end` = first charge date (today + 14) in the `users` table; optionally `settings.first_charge_date` for UI.
- **Trial end date**: Shown in Settings when `subscription_status === 'trial'`; use `subscription_period_end` or `settings.first_charge_date`.
- **After first charge**: When PayPlus sends a callback after the first charge, set `subscription_status = 'active'` and `subscription_period_end` = next period end (e.g. +1 month). Backend callback: `POST /api/payment/callback` with `{ userId, status: 'success', recurringPaymentUid? }`.

## API

### POST /api/payment/callback

Internal or PayPlus callback to set subscription state. Body: `userId`, `status` ('success' | 'failure'), optional `recurringPaymentUid`. On success, sets user to trial (subscription_period_end = today + 14). On failure, sets subscription_status to no_access.

## IPN / server callbacks

For recording payments or updating subscriptions, configure **refURL_callback** (and optionally IPN) in the PayPlus dashboard or by extending the generateLink request in `server/src/services/payplus.service.js` and handle the callback in a dedicated route.
