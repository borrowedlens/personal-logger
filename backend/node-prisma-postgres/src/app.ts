import express, { Request, Response } from "express";
import { addYears } from "date-fns";

import routes from "./routes";
import { PrismaClient } from "@prisma/client";
import { errorHandler } from "./middleware/errorMiddleware";

export const prismaClient = new PrismaClient();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(routes);

app.use(errorHandler);

const port = 3000;
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
