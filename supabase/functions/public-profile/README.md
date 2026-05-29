# `public-profile` Edge Function

Anonymous, read-only lookup of an emergency profile by opaque token.

## Endpoint

```
GET https://<project-ref>.functions.supabase.co/public-profile?token=<uuid>
```

Public — no `Authorization` header required. The token itself is the bearer.

## Responses

| status | body                                | meaning                                 |
|--------|-------------------------------------|-----------------------------------------|
| 200    | `{ profile, contacts, bike }`       | token resolved                          |
| 400    | `{ "error": "invalid_token" }`      | missing or malformed UUID v4            |
| 404    | `{ "error": "not_found" }`          | unknown, revoked, or expired token      |
| 429    | `{ "error": "rate_limited" }`       | >10 req/min for this token              |
| 500    | `{ "error": "upstream" }`           | DB or other upstream error              |

All responses include `Cache-Control: no-store`. Revocation must be observable immediately by the next request.

## Environment

Auto-injected by Supabase at runtime — do not set manually:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY` (required — function bypasses RLS on purpose)

## Rate limiting

Backed by Postgres function `public_profile_rate_limit_hit(token)` over table `public_rate_limits`. The function is defined in `supabase/migrations/0003_public_rate_limits.sql` (PR #13). `minute_bucket` is computed server-side inside the SECURITY DEFINER body so the caller cannot skew bucket boundaries.

Until 0003 is applied, the function fails open with a `console.warn` so dev work isn't blocked. **Do not deploy to production without 0003 applied.**

Garbage collection (`public_profile_rate_limit_gc`) is called opportunistically from this Edge Function with `Math.random() < 0.001`. At any non-trivial QPS this drains stale buckets without scheduling pg_cron. The ~1-in-1000 user pays a few milliseconds of inline gc latency.

## Deploy

```bash
cd ~/motoil-qrweb            # or wherever supabase/ lives
npx supabase functions deploy public-profile --project-ref <ref>
```

## Local test

```bash
npx supabase start
npx supabase functions serve public-profile --env-file ./supabase/.env.local
curl "http://localhost:54321/functions/v1/public-profile?token=00000000-0000-0000-0000-000000000401"
```

Seed the test data first — see `docs/seeds/dev_c_seed.sql`.

## Logs

`supabase functions logs public-profile --project-ref <ref>` or via Dashboard → Edge Functions → Logs. Tokens are logged truncated to first 8 chars to avoid leakage.
