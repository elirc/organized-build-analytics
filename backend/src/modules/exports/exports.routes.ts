import { Router } from "express";

import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import { requirePermission } from "../../middleware/requirePermission.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import { exportsController } from "./exports.controller.js";
import { createExportSchema, exportIdSchema } from "./exports.schemas.js";

export const exportsRouter = Router();

exportsRouter.post("/", requirePermission("exports:create"), validate(createExportSchema), asyncHandler(exportsController.create));
exportsRouter.get("/", requirePermission("exports:view"), asyncHandler(exportsController.list));
exportsRouter.get("/:id", requirePermission("exports:view"), validate(exportIdSchema), asyncHandler(exportsController.getById));
exportsRouter.get("/:id/download", requirePermission("exports:view"), validate(exportIdSchema), asyncHandler(exportsController.download));
exportsRouter.post("/:id/retry", requirePermission("exports:create"), validate(exportIdSchema), asyncHandler(exportsController.retry));
