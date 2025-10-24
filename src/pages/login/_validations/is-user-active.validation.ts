import type { User } from "@db/types";

/**
 * User account status validation
 */

export function isUserActive(user: User | null): boolean {
  // Check if user exists
  if (!user) {
    return false;
  }

  // Check if user account is not blocked
  if (user.blocked === true) {
    return false;
  }

  // Check if user account is confirmed (email verified)
  if (user.confirmed === false) {
    return false;
  }

  // All checks passed - user is active
  return true;
}
