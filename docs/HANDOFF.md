# MotoIL — Phase 0 Handoff

This is the document you should read **before touching code**. It describes what's done, who owns what next, and where the trapdoors are.

---

## A. Project state at handoff

- **Phase:** 0 complete. Foundation sealed.
- **Tag:** `v0.0.1-foundation`
- **Branch:** `main` — protected (as of 2026-05-28): PRs only, 1 review, `Lint` + `Typecheck` status checks required, no force-push, no deletion.
- **CI:** GitHub Actions, lint + typecheck on every PR and push to main.
- **4 feature branches** pushed and ready (`feat/profile`, `feat/lockscreen`, `feat/qrweb`, `feat/onboarding`). See **Section D** for worktree setup.
- **4 placeholder tab screens** in `app/(tabs)/` await each Dev.
- **Supabase:** EU `eu-west-3` (Paris). 4 tables (`profiles`, `emergency_contacts`, `bikes`, `public_tokens`), RLS on all of them, `handle_new_user` trigger auto-creates a profile row on signup. Email confirmation enforced.
- **Auth working today (verified end-to-end by PM on iOS Simulator):**
  - Email + password signup → email confirm link → login
  - Session persists across reloads
  - Logout returns to login screen
  - Hebrew error messages on wrong password
- **Auth coded but pending credentials (Day 4):**
  - Apple Sign-In (button on iOS only) — needs Apple Developer entitlement + `.p8` key uploaded to Supabase
  - Google Sign-In — needs GCP iOS + Web client IDs in `.env` + Web client ID/secret in Supabase Dashboard

---

## B. Tech decisions made (with context)

| decision | why |
|---|---|
| **Expo SDK 56 + React Native 0.85 + React 19.2** | bleeding-edge; first version where the new architecture is stable. Worth the peer-dep noise. |
| **`.npmrc` `legacy-peer-deps=true`** | `expo-router@56` pulls Radix UI deps that declare a wider `react-dom` peer range than React 19 satisfies. Workaround until either Radix updates peers or expo-router stops shipping them in v6. **Revisit: 2026-08-01.** Documented in `docs/DEPENDENCIES.md`. |
| **`typedRoutes: false`** | Expo Router 56's route-type generator did not pick up our `(auth)` and `(tabs)` groups (only `/` and `/_sitemap` ended up in the generated `.expo/types/router.d.ts`). Code uses string hrefs that are checked by router at runtime. Re-enable once Expo Router fixes group typing. |
| **Supabase EU (`eu-west-3` Paris)** | best round-trip latency from Israel; data residency for an Israeli-user product. |
| **Email confirmation required at signup** | matches the Israeli-rider trust model — no anonymous emergency cards. PM owns the policy. |
| **RTL forced in `_layout.tsx`** via `I18nManager.forceRTL(true)` | every Hebrew screen needs RTL even when device locale is English. Reload-aware (`Updates.reloadAsync`, no-op in dev — dev needs one manual ⌘R after first install). |
| **Theme palette: motoil red `#E53935` (light) / `#EF5350` (dark)** | brand. Dark scales lighter to keep contrast on dark backgrounds. |
| **`app.config.ts` overlay on `app.json`** | lets us add the `@react-native-google-signin/google-signin` plugin only when `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID` is set in env. Prebuild succeeds without the credentials. |
| **Hand-written Database types replaced with `supabase gen types` output** (`eac5468`) | source of truth = remote schema. Re-generate after every migration with `npx supabase gen types typescript --linked > src/lib/supabase/types.ts`. |
| **`AuthProvider` returns `errorKey` (i18n key)** instead of pre-translated message | locale-agnostic. Screen does `t(errorKey)`. |

---

## C. Open flags (NOT blocking, parked for someone to address later)

