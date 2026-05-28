# MotoIL — Israeli Motorcycle Rider App

React Native app (Expo + Supabase) for motorcycle riders in Israel. Emergency profile, bike garage, public QR card, and home-screen widget.

## Quick start

```bash
npm install
cp .env.example .env   # then fill in Supabase keys
npx expo start
```

## Requirements

- Node 20+
- Expo CLI (`npx expo` works without global install)
- Xcode 16+ for iOS, Android Studio for Android
- Supabase project (URL + anon key)

## Environment

Copy `.env.example` to `.env` and set:

- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`

`EXPO_PUBLIC_*` is the only prefix that leaks to the client bundle.

## Scripts

| script | what |
|---|---|
| `npm start` | Expo dev server |
| `npm run ios` | open iOS simulator |
| `npm run android` | open Android emulator |
| `npm run lint` | ESLint check |
| `npm run typecheck` | TypeScript no-emit |
| `npm test` | unit tests (placeholder until Day 5+) |

## Structure

```
app/                  Expo Router screens (file-based routing)
src/
  features/          per-feature folders (devs add here)
  lib/
    supabase/        client + types
    i18n/            translations (he default, en fallback)
    theme/           colors + typography (light + dark)
    validation/      Israeli ID, phone, etc.
  components/        shared UI
supabase/
  migrations/        SQL migrations (numbered)
```

## Branches & ownership

See `docs/HANDOFF.md` (created on Day 5) for the per-developer split.

## License

MIT — see [LICENSE](LICENSE).
