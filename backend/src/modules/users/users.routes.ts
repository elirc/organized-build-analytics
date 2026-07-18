import { Router } from "express";

import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import { requirePermission } from "../../middleware/requirePermission.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import { usersController } from "./users.controller.js";
import { listUsersSchema } from "./users.schemas.js";

export const usersRouter = Router();

usersRouter.get("/", requirePermission("users:manage"), validate(listUsersSchema), asyncHandler(usersController.list));
