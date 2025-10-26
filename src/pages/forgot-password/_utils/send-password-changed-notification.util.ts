import { Resend } from "resend";
import { RESEND_API_KEY } from "astro:env/server";

const resend = new Resend(RESEND_API_KEY);

export interface SendPasswordChangedNotificationData {
  email: string;
  username: string;
}

export async function sendPasswordChangedNotification({
  email,
  username,
}: SendPasswordChangedNotificationData) {
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });

  const { data, error } = await resend.emails.send({
    from: "English for Abroad <noreply@englishforabroad.com>",
    to: [email],
    subject: "Your password has been changed - English for Abroad",
    html: `
      <div style="font-family: 'Nunito Variable', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #85cbcc; padding: 40px 20px; border-radius: 10px;">
        <div style="background-color: white; padding: 40px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <h1 style="font-family: 'BobbyJones', Georgia, serif; color: #155e75; text-align: center; margin-bottom: 30px; font-size: 32px;">Password Changed Successfully</h1>
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">Hi ${username},</p>
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">This email confirms that your password for your English for Abroad account has been successfully changed.</p>
          
          <div style="background-color: #f0f9ff; border-left: 4px solid #155e75; padding: 20px; margin: 30px 0; border-radius: 6px;">
            <p style="color: #155e75; font-weight: 600; margin: 0 0 8px 0; font-size: 16px;">Security Details:</p>
            <p style="color: #374151; margin: 0; font-size: 14px;">
              <strong>When:</strong> ${currentDate}<br>
              <strong>Account:</strong> ${email}
            </p>
          </div>

          <p style="color: #374151; font-size: 16px; line-height: 1.6;">If you made this change, no further action is required. You can now sign in to your account using your new password.</p>
          
          <div style="background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 20px; margin: 30px 0; border-radius: 6px;">
            <p style="color: #dc2626; font-weight: 600; margin: 0 0 8px 0; font-size: 16px; display: flex; align-items: center;"><span style="font-size: 16px; line-height: 1; margin-right: 8px;">⚠️</span> Security Alert</p>
            <p style="color: #374151; margin: 0; font-size: 14px;">
              If you did not request this password change, your account may have been compromised. Please:
            </p>
            <ul style="color: #374151; font-size: 14px; margin: 8px 0 0 0; padding-left: 20px;">
              <li>Contact our support team immediately</li>
              <li>Review your account activity</li>
              <li>Consider enabling additional security measures</li>
            </ul>
          </div>

          <div style="text-align: center; margin: 40px 0;">
            <a href="mailto:support@englishforabroad.com" 
               style="background-color: #155e75; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 500; font-size: 14px;">
              Contact Support
            </a>
          </div>

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
    throw new Error(
      `Failed to send password change notification: ${error.message}`
    );
  }

  return data;
}
