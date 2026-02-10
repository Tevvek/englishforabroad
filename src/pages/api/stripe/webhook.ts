export const prerender = false;

import { STRIPE_WEBHOOK_SECRET } from "astro:env/server";
import { db, eq, CreditLedger, StripeEvent, User } from "astro:db";
import type { APIRoute } from "astro";
import type Stripe from "stripe";

import { stripe } from "@/lib/stripe";

const CREDITS_PER_PURCHASE = 12;

async function handleCheckoutSessionCompleted(event: Stripe.Event) {
  const checkoutSession = event.data.object as Stripe.Checkout.Session;

  if (checkoutSession.payment_status !== "paid") {
    return;
  }

  const stripeCustomerId =
    typeof checkoutSession.customer === "string"
      ? checkoutSession.customer
      : checkoutSession.customer?.id;

  if (!stripeCustomerId) {
    throw new Error("Checkout session does not include a Stripe customer ID");
  }

  const users = await db
    .select()
    .from(User)
    .where(eq(User.stripeCustomerId, stripeCustomerId));

  const user = users[0];

  if (!user) {
    throw new Error(`No user found for Stripe customer ${stripeCustomerId}`);
  }

  await db.insert(CreditLedger).values({
    id: crypto.randomUUID(),
    userId: user.id,
    stripeEventId: event.id,
    entryType: "purchase_grant",
    creditsDelta: CREDITS_PER_PURCHASE,
    description: checkoutSession.id
      ? `Credits granted from Stripe checkout session ${checkoutSession.id}`
      : "Credits granted from Stripe checkout",
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}

export const POST: APIRoute = async ({ request }) => {
  const stripeSignature = request.headers.get("stripe-signature");

  if (!stripeSignature) {
    return new Response("Missing stripe-signature header", { status: 400 });
  }

  const payload = await request.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      payload,
      stripeSignature,
      STRIPE_WEBHOOK_SECRET,
    );
  } catch (error) {
    console.error("Stripe webhook signature verification failed", error);
    return new Response("Invalid Stripe signature", { status: 400 });
  }

  const existingEvent = await db
    .select()
    .from(StripeEvent)
    .where(eq(StripeEvent.stripeEventId, event.id));

  if (existingEvent[0]) {
    return new Response(JSON.stringify({ received: true, duplicate: true }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  }

  const internalEventId = crypto.randomUUID();

  await db.insert(StripeEvent).values({
    id: internalEventId,
    stripeEventId: event.id,
    eventType: event.type,
    status: "received",
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  try {
    if (event.type === "checkout.session.completed") {
      await handleCheckoutSessionCompleted(event);
    }

    await db
      .update(StripeEvent)
      .set({
        status: "processed",
        processedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(StripeEvent.id, internalEventId));
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown webhook processing error";

    console.error("Stripe webhook processing failed", error);

    await db
      .update(StripeEvent)
      .set({
        status: "failed",
        errorMessage,
        updatedAt: new Date(),
      })
      .where(eq(StripeEvent.id, internalEventId));

    return new Response("Webhook processing failed", { status: 500 });
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
};
