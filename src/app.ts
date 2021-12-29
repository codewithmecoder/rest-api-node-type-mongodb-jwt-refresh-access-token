import express from "express";
import dotenv from "dotenv";
dotenv.config();
import config from "config";
import connect from "./utils/connect";
import logger from "./utils/logger";
import routes from "./routes";
import { deserializeUser } from "./middleware/deserializeUser";
const app = express();
const port = config.get<number>("port");
app.use(express.json());
app.use(deserializeUser);
app.listen(port, async () => {
  logger.info(`App running on http://localhost:${port}`);
  await connect();

  routes(app);
});
