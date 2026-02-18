import { listAllUserClasses } from "@/queries/classes/list-all-user-classes.query";

export async function listCancelledClasses(userId: string) {
  const allClasses = await listAllUserClasses(userId);

  return allClasses
    .filter((booking) => booking.status === "cancelled")
    .sort((a, b) => b.startsAt.getTime() - a.startsAt.getTime());
}
