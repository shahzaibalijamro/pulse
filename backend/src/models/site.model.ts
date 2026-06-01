import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const SiteSchema = new Schema(
  {
    workspaceId: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
      index: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    domain: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    apiKey: {
      type: String,
      required: true,
      unique: true,
      index: true
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false
  }
);

SiteSchema.index({ workspaceId: 1, domain: 1 }, { unique: true });

export type Site = InferSchemaType<typeof SiteSchema>;

export const SiteModel =
  (mongoose.models.Site as Model<Site>) || mongoose.model("Site", SiteSchema);
