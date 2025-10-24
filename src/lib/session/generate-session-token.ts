import { randomBytes } from "crypto";

export function generateSessionToken(): string {
  // 32 bytes = 256 bits of entropy
  return randomBytes(32).toString("base64url");
}
