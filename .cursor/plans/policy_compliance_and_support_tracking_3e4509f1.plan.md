---
name: Policy compliance and support tracking
overview: "Align the codebase with Israeli cancellation policy: no contact form (email/phone only); cancellation = change access at next bill day (no user deletion); 14-day timed free trial with first charge after 14 days; payment-result and cancellation UX with Signup-quality UI."
todos: []
isProject: false
---

# Plan: Policy compliance, cancellation, free trial, and UX

## Fixes applied (per your feedback)

1. **Contact:** No contact form or backend. Users contact only via email ([donnai.help@gmail.com](mailto:donnai.help@gmail.com)) and phone (054-391-1602). Remove "טופס יצירת קשר באתר" from the cancellation policy so the policy does not promise a form.
2. **Cancellation:** Do not delete the user. Store cancellation intent in DB; change the user's access to "no access" on the exact next bill day and ensure no recharge on that day.
3. **Free trial:** Time-based 14-day trial: user subscribes and is charged only after 14 days. The site implements this and the UI clearly explains trial end date and that charge happens after 14 days.
4. **New UI:** Any new pages or blocks (payment result messages, cancellation modals, etc.) must be very well designed, matching the Signup "talk to Donna" step quality (e.g. [Signup.jsx](src/pages/Signup.jsx): gradient checkmarks, rounded cards, clear typography, RTL, consistent spacing).

---

## 1. Contact: email/phone only, policy update

**No contact form or contact backend.** Support is only via:

- **Email:** [donnai.help@gmail.com](mailto:donnai.help@gmail.com) (mailto links already on Privacy, Terms, CancellationPolicy)
- **Phone:** 054-391-1602 (tel links already present)

**Policy change (required):**

- In [CancellationPolicy.jsx](src/pages/CancellationPolicy.jsx), section 3 ("אופן הגשת בקשת ביטול"), **remove** the bullet "באמצעות טופס יצירת קשר באתר". Keep only:
  - דרך הגדרות החשבון באתר
  - באמצעות פנייה לדוא״ל התמיכה של החברה (and optionally "או בטלפון" if you want to mention phone explicitly)
- No new Contact page, no footer "יצירת קשר" link, no backend contact/support routes or tables.

**Outcome:** Policy matches what the site offers; no promise of a form. If Israeli/commercial rules later require a contact form, it can be added then.

---

## 2. PayPlus start_date (14-day trial) and users table (no new table)

**Trial (14 days):** Use PayPlus **start_date** = today + 14 days. PayPlus will charge on that date; no need for our own charge job for the first charge. When creating the recurring payment (PayPlus RecurringPayments/Add or equivalent flow), pass `start_date` as an ISO date string 14 days from today and `instant_first_payment: false` so the first charge happens on start_date. The website backend computes and sends this; PayPlus is in charge of charging.

**Cancellation:** Start cancellation at the **next payment day** — we only stop charging from the next month. In the backend: (1) a **flag for the user’s current permission** (e.g. `subscription_status`), and (2) a **system that checks users’ future cancellation** and, on the given date (next payment day), **changes the user’s permission** to no access. That system is a daily (or scheduled) job: find users where `cancel_at_period_end = true` and `subscription_period_end <= today`, then set `subscription_status = 'no_access'`. Do not charge them on that date (cancel recurring in PayPlus when user clicks cancel, or rely on PayPlus not charging if recurring was cancelled).

**Users table – what to add or change (no new table):**

Current columns (from your example): `id`, `whatsapp_number`, `timezone`, `settings`, `created_at`, `plan_type`, `google_email`, `onboarding_complete`, `onboarding_last_prompt_at`, `updated_at`.

**Suggested additions (all on `users`):**


| Column                    | Type      | Default    | Purpose                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| ------------------------- | --------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `subscription_period_end` | `DATE`    | `NULL`     | End of current billing period (= next payment day). For trial, set to today + 14 when they “subscribe”; after first charge, set to +1 month or +1 year. Used by cron to revoke access when `cancel_at_period_end` and this date has passed.                                                                                                                                                                                                                                                |
| `cancel_at_period_end`    | `BOOLEAN` | `false`    | User requested cancellation; we stop charging at next period end and revoke access on that date.                                                                                                                                                                                                                                                                                                                                                                                           |
| `subscription_status`     | `TEXT`    | `'active'` | **Current permission flag.** Values: `'active'` (has access), `'no_access'` (no access — after cancelled period end or failed payment), `'trial'` (free trial — site knows user is on trial when this is `'trial'`), `'cancelled_pending'` (cancelled but access until period_end). Optional: `'payment_failed'` (recurring charge failed; treat as no access). All access checks use this. Cron sets to `'no_access'` when `cancel_at_period_end` and `subscription_period_end <= today`. |


