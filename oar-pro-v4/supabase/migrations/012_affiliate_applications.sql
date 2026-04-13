-- OAR Pro v4 — Affiliate Applications
-- Recruiters can apply via the landing page; admin reviews and approves.
-- Approving creates the affiliate record automatically.
-- — Benjamin Rodriguez

CREATE TABLE IF NOT EXISTS affiliate_applications (
  id           UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  name         TEXT        NOT NULL,
  email        TEXT        NOT NULL,
  rank         TEXT,
  branch       TEXT,
  volume       TEXT,        -- "How many candidates per year?"
  notes        TEXT,
  status       TEXT        NOT NULL DEFAULT 'pending'
                           CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE affiliate_applications ENABLE ROW LEVEL SECURITY;

-- Anyone can submit an application (anon insert)
CREATE POLICY "anon_submit_application"
  ON affiliate_applications FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Only authenticated admins can read/update applications
CREATE POLICY "admin_read_applications"
  ON affiliate_applications FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND account_type = 'admin'
    )
  );

CREATE POLICY "admin_update_applications"
  ON affiliate_applications FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND account_type = 'admin'
    )
  );

-- RPC: approve application → creates affiliate record automatically
CREATE OR REPLACE FUNCTION approve_affiliate_application(p_application_id UUID, p_code TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_app affiliate_applications;
  v_affiliate_id UUID;
BEGIN
  -- Fetch application
  SELECT * INTO v_app FROM affiliate_applications WHERE id = p_application_id;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Application not found');
  END IF;

  -- Check code not taken
  IF EXISTS (SELECT 1 FROM affiliates WHERE code = UPPER(p_code)) THEN
    RETURN jsonb_build_object('success', false, 'error', 'Affiliate code already taken');
  END IF;

  -- Create affiliate record
  INSERT INTO affiliates (name, email, code, commission_rate, active)
  VALUES (v_app.name, v_app.email, UPPER(p_code), 0.20, true)
  RETURNING id INTO v_affiliate_id;

  -- Mark application approved
  UPDATE affiliate_applications SET status = 'approved' WHERE id = p_application_id;

  RETURN jsonb_build_object('success', true, 'affiliate_id', v_affiliate_id, 'code', UPPER(p_code));
END;
$$;

GRANT EXECUTE ON FUNCTION approve_affiliate_application TO authenticated;
