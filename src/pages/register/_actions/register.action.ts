import { defineAction } from "astro:actions";
import { registerSchema } from "../_schemas/register.schema";
import { redirect, fail } from "@/utils/actions.utils";
import { isEmailAvailable } from "../_validations/is-email-available.validation";
import { createUser } from "../_queries/create-user.query";
import { createEmailConfirmation } from "../_queries/create-email-confirmation.query";
import { sendConfirmationEmail } from "@/utils/resend";
import { tryCatch } from "@/utils/tryCatch";

export const register = defineAction({
  input: registerSchema,
  handler: async ({ email, password }) => {
    // Check if email is already registered
    const [emailAvailable, emailCheckError] = await tryCatch(
      isEmailAvailable(email)
    );

    if (emailCheckError) {
      return fail({
        message: "Unable to verify email availability. Please try again.",
        code: "BAD_REQUEST",
      });
    }

    if (!emailAvailable) {
      return fail({
        message: "An account with this email already exists",
        code: "CONFLICT",
      });
    }

    // Create the user
    const [newUser, createUserError] = await tryCatch(
      createUser({ email, password })
    );

    if (createUserError || !newUser) {
      return fail({
        message: "Failed to create user account. Please try again.",
        code: "BAD_REQUEST",
      });
    }

    // Create email confirmation token
    const [confirmation, confirmationError] = await tryCatch(
      createEmailConfirmation({ userId: newUser.id })
    );

    if (confirmationError || !confirmation) {
      return fail({
        message: "Failed to create confirmation token. Please try again.",
        code: "BAD_REQUEST",
      });
    }

    // Send confirmation email
    const [, emailError] = await tryCatch(
      sendConfirmationEmail({
        email: newUser.email,
        username: newUser.username,
        confirmationToken: confirmation.token,
      })
    );

    if (emailError) {
      return fail({
        message: "Failed to send confirmation email. Please try again.",
        code: "BAD_REQUEST",
      });
    }

    // Redirect to confirmation pending page
    return redirect({
      message: "Registration successful! Please check your email to confirm your account.",
      to: "/register/pending",
    });
  },
});