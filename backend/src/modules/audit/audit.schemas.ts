import { z } from "zod";

export const listAuditSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({
    startDate: z.string(),
    endDate: z.string(),
    action: z.string().optional(),
    actorId: z.string().optional(),
    entityType: z.string().optional(),
    page: z.coerce.number().optional(),
    pageSize: z.coerce.number().optional()
  })
});

export const auditIdSchema = z.object({
  body: z.object({}).optional(),
  query: z.object({}).optional(),
  params: z.object({
    id: z.string().min(1)
  })
});