| # | flag | who | when | how to address |
|---|---|---|---|---|
| 1 | `typedRoutes: false` | anyone | when Expo Router 56.x fixes group typing | flip in `app.json`, re-add `.expo/types/**/*.ts` and `expo-env.d.ts` to `tsconfig.json` `include`, run a bundle, re-typecheck |
| 2 | `.npmrc legacy-peer-deps=true` | tech lead | **2026-08-01** | remove the line, run `npm install`. If it succeeds, commit. If not, push the date by ~3 months and document why. |
| 3 | i18n type-safe keys via module augmentation | anyone | Phase 1 polish | add `src/lib/i18n/i18next.d.ts` declaring `CustomTypeOptions['resources']` pointing at `he.json`. Free type-safety on `t('foo.bar')`. |
| 4 | `assets/google-logo.png` missing | Dev D | Phase 1 | drop the official multi-colour G from [Google Identity guidelines](https://developers.google.com/identity/branding-guidelines), re-add `<Image>` to login button (was removed in Day 4 — see git history). Google may reject submission without it. |
| 5 | Apple Sign-In credentials | PM | when Apple Developer unlock clears | run `eas credentials configure --platform ios`, then upload the `.p8` key + key ID + team ID to Supabase Dashboard → Auth → Providers → Apple |
| 6 | Google Sign-In credentials | PM | now | create iOS + Web OAuth clients in GCP, put both client IDs in local `.env` + GitHub Actions secrets (`docs/CI_SECRETS.md`), enable Google provider in Supabase Dashboard with the Web client ID + secret |
| 7 | `(tabs)` route on signed-in users initially lands on `/(tabs)/index` (profile) — works, but no animation/onboarding | Dev D | onboarding feature | will be replaced by the onboarding flow Dev D builds |
| ~~8~~ | ~~Branch protection on `main` NOT enforced~~ — **closed 2026-05-28**: repo made public, protection active (1 review + `Lint` + `Typecheck` required, no force-push, no deletion). | ✅ | — | — |
| ~~9~~ | ~~`actions/checkout@v4` + `actions/setup-node@v4` use Node.js 20 (deprecated on GitHub runners after 2026-06-02)~~ — **closed 2026-05-28** by Dev D: bumped both to `@v5` on `feat/onboarding`. | ✅ | — | — |

None of these block Phase 1 from starting.

---

## D. Worktree setup for Dev A/B/C/D

Each developer works in an isolated worktree to avoid stepping on each other's `node_modules` / `.expo`. From `~/motoil`:

```bash
# Dev A — profile + emergency contacts + bikes + DB migrations
git worktree add ../motoil-profile feat/profile

# Dev B — lockscreen widget (iOS WidgetKit + Android home widget + RN bridge)
git worktree add ../motoil-lockscreen feat/lockscreen

# Dev C — QR rescue card + public web page + Edge Function
git worktree add ../motoil-qrweb feat/qrweb

# Dev D — onboarding + settings + assets + docs
git worktree add ../motoil-onboarding feat/onboarding
```

In each worktree the first time:

```bash
cd ../motoil-<name>
cp ~/motoil/.env .env        # share the same .env (gitignored)
npm install --legacy-peer-deps
npx expo run:ios
```

When done with a feature, push the branch and open a PR to `main`. Delete the worktree with `git worktree remove ../motoil-<name>`.

---

## E. Ownership map

| Dev | owns | folders |
|---|---|---|
| **A** | Emergency profile + contacts + bike garage + DB schema | `src/features/profile/`, `src/features/emergency-contact/`, `src/features/bike/`, `supabase/migrations/`, validators in `src/lib/validation/` |
| **B** | Lockscreen / home-screen widget | `ios/MotoILWidget/`, `android/.../widget/`, `modules/lockscreen-bridge/`, `src/features/lockscreen/` |
| **C** | Public QR card + Edge Function + web page | `src/features/qr/`, `web/`, `supabase/functions/public-profile/` |
| **D** | Onboarding flow + settings + assets + legal docs + CI improvements | `src/features/onboarding/`, `src/features/settings/`, `assets/`, `.github/workflows/`, `docs/legal/` |

### Shared (require coordination via Slack `#motoil` BEFORE editing)

- `package.json` + `package-lock.json` — anyone adding a dependency must announce it
- `app.json` + `app.config.ts` — plugin or permission changes ripple to all dev builds
- `eas.json` — build profile changes affect release
- `src/lib/supabase/types.ts` — regenerated, not hand-edited; coordinate after migrations
- `app/_layout.tsx` — top-level providers, navigation guard, RTL — touching means a re-test for everyone
- `src/lib/i18n/locales/*.json` — adding keys is fine; restructuring namespaces is not

---

## F. Rules to NOT break

- **Don't flip `typedRoutes` to `true`** without also re-adding `.expo/types/**/*.ts` and `expo-env.d.ts` to `tsconfig.json` `include`. (Flag #1.)
- **Don't add a migration without Dev A's review** — schema is RLS-enforced and `handle_new_user` trigger depends on `profiles` shape.
- **Don't add a dependency without documenting it** in `docs/DEPENDENCIES.md` (1 line: what + why).
- **Don't `git push --force` to `main`.** Branch protection should block it, but don't try.
- **Don't skip CI hooks** (`--no-verify`, etc.).
- **Branch naming:** `<dev>/<feature>`, kebab-case. Examples: `feat/profile`, `fix/rtl-bug`. No spaces, no slashes beyond the type prefix.
- **PR to `main`:** 1 review + green CI (lint + typecheck). Two reviewers needed if you touch a SHARED file from Section E.

---

## G. Live infrastructure (Phase 1)

| service | what | URL |
|---|---|---|
| **Vercel** (project `echcomp-bytes-projects/motoil`) | hosts the public rescue page (`web/`). Root Directory = `web`. GitHub integration is wired — every PR gets an automatic preview deploy. Deployment Protection is intentionally **off** so paramedics can scan the QR without a Vercel login wall. Will be transferred to a Pro team in Phase 2 via "Transfer Project" — one button, no DNS churn. | https://motoil-gbbovetlb-echcomp-bytes-projects.vercel.app |
| **Supabase** (project `motoil`, ref `wiwyxtccnkpvracmsuje`) | EU `eu-west-3` Paris. Holds `profiles`, `emergency_contacts`, `bikes`, `public_tokens`, `public_rate_limits` (migration 0003), plus the `public-profile` Edge Function. Service-role used only inside the Edge Function — never exposed to the client. | https://wiwyxtccnkpvracmsuje.supabase.co |

The QR codes the RN app generates embed `${EXPO_PUBLIC_QR_BASE_URL}/p/<token>` — defaults to the Vercel URL above. Phase 2 swap to a custom domain (`ice.motoil.app` or similar) is a single env-var change across the RN app + the Vercel project; no code edits.

---

## H. Where to ask questions

- **Slack:** `#motoil`
- **PM:** Eli — `echcomp@gmail.com`
- **Codebase quirks:** this file + `docs/DEPENDENCIES.md` should cover 90%. If you find something not documented, **open a PR adding it to one of these files** as part of your work.

---

## I. Phase 0 commit log (for the curious)

```
5d93946 feat(day4): apple + google oauth + ci
2b9a648 chore: switch npm scripts to dev-client + tsconfig cleanup
eac5468 chore: sync types from real supabase schema
40f9a5a feat(day3): i18n + RTL + theme + dark mode
ed82a15 chore: eas init outputs
879ccf4 feat(day2): supabase client + email auth + routing guard
f2c69c1 chore: expo scaffold + tooling
d2f338b chore: initial commit
```

Welcome aboard. Build carefully — there will be motorcycle riders' lives downstream of this code.
