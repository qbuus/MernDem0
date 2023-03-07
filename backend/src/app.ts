import dotenv from "dotenv";
dotenv.config();
import express, {
  NextFunction,
  Request,
  Response,
} from "express";

import NoteModel from "./models/note";

const app = express();

app.get("/", async function (req, res, next) {
  try {
    const notes = await NoteModel.find().exec();
    res.status(200).json(notes);
  } catch (error) {
    next(error);
  }
});

app.use(function (req, res, next) {
  next(Error("Endpoint not found"));
});

app.use(function (
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log(error);
  let errorMsg = "An error occured";
  if (error instanceof Error) errorMsg = error.message;
  res.status(500).json({ error: errorMsg });
});

export default app;
