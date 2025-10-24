import { db, User } from "astro:db";
import { eq } from "astro:db";

export async function updateLastLogin(userId: number): Promise<void> {
  await db
    .update(User)
    .set({
      updatedAt: new Date(),
    })
    .where(eq(User.id, userId));
}
