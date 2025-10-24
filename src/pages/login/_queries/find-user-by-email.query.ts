import { db, eq, User } from "astro:db";

/**
 * Find user by email query
 */

export async function findUserByEmail(email: string) {
  return await db.select().from(User).where(eq(User.email, email)).get();
}
