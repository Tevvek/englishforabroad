import { z } from "zod";

export const LoginSchema = z.object({
  identifier: z.string().email("Invalid email address."),
  password: z.string().min(6, "Password must be at least 6 characters long."),
});

export type LoginFormData = z.infer<typeof LoginSchema>;
