-- Migration 015: Email leads from free diagnostic conversions
-- Part of the freemium funnel — captures leads on the diagnostic results page
-- — Benjamin Rodriguez

CREATE TABLE email_leads (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email           TEXT UNIQUE NOT NULL,
  diag_score      INTEGER,
  diag_correct    INTEGER,
  diag_total      INTEGER,
  weak_sections   TEXT[] DEFAULT '{}',
  utm_source      TEXT DEFAULT 'direct',
  utm_medium      TEXT DEFAULT 'organic',
  utm_campaign    TEXT,
  sequence_step   INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT now(),
  last_emailed_at TIMESTAMPTZ,
  converted_at    TIMESTAMPTZ   -- set by stripe-webhook when they purchase
);

-- Index for sequence cron: queries leads by step + time since last email
CREATE INDEX idx_email_leads_sequence
  ON email_leads (sequence_step, last_emailed_at)
  WHERE converted_at IS NULL;

-- RLS: no public reads. All writes go through service_role in edge functions.
ALTER TABLE email_leads ENABLE ROW LEVEL SECURITY;
-- No policies intentionally — only service_role key can access this table.

-- Mark leads as converted when they buy (called from stripe-webhook)
-- UPDATE email_leads SET converted_at = now() WHERE email = $1
