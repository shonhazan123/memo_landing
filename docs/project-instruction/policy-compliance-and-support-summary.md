# Policy Compliance & Support Tracking — Summary

Short summary of what was implemented for Israeli cancellation policy, 14-day trial, and support tracking.

---

## What was done

### 1. Contact & policy
- **No contact form.** Support is email ([donnai.help@gmail.com](mailto:donnai.help@gmail.com)) and phone (054-391-1602) only.
- **Cancellation policy** (section 3): removed "טופס יצירת קשר באתר"; kept account settings and email/phone.

### 2. Subscription & cancellation (no user delete)
- **DB (`users`):** Added `subscription_period_end`, `cancel_at_period_end`, `subscription_status` (active, no_access, trial, cancelled_pending, payment_failed).
- **Cancel flow:** User clicks "בטל מנוי" → `POST /api/users/me/cancel-subscription` → set `cancel_at_period_end = true`, cancel PayPlus recurring if stored. User row is **not** deleted.
- **Access until period end:** A daily cron (`GET /api/cron/period-end-revocation`) finds users with `cancel_at_period_end` and `subscription_period_end <= today` and sets `subscription_status = 'no_access'`.

### 3. 14-day trial
- **Trial state:** `subscription_status = 'trial'`, `subscription_period_end` = first charge date (e.g. today + 14). Optional `settings.first_charge_date` for UI.
- **PayPlus:** `getTrialFirstChargeDate()`, `cancelRecurring(uid)`; RecurringPayments/Add can use `start_date` = today + 14, `instant_first_payment: false` when integrated.
- **Callback:** `POST /api/payment/callback` with `{ userId, status }` sets trial (success) or no_access (failure).

### 4. Settings UI
- **Two actions:** "בטל מנוי" (cancel modal → cancel-subscription API) and "מחק חשבון" (delete-account modal).
- **Modals:** Signup-quality copy and layout; cancel explains period end and access until date; delete clarifies "ביטול מנוי בלבד" and support email.
- **Display:** Trial end date and "המנוי יסתיים ב-[date]" when relevant.

### 5. Pricing payment result
- **Query:** `/pricing?payment=success|failure|cancel` after PayPlus redirect.
- **UI:** Clear success/failure/cancel cards (rounded, gradient icon, dismiss). Query param cleared after display.

### 6. Server structure (debugging & tracking)
- **`lib/processLogger.js`** — Central log for validation, subscription, payment, jobs.
- **`services/subscription.service.js`** — All subscription logic (cancel, revoke, trial, access check).
- **`services/payplus.service.js`** — Payment link, cancel recurring, trial date.
- **`jobs/periodEndRevocation.job.js`** — Daily revocation job.
- **README** in `server/` describes folder roles and main flows.

---

## Where the changes are (by file)

### Database
- **server/src/database/schema.sql** — Added subscription_period_end, cancel_at_period_end, subscription_status to users (for new installs).
- **server/src/database/migrations/001_subscription_columns.sql** — New. Migration: same columns + CHECK constraint (run on existing DB).

### Server (backend)
- **server/src/lib/processLogger.js** — New. Audit logger for validation, subscription, payment, jobs.
- **server/src/services/subscription.service.js** — New. Cancel at period end, revoke expired, setTrial/setActive/setNoAccess, hasPaidAccess.
- **server/src/services/user.service.js** — formatUser extended with subscription fields; name from settings.user_name.
- **server/src/services/payplus.service.js** — cancelRecurring(uid), getTrialFirstChargeDate().
- **server/src/models/User.model.js** — setCancelAtPeriodEnd, updateSubscription, findUsersForPeriodEndRevocation.
- **server/src/controllers/user.controller.js** — cancelSubscription handler; import SubscriptionService.
- **server/src/controllers/payment.controller.js** — callback handler (set trial / no_access); import SubscriptionService, processLogger.
- **server/src/jobs/periodEndRevocation.job.js** — New. Calls subscription.revokeExpiredCancellations.
- **server/src/routes/user.routes.js** — POST /me/cancel-subscription.
- **server/src/routes/payment.routes.js** — POST /callback.
- **server/src/index.js** — GET /api/cron/period-end-revocation route.
- **server/README.md** — New. Server structure and flows for debugging.

### Frontend
- **src/pages/Settings.jsx** — Two buttons (בטל מנוי, מחק חשבון), CancelSubscriptionModal, trial/cancel-pending messages, api.users.cancelSubscription, refreshUser.
- **src/pages/Settings.css** — Styles for delete-account button, trial/cancel-pending messages, cancel-sub modal, modal-body-hint, modal-support-link.
- **src/pages/Pricing.jsx** — useSearchParams for payment= query, success/failure/cancel message blocks, dismissPaymentMessage, auto-clear query.
- **src/pages/Pricing.css** — Styles for pricing-message-card (success/failure/cancel), icon, title, body, dismiss button.
- **src/pages/CancellationPolicy.jsx** — Removed bullet "טופס יצירת קשר באתר"; added "או בטלפון".
- **src/api/client.js** — users.cancelSubscription().
- **src/context/AuthContext.jsx** — refreshUser(), exposed in context value.

### Docs (project-instruction)
- **docs/project-instruction/design-system.md** — Support (no form), payment result UI, cancel/delete modals.
- **docs/project-instruction/project-plan.md** — Cancellation at period end, 14-day trial, payment messages, policy; link to support-and-cancellation.
- **docs/project-instruction/payment-flow.md** — payment= query, 14-day trial, subscription_period_end, POST /api/payment/callback.
- **docs/project-instruction/support-and-cancellation.md** — New. Support only, cancellation flow, cron, failed payment, Settings actions.

---

## Env (optional)

- **CRON_SECRET** — Required for `GET /api/cron/period-end-revocation?secret=...`
- **PAYPLUS_TERMINAL_UID** — For PayPlus RecurringPayments/DeleteRecurring when cancelling

Run the migration `001_subscription_columns.sql` on the database if the columns are not already present.
