import { listAllUserClasses } from "@/queries/classes/list-all-user-classes.query";

export async function getNextUpcomingBooking(userId: string, now: Date) {
  const allClasses = await listAllUserClasses(userId);

  const nextBooking = allClasses
    .filter((booking) => booking.status === "booked" && booking.startsAt >= now)
    .sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime())
    .at(0);

  if (!nextBooking) {
    return null;
  }

  return {
    id: nextBooking.id,
    startsAt: nextBooking.startsAt,
    endsAt: nextBooking.endsAt,
  };
}
