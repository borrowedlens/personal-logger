import express from "express";
import { getUsers, signupUser } from "./controllers/userController";
import {
  createPerson,
  getPeople,
  getPersonDetails,
} from "./controllers/personController";
import { getEvents } from "./controllers/eventController";

const routes = express.Router();

//User routes
routes.get("/users", getUsers);
routes.post("/user", signupUser);

//Person routes
routes.post("/person", createPerson);
routes.get("/people", getPeople);
routes.get("/person/:id", getPersonDetails);

//Event routes
routes.get("/events", getEvents);

routes.post("/");

export default routes;
