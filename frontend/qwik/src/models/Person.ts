import { z } from "@builder.io/qwik-city";
import { AddEventSchema, EventsSchema, UpcomingEventResponseSchema } from "./Event";

export interface BaseResponseSchema<T> {
  success: boolean;
  errorCode: number;
  errorMessage: string;
  data: T | null;
}

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


export const PersonProfileSchema = z.object({
  id: z.number().optional(),
  firstName: z.string(),
  lastName: z.string(),
  nickName: z.string(),
  dob: z.coerce.date(),
  phone: z.string(),
  email: z.string().email(),
  events: z.array(AddEventSchema).optional(),
});

const PersonSchemaBase = PersonProfileSchema.omit({
  email: true,
  phone: true,
  events: true,
});

export const PersonSchema = PersonSchemaBase.merge(
  z.object({
    events: z.array(
      UpcomingEventResponseSchema.partial().required({ eventDate: true }),
    ),
  }),
);

export const PeopleSchema = z.array(PersonSchema);
