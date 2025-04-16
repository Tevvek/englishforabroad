export const prerender = false;

import {
  extractAndValidateFormData,
  sendEmailNotification,
} from "@/utils/email";
import { validateRecaptcha } from "@/utils/recaptcha/recaptcha.server";
import { to } from "@/utils/to";
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
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
  const { values, error: formError } = extractAndValidateFormData(formData);
  if (formError || !values) {
    return new Response(JSON.stringify({ error: formError }), { status: 400 });
  }

  // 3. Send email
  const [error] = await to(sendEmailNotification(values.email));

  if (error) {
    console.error("❌ Email sending failed:", error);
    return new Response(JSON.stringify({ error: "Failed to send email." }), {
      status: 500,
    });
  }

  return new Response(JSON.stringify({ success: "Email sent!" }), {
    status: 200,
  });
};
