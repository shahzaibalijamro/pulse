import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const WorkspaceSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    plan: {
      type: String,
      enum: ["free", "pro"],
      default: "free"
    },
    stripeCustomerId: {
      type: String,
      default: null,
      index: true
    },
    stripeSubscriptionId: {
      type: String,
      default: null,
      index: true
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false
  }
);

export type Workspace = InferSchemaType<typeof WorkspaceSchema>;

export const WorkspaceModel =
  (mongoose.models.Workspace as Model<Workspace>) ||
  mongoose.model("Workspace", WorkspaceSchema);
