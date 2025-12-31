export const prerender = false;

import { stripe } from "@/lib/stripe";
import { toSync } from "@/utils/to";
import type { APIRoute } from "astro";
import { db, sql, UserCredits } from "astro:db";
import { STRIPE_WEBHOOK_SECRET } from "astro:env/server";
import type Stripe from "stripe";

export const POST: APIRoute = async ({ request }) => {
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return new Response("Missing signature", { status: 400 });
  }

  const body = await request.text();

  const [event, err] = toSync(
    stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET)
  );

  if (err) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case "payment_intent.succeeded":
      await handlePaymentIntent(event.data.object as Stripe.PaymentIntent);
      break;
    case "customer.subscription.created":
      await handleSubscriptionCreated(event.data.object as Stripe.Subscription);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return new Response(null, { status: 200 });
};

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  const userId = subscription.metadata.userId;

  if (!userId) {
    console.error("User ID not found in subscription metadata");
    return;
  }

  await addCreditsToUser(userId);
  await transformSubscriptionIntoSubscriptionSchedule(subscription);
}

async function handlePaymentIntent(intent: Stripe.PaymentIntent) {
  const userId = intent.metadata.userId;

  if (!userId) {
    console.error("User ID not found in payment intent metadata");
    return;
  }

  await addCreditsToUser(userId);
}

/**
 * Adds 12 credits to the user, which are added to existing credits if the user has any.
 */
async function addCreditsToUser(userId: string) {
  await db
    .insert(UserCredits)
    .values({ credits: 12, userId })
    .onConflictDoUpdate({
      target: UserCredits.userId,
      set: {
        credits: sql`${UserCredits.credits} + 12`,
      },
    });
}

/**
 * Transforms a subscription into a subscription schedule. Which makes this subscription get cancelled after 3 months.
 */
async function transformSubscriptionIntoSubscriptionSchedule(
  subscription: Stripe.Subscription
) {
  const schedule = await stripe.subscriptionSchedules.create({
    from_subscription: subscription.id,
  });

  const updated = await stripe.subscriptionSchedules.update(schedule.id, {
    end_behavior: "cancel",
    phases: [
      {
        items: [{ price: subscription.metadata.priceId, quantity: 1 }],
        start_date: schedule.phases[0].start_date, // start date can't change thus taking it from the original subscription
        duration: {
          interval: "month",
          interval_count: 3,
        },
      },
    ],
  });

  return updated;
}
