import { stripe } from "@/lib/stripe";
import { ActionError, defineAction } from "astro:actions";
import {
  SITE,
  STRIPE_FULL_PAYMENT_PRICE_ID,
  STRIPE_INSTALLMENTS_PRICE_ID,
} from "astro:env/server";
import { z } from "astro:schema";
import type { User } from "better-auth";
import type Stripe from "stripe";

function BASE_CONFIG(user: User) {
  return {
    customer_email: user.email,
    success_url: `${SITE}/dashboard/purchase?success=true`,
    cancel_url: `${SITE}/dashboard/purchase?canceled=true`,
  };
}

const PAYMENT_PLANS = {
  "full-payment": (user: User) => ({
    mode: "payment" as const,
    line_items: [
      {
        price: STRIPE_FULL_PAYMENT_PRICE_ID,
        quantity: 1,
      },
    ],
    payment_intent_data: {
      metadata: {
        userId: user.id,
      },
    },
  }),
  installments: (user: User) => ({
    mode: "subscription" as const,
    line_items: [
      {
        price: STRIPE_INSTALLMENTS_PRICE_ID,
        quantity: 1,
      },
    ],
    subscription_data: {
      metadata: {
        userId: user.id,
        priceId: STRIPE_INSTALLMENTS_PRICE_ID,
        months: 3,
      },
    },
  }),
};

export const purchase = defineAction({
  input: z.object({
    id: z.enum(["full-payment", "installments"]),
  }),
  handler: async (input, ctx) => {
    if (!ctx.locals.user) {
      return new ActionError({
        message: "User not found",
        code: "NOT_FOUND",
      });
    }

    const session = await createCheckoutSession(ctx.locals.user, input.id);

    return session.url;
  },
});

async function createCheckoutSession(
  user: User,
  paymentType: "full-payment" | "installments"
) {
  const config = {
    ...BASE_CONFIG(user),
    ...PAYMENT_PLANS[paymentType](user),
  } as Stripe.Checkout.SessionCreateParams;

  const session = await stripe.checkout.sessions.create(config);

  return session;
}
