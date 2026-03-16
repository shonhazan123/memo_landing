-- One-off fix: User paid successfully but webhook did not run (wrong payload path).
-- Run in Supabase SQL Editor after verifying the payment_sessions row is for a successful payment.
--
-- 1. Mark the payment session as completed (session UID from your pending row)
UPDATE payment_sessions
SET status = 'completed', updated_at = NOW()
WHERE payplus_page_request_uid = '1166d940-4f76-4c7c-91a2-0b975312e87f';

-- 2. Update the user to the plan they paid for (user_id and plan from the same session)
--    plan_type = 'business' (they paid for business annual)
--    subscription_status = 'trial', subscription_period_end = first charge date (payment date + 14 days)
UPDATE users
SET
  plan_type = 'business',
  subscription_status = 'trial',
  subscription_period_end = '2026-03-30',  -- 14 days after payment (2026-03-16); adjust if needed
  updated_at = NOW()
WHERE id = '8c4cf643-fcbf-4a52-8120-bf0fd1ceee67';

-- Optional: if you have the recurring_uid from PayPlus, add it to settings so cancel works later:
-- UPDATE users SET settings = jsonb_set(COALESCE(settings, '{}'), '{recurring_payment_uid}', '"PASTE_RECURRING_UID_HERE"') WHERE id = '8c4cf643-fcbf-4a52-8120-bf0fd1ceee67';
