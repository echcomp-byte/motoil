import { z } from "zod";
import { isValidTeudatZehut } from "@/lib/validation";
import { BLOOD_TYPE_OPTIONS, KUPAT_HOLIM_OPTIONS } from "@/lib/supabase/types";

/**
 * Zod schema for the medical-profile form.
 *
 * Validation errors are i18n keys; the screen resolves them via `t()`.
 *
 * Array fields are stored as `string[]` in the DB but edited as a single
 * comma-separated string in the form for v1 (simplest UX). The screen does the
 * round-trip (`parseList` / `serializeList`) so the form values map cleanly to
 * what `useUpdateProfile` consumes.
 *
 * Per ICE snapshot RFC (issue #2): arrays capped at 6 items, each ≤ 40 chars.
 * We enforce both here so a too-long entry never reaches the DB.
 */

const MAX_ARRAY_LEN = 6;
const MAX_ITEM_LEN = 40;
const MAX_TEXT_LEN = 100;

const arrayItem = z
  .string()
  .trim()
  .min(1, "profile.errors.itemEmpty")
  .max(MAX_ITEM_LEN, "profile.errors.itemTooLong");

const medicalArray = z
  .array(arrayItem)
  .max(MAX_ARRAY_LEN, "profile.errors.arrayTooLong");

export const profileSchema = z.object({
  full_name: z
    .string()
    .trim()
    .min(1, "profile.errors.fullNameRequired")
    .max(MAX_TEXT_LEN, "profile.errors.fullNameTooLong"),

  // Teudat Zehut is optional at the column level (`text NULL`) — a user may save
  // their profile with everything except the ID. If present, must pass checksum.
  teudat_zehut: z
    .string()
    .trim()
    .transform((v) => (v === "" ? null : v))
    .refine(
      (v) => v === null || isValidTeudatZehut(v),
      { message: "profile.errors.teudatZehutInvalid" },
    )
    .nullable(),

  blood_type: z.enum(BLOOD_TYPE_OPTIONS).nullable(),

  kupat_holim: z.enum(KUPAT_HOLIM_OPTIONS).nullable(),

  allergies: medicalArray,
  medications: medicalArray,
  conditions: medicalArray,
});

export type ProfileFormValues = z.input<typeof profileSchema>;
export type ProfileFormOutput = z.output<typeof profileSchema>;

/**
 * Splits a comma-separated user input into a trimmed string[].
 * Empty entries are dropped (e.g. "a,,b" → ["a","b"]).
 */
export function parseList(raw: string): string[] {
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

/**
 * Joins a string[] for display in a single-line input.
 */
export function serializeList(items: string[] | null | undefined): string {
  return (items ?? []).join(", ");
}
