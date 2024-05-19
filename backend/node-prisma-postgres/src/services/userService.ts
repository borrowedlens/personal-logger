import { z } from "zod";
import { prismaClient } from "../app";
import { UserSpecificSchema } from "../models/userModels";

export const getUserService = async ({
  userId,
}: z.infer<typeof UserSpecificSchema>) => {
  const user = await prismaClient.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      events: true,
    },
  });
  return user;
};
