import { z } from "zod";

// Base schema for password fields
const passwordFieldsSchema = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  confirmPassword: z.string().min(1, "Please confirm your password"),
});

// Schema for form data (without token)
export const resetPasswordFormSchema = passwordFieldsSchema.refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  }
);

// Schema for action data (with token)
export const resetPasswordSchema = passwordFieldsSchema
  .extend({
    token: z.string().min(1, "Reset token is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordFormSchema>;
export type ResetPasswordActionData = z.infer<typeof resetPasswordSchema>;
