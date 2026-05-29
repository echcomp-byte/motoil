# QR feature — iOS Simulator verification (Day 3)

Screenshots captured during runtime verification of #14 on iPhone 17 Pro (iOS 26.5). Build via `npx expo run:ios --device "iPhone 17 Pro"`.

| # | file | what |
|---|---|---|
| 1 | `01-profile-tab.png` | Initial state after the dev build launches — user `chemouni1999@gmail.com` is signed in (session persisted in AsyncStorage from a prior session). The profile tab (Dev A, #12) renders correctly in Hebrew/RTL. Confirms the QR PR rebases cleanly on top of the profile feature. |
| 2 | `02-qr-lazy-mint.png` | QR tab opened. `usePublicToken` had no existing token for this user → it minted a fresh row via `INSERT INTO public_tokens (user_id) VALUES (...)` and React Query returned it. `QRCard` rendered the URL `https://motoil-gbbovetlb-echcomp-bytes-projects.vercel.app/p/<token>` as a scannable QR (ECC level H). Tab bar shows "קוד QR" active. Rotate button "החלף את הקוד" present and styled. |

## DB-level proof of lazy mint

The token visible in screenshot 2 (`e73a4634-…`) corresponds to a row that did not exist before the QR tab was opened. Queried at the moment of capture:

```
id          | e7b29dc6-606f-4f29-99bc-4b3ee50d05be
user_id     | f21a250a-4ee3-49e4-8b78-6cc459940c73  (= chemouni1999@gmail.com)
token       | e73a4634-ad8e-4cb4-981e-a7f2fd1242d3  (matches the URL on screen)
revoked_at  | null
created_at  | 2026-05-29 14:36:16 UTC
```

This is the only `public_tokens` row for this user. The hook satisfies its contract: first visit ⇒ mint, subsequent visits ⇒ reuse.

## Notes

- **Rotate modal screenshot is intentionally missing.** The Mac shell environment running this session does not have macOS Accessibility permission to synthesise taps into the Simulator, so I could not script the tap on the rotate button. The rotation flow (revoke + insert + optimistic cache write) is exercised by `useRotatePublicToken` and was type-checked + lint-checked; runtime confirmation is left to PM's review session.
- **Locale**: captured in Hebrew per `forceRTL(true)` in `app/_layout.tsx`. EN locale rendering of the QR screen was not captured for the same reason — switching locales mid-session requires an interactive control I cannot script. The i18n keys are verified by inspection in both `he.json` and `en.json`.
- **lockscreen-bridge plugin**: removed temporarily from `app.json` to get past the resolver bug in #17 during the build. App.json was reverted before any commit; the screenshots reflect a build that ran without the lockscreen-bridge entitlement applied, but that plugin only affects iOS App Group + Android Widget — both orthogonal to the QR feature.
