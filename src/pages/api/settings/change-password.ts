export const prerender = false;

import fetchApi from "@/lib/strapi";
import { ChangePasswordSchema } from "@/schemas/change-password.schema";
import { to } from "@/utils/to";
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ locals, request }) => {
  const formData = await request.formData();
  const data = {
    "new-password": formData.get("new-password")?.toString() || "",
    "repeat-new-password":
      formData.get("repeat-new-password")?.toString() || "",
    "old-password": formData.get("old-password")?.toString() || "",
  };

  const result = ChangePasswordSchema.safeParse(data);

  if (!result.success) {
    const firstError = result.error.issues[0]?.message || "Invalid input.";
    return new Response(JSON.stringify({ error: firstError }), { status: 400 });
  }

  const [error] = await to(
    fetchApi({
      endpoint: "auth/change-password",
      method: "POST",
      authToken: locals.jwt,
      body: {
        currentPassword: result.data["old-password"],
        password: result.data["new-password"],
        passwordConfirmation: result.data["repeat-new-password"],
      },
    })
  );

  if (error) {
    console.error("❌ Password change failed:", error);
    return new Response(JSON.stringify({ error: "Password change failed." }), {
      status: 500,
    });
  }

  return new Response(JSON.stringify({ success: "Password changed." }), {
    status: 200,
  });
};
