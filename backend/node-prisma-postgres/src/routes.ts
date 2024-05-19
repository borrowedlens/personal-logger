import express from "express";
import { getUser } from "./controllers/userController";
import {
  createPerson,
  getPeople,
  getPersonDetails,
} from "./controllers/personController";
import {
  addEvent,
  getEventDetails,
  getEvents,
} from "./controllers/eventController";
import {
  checkAuthentication,
  login,
  signup,
} from "./controllers/authController";

const routes = express.Router();

//auth routes
routes.post("/signup", signup);
routes.post("/login", login);
routes.get("/auth", checkAuthentication);

//User routes
routes.get("/user", getUser);

//Person routes
routes.post("/person", createPerson);
routes.get("/people", getPeople);
routes.get("/person/:personId", getPersonDetails);

//Event routes
routes.get("/events", getEvents);
routes.get("/event/:eventId", getEventDetails);
routes.post("/event", addEvent);

export default routes;
