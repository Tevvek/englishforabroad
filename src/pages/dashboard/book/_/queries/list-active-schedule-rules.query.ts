import { listActiveScheduleRules as listCachedActiveScheduleRules } from "@/queries/schedule/list-active-schedule-rules.query";

export async function listActiveScheduleRules() {
  return listCachedActiveScheduleRules();
}
