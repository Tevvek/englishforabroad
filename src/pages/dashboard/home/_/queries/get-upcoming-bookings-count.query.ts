import { listAllUserClasses } from "@/queries/classes/list-all-user-classes.query";

export async function getUpcomingBookingsCount(userId: string, now: Date) {
  const allClasses = await listAllUserClasses(userId);

  const upcomingBookings = allClasses.filter(
    (booking) => booking.status === "booked" && booking.startsAt >= now,
  );

  return upcomingBookings.length;
}
