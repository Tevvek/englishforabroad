import { nanoid } from "nanoid";

/**
 * Generate a secure confirmation token using NanoID
 * @returns string - A cryptographically secure token for email confirmation
 */
export function generateConfirmationToken(): string {
  return nanoid();
}
