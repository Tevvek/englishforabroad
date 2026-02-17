import { and, ClassBooking, db, desc, eq, lt } from "astro:db";

export async function listPastBookedClasses(userId: string, now: Date) {
  return db
    .select({
      id: ClassBooking.id,
      startsAt: ClassBooking.startsAt,
      endsAt: ClassBooking.endsAt,
      status: ClassBooking.status,
    })
    .from(ClassBooking)
    .where(
      and(
        eq(ClassBooking.userId, userId),
        eq(ClassBooking.status, "booked"),
        lt(ClassBooking.startsAt, now),
      ),
    )
    .orderBy(desc(ClassBooking.startsAt));
}
