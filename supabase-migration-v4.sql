-- Migration v4: Document expiry, reliability scoring, community vouching
-- Run in Supabase SQL Editor

-- 1. Document expiry tracking
ALTER TABLE user_documents ADD COLUMN IF NOT EXISTS expires_at timestamptz;

-- 2. Mark trusted vouchers on helpers
ALTER TABLE helpers ADD COLUMN IF NOT EXISTS is_trusted_voucher boolean NOT NULL DEFAULT false;

-- 3. Community vouching table
CREATE TABLE IF NOT EXISTS helper_vouches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  voucher_id uuid NOT NULL REFERENCES helpers(id) ON DELETE CASCADE,
  vouchee_id uuid NOT NULL REFERENCES helpers(id) ON DELETE CASCADE,
  note text,
  UNIQUE(voucher_id, vouchee_id)
);

-- 4. Reliability scoring view
-- Scores are computed from poster verifications (did the volunteer actually show up and behave well?)
CREATE OR REPLACE VIEW helper_reliability AS
SELECT
  hr.helper_email,
  COUNT(tv.id) FILTER (WHERE tv.completed_at IS NOT NULL) AS total_verifications,
  COUNT(tv.id) FILTER (
    WHERE tv.completed_at IS NOT NULL
    AND tv.party = 'poster'
    AND tv.volunteer_showed_up = true
    AND tv.task_safe_and_genuine = true
  ) AS positive_completions,
  COUNT(tv.id) FILTER (
    WHERE tv.completed_at IS NOT NULL AND tv.party = 'poster'
  ) AS total_rated
FROM helper_responses hr
JOIN task_verifications tv ON tv.helper_response_id = hr.id
GROUP BY hr.helper_email;

-- RLS for helper_vouches (admin-only write, public read)
ALTER TABLE helper_vouches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read vouches" ON helper_vouches
  FOR SELECT USING (true);

CREATE POLICY "Service role can write vouches" ON helper_vouches
  FOR ALL USING (auth.role() = 'service_role');
