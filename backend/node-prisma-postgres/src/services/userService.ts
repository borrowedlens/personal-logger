import { z } from "zod";
import { GetUserSchema, SignupUserSchema } from "../models/userModels";
import { prismaClient } from "../app";

export const signupUserService = async ({
  firstName,
  lastName,
  email,
  phone,
}: z.infer<typeof SignupUserSchema>) => {
  const { id } = await prismaClient.user.create({
    data: {
      firstName,
      lastName,
      email,
      phone,
    },
  });
  return id;
};

export const getUserService = async ({
  email,
}: z.infer<typeof GetUserSchema>) => {
  const user = await prismaClient.user.findUnique({
    where: {
      email: email,
    },
    include: {
      events: true,
    },
  });
  return user;
};
