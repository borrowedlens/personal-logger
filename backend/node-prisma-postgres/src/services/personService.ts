import { z } from "zod";
import {
  PersonSchema,
  PersonIdentifierSchema,
  UserSpecificPersonSchema,
} from "../models/personModels";
import { prismaClient } from "../app";

export const createPersonService = async ({
  firstName,
  lastName,
  nickName,
  phone,
  dob,
  email,
  notes = "",
  userId,
  events = [],
}: z.infer<typeof UserSpecificPersonSchema>) => {
  const eventsData = [
    {
      eventDate: dob,
      eventDescription: "Big day!",
      eventName: "Birthday",
      isRecurring: true,
      userId,
    },
  ];
  if (events) {
    eventsData.push(...events.map((event) => ({ userId: userId, ...event })));
  }
  const { id } = await prismaClient.person.create({
    data: {
      firstName,
      lastName,
      nickName,
      dob,
      phone,
      notes,
      user: {
        connect: {
          id: userId,
        },
      },
      email,
      events: {
        create: eventsData,
      },
    },
  });
  return id;
};

export const getPeopleService = async () => {
  const people = await prismaClient.person.findMany({
    select: {
      id: true,
      firstName: true,
      lastName: true,
      nickName: true,
      dob: true,
      events: {
        select: {
          eventDate: true,
        },
      },
    },
  });
  return people;
};

export const getPersonDetailsService = async ({
  personId,
}: z.infer<typeof PersonIdentifierSchema>) => {
  const person = await prismaClient.person.findFirst({
    where: {
      id: Number(personId),
    },
    include: {
      events: true,
    },
  });
  return person;
};
