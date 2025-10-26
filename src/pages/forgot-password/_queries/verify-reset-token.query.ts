import { db, PasswordReset, User, eq, and } from "astro:db";

export async function verifyResetToken(token: string) {
  // Find the password reset record with user info
  const reset = await db
    .select({
      id: PasswordReset.id,
      userId: PasswordReset.userId,
      token: PasswordReset.token,
      expiresAt: PasswordReset.expiresAt,
      used: PasswordReset.used,
      userEmail: User.email,
      userUsername: User.username,
    })
    .from(PasswordReset)
    .innerJoin(User, eq(PasswordReset.userId, User.id))
    .where(
      and(
        eq(PasswordReset.token, token),
        eq(PasswordReset.used, false)
      )
    )
    .get();

  if (!reset) {
    return { success: false, error: "Invalid or already used reset token" };
  }

  // Check if token has expired
  if (new Date() > reset.expiresAt) {
    return { success: false, error: "Reset token has expired" };
  }

  return { 
    success: true, 
    data: {
      id: reset.id,
      userId: reset.userId,
      email: reset.userEmail,
      username: reset.userUsername,
    }
  };
}