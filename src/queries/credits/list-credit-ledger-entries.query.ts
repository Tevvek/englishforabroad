import { CreditLedger, db, desc, eq } from "astro:db";

import { withCachedJson } from "@/lib/cache/with-cache";

const CREDIT_ACTIVITY_CACHE_TTL_SECONDS = 30;

export interface CreditsLedgerEntry {
  createdAt: Date;
  entryType: string;
  creditsDelta: number;
  description: string | null;
}

function isCreditsLedgerEntry(value: unknown): value is CreditsLedgerEntry {
  if (!value || typeof value !== "object") {
    return false;
  }

  const entry = value as Partial<CreditsLedgerEntry>;

  return (
    typeof entry.createdAt !== "undefined" &&
    typeof entry.entryType === "string" &&
    typeof entry.creditsDelta === "number" &&
    (typeof entry.description === "string" || entry.description === null)
  );
}

function isCreditsLedgerEntries(value: unknown): value is CreditsLedgerEntry[] {
  return Array.isArray(value) && value.every((entry) => isCreditsLedgerEntry(entry));
}

export async function listCreditLedgerEntries(
  userId: string,
): Promise<CreditsLedgerEntry[]> {
  return withCachedJson({
    key: `credits:activity:${userId}`,
    ttlSeconds: CREDIT_ACTIVITY_CACHE_TTL_SECONDS,
    isValid: isCreditsLedgerEntries,
    load: async () => {
      return db
        .select({
          createdAt: CreditLedger.createdAt,
          entryType: CreditLedger.entryType,
          creditsDelta: CreditLedger.creditsDelta,
          description: CreditLedger.description,
        })
        .from(CreditLedger)
        .where(eq(CreditLedger.userId, userId))
        .orderBy(desc(CreditLedger.createdAt));
    },
  });
}
