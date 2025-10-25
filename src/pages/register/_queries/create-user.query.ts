import { db, User } from "astro:db";
import bcrypt from "bcryptjs";

export interface CreateUserData {
  email: string;
  password: string;
}

export async function createUser({ email, password }: CreateUserData) {
  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 12);
  
  // Generate a public ID (simple approach - you might want to use a UUID library)
  const publicId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  
  // Generate username from email (before @ symbol)
  const username = email.split('@')[0];
  
  // Insert the user into the database
  const [newUser] = await db.insert(User).values({
    publicId,
    username,
    email,
    password: hashedPassword,
    role: "user",
    confirmed: false, // Will be confirmed via email
    blocked: false,
  }).returning();

  return newUser;
}