# OAuth provider configuration

How to wire Apple + Google sign-in end-to-end. The RN code is already done (Day 4). What's left is configuration in three places:

1. **Apple Developer Portal** / **Google Cloud Console** — provider source of truth
2. **Supabase Dashboard** → Auth → Providers — Supabase verifies the ID token against the provider
3. **`.env` + EAS secrets** — the app uses these at runtime to ask the provider for a token

Once all three are configured for a provider, the corresponding button in `app/(auth)/login.tsx` works end-to-end.

---

## Google

### A. Google Cloud Console

1. https://console.cloud.google.com → APIs & Services → Credentials → **Create OAuth client ID**.
2. Create **two** clients, both in the same project:
   - **iOS**
     - Application type: iOS
     - Bundle ID: `com.echcomp.motoil`
     - Note the **Client ID** (looks like `123456-abc.apps.googleusercontent.com`)
   - **Web application**
     - Application type: Web application
     - Authorized redirect URI: **the value Supabase shows you** in the next step (something like `https://wiwyxtccnkpvracmsuje.supabase.co/auth/v1/callback`)
     - Note both **Client ID** and **Client Secret**
3. (Optional, for Android later) create an **Android** client with the production SHA-1 from `eas credentials` and the same package id.

### B. Supabase Dashboard

1. https://supabase.com/dashboard/project/wiwyxtccnkpvracmsuje → Authentication → Providers → **Google** → enable.
2. Paste the **Web Client ID** + **Web Client Secret** from step A.2.
3. Save. Supabase shows the redirect URI to add back into the Web client (already done if you ordered the steps as above).

### C. App side

Add to `.env` (locally) and to GitHub Actions secrets (see `docs/CI_SECRETS.md`):

```
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=123456-abc.apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=123456-xyz.apps.googleusercontent.com
```

`app.config.ts` automatically picks up `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID`, reverses it into a URL scheme (`com.googleusercontent.apps.123456-abc`), and inserts the `@react-native-google-signin/google-signin` plugin entry into the prebuild config.

**You must rebuild the dev client after setting the iOS client ID** — Expo writes the URL scheme into `Info.plist` at prebuild time. Run `npx expo run:ios` (or `eas build --profile development`) again.

### D. Verify

Cold-launch the dev client → tap "Continue with Google" → Google account picker → grant scopes (`openid email profile`) → land on `/(tabs)`. Check Supabase Dashboard → Authentication → Users for a row with `provider: google`.

---

## Apple

**Blocked until PM unlocks the Apple Developer account.** Code is ready (`src/features/auth/providers/apple.ts`); follow the steps below once Apple's side is open.

### A. Apple Developer Portal

1. https://developer.apple.com → Certificates, Identifiers & Profiles → **Identifiers** → select `com.echcomp.motoil` (the bundle id from `app.json`).
2. Enable the **Sign In with Apple** capability. Save.
3. **Keys** → **Create a key** → enable **Sign In with Apple** → **Configure** the key against your App ID → download the `.p8` file (one-time download; store it safely).
4. Note the **Key ID** (10-character string) and your **Team ID** (10 characters, top-right of the portal).

### B. Generate the Supabase client secret (JWT)

Supabase's Apple provider needs a JWT signed by the `.p8` key. Generate it with:

```bash
# After installing Supabase CLI globally:
supabase secrets generate-apple-jwt \
  --team-id <YOUR_TEAM_ID> \
  --key-id <KEY_ID> \
  --client-id com.echcomp.motoil \
  --private-key-path ./AuthKey_<KEY_ID>.p8
```

(Or generate it manually with a JWT library — the algorithm is ES256, the audience is `https://appleid.apple.com`, valid for up to 180 days.)

### C. Supabase Dashboard

1. Authentication → Providers → **Apple** → enable.
2. **Client ID:** `com.echcomp.motoil`
3. **Client Secret:** the JWT from step B
4. Save.

The JWT expires every 180 days — set a calendar reminder to regenerate (or move to a longer-lived service-account JWT).

### D. EAS / Xcode side

```bash
eas credentials configure --platform ios
```

The CLI will discover the Sign-In capability on your App ID and re-sign the provisioning profile. After this, `npx expo run:ios` produces a binary that can actually call Apple's endpoint.

### E. Verify

Cold-launch the dev client → tap "Sign in with Apple" → Apple's native sheet → confirm → land on `/(tabs)`. Check Supabase Dashboard → Authentication → Users for a row with `provider: apple`.

---

## Common pitfalls

- **`emailRedirectTo: 'motoil://auth-callback'` not handled** — `app.json` has `scheme: "motoil"`, but Expo Router needs at least an `app/auth-callback.tsx` (or the deep link will land on the unmatched-route screen). For now, the email-confirm flow works because Supabase fully completes the confirm server-side; the deep link only triggers app reopen. If you need to handle params, add the route.

- **`Cannot read property 'iosClientId' of undefined`** in Google flow — env not loaded. Make sure `.env` is at repo root and contains both `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID` and `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`. Restart Metro after editing `.env`.

- **Apple button does nothing on Simulator** — Apple requires the Simulator to be signed into a working Apple ID via `Settings.app` inside the Simulator. Otherwise `signInAsync` rejects silently. Test on a real device if you suspect this.

- **`PLAY_SERVICES_NOT_AVAILABLE`** on Android — the emulator image must include Google Play Services. Use a "Google APIs" or "Google Play" system image, not "AOSP".

- **Wrong-iOS-Client-ID error after first build** — the URL scheme is baked into `Info.plist` at prebuild time. Changing the env var requires `npx expo prebuild --clean` or a fresh `expo run:ios`.
