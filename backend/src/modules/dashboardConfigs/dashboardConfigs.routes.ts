import { Router } from "express";

import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import { requirePermission } from "../../middleware/requirePermission.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import { createDashboardConfigSchema, updateDashboardConfigSchema } from "./dashboardConfigs.schemas.js";
import { dashboardConfigsController } from "./dashboardConfigs.controller.js";

export const dashboardConfigsRouter = Router();

dashboardConfigsRouter.get("/", requirePermission("dashboard:configure"), asyncHandler(dashboardConfigsController.list));
dashboardConfigsRouter.post("/", requirePermission("dashboard:configure"), validate(createDashboardConfigSchema), asyncHandler(dashboardConfigsController.create));
dashboardConfigsRouter.get("/:id", requirePermission("dashboard:configure"), asyncHandler(dashboardConfigsController.getById));
dashboardConfigsRouter.patch("/:id", requirePermission("dashboard:configure"), validate(updateDashboardConfigSchema), asyncHandler(dashboardConfigsController.patch));
dashboardConfigsRouter.delete("/:id", requirePermission("dashboard:configure"), asyncHandler(dashboardConfigsController.remove));
