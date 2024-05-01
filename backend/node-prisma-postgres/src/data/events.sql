SELECT *
FROM eventsschema.events;

INSERT INTO eventsschema.events ("eventName", "eventDescription", "eventDate", "isRecurring", "personId")
VALUES ('My Birthday', 'Another desc', '1989-10-14T00:00:00.000Z', TRUE, 1);

UPDATE eventsschema.events
SET "isRecurring" = True
WHERE events."eventName" = 'My Birthday';

SELECT *
FROM
    (SELECT "eventName",
            "eventDate",
            CASE
                WHEN to_char("eventDate", 'MM-DD') < to_char(now(), 'MM-DD')
                     AND "isRecurring" = True THEN "eventDate" + INTERVAL '1 year' * (date_part('year', now()) - date_part('year', "eventDate") + 1)
                ELSE "eventDate" + INTERVAL '1 year' * (date_part('year', now()) - date_part('year', "eventDate"))
            END as upcomingDate
     FROM eventsschema.events)
WHERE upcomingDate > now()
ORDER BY upcomingDate ASC;


DELETE
FROM eventsschema.events;


DROP TABLE eventsschema.users;