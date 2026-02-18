import type { CreditsLedgerEntry } from "@/queries/credits/list-credit-ledger-entries.query";
import { listCreditLedgerEntries } from "@/queries/credits/list-credit-ledger-entries.query";

export interface CreditsSummary {
  currentBalance: number;
  totalGranted: number;
  totalUsed: number;
}

export function buildCreditsSummary(ledgerEntries: CreditsLedgerEntry[]) {
  return ledgerEntries.reduce<CreditsSummary>(
    (summary, entry) => {
      const delta = entry.creditsDelta;

      summary.currentBalance += delta;

      if (delta > 0) {
        summary.totalGranted += delta;
      } else if (delta < 0) {
        summary.totalUsed += Math.abs(delta);
      }

      return summary;
    },
    {
      currentBalance: 0,
      totalGranted: 0,
      totalUsed: 0,
    },
  );
}

export async function getCreditsSummary(userId: string): Promise<CreditsSummary> {
  const ledgerEntries = await listCreditLedgerEntries(userId);

  return buildCreditsSummary(ledgerEntries);
}
