import { RECAPTCHA_SECRET_KEY } from "astro:env/server";
import { RECAPTCHA_KEY } from "./recaptcha.constants";

export const RECAPTCHA_VERIFY_URL =
  "https://www.google.com/recaptcha/api/siteverify";

// SERVER
export async function validateRecaptcha(form: FormData | null) {
  if (!form) return false;

  const token = form.get(RECAPTCHA_KEY);

  if (!token || typeof token !== "string") return false;

  const response = await fetch(RECAPTCHA_VERIFY_URL, {
    method: "POST",
    body: new URLSearchParams({
      secret: RECAPTCHA_SECRET_KEY,
      response: token,
    }),
  });

  const data = await response.json();
  return data.success === true;
}
