import { and, asc, ClassBooking, db, eq, gte } from "astro:db";

export async function getNextUpcomingBooking(userId: string, now: Date) {
  return db
    .select({
      id: ClassBooking.id,
      startsAt: ClassBooking.startsAt,
      endsAt: ClassBooking.endsAt,
    })
    .from(ClassBooking)
    .where(
      and(
        eq(ClassBooking.userId, userId),
        eq(ClassBooking.status, "booked"),
        gte(ClassBooking.startsAt, now),
      ),
    )
    .orderBy(asc(ClassBooking.startsAt))
    .limit(1)
    .get();
}
