import { db, eq, TeacherScheduleRule } from "astro:db";

import { withCachedJson } from "@/lib/cache/with-cache";

const ACTIVE_SCHEDULE_RULES_CACHE_TTL_SECONDS = 300;

type ActiveScheduleRule = Awaited<ReturnType<typeof loadActiveScheduleRules>>[number];

function isActiveScheduleRule(value: unknown): value is ActiveScheduleRule {
  if (!value || typeof value !== "object") {
    return false;
  }

  const rule = value as Partial<ActiveScheduleRule>;

  return (
    typeof rule.id === "string" &&
    typeof rule.weekday === "number" &&
    typeof rule.startMinute === "number" &&
    typeof rule.endMinute === "number" &&
    typeof rule.slotIntervalMinutes === "number" &&
    typeof rule.isActive === "boolean"
  );
}

function isActiveScheduleRules(value: unknown): value is ActiveScheduleRule[] {
  return Array.isArray(value) && value.every((rule) => isActiveScheduleRule(rule));
}

async function loadActiveScheduleRules() {
  return db
    .select()
    .from(TeacherScheduleRule)
    .where(eq(TeacherScheduleRule.isActive, true));
}

export async function listActiveScheduleRules() {
  return withCachedJson({
    key: "schedule:rules:active",
    ttlSeconds: ACTIVE_SCHEDULE_RULES_CACHE_TTL_SECONDS,
    isValid: isActiveScheduleRules,
    load: loadActiveScheduleRules,
  });
}
