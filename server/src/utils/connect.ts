import mongoos from "mongoose";
import config from "config";
import logger from "./logger";
export default async function connect() {
  const dbUri = config.get<string>("dbUri");
  try {
    await mongoos.connect(dbUri);
    logger.info("Connected to mongodb");
  } catch (error) {
    logger.error("Could not connect to db");
    process.exit(1);
  }
}
