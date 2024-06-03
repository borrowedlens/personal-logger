SELECT * from eventsschema."Task";

SELECT date, COUNT(id) FROM eventsschema."Task" GROUP BY date;