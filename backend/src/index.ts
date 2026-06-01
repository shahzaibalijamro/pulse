import http from "node:http";
import { createApp } from "./app.js";
import { connectMongo } from "./config/database.js";
import { env } from "./config/env.js";
import { logger } from "./config/logger.js";
import { connectRedis, disconnectRedis } from "./config/redis.js";
import { startFlushEventsJob } from "./jobs/flushEvents.js";
import { createSocketServer } from "./sockets/socket.js";

async function bootstrap() {
  await connectMongo();
  await connectRedis();

  const app = createApp();
  const server = http.createServer(app);

  createSocketServer(server);
  await startFlushEventsJob();

  server.listen(env.PORT, () => {
    logger.info("Pulse backend listening", { port: env.PORT });
  });

  const shutdown = async () => {
    logger.info("Shutting down Pulse backend");
    server.close();
    await disconnectRedis();
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

bootstrap().catch((error) => {
  logger.error("Backend failed to start", {
    message: error.message,
    stack: error.stack
  });
  process.exit(1);
});
