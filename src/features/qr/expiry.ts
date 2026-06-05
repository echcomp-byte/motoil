// User-facing expiry presets for the QR sticker.
//
// The DB column is `public_tokens.expires_at timestamptz NULL`. NULL means
// "never expires" — matches existing rows minted before this feature
// shipped, so no migration is needed.
//
// Date math is done in JS rather than `now() + interval '7 days'` on the
// DB because the value needs to round-trip through the React Query cache
// and the user-facing label needs a concrete date — both want a fixed
// timestamp rather than a relative offset that drifts on every read.

export const EXPIRY_PRESETS = ["never", "1w", "1m", "3m", "1y"] as const;
export type ExpiryPreset = (typeof EXPIRY_PRESETS)[number];

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Resolves a preset to the ISO timestamp string Postgres expects for
 * `timestamptz`. `never` returns null (the DB column is nullable).
 *
 * `1m` is 30 days, `3m` is 90 days, `1y` is 365 days — calendar-month
 * granularity would surprise users who picked "1 month" on Jan 31 and
 * expected the token to die on Feb 28 vs. Mar 2. The 30/90/365 fixed
 * windows are simpler to reason about for a security-adjacent feature.
 */
export function computeExpiresAt(preset: ExpiryPreset, now: Date = new Date()): string | null {
  switch (preset) {
    case "never":
      return null;
    case "1w":
      return new Date(now.getTime() + 7 * DAY_MS).toISOString();
    case "1m":
      return new Date(now.getTime() + 30 * DAY_MS).toISOString();
    case "3m":
      return new Date(now.getTime() + 90 * DAY_MS).toISOString();
    case "1y":
      return new Date(now.getTime() + 365 * DAY_MS).toISOString();
  }
}

/**
 * Reverse direction: figure out which preset (if any) a current
 * expires_at value corresponds to. Used to highlight the currently
 * selected preset in the picker.
 *
 * The match is tolerant — within ±12 h of the canonical window so a
 * pick made 4 hours ago still lights up the same row. Anything outside
 * those windows is treated as "custom / manual edit" and no preset is
 * highlighted.
 */
export function detectPreset(expiresAt: string | null, now: Date = new Date()): ExpiryPreset | null {
  if (expiresAt === null) return "never";
  const remainingMs = new Date(expiresAt).getTime() - now.getTime();
  const remainingDays = remainingMs / DAY_MS;
  const TOLERANCE_DAYS = 0.5;
  if (Math.abs(remainingDays - 7) < TOLERANCE_DAYS) return "1w";
  if (Math.abs(remainingDays - 30) < TOLERANCE_DAYS) return "1m";
  if (Math.abs(remainingDays - 90) < TOLERANCE_DAYS) return "3m";
  if (Math.abs(remainingDays - 365) < TOLERANCE_DAYS) return "1y";
  return null;
}

export function isExpired(expiresAt: string | null, now: Date = new Date()): boolean {
  if (expiresAt === null) return false;
  return new Date(expiresAt).getTime() < now.getTime();
}
