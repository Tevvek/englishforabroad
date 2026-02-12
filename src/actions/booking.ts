import { ActionError, defineAction } from "astro:actions"
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
} from "astro:db"
import { z } from "astro:schema"

import {
  buildMonthClassAvailability,
  CLASS_DURATION_MINUTES,
  getUtcRangeForKstMonth,
  isUtcSlotWithinSchedule,
} from "@/lib/booking-schedule"

export const getClassAvailabilityForMonth = defineAction({
  input: z.object({
    month: z.string().regex(/^\d{4}-\d{2}$/),
  }),
  handler: async ({ month }, context) => {
    if (!context.locals.user) {
      throw new ActionError({
        code: "UNAUTHORIZED",
        message: "Please sign in to continue.",
      })
    }

    const scheduleRules = await db
      .select()
      .from(TeacherScheduleRule)
      .where(eq(TeacherScheduleRule.isActive, true))

    if (scheduleRules.length === 0) {
      return { availableDates: [], slotsByDate: {} }
    }

    let monthRange: ReturnType<typeof getUtcRangeForKstMonth>

    try {
      monthRange = getUtcRangeForKstMonth(month)
    } catch {
      throw new ActionError({
        code: "BAD_REQUEST",
        message: "Invalid month format.",
      })
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
      )

    const bookedStartsAt = new Set(
      bookedClasses.map((booking) => new Date(booking.startsAt).getTime()),
    )

    try {
      return buildMonthClassAvailability({
        kstMonth: month,
        rules: scheduleRules,
        bookedStartsAt,
      })
    } catch {
      throw new ActionError({
        code: "BAD_REQUEST",
        message: "Invalid month format.",
      })
    }
  },
})

export const bookClassSlot = defineAction({
  input: z.object({
    startsAtUtc: z.string(),
  }),
  handler: async ({ startsAtUtc }, context) => {
    const user = context.locals.user

    if (!user) {
      throw new ActionError({
        code: "UNAUTHORIZED",
        message: "Please sign in to continue.",
      })
    }

    const scheduleRules = await db
      .select()
      .from(TeacherScheduleRule)
      .where(eq(TeacherScheduleRule.isActive, true))

    if (scheduleRules.length === 0) {
      throw new ActionError({
        code: "BAD_REQUEST",
        message: "No schedule is currently available.",
      })
    }

    let isSlotWithinSchedule = false

    try {
      isSlotWithinSchedule = isUtcSlotWithinSchedule({
        startsAtUtc,
        rules: scheduleRules,
      })
    } catch {
      throw new ActionError({
        code: "BAD_REQUEST",
        message: "Invalid slot date.",
      })
    }

    if (!isSlotWithinSchedule) {
      throw new ActionError({
        code: "BAD_REQUEST",
        message: "This time slot is not available.",
      })
    }

    const startsAtDate = new Date(startsAtUtc)

    if (Number.isNaN(startsAtDate.getTime())) {
      throw new ActionError({
        code: "BAD_REQUEST",
        message: "Invalid slot date.",
      })
    }

    if (startsAtDate.getTime() <= Date.now()) {
      throw new ActionError({
        code: "BAD_REQUEST",
        message: "This time slot has already passed. Please choose another.",
      })
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
      .get()

    if (existingBooking) {
      throw new ActionError({
        code: "CONFLICT",
        message: "This slot was just booked by someone else. Please choose another.",
      })
    }

    const creditBalanceRow = await db
      .select({ credits: sum(CreditLedger.creditsDelta) })
      .from(CreditLedger)
      .where(eq(CreditLedger.userId, user.id))
      .get()

    const creditBalance = Number(creditBalanceRow?.credits ?? 0)

    if (creditBalance < 1) {
      throw new ActionError({
        code: "FORBIDDEN",
        message: "You need at least 1 credit to book a class.",
      })
    }

    const endsAtDate = new Date(
      startsAtDate.getTime() + CLASS_DURATION_MINUTES * 60 * 1000,
    )

    await db.insert(ClassBooking).values({
      id: crypto.randomUUID(),
      userId: user.id,
      startsAt: startsAtDate,
      endsAt: endsAtDate,
      status: "booked",
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    await db.insert(CreditLedger).values({
      id: crypto.randomUUID(),
      userId: user.id,
      entryType: "booking_deduct",
      creditsDelta: -1,
      description: `Class booked for ${startsAtDate.toISOString()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return {
      success: true,
    }
  },
})
