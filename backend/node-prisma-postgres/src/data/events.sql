SELECT *
FROM eventsschema.events;

INSERT INTO eventsschema.events ("eventName", "eventDescription", "eventDate", "isRecurring", "personId", "userId")
VALUES ('My Birthday', 'Another desc', '1989-10-14T00:00:00.000Z', TRUE, 7, 11);

UPDATE eventsschema.events
SET "isRecurring" = True
WHERE events."eventName" = 'My Birthday';

SELECT *
FROM
    (SELECT *,
            CASE
                WHEN to_char("eventDate", 'MM-DD') < to_char(now(), 'MM-DD')
                     AND "isRecurring" = True THEN "eventDate" + INTERVAL '1 year' * (date_part('year', now()) - date_part('year', "eventDate") + 1)
                ELSE "eventDate" + INTERVAL '1 year' * (date_part('year', now()) - date_part('year', "eventDate"))
            END as upcomingDate
     FROM eventsschema.events)
WHERE upcomingDate > now()
ORDER BY upcomingDate ASC;

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
WHERE "upcomingDate" >= now() AND "userId" = 11
ORDER BY "upcomingDate" ASC;

DELETE
FROM eventsschema.events
WHERE date_part('day', "createdAt") = date_part('day', now());

DROP TABLE eventsschema.users;

UPDATE eventsschema.events
SET "userId" = 11
WHERE id = 10 OR id = 8 OR id = 9 OR id = 11;