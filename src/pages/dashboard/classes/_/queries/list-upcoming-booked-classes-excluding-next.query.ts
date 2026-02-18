import { listAllUserClasses } from "@/queries/classes/list-all-user-classes.query";

export async function listUpcomingBookedClassesExcludingNext(
  userId: string,
  now: Date,
) {
  const allClasses = await listAllUserClasses(userId);

  return allClasses
    .filter((booking) => booking.status === "booked" && booking.startsAt >= now)
    .sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime())
    .slice(1, 11);
}
