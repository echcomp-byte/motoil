# Dependencies

Every package in `package.json`, why it's here, and what to know.

If you add or remove a dependency, **update this file in the same PR**.

---

## `.npmrc legacy-peer-deps=true`

`expo-router@56.2.7` depends on Radix UI components whose `react-dom` peer range hasn't caught up with React 19.2. `npm install` fails with an `ERESOLVE` without the flag.

**Workaround owner:** tech lead
**Revisit date:** **2026-08-01**
**How to revisit:** delete the line in `.npmrc`, run `npm install`. If it succeeds → commit. If not → bump the date by ~3 months and add a note here.

---

## Runtime dependencies

| package | version | role |
|---|---|---|
| `expo` | `~56.0.6` | SDK metapackage — the engine |
| `expo-router` | `~56.2.7` | file-based navigation under `app/` |
| `expo-linking` | `~56.0.12` | deep-link parsing — needed for the `motoil://auth-callback` email-confirm flow |
| `expo-constants` | `~56.0.16` | reads `Constants.expoConfig.extra.*` — used internally by Expo Router |
| `expo-status-bar` | `~56.0.4` | declarative status-bar style, swaps light/dark via `ThemedStatusBar` |
| `expo-localization` | `~56.0.6` | reads device locale for i18n init (`getLocales()[0].languageCode`) |
| `expo-updates` | `~56.0.17` | OTA via EAS channels; also gives us `Updates.reloadAsync()` after the RTL flip |
| `expo-dev-client` | `~56.0.16` | custom dev runtime — we don't use Expo Go, we use a signed dev build |
| `expo-apple-authentication` | `~56.0.4` | Apple Sign-In native bindings + the official `AppleAuthenticationButton` UI |
| `@react-native-google-signin/google-signin` | `^16.1.2` | Google Sign-In native bindings; returns ID token for Supabase verification |
| `react-native` | `0.85.3` | the runtime |
| `react` | `19.2.3` | UI library |
| `react-native-safe-area-context` | `~5.7.0` | `SafeAreaView` + `SafeAreaProvider` (notch-aware insets) |
| `react-native-screens` | `4.25.2` | native screen container — required by Expo Router/React Navigation |
| `@react-native-async-storage/async-storage` | `2.2.0` | persistent KV for Supabase session storage |
| `react-native-url-polyfill` | `^3.0.0` | `URL`/`URLSearchParams` for `@supabase/supabase-js` fetch implementation in RN |
| `@supabase/supabase-js` | `^2.106.2` | Postgres + auth client |
| `i18next` | `^26.3.0` | i18n engine |
| `react-i18next` | `^17.0.8` | React bindings (`useTranslation`) |
| `zod` | `^4.4.3` | runtime input validation + parsing |
| `@tanstack/react-query` | `^5.100.14` | server-state cache + mutations. Provider mounted in `app/_layout.tsx` between Theme and Auth. Query keys live in `src/lib/supabase/queries/*.ts` per-feature (use the `profileKeys`-style factories, never inline arrays). |
| `react-hook-form` | `^7.76.1` | form state + validation. Used in `src/features/profile/ProfileForm.tsx` with the `Controller` pattern around `TextInput` / chip-row pickers. |
| `@hookform/resolvers` | `^5.4.0` | bridges Zod schemas into react-hook-form's `resolver` slot. `zodResolver(profileSchema)`. |
| `react-native-qrcode-svg` | `^6.3.21` | renders the rescue-card QR as inline SVG (no native module) for the QR tab. Used by `src/features/qr/` (Dev C). |
| `react-native-svg` | `15.15.4` | peer dep of `react-native-qrcode-svg`. Also positions us for future inline vector UI without adding a second SVG runtime. |
| `expo-print` | `~56.0.3` | iOS UIPrintInteractionController + Android print framework. Used by the QR tab to print the rescue card to a physical printer (helmet/bike sticker workflow). No config plugin required. |
| `expo-sharing` | `~56.0.14` | system share sheet (`Sharing.shareAsync(uri)`) — lets the user export the printable PDF/PNG to AirDrop, WhatsApp, Files. Requires the `expo-sharing` plugin entry in `app.json` (added in this PR) — dev builds must be rebuilt to pick it up. |

---

## Dev dependencies

| package | version | role |
|---|---|---|
| `typescript` | `~6.0.3` | type checker |
| `@types/react` | `~19.2.2` | React 19 type defs |
| `eslint` | `^9.39.4` | linter (flat config) |
| `eslint-config-expo` | `^56.0.4` | Expo's recommended rule set |
| `eslint-config-prettier` | `^10.1.8` | turns off ESLint rules that Prettier handles |
| `eslint-plugin-prettier` | `^5.5.6` | runs Prettier as an ESLint rule |
| `prettier` | `^3.8.3` | formatter |
| `supabase` | `^2.101.0` | CLI (`npx supabase` — login, db pull, gen types, link) |
| `vitest` | `^4.1.7` | unit-test runner for pure-TS modules (validators, future helpers). Pure-Node environment — does NOT run RN components. If Dev D needs RN component testing later, they should add `jest-expo` as a separate runner. |

---

## Adding a dependency — checklist

1. Discuss in `#motoil` first if the package is non-trivial (auth, native code, large bundle).
2. Install with the right flag: `npx expo install <name>` for anything Expo-maintained, `npm install <name>` for pure JS, both with `--legacy-peer-deps` until flag #2 is resolved.
3. Run `npm run typecheck` + `npm run lint` + `npx expo export --platform ios` before pushing — confirms the bundler can resolve.
4. Add a row to the table above (1 line: role).
5. If the package needs a config plugin, add it in `app.json` (or `app.config.ts` if it requires runtime env vars).
6. If the package needs env vars, document them in `README.md` + `.env.example`.

## Removing a dependency

Same as adding, in reverse. Delete the row here. Run `npm prune` after removing from `package.json` to clean the lockfile.
