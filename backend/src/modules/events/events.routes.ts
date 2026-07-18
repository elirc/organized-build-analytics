import { Router } from "express";

import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import { requirePermission } from "../../middleware/requirePermission.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import { eventIdSchema, listEventsSchema, trackEventSchema } from "./events.schemas.js";
import { eventsController } from "./events.controller.js";

export const eventsRouter = Router();

eventsRouter.post("/track", requirePermission("events:view"), validate(trackEventSchema), asyncHandler(eventsController.track));
eventsRouter.get("/", requirePermission("events:view"), validate(listEventsSchema), asyncHandler(eventsController.list));
eventsRouter.get("/summary/by-type", requirePermission("events:view"), validate(listEventsSchema), asyncHandler(eventsController.summaryByType));
eventsRouter.get("/summary/over-time", requirePermission("events:view"), validate(listEventsSchema), asyncHandler(eventsController.summaryOverTime));
eventsRouter.get("/:id", requirePermission("events:view"), validate(eventIdSchema), asyncHandler(eventsController.getById));
