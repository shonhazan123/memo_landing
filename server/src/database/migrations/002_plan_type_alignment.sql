-- Migration: Extend plan_type to include 'business'. DB uses free, standard, pro, business.
-- Pricing page uses basic/pro/business; backend maps basic <-> standard in payment flow.
-- Run in Supabase SQL Editor or: psql -f 002_plan_type_alignment.sql

-- 1. Drop existing CHECK constraint on plan_type
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_plan_type_check;

-- 2. If any rows have 'basic' (e.g. from a previous migration), map back to 'standard'
UPDATE users SET plan_type = 'standard' WHERE plan_type = 'basic';

-- 3. Add new CHECK: free, standard, pro, business (no 'basic' — UI planId 'basic' maps to 'standard' in DB)
ALTER TABLE users ADD CONSTRAINT users_plan_type_check
  CHECK (plan_type IN ('free', 'standard', 'pro', 'business'));

-- 4. Ensure default is 'standard'
ALTER TABLE users ALTER COLUMN plan_type SET DEFAULT 'standard';

COMMENT ON COLUMN users.plan_type IS 'User plan tier: free, standard, pro, business. Other systems read this; pricing UI maps basic->standard.';
