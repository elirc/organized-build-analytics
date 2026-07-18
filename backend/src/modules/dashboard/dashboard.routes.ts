import { Router } from "express";

import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import { metricVisibilityMiddleware } from "../../middleware/metricVisibility.middleware.js";
import { requirePermission } from "../../middleware/requirePermission.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import { dashboardController } from "./dashboard.controller.js";
import { dashboardRangeSchema } from "./dashboard.schemas.js";

export const dashboardRouter = Router();

dashboardRouter.use(requirePermission("dashboard:view"));
dashboardRouter.use(metricVisibilityMiddleware);

dashboardRouter.get("/kpi-summary", validate(dashboardRangeSchema), asyncHandler(dashboardController.kpiSummary));
dashboardRouter.get("/events-over-time", validate(dashboardRangeSchema), asyncHandler(dashboardController.eventsOverTime));
dashboardRouter.get("/events-by-type", validate(dashboardRangeSchema), asyncHandler(dashboardController.eventsByType));
dashboardRouter.get("/active-users", validate(dashboardRangeSchema), asyncHandler(dashboardController.activeUsers));
dashboardRouter.get("/error-rate", validate(dashboardRangeSchema), asyncHandler(dashboardController.errorRate));
dashboardRouter.get("/conversion-funnel", validate(dashboardRangeSchema), asyncHandler(dashboardController.conversionFunnel));
dashboardRouter.get("/recent-activity", validate(dashboardRangeSchema), asyncHandler(dashboardController.recentActivity));
