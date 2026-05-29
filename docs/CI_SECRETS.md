# CI secrets

The GitHub Actions workflow at `.github/workflows/ci.yml` runs lint + typecheck on every PR and push to `main`. It does **not** need real Supabase or OAuth credentials — the workflow injects placeholders that keep `client.ts` from throwing at module-load time:

```yaml
env:
  EXPO_PUBLIC_SUPABASE_URL: https://placeholder.supabase.co
  EXPO_PUBLIC_SUPABASE_ANON_KEY: placeholder-anon-key
```

That covers the current CI. The list below is for the **future** workflow extensions you'll inevitably want (EAS builds, preview deploys, etc.) — add them now, use them later.

---

## Recommended GitHub secrets to add proactively

Go to **Settings → Secrets and variables → Actions → New repository secret** and add:

| name | value | used for |
|---|---|---|
| `EXPO_PUBLIC_SUPABASE_URL` | `https://wiwyxtccnkpvracmsuje.supabase.co` | future preview-build workflows that need the real URL |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | (anon key from Supabase Dashboard → API) | same |
| `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID` | (from GCP, see `docs/SUPABASE_OAUTH.md`) | future preview-build workflows |
| `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` | (from GCP) | same |
| `EXPO_TOKEN` | (from `npx eas whoami` → `eas login` → expo.dev → access token) | `eas build` / `eas submit` in CI |
| `SUPABASE_ACCESS_TOKEN` | (from `npx supabase login` → supabase.com → account → access tokens) | future workflows that run `supabase db push` or `supabase gen types` automatically |
| `EXPO_PUBLIC_POSTHOG_KEY` ✅ | (from PostHog Dashboard → Project Settings → Project API Key) — landed 2026-05-28 by PM | Phase 1 analytics — `posthog-react-native` reads this at bundle time |
| `EXPO_PUBLIC_POSTHOG_HOST` ✅ | `https://eu.i.posthog.com` (EU cloud — matches Supabase EU residency) — landed 2026-05-28 by PM | PostHog endpoint; EU host avoids cross-region data transfer |
| `EXPO_PUBLIC_SENTRY_DSN` | (from Sentry Dashboard → Settings → Projects → motoil → Client Keys (DSN)) | Phase 1 crash reporting — `@sentry/react-native` reads this at init |
| `SENTRY_AUTH_TOKEN` | (from Sentry → Settings → Account → API → Auth Tokens, scope `project:releases`) | sourcemap upload during `eas build`; server-side only (NOT prefixed `EXPO_PUBLIC_`) |
| `SENTRY_ORG` | (your Sentry org slug — visible in dashboard URL) | sourcemap upload target |
| `SENTRY_PROJECT` | `motoil` (suggested — confirm at project creation) | sourcemap upload target |

The first four follow the **EXPO_PUBLIC_*** convention because anything Expo will read them at bundle time the same way it would on a developer machine. Same applies to `EXPO_PUBLIC_POSTHOG_*` and `EXPO_PUBLIC_SENTRY_DSN` — they are client-bundled by design (PostHog/Sentry DSNs are public-by-design write-only keys).

`EXPO_TOKEN`, `SUPABASE_ACCESS_TOKEN`, and `SENTRY_AUTH_TOKEN` are **NOT** prefixed with `EXPO_PUBLIC_` — they are server-side only, never embedded in the client bundle.

---

## Obtaining PostHog + Sentry keys (Dev D, Phase 1)

**PostHog (free tier — 1M events/month):**
1. Sign up at https://eu.posthog.com (EU cloud — matches Supabase `eu-west-3`).
2. Create a project named `motoil`.
3. Project Settings → Project API Key → copy into local `.env` as `EXPO_PUBLIC_POSTHOG_KEY=phc_…`.
4. Add `EXPO_PUBLIC_POSTHOG_HOST=https://eu.i.posthog.com` to `.env`.
5. Add both to GitHub Actions secrets per the table above.
6. Update `.env.example` with the two keys (empty values).

**Sentry (free tier — 5k errors/month, 10k performance units):**
1. Sign up at https://sentry.io.
2. Create a project: platform = `React Native`, name = `motoil`.
3. Settings → Projects → motoil → Client Keys (DSN) → copy DSN into `.env` as `EXPO_PUBLIC_SENTRY_DSN=https://…@…ingest.sentry.io/…`.
4. Settings → Account → API → Auth Tokens → create token with scope `project:releases` → copy as `SENTRY_AUTH_TOKEN` (GitHub Actions secret only — server-side).
5. Note org slug + project slug for `SENTRY_ORG` / `SENTRY_PROJECT`.
6. Update `.env.example` with `EXPO_PUBLIC_SENTRY_DSN=` (empty value).

Both services have free tiers sized comfortably for our 50-tester rollout. Re-evaluate when MAU > 5k.

---

## How CI currently behaves

- **PR opened against `main`** → triggers two jobs in parallel: `lint`, `typecheck`. Both must pass for the PR's status checks to be green.
- **Push to `main`** (which only happens after a PR is merged) → same jobs run on the merged commit. Used by branch protection's "Require status checks to be up to date" rule.
- **Concurrency:** if a new commit lands on the same branch before the previous run finished, the previous run is **cancelled** (cleaner billing, faster signal).
- **Cache:** Node 20 with `cache: npm` — `~/.npm` is cached keyed on `package-lock.json` so installs are fast.
- **Peer deps:** `npm ci --legacy-peer-deps` (necessary; flag #2 in `docs/HANDOFF.md`).

---

## Adding a job — checklist

1. Edit `.github/workflows/ci.yml`.
2. Add the job under the existing `jobs:` map.
3. If the job needs a secret, add `env:` at the job level (NOT step level — easier to audit).
4. If the job uses tools beyond `node` (e.g. `bun`, `pnpm`, `python`), use the right `setup-*` action and pin the version.
5. If the new job should be a required check for `main`, **also update branch protection** (see `docs/HANDOFF.md` section on protection — or run `gh api ... required_status_checks.contexts[]=<new-job-name>`).

## What we are deliberately NOT running in CI yet

| not running | why | when to add |
|---|---|---|
| `npm test` | placeholder echo, no tests yet | Dev D adds Jest in Phase 1 |
| `expo export` | takes 90s+ per platform, would slow PRs | maybe add a single `expo export --platform ios` to a separate "build" job nightly |
| `eas build` | costs money on EAS | add a manual-dispatch workflow for `eas build --profile preview` when a PR is labeled `preview` |
| Lighthouse / a11y | RN, not web | web side (Dev C's `web/`) when it exists |
