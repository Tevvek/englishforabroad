import { db, EmailConfirmation } from "astro:db";
import crypto from "crypto";

export interface CreateEmailConfirmationData {
  userId: number;
}

export async function createEmailConfirmation({ userId }: CreateEmailConfirmationData) {
  // Generate a secure random token
  const token = crypto.randomBytes(32).toString('hex');
  
  // Set expiration to 24 hours from now
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 24);
  
  // Insert the confirmation record
  const [confirmation] = await db.insert(EmailConfirmation).values({
    userId,
    token,
    expiresAt,
    confirmed: false,
  }).returning();

  return confirmation;
}