import { z } from "zod";

export interface BaseResponseModel<T> {
  success: boolean;
  errorCode: number;
  errorMessage: string;
  data: T | null;
}

// "id": 3,
//     "createdAt": "2024-04-30T04:02:18.927Z",
//     "updatedAt": "2024-04-30T04:02:18.927Z",
//     "email": "test@test.com",
//     "phone": "0000000000",
//     "dob": "1989-10-14T10:00:00.000Z",
//     "firstName": "Test",
//     "lastName": "User"

export const EventModel = z.object({
  id: z.number(),
  eventName: z.string(),
  eventDescription: z.string(),
  eventDate: z.coerce.date(),
  isRecurring: z.boolean(),
  personId: z.number().nullable(),
  userId: z.number().nullable(),
  upcomingDate: z.coerce.date(),
  nickName: z.string(),
  firstName: z.string(),
  lastName: z.string(),
});

export const EventsModel = z.array(EventModel);

export const EventsForProfile = z.array(
  EventModel.omit({
    nickName: true,
    firstName: true,
    lastName: true,
    upcomingDate: true,
  }),
);

export const UserProfileModel = z.object({
  id: z.number(),
  firstName: z.string(),
  lastName: z.string(),
  dob: z.coerce.date(),
  phone: z.string(),
  events: EventsForProfile,
  email: z.string().email(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const PersonProfileModel = z.object({
  id: z.number(),
  firstName: z.string(),
  lastName: z.string(),
  nickName: z.string(),
  dob: z.coerce.date(),
  phone: z.string(),
  email: z.string().email(),
  events: EventsForProfile,
});

const PersonModelBase = PersonProfileModel.omit({
  email: true,
  phone: true,
  events: true,
});

export const PersonModel = PersonModelBase.merge(
  z.object({
    events: z.array(EventModel.partial().required({ eventDate: true })),
  }),
);

export const PeopleModel = z.array(PersonModel);
