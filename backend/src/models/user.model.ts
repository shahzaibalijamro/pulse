import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    passwordHash: {
      type: String,
      required: true,
      select: false
    },
    workspaceId: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: true
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false
  }
);

UserSchema.methods.toSafeJSON = function toSafeJSON() {
  return {
    id: this._id.toString(),
    email: this.email,
    workspaceId: this.workspaceId.toString(),
    createdAt: this.createdAt
  };
};

export type User = InferSchemaType<typeof UserSchema>;

export type UserDocument = mongoose.HydratedDocument<User> & {
  toSafeJSON: () => {
    id: string;
    email: string;
    workspaceId: string;
    createdAt: Date;
  };
};

export const UserModel =
  (mongoose.models.User as Model<User>) || mongoose.model("User", UserSchema);
