import { RequestHandler } from "express";
import {
  addEventService,
  getEventDetailsService,
  getEventsService,
} from "../services/eventService";
import { EventSpecificSchema, EventSchema } from "../models/eventModels";
import { ErrorStatusCodes, GlobalError } from "../middleware/errorMiddleware";

export const getEvents: RequestHandler = async (req, res, next) => {
  try {
    if (!req.session.user) {
      throw new GlobalError("Session expired", ErrorStatusCodes.UNAUTHORIZED);
    }
    const userId = req.session.user;
    const events = await getEventsService({ userId });
    res.status(200).json({
      errorCode: 0,
      errorMessage: "",
      success: true,
      data: {
        events,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getEventDetails: RequestHandler = async (req, res, next) => {
  try {
    if (!req.session.user) {
      throw new GlobalError("Session expired", ErrorStatusCodes.UNAUTHORIZED);
    }
    const userId = req.session.user;
    const { eventId } = EventSpecificSchema.parse(req.params);
    const event = await getEventDetailsService({ eventId, userId });
    if (!event) {
      throw new GlobalError("Event not found", ErrorStatusCodes.NOT_FOUND);
    }
    res.status(200).json({
      success: true,
      data: { event },
      errorCode: 0,
      errorMessage: "",
    });
  } catch (error) {
    next(error);
  }
};

export const addEvent: RequestHandler = async (req, res, next) => {
  try {
    if (!req.session.user) {
      throw new GlobalError("Session expired", ErrorStatusCodes.UNAUTHORIZED);
    }
    const userId = req.session.user;
    const { eventName, eventDate, eventDescription, isRecurring, personId } =
      EventSchema.parse(req.body);
    const eventId = await addEventService({
      userId,
      eventName,
      eventDate,
      eventDescription,
      isRecurring,
      personId,
    });
    res.status(200).json({
      success: true,
      data: {
        eventId,
      },
      errorCode: 0,
      errorMessage: "",
    });
  } catch (error) {
    next(error);
  }
};
