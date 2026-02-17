interface CreditsSummary {
  currentBalance: number;
  totalGranted: number;
  totalUsed: number;
}

interface LedgerEntry {
  creditsDelta: number;
}

export function buildCreditsSummary(ledgerEntries: LedgerEntry[]): CreditsSummary {
  return ledgerEntries.reduce(
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
    { currentBalance: 0, totalGranted: 0, totalUsed: 0 },
  );
}
