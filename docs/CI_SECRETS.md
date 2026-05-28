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

The first four follow the **EXPO_PUBLIC_*** convention because anything Expo will read them at bundle time the same way it would on a developer machine.

The last two (`EXPO_TOKEN`, `SUPABASE_ACCESS_TOKEN`) are **NOT** prefixed with `EXPO_PUBLIC_` — they are server-side only, never embedded in the client bundle.

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
