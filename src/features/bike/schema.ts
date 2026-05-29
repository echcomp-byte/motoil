import { z } from "zod";
import {
  isValidIsraeliLicensePlate,
  normalizeIsraeliLicensePlate,
} from "@/lib/validation";

/**
 * Zod schema for the add/edit bike form.
 *
 * Error messages are i18n keys; the screen resolves them via `t()`.
 *
 * year: bounded to (1900, current+1). A motorcycle older than 1900 is a
 * data-entry typo, not a vintage bike worth a special case. The +1 upper
 * bound accommodates pre-orders / model-year-ahead conventions.
 *
 * license_plate: optional column, but if present must pass the Israeli-plate
 * validator (7 or 8 digits, hyphens/whitespace OK). Normalized to digits-only
 * for storage so the public QR card can format consistently.
 *
 * is_primary: form-level boolean. The mutation hook layer handles the
 * demote-then-promote dance per migration 0002's invariant.
 */

const MAX_MAKE_LEN = 30;
const MAX_MODEL_LEN = 30;
const MIN_YEAR = 1900;
const MAX_YEAR = new Date().getUTCFullYear() + 1;

export const bikeSchema = z.object({
  make: z
    .string()
    .trim()
    .min(1, "bikes.errors.makeRequired")
    .max(MAX_MAKE_LEN, "bikes.errors.makeTooLong"),

  model: z
    .string()
    .trim()
    .min(1, "bikes.errors.modelRequired")
    .max(MAX_MODEL_LEN, "bikes.errors.modelTooLong"),

  // Form stores year as a string (TextInput numeric); transform to int|null.
  year: z
    .string()
    .trim()
    .transform((v) => (v === "" ? null : Number(v)))
    .pipe(
      z.union([
        z.null(),
        z
          .number()
          .int("bikes.errors.yearInvalid")
          .min(MIN_YEAR, "bikes.errors.yearOutOfRange")
          .max(MAX_YEAR, "bikes.errors.yearOutOfRange"),
      ]),
    ),

  license_plate: z
    .string()
    .trim()
    .transform((v) => (v === "" ? null : v))
    .refine(
      (v) => v === null || isValidIsraeliLicensePlate(v),
      { message: "bikes.errors.licensePlateInvalid" },
    )
    .transform((v) => (v === null ? null : normalizeIsraeliLicensePlate(v) ?? v))
    .nullable(),

  is_primary: z.boolean(),
});

export type BikeFormValues = z.input<typeof bikeSchema>;
export type BikeFormOutput = z.output<typeof bikeSchema>;
