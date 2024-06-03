import { z } from "zod";
import { LoginSchema, SignupSchema } from "../models/userModels";
import { prismaClient } from "../app";
import { GetUserIdSchema } from "../models/authModel";

export const signupService = async ({
  firstName,
  lastName,
  email,
  password,
  phone,
  dob,
}: Omit<z.infer<typeof SignupSchema>, "confirmPassword">) => {
  const { id } = await prismaClient.user.create({
    data: {
      firstName,
      lastName,
      email,
      password: password,
      phone: phone || "",
      dob,
      events: {
        create: [
          {
            eventDate: dob,
            eventDescription: "",
            eventName: "Birthday",
            isRecurring: true,
          },
        ],
      },
    },
  });
  return id;
};

export const getUserCredsService = async ({
  email,
}: z.infer<typeof GetUserIdSchema>) => {
  const user = await prismaClient.user.findFirst({
    where: {
      email,
    },
    select: {
      id: true,
      password: true,
    },
  });
  return user;
};
