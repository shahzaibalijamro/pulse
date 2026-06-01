import type { NextFunction, Request, Response } from "express";
import { authCookieName } from "../config/cookies.js";
import { UserModel } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { HttpError } from "../utils/httpError.js";
import { verifyAuthToken } from "../utils/jwt.js";

export const requireAuth = asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
  const signedCookieToken = req.signedCookies?.[authCookieName];
  const bearerToken = getBearerToken(req.headers.authorization);
  const token = signedCookieToken || bearerToken;

  if (!token) {
    throw new HttpError(401, "Authentication required");
  }

  const payload = verifyAuthToken(token);
  const user = await UserModel.findById(payload.userId).select("_id workspaceId").lean();

  if (!user) {
    throw new HttpError(401, "User no longer exists");
  }

  req.auth = {
    userId: user._id.toString(),
    workspaceId: user.workspaceId.toString()
  };

  next();
});

function getBearerToken(header?: string) {
  if (!header?.startsWith("Bearer ")) return null;
  return header.slice("Bearer ".length);
}
