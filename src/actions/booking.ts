import { ActionError, defineAction } from "astro:actions";
import {
  and,
  ClassBooking,
  CreditLedger,
  db,
  eq,
  gte,
  lt,
  sum,
  TeacherScheduleRule,
} from "astro:db";
import { z } from "astro:schema";

import {
  buildMonthClassAvailability,
  CLASS_DURATION_MINUTES,
  getUtcRangeForKstMonth,
  isUtcSlotWithinSchedule,
} from "@/lib/booking-schedule";
import { deleteCachedKey } from "@/lib/cache/with-cache";

export const getClassAvailabilityForMonth = defineAction({
  input: z.object({
    month: z.string().regex(/^\d{4}-\d{2}$/),
  }),
  handler: async ({ month }, context) => {
    if (!context.locals.user) {
      throw new ActionError({
        code: "UNAUTHORIZED",
        message: "Please sign in to continue.",
      });
    }

    const scheduleRules = await db
      .select()
      .from(TeacherScheduleRule)
      .where(eq(TeacherScheduleRule.isActive, true));

    if (scheduleRules.length === 0) {
      return { availableDates: [], slotsByDate: {} };
    }

    let monthRange: ReturnType<typeof getUtcRangeForKstMonth>;

    try {
      monthRange = getUtcRangeForKstMonth(month);
    } catch {
      throw new ActionError({
        code: "BAD_REQUEST",
        message: "Invalid month format.",
      });
    }

    const bookedClasses = await db
      .select({ startsAt: ClassBooking.startsAt })
      .from(ClassBooking)
      .where(
        and(
          eq(ClassBooking.status, "booked"),
          gte(ClassBooking.startsAt, monthRange.startAt),
          lt(ClassBooking.startsAt, monthRange.endAt),
        ),
      );

    const bookedStartsAt = new Set(
      bookedClasses.map((booking) => new Date(booking.startsAt).getTime()),
    );

    try {
      return buildMonthClassAvailability({
        kstMonth: month,
        rules: scheduleRules,
        bookedStartsAt,
      });
    } catch {
      throw new ActionError({
        code: "BAD_REQUEST",
        message: "Invalid month format.",
      });
    }
  },
});

export const bookClassSlot = defineAction({
  input: z.object({
    startsAtUtc: z.string(),
  }),
  handler: async ({ startsAtUtc }, context) => {
    const user = context.locals.user;

    if (!user) {
      throw new ActionError({
        code: "UNAUTHORIZED",
        message: "Please sign in to continue.",
      });
    }

    const scheduleRules = await db
      .select()
      .from(TeacherScheduleRule)
      .where(eq(TeacherScheduleRule.isActive, true));

    if (scheduleRules.length === 0) {
      throw new ActionError({
        code: "BAD_REQUEST",
        message: "No schedule is currently available.",
      });
    }

    let isSlotWithinSchedule = false;

    try {
      isSlotWithinSchedule = isUtcSlotWithinSchedule({
        startsAtUtc,
        rules: scheduleRules,
      });
    } catch {
      throw new ActionError({
        code: "BAD_REQUEST",
        message: "Invalid slot date.",
      });
    }

    if (!isSlotWithinSchedule) {
      throw new ActionError({
        code: "BAD_REQUEST",
        message: "This time slot is not available.",
      });
    }

    const startsAtDate = new Date(startsAtUtc);

    if (Number.isNaN(startsAtDate.getTime())) {
      throw new ActionError({
        code: "BAD_REQUEST",
        message: "Invalid slot date.",
      });
    }

    if (startsAtDate.getTime() <= Date.now()) {
      throw new ActionError({
        code: "BAD_REQUEST",
        message: "This time slot has already passed. Please choose another.",
      });
    }

    const existingBooking = await db
      .select()
      .from(ClassBooking)
      .where(
        and(
          eq(ClassBooking.startsAt, startsAtDate),
          eq(ClassBooking.status, "booked"),
        ),
      )
      .get();

    if (existingBooking) {
      throw new ActionError({
        code: "CONFLICT",
        message:
          "This slot was just booked by someone else. Please choose another.",
      });
    }

    const creditBalanceRow = await db
      .select({ credits: sum(CreditLedger.creditsDelta) })
      .from(CreditLedger)
      .where(eq(CreditLedger.userId, user.id))
      .get();

    const creditBalance = Number(creditBalanceRow?.credits ?? 0);

    if (creditBalance < 1) {
      throw new ActionError({
        code: "FORBIDDEN",
        message: "You need at least 1 credit to book a class.",
      });
    }

    const endsAtDate = new Date(
      startsAtDate.getTime() + CLASS_DURATION_MINUTES * 60 * 1000,
    );

    await db.insert(ClassBooking).values({
      id: crypto.randomUUID(),
      userId: user.id,
      startsAt: startsAtDate,
      endsAt: endsAtDate,
      status: "booked",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await db.insert(CreditLedger).values({
      id: crypto.randomUUID(),
      userId: user.id,
      entryType: "booking_deduct",
      creditsDelta: -1,
      description: `Class booked for ${startsAtDate.toISOString()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await deleteCachedKey(`credits:balance:${user.id}`);

    return {
      success: true,
    };
  },
});

const CANCELLATION_REFUND_WINDOW_HOURS = 24;

export const cancelClassBooking = defineAction({
  input: z.object({
    bookingId: z.string().min(1),
  }),
  handler: async ({ bookingId }, context) => {
    const user = context.locals.user;

    if (!user) {
      throw new ActionError({
        code: "UNAUTHORIZED",
        message: "Please sign in to continue.",
      });
    }

    const booking = await db
      .select({
        id: ClassBooking.id,
        startsAt: ClassBooking.startsAt,
        status: ClassBooking.status,
      })
      .from(ClassBooking)
      .where(
        and(eq(ClassBooking.id, bookingId), eq(ClassBooking.userId, user.id)),
      )
      .get();

    if (!booking) {
      throw new ActionError({
        code: "NOT_FOUND",
        message: "Booking not found.",
      });
    }

    if (booking.status !== "booked") {
      throw new ActionError({
        code: "BAD_REQUEST",
        message: "This class is already cancelled.",
      });
    }

    const startsAtDate = new Date(booking.startsAt);

    if (startsAtDate.getTime() <= Date.now()) {
      throw new ActionError({
        code: "BAD_REQUEST",
        message: "You can only cancel classes that have not started yet.",
      });
    }

    const refundWindowMs = CANCELLATION_REFUND_WINDOW_HOURS * 60 * 60 * 1000;
    const isRefundEligible =
      startsAtDate.getTime() - Date.now() >= refundWindowMs;

    await db
      .update(ClassBooking)
      .set({
        status: "cancelled",
        updatedAt: new Date(),
      })
      .where(
        and(eq(ClassBooking.id, booking.id), eq(ClassBooking.status, "booked")),
      );

    if (isRefundEligible) {
      await db.insert(CreditLedger).values({
        id: crypto.randomUUID(),
        userId: user.id,
        entryType: "booking_refund",
        creditsDelta: 1,
        description: `Class cancellation refund for ${startsAtDate.toISOString()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await deleteCachedKey(`credits:balance:${user.id}`);
    }

    return {
      success: true,
      refunded: isRefundEligible,
      refundWindowHours: CANCELLATION_REFUND_WINDOW_HOURS,
    };
  },
});
