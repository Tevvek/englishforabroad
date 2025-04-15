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
    email: formData.get("email")?.toString() || "",
    password: formData.get("password")?.toString() || "",
    repeatPassword: formData.get("repeat-password")?.toString() || "",
  };

  const result = RegisterSchema.safeParse(data);

  if (!result.success) {
    const firstError = result.error.issues[0]?.message || "Invalid form input.";
    return new Response(JSON.stringify({ error: firstError }), { status: 400 });
  }

  const { email, password } = result.data;

  // 3. Attempt registration
  try {
    const registerResponse = await fetchApi<Auth>({
      endpoint: "auth/local/register",
      method: "POST",
      body: {
        email,
        password,
        username: email,
      },
    });

    // 4. Set JWT cookie
    cookies.set("english-for-abroad-token", registerResponse.jwt, {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    console.log("✅ Registration successful:", registerResponse);
    return redirect("/dashboard");
  } catch (error) {
    console.error("❌ Registration failed:", error);
    return new Response(JSON.stringify({ error: "Registration failed." }), {
      status: 500,
    });
  }
};

const RegisterSchema = z
  .object({
    email: z.string().email("Invalid email address."),
    password: z.string().min(6, "Password must be at least 6 characters long."),
    repeatPassword: z.string(),
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: "Passwords do not match.",
    path: ["repeatPassword"],
  });
