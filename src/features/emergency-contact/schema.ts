import { z } from "zod";
import { isValidIsraeliMobile, normalizeIsraeliMobile } from "@/lib/validation";

/**
 * Zod schema for the add/edit emergency-contact form.
 * Error messages are i18n keys; the screen resolves them via `t()`.
 *
 * Phone validation reuses the Israeli mobile validator from PR #3.
 * The form-level transform normalizes to E.164 so the DB always stores
 * `+972...` regardless of how the user typed it.
 */

const MAX_NAME_LEN = 50;
const MAX_RELATION_LEN = 30;

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "contacts.errors.nameRequired")
    .max(MAX_NAME_LEN, "contacts.errors.nameTooLong"),

  phone: z
    .string()
    .trim()
    .min(1, "contacts.errors.phoneRequired")
    .refine(isValidIsraeliMobile, { message: "contacts.errors.phoneInvalid" })
    .transform((v) => normalizeIsraeliMobile(v) ?? v),

  relation: z
    .string()
    .trim()
    .max(MAX_RELATION_LEN, "contacts.errors.relationTooLong")
    .transform((v) => (v === "" ? null : v))
    .nullable(),
});

export type ContactFormValues = z.input<typeof contactSchema>;
export type ContactFormOutput = z.output<typeof contactSchema>;
