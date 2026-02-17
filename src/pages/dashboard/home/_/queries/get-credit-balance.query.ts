import { CreditLedger, db, eq, sum } from "astro:db";

export async function getCreditBalance(userId: string) {
  const creditBalanceRow = await db
    .select({ credits: sum(CreditLedger.creditsDelta) })
    .from(CreditLedger)
    .where(eq(CreditLedger.userId, userId))
    .get();

  return Number(creditBalanceRow?.credits ?? 0);
}
