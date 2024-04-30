import { z } from "zod";

export const CreateEventSchema = z.object({
  eventName: z.string(),
  eventDescription: z.string(),
  eventDate: z.coerce.date(),
  isRecurring: z.boolean(),
  personId: z.number().optional(),
  userId: z.number().optional(),
});

export const GetEventsSchema = z.object({
    userId: z.coerce.number()
})
