import { stripe } from "@/lib/stripe";

export interface PaymentPurchase {
  id: string;
  amountTotal: number | null;
  currency: string | null;
  status: string | null;
  paymentStatus: string | null;
  created: number;
  receiptUrl: string | null;
}

export async function listPaymentPurchases(stripeCustomerId: string | null) {
  if (!stripeCustomerId) {
    return [] satisfies PaymentPurchase[];
  }

  const checkoutSessions = await stripe.checkout.sessions.list({
    customer: stripeCustomerId,
    limit: 10,
  });

  const paymentIntentIds = checkoutSessions.data
    .map((session) => session.payment_intent)
    .filter(
      (paymentIntent): paymentIntent is string =>
        typeof paymentIntent === "string",
    );

  const paymentIntentsById = new Map(
    await Promise.all(
      paymentIntentIds.map(async (paymentIntentId) => {
        const paymentIntent = await stripe.paymentIntents.retrieve(
          paymentIntentId,
          {
            expand: ["latest_charge"],
          },
        );

        return [paymentIntentId, paymentIntent] as const;
      }),
    ),
  );

  return checkoutSessions.data.map((session) => {
    const paymentIntentId =
      typeof session.payment_intent === "string" ? session.payment_intent : null;
    const paymentIntent = paymentIntentId
      ? paymentIntentsById.get(paymentIntentId)
      : null;
    const charge = paymentIntent?.latest_charge;
    const receiptUrl =
      charge && typeof charge !== "string" ? charge.receipt_url : null;

    return {
      id: session.id,
      amountTotal: session.amount_total,
      currency: session.currency,
      status: session.status,
      paymentStatus: session.payment_status,
      created: session.created,
      receiptUrl,
    } satisfies PaymentPurchase;
  });
}
