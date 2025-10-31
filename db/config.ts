import { defineDb, column } from "astro:db";
import { defineTableWithTimestamps } from "./utils";

export const User = defineTableWithTimestamps({
  columns: {
    id: column.number({ primaryKey: true }),
    publicId: column.text({ unique: true }),
    username: column.text({ unique: true }),
    email: column.text({ unique: true }),
    password: column.text(),
    role: column.text({ default: "user", enum: ["user", "admin"] }),
    confirmed: column.boolean({ default: false }),
    blocked: column.boolean({ default: false }),
    lastLoginAt: column.date({ optional: true }),
  },
});

export const Session = defineTableWithTimestamps({
  columns: {
    id: column.number({ primaryKey: true }),
    userId: column.number({ references: () => User.columns.id }),
    token: column.text({ unique: true }),
    expiresAt: column.date(),
    ipAddress: column.text(),
    userAgent: column.text(),
  },
});

export const EmailConfirmation = defineTableWithTimestamps({
  columns: {
    id: column.number({ primaryKey: true }),
    userId: column.number({ references: () => User.columns.id }),
    token: column.text({ unique: true }),
    expiresAt: column.date(),
    confirmed: column.boolean({ default: false }),
  },
});

export const PasswordReset = defineTableWithTimestamps({
  columns: {
    id: column.number({ primaryKey: true }),
    userId: column.number({ references: () => User.columns.id }),
    token: column.text({ unique: true }),
    expiresAt: column.date(),
    used: column.boolean({ default: false }),
  },
});

export const ClassBooking = defineTableWithTimestamps({
  columns: {
    id: column.number({ primaryKey: true }),
    studentId: column.number({ references: () => User.columns.id }),

    // ✅ ISO UTC string ("2025-10-01T07:00:00Z")
    startTimeUTC: column.text(),
    endTimeUTC: column.text(),

    duration: column.number({ default: 50 }),

    // ✅ store actual timezone context for audit (optional but recommended)
    teacherTimezone: column.text({ default: "Europe/Madrid" }),
    studentTimezone: column.text({ optional: true }),

    notes: column.text({ optional: true }),
    status: column.text({
      default: "scheduled",
      enum: ["scheduled", "completed", "cancelled", "no_show"],
    }),
    cancellationReason: column.text({ optional: true }),
    teacherNotes: column.text({ optional: true }),
  },
});

export const TeacherAvailability = defineTableWithTimestamps({
  columns: {
    id: column.number({ primaryKey: true }),
    dayOfWeek: column.number(), // 0-6 instead of strings (easier math)
    startTime: column.text(), // "11:00"
    endTime: column.text(), // "16:00"
    isActive: column.boolean({ default: true }),

    // ✅ so system knows how to interpret local hours
    timeZone: column.text({ default: "Europe/Madrid" }),
  },
});

export const TeacherAvailabilityOverride = defineTableWithTimestamps({
  columns: {
    id: column.number({ primaryKey: true }),
    date: column.text(), // ✅ as "2025-03-04", not date type
    startTime: column.text(), // "11:00"
    endTime: column.text(), // "13:00"
    type: column.text({
      enum: ["override", "extra"],
    }),
    isActive: column.boolean({ default: true }),

    timeZone: column.text({ default: "Europe/Madrid" }),
    description: column.text({ optional: true }),
  },
});

export const ClassSettings = defineTableWithTimestamps({
  columns: {
    id: column.number({ primaryKey: true }),
    key: column.text({ unique: true }), // e.g., "default_duration", "slot_interval", "max_advance_booking_days"
    value: column.text(), // stored as string, parsed as needed
    description: column.text({ optional: true }),
    type: column.text({
      default: "string",
      enum: ["string", "number", "boolean", "json"],
    }),
  },
});

// https://astro.build/db/config
export default defineDb({
  tables: {
    // auth
    User,
    Session,
    EmailConfirmation,
    PasswordReset,

    // bookings
    ClassBooking,

    // availabilities
    TeacherAvailability,
    TeacherAvailabilityOverride,
    ClassSettings,
  },
});
