import { z } from "zod";
import {
  PersonSchema,
  PersonIdentifierSchema,
  UserSpecificPersonSchema,
} from "../models/personModels";
import { prismaClient } from "../app";
import { UserSpecificSchema } from "../models/userModels";

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
  const eventsData = [];
  if (dob) {
    eventsData.push({
      eventDate: dob,
      eventDescription: "Big day!",
      eventName: "Birthday",
      isRecurring: true,
      userId,
    });
  }
  if (events) {
    eventsData.push(...events.map((event) => ({ userId: userId, ...event })));
  }
  const { id } = await prismaClient.person.create({
    data: {
      firstName,
      lastName,
      nickName,
      dob: !!dob ? dob : null,
      phone: phone ?? null,
      notes: notes ?? null,
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

export const getPeopleService = async ({
  userId,
}: z.infer<typeof UserSpecificSchema>) => {
  const people = await prismaClient.person.findMany({
    select: {
      id: true,
      firstName: true,
      lastName: true,
      nickName: true,
      email: true,
      phone: true,
      events: {
        select: {
          id: true,
          eventDate: true,
          eventName: true,
        },
      },
    },
    where: {
      userId,
    },
  });
  return people;
};

export const getPersonService = async ({
  personId,
}: z.infer<typeof PersonIdentifierSchema>) => {
  const person = await prismaClient.person.findFirst({
    where: {
      id: Number(personId),
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      nickName: true,
      email: true,
      phone: true,
      events: {
        select: {
          id: true,
          eventDate: true,
          eventName: true,
          isRecurring: true,
        },
      },
    },
  });
  return person;
};
