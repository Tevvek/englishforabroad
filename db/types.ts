import { 
  User, 
  Session, 
  EmailConfirmation, 
  PasswordReset, 
  ClassBooking, 
  TeacherAvailability, 
  Holiday, 
  TeacherUnavailability, 
  ClassSettings 
} from "astro:db";

export { User, Session, EmailConfirmation, PasswordReset, ClassBooking, TeacherAvailability, Holiday, TeacherUnavailability, ClassSettings };

export type UserRecord = typeof User.$inferSelect;
export type SessionRecord = typeof Session.$inferSelect;
export type EmailConfirmationRecord = typeof EmailConfirmation.$inferSelect;
export type PasswordResetRecord = typeof PasswordReset.$inferSelect;
export type ClassBookingRecord = typeof ClassBooking.$inferSelect;
export type TeacherAvailabilityRecord = typeof TeacherAvailability.$inferSelect;
export type HolidayRecord = typeof Holiday.$inferSelect;
export type TeacherUnavailabilityRecord = typeof TeacherUnavailability.$inferSelect;
export type ClassSettingsRecord = typeof ClassSettings.$inferSelect;
