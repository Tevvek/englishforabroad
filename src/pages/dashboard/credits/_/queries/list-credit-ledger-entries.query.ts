import { CreditLedger, db, desc, eq } from "astro:db";

export async function listCreditLedgerEntries(userId: string) {
  return db
    .select()
    .from(CreditLedger)
    .where(eq(CreditLedger.userId, userId))
    .orderBy(desc(CreditLedger.createdAt));
}
