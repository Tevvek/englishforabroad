import { PUBLIC_RECAPTCHA_SITE_KEY } from "astro:env/client";
import { RECAPTCHA_KEY } from "./recaptcha.constants";

export async function getRecaptchaToken(
  siteKey: string,
  action: string = "submit"
): Promise<string> {
  if (typeof grecaptcha === "undefined") {
    throw new Error("reCAPTCHA not loaded.");
  }

  await new Promise<void>((resolve) => grecaptcha.ready(resolve));

  const token = await grecaptcha.execute(siteKey, { action });
  return token;
}

export async function appendRecaptchaToForm(
  formData: FormData,
  action: string = "submit"
): Promise<FormData> {
  const siteKey = PUBLIC_RECAPTCHA_SITE_KEY;
  const token = await getRecaptchaToken(siteKey, action);
  formData.append(RECAPTCHA_KEY, token);
  return formData;
}
