import { z } from "zod";

export const bookClassSchema = z.object({
  date: z.date({
    required_error: "Please select a date for your class",
  }),
  time: z.string().min(1, "Please select a time for your class"),
  notes: z.string().optional(),
});

export type BookClassFormData = z.infer<typeof bookClassSchema>;