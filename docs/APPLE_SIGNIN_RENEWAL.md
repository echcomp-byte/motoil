# Apple Sign-In JWT — Renewal Checklist

Supabase's Apple provider stores a JWT signed with our Apple Sign-In key.
Apple caps that JWT to ~6 months; after expiry, **web** Sign In with Apple
breaks for everyone. (Native iOS Sign In keeps working — it uses Apple's
public keys for verification, no Supabase secret involved.)

## Next renewal due

**2026-11-25** — set a calendar reminder.

When the current JWT expires the Supabase Auth logs will show
`invalid_client` errors on Apple callbacks. That's the only signal.

## Renewal — 2 minutes

```bash
cd ~/motoil
node scripts/generate-apple-jwt.js | pbcopy
```

Then:

1. Open https://supabase.com/dashboard/project/wiwyxtccnkpvracmsuje/auth/providers
2. Click **Apple**
3. Clear **Secret Key (for OAuth)**
4. `Cmd+V` (paste the new JWT)
5. **Save**

Verify: try Sign In with Apple on a real account, confirm session lands.

## What's in the JWT

| Claim | Value | Why |
|---|---|---|
| `alg` | ES256 | Apple's required algorithm |
| `kid` | `6YHXFZ4NJC` | Identifies which Apple key signed |
| `iss` | `RZ944JNCFB` (Team ID) | Tells Apple which team |
| `sub` | `com.echcomp.motoil` | Service ID (= bundle ID) |
| `aud` | `https://appleid.apple.com` | Apple OAuth endpoint |
| `iat` | now | issued at |
| `exp` | now + 180 days | Apple max ~6 months |

None of those values are secrets. The `.p8` private key used to sign is —
keep it out of git and out of chat.

## If the `.p8` is lost

Apple does not let you re-download. You'd need to:

1. developer.apple.com → Keys → revoke the old key
2. Create a new Sign In with Apple key, download the new `.p8`
3. Update `KEY_ID` in `scripts/generate-apple-jwt.js`
4. Save the new `.p8` to `~/Downloads/AuthKey_<NEW_KEY_ID>.p8`
5. Run the renewal flow above
