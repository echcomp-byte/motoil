#!/usr/bin/env node
/**
 * Generates a Sign In with Apple client secret JWT for Supabase.
 *
 * Why this exists:
 * Supabase's "Apple provider → Secret Key (for OAuth)" field requires a
 * pre-signed ES256 JWT. The underlying .p8 key from Apple stays the same;
 * the JWT must be regenerated every 6 months because Apple caps the JWT
 * exp to 15777000 seconds (~6 months).
 *
 * How to use:
 *   1. Make sure ~/Downloads/AuthKey_<KEY_ID>.p8 exists (download from
 *      developer.apple.com → Keys → your key → re-download is NOT possible
 *      so keep it safe; if lost, generate a new key and update KEY_ID here).
 *   2. node scripts/generate-apple-jwt.js | pbcopy
 *   3. Paste into Supabase Dashboard → Auth → Providers → Apple →
 *      Secret Key (for OAuth) → Save.
 *
 * See docs/APPLE_SIGNIN_RENEWAL.md for the full renewal checklist.
 *
 * NOTE: This script reads the .p8 from ~/Downloads/. The .p8 itself is a
 * secret and must NEVER be committed to git. Don't paste its contents into
 * Slack/chat either.
 */

const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

// Constants from Apple Developer Portal — these are NOT secrets.
const TEAM_ID = 'RZ944JNCFB';
const KEY_ID = '6YHXFZ4NJC';
const SERVICE_ID = 'com.echcomp.motoil';

const P8_PATH = path.join(process.env.HOME, 'Downloads', `AuthKey_${KEY_ID}.p8`);

if (!fs.existsSync(P8_PATH)) {
  console.error(`ERROR: .p8 not found at ${P8_PATH}`);
  console.error('Download the key from Apple Developer Portal and put it there.');
  process.exit(1);
}

const privateKey = fs.readFileSync(P8_PATH, 'utf8');

const header = {
  alg: 'ES256',
  kid: KEY_ID,
  typ: 'JWT',
};

const now = Math.floor(Date.now() / 1000);
const payload = {
  iss: TEAM_ID,
  iat: now,
  exp: now + 15552000, // 180 days (Apple max is 15777000 ≈ 6 months)
  aud: 'https://appleid.apple.com',
  sub: SERVICE_ID,
};

const b64 = (obj) => Buffer.from(JSON.stringify(obj)).toString('base64url');
const signingInput = `${b64(header)}.${b64(payload)}`;

const signer = crypto.createSign('SHA256');
signer.update(signingInput);

// dsaEncoding: 'ieee-p1363' gives raw R||S (64 bytes for ES256), which is
// what JWT expects. The Node default would emit DER-encoded signatures and
// Apple would reject them.
const signature = signer
  .sign({
    key: privateKey,
    dsaEncoding: 'ieee-p1363',
  })
  .toString('base64url');

const jwt = `${signingInput}.${signature}`;

const expDate = new Date(payload.exp * 1000).toISOString().slice(0, 10);
console.error(`Generated JWT, expires ${expDate} (~180 days from now).`);
console.error(`Length: ${jwt.length} chars.`);
console.log(jwt);