**Optional (for trial UI “first charge on X”):** Store first charge date in `settings` to avoid another column, e.g. `settings.first_charge_date` = `'YYYY-MM-DD'` (today + 14 when they start trial). Or derive from `subscription_period_end` when `subscription_status = 'trial'`.

**Migration (add columns only):**

```sql
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS subscription_period_end DATE,
  ADD COLUMN IF NOT EXISTS cancel_at_period_end BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'active';

-- Optional: constrain allowed values
ALTER TABLE users ADD CONSTRAINT chk_subscription_status
  CHECK (subscription_status IN ('active', 'no_access', 'trial', 'cancelled_pending', 'payment_failed'));
```

**Existing rows:** Leave `subscription_period_end` NULL, `cancel_at_period_end` false, `subscription_status` 'active'. Backend and cron only update rows where these fields are set; existing users keep access until you set period_end (e.g. when you backfill or on next payment).

**How the site knows trial end, trial status, and when access is not active:**

- **When does the free trial end?** — The site uses `subscription_period_end`. While the user is on trial, this is set to the first charge date (today + 14). So **trial end date** = `subscription_period_end` when `subscription_status = 'trial'`. Optionally also store `settings.first_charge_date` for display; both allow the UI to show "החיוב הראשון ב-[date]".
- **Is the user currently on trial (free)?** — The site checks `subscription_status = 'trial'`. Only when it is `'trial'` should the UI show "תקופת ניסיון" and treat the user as pre-first-charge.
- **Is the user’s access not active?** — The site checks `subscription_status = 'no_access'` (and optionally `'payment_failed'` if added). Both mean the user must not have paid access. Use this for:
  - **Cancelled subscription:** After the next payment day, the cron sets `subscription_status = 'no_access'`.
  - **Failed payment:** When PayPlus sends a callback/webhook that a recurring charge failed, set `subscription_status = 'no_access'` (or add a value like `'payment_failed'` and treat it as no access in all access checks; then the UI can show "תשלום נכשל — עדכן אמצעי תשלום" and a CTA to update payment). Either way, the site knows access is not active.

**Failed-payment handling (add to implementation):** When the backend receives a PayPlus notification that a recurring payment failed, update the user row: set `subscription_status = 'no_access'` (or `'payment_failed'` if you add it to the CHECK and want a distinct UI). Do not delete the user. Optionally set `settings.payment_failed_at` for display. Access checks must treat any non-active status as no access.

**Cron / scheduled job:** Every day (or at a fixed time), run:

- For all users where `cancel_at_period_end = true` AND `subscription_period_end IS NOT NULL` AND `subscription_period_end <= CURRENT_DATE`: set `subscription_status = 'no_access'` and optionally set `cancel_at_period_end = false`. Do **not** trigger any charge; only change permission.

---

## 3. Cancellation: no user deletion; access ends on next bill day

**Rule:** When the user cancels, we do **not** delete the user row. We record "cancel at period end" and on the **exact** next bill day we set their access to "no access" and **do not charge** them again.

**Backend (DB + API):**

- **Schema:** Use the `users` table additions from section 2 above: `subscription_period_end`, `cancel_at_period_end`, `subscription_status`. No new table.
- **Cancel endpoint:** e.g. `POST /api/users/me/cancel-subscription`. Set `cancel_at_period_end = true`; keep `subscription_period_end` as-is (so we know “next payment day”). Also call PayPlus to cancel the recurring payment so they do not charge next month. Do **not** delete the user.
- **Access logic:** Everywhere that checks “does this user have paid access?” must use `subscription_status`: if `'no_access'`, deny; if `'cancelled_pending'` and today < `subscription_period_end`, still allow access until that date.
- **Cron:** As in section 2: for users with `cancel_at_period_end = true` and `subscription_period_end <= today`, set `subscription_status = 'no_access'`. No charge is triggered (PayPlus recurring already cancelled when user cancelled).

**Frontend (Settings):**

- Replace "בטל מנוי ומחק חשבון" with two separate actions:
  1. **"בטל מנוי"** – Calls `POST /api/users/me/cancel-subscription`. Show a modal (see UI requirement below) that explains: ביטול ייכנס לתוקף עד סוף תקופת החיוב; לא ייגבו חיובים נוספים; הגישה תישאר עד [date]. No account deletion.
  2. **"מחק חשבון"** – Existing delete-account flow only for users who also want their account and data removed (e.g. after cancellation or if they never had a paid plan). Keep delete API and modal, but make it clear this is "מחיקת חשבון ונתונים" not subscription cancellation.
- If the user already has `cancel_at_period_end = true`, show status in Subscription section: "המנוי יסתיים ב-[date]. לא יגבה חיוב נוסף."

