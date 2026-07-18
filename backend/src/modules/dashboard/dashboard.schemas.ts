import { z } from "zod";

export const dashboardRangeSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({
    startDate: z.string(),
    endDate: z.string(),
    interval: z.enum(["day", "week"]).optional(),
    refresh: z.string().optional()
  })
});
