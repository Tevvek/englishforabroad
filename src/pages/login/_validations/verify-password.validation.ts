import bcrypt from "bcryptjs";
import { tryCatch } from "@/utils/tryCatch";

/**
 * Password verification validation using bcrypt
 * bcryptjs is a pure JavaScript implementation of bcrypt
 * providing maximum security for password verification
 */

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  const [isValid, error] = await tryCatch(
    bcrypt.compare(password, hashedPassword)
  );

  if (error) {
    // Log error for debugging but don't expose details to client
    console.error("Password verification error:", error);

    return false;
  }

  return isValid;
}
