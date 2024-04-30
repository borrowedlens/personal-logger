import { z } from "zod";
import { SignupUserSchema } from "../models/userModels";
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
