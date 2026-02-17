import { and, ClassBooking, db, desc, eq } from "astro:db";

export async function listCancelledClasses(userId: string) {
  return db
    .select({
      id: ClassBooking.id,
      startsAt: ClassBooking.startsAt,
      endsAt: ClassBooking.endsAt,
      status: ClassBooking.status,
    })
    .from(ClassBooking)
    .where(and(eq(ClassBooking.userId, userId), eq(ClassBooking.status, "cancelled")))
    .orderBy(desc(ClassBooking.startsAt));
}
