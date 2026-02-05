import { EMAIL_TRANSPORTER, MAIL_OPTIONS } from "@/utils/email";
import { ActionError, defineAction } from "astro:actions";
import { BREVO_API_KEY } from "astro:env/server";
import { z } from "astro:schema";
import nodemailer from "nodemailer";
import { getEntry } from "astro:content";

const BREVO_LIST_ID = 5;

export const freebieWatchAndLearn = defineAction({
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

    const brevoResult = await fetch("https://api.brevo.com/v3/contacts", {
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
        listIds: [BREVO_LIST_ID],
        updateEnabled: true,
      }),
    });

    if (!brevoResult.ok) {
      return {
        error: "Failed to subscribe to newsletter",
      };
    }

    const emailResult = await sendEmailNotificationToMyself(
      email,
      name,
      "Watch and Learn",
      "watch-and-learn"
    );
    if (!emailResult.accepted || emailResult.accepted.length === 0) {
      return { error: "Failed to send notification email" };
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

export const freebie = defineAction({
  input: z.object({
    name: z.string(),
    email: z.string().email(),
    consent: z.boolean().default(false).optional(),
    freebieSlug: z.string(),
  }),
  handler: async ({ name, email, consent, freebieSlug }) => {
    if (!consent) {
      throw new ActionError({
        code: "BAD_REQUEST",
        message: "You must consent to receive emails",
      });
    }

    const freebieData = await getEntry("freebies", freebieSlug);
    if (!freebieData) {
      throw new ActionError({
        code: "NOT_FOUND",
        message: "Freebie not found",
      });
    }

    const { title, resourceURL } = freebieData.data;

    const brevoResult = await fetch("https://api.brevo.com/v3/contacts", {
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
          RESOURCE_URL: resourceURL,
        },
        listIds: [BREVO_LIST_ID],
        updateEnabled: true,
      }),
    });

    if (!brevoResult.ok) {
      return {
        error: "Failed to subscribe to newsletter",
      };
    }

    const emailResult = await sendEmailNotificationToMyself(
      email,
      name,
      title,
      freebieSlug
    );
    if (!emailResult.accepted || emailResult.accepted.length === 0) {
      return { error: "Failed to send notification email" };
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

function sendEmailNotificationToMyself(
  email: string,
  name: string,
  freebieTitle: string,
  freebieSlug: string
) {
  // TODO this should be part of the Brevo's flow but it is not working, so for now we are using nodemailer to send it ourselves
  const transporter = nodemailer.createTransport(EMAIL_TRANSPORTER);
  const mailOOptions = {
    ...MAIL_OPTIONS,
    subject: `New person subscribed to the ${freebieSlug} freebie`,
    text: `
                  New person subscribed to the freebie: ${freebieTitle}
                  Freebie slug: ${freebieSlug}
        
                  Email:
                  ${email}

                  Name:
                  ${name}
              `,
  };
  return transporter.sendMail(mailOOptions);
}
