export const prerender = false;

import fetchApi from "@/lib/strapi";
import type { APIRoute } from "astro";
import { z } from "zod";

export const POST: APIRoute = async ({ locals, request }) => {
  const formData = await request.formData();
  const data = {
    password: formData.get("new-password")?.toString() || "",
    passwordConfirmation: formData.get("repeat-new-password")?.toString() || "",
    currentPassword: formData.get("old-password")?.toString() || "",
  };

  const result = PasswordSchema.safeParse(data);

  if (!result.success) {
    const firstError = result.error.issues[0]?.message || "Invalid input.";
    return new Response(JSON.stringify({ error: firstError }), { status: 400 });
  }

  try {
    await fetchApi({
      endpoint: "auth/change-password",
      method: "POST",
      authToken: locals.jwt,
      body: {
        currentPassword: result.data.currentPassword,
        password: result.data.password,
        passwordConfirmation: result.data.passwordConfirmation, // same as password
      },
    });

    return new Response(JSON.stringify({ success: "Password changed." }), {
      status: 200,
    });
  } catch (error) {
    console.error("❌ Password change failed:", error);
    return new Response(JSON.stringify({ error: "Password change failed." }), {
      status: 500,
    });
  }
};

const PasswordSchema = z
  .object({
    password: z.string().min(6, "New password must be at least 6 characters."),
    passwordConfirmation: z.string(),
    currentPassword: z.string().min(1, "Current password is required."),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match.",
    path: ["passwordConfirmation"],
  });
