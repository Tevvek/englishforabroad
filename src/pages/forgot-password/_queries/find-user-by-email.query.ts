import { db, User, eq } from "astro:db";

export async function findUserByEmail(email: string) {
  return await db
    .select({
      id: User.id,
      email: User.email,
      username: User.username,
      confirmed: User.confirmed,
      blocked: User.blocked,
    })
    .from(User)
    .where(eq(User.email, email))
    .get();
}