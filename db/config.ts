import { defineDb, column } from "astro:db";
import { defineTableWithTimestamps } from "./utils";

export const User = defineTableWithTimestamps({
  columns: {
    id: column.number({ primaryKey: true }),
    publicId: column.text({ unique: true }),
    username: column.text({ unique: true }),
    email: column.text({ unique: true }),
    password: column.text(),
    role: column.text({ default: "user", enum: ["user", "admin"] }),
    confirmed: column.boolean({ default: false }),
    blocked: column.boolean({ default: false }),
    lastLoginAt: column.date(),
  },
});

export const Session = defineTableWithTimestamps({
  columns: {
    id: column.number({ primaryKey: true }),
    userId: column.number({ references: () => User.columns.id }),
    token: column.text({ unique: true }),
    expiresAt: column.date(),
    ipAddress: column.text(),
    userAgent: column.text(),
  },
});

// https://astro.build/db/config
export default defineDb({
  tables: {
    User,
    Session,
  },
});
