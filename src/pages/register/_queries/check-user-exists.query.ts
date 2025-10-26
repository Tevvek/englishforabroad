import { db, User, eq } from "astro:db";

export async function checkUserExists(email: string) {
  const user = await db.select().from(User).where(eq(User.email, email)).get();
  return !!user;
}
