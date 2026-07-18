import { z } from "zod";

const dateRangeQuery = z.object({
  startDate: z.string(),
  endDate: z.string(),
  page: z.coerce.number().optional(),
  pageSize: z.coerce.number().optional(),
  eventType: z.string().optional(),
  actorId: z.string().optional(),
  entityType: z.string().optional(),
  entityId: z.string().optional(),
  search: z.string().optional()
});

export const trackEventSchema = z.object({
  body: z.object({
    eventType: z.enum([
      "USER_SIGNED_UP",
      "USER_LOGGED_IN",
      "USER_LOGIN_FAILED",
      "FEATURE_USED",
      "RECORD_CREATED",
      "RECORD_UPDATED",
      "RECORD_DELETED",
      "CSV_EXPORTED",
      "API_ERROR",
      "BACKGROUND_JOB_FAILED",
      "ADMIN_ACTION"
    ]),
    entityType: z.string().optional(),
    entityId: z.string().optional(),
    actorId: z.string().optional(),
    actorEmail: z.string().email().optional(),
    sessionId: z.string().optional(),
    requestId: z.string().optional(),
    metadata: z.record(z.unknown()).optional(),
    occurredAt: z.string().datetime().optional()
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional()
});

export const listEventsSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: dateRangeQuery
});

export const eventIdSchema = z.object({
  body: z.object({}).optional(),
  query: z.object({}).optional(),
  params: z.object({
    id: z.string().min(1)
  })
});
