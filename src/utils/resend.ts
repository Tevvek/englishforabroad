import { Resend } from "resend";
import { RESEND_API_KEY, SITE } from "astro:env/server";

const resend = new Resend(RESEND_API_KEY);

export interface SendConfirmationEmailData {
  email: string;
  username: string;
  confirmationToken: string;
}

export async function sendConfirmationEmail({
  email,
  username,
  confirmationToken,
}: SendConfirmationEmailData) {
  const confirmationUrl = `${SITE}/register/confirm?token=${confirmationToken}`;

  const { data, error } = await resend.emails.send({
    from: "English for Abroad <noreply@englishforabroad.com>",
    to: [email],
    subject: "Confirm your English for Abroad account",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1>Welcome to English for Abroad!</h1>
        <p>Hi ${username},</p>
        <p>Thank you for signing up for English for Abroad. To complete your registration, please confirm your email address by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${confirmationUrl}" 
             style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Confirm Email Address
          </a>
        </div>
        <p>Or copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #666;">${confirmationUrl}</p>
        <p>This link will expire in 24 hours.</p>
        <p>If you didn't sign up for English for Abroad, please ignore this email.</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 12px;">
          English for Abroad - Your journey to fluent English starts here.
        </p>
      </div>
    `,
  });

  if (error) {
    throw new Error(`Failed to send confirmation email: ${error.message}`);
  }

  return data;
}