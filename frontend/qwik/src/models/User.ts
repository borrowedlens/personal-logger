import { z } from "@builder.io/qwik-city";
import { EventsSchema } from "./Event";

export const UserProfileSchema = z.object({
  id: z.number(),
  firstName: z.string(),
  lastName: z.string(),
  dob: z.coerce.date(),
  phone: z.string(),
  events: EventsSchema,
  email: z.string().email(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});
