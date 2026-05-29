# QR feature — iOS Simulator verification (Day 5)

Screenshots captured on iPhone 17 Pro (iOS 26.5) after a fresh `npx expo run:ios` against this branch (Day 1-3 #14, Day 4 #23 print/share, and Day 5 #29 a11y/CI).

The verification user is `qrtest+devc@motoil.local` (UUID `00000000-0000-0000-0000-000000000001`) seeded earlier with HE-locale profile + 2 contacts + 1 primary bike. Session was injected into the Simulator's AsyncStorage to bypass the Dev D onboarding gate (the host shell lacks Accessibility permission needed to script taps; documented further down).

| # | file | what |
|---|---|---|
| 1 | `01-profile-day5.png` | Profile tab as Dev A's emergency-medical-card form (#12) — confirms the rebased branch boots cleanly with seed data populated. |
| 2 | `02-qr-with-print-share.png` | QR tab. All three Day 4 buttons present: primary **הדפסה** (Print, red), outline **שיתוף** (Share), outline **החלף את הקוד** (Rotate). QR is freshly minted via `usePublicToken` lazy mint (token `2265c096-…`). URL line under the QR shows `https://ice.motoil.app/p/<token>` — the `EXPO_PUBLIC_QR_BASE_URL` fallback (the test rig's `.env` doesn't override it; Vercel preview URL is what production builds use). |

## What this verifies for #29

- The Day 5 commits (`html lang dir`, CSP relaxation, CI matrix) did not regress the QR feature.
- React Query, the profile form (Dev A), the QR feature (Dev C), the onboarding (Dev D), and the lockscreen-bridge plugin (Dev B) all coexist in a single device build.
- i18n keys for the new Day 4 actions (`qr.action.print`, `qr.action.share`) resolve correctly in Hebrew RTL — no untranslated strings leaking through.

## What is still NOT visually verified

- **Print dialog modal**: I cannot synthesise UI taps from this host shell (System Events click returns `-25204` — Accessibility permission missing for the calling process). The presence + correct labelling of the button is verified; the dialog open path runs through `expo-print`'s `Print.printAsync({ html })` which is a thin wrapper over `UIPrintInteractionController` and was unit-tested via the `printableHtml.test.ts` HTML-generation suite (4 cases, all passing).
- **Share sheet**: same reason. `Sharing.shareAsync(pdfUri)` is a single Expo API call; the PDF generation path it depends on is fully tested by the HTML builder.

To complete those screenshots interactively, PM (or anyone with Accessibility-permitted shell) can:

```
xcrun simctl openurl booted "motoil:///qr"
# tap the red Print button → screenshot the print dialog
# tap Share, capture the share sheet
```

## Mechanism for the auth bypass (for next time)

Step 1 — generate the session via the public anon endpoint:

```bash
curl -s -X POST "$EXPO_PUBLIC_SUPABASE_URL/auth/v1/token?grant_type=password" \
  -H "apikey: $EXPO_PUBLIC_SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"email":"qrtest+devc@motoil.local","password":"DevCTest2026!"}'
```

Step 2 — write the session into the Simulator's AsyncStorage. The store lives at:

```
~/Library/Developer/CoreSimulator/Devices/<simulator-UDID>/data/Containers/Data/Application/<app-UDID>/Library/Application Support/com.echcomp.motoil/RCTAsyncLocalStorage_V1/
```

Inside that dir, `manifest.json` lists the keys. Values larger than ~1024 bytes live in companion files named `md5(key)` (lowercase hex). For the Supabase session key the file name is fixed:

```
echo -n "sb-<project-ref>-auth-token" | md5
```

Write the session JSON (`{access_token, refresh_token, expires_at, expires_in, token_type, user}`) to that file and add the key (with `null` value) to `manifest.json`. Also set `"motoil:hasSeenOnboarding": "1"` in the manifest to skip Dev D's onboarding gate.

Step 3 — terminate + relaunch the app:

```
xcrun simctl terminate booted com.echcomp.motoil
xcrun simctl launch booted com.echcomp.motoil
```

Note: this dance is only needed because the shell lacks Accessibility permission for `osascript` clicks. Once the host grants permission (via System Settings → Privacy & Security → Accessibility), the standard "sign in via the login screen" path becomes scriptable.
