import { nanoid } from "nanoid";

/**
 * Generate a secure session token using NanoID
 * @returns string - A cryptographically secure token for user sessions
 */
export function generateSessionToken(): string {
  return nanoid();
}
