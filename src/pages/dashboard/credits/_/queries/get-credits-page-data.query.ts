import { CreditLedger, db, desc, eq } from "astro:db";

import { withCachedJson } from "@/lib/cache/with-cache";

import { buildCreditsSummary } from "../utils/build-credits-summary.utils";

const CREDITS_PAGE_CACHE_TTL_SECONDS = 30;

export interface CreditsLedgerEntry {
  createdAt: Date;
  entryType: string;
  creditsDelta: number;
  description: string | null;
}

export interface CreditsPageData {
  summary: {
    currentBalance: number;
    totalGranted: number;
    totalUsed: number;
  };
  ledgerEntries: CreditsLedgerEntry[];
}

function isCreditsPageData(value: unknown): value is CreditsPageData {
  if (!value || typeof value !== "object") {
    return false;
  }

  const payload = value as Partial<CreditsPageData>;

  return (
    !!payload.summary &&
    Array.isArray(payload.ledgerEntries) &&
    typeof payload.summary.currentBalance === "number" &&
    typeof payload.summary.totalGranted === "number" &&
    typeof payload.summary.totalUsed === "number"
  );
}

export async function getCreditsPageData(userId: string): Promise<CreditsPageData> {
  return withCachedJson({
    key: `credits:page:${userId}`,
    ttlSeconds: CREDITS_PAGE_CACHE_TTL_SECONDS,
    isValid: isCreditsPageData,
    load: async () => {
      const ledgerEntries = await db
        .select({
          createdAt: CreditLedger.createdAt,
          entryType: CreditLedger.entryType,
          creditsDelta: CreditLedger.creditsDelta,
          description: CreditLedger.description,
        })
        .from(CreditLedger)
        .where(eq(CreditLedger.userId, userId))
        .orderBy(desc(CreditLedger.createdAt));

      return {
        summary: buildCreditsSummary(ledgerEntries),
        ledgerEntries,
      } satisfies CreditsPageData;
    },
  });
}
