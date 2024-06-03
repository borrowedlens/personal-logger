import bcrypt from "bcrypt";
import { NextFunction, Request, RequestHandler, Response } from "express";
import { LoginSchema, SignupSchema } from "../models/userModels";
import { GlobalError } from "../middleware/errorMiddleware";
import { getUserCredsService, signupService } from "../services/authService";

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      phone,
      dob,
    } = SignupSchema.parse(req.body);
    bcrypt.hash(password, 8, async (error, hashedPassword) => {
      if (error) {
        throw new GlobalError("Something went wrong, please try again!", 409);
      }
      const userId = await signupService({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        phone,
        dob,
      });
      res.json({
        data: {
          id: userId,
        },
        errorCode: 0,
        errorMessage: "",
        success: true,
      });
    });
  } catch (error: unknown) {
    next(error);
  }
};

export const login: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = LoginSchema.parse(req.body);
    const user = await getUserCredsService({ email });
    if (!user) {
      throw new GlobalError("User not found", 404);
    }
    bcrypt.compare(password, user.password, (err) => {
      if (err) {
        throw new GlobalError("Incorrect password", 401);
      }
      req.session.regenerate((err) => {
        if (err) {
          throw new GlobalError("Incorrect login", 401);
        }
        req.session.user = user.id;
      });
      req.session.save((err) => {
        if (err) {
          throw new GlobalError("Incorrect login", 401);
        }
        res.status(200).json({
          data: { id: user.id },
          errorCode: 0,
          errorMessage: "",
          success: true,
        });
      });
    });
  } catch (error) {
    next(error);
  }
};

export const checkAuthentication: RequestHandler = (req, res, next) => {
  console.log("🚀 ~ req.session:", req.session);
  try {
    if (!req.session.user) {
      throw new GlobalError("Session expired/is invalid", 401);
    }
    res.status(200).json({
      success: true,
      errorCode: 0,
      errorMessage: "",
      data: req.session.user,
    });
  } catch (error) {
    next(error);
  }
};

export const logout: RequestHandler = (req, res) => {
  req.session.destroy(() => {
    console.log("after destroy", req.session, req.session?.user);
    res.clearCookie("connect.sid").status(200).json({
      success: true,
      errorCode: 0,
      errorMessage: "",
      data: null,
    });
  });
};