**Outcome:** Cancellation does not delete the user; access is revoked on the exact next bill day and they are not recharged.

---

## 4. Free trial: 14-day timed; PayPlus start_date

**Rule:** The user subscribes and is **only charged after 14 days**. PayPlus handles the charge using **start_date** = today + 14 days (see section 2).

**Backend / PayPlus:**

- When creating the recurring payment (e.g. PayPlus RecurringPayments/Add, or whatever flow creates the subscription), pass **start_date** = today + 14 days (ISO date string). Set **instant_first_payment** = false so the first charge runs on start_date. PayPlus will charge on that date; no need for our own charge job.
- After the user completes the “subscribe” flow (e.g. card saved / recurring created), set in `users`: `subscription_status = 'trial'`, `subscription_period_end = today + 14` (first charge date). Optionally store `settings.first_charge_date = 'YYYY-MM-DD'` for UI. When PayPlus sends a callback after the first charge, set `subscription_period_end = first_charge_date + 1 month` (or +1 year) and `subscription_status = 'active'`.
- **DB:** Use `subscription_period_end` and `subscription_status` (and optional `settings.first_charge_date`) as in section 2; no new table.

**Frontend / UI (must be very clear):**

- **Pricing page:** Keep or add explicit copy: e.g. "14 ימי ניסיון ללא תשלום. החיוב הראשון רק לאחר 14 יום." CTA can stay "נסה בחינם" or "התחל תקופת ניסיון".
- **After "subscription" during trial:** In Settings (and anywhere else that shows plan status), show: "תקופת ניסיון — החיוב הראשון ב-[date]" where date is `subscription_period_end` or `settings.first_charge_date`. Make it clearly visible and understandable.
- **FAQ:** Update to state clearly that the first charge is 14 days after signing up and that they can cancel before that date to avoid any charge.
- **Signup/onboarding:** If the user selects a plan during signup, show one line or tooltip: "לא תחויב/תחויבי עד [date]. ניתן לבטל בכל עת."

**Outcome:** Trial is timed to 14 days; first charge only after that date; UI is clear and consistent across Pricing, Settings, and FAQ.

---

## 5. Payment result messages on Pricing (high-quality UI)

**Why:** After PayPlus redirect, the user lands on `/pricing?payment=success|failure|cancel` and should see clear feedback.

**Implement:**

- In [Pricing.jsx](src/pages/Pricing.jsx), use `useSearchParams()` to read `payment`.
- **Design:** Match Signup "talk to Donna" step quality: clear card/banner, rounded corners, gradient or accent where appropriate, RTL, same typography and spacing as [Signup.jsx](src/pages/Signup.jsx) (e.g. success checkmark in a circle, short message, optional dismiss button). No generic small text; make it a clear, visible block.
- **Messages:**
  - `payment=success`: Success state (e.g. checkmark + "התשלום בוצע בהצלחה. תודה."). Dismissible or auto-clear query after a few seconds.
  - `payment=failure`: Error state with short message and suggestion to retry or contact [donnai.help@gmail.com](mailto:donnai.help@gmail.com) / 054-391-1602.
  - `payment=cancel`: Neutral message: "התשלום בוטל. ניתן לנסות שוב בכל עת."
- After showing, clear or replace the query param (e.g. `navigate('/pricing', { replace: true })`) so the message does not reappear on refresh.

**Outcome:** Payment result UX is clear and matches the rest of the app's design quality.

---

## 6. Settings cancellation modal and copy (high-quality UI)

**Design:** The "בטל מנוי" confirmation modal (and any "מחק חשבון" modal) should follow the same UI level as Signup: clear heading, body text, primary/secondary buttons, rounded card, consistent with [Signup.jsx](src/pages/Signup.jsx) modals and cards. Use the same design tokens (radius, padding, typography) as the Signup flow.

**Content:**

- **Cancel subscription modal:** Explain that cancellation takes effect at the end of the current period; no further charges; access until [date]. No mention of account deletion. Buttons: "אשר ביטול מנוי" (calls API) and "חזור".
- **Delete account modal:** Reserve for actual account deletion; wording that this deletes data and account permanently; optional line that for "ביטול מנוי בלבד" they should use "בטל מנוי" instead. Link to support email only ([donnai.help@gmail.com](mailto:donnai.help@gmail.com)) if they need help.

**Outcome:** Cancellation and delete flows are clear, policy-aligned, and visually consistent with Signup.

---

## 7. Cancellation policy page: remove form reference only

- In [CancellationPolicy.jsx](src/pages/CancellationPolicy.jsx), section 3, remove the bullet "באמצעות טופס יצירת קשר באתר" and keep only account settings and email (and optionally phone). No link to a contact form.

---

## 8. Documentation updates

