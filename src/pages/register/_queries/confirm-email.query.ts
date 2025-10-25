import { db, EmailConfirmation, User, eq, and } from "astro:db";

export async function confirmEmail(token: string) {
  // Find the confirmation record
  const [confirmation] = await db
    .select()
    .from(EmailConfirmation)
    .where(
      and(
        eq(EmailConfirmation.token, token),
        eq(EmailConfirmation.confirmed, false)
      )
    );

  if (!confirmation) {
    return { success: false, error: "Invalid or expired confirmation token" };
  }

  // Check if token has expired
  if (new Date() > confirmation.expiresAt) {
    return { success: false, error: "Confirmation token has expired" };
  }

  // Mark confirmation as confirmed
  await db
    .update(EmailConfirmation)
    .set({ confirmed: true })
    .where(eq(EmailConfirmation.id, confirmation.id));

  // Update user's confirmed status
  await db
    .update(User)
    .set({ confirmed: true })
    .where(eq(User.id, confirmation.userId));

  return { success: true };
}