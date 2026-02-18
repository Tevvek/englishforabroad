import { listAllUserClasses } from "@/queries/classes/list-all-user-classes.query";

export async function listPastBookedClasses(userId: string, now: Date) {
  const allClasses = await listAllUserClasses(userId);

  return allClasses
    .filter((booking) => booking.status === "booked" && booking.startsAt < now)
    .sort((a, b) => b.startsAt.getTime() - a.startsAt.getTime());
}
