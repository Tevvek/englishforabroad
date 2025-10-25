import { defineAction } from "astro:actions";
import { loginSchema } from "../_schemas/login.schema";
import { redirect, fail } from "@/utils/actions.utils";
import { findUserByEmail } from "../_queries/find-user-by-email.query";
import { verifyPassword } from "../_validations/verify-password.validation";
import { isUserActive } from "../_validations/is-user-active.validation";
import { createSession } from "@/lib/session/create-session.query";
import { setSessionCookie } from "@/lib/cookies/session-cookie";
import { updateLastLogin } from "../_queries/update-last-login.query";
import { getClientIp, getUserAgent } from "@/utils/client-utils";

export const login = defineAction({
  input: loginSchema,
  handler: async ({ email, password }, { request, cookies }) => {
    // Find user by email in database
    const user = await findUserByEmail(email);

    if (!user) {
      return fail({
        message: "Invalid email or password",
        code: "UNAUTHORIZED",
      });
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password);

    if (!isValidPassword) {
      return fail({
        message: "Invalid email or password",
        code: "UNAUTHORIZED",
      });
    }

    // Check if user account is active
    if (!isUserActive(user)) {
      return fail({
        message: "Account is deactivated. Please contact support.",
        code: "FORBIDDEN",
      });
    }

    // Create session token
    const session = await createSession({
      userId: user.id,
      ipAddress: getClientIp(request),
      userAgent: getUserAgent(request),
    });

    // Set authentication cookie
    setSessionCookie(cookies, session.token);

    // Update last login timestamp
    await updateLastLogin(user.id);

    // Redirect to dashboard
    return redirect({ message: "Login successful", to: "/dashboard" });
  },
});
