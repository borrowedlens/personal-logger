import { z } from "@builder.io/qwik-city";
import { AddEventSchema } from "./Event";

export const PersonProfileSchema = z.object({
  id: z.number().optional(),
  firstName: z.string(),
  lastName: z.string(),
  nickName: z.string().optional(),
  dob: z.string(),
  phone: z.string().optional().nullable(),
  email: z.string().email(),
  events: z.array(AddEventSchema).optional(),
});
