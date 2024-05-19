import { z } from "zod";
import { UserSpecificSchema } from "./userModels";

export const EventSchema = z.object({
  eventName: z.string(),
  eventDescription: z.string(),
  eventDate: z.coerce.date(),
  isRecurring: z.boolean(),
  personId: z.number().optional(),
});

export const UserSpecificEventSchema = EventSchema.merge(UserSpecificSchema);

export const EventSpecificSchema = z.object({
  eventId: z.coerce.number(),
});

export const EventDetailsSchema = EventSchema.merge(EventSpecificSchema);
