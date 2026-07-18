import { z } from "zod";

export const recordMetricSchema = z.object({
  body: z.object({
    metricType: z.enum([
      "API_LATENCY",
      "ERROR_RATE",
      "JOB_FAILURE_RATE",
      "QUEUE_DEPTH",
      "DB_QUERY_TIME",
      "CACHE_HIT_RATE"
    ]),
    name: z.string().min(1),
    value: z.number(),
    unit: z.string().optional(),
    tags: z.record(z.unknown()).optional(),
    recordedAt: z.string().datetime().optional()
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional()
});

export const monitoringRangeSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({
    startDate: z.string(),
    endDate: z.string()
  })
});
