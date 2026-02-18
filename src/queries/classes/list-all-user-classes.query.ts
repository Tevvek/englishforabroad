import { ClassBooking, db, eq } from "astro:db";

import { withCachedJson } from "@/lib/cache/with-cache";

const USER_CLASSES_CACHE_TTL_SECONDS = 30;

export interface UserClassBooking {
  id: string;
  startsAt: Date;
  endsAt: Date;
  status: "booked" | "cancelled";
}

interface CachedUserClassBooking {
  id: string;
  startsAt: Date | string;
  endsAt: Date | string;
  status: "booked" | "cancelled";
}

function isUserClassBooking(value: unknown): value is CachedUserClassBooking {
  if (!value || typeof value !== "object") {
    return false;
  }

  const booking = value as Partial<CachedUserClassBooking>;

  return (
    typeof booking.id === "string" &&
    typeof booking.startsAt !== "undefined" &&
    typeof booking.endsAt !== "undefined" &&
    (booking.status === "booked" || booking.status === "cancelled")
  );
}

function isUserClassBookings(value: unknown): value is CachedUserClassBooking[] {
  return Array.isArray(value) && value.every((booking) => isUserClassBooking(booking));
}

function toUserClassBooking(booking: CachedUserClassBooking): UserClassBooking {
  return {
    id: booking.id,
    startsAt: new Date(booking.startsAt),
    endsAt: new Date(booking.endsAt),
    status: booking.status,
  };
}

export async function listAllUserClasses(userId: string): Promise<UserClassBooking[]> {
  const bookings = await withCachedJson({
    key: `classes:all:${userId}`,
    ttlSeconds: USER_CLASSES_CACHE_TTL_SECONDS,
    isValid: isUserClassBookings,
    load: async () => {
      return db
        .select({
          id: ClassBooking.id,
          startsAt: ClassBooking.startsAt,
          endsAt: ClassBooking.endsAt,
          status: ClassBooking.status,
        })
        .from(ClassBooking)
        .where(eq(ClassBooking.userId, userId));
    },
  });

  return bookings.map((booking) => toUserClassBooking(booking));
}
