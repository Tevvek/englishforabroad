import { db, EmailConfirmation, User, eq, and } from "astro:db";

export async function confirmEmail(token: string) {
  // Find the confirmation record
  const confirmation = await db
    .select()
    .from(EmailConfirmation)
    .where(
      and(
        eq(EmailConfirmation.token, token),
        eq(EmailConfirmation.confirmed, false)
      )
    )
    .get();

  if (!confirmation) {
    return { success: false, error: "Invalid or expired confirmation token" };
  }

  // Check if token has expired
  if (new Date() > confirmation.expiresAt) {
    return { success: false, error: "Confirmation token has expired" };
  }

  // Use transaction to ensure both operations succeed or fail together
  await db.transaction(async (tx) => {
    // Update user's confirmed status
    await tx
      .update(User)
      .set({ confirmed: true })
      .where(eq(User.id, confirmation.userId));

    // Delete the email confirmation record since it's no longer needed
    await tx
      .delete(EmailConfirmation)
      .where(eq(EmailConfirmation.id, confirmation.id));
  });

  return { success: true };
}
