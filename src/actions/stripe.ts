import { ActionError, defineAction } from "astro:actions"
import { STRIPE_PRICE_ID, SITE } from "astro:env/server"
import { db, eq, User } from "astro:db"

import { stripe } from "@/lib/stripe"

function getSiteBaseUrl() {
  return SITE.endsWith("/") ? SITE.slice(0, -1) : SITE
}

export const createStripeCheckout = defineAction({
  handler: async (_input, context) => {
    const user = context.locals.user

    if (!user) {
      throw new ActionError({
        code: "UNAUTHORIZED",
        message: "Please sign in to continue.",
      })
    }

    try {
      let stripeCustomerId = user.stripeCustomerId

      if (!stripeCustomerId) {
        const customer = await stripe.customers.create({
          email: user.email ?? undefined,
          name: user.name ?? undefined,
          metadata: {
            userId: user.id,
          },
        })

        stripeCustomerId = customer.id

        await db
          .update(User)
          .set({ stripeCustomerId, updatedAt: new Date() })
          .where(eq(User.id, user.id))
      }

      const siteBaseUrl = getSiteBaseUrl()

      const checkoutSession = await stripe.checkout.sessions.create({
        mode: "payment",
        customer: stripeCustomerId,
        line_items: [{ price: STRIPE_PRICE_ID, quantity: 1 }],
        success_url:
          `${siteBaseUrl}/dashboard/payments` +
          "?checkout=success&session_id={CHECKOUT_SESSION_ID}",
        cancel_url: `${siteBaseUrl}/dashboard/payments?checkout=cancel`,
      })

      if (!checkoutSession.url) {
        throw new Error("Checkout session URL is missing")
      }

      return {
        checkoutUrl: checkoutSession.url,
      }
    } catch (error) {
      console.error("Stripe checkout session creation failed", error)
      throw new ActionError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Unable to start checkout. Please try again in a moment.",
      })
    }
  },
})
