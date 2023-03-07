import dotenv from "dotenv";
dotenv.config();
import express, {
  NextFunction,
  Request,
  Response,
} from "express";
import noteRoutes from "./routes/notes";
import morgan from "morgan";

const app = express();

app.use(morgan("dev"));

app.use(express.json());

app.use("/api/notes", noteRoutes);

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
