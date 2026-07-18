import { z } from "zod";

export const createDashboardConfigSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    role: z.enum([
      "SYSTEM_ADMIN",
      "OPS_MANAGER",
      "PRODUCT_MANAGER",
      "ENGINEERING_ADMIN",
      "AUDIT_VIEWER",
      "EXECUTIVE_VIEWER",
      "READ_ONLY"
    ]),
    layoutJson: z.record(z.unknown()),
    isDefault: z.boolean().optional()
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional()
});

export const updateDashboardConfigSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    description: z.string().optional(),
    role: z.enum([
      "SYSTEM_ADMIN",
      "OPS_MANAGER",
      "PRODUCT_MANAGER",
      "ENGINEERING_ADMIN",
      "AUDIT_VIEWER",
      "EXECUTIVE_VIEWER",
      "READ_ONLY"
    ]).optional(),
    layoutJson: z.record(z.unknown()).optional(),
    isDefault: z.boolean().optional()
  }),
  query: z.object({}).optional(),
  params: z.object({
    id: z.string().min(1)
  })
});
