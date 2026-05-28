# MotoIL — Israeli Motorcycle Rider App

React Native (Expo + Supabase) app for motorcycle riders in Israel: emergency profile, bike garage, public QR rescue card, home-screen widget. Hebrew-first (RTL), dark/light theme, email + Apple + Google sign-in.

## Quick start (clean clone → running app in 5 commands)

```bash
git clone https://github.com/echcomp-byte/motoil.git
cd motoil
cp .env.example .env                      # then fill in values from PM
npm install --legacy-peer-deps
npx expo run:ios
```

**First boot, RTL flip:** the app forces `I18nManager.forceRTL(true)` on first mount. In dev, `Updates.reloadAsync` is a no-op, so press **⌘R** once after the first launch and RTL sticks from there.

## Prerequisites

- Node **20+** (use `nvm use 20` or similar)
- npm 10+ (ships with Node 20)
- Xcode 16+ with iOS Simulator (iOS dev) — or Android Studio with an AVD (Android dev)
- A working Supabase project (URL + anon key from PM)
- For OAuth runtime testing: Google Cloud client IDs + Apple Developer entitlements (see `docs/SUPABASE_OAUTH.md`)

## Environment

Copy `.env.example` to `.env` and fill in. Only `EXPO_PUBLIC_*` vars leak into the client bundle.

| var | required for | where it comes from |
|---|---|---|
| `EXPO_PUBLIC_SUPABASE_URL` | everything | Supabase dashboard → project settings → API |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | everything | same as above |
| `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID` | Google Sign-In on iOS | Google Cloud Console → Credentials → iOS OAuth client |
| `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` | Google Sign-In token verification | Google Cloud Console → Credentials → Web OAuth client (also pasted in Supabase → Auth → Providers → Google) |

App boots without the Google vars — the OAuth button surfaces a translated `googleNotConfigured` error if pressed.

## Scripts

| script | what |
|---|---|
| `npm start` | Metro dev server (use with a dev-client build, not Expo Go) |
| `npm run ios` | `expo run:ios` — builds + launches on Simulator/device |
| `npm run android` | `expo run:android` — builds + launches on emulator/device |
| `npm run web` | `expo start --web` (not officially supported for v1) |
| `npm run lint` | ESLint check |
| `npm run lint:fix` | ESLint autofix |
| `npm run format` | Prettier write |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | placeholder (Phase 1 onward) |

## Structure (3 levels deep)

```
app/                    Expo Router file-based routes
  (auth)/               unauthenticated stack (login, signup)
  (tabs)/               authenticated tabs (profile, bikes, qr, settings)
  _layout.tsx           root: i18n init + RTL + Theme + Auth + RouteGuard
src/
  features/
    auth/               AuthProvider, schema, OAuth providers (apple, google)
  lib/
    supabase/           client + generated Database type + barrel
    i18n/               i18next setup, he+en locales, forceRTL helper
    theme/              ThemeProvider, useTheme, light/dark palettes
    validation/         (empty — Dev A will add Israeli ID, phone, etc.)
  components/           (empty — shared UI lives here)
supabase/
  migrations/           SQL migrations (sync with `npx supabase db pull`)
docs/                   handoff + tech-debt + provider config notes
.github/workflows/      CI: lint + typecheck on PR + push
```

## More docs

- [docs/HANDOFF.md](docs/HANDOFF.md) — full handoff to Devs A/B/C/D (ownership map, worktree setup, open flags)
- [docs/DEPENDENCIES.md](docs/DEPENDENCIES.md) — every dependency, why it's here, and revisit dates
- [docs/SUPABASE_OAUTH.md](docs/SUPABASE_OAUTH.md) — wiring Apple + Google providers on the Supabase side
- [docs/CI_SECRETS.md](docs/CI_SECRETS.md) — GitHub Actions secrets the workflow needs

## Tech stack (one line each)

- **Expo SDK 56** + **React Native 0.85** + **React 19.2** — bleeding-edge mobile runtime
- **Expo Router 56** — file-based navigation
- **Supabase** (EU `eu-west-3`) — Postgres + auth + RLS
- **i18next** + `expo-localization` — he default, en fallback
- **Zod** — input validation
- **EAS** — build profiles: `development`, `preview`, `production`

## License

MIT — see [LICENSE](LICENSE).
