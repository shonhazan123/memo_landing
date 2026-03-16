-- Migration: Create payment_sessions table for tracking payment attempts and preventing duplicates.
-- Run in Supabase SQL Editor or: psql -f 003_payment_sessions.sql

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS payment_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan_id TEXT NOT NULL,
  billing_period TEXT NOT NULL CHECK (billing_period IN ('monthly', 'annual')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'expired')),
  amount NUMERIC(10,2) NOT NULL,
  payplus_page_request_uid TEXT,
  payplus_transaction_uid TEXT,
  idempotency_key TEXT UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payment_sessions_user_id ON payment_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_sessions_user_status ON payment_sessions(user_id, status);
CREATE INDEX IF NOT EXISTS idx_payment_sessions_payplus_uid ON payment_sessions(payplus_page_request_uid);
CREATE INDEX IF NOT EXISTS idx_payment_sessions_idempotency ON payment_sessions(idempotency_key);

-- Trigger for updated_at
DROP TRIGGER IF EXISTS update_payment_sessions_updated_at ON payment_sessions;
CREATE TRIGGER update_payment_sessions_updated_at
  BEFORE UPDATE ON payment_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE payment_sessions IS 'Tracks payment attempts to prevent duplicates and correlate webhooks.';
COMMENT ON COLUMN payment_sessions.idempotency_key IS 'Unique key per payment intent (userId+planId+billingPeriod+timestamp) to prevent duplicate charges.';
COMMENT ON COLUMN payment_sessions.expires_at IS 'Sessions older than this are considered expired and can be cleaned up.';
