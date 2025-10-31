import { eq, and, gte, lte, inArray } from "astro:db";

// ===============================
// Types
// ===============================
export type BookableSlot = {
  startUTC: string; // "2025-10-01T07:00:00Z"
  endUTC: string; // "2025-10-01T07:50:00Z"
  localStart: string; // "2025-10-01T16:00:00+09:00"
  localEnd: string; // "2025-10-01T16:50:00+09:00"
  displayTime: string; // "16:00"
};

export type ServerDayAvailability = {
  date: string; // "2025-10-01"
  bookableSlots: BookableSlot[];
};

export type ServerMonthResponse = {
  month: string; // "2025-10"
  days: ServerDayAvailability[];
  teacherTimezone: string;
  studentTimezone: string;
};

export async function getBookableSlots(
  date: Date,
  studentTimezone?: string
): Promise<ServerMonthResponse> {
  const { Temporal } = await import("@js-temporal/polyfill");
  const {
    db,
    TeacherAvailability,
    TeacherAvailabilityOverride,
    ClassBooking,
    ClassSettings,
  } = await import("astro:db");

  // Get the target month from the date
  const targetMonth = Temporal.PlainDate.from({
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: 1,
  });

  // Calculate date range for the entire month
  const startOfMonth = targetMonth;
  const endOfMonth = targetMonth.add({ months: 1 }).subtract({ days: 1 });

  // Get settings from database
  const settings = await db.select().from(ClassSettings);
  const settingsMap = settings.reduce((acc, setting) => {
    acc[setting.key] =
      setting.type === "number" ? parseInt(setting.value) : setting.value;
    return acc;
  }, {} as Record<string, any>);

  const classDuration = settingsMap.class_duration || 50; // minutes
  const slotInterval = settingsMap.slot_interval || 30; // minutes
  const maxAdvanceBookingDays = settingsMap.max_advance_booking_days || 30;
  const bookingWindowHours = settingsMap.booking_window_hours || 24;

  // Get teacher availability
  const teacherAvailability = await db
    .select()
    .from(TeacherAvailability)
    .where(eq(TeacherAvailability.isActive, true));

  // Get teacher availability overrides for the month
  const overrides = await db
    .select()
    .from(TeacherAvailabilityOverride)
    .where(
      and(
        gte(TeacherAvailabilityOverride.date, startOfMonth.toString()),
        lte(TeacherAvailabilityOverride.date, endOfMonth.toString()),
        eq(TeacherAvailabilityOverride.isActive, true)
      )
    );

  // Get existing bookings for the month in UTC
  const startOfMonthUTC = startOfMonth
    .toZonedDateTime("Europe/Madrid")
    .withPlainTime("00:00")
    .toInstant()
    .toString();
  const endOfMonthUTC = endOfMonth
    .toZonedDateTime("Europe/Madrid")
    .withPlainTime("23:59")
    .toInstant()
    .toString();

  const existingBookings = await db
    .select()
    .from(ClassBooking)
    .where(
      and(
        gte(ClassBooking.startTimeUTC, startOfMonthUTC),
        lte(ClassBooking.startTimeUTC, endOfMonthUTC),
        inArray(ClassBooking.status, ["scheduled", "completed"])
      )
    );

  // Create a Set of booked time slots for quick lookup
  const bookedSlots = new Set(
    existingBookings.map((booking) => booking.startTimeUTC)
  );

  // Get current time for validation
  const now = Temporal.Now.instant();
  const nowMadrid = now.toZonedDateTimeISO("Europe/Madrid");
  const minBookingTime = nowMadrid.add({ hours: bookingWindowHours });
  const maxBookingTime = nowMadrid.add({ days: maxAdvanceBookingDays });

  const days: ServerDayAvailability[] = [];

  // Iterate through each day of the month
  let currentDate = startOfMonth;
  while (currentDate.toString() <= endOfMonth.toString()) {
    const dayOfWeek = currentDate.dayOfWeek === 7 ? 0 : currentDate.dayOfWeek; // Convert Sunday from 7 to 0

    // Check if there are overrides for this specific date
    const dayOverrides = overrides.filter(
      (override) => override.date === currentDate.toString()
    );

    let availabilityWindows: Array<{ startTime: string; endTime: string }> = [];

    if (dayOverrides.length > 0) {
      // Use overrides instead of regular availability
      availabilityWindows = dayOverrides.map((override) => ({
        startTime: override.startTime,
        endTime: override.endTime,
      }));
    } else {
      // Use regular teacher availability for this day of week
      const dayAvailability = teacherAvailability.filter(
        (avail) => avail.dayOfWeek === dayOfWeek
      );
      availabilityWindows = dayAvailability.map((avail) => ({
        startTime: avail.startTime,
        endTime: avail.endTime,
      }));
    }

    const bookableSlots: BookableSlot[] = [];

    // Generate slots for each availability window
    for (const window of availabilityWindows) {
      const [startHour, startMinute] = window.startTime.split(":").map(Number);
      const [endHour, endMinute] = window.endTime.split(":").map(Number);

      let currentSlotTime = currentDate
        .toZonedDateTime("Europe/Madrid")
        .withPlainTime({ hour: startHour, minute: startMinute });
      const windowEnd = currentDate
        .toZonedDateTime("Europe/Madrid")
        .withPlainTime({ hour: endHour, minute: endMinute });

      while (
        currentSlotTime.add({ minutes: classDuration }).epochMilliseconds <=
        windowEnd.epochMilliseconds
      ) {
        const slotStartUTC = currentSlotTime.toInstant();
        const slotEndUTC = currentSlotTime
          .add({ minutes: classDuration })
          .toInstant();

        // Validate time constraints
        const isWithinBookingWindow =
          slotStartUTC.epochMilliseconds >= minBookingTime.epochMilliseconds &&
          slotStartUTC.epochMilliseconds <= maxBookingTime.epochMilliseconds;

        // Check if slot is not already booked
        const isNotBooked = !bookedSlots.has(slotStartUTC.toString());

        if (isWithinBookingWindow && isNotBooked) {
          // Convert to student timezone if provided, otherwise use Madrid time
          const studentTz = studentTimezone || "Europe/Madrid";
          const slotInStudentTz = slotStartUTC.toZonedDateTimeISO(studentTz);
          const slotEndInStudentTz = slotEndUTC.toZonedDateTimeISO(studentTz);

          bookableSlots.push({
            startUTC: slotStartUTC.toString(),
            endUTC: slotEndUTC.toString(),
            localStart: slotInStudentTz.toString(),
            localEnd: slotEndInStudentTz.toString(),
            displayTime: `${slotInStudentTz.hour
              .toString()
              .padStart(2, "0")}:${slotInStudentTz.minute
              .toString()
              .padStart(2, "0")}`,
          });
        }

        // Move to next slot interval
        currentSlotTime = currentSlotTime.add({ minutes: slotInterval });
      }
    }

    days.push({
      date: currentDate.toString(),
      bookableSlots,
    });

    currentDate = currentDate.add({ days: 1 });
  }

  return {
    month: targetMonth.toString().slice(0, 7), // "2025-10"
    days,
    teacherTimezone: "Europe/Madrid",
    studentTimezone: studentTimezone || "Europe/Madrid",
  };
}
