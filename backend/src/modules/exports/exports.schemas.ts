import { z } from "zod";

export const createExportSchema = z.object({
  body: z.object({
    exportType: z.enum(["TRACKED_EVENTS", "AUDIT_EVENTS", "KPI_SUMMARY", "MONITORING_METRICS"]),
    filters: z.record(z.unknown()).optional()
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional()
});

export const exportIdSchema = z.object({
  body: z.object({}).optional(),
  query: z.object({}).optional(),
  params: z.object({
    id: z.string().min(1)
  })
});
