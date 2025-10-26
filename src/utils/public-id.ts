import { nanoid } from "nanoid";

/**
 * Generate a public ID using NanoID
 * @returns string - The public ID
 */
export function generatePublicId(): string {
  return nanoid();
}
