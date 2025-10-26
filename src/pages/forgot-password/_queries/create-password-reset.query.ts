import { db, PasswordReset } from "astro:db";

export interface CreatePasswordResetData {
  userId: number;
  token: string;
}

export async function createPasswordReset({ userId, token }: CreatePasswordResetData) {
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 1); // 1 hour expiration

  return await db
    .insert(PasswordReset)
    .values({
      userId,
      token,
      expiresAt,
      used: false,
    })
    .returning()
    .get();
}