-- Migration: Morning brief send time (local wall clock with users.timezone; not UTC)
-- Run in Supabase SQL Editor or: psql -f 004_morning_brief_time.sql

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS morning_brief_time TIME NOT NULL DEFAULT '08:00';

COMMENT ON COLUMN users.morning_brief_time IS 'Wall-clock time in the user''s timezone (see users.timezone) when the morning brief should be sent. Stored as PostgreSQL TIME; downstream services combine with timezone.';
