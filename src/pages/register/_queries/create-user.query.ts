import { db, User } from "astro:db";
import { hashPassword } from "../_utils/hash-password.util";
import { generatePublicId } from "@/utils/public-id";

export interface CreateUserData {
  email: string;
  password: string;
}

export async function createUser({ email, password }: CreateUserData) {
  // Hash the password
  const hashedPassword = await hashPassword(password);

  // Generate a public ID using NanoID
  const publicId = generatePublicId();

  // Generate username from email (before @ symbol)
  const username = email.split("@")[0];

  // Insert the user into the database
  const newUser = await db
    .insert(User)
    .values({
      publicId,
      username,
      email,
      password: hashedPassword,
      role: "user",
      confirmed: false, // Will be confirmed via email
      blocked: false,
    })
    .returning()
    .get();

  return newUser;
}
