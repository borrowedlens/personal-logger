import { z } from "zod";
import {
  CreatePersonSchema,
  GetPersonDetailsSchema,
} from "../models/personModels";
import { prismaClient } from "../app";

export const createPersonService = async ({
  firstName,
  lastName,
  nickName,
  phone,
  dob,
  email,
  notes,
  userId,
  events,
}: z.infer<typeof CreatePersonSchema>) => {
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
        create: [
          {
            eventDate: dob,
            eventDescription: "Go out for dinner",
            eventName: "Birthday",
            isRecurring: true,
          },
          ...events,
        ],
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
}: z.infer<typeof GetPersonDetailsSchema>) => {
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
