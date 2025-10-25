import { db, User, eq } from "astro:db";

export async function checkUserExists(email: string) {
  const users = await db.select().from(User).where(eq(User.email, email));
  return users.length > 0;
}