import { RequestHandler } from "express";
import {
  createPersonService,
  getPeopleService,
  getPersonDetailsService,
} from "../services/personService";
import {
  CreatePersonSchema,
  GetPersonDetailsSchema,
} from "../models/personModels";

export const createPerson: RequestHandler = async (req, res, next) => {
  try {
    const { name, nickName, dob, userId, email, phone, events, notes } =
      CreatePersonSchema.parse(req.body);
    const personId = await createPersonService({
      name,
      nickName,
      phone,
      dob,
      userId,
      email,
      events,
      notes,
    });
    res.json({ id: personId });
  } catch (error) {
    next(error);
  }
};

export const getPeople: RequestHandler = async (req, res) => {
  const people = await getPeopleService();
  res.json(people);
};

export const getPersonDetails: RequestHandler = async (req, res, next) => {
  try {
    const { personId } = GetPersonDetailsSchema.parse(req.params);
    const person = await getPersonDetailsService({ personId });
    res.json({ person });
  } catch (error) {
    next(error);
  }
};
