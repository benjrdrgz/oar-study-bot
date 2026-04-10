-- Migration 009: Fix handle_new_user trigger + pending_payments grants
--
-- Root cause of "Database error saving new user" on ALL signups:
--   1. handle_new_user() was SECURITY INVOKER (default), so it ran as
--      supabase_auth_admin (GoTrue). That role had no INSERT grant on profiles.
--   2. Migration 007 enabled RLS on pending_payments but supabase_auth_admin
--      had no SELECT/DELETE on that table either.
--
-- Fixes:
--   1. Recreate handle_new_user() as SECURITY DEFINER — runs as postgres (owner),
--      which has full access. This is the standard Supabase pattern.
--   2. Retain the GRANT on pending_payments for belt-and-suspenders.
--
-- Applied directly via db query on 2026-04-10, formalized here.

-- Fix 1: Recreate trigger as SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  pending RECORD;
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);

  SELECT * INTO pending
  FROM pending_payments
  WHERE email = NEW.email
  LIMIT 1;

  IF FOUND THEN
    UPDATE public.profiles SET
      is_paid            = true,
      stripe_customer_id = pending.stripe_customer_id,
      stripe_payment_id  = pending.stripe_payment_id,
      paid_at            = pending.created_at,
      affiliate_code_used = pending.affiliate_code
    WHERE id = NEW.id;
    DELETE FROM pending_payments WHERE email = NEW.email;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Fix 2: Grant pending_payments access to supabase_auth_admin (belt-and-suspenders)
GRANT SELECT, DELETE ON public.pending_payments TO supabase_auth_admin;
