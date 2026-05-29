-- 0004_delete_my_account.sql
--
-- User-initiated account deletion. Backs Dev D's "Delete my account" button
-- in the Settings screen. Required by App Store + Play Store policies that
-- mandate an in-app deletion path.
--
-- App-side flow:
--   await supabase.rpc('delete_my_account');
--   await supabase.auth.signOut();   // local cleanup; JWT is dead anyway
--
-- Schema authority: Dev A. Coordinated with Dev D (PR drafter) — function
-- shape and grants are unchanged from Dev D's Slack draft; comments + the
-- explicit search_path were added here.
--
-- ---------------------------------------------------------------------------
-- Why each delete is here, in this order
-- ---------------------------------------------------------------------------
-- The deletes are listed children-first → parent-last so the function works
-- regardless of whether each FK is ON DELETE CASCADE or NO ACTION. Today
-- the FKs on profiles/bikes/emergency_contacts/public_tokens reference
-- auth.users with CASCADE (verified via pg_constraint inspection), so the
-- final `delete from auth.users` would in principle cascade everything.
-- Doing them explicitly anyway means:
--   (a) we don't depend on FK actions silently changing in a future
--       migration breaking deletion semantics;
--   (b) errors localise — a failure on `bikes` raises while bikes is the
--       active statement, not buried inside an auth-cascade trace.
--
-- public_rate_limits (added in 0003 with FK ON DELETE CASCADE → public_tokens)
-- cascades automatically when we delete public_tokens — no explicit step needed.
--
-- auth.users delete cascades to auth.identities, auth.sessions,
-- auth.refresh_tokens, auth.mfa_factors per Supabase defaults. We do not
-- use auth.admin.deleteUser() because that would require service_role and
-- a separate Edge Function round-trip; SECURITY DEFINER as the function
-- owner is sufficient.
--
-- ---------------------------------------------------------------------------
-- Audit trail — deliberately none, for now
-- ---------------------------------------------------------------------------
-- This function is irreversible and leaves no record. If/when ops needs a
-- "user X deleted at time Y" audit (for support, abuse investigation, or
-- chargeback handling), add a `deletion_audit` table in a future migration
-- and INSERT one row here before the deletes. The hashed email or anonymised
-- user_id is sufficient; raw email would defeat the deletion's purpose.

CREATE OR REPLACE FUNCTION public.delete_my_account()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
-- Explicit search_path so the function resolves `auth.users` correctly even
-- if the caller's session has a custom search_path set. Any change to the
-- function body must be re-reviewed for privilege escalation — executes
-- as the owner, not the caller.
SET search_path = public, auth
AS $$
DECLARE
  uid uuid := auth.uid();
BEGIN
  -- Defence-in-depth. The GRANT below restricts to `authenticated`, so an
  -- anonymous caller already cannot reach this. The check protects against
  -- the function being called from a service-role context that happens to
  -- have no JWT set — fail loud rather than wipe nothing silently.
  IF uid IS NULL THEN
    RAISE EXCEPTION 'not authenticated';
  END IF;

  -- Children of profiles + auth.users — deleted explicitly per the
  -- "errors localise" rationale above.
  DELETE FROM public.public_tokens       WHERE user_id = uid;
  DELETE FROM public.bikes               WHERE user_id = uid;
  DELETE FROM public.emergency_contacts  WHERE user_id = uid;

  -- profiles is FK'd to auth.users with CASCADE, but the explicit delete
  -- here keeps the intent visible and the order obvious.
  DELETE FROM public.profiles            WHERE id = uid;

  -- Finally the auth row. Cascades to auth.identities, auth.sessions,
  -- auth.refresh_tokens, auth.mfa_factors via Supabase defaults.
  DELETE FROM auth.users                 WHERE id = uid;
END;
$$;

REVOKE ALL    ON FUNCTION public.delete_my_account() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.delete_my_account() TO authenticated;

COMMENT ON FUNCTION public.delete_my_account() IS
  'Irreversibly deletes the calling user and all data owned by them. Required by App Store + Play Store policies. Backed by Dev D''s Settings UI.';
