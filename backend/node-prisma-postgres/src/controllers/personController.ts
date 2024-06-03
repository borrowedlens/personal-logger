import { RequestHandler } from "express";
import {
  createPersonService,
  getPeopleService,
  getPersonService,
} from "../services/personService";
import { PersonSchema, PersonIdentifierSchema } from "../models/personModels";
import { ErrorStatusCodes, GlobalError } from "../middleware/errorMiddleware";

export const createPerson: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.session.user!;
    const { firstName, lastName, nickName, dob, email, phone, events } =
      PersonSchema.parse(req.body);
    const personId = await createPersonService({
      firstName,
      lastName,
      nickName,
      phone,
      dob,
      userId,
      email,
      events,
    });
    res.status(200).json({
      errorCode: 0,
      errorMessage: "",
      success: true,
      data: { personId },
    });
  } catch (error) {
    next(error);
  }
};

export const getPeople: RequestHandler = async (req, res, next) => {
  try {
    const people = await getPeopleService();
    res.status(200).json({
      errorCode: 0,
      errorMessage: "",
      success: true,
      data: { people },
    });
  } catch (error) {
    next(error);
  }
};

export const getPerson: RequestHandler = async (req, res, next) => {
  try {
    const { personId } = PersonIdentifierSchema.parse(req.params);
    const person = await getPersonService({ personId });
    if (!person) {
      throw new GlobalError(
        "No people added with that person id",
        ErrorStatusCodes.NOT_FOUND
      );
    }
    res.status(200).json({
      errorCode: 0,
      errorMessage: "",
      success: true,
      data: {
        person,
      },
    });
  } catch (error) {
    next(error);
  }
};
