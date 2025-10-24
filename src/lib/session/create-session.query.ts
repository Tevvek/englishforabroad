import { db, Session } from "astro:db";
import { generateSessionToken } from "./generate-session-token";
import type { SessionRecord } from "@db/types";

export async function createSession({
  userId,
  ipAddress,
  userAgent,
  expiresInDays = 30,
}: {
  userId: number;
  ipAddress: string;
  userAgent: string;
  expiresInDays?: number;
}): Promise<SessionRecord> {
  // Generate a secure session token
  const token = generateSessionToken();

  // Calculate expiration date
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + expiresInDays);

  // Create session in database
  const [session] = await db
    .insert(Session)
    .values({
      userId,
      token,
      expiresAt,
      ipAddress,
      userAgent,
    })
    .returning();

  return session;
}
