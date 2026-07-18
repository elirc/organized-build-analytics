import { Router } from "express";

import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import { requirePermission } from "../../middleware/requirePermission.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import { monitoringController } from "./monitoring.controller.js";
import { monitoringRangeSchema, recordMetricSchema } from "./monitoring.schemas.js";

export const monitoringRouter = Router();

monitoringRouter.post("/metrics", requirePermission("monitoring:view"), validate(recordMetricSchema), asyncHandler(monitoringController.record));
monitoringRouter.get("/summary", requirePermission("monitoring:view"), validate(monitoringRangeSchema), asyncHandler(monitoringController.summary));
monitoringRouter.get("/api-latency", requirePermission("monitoring:view"), validate(monitoringRangeSchema), asyncHandler(monitoringController.apiLatency));
monitoringRouter.get("/error-rate", requirePermission("monitoring:view"), validate(monitoringRangeSchema), asyncHandler(monitoringController.errorRate));
monitoringRouter.get("/job-failures", requirePermission("monitoring:view"), validate(monitoringRangeSchema), asyncHandler(monitoringController.jobFailures));
monitoringRouter.get("/cache-hit-rate", requirePermission("monitoring:view"), validate(monitoringRangeSchema), asyncHandler(monitoringController.cacheHitRate));
monitoringRouter.get("/db-query-time", requirePermission("monitoring:view"), validate(monitoringRangeSchema), asyncHandler(monitoringController.dbQueryTime));
monitoringRouter.get("/queue-depth", requirePermission("monitoring:view"), asyncHandler(monitoringController.queueDepth));
monitoringRouter.get("/recent-job-failures", requirePermission("monitoring:view"), validate(monitoringRangeSchema), asyncHandler(monitoringController.recentJobFailures));
