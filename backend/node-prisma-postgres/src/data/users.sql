SELECT *
FROM eventsschema.users;

INSERT INTO eventsschema.users ("firstName", "lastName", "email", "phone", "dob", "createdAt", "updatedAt") VALUES ('Test', 'User','test@user.com', '9999999999', '1989-10-14T00:00:00Z', '2024-05-01T00:00:00Z', '2024-05-01T00:00:00Z');

DELETE
FROM eventsschema.users WHERE id = 9;


DROP TABLE eventsschema.events;