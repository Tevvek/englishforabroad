import { z } from "zod";

export const ChangePasswordSchema = z
  .object({
    "new-password": z
      .string()
      .min(6, "New password must be at least 6 characters."),
    "repeat-new-password": z.string(),
    "old-password": z.string().min(1, "Current password is required."),
  })
  .refine((data) => data["new-password"] === data["repeat-new-password"], {
    path: ["repeat-new-password"],
    message: "Passwords do not match.",
  });

export type ChangePasswordFormData = z.infer<typeof ChangePasswordSchema>;
