export const prerender = false;

import fetchApi from "@/lib/strapi";
import { type Auth } from "@/types/auth";
import { validateRecaptcha } from "@/utils/recaptcha/recaptcha.server";
import type { APIRoute } from "astro";
import { z } from "zod";

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const formData = await request.formData();

  // 1. Validate reCAPTCHA
  const recaptchaValid = await validateRecaptcha(formData);

  if (!recaptchaValid) {
    return new Response(
      JSON.stringify({ error: "reCAPTCHA validation failed." }),
      { status: 500 }
    );
  }

  // 2. Validate form data
  const data = {
    identifier: formData.get("email")?.toString() || "",
    password: formData.get("password")?.toString() || "",
  };
  const result = LoginSchema.safeParse(data);

  if (!result.success) {
    const firstError = result.error.issues[0]?.message || "Invalid form input.";
    return new Response(JSON.stringify({ error: firstError }), { status: 400 });
  }

  const { data: values } = result;

  // 3. Attempt login
  try {
    const loginResponse = await fetchApi<Auth>({
      endpoint: "auth/local",
      method: "POST",
      body: values,
    });

    cookies.set("english-for-abroad-token", loginResponse.jwt, {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    // 4. Redirect to dashboard
    console.log("✅ Login successful:", loginResponse);
    return redirect("/dashboard");
  } catch (error) {
    console.error("❌ Login failed:", error);
    return new Response(JSON.stringify({ error: "Login failed." }), {
      status: 500,
    });
  }
};

const LoginSchema = z.object({
  identifier: z.string().email("Invalid email address."),
  password: z.string().min(6, "Password must be at least 6 characters long."),
});
