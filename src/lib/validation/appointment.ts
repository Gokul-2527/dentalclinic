import { z } from "zod";
export const appointmentSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name").max(80),
  email: z.string().trim().email("Enter a valid email address"),
  phone: z.string().trim().regex(/^[+\d\s()-]{7,20}$/, "Enter a valid phone number"),
  treatment: z.string().min(1, "Choose a treatment"),
  date: z.string().min(1, "Choose a preferred date"),
  message: z.string().max(1000).optional(),
});
export type AppointmentInput = z.infer<typeof appointmentSchema>;
