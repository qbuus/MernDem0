import { cleanEnv } from "envalid";
import { port, str } from "envalid/dist/validators";

export default cleanEnv(process.env, {
  MONGODB_CONNECTION_STRING: str(),
  SERVER_PORT: port(),
});
