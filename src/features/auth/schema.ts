import { z } from "zod";

export const credentialsSchema = z.object({
  email: z.string().trim().email("כתובת מייל לא תקינה"),
  password: z.string().min(6, "הסיסמה חייבת להכיל לפחות 6 תווים"),
});

export type Credentials = z.infer<typeof credentialsSchema>;
