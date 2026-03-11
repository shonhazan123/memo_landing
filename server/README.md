# Mimo Server

Express backend with clear separation of responsibilities for debugging and tracking.

## Folder structure and responsibility

| Path | Responsibility |
|------|-----------------|
| **lib/processLogger.js** | Single audit/process logger. Use for validation, subscription, payment, and job events. All logs are prefixed and structured so you can trace user flows and debug issues. |
| **services/subscription.service.js** | Subscription state only: cancel at period end, period-end revocation, trial/active/no_access, access check (`hasPaidAccess`). Calls UserModel and PayPlusService; logs via processLogger. |
| **services/user.service.js** | User CRUD, phone validation, formatUser (includes subscription fields for API). |
| **services/payplus.service.js** | PayPlus API: payment link, amounts, cancel recurring, trial first-charge date. No user state. |
| **services/auth.service.js** | JWT and Google OAuth; user lookup from token. |
| **controllers/** | HTTP handlers; delegate to services. |
| **jobs/periodEndRevocation.job.js** | Daily job: revoke access for users who cancelled and whose period ended. Calls subscription.service only. |
| **models/User.model.js** | DB access for users; subscription columns and methods (`setCancelAtPeriodEnd`, `updateSubscription`, `findUsersForPeriodEndRevocation`). |

## Key flows (for debugging)

1. **Cancel subscription:** `UserController.cancelSubscription` → `SubscriptionService.cancelSubscription` → UserModel + PayPlusService.cancelRecurring; processLogger.subscription('cancel').
2. **Period-end revocation:** `GET /api/cron/period-end-revocation` → `runPeriodEndRevocation` → `SubscriptionService.revokeExpiredCancellations` → UserModel.findUsersForPeriodEndRevocation + updateSubscription; processLogger.job('period_end_revocation').
3. **Payment callback:** `PaymentController.callback` → SubscriptionService.setTrial/setNoAccess; processLogger.payment('callback_success'|'callback_failure').
4. **Validation (e.g. check-phone):** Use processLogger.validation('check_phone', { ... }) in the relevant controller or service.

## Environment

- **CRON_SECRET** – If set, `GET /api/cron/period-end-revocation?secret=CRON_SECRET` is required to run the job.
- **PAYPLUS_TERMINAL_UID** – Optional; required by PayPlus for RecurringPayments/DeleteRecurring in some setups.

See `docs/project-instruction/payment-flow.md` and `support-and-cancellation.md` for full env and behaviour.
