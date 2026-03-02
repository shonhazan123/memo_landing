# Payment Flow (PayPlus)

## Overview

When a user clicks the purchase/try button on a pricing plan (Pricing page), they are sent to **PayPlus** hosted payment page. The flow uses [PayPlus PaymentPages Generate Link API](https://docs.payplus.co.il/reference/post_paymentpages-generatelink).

## Flow

1. **User** selects a plan (בסיסי / מקצועי / עסקי) and billing period (חודשי / שנתי) on `/pricing`.
2. **User** clicks the CTA button ("נסה בחינם").
3. **Frontend** calls `POST /api/payment/create-link` with `{ planId, billingPeriod }`.
4. **Backend** validates `planId` and `billingPeriod`, maps them to an amount (ILS), then calls PayPlus `PaymentPages/generateLink` with:
   - `payment_page_uid` – from env (your PayPlus payment page)
   - `amount`, `currency_code` (ILS)
   - `refURL_success`, `refURL_failure`, `refURL_cancel` – redirect back to `/pricing?payment=success|failure|cancel`
   - `items` – single line item with plan name and amount
5. **Backend** returns `{ paymentPageLink, pageRequestUid, amount, planName }`.
6. **Frontend** redirects the user to `paymentPageLink` (PayPlus hosted page).
7. **User** completes or cancels payment on PayPlus; PayPlus redirects back to our site per the refURLs.

## Plan IDs and amounts (server-side)

Defined in `server/src/services/payplus.service.js`:

| planId   | Monthly (ILS) | Annual (ILS) |
|----------|----------------|--------------|
| basic    | 21             | 15           |
| pro      | 28             | 20           |
| business | 42             | 30           |

Amounts are enforced on the server; the frontend only sends `planId` and `billingPeriod`.

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

- **Pricing page** (`src/pages/Pricing.jsx`): Each plan has a `planId`. On CTA click, `handlePurchaseClick(plan)` calls `api.payment.createLink(plan.planId, billingPeriod)` then redirects to `paymentPageLink`. Loading state and error message are shown.
- **API client** (`src/api/client.js`): `api.payment.createLink(planId, billingPeriod, options)`.

## Callbacks (optional)

After payment, PayPlus redirects to:

- Success: `/pricing?payment=success`
- Failure: `/pricing?payment=failure`
- Cancel: `/pricing?payment=cancel`

You can extend the Pricing page to read `payment` from the URL and show a short success/failure/cancel message.

## IPN / server callbacks

For recording payments or updating subscriptions, configure **refURL_callback** (and optionally IPN) in the PayPlus dashboard or by extending the generateLink request in `server/src/services/payplus.service.js` and handle the callback in a dedicated route.
