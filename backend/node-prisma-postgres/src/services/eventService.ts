import { z } from "zod";
import { prismaClient } from "../app";
import { GetEventsSchema } from "../models/eventModels";

export const getEventsService = async () => {
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
        FROM eventsschema.events JOIN eventsschema.people ON people.id = events."personId")
    WHERE "upcomingDate" >= now()
    ORDER BY "upcomingDate" ASC;;`;
  return events;
};
