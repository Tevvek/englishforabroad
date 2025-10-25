import { db, User } from "astro:db";

// https://astro.build/db/seed
export default async function seed() {
  // Insert sample users
  await db.insert(User).values([
    {
      id: 1,
      publicId: "admin-001",
      username: "admin@englishforabroad.com",
      email: "admin@englishforabroad.com",
      password: "$2a$10$example.hash.for.admin.password", // This would be a real bcrypt hash in production
      role: "admin",
      confirmed: true,
      blocked: false,
      createdAt: new Date("2024-01-01"),
      updatedAt: new Date("2024-01-01"),
      lastLoginAt: new Date("2024-01-01"),
    },
    {
      id: 2,
      publicId: "user-001",
      username: "student@example.com",
      email: "user@example.com",
      password: "$2a$12$28RnteoDyf2ZDfliKvVHBe9B5Ho6JthkmEqxvYJugiHaZYGdBVwQ.", // This would be a real bcrypt hash in production
      role: "user",
      confirmed: true,
      blocked: false,
      createdAt: new Date("2024-01-02"),
      updatedAt: new Date("2024-01-02"),
      lastLoginAt: new Date("2024-01-02"),
    },
  ]);
}
