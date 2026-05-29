/**
 * Teudat Zehut (Israeli national ID number) validation.
 *
 * A Teudat Zehut is between 5 and 9 digits. Shorter IDs are left-padded with zeros
 * to make a 9-digit canonical form, and then a weighted-digit checksum is applied:
 *
 *   For each digit at position i (1-indexed from left of the 9-digit form):
 *     - multiply by 1 if i is odd, by 2 if i is even
 *     - if the product is two digits, sum them (e.g. 16 → 1 + 6 = 7)
 *   The ID is valid iff the sum of all nine results is divisible by 10.
 *
 * This module deliberately avoids the npm packages that claim to do this — many
 * of them implement the algorithm wrong (off-by-one position, wrong weight order,
 * or no zero-padding). Source: https://en.wikipedia.org/wiki/Israeli_identity_card
 * (checksum section) and the official Population Registry spec.
 *
 * Validator is pure and strict: whitespace + hyphens are formatting and stripped;
 * any other non-digit content (letters, emoji, Hebrew) rejects the input.
 *
 * This module is the source of truth for ID validation across the app — Dev B's
 * lockscreen widget snapshot trusts the DB value (written here at form submit),
 * and Dev C's public QR card re-formats it for display via this module only.
 */

const DIGIT_RE = /^\d+$/;

/**
 * Strips whitespace and hyphens. Does not strip leading zeros (those are
 * meaningful — they're how short IDs become 9-digit canonical form).
 */
function normalize(input: string): string {
  return input.replace(/[\s-]+/g, "");
}

/**
 * Returns true iff `input` is a syntactically valid Teudat Zehut with a passing
 * checksum. Accepts 5–9 digits in `input` (with or without internal hyphens/whitespace).
 *
 * Examples:
 *   isValidTeudatZehut("000000018") → true   (Wikipedia's worked example, padded)
 *   isValidTeudatZehut("00018")     → true   (same ID, 5-digit unpadded form)
 *   isValidTeudatZehut("123456782") → true   (passes checksum)
 *   isValidTeudatZehut("123456789") → false  (fails checksum)
 *   isValidTeudatZehut("12345")     → false  (fails checksum after padding)
 *   isValidTeudatZehut("1234")      → false  (too short, < 5 digits)
 */
export function isValidTeudatZehut(input: string): boolean {
  if (typeof input !== "string") return false;
  const normalized = normalize(input);
  if (!DIGIT_RE.test(normalized)) return false;
  if (normalized.length < 5 || normalized.length > 9) return false;

  const padded = normalized.padStart(9, "0");

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    const digit = Number(padded[i]);
    const weight = i % 2 === 0 ? 1 : 2;
    const product = digit * weight;
    sum += product > 9 ? product - 9 : product;
  }

  return sum % 10 === 0;
}

/**
 * Returns the 9-digit canonical form of a Teudat Zehut if valid, otherwise null.
 * The DB column `profiles.teudat_zehut` should store this canonical form, so
 * downstream consumers (widget snapshot, QR card, future analytics) get one shape.
 */
export function normalizeTeudatZehut(input: string): string | null {
  if (!isValidTeudatZehut(input)) return null;
  return normalize(input).padStart(9, "0");
}
