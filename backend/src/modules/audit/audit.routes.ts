import { Router } from "express";

import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import { requirePermission } from "../../middleware/requirePermission.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import { auditController } from "./audit.controller.js";
import { auditIdSchema, listAuditSchema } from "./audit.schemas.js";

export const auditRouter = Router();

auditRouter.get("/", requirePermission("audit:view"), validate(listAuditSchema), asyncHandler(auditController.list));
auditRouter.get("/summary/by-action", requirePermission("audit:view"), validate(listAuditSchema), asyncHandler(auditController.summaryByAction));
auditRouter.get("/summary/by-actor", requirePermission("audit:view"), validate(listAuditSchema), asyncHandler(auditController.summaryByActor));
auditRouter.get("/summary/over-time", requirePermission("audit:view"), validate(listAuditSchema), asyncHandler(auditController.summaryOverTime));
auditRouter.get("/:id", requirePermission("audit:view"), validate(auditIdSchema), asyncHandler(auditController.getById));
