-- 0003_public_rate_limits.sql
--
-- Per-token, per-minute rate-limit counter for the public-profile Edge
-- Function (Dev C, feat/qrweb). Backs the 10 req/min/token cap that
-- protects the public rescue page at /p/<token>.
--
-- Architecture (per ADR motoil_decisions): Postgres counter, not Upstash.
--
-- Layered rate-limit model (per Dev A review N4):
--   - This table is the *token* layer: per-token, per-minute.
--   - Per-IP and per-country buckets belong at the Edge Function layer,
--     not the DB. They compose with this; they do not replace it.
--
-- Schema authority: Dev A. Reviewed in issue #5 (round 2). Revisions in
-- this file address blockers B1+B2, should-fixes S1+S2+S3, and nits N1-N4
-- from that review.
--
-- Forward-only. No backfill needed (table is new).

-- ---------------------------------------------------------------------------
-- Table
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.public_rate_limits (
  token         uuid    NOT NULL,
  minute_bucket bigint  NOT NULL,   -- floor(epoch_seconds / 60), UTC, computed by the DB.
  hits          integer NOT NULL DEFAULT 1,
  PRIMARY KEY (token, minute_bucket),
  -- B1: FK to public_tokens(token) so a rate-limit row cannot exist for a
  -- token that was never minted. ON DELETE CASCADE means revoking a token
  -- (Dev C UI calls DELETE) also wipes any in-flight counters for it, so
  -- the counter cannot outlive its parent. Prereq UNIQUE(token) on
  -- public_tokens was confirmed via pg_constraint inspection (constraint
  -- name: public_tokens_token_key).
  FOREIGN KEY (token) REFERENCES public.public_tokens (token) ON DELETE CASCADE
);

-- S2: gc() does DELETE WHERE minute_bucket < X. The PK is prefix-ordered on
-- token first, so it cannot serve that scan. A dedicated single-column index
-- on minute_bucket pays a small write cost in exchange for a big read win at
-- gc time (relevant once we have many minute-buckets in flight at peak).
CREATE INDEX IF NOT EXISTS public_rate_limits_minute_bucket
  ON public.public_rate_limits (minute_bucket);

-- RLS: deny all by default. The SECURITY DEFINER function below is the only
-- intended access path. service_role bypasses RLS automatically, so deploy
-- code is unaffected; anon/authenticated paths have no policy and thus no
-- access — which is what we want (the rate-limit table is opaque infra).
ALTER TABLE public.public_rate_limits ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE  public.public_rate_limits IS
  'Per-token, per-minute hit counter for the public-profile Edge Function. Pruned daily by public_profile_rate_limit_gc().';
COMMENT ON COLUMN public.public_rate_limits.minute_bucket IS
  'floor(epoch_seconds / 60), UTC. Computed inside public_profile_rate_limit_hit so the caller cannot skew bucket boundaries.';

-- ---------------------------------------------------------------------------
-- Atomic bump-and-return
-- ---------------------------------------------------------------------------
--
-- N2 (review-trigger note for future maintainers): this function is
-- SECURITY DEFINER. Any change to the function body must be re-reviewed
-- for privilege escalation — the executing role is the function owner,
-- not the caller. Keep the body trivial; do not add table writes outside
-- public_rate_limits.

CREATE OR REPLACE FUNCTION public.public_profile_rate_limit_hit(
  p_token uuid
)
RETURNS integer
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  -- B2: minute_bucket is computed inside the function. The caller used to
  -- pass it; that was a trust boundary bug — a buggy or rogue caller could
  -- collapse all hits into one row (always-rate-limited) or push them into
  -- the future (never-rate-limited). epoch_seconds is UTC by definition,
  -- so there is no time-zone footnote.
  INSERT INTO public.public_rate_limits (token, minute_bucket, hits)
  VALUES (p_token, (extract(epoch FROM now()) / 60)::bigint, 1)
  ON CONFLICT (token, minute_bucket)
  DO UPDATE SET hits = public_rate_limits.hits + 1
  RETURNING hits;
$$;

REVOKE ALL    ON FUNCTION public.public_profile_rate_limit_hit(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.public_profile_rate_limit_hit(uuid) TO service_role;

-- ---------------------------------------------------------------------------
-- Garbage collection
-- ---------------------------------------------------------------------------
--
-- N1: the window is 24 hours so that:
--   - support tickets ("I got rate-limited") can be reproduced/audited
--     within the same day
--   - load tests that span minutes-to-hours leave a useful trail
--   - the table never grows unbounded between cron ticks if gc misses one
-- 24h was picked over "1h" (too short for support) and "7d" (no real
-- diagnostic value past the same day, and 7x the storage).
--
-- S1 caller: the public-profile Edge Function calls this opportunistically
-- on roughly 0.1% of requests (Math.random() < 0.001). At 10 req/min/token
-- cap and a non-trivial user base, this fires often enough to drain the
-- table without scheduling pg_cron. No extension dependency.

CREATE OR REPLACE FUNCTION public.public_profile_rate_limit_gc()
RETURNS integer
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  WITH gone AS (
    DELETE FROM public.public_rate_limits
     WHERE minute_bucket < (extract(epoch FROM now()) / 60)::bigint - 1440
     RETURNING 1
  )
  SELECT count(*)::integer FROM gone;
$$;

REVOKE ALL    ON FUNCTION public.public_profile_rate_limit_gc() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.public_profile_rate_limit_gc() TO service_role;

-- ---------------------------------------------------------------------------
-- N3: Cost expectation (to be benchmarked under representative load)
-- ---------------------------------------------------------------------------
--   - 1 row per (token, minute_bucket). With cap 10/min and gc at 24h, the
--     steady-state table size is bounded by ~1440 rows per active token.
--   - One round-trip per request: INSERT ... ON CONFLICT DO UPDATE.
--   - Expected p99 ~5 ms on eu-west-3 from the Edge Function runtime
--     (in-region). Measure under representative load before quoting in
--     external docs.
