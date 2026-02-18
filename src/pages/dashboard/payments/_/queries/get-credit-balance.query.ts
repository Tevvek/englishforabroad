import { CreditLedger, db, eq, sum } from "astro:db";

import { getCreditBalanceCacheKey } from "@/lib/cache/credits-cache-keys";
import { getCachedNumber, setCachedNumber } from "@/lib/cache/upstash-kv";

const CREDIT_BALANCE_CACHE_TTL_SECONDS = 30;

export async function getCreditBalance(userId: string) {
  const cacheKey = getCreditBalanceCacheKey(userId);
  const cachedCredits = await getCachedNumber(cacheKey);

  if (cachedCredits !== null) {
    return cachedCredits;
  }

  const creditBalanceRow = await db
    .select({ credits: sum(CreditLedger.creditsDelta) })
    .from(CreditLedger)
    .where(eq(CreditLedger.userId, userId))
    .get();

  const credits = Number(creditBalanceRow?.credits ?? 0);

  await setCachedNumber(cacheKey, credits, CREDIT_BALANCE_CACHE_TTL_SECONDS);

  return credits;
}
