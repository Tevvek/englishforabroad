import { db, eq, User } from "astro:db";

export async function getUserStripeCustomerId(userId: string) {
  const userRecord = await db
    .select({ stripeCustomerId: User.stripeCustomerId })
    .from(User)
    .where(eq(User.id, userId))
    .get();

  return userRecord?.stripeCustomerId ?? null;
}
