import { NextFunction, Request, RequestHandler, Response } from "express";
import { GetUserSchema, SignupUserSchema } from "../models/userModels";
import { getUserService, signupUserService } from "../services/userService";

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

export const getUser: RequestHandler = async (req, res, next) => {
  try {
    const { email } = GetUserSchema.parse(req.query);
    const user = await getUserService({ email });
    return res.json(user);
  } catch (error) {
    next(error);
  }
};
