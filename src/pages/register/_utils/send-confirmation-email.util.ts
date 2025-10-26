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
      <div style="font-family: 'Nunito Variable', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #85cbcc; padding: 40px 20px; border-radius: 10px;">
        <div style="background-color: white; padding: 40px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <h1 style="font-family: 'BobbyJones', Georgia, serif; color: #155e75; text-align: center; margin-bottom: 30px; font-size: 32px;">Welcome to English for Abroad!</h1>
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">Hi ${username},</p>
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">Thank you for signing up for English for Abroad. To complete your registration, please confirm your email address by clicking the button below:</p>
          <div style="text-align: center; margin: 40px 0;">
            <a href="${confirmationUrl}" 
               style="background-color: #155e75; color: white; padding: 16px 32px; text-decoration: none; border-radius: 10px; display: inline-block; font-weight: 600; font-size: 16px; transition: background-color 0.3s;">
              Confirm Email Address
            </a>
          </div>
          <p style="color: #374151; font-size: 14px; line-height: 1.6;">Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #85cbcc; background-color: #f9fafb; padding: 12px; border-radius: 6px; font-size: 14px;">${confirmationUrl}</p>
          <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">This link will expire in 24 hours.</p>
          <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">If you didn't sign up for English for Abroad, please ignore this email.</p>
          <hr style="margin: 30px 0; border: none; border-top: 2px solid #85cbcc;">
          <p style="color: #6b7280; font-size: 12px; text-align: center; line-height: 1.5;">
            <strong style="color: #155e75;">English for Abroad</strong><br>
            Your journey to fluent English starts here.
          </p>
        </div>
      </div>
    `,
  });

  if (error) {
    throw new Error(`Failed to send confirmation email: ${error.message}`);
  }

  return data;
}