import { CreditLedger, db, eq, sum } from "astro:db";

import { withCachedNumber } from "@/lib/cache/with-cache";

const CREDIT_BALANCE_CACHE_TTL_SECONDS = 30;

export async function getCreditBalance(userId: string) {
  return withCachedNumber({
    key: `credits:balance:${userId}`,
    ttlSeconds: CREDIT_BALANCE_CACHE_TTL_SECONDS,
    load: async () => {
      const creditBalanceRow = await db
        .select({ credits: sum(CreditLedger.creditsDelta) })
        .from(CreditLedger)
        .where(eq(CreditLedger.userId, userId))
        .get();

      return Number(creditBalanceRow?.credits ?? 0);
    },
  });
}
