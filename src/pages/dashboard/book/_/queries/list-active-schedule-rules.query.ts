import { db, eq, TeacherScheduleRule } from "astro:db";

export async function listActiveScheduleRules() {
  return db
    .select()
    .from(TeacherScheduleRule)
    .where(eq(TeacherScheduleRule.isActive, true));
}
