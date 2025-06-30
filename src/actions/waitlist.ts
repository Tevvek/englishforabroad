import { ActionError, defineAction } from "astro:actions";
import { BREVO_API_KEY } from "astro:env/server";
import { z } from "astro:schema";

const WAITLIST_LIST_ID = 7;

export const waitlist = defineAction({
  input: z.object({
    name: z.string(),
    email: z.string().email(),
    consent: z.boolean().default(false).optional(),
  }),
  handler: async ({ name, email, consent }) => {
    if (!consent) {
      throw new ActionError({
        code: "BAD_REQUEST",
        message: "You must consent to receive emails",
      });
    }

    const response = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": BREVO_API_KEY,
        Accept: "application/json",
      },
      body: JSON.stringify({
        email: email,
        attributes: {
          FIRSTNAME: name,
        },
        listIds: [WAITLIST_LIST_ID],
        updateEnabled: true,
      }),
    });

    if (!response.ok) {
      return {
        error: "Failed to subscribe to waitlist",
      };
    }

    return {
      success: true,
      message: `🎉 You're on the list!
      You'll be the first to hear when enrollment opens.
      (Heads up— it might land in Promotions or Spam, so be sure to check there too!)

      Questions? Email me at ali@englishforabroad.com.`,
    };
  },
});
