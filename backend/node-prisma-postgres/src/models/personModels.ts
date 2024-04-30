import { z } from "zod";
import { CreateEventSchema } from "./eventModels";

export const CreatePersonSchema = z.object({
  name: z.string(),
  nickName: z.string(),
  email: z.string().email(),
  phone: z.string(),
  dob: z.coerce.date(),
  notes: z.string(),
  userId: z.number(),
  events: z.array(CreateEventSchema),
});

export const GetPersonDetailsSchema = z.object({
  personId: z.coerce.number(),
});
