import { and, ClassBooking, db, eq, gte, lt } from "astro:db";

export async function listBookedClassesInRange(startAt: Date, endAt: Date) {
  return db
    .select({ startsAt: ClassBooking.startsAt })
    .from(ClassBooking)
    .where(
      and(
        eq(ClassBooking.status, "booked"),
        gte(ClassBooking.startsAt, startAt),
        lt(ClassBooking.startsAt, endAt),
      ),
    );
}
