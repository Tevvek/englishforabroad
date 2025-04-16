export const prerender = false;

import fetchApi from "@/lib/strapi";
import { RegisterSchema } from "@/schemas/register.schema";
import { type Auth } from "@/types/auth";
import { validateRecaptcha } from "@/utils/recaptcha/recaptcha.server";
import { to } from "@/utils/to";
import type { APIRoute } from "astro";

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
    identifier: formData.get("identifier")?.toString() || "",
    password: formData.get("password")?.toString() || "",
    repeatPassword: formData.get("repeatPassword")?.toString() || "",
  };

  const result = RegisterSchema.safeParse(data);

  if (!result.success) {
    const firstError = result.error.issues[0]?.message || "Invalid form input.";
    return new Response(JSON.stringify({ error: firstError }), { status: 400 });
  }

  const { identifier: email, password } = result.data;

  // 3. Attempt registration
  const [error, registerResponse] = await to(
    fetchApi<Auth>({
      endpoint: "auth/local/register",
      method: "POST",
      body: {
        email,
        password,
        username: email,
      },
    })
  );

  if (error || !registerResponse) {
    console.error("❌ Registration failed:", error);
    return new Response(JSON.stringify({ error: "Registration failed." }), {
      status: 500,
    });
  }

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
};
