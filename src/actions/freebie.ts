import { defineAction } from "astro:actions";
import { BREVO_API_KEY } from "astro:env/server";
import { z } from "astro:schema";

const NEW_SUBSCRIBERS_LIST_ID = 5;

export const freebie = defineAction({
  input: z.object({
    name: z.string(),
    email: z.string().email(),
  }),
  handler: async ({ name, email }) => {
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
      message: "Subscribed to newsletter!",
    };
  },
});
