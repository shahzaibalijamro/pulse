import mongoose from "mongoose";
import { env } from "./env.js";
import { logger } from "./logger.js";

export async function connectMongo() {
  await mongoose.connect(env.MONGO_URI);
  logger.info("MongoDB connected");
}

export async function disconnectMongo() {
  await mongoose.disconnect();
}
