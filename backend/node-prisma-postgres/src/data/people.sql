SELECT *
FROM eventsschema.people;

DELETE FROM eventsschema.people;

INSERT INTO eventsschema.people ("firstName", "lastName", "userId", "email", "dob", "phone", "notes") VALUES ('Vivek', 'Prasad', 3, 'test1@test.com', '1989-10-14T00:00:00Z','9999999999', 'Another friend');

DROP TABLE eventsschema.people;
