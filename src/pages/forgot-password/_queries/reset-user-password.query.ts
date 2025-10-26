import { db, PasswordReset, User, eq } from "astro:db";

export interface ResetUserPasswordData {
  resetId: number;
  userId: number;
  hashedPassword: string;
}

export async function resetUserPassword({ resetId, userId, hashedPassword }: ResetUserPasswordData) {
  // Use transaction to update password and delete reset token
  await db.transaction(async (tx) => {
    // Update user's password
    await tx
      .update(User)
      .set({ password: hashedPassword })
      .where(eq(User.id, userId));

    // Delete the password reset token since it's no longer needed
    await tx
      .delete(PasswordReset)
      .where(eq(PasswordReset.id, resetId));
  });

  return { success: true };
}