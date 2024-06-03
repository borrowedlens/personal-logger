import { RequestHandler } from "express";
import {
  addEventService,
  getAllEventsService,
  getEventDetailsService,
  getUpcomingEventsService,
  updateEventService,
} from "../services/eventService";
import {
  EventSpecificSchema,
  EventSchema,
  UpdateEventSchema,
} from "../models/eventModels";
import { ErrorStatusCodes, GlobalError } from "../middleware/errorMiddleware";

export const getUpcomingEvents: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.session.user!;
    const events = await getUpcomingEventsService({ userId });
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
    const userId = req.session.user!;
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

export const createEvent: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.session.user!;
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

export const updateEvent: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.session.user!;
    const eventId = req.params.eventId;
    const eventDetails = UpdateEventSchema.parse(req.body);
    const updatedEventId = await updateEventService({
      userId,
      eventId,
      ...eventDetails,
    });
    res.status(200).json({
      success: true,
      data: {
        eventId: updatedEventId,
      },
      errorCode: 0,
      errorMessage: "",
    });
  } catch (error) {
    next(error);
  }
};

export const getAllEvents: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.session.user!;
    const events = await getAllEventsService({ userId });
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
