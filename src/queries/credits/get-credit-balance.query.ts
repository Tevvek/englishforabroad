import { getCreditsSummary } from "@/queries/credits/get-credits-summary.query";

export async function getCreditBalance(userId: string) {
  const creditsSummary = await getCreditsSummary(userId);

  return creditsSummary.currentBalance;
}
