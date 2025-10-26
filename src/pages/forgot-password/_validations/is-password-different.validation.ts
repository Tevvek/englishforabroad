import { compare } from "bcryptjs";

/**
 * Check if the new password is different from the current password
 * @param newPassword - The new plain text password
 * @param currentPasswordHash - The current hashed password
 * @returns Promise<boolean> - true if passwords are different, false if same
 */
export async function isPasswordDifferent(
  newPassword: string, 
  currentPasswordHash: string
): Promise<boolean> {
  const isSame = await compare(newPassword, currentPasswordHash);
  return !isSame; // Return true if passwords are different
}