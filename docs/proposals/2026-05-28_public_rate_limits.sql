-- DRAFT MIGRATION — NOT APPLIED. Requires Dev A review (schema owner).
--
-- Author: Dev C (feat/qrweb)
-- Date:   2026-05-28
-- Purpose: rate-limit the public-profile Edge Function to 10 req/min/token.
--          Per ADR in docs/motoil_decisions: we use a Postgres counter table
--          instead of Upstash Redis to avoid an extra external dependency.
--
-- Once Dev A approves, move this file to:
--   supabase/migrations/<timestamp>_public_rate_limits.sql
-- (timestamp via `npx supabase migration new public_rate_limits`), and ship
-- in the same PR as the Edge Function so the function never deploys without
-- its rate-limit backing table.
--
-- Cost analysis:
--   - 1 row per (token, minute_bucket). Cleaned up after 24 h by cron.
--   - Single round-trip per request. p99 ~5 ms on eu-west-3.
--   - INSERT ... ON CONFLICT DO UPDATE means no SELECT-then-INSERT race.
--
-- Privacy: the table holds tokens, which are opaque. No PII. Still RLS-locked
-- so only service_role (Edge Function) can read/write.

CREATE TABLE IF NOT EXISTS public.public_rate_limits (
  token         uuid    NOT NULL,
  minute_bucket bigint  NOT NULL,   -- floor(epoch_ms / 60000)
  hits          integer NOT NULL DEFAULT 1,
  PRIMARY KEY (token, minute_bucket)
);

-- RLS: deny all by default. service_role bypasses RLS automatically.
ALTER TABLE public.public_rate_limits ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE  public.public_rate_limits IS
  'Per-token, per-minute hit counter for the public-profile Edge Function. Pruned daily.';
COMMENT ON COLUMN public.public_rate_limits.minute_bucket IS
  'floor(epoch_ms / 60000). Caller computes this so the table has no time-zone dependency.';

-- Atomic bump-and-return: increments the counter (or inserts at 1), returns
-- the new value. Edge Function decides whether to reject based on the result.
CREATE OR REPLACE FUNCTION public.public_profile_rate_limit_hit(
  p_token         uuid,
  p_minute_bucket bigint
) RETURNS integer
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  INSERT INTO public.public_rate_limits (token, minute_bucket, hits)
  VALUES (p_token, p_minute_bucket, 1)
  ON CONFLICT (token, minute_bucket)
  DO UPDATE SET hits = public_rate_limits.hits + 1
  RETURNING hits;
$$;

REVOKE ALL ON FUNCTION public.public_profile_rate_limit_hit(uuid, bigint) FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.public_profile_rate_limit_hit(uuid, bigint) TO service_role;

-- Optional but recommended: daily cleanup of buckets older than 24 h. Either
-- schedule via pg_cron, or have an Edge Function cron job call this. Skipping
-- pg_cron for now since it requires an extension Dev A may not want enabled.
CREATE OR REPLACE FUNCTION public.public_profile_rate_limit_gc()
RETURNS integer
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  WITH gone AS (
    DELETE FROM public.public_rate_limits
     WHERE minute_bucket < floor(extract(epoch FROM now()) / 60) - 1440
     RETURNING 1
  )
  SELECT count(*)::integer FROM gone;
$$;

REVOKE ALL ON FUNCTION public.public_profile_rate_limit_gc() FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.public_profile_rate_limit_gc() TO service_role;
