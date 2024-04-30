import { NextFunction, Request, Response } from "express";
import { prismaClient } from "../app";
import { SignupUserSchema } from "../models/userModels";
import { signupUserService } from "../services/userService";

export const getUsers = async (req: Request, res: Response) => {
  const users = await prismaClient.user.findMany();
  return res.json(users);
};

export const signupUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { firstName, lastName, email, phone } = SignupUserSchema.parse(
      req.body
    );
    const userId = await signupUserService({
      firstName,
      lastName,
      email,
      phone,
    });
    return res.json({ id: userId });
  } catch (error: unknown) {
    next(error);
  }
};
