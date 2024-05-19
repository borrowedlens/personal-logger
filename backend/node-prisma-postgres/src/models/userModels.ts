import { z } from "zod";

export const SignupSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  phone: z.string().length(10).optional(),
  password: z.string().min(8),
  dob: z.coerce.date(),
});

export const LoginSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export const UserSpecificSchema = z.object({
  userId: z.coerce.number(),
});
