import dotenv from "dotenv";
dotenv.config();
import express from "express";

const serverPort = process.env.SERVER_PORT || 3020;

const app = express();

app.get("/", function (req, res) {
  res.send("home");
});

app.listen(serverPort, function () {
  console.log(`server running on port: ${serverPort}`);
});
