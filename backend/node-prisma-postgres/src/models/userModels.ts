import { z } from "zod";

export const SignupUserSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  phone: z.string().length(10),
});
