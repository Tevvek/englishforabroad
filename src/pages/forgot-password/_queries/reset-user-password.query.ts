import { db, PasswordReset, User, eq } from "astro:db";

export interface ResetUserPasswordData {
  resetId: number;
  userId: number;
  hashedPassword: string;
}

export async function resetUserPassword({ resetId, userId, hashedPassword }: ResetUserPasswordData) {
  // Use transaction to update password and mark reset as used
  await db.transaction(async (tx) => {
    // Update user's password
    await tx
      .update(User)
      .set({ password: hashedPassword })
      .where(eq(User.id, userId));

    // Mark reset token as used
    await tx
      .update(PasswordReset)
      .set({ used: true })
      .where(eq(PasswordReset.id, resetId));
  });

  return { success: true };
}