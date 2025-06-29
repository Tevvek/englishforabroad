import { ActionError, defineAction } from "astro:actions";
import { BREVO_API_KEY } from "astro:env/server";
import { z } from "astro:schema";

const NEW_SUBSCRIBERS_LIST_ID = 5;

export const freebie = defineAction({
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
        listIds: [NEW_SUBSCRIBERS_LIST_ID],
        updateEnabled: true,
      }),
    });

    if (!response.ok) {
      return {
        error: "Failed to subscribe to newsletter",
      };
    }

    return {
      success: true,
      message: `🎉 You're in!
      Check your inbox— your free guide is on its way!
      (It might land in Promotions or Spam, so be sure to check there too.)

      Can't find it? Email me anytime at ali@englishforabroad.com`,
    };
  },
});
