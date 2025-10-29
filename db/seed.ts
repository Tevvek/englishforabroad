import {
  db,
  User,
  ClassBooking,
  TeacherAvailability,
  Holiday,
  TeacherUnavailability,
  ClassSettings,
} from "astro:db";
import { generatePublicId } from "@/utils/public-id";
import { hashPassword } from "@/pages/register/_utils/hash-password.util";
import type { ClassBookingRecord } from "./types";

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

  // Insert teacher availability (Monday to Friday, 9 AM to 5 PM) for the single teacher
  const availabilityData = [];
  for (let dayOfWeek = 1; dayOfWeek <= 5; dayOfWeek++) {
    // Monday to Friday
    availabilityData.push({
      dayOfWeek,
      startTime: "11:00",
      endTime: "16:00",
      isActive: true,
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
    });
  }
  await db.insert(TeacherAvailability).values(availabilityData);

  // Insert holidays
  await db.insert(Holiday).values([
    {
      id: 1,
      name: "Christmas Day",
      date: new Date("2025-12-25"),
      description: "Christmas holiday - no classes",
      isRecurring: true,
      createdBy: 1,
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
    },
    {
      id: 2,
      name: "Halloween",
      date: new Date("2025-10-31"),
      description: "Halloween holiday - no classes",
      isRecurring: true,
      createdBy: 1,
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
    },
    {
      id: 3,
      name: "Thanksgiving",
      date: new Date("2025-11-28"),
      description: "Thanksgiving holiday - no classes",
      isRecurring: true,
      createdBy: 1,
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
    },
  ]);

  // Insert some existing bookings (these will be unavailable dates)
  const bookingsData = [
    {
      id: 1,
      studentId: 3,
      scheduledDate: new Date("2025-10-30"),
      scheduledTime: "10:00",
      duration: 50,
      notes: "Focus on business presentation skills",
      status: "scheduled" as ClassBookingRecord["status"],
      createdAt: new Date("2025-10-29"),
      updatedAt: new Date("2025-10-29"),
    },
    {
      id: 2,
      studentId: 3,
      scheduledDate: new Date("2025-11-03"),
      scheduledTime: "14:00",
      duration: 50,
      notes: "Pronunciation practice for job interview",
      status: "scheduled" as ClassBookingRecord["status"],
      createdAt: new Date("2025-10-29"),
      updatedAt: new Date("2025-10-29"),
    },
    {
      id: 3,
      studentId: 2,
      scheduledDate: new Date("2025-11-05"),
      scheduledTime: "11:00",
      duration: 50,
      status: "scheduled" as ClassBookingRecord["status"],
      createdAt: new Date("2025-10-29"),
      updatedAt: new Date("2025-10-29"),
    },
  ];

  // Add many more bookings for the first week of November 2025 for testing
  // November 1, 2025 (Friday) - Almost fully booked
  bookingsData.push(
    {
      id: 4,
      studentId: 2,
      scheduledDate: new Date("2025-11-01"),
      scheduledTime: "11:00",
      duration: 60,
      notes: "Grammar review session",
      status: "scheduled" as ClassBookingRecord["status"],
      createdAt: new Date("2025-10-29"),
      updatedAt: new Date("2025-10-29"),
    },
    {
      id: 5,
      studentId: 3,
      scheduledDate: new Date("2025-11-01"),
      scheduledTime: "12:30",
      duration: 60,
      notes: "Conversation practice",
      status: "scheduled" as ClassBookingRecord["status"],
      createdAt: new Date("2025-10-29"),
      updatedAt: new Date("2025-10-29"),
    },
    {
      id: 6,
      studentId: 2,
      scheduledDate: new Date("2025-11-01"),
      scheduledTime: "14:00",
      duration: 60,
      notes: "Writing skills improvement",
      status: "scheduled" as ClassBookingRecord["status"],
      createdAt: new Date("2025-10-29"),
      updatedAt: new Date("2025-10-29"),
    },
    {
      id: 7,
      studentId: 3,
      scheduledDate: new Date("2025-11-01"),
      scheduledTime: "15:30",
      duration: 30,
      notes: "Quick pronunciation check",
      status: "scheduled" as ClassBookingRecord["status"],
      createdAt: new Date("2025-10-29"),
      updatedAt: new Date("2025-10-29"),
    }
  );

  // November 3, 2025 (Monday) - Partially booked
  bookingsData.push(
    {
      id: 8,
      studentId: 2,
      scheduledDate: new Date("2025-11-03"),
      scheduledTime: "11:00",
      duration: 45,
      notes: "Business English presentation",
      status: "scheduled" as ClassBookingRecord["status"],
      createdAt: new Date("2025-10-29"),
      updatedAt: new Date("2025-10-29"),
    },
    {
      id: 9,
      studentId: 3,
      scheduledDate: new Date("2025-11-03"),
      scheduledTime: "15:00",
      duration: 45,
      notes: "IELTS speaking practice",
      status: "scheduled" as ClassBookingRecord["status"],
      createdAt: new Date("2025-10-29"),
      updatedAt: new Date("2025-10-29"),
    }
  );

  // November 4, 2025 (Tuesday) - Fully booked (all 10 slots taken)
  bookingsData.push(
    {
      id: 10,
      studentId: 2,
      scheduledDate: new Date("2025-11-04"),
      scheduledTime: "11:00",
      duration: 30,
      status: "scheduled" as ClassBookingRecord["status"],
      createdAt: new Date("2025-10-29"),
      updatedAt: new Date("2025-10-29"),
    },
    {
      id: 11,
      studentId: 3,
      scheduledDate: new Date("2025-11-04"),
      scheduledTime: "11:30",
      duration: 30,
      status: "scheduled" as ClassBookingRecord["status"],
      createdAt: new Date("2025-10-29"),
      updatedAt: new Date("2025-10-29"),
    },
    {
      id: 12,
      studentId: 2,
      scheduledDate: new Date("2025-11-04"),
      scheduledTime: "12:00",
      duration: 30,
      status: "scheduled" as ClassBookingRecord["status"],
      createdAt: new Date("2025-10-29"),
      updatedAt: new Date("2025-10-29"),
    },
    {
      id: 13,
      studentId: 3,
      scheduledDate: new Date("2025-11-04"),
      scheduledTime: "12:30",
      duration: 30,
      status: "scheduled" as ClassBookingRecord["status"],
      createdAt: new Date("2025-10-29"),
      updatedAt: new Date("2025-10-29"),
    },
    {
      id: 14,
      studentId: 2,
      scheduledDate: new Date("2025-11-04"),
      scheduledTime: "13:00",
      duration: 30,
      status: "scheduled" as ClassBookingRecord["status"],
      createdAt: new Date("2025-10-29"),
      updatedAt: new Date("2025-10-29"),
    },
    {
      id: 15,
      studentId: 3,
      scheduledDate: new Date("2025-11-04"),
      scheduledTime: "13:30",
      duration: 30,
      status: "scheduled" as ClassBookingRecord["status"],
      createdAt: new Date("2025-10-29"),
      updatedAt: new Date("2025-10-29"),
    },
    {
      id: 16,
      studentId: 2,
      scheduledDate: new Date("2025-11-04"),
      scheduledTime: "14:00",
      duration: 30,
      status: "scheduled" as ClassBookingRecord["status"],
      createdAt: new Date("2025-10-29"),
      updatedAt: new Date("2025-10-29"),
    },
    {
      id: 17,
      studentId: 3,
      scheduledDate: new Date("2025-11-04"),
      scheduledTime: "14:30",
      duration: 30,
      status: "scheduled" as ClassBookingRecord["status"],
      createdAt: new Date("2025-10-29"),
      updatedAt: new Date("2025-10-29"),
    },
    {
      id: 18,
      studentId: 2,
      scheduledDate: new Date("2025-11-04"),
      scheduledTime: "15:00",
      duration: 30,
      status: "scheduled" as ClassBookingRecord["status"],
      createdAt: new Date("2025-10-29"),
      updatedAt: new Date("2025-10-29"),
    },
    {
      id: 19,
      studentId: 3,
      scheduledDate: new Date("2025-11-04"),
      scheduledTime: "15:30",
      duration: 30,
      status: "scheduled" as ClassBookingRecord["status"],
      createdAt: new Date("2025-10-29"),
      updatedAt: new Date("2025-10-29"),
    }
  );

  // November 6, 2025 (Thursday) - Light booking
  bookingsData.push({
    id: 20,
    studentId: 2,
    scheduledDate: new Date("2025-11-06"),
    scheduledTime: "13:00",
    duration: 60,
    notes: "Reading comprehension practice",
    status: "scheduled" as ClassBookingRecord["status"],
    createdAt: new Date("2025-10-29"),
    updatedAt: new Date("2025-10-29"),
  });

  // November 7, 2025 (Friday) - No bookings (completely available)

  await db.insert(ClassBooking).values(bookingsData);

  // Insert teacher unavailability (vacation time)
  await db.insert(TeacherUnavailability).values([
    {
      id: 1,
      startDate: new Date("2025-11-15"),
      endDate: new Date("2025-11-22"),
      reason: "Thanksgiving vacation",
      isAllDay: true,
      createdAt: new Date("2025-10-29"),
      updatedAt: new Date("2025-10-29"),
    },
  ]);

  // Insert class settings
  await db.insert(ClassSettings).values([
    {
      id: 1,
      key: "default_duration",
      value: "50",
      description: "Default class duration in minutes",
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
}
