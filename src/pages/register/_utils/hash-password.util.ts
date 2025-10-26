import bcrypt from "bcryptjs";
import { BCRYPT_SALT_ROUNDS } from "astro:env/server";

/**
 * Hash a password using bcrypt with salt rounds from environment variables, defaults to 12
 * @param password - The plain text password to hash
 * @returns Promise<string> - The hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
}
