import express from "express";
import session from "express-session";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import cors from "cors";

import routes from "./routes";
import { PrismaClient } from "@prisma/client";
import { errorHandler } from "./middleware/errorMiddleware";

export const prismaClient = new PrismaClient();

const app = express();

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
    methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
      sameSite: true,
      secure: process.env.NODE_ENV === "production",
    },
    secret: process.env.SESSION_SECRET!,
    saveUninitialized: false,
    resave: false,
    store: new PrismaSessionStore(prismaClient, {
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  })
);

app.use(routes);

app.use(errorHandler);

const port = 3000;
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
