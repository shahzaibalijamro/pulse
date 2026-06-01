import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const EventSchema = new Schema(
  {
    siteId: {
      type: Schema.Types.ObjectId,
      ref: "Site",
      required: true,
      index: true
    },
    workspaceId: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
      index: true
    },
    type: {
      type: String,
      enum: ["pageview", "click", "custom"],
      required: true
    },
    url: {
      type: String,
      required: true
    },
    path: {
      type: String,
      required: true
    },
    referrer: {
      type: String,
      default: null
    },
    referrerDomain: {
      type: String,
      default: null
    },
    browser: {
      type: String,
      default: "Unknown"
    },
    os: {
      type: String,
      default: "Unknown"
    },
    device: {
      type: String,
      enum: ["desktop", "mobile", "tablet", "bot", "unknown"],
      default: "unknown"
    },
    country: {
      type: String,
      default: "Unknown"
    },
    countryCode: {
      type: String,
      default: null
    },
    sessionHash: {
      type: String,
      required: true,
      index: true
    },
    eventName: {
      type: String,
      default: null
    },
    properties: {
      type: Schema.Types.Mixed,
      default: {}
    },
    timestamp: {
      type: Date,
      required: true,
      index: true
    }
  },
  {
    versionKey: false
  }
);

// Most analytics queries filter to one site and a time window, so this is the hot path index.
EventSchema.index({ siteId: 1, timestamp: -1 });
EventSchema.index({ workspaceId: 1, siteId: 1, timestamp: -1 });

export type Event = InferSchemaType<typeof EventSchema>;

export const EventModel =
  (mongoose.models.Event as Model<Event>) || mongoose.model("Event", EventSchema);
