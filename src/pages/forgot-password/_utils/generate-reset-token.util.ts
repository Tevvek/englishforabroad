import { nanoid } from "nanoid";

/**
 * Generate a secure reset token using NanoID
 * @returns string - A cryptographically secure token for password reset
 */
export function generateResetToken(): string {
  return nanoid();
}