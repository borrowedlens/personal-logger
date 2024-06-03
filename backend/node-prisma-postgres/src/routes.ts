import express from "express";
import { getUser } from "./controllers/userController";
import {
  createPerson,
  getPeople,
  getPerson,
} from "./controllers/personController";
import {
  createEvent,
  getAllEvents,
  getEventDetails,
  getUpcomingEvents,
  updateEvent,
} from "./controllers/eventController";
import {
  checkAuthentication,
  login,
  logout,
  signup,
} from "./controllers/authController";
import { isAuthenticated } from "./middleware/authMiddleware";
import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
} from "./controllers/taskController";

const routes = express.Router();

//auth routes
routes.post("/signup", signup);
routes.post("/login", login);
routes.post("/logout", logout);
routes.get("/auth", checkAuthentication);

//User routes
routes.get("/user", getUser);

//Person routes
routes.post("/person", isAuthenticated, createPerson);
routes.get("/people", isAuthenticated, getPeople);
routes.get("/person/:personId", isAuthenticated, getPerson);

//Event routes
routes.get("/events/upcoming", isAuthenticated, getUpcomingEvents);
routes.get("/events/all", isAuthenticated, getAllEvents);
routes.get("/event/:eventId", isAuthenticated, getEventDetails);
routes.post("/event", isAuthenticated, createEvent);
routes.patch("/event/:eventId", isAuthenticated, updateEvent);

//Task routes

routes.get("/tasks", isAuthenticated, getTasks);
routes.post("/task", isAuthenticated, createTask);
routes.patch("/task", isAuthenticated, updateTask);
routes.delete("/task/:id", isAuthenticated, deleteTask);

export default routes;
