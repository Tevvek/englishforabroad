import { defineAction } from "astro:actions";
import { forgotPasswordSchema } from "../_schemas/forgot-password.schema";
import { redirect, fail } from "@/utils/actions.utils";
import { findUserByEmail } from "../_queries/find-user-by-email.query";
import { createPasswordReset } from "../_queries/create-password-reset.query";
import { generateResetToken } from "../_utils/generate-reset-token.util";
import { sendPasswordResetEmail } from "../_utils/send-password-reset-email.util";
import { tryCatch } from "@/utils/tryCatch";

export const forgotPassword = defineAction({
  input: forgotPasswordSchema,
  handler: async ({ email }) => {
    // Find user by email
    const [user, findUserError] = await tryCatch(findUserByEmail(email));

    if (findUserError) {
      return fail({
        message: "An error occurred. Please try again.",
        code: "BAD_REQUEST",
      });
    }

    // For security, always show success message even if user doesn't exist
    // This prevents email enumeration attacks
    if (!user) {
      return redirect({
        message: "If an account with that email exists, we've sent a password reset link.",
        to: "/login",
        type: "info",
      });
    }

    // Check if user account is blocked
    if (user.blocked) {
      return fail({
        message: "This account has been blocked. Please contact support.",
        code: "FORBIDDEN",
      });
    }

    // Check if user account is confirmed
    if (!user.confirmed) {
      return fail({
        message: "Please confirm your email address before resetting your password.",
        code: "BAD_REQUEST",
      });
    }

    // Generate reset token
    const resetToken = generateResetToken();

    // Create password reset record
    const [, createResetError] = await tryCatch(
      createPasswordReset({ userId: user.id, token: resetToken })
    );

    if (createResetError) {
      return fail({
        message: "Failed to create password reset. Please try again.",
        code: "BAD_REQUEST",
      });
    }

    // Send reset email
    const [, emailError] = await tryCatch(
      sendPasswordResetEmail({
        email: user.email,
        username: user.username,
        resetToken,
      })
    );

    if (emailError) {
      return fail({
        message: "Failed to send password reset email. Please try again.",
        code: "BAD_REQUEST",
      });
    }

    // Redirect with success message
    return redirect({
      message: "Password reset link sent! Check your email for instructions.",
      to: "/login",
      type: "success",
    });
  },
});