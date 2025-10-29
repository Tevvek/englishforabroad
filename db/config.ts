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
    scheduledDate: column.date(),
    scheduledTime: column.text(), // "HH:MM" format
    duration: column.number({ default: 50 }), // minutes
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
    dayOfWeek: column.number(), // 0-6 (Sunday to Saturday)
    startTime: column.text(), // "HH:MM" format
    endTime: column.text(), // "HH:MM" format
    isActive: column.boolean({ default: true }),
  },
});

export const Holiday = defineTableWithTimestamps({
  columns: {
    id: column.number({ primaryKey: true }),
    name: column.text(),
    date: column.date(),
    description: column.text({ optional: true }),
    isRecurring: column.boolean({ default: false }), // for annual holidays
    createdBy: column.number({ references: () => User.columns.id }),
  },
});

export const TeacherUnavailability = defineTableWithTimestamps({
  columns: {
    id: column.number({ primaryKey: true }),
    startDate: column.date(),
    endDate: column.date(),
    reason: column.text({ optional: true }),
    isAllDay: column.boolean({ default: true }),
    startTime: column.text({ optional: true }), // for partial day unavailability
    endTime: column.text({ optional: true }),
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
    User,
    Session,
    EmailConfirmation,
    PasswordReset,
    ClassBooking,
    TeacherAvailability,
    Holiday,
    TeacherUnavailability,
    ClassSettings,
  },
});
