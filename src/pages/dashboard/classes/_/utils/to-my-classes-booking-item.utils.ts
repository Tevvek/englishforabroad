import type { ClassBookingItem } from "../types";

export interface BookingRow {
  id: string;
  status: "booked" | "cancelled";
  startsAt: Date;
  endsAt: Date;
}

export interface MyClassesBookingItemContext {
  now: Date;
  cancellationRefundWindowMs: number;
  dateFormatter: Intl.DateTimeFormat;
  timeFormatter: Intl.DateTimeFormat;
}

interface ToMyClassesBookingItemInput {
  booking: BookingRow;
  now: MyClassesBookingItemContext["now"];
  cancellationRefundWindowMs: MyClassesBookingItemContext["cancellationRefundWindowMs"];
  dateFormatter: MyClassesBookingItemContext["dateFormatter"];
  timeFormatter: MyClassesBookingItemContext["timeFormatter"];
}

export function createMyClassesBookingItemContext(refundWindowHours: number): MyClassesBookingItemContext {
  return {
    now: new Date(),
    cancellationRefundWindowMs: refundWindowHours * 60 * 60 * 1000,
    dateFormatter: new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Seoul",
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
    timeFormatter: new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Seoul",
      hour: "numeric",
      minute: "2-digit",
    }),
  };
}

export function toMyClassesBookingItem({
  booking,
  now,
  cancellationRefundWindowMs,
  dateFormatter,
  timeFormatter,
}: ToMyClassesBookingItemInput): ClassBookingItem {
  const startsAtDate = new Date(booking.startsAt);
  const endsAtDate = new Date(booking.endsAt);
  const canCancel =
    booking.status === "booked" && startsAtDate.getTime() > now.getTime();
  const isRefundEligible =
    canCancel &&
    startsAtDate.getTime() - now.getTime() >= cancellationRefundWindowMs;

  return {
    id: booking.id,
    status: booking.status,
    startsAtIso: startsAtDate.toISOString(),
    endsAtIso: endsAtDate.toISOString(),
    kstDateLabel: dateFormatter.format(startsAtDate),
    kstTimeRangeLabel: `${timeFormatter.format(startsAtDate)} - ${timeFormatter.format(endsAtDate)}`,
    canCancel,
    isRefundEligible,
  };
}

export function toMyClassesBookingItemWithContext(
  booking: BookingRow,
  context: MyClassesBookingItemContext,
): ClassBookingItem {
  return toMyClassesBookingItem({
    booking,
    now: context.now,
    cancellationRefundWindowMs: context.cancellationRefundWindowMs,
    dateFormatter: context.dateFormatter,
    timeFormatter: context.timeFormatter,
  });
}

export function toMyClassesBookingItemsWithContext(
  bookings: BookingRow[],
  context: MyClassesBookingItemContext,
): ClassBookingItem[] {
  return bookings.map((booking) => toMyClassesBookingItemWithContext(booking, context));
}
