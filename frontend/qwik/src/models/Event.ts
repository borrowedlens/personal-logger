import { z } from "@builder.io/qwik-city";

export const UpcomingEventResponseSchema = z.object({
  id: z.number(),
  eventName: z.string().min(1),
  eventDescription: z.string().min(1),
  eventDate: z.coerce.date(),
  isRecurring: z.coerce.boolean(),
  personId: z.coerce.number({ message: "Please select a friend" }),
  userId: z.number().nullable(),
  upcomingDate: z.coerce.date(),
  nickName: z.string().nullable(), // would be null in case the event belongs to the logged in user
  firstName: z.string().nullable(), // would be null in case the event belongs to the logged in user
  lastName: z.string().nullable(), // would be null in case the event belongs to the logged in user
});

export const UpcomingEventsSchema = z.array(UpcomingEventResponseSchema);

export const EventDetailSchema = z.object({
  id: z.number(),
  eventName: z.string().min(1),
  eventDescription: z.string().min(1),
  eventDate: z.coerce.date(),
  isRecurring: z.coerce.boolean(),
  personId: z.coerce.number({ message: "Please select a friend" }),
  person: z.object({
    firstName: z.string(),
    lastName: z.string(),
    nickName: z.string(),
  }),
});

export const AddEventSchema = EventDetailSchema.omit({
  id: true,
  person: true,
}).partial({
  isRecurring: true,
});

export const UpdateEventSchema = AddEventSchema.omit({
  personId: true,
});

export const EventsSchema = z.array(AddEventSchema);
