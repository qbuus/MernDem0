import dotenv from "dotenv";
dotenv.config();
import express, { NextFunction, Request, Response } from "express";
import noteRoutes from "./routes/notes";
import userRoutes from "./routes/users";
import morgan from "morgan";
import createHttpError, { isHttpError } from "http-errors";
import session from "express-session";
import env from "./util/validateEnv";
const app = express();
import MongoStore from "connect-mongo";

app.use(morgan("dev"));

app.use(express.json());
app.use(
  session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60 * 60 * 1000,
    },
    rolling: true,
    store: MongoStore.create({
      mongoUrl: env.MONGODB_CONNECTION_STRING,
    }),
  })
);
app.use("/api/notes", noteRoutes);
app.use("/api/users", userRoutes);

app.use(function (req, res, next) {
  next(createHttpError(404, "Endpoint not found"));
});

app.use(function (
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log(error);
  let errorMsg = "An error occured";
  let statusCode = 500;
  if (isHttpError(error)) {
    statusCode = error.status;
    errorMsg = error.message;
  }
  res.status(statusCode).json({ error: errorMsg });
});

export default app;
