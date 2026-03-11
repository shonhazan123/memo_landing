-- Migration: Add subscription columns to users table
-- Policy: cancellation = access change at period end (no user delete); 14-day trial; subscription_status for access control.
-- Run in Supabase SQL Editor or: psql -f 001_subscription_columns.sql

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS subscription_period_end DATE,
  ADD COLUMN IF NOT EXISTS cancel_at_period_end BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'active';

-- Constrain allowed subscription_status values
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'chk_subscription_status'
  ) THEN
    ALTER TABLE users ADD CONSTRAINT chk_subscription_status
      CHECK (subscription_status IN ('active', 'no_access', 'trial', 'cancelled_pending', 'payment_failed'));
  END IF;
END $$;

COMMENT ON COLUMN users.subscription_period_end IS 'End of current billing period (next payment day). For trial: first charge date (today+14). Used by cron to revoke access when cancel_at_period_end and this date has passed.';
COMMENT ON COLUMN users.cancel_at_period_end IS 'User requested cancellation; we stop charging at next period end and revoke access on that date.';
COMMENT ON COLUMN users.subscription_status IS 'Current permission: active, no_access, trial, cancelled_pending, payment_failed. Access checks use this.';
