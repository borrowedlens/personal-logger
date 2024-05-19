import { z } from "zod";
import { prismaClient } from "../app";
import {
  EventDetailsSchema,
  EventSpecificSchema,
  UserSpecificEventSchema,
} from "../models/eventModels";
import { UserSpecificSchema } from "../models/userModels";

export const getEventsService = async ({
  userId,
}: z.infer<typeof UserSpecificSchema>) => {
  const events = await prismaClient.$queryRaw`
    SELECT *
    FROM
        (SELECT events.*,
                people."firstName",
                people."lastName",
                people."nickName",
                CASE
                    WHEN date_part('year', "eventDate") < date_part('year', now())
                        AND "isRecurring" = True THEN 
                          CASE
                              WHEN to_char("eventDate", 'MM-DD') < to_char(now(), 'MM-DD') THEN "eventDate" + INTERVAL '1 year' * (date_part('year', now()) - date_part('year', "eventDate") + 1)
                              ELSE "eventDate" + INTERVAL '1 year' * (date_part('year', now()) - date_part('year', "eventDate"))
                          END
                    ELSE "eventDate"
                END as "upcomingDate"
        FROM eventsschema.events LEFT JOIN eventsschema.people ON people.id = events."personId")
    WHERE "upcomingDate" >= now() AND "userId" = ${userId}
    ORDER BY "upcomingDate" ASC;`;
  return events;
};

export const getEventDetailsService = async ({
  eventId,
  userId,
}: z.infer<typeof UserSpecificSchema> &
  z.infer<typeof EventSpecificSchema>) => {
  const event = await prismaClient.event.findFirst({
    where: {
      id: eventId,
      AND: {
        userId: userId,
      },
    },
  });
  return event;
};

export const updateEventService = async ({
  eventId,
  ...event
}: z.infer<typeof EventDetailsSchema>) => {
  const updateResults = await prismaClient.event.update({
    where: {
      id: eventId,
    },
    data: {
      ...event,
    },
  });
  return updateResults;
};

export const addEventService = async ({
  eventDate,
  eventDescription,
  eventName,
  isRecurring,
  personId,
  userId,
}: z.infer<typeof UserSpecificEventSchema>) => {
  const eventData: any = {
    eventDate,
    eventDescription,
    eventName,
    isRecurring,
    user: {
      connect: {
        id: userId,
      },
    },
  };
  if (personId) {
    eventData.person = {
      connect: {
        id: personId,
      },
    };
  }
  const { id } = await prismaClient.event.create({
    data: eventData,
  });
  return id;
};
