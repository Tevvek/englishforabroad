import { db, User } from "astro:db";
import { generatePublicId } from "@/utils/public-id";
import { hashPassword } from "@/pages/register/_utils/hash-password.util";

export default async function seed() {
  // Insert sample users
  await db.insert(User).values([
    {
      id: 1,
      publicId: generatePublicId(),
      username: "admin",
      email: "admin@englishforabroad.com",
      password: await hashPassword("admin123"),
      role: "admin",
      confirmed: true,
      blocked: false,
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
      lastLoginAt: new Date("2024-01-01"),
    },
    {
      id: 2,
      publicId: generatePublicId(),
      username: "student",
      email: "student@example.com",
      password: await hashPassword("student123"),
      role: "user",
      confirmed: true,
      blocked: false,
      createdAt: new Date("2024-01-02"),
      updatedAt: new Date("2024-01-02"),
      lastLoginAt: new Date("2024-01-02"),
    },
  ]);
}
