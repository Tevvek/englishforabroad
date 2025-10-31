import { Schedule, eq, db } from "astro:db";

export const getCurrentMonthAvailability = async (today: Date) => {
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  // Get month date range for calendar view (including prev/next month days shown in calendar)
  const firstDay = new Date(currentYear, currentMonth, 1);
  const lastDay = new Date(currentYear, currentMonth + 1, 0);

  // Get the Monday of the week containing the first day
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - startDate.getDay() + 1);

  // Get the Sunday of the week containing the last day
  const endDate = new Date(lastDay);
  endDate.setDate(endDate.getDate() + (7 - endDate.getDay()));

  // Fetch teacher availability from database
  const Schedule = await db
    .select()
    .from(Schedule)
    .where(eq(Schedule.isActive, true));
};
