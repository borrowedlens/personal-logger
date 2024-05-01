import express from "express";
import { getUser, signupUser } from "./controllers/userController";
import {
  createPerson,
  getPeople,
  getPersonDetails,
} from "./controllers/personController";
import { getEvents } from "./controllers/eventController";

const routes = express.Router();

//User routes
routes.post("/user", signupUser);
routes.get("/user", getUser);

//Person routes
routes.post("/person", createPerson);
routes.get("/people", getPeople);
routes.get("/person/:personId", getPersonDetails);

//Event routes
routes.get("/events", getEvents);

routes.post("/");

export default routes;
