/**
 * Israeli mobile phone number validation + normalization.
 *
 * Accepts inputs in many forms (with or without spaces, hyphens, plus sign,
 * country code) and reduces them to the canonical E.164 form `+9725XXXXXXXX`.
 *
 * Israeli mobile numbers are 10 digits in national form: 05X-XXXXXXX, where 5X
 * is one of the assigned mobile prefixes. As of 2026 the assigned prefixes are
 * 050, 052, 053, 054, 055, 056, 058 (Hot/Pelephone/Cellcom/etc.). We deliberately
 * accept any 05X (50–59) to be forward-compatible with new carriers.
 *
 * Landlines (02, 03, 04, 08, 09) are intentionally NOT accepted — emergency
 * contacts and rider contact info must be reachable from outside the office.
 */

const DIGIT_RE = /^\d+$/;

/**
 * Strips only allowed separators: whitespace, hyphens, parentheses, and leading `+`.
 * Returns null if anything else (letters, emoji, etc.) remains — that signals a
 * typo, not a formatting choice we should accept.
 */
function extractDigits(input: string): string | null {
  const cleaned = input.replace(/[\s\-+()]+/g, "");
  return DIGIT_RE.test(cleaned) ? cleaned : null;
}

/**
 * Returns true iff `input` looks like an Israeli mobile number (any common format).
 *
 * Examples:
 *   isValidIsraeliMobile("050-1234567")     → true
 *   isValidIsraeliMobile("0501234567")      → true
 *   isValidIsraeliMobile("+972 50 123 4567") → true
 *   isValidIsraeliMobile("972501234567")    → true
 *   isValidIsraeliMobile("050 1234567")     → true
 *   isValidIsraeliMobile("02-1234567")      → false (landline)
 *   isValidIsraeliMobile("0501234")          → false (too short)
 */
export function isValidIsraeliMobile(input: string): boolean {
  if (typeof input !== "string") return false;
  const digits = extractDigits(input);
  if (digits === null) return false;
  // National form: 10 digits starting with 05.
  if (digits.length === 10 && digits.startsWith("05")) return true;
  // International form: 12 digits starting with 9725.
  if (digits.length === 12 && digits.startsWith("9725")) return true;
  return false;
}

/**
 * Returns the E.164 canonical form (`+9725XXXXXXXX`) if valid, otherwise null.
 * The DB column is `phone text` — store the canonical form so the QR card,
 * widget, and tel: links don't have to re-parse.
 */
export function normalizeIsraeliMobile(input: string): string | null {
  if (!isValidIsraeliMobile(input)) return null;
  // Safe: isValidIsraeliMobile only returns true after extractDigits succeeds.
  const digits = extractDigits(input)!;
  // Already national → strip leading 0, prepend +972.
  if (digits.length === 10) return `+972${digits.slice(1)}`;
  // Already international → just prepend +.
  return `+${digits}`;
}
