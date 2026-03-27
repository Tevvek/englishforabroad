import { ActionError, defineAction } from "astro:actions";
import { BREVO_API_KEY } from "astro:env/server";
import { z } from "astro/zod";

const WAITLIST_LIST_ID = 11;

export const waitlist = defineAction({
  input: z.object({
    name: z.string(),
    email: z.email(),
    location: z.string(),
    consent: z.boolean().default(false).optional(),
  }),
  handler: async ({ name, email, location, consent }) => {
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
          LOCATION: location,
        },
        listIds: [WAITLIST_LIST_ID],
        updateEnabled: true,
      }),
    });

    if (!response.ok) {
      throw new ActionError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to subscribe to waitlist",
      });
    }

    return {
      success: true,
      message: `You’re on the list! Check your inbox for a quick welcome email (and check in spam just in case).\n\nDidn’t get it? DM me on Instagram @englishforabroad and I’ll help you out!`,
    };
  },
});
