import { z } from "zod";

export interface BaseResponseModel<T> {
  success: boolean;
  errorCode: number;
  errorMessage: string;
  data: T;
}

export const PersonModel = z.object({
  id: z.number(),
  name: z.string(),
  nickName: z.string(),
  dob: z.coerce.date(),
  events: z.array(
    z.object({
      eventDate: z.coerce.date(),
    }),
  ),
});

export const PeopleModel = z.array(PersonModel);

export const EventModel = z.object({
  eventName: z.string(),
  eventDescription: z.string(),
  eventDate: z.coerce.date(),
  isRecurring: z.boolean(),
  personId: z.number().optional(),
  userId: z.number().optional(),
});

export const EventsModel = z.array(EventModel);
