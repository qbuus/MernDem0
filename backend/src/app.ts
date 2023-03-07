import dotenv from "dotenv";
dotenv.config();
import express from "express";

const app = express();

app.get("/", function (req, res) {
  res.send("home");
});

export default app;
