import { RequestHandler } from "express";
import { ErrorStatusCodes, GlobalError } from "./errorMiddleware";

export const isAuthenticated: RequestHandler = (req, _, next) => {
  try {
    if (!req.session.user) {
      throw new GlobalError("Session expired", ErrorStatusCodes.UNAUTHORIZED);
    }
    next();
  } catch (error) {
    next(error);
  }
};
