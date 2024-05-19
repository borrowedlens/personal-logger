import { RequestHandler } from "express";
import { getUserService } from "../services/userService";
import { ErrorStatusCodes, GlobalError } from "../middleware/errorMiddleware";

export const getUser: RequestHandler = async (req, res, next) => {
  try {
    if (!req.session.user) {
      throw new GlobalError("Session expired", ErrorStatusCodes.UNAUTHORIZED);
    }
    const userId = req.session.user;
    const user = await getUserService({ userId });
    return res
      .status(200)
      .json({ errorCode: 0, errorMessage: "", success: true, data: { user } });
  } catch (error) {
    next(error);
  }
};
