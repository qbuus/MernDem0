import app from "./app";
import env from "./util/validateEnv";
import mongoose from "mongoose";

const serverPort = env.SERVER_PORT || 3020;
const MONGODB_CONNECTION_STRING = env.MONGODB_CONNECTION_STRING;

mongoose
  .connect(MONGODB_CONNECTION_STRING)
  .then(() => {
    console.log("mongoose connected");
    app.listen(serverPort, function () {
      console.log(`server running on port: ${serverPort}`);
    });
  })
  .catch(console.error);
