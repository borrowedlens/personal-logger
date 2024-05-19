import { z } from "@builder.io/qwik-city";

export interface BaseResponseSchema<T> {
  success: boolean;
  errorCode: number;
  errorMessage: string;
  data: T | null;
}

export const UpcomingEventSchema = z.object({
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

export const UpcomingEventsSchema = z.array(UpcomingEventSchema);

export const EventSchema = UpcomingEventSchema.omit({
  nickName: true,
  firstName: true,
  lastName: true,
  upcomingDate: true,
}).partial({ isRecurring: true, userId: true, id: true });

export const EventsSchema = z.array(EventSchema);

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
  events: EventsSchema.optional(),
});

const PersonSchemaBase = PersonProfileSchema.omit({
  email: true,
  phone: true,
  events: true,
});

export const PersonSchema = PersonSchemaBase.merge(
  z.object({
    events: z.array(
      UpcomingEventSchema.partial().required({ eventDate: true })
    ),
  })
);

export const PeopleSchema = z.array(PersonSchema);

export const SignupSchema = z
  .object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    phone: z.union([z.string().optional(), z.string().length(10)]),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
    dob: z.coerce.date(),
  })
  .refine(
    (values) => {
      return values.password === values.confirmPassword;
    },
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }
  );

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
