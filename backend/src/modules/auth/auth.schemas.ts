import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    role: z.enum([
      "SYSTEM_ADMIN",
      "OPS_MANAGER",
      "PRODUCT_MANAGER",
      "ENGINEERING_ADMIN",
      "AUDIT_VIEWER",
      "EXECUTIVE_VIEWER",
      "READ_ONLY"
    ])
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional()
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8)
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional()
});

export const refreshSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(10)
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional()
});

export const logoutSchema = refreshSchema;
