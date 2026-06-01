import type { Server as HttpServer } from "node:http";
import { Server } from "socket.io";
import { env } from "../config/env.js";
import { logger } from "../config/logger.js";
import { SiteModel } from "../models/site.model.js";

let io: Server | null = null;

export function createSocketServer(server: HttpServer) {
  io = new Server(server, {
    cors: {
      origin: env.CLIENT_ORIGIN,
      credentials: true
    }
  });

  io.on("connection", (socket) => {
    socket.on("subscribe", async ({ apiKey }: { apiKey?: string }) => {
      if (!apiKey) {
        socket.emit("subscribe:error", { message: "Missing API key" });
        return;
      }

      const site = await SiteModel.findOne({ apiKey }).select("_id").lean();

      if (!site) {
        socket.emit("subscribe:error", { message: "Invalid API key" });
        return;
      }

      socket.join(`site:${site._id.toString()}`);
      socket.emit("subscribe:success", { siteId: site._id.toString() });
    });
  });

  logger.info("Socket.io server ready");
  return io;
}

export function emitNewEvent(siteId: string, payload: unknown) {
  io?.to(`site:${siteId}`).emit("event:new", payload);
}
