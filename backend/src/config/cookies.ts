import type { CookieOptions, Response } from "express";
import { env, isProduction } from "./env.js";

export const authCookieName = "pulse_token";

export function authCookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    signed: true,
    maxAge: jwtMaxAgeMs(env.JWT_EXPIRES_IN),
    path: "/"
  };
}

export function setAuthCookie(res: Response, token: string) {
  res.cookie(authCookieName, token, authCookieOptions());
}

export function clearAuthCookie(res: Response) {
  res.clearCookie(authCookieName, { ...authCookieOptions(), maxAge: undefined });
}

function jwtMaxAgeMs(value: string) {
  const match = /^(\d+)([smhd])$/.exec(value);
  if (!match) return 7 * 24 * 60 * 60 * 1000;

  const amount = Number(match[1]);
  const unit = match[2];

  const multipliers: Record<string, number> = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000
  };

  return amount * multipliers[unit];
}
