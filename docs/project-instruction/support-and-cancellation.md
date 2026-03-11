# Support and cancellation

## Support: email and phone only

- **No contact form** and no contact backend. Users contact support only via:
  - **Email:** [donnai.help@gmail.com](mailto:donnai.help@gmail.com)
  - **Phone:** 054-391-1602
- Links appear on Privacy, Terms, and Cancellation Policy pages. The cancellation policy text does not mention a contact form.

## Cancellation: no user deletion

- When a user cancels their subscription, we **do not delete** the user row.
- We store **cancel_at_period_end** = true and keep **subscription_period_end** as-is (the next payment day).
- Access remains until **subscription_period_end**; then a daily job sets **subscription_status** = 'no_access'. No charge is triggered on that date (PayPlus recurring is cancelled when the user clicks cancel).
- **Cancel endpoint:** `POST /api/users/me/cancel-subscription` (requires auth). Sets cancel_at_period_end and calls PayPlus to cancel recurring if `settings.recurring_payment_uid` is set.

## Period-end revocation (cron)

- **Job:** For all users where `cancel_at_period_end = true` and `subscription_period_end <= today`, set `subscription_status = 'no_access'` and `cancel_at_period_end = false`.
- **Trigger:** Call `GET /api/cron/period-end-revocation?secret=CRON_SECRET` daily (e.g. from Vercel Cron or external scheduler). Set `CRON_SECRET` in env; if set, the request must include `?secret=CRON_SECRET`.

## Failed payment

- When PayPlus notifies that a recurring charge failed, set the user's **subscription_status** to `'no_access'` (or `'payment_failed'`). Do not delete the user. Optional: set `settings.payment_failed_at` for UI.

## Settings UI

- **"בטל מנוי"** – Calls cancel-subscription API; shows modal explaining period-end behaviour. No account deletion.
- **"מחק חשבון"** – Existing delete-account flow for users who want their account and data removed. Modal copy clarifies that for subscription-only cancellation they should use "בטל מנוי".
