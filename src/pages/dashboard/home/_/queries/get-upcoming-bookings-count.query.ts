import { and, ClassBooking, db, eq, gte } from "astro:db";

export async function getUpcomingBookingsCount(userId: string, now: Date) {
  const upcomingBookings = await db
    .select({ id: ClassBooking.id })
    .from(ClassBooking)
    .where(
      and(
        eq(ClassBooking.userId, userId),
        eq(ClassBooking.status, "booked"),
        gte(ClassBooking.startsAt, now),
      ),
    );

  return upcomingBookings.length;
}