- [design-system.md](docs/project-instruction/design-system.md): No Contact page. Document that support is email/phone only; document payment-result UI on Pricing and cancellation/delete modals in Settings (Signup-quality UI).
- [project-plan.md](docs/project-instruction/project-plan.md): Update checklist: cancellation = access change at period end (no user delete); 14-day trial with charge after 14 days; payment result messages; policy text updated (no contact form).
- [payment-flow.md](docs/project-instruction/payment-flow.md): Document that Pricing reads `payment=` query and shows success/failure/cancel; document 14-day trial flow (first charge after 14 days) and where trial_ends_at is stored/used.
- Add a short "Support and cancellation" note in project-instruction: support via email/phone only; cancellation stored in DB; access flipped to no_access on period_end; no user table deletion for cancellation.

---

## Implementation order

1. **DB (users table only)** – Add `subscription_period_end`, `cancel_at_period_end`, `subscription_status` (see section 2). No new table.
2. **PayPlus** – When creating subscription, pass `start_date` = today + 14 and `instant_first_payment: false`; store first charge date and trial state in users.
3. **Cancellation API** – POST /api/users/me/cancel-subscription sets `cancel_at_period_end = true` and cancels recurring in PayPlus; do not delete user.
4. **Scheduled job** – Daily: for users with `cancel_at_period_end` and `subscription_period_end <= today`, set `subscription_status = 'no_access'`.
5. **Failed-payment handling** – When PayPlus notifies that a recurring charge failed, set the user’s `subscription_status` to `'no_access'` (or `'payment_failed'`) so the site knows access is not active; optionally set `settings.payment_failed_at` for UI.
6. **Settings UI** – Separate "בטל מנוי" and "מחק חשבון"; cancel modal (Signup-quality); call cancel API; show "מנוי יסתיים ב-[date]" when relevant.
7. **Pricing payment messages** – useSearchParams, success/failure/cancel blocks with Signup-quality UI.
8. **Cancellation policy** – Remove "טופס יצירת קשר באתר" from section 3.
9. **Docs** – As in section 8.

---

## Files to add or touch (summary)


| Area                    | Files                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Backend cancellation    | [server/src/database/schema.sql](server/src/database/schema.sql) (ALTER users: subscription_period_end, cancel_at_period_end, subscription_status only; no new table), [server/src/services/user.service.js](server/src/services/user.service.js) (cancel logic, access check by subscription_status), POST /api/users/me/cancel-subscription, [server/src/controllers/user.controller.js](server/src/controllers/user.controller.js). Cancel recurring in PayPlus when user cancels. |
| PayPlus trial           | [server/src/services/payplus.service.js](server/src/services/payplus.service.js) (or new recurring service): pass start_date = today + 14, instant_first_payment = false when creating subscription.                                                                                                                                                                                                                                                                                  |
| Scheduled job           | New script or serverless cron: for users with cancel_at_period_end and period_end <= today, set subscription_status = 'no_access'.                                                                                                                                                                                                                                                                                                                                                    |
| Failed-payment handling | PayPlus callback/webhook handler: on recurring charge failure, set user subscription_status to 'no_access' (or 'payment_failed'); optional settings.payment_failed_at. Document in payment-flow.md.                                                                                                                                                                                                                                                                                   |
| Settings                | [src/pages/Settings.jsx](src/pages/Settings.jsx) (two buttons, cancel modal, delete modal copy, call cancel API), [src/pages/Settings.css](src/pages/Settings.css) if needed for modal styling.                                                                                                                                                                                                                                                                                       |
| Free trial              | DB: subscription_period_end (first charge date), subscription_status = 'trial'; PayPlus start_date (today+14). [src/pages/Pricing.jsx](src/pages/Pricing.jsx) (copy + trial message); [src/pages/Settings.jsx](src/pages/Settings.jsx) (trial end date from subscription_period_end or settings.first_charge_date).                                                                                                                                                                   |
| Pricing payment result  | [src/pages/Pricing.jsx](src/pages/Pricing.jsx) (useSearchParams, success/failure/cancel UI blocks – Signup-quality design).                                                                                                                                                                                                                                                                                                                                                           |
| Cancellation policy     | [src/pages/CancellationPolicy.jsx](src/pages/CancellationPolicy.jsx) (remove "טופס יצירת קשר באתר" from section 3).                                                                                                                                                                                                                                                                                                                                                                   |
| Docs                    | [docs/project-instruction/design-system.md](docs/project-instruction/design-system.md), [project-plan.md](docs/project-instruction/project-plan.md), [payment-flow.md](docs/project-instruction/payment-flow.md), optional support-and-cancellation.md.                                                                                                                                                                                                                               |


**Not in scope:** Contact form, contact backend, footer "יצירת קשר" link, support_requests table.