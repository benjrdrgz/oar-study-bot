-- OAR Pro v4 — Affiliate Portal
-- Adds: portal_token to affiliates, cashout_requests table, secure RPC functions
-- Affiliates access their portal via a private UUID link — no login required.

-- ── 1. Portal token on affiliates ──────────────────────────────────────────
ALTER TABLE affiliates ADD COLUMN IF NOT EXISTS portal_token UUID DEFAULT gen_random_uuid() UNIQUE;
UPDATE affiliates SET portal_token = gen_random_uuid() WHERE portal_token IS NULL;
ALTER TABLE affiliates ALTER COLUMN portal_token SET NOT NULL;

-- ── 2. Cashout requests ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cashout_requests (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id    UUID NOT NULL REFERENCES affiliates(id) ON DELETE CASCADE,
  amount          NUMERIC(10,2) NOT NULL,
  payment_method  TEXT NOT NULL,  -- 'venmo' | 'paypal' | 'zelle' | 'other'
  payment_handle  TEXT NOT NULL,  -- @handle or email
  notes           TEXT,
  status          TEXT NOT NULL DEFAULT 'pending',  -- pending | approved | paid | rejected
  admin_note      TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  processed_at    TIMESTAMPTZ
);

ALTER TABLE cashout_requests ENABLE ROW LEVEL SECURITY;

-- Service role (admin dashboard / webhook) has full access
CREATE POLICY "Service role manages cashout requests"
  ON cashout_requests FOR ALL
  USING (true)
  WITH CHECK (true);

-- ── 3. RPC: get affiliate stats by portal token ──────────────────────────────
CREATE OR REPLACE FUNCTION get_affiliate_by_token(p_token UUID)
RETURNS TABLE (
  id              UUID,
  name            TEXT,
  code            TEXT,
  email           TEXT,
  commission_rate NUMERIC,
  total_referred  INT,
  total_earned    NUMERIC,
  total_paid      NUMERIC,
  owed            NUMERIC,
  active          BOOLEAN
) SECURITY DEFINER SET search_path = public AS $$
  SELECT
    a.id, a.name, a.code, a.email,
    a.commission_rate,
    a.total_referred,
    a.total_earned,
    a.total_paid,
    (a.total_earned - a.total_paid) AS owed,
    a.active
  FROM affiliates a
  WHERE a.portal_token = p_token;
$$ LANGUAGE sql;

-- ── 4. RPC: get cashout request history by portal token ──────────────────────
CREATE OR REPLACE FUNCTION get_cashout_requests_by_token(p_token UUID)
RETURNS TABLE (
  id             UUID,
  amount         NUMERIC,
  payment_method TEXT,
  payment_handle TEXT,
  status         TEXT,
  admin_note     TEXT,
  created_at     TIMESTAMPTZ,
  processed_at   TIMESTAMPTZ
) SECURITY DEFINER SET search_path = public AS $$
  SELECT cr.id, cr.amount, cr.payment_method, cr.payment_handle,
         cr.status, cr.admin_note, cr.created_at, cr.processed_at
  FROM cashout_requests cr
  JOIN affiliates a ON a.id = cr.affiliate_id
  WHERE a.portal_token = p_token
  ORDER BY cr.created_at DESC;
$$ LANGUAGE sql;

-- ── 5. RPC: submit cashout request (validated server-side) ───────────────────
CREATE OR REPLACE FUNCTION submit_cashout_request(
  p_token   UUID,
  p_amount  NUMERIC,
  p_method  TEXT,
  p_handle  TEXT,
  p_notes   TEXT DEFAULT NULL
) RETURNS JSON SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_affiliate_id UUID;
  v_owed         NUMERIC;
  v_request_id   UUID;
BEGIN
  -- Look up affiliate by token
  SELECT id, (total_earned - total_paid)
  INTO v_affiliate_id, v_owed
  FROM affiliates
  WHERE portal_token = p_token AND active = true;

  IF v_affiliate_id IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Invalid or inactive affiliate link');
  END IF;

  IF p_amount <= 0 THEN
    RETURN json_build_object('success', false, 'error', 'Amount must be greater than $0');
  END IF;

  IF p_amount > v_owed THEN
    RETURN json_build_object('success', false, 'error', 'Amount exceeds your current balance of $' || v_owed::TEXT);
  END IF;

  -- Block duplicate pending requests
  IF EXISTS (
    SELECT 1 FROM cashout_requests
    WHERE affiliate_id = v_affiliate_id AND status = 'pending'
  ) THEN
    RETURN json_build_object('success', false, 'error', 'You already have a pending cashout request. Wait for it to be processed before submitting another.');
  END IF;

  INSERT INTO cashout_requests (affiliate_id, amount, payment_method, payment_handle, notes)
  VALUES (v_affiliate_id, p_amount, p_method, p_handle, p_notes)
  RETURNING id INTO v_request_id;

  RETURN json_build_object('success', true, 'request_id', v_request_id);
END;
$$ LANGUAGE plpgsql;

-- Grant anon + authenticated roles access to the RPC functions
GRANT EXECUTE ON FUNCTION get_affiliate_by_token(UUID) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_cashout_requests_by_token(UUID) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION submit_cashout_request(UUID, NUMERIC, TEXT, TEXT, TEXT) TO anon, authenticated;
