import { RequestHandler } from "express";
import { getEventsService } from "../services/eventService";

export const getEvents: RequestHandler = async (req, res) => {
  const events = await getEventsService();
  res.json(events);
};
