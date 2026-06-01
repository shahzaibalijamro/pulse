import bcrypt from "bcryptjs";
import { Router } from "express";
import mongoose from "mongoose";
import { clearAuthCookie, setAuthCookie } from "../config/cookies.js";
import { logger } from "../config/logger.js";
import { authLoginLimiter } from "../middleware/rateLimit.middleware.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { UserModel } from "../models/user.model.js";
import { WorkspaceModel } from "../models/workspace.model.js";
import { loginSchema, registerSchema } from "../schemas/auth.schema.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { HttpError } from "../utils/httpError.js";
import { signAuthToken } from "../utils/jwt.js";

export const authRouter = Router();

authRouter.post(
  "/register",
  validate(registerSchema),
  asyncHandler(async (req, res) => {
    const { email, password, workspaceName } = req.body;
    const existingUser = await UserModel.findOne({ email }).lean();

    if (existingUser) {
      throw new HttpError(409, "Email is already registered");
    }

    const userId = new mongoose.Types.ObjectId();
    const workspaceId = new mongoose.Types.ObjectId();
    const passwordHash = await bcrypt.hash(password, 12);

    const workspace = await WorkspaceModel.create({
      _id: workspaceId,
      name: workspaceName || `${email.split("@")[0]}'s workspace`,
      ownerId: userId,
      plan: "free"
    });

    const user = await UserModel.create({
      _id: userId,
      email,
      passwordHash,
      workspaceId
    });

    const token = signAuthToken({
      userId: user._id.toString(),
      workspaceId: workspace._id.toString()
    });

    setAuthCookie(res, token);
    logger.info("User registered", { userId: user._id.toString(), workspaceId: workspace._id.toString() });

    res.status(201).json({
      user: toSafeUser(user),
      workspace: toSafeWorkspace(workspace)
    });
  })
);

authRouter.post(
  "/login",
  authLoginLimiter,
  validate(loginSchema),
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email }).select("+passwordHash");

    if (!user) {
      throw new HttpError(401, "Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      logger.warn("Failed login", { email });
      throw new HttpError(401, "Invalid email or password");
    }

    const workspace = await WorkspaceModel.findById(user.workspaceId).lean();

    if (!workspace) {
      throw new HttpError(500, "Workspace missing for user");
    }

    const token = signAuthToken({
      userId: user._id.toString(),
      workspaceId: user.workspaceId.toString()
    });

    setAuthCookie(res, token);
    logger.info("User logged in", { userId: user._id.toString(), workspaceId: user.workspaceId.toString() });

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

function toSafeUser(user: {
  _id: unknown;
  email: string;
  workspaceId: unknown;
  createdAt?: Date;
}) {
  return {
    id: String(user._id),
    email: user.email,
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
