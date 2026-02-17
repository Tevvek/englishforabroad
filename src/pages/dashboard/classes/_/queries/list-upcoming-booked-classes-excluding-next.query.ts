import { and, asc, ClassBooking, db, eq, gte } from "astro:db";

export async function listUpcomingBookedClassesExcludingNext(
  userId: string,
  now: Date,
) {
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
        gte(ClassBooking.startsAt, now),
      ),
    )
    .orderBy(asc(ClassBooking.startsAt))
    .offset(1)
    .limit(10);
}
