import { hashPassword } from "@/pages/register/_utils/hash-password.util";
import { generatePublicId } from "@/utils/public-id";
import {
  ClassBooking,
  ClassSettings,
  db,
  User,
  TeacherAvailability,
  TeacherAvailabilityOverride,
} from "astro:db";
import { Temporal } from "@js-temporal/polyfill";

export default async function seed() {
  // Insert sample users
  await db.insert(User).values([
    {
      id: 1,
      publicId: generatePublicId(),
      username: "admin",
      email: "admin@englishforabroad.com",
      password: await hashPassword("Admin123"),
      role: "admin",
      confirmed: true,
      blocked: false,
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
      lastLoginAt: new Date("2024-01-01"),
    },
    {
      id: 2,
      publicId: generatePublicId(),
      username: "student",
      email: "student@example.com",
      password: await hashPassword("Student123"),
      role: "user",
      confirmed: true,
      blocked: false,
      createdAt: new Date("2024-01-02"),
      updatedAt: new Date("2024-01-02"),
      lastLoginAt: new Date("2024-01-02"),
    },
    {
      id: 3,
      publicId: generatePublicId(),
      username: "ali",
      email: "ali@englishforabroad.com",
      password: await hashPassword("123123123aA"),
      role: "user",
      confirmed: true,
      blocked: false,
      createdAt: new Date("2024-01-03"),
      updatedAt: new Date("2024-01-03"),
      lastLoginAt: new Date("2024-01-03"),
    },
  ]);

  const availabilityData = [];
  // 0 - Sunday, 1 - Monday, ... 6 - Saturday
  const weekdays = [1, 2, 3, 4, 5];
  for (let dayOfWeek of weekdays) {
    // First slot: 11:00 to 13:00
    availabilityData.push({
      dayOfWeek: dayOfWeek,
      startTime: "11:00",
      endTime: "13:00",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    // Second slot: 14:00 to 16:00 (break from 13:00 to 14:00)
    availabilityData.push({
      dayOfWeek: dayOfWeek,
      startTime: "14:00",
      endTime: "16:00",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
  await db.insert(TeacherAvailability).values(availabilityData);

  // Insert class settings
  await db.insert(ClassSettings).values([
    {
      id: 1,
      key: "class_duration",
      value: "50",
      description: "Class duration in minutes",
      type: "number",
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
    },
    {
      id: 2,
      key: "slot_interval",
      value: "30",
      description: "Time slot interval in minutes",
      type: "number",
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
    },
    {
      id: 3,
      key: "max_advance_booking_days",
      value: "30",
      description: "Maximum days in advance students can book classes",
      type: "number",
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
    },
    {
      id: 4,
      key: "booking_window_hours",
      value: "24",
      description: "Minimum hours before class start time to allow booking",
      type: "number",
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
    },
  ]);

  const madridSlot = Temporal.ZonedDateTime.from({
    year: 2025,
    month: 11,
    day: 3,
    hour: 11,
    minute: 30,
    timeZone: "Europe/Madrid",
  });

  const startUTC = madridSlot.toInstant();
  const endUTC = madridSlot.add({ minutes: 50 }).toInstant();

  await db.insert(ClassBooking).values({
    id: 1,
    studentId: 1,
    startTimeUTC: startUTC.toString(),
    endTimeUTC: endUTC.toString(),
    duration: 50,
    teacherTimezone: "Europe/Madrid",
    studentTimezone: "Asia/Seoul",
    status: "scheduled",
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}
