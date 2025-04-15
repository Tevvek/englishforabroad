import { z } from "zod";

export const RegisterSchema = z
  .object({
    identifier: z.string().email("Invalid email address."),
    password: z.string().min(6, "Password must be at least 6 characters long."),
    repeatPassword: z.string(),
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: "Passwords do not match.",
    path: ["repeatPassword"],
  });
