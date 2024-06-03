import { z } from "zod";
import { EventSchema } from "./eventModels";
import { UserSpecificSchema } from "./userModels";

export const PersonSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  nickName: z.string().optional(),
  email: z.string().email(),
  phone: z.string().optional(),
  dob: z.string(),
  notes: z.string().optional(),
  events: z.array(EventSchema).optional(),
});

export const UserSpecificPersonSchema = PersonSchema.merge(UserSpecificSchema);

export const PersonIdentifierSchema = z.object({
  personId: z.coerce.number(),
});
