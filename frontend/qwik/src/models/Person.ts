import { z } from "@builder.io/qwik-city";
import { AddEventSchema, UpcomingEventResponseSchema } from "./Event";

export interface BaseResponseSchema<T> {
  success: boolean;
  errorCode: number;
  errorMessage: string;
  data: T | null;
}

export const PersonProfileSchema = z.object({
  id: z.number().optional(),
  firstName: z.string(),
  lastName: z.string(),
  nickName: z.string().optional(),
  dob: z.string(),
  phone: z.string().optional(),
  notes: z.string().optional(),
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
