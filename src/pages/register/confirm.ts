import type { APIRoute } from "astro";
import { confirmEmail } from "./_queries/confirm-email.query";
import { redirect } from "@/utils/actions.utils";
import { tryCatch } from "@/utils/tryCatch";

export const GET: APIRoute = async ({
  url,
  params,
  redirect: astroRedirect,
}) => {
  const token = url.searchParams.get("token");

  if (!token) {
    const response = redirect({
      message: "No confirmation token provided",
      to: "/login",
      type: "error",
    });
    return astroRedirect(response.to);
  }

  // Use tryCatch for email confirmation
  const [result, error] = await tryCatch(confirmEmail(token));

  // Guard clause: return early if there was an error
  if (error) {
    const response = redirect({
      message: "An error occurred during email confirmation. Please try again.",
      to: "/login",
      type: "error",
    });
    return astroRedirect(response.to);
  }

  // Guard clause: return early if confirmation failed
  if (!result.success) {
    const response = redirect({
      message: result.error || "Failed to confirm email. Please try again.",
      to: "/login",
      type: "error",
    });
    return astroRedirect(response.to);
  }

  // Success case
  const response = redirect({
    message:
      "Email confirmed successfully! You can now sign in to your account.",
    to: "/login",
    type: "success",
  });
  return astroRedirect(response.to);
};
