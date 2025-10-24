import { User, Session } from "astro:db";

export type UserRecord = typeof User.$inferSelect;
export type SessionRecord = typeof Session.$inferSelect;
