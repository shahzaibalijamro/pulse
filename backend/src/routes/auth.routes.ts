import { Router } from "express";
import mongoose from "mongoose";
import { OAuth2Client } from "google-auth-library";
import { clearAuthCookie, setAuthCookie } from "../config/cookies.js";
import { logger } from "../config/logger.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { UserModel } from "../models/user.model.js";
import { WorkspaceModel } from "../models/workspace.model.js";
import { googleLoginSchema } from "../schemas/auth.schema.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { HttpError } from "../utils/httpError.js";
import { signAuthToken } from "../utils/jwt.js";

function toSafeOptionalString(value: unknown): string | undefined {
  return typeof value === "string" && value.length > 0 ? value : undefined;
}


export const authRouter = Router();

// TODO: REPLACE_WITH_YOUR_GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID_HERE";
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

authRouter.post(
  "/google",
  validate(googleLoginSchema),
  asyncHandler(async (req, res) => {
    const { token } = req.body;

    // Verify the Google ID token
    let ticket;
    try {
      ticket = await googleClient.verifyIdToken({
        idToken: token,
        audience: GOOGLE_CLIENT_ID
      });
    } catch {
      throw new HttpError(401, "Invalid Google token");
    }

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      throw new HttpError(401, "Could not extract email from Google token");
    }

    const { email, sub: googleId, name, picture } = payload;

    // Find existing user by email or create a new one
    let user = await UserModel.findOne({ email });

    if (user) {
      // Update Google fields if they changed
      if (googleId && user.googleId !== googleId) user.googleId = googleId;
      if (name && user.name !== name) user.name = name;
      if (picture && user.picture !== picture) user.picture = picture;
      await user.save();
    } else {
      // Create new user + workspace
      const userId = new mongoose.Types.ObjectId();
      const workspaceId = new mongoose.Types.ObjectId();

      await WorkspaceModel.create({
        _id: workspaceId,
        name: `${name || email.split("@")[0]}'s workspace`,
        ownerId: userId,
        plan: "free"
      });

      user = await UserModel.create({
        _id: userId,
        email,
        googleId,
        name,
        picture,
        workspaceId
      });
    }

    const workspace = await WorkspaceModel.findById(user.workspaceId).lean();
    if (!workspace) {
      throw new HttpError(500, "Workspace missing for user");
    }

    const jwtToken = signAuthToken({
      userId: user._id.toString(),
      workspaceId: user.workspaceId.toString()
    });

    setAuthCookie(res, jwtToken);
    logger.info("User signed in via Google", {
      userId: user._id.toString(),
      email
    });

    res.json({
      user: toSafeUser(user),
      workspace: toSafeWorkspace(workspace)
    });
  })
);

authRouter.post("/logout", (_req, res) => {
  clearAuthCookie(res);
  res.status(204).send();
});

authRouter.get(
  "/me",
  requireAuth,
  asyncHandler(async (req, res) => {
    const user = await UserModel.findById(req.auth!.userId).lean();
    const workspace = await WorkspaceModel.findById(req.auth!.workspaceId).lean();

    if (!user || !workspace) {
      throw new HttpError(401, "Session user was not found");
    }

    res.json({
      user: toSafeUser(user),
      workspace: toSafeWorkspace(workspace)
    });
  })
);

function toSafeUser(user: any) {
  return {
    id: String(user._id),
    email: String(user.email),
    name: toSafeOptionalString(user.name),
    picture: toSafeOptionalString(user.picture),
    workspaceId: String(user.workspaceId),
    createdAt: user.createdAt
  };
}

function toSafeWorkspace(workspace: {

  _id: unknown;
  name: string;
  plan: string;
  createdAt?: Date;
}) {
  return {
    id: String(workspace._id),
    name: workspace.name,
    plan: workspace.plan,
    createdAt: workspace.createdAt
  };
}
