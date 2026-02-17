import { getCreditBalance } from "./queries/get-credit-balance.query";
import { getUserStripeCustomerId } from "./queries/get-user-stripe-customer-id.query";
import { listPaymentPurchases } from "./queries/list-payment-purchases.query";

export interface PaymentsPageData {
  creditBalance: number;
  purchases: Awaited<ReturnType<typeof listPaymentPurchases>>;
}

export async function getPaymentsPageData(userId: string): Promise<PaymentsPageData> {
  const [creditBalance, stripeCustomerId] = await Promise.all([
    getCreditBalance(userId),
    getUserStripeCustomerId(userId),
  ]);

  const purchases = await listPaymentPurchases(stripeCustomerId);

  return {
    creditBalance,
    purchases,
  };
}
