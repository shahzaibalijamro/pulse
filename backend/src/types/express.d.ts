import type { HydratedDocument, Types } from "mongoose";
import type { Site } from "../models/site.model.js";

declare global {
  namespace Express {
    interface Request {
      auth?: {
        userId: string;
        workspaceId: string;
      };
      site?: HydratedDocument<Site> | {
        _id: Types.ObjectId;
        workspaceId: Types.ObjectId;
        name: string;
        domain: string;
        apiKey: string;
      };
    }
  }
}

export {};
