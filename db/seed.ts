import { db, TeacherScheduleRule } from "astro:db";

const DEFAULT_WEEKDAY_RULES = [1, 2, 3, 4, 5].map((weekday) => ({
  id: `default-rule-${weekday}`,
  weekday,
  startMinute: 9 * 60,
  endMinute: 18 * 60,
  slotIntervalMinutes: 60,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
}));

// https://astro.build/db/seed
export default async function seed() {
  await db.delete(TeacherScheduleRule);
  await db.insert(TeacherScheduleRule).values(DEFAULT_WEEKDAY_RULES);
}
