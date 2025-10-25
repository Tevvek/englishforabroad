import { checkUserExists } from "../_queries/check-user-exists.query";

export async function isEmailAvailable(email: string): Promise<boolean> {
  const userExists = await checkUserExists(email);
  return !userExists;
}