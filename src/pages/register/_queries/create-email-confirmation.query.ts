import { db, EmailConfirmation } from "astro:db";
import { generateConfirmationToken } from "../_utils/generate-confirmation-token.util";

export interface CreateEmailConfirmationData {
  userId: number;
}

export async function createEmailConfirmation({
  userId,
}: CreateEmailConfirmationData) {
  // Generate a secure random token using NanoID
  const token = generateConfirmationToken();

  // Set expiration to 24 hours from now
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 24);

  // Insert the confirmation record
  const confirmation = await db
    .insert(EmailConfirmation)
    .values({
      userId,
      token,
      expiresAt,
      confirmed: false,
    })
    .returning()
    .get();

  return confirmation;
}
