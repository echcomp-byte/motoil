/**
 * Israeli motor-vehicle license plate validation.
 *
 * Israeli plates are all-digit. Two formats are currently in use:
 *   - Old (pre-2017):  7 digits, displayed as XXX-XX-XX  (e.g. "1234567")
 *   - New (post-2017): 8 digits, displayed as XXX-XX-XXX (e.g. "12345678")
 *
 * Motorcycles use the same plate scheme as cars (no separate format), with
 * digits assigned from a different range. We don't enforce the range here —
 * a plate is a plate. The display formatting is also done here.
 *
 * Only whitespace and hyphens are accepted as separators in user input.
 * Anything else (letters, emoji, Hebrew, etc.) is rejected — strict to avoid
 * the silent-strip class of bug ("ABC 1234" should not become "1234").
 */

const DIGIT_RE = /^\d+$/;

/**
 * Strips whitespace and hyphens. Returns null if the remainder is not all digits.
 */
function extractDigits(input: string): string | null {
  const cleaned = input.replace(/[\s\-]+/g, "");
  return DIGIT_RE.test(cleaned) ? cleaned : null;
}

/**
 * Returns true iff `input` is a 7- or 8-digit Israeli plate (with or without
 * separators). Rejects any non-digit, non-separator character.
 */
export function isValidIsraeliLicensePlate(input: string): boolean {
  if (typeof input !== "string") return false;
  const digits = extractDigits(input);
  if (digits === null) return false;
  return digits.length === 7 || digits.length === 8;
}

/**
 * Returns the canonical hyphenated display form, or null if invalid.
 *   7 digits → "XXX-XX-XX"
 *   8 digits → "XXX-XX-XXX"
 */
export function formatIsraeliLicensePlate(input: string): string | null {
  if (!isValidIsraeliLicensePlate(input)) return null;
  const d = extractDigits(input)!;
  return `${d.slice(0, 3)}-${d.slice(3, 5)}-${d.slice(5)}`;
}

/**
 * Returns the digits-only canonical form for storage, or null if invalid.
 * The DB column is `license_plate text` — store plain digits so the public
 * QR card can reformat for display without re-parsing user input.
 */
export function normalizeIsraeliLicensePlate(input: string): string | null {
  if (!isValidIsraeliLicensePlate(input)) return null;
  return extractDigits(input)!;
}
