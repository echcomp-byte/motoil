# Phase 1 CSP compromise — `script-src 'unsafe-inline'`

## Why this is here

Next.js 15 App Router injects inline `<script>` tags for hydration data, RSC
payloads, and Next's own runtime bootstrap. Our original strict CSP
(`script-src 'self'`) blocked them all. Functionally the page still works —
it's fully server-rendered and there's no interactive JS the user
depends on — but the CSP violations show up in Lighthouse as both
"Browser errors logged to the console" and "Inspector issues", and the
trace stops Lighthouse from completing further accessibility audits
(`document-title`, `landmark-one-main`) that need a hydrated DOM.

## Phase 2 fix

Migrate to nonce-based CSP via a Next.js middleware. The standard
pattern (per Next.js docs):

```ts
// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const csp = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "connect-src 'self' https://*.supabase.co",
    "font-src 'self' data:",
    "frame-ancestors 'none'",
    "base-uri 'none'",
    "form-action 'none'",
  ].join("; ");
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);
  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", csp);
  return response;
}

export const config = { matcher: "/((?!api|_next/static|_next/image|favicon.ico).*)" };
```

This requires removing the `Content-Security-Policy` line from
`vercel.json` so the middleware-set header isn't overridden.

## Risk assessment

`'unsafe-inline'` is the weakest mainstream CSP modifier for scripts —
it allows any inline `<script>` block to execute. The mitigating
factors on this specific page:

- **No user input is reflected**: the page renders \`profile\`, \`contacts\`,
  \`bike\` from a JSON Edge Function response. The Edge Function only
  returns structured fields; even if a future schema change introduced
  free-text, every field goes through React's text-node escaping. There
  is no `dangerouslySetInnerHTML` anywhere in `web/`.
- **No third-party origins in script-src**: still `'self'` only. An
  attacker cannot load a remote script.
- **`frame-ancestors 'none'`**: still prevents clickjacking.
- **`X-Frame-Options: DENY`**: defence in depth for older user agents.

The realistic XSS attack surface from this compromise is zero today and
narrow tomorrow (would need both a future codepath that interpolates
attacker-controlled HTML and a regression on React's escape). The
trade-off was: ship a working a11y story now, or fight Next.js' inline
scripts for a perfect CSP that doesn't change the actual risk profile.

Owner: Dev C. Revisit: Phase 2.
