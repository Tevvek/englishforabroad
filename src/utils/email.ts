import { GMAIL_APP_EMAIL, GMAIL_APP_PASSWORD } from "astro:env/server";
import nodemailer from "nodemailer";
import { z } from "zod";

export const EMAIL_TRANSPORTER = {
  service: "gmail",
  auth: {
    user: GMAIL_APP_EMAIL,
    pass: GMAIL_APP_PASSWORD,
  },
};

export const MAIL_OPTIONS = {
  from: GMAIL_APP_EMAIL,
  to: GMAIL_APP_EMAIL,
};

export const generateMailOptionsGroupClassesNotification = (email: string) => {
  return {
    ...MAIL_OPTIONS,
    subject: "New client interested ind group classes",
    text: `
          A user has submitted their email through the contact form on the website.

          Email:
          ${email}
      `,
  };
};

export interface FormValidationResult {
  email: string;
  accept: boolean;
  error?: string;
}

const FormSchema = z.object({
  email: z.string().email("Invalid email address."),
  accept: z.literal("on", {
    errorMap: () => ({ message: "Please accept the terms and conditions." }),
  }),
});
export type FormDataValues = z.infer<typeof FormSchema>;

export const extractAndValidateFormData = (
  formData: FormData
): {
  values?: FormDataValues;
  error?: string;
} => {
  const data = {
    email: formData.get("email")?.toString() || "",
    accept: formData.get("accept")?.toString() || "",
  };

  const result = FormSchema.safeParse(data);

  if (!result.success) {
    const firstError = result.error.issues[0]?.message || "Invalid form input.";
    return { error: firstError };
  }

  return { values: result.data };
};

export const sendEmailNotification = async (email: string) => {
  const transporter = nodemailer.createTransport(EMAIL_TRANSPORTER);
  const mailOptions = generateMailOptionsGroupClassesNotification(email);
  await transporter.sendMail(mailOptions);
};
