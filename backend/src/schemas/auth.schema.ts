import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email().trim().toLowerCase(),
    password: z.string().min(8, "Password must be at least 8 characters"),
    workspaceName: z.string().trim().min(2).max(80).optional()
  })
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email().trim().toLowerCase(),
    password: z.string().min(1)
  })
});
