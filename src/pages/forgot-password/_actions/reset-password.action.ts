import { defineAction } from "astro:actions";
import { resetPasswordSchema } from "../_schemas/reset-password.schema";
import { redirect, fail } from "@/utils/actions.utils";
import { verifyResetToken } from "../_queries/verify-reset-token.query";
import { resetUserPassword } from "../_queries/reset-user-password.query";
import { hashPassword } from "../../register/_utils/hash-password.util";
import { isPasswordDifferent } from "../_validations/is-password-different.validation";
import { sendPasswordChangedNotification } from "../_utils/send-password-changed-notification.util";
import { tryCatch } from "@/utils/tryCatch";

export const resetPassword = defineAction({
  input: resetPasswordSchema,
  handler: async ({ token, password }) => {
    // Verify reset token
    const [tokenResult, tokenError] = await tryCatch(verifyResetToken(token));

    if (tokenError) {
      return fail({
        message: "An error occurred. Please try again.",
        code: "BAD_REQUEST",
      });
    }

    if (!tokenResult.success || !tokenResult.data) {
      return fail({
        message: tokenResult.error ?? "Invalid or expired reset token",
        code: "BAD_REQUEST",
      });
    }

    // Check if new password is different from current password
    const [isDifferent, compareError] = await tryCatch(
      isPasswordDifferent(password, tokenResult.data.currentPasswordHash)
    );

    if (compareError) {
      return fail({
        message: "Failed to validate password. Please try again.",
        code: "BAD_REQUEST",
      });
    }

    if (!isDifferent) {
      return fail({
        message: "New password must be different from your current password.",
        code: "BAD_REQUEST",
      });
    }

    // Hash new password
    const [hashedPassword, hashError] = await tryCatch(hashPassword(password));

    if (hashError) {
      return fail({
        message: "Failed to process password. Please try again.",
        code: "BAD_REQUEST",
      });
    }

    // Reset user password
    const [, resetError] = await tryCatch(
      resetUserPassword({
        resetId: tokenResult.data.id,
        userId: tokenResult.data.userId,
        hashedPassword,
      })
    );

    if (resetError) {
      return fail({
        message: "Failed to reset password. Please try again.",
        code: "BAD_REQUEST",
      });
    }

    // Send password change notification email
    const [, notificationError] = await tryCatch(
      sendPasswordChangedNotification({
        email: tokenResult.data.email,
        username: tokenResult.data.username,
      })
    );

    // Note: We don't fail the request if notification fails, as the password was successfully changed
    if (notificationError) {
      console.error("Failed to send password change notification:", notificationError);
    }

    // Redirect with success message
    return redirect({
      message:
        "Password reset successfully! You can now sign in with your new password.",
      to: "/login",
      type: "success",
    });
  },
});
