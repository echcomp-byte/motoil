import { z } from "zod";

// Validation errors are i18n keys; the screen translates them via t().
export const credentialsSchema = z.object({
  email: z.string().trim().email("auth.errors.invalidEmail"),
  password: z.string().min(6, "auth.errors.shortPassword"),
});

export type Credentials = z.infer<typeof credentialsSchema>;
