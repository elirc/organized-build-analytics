import { Router } from "express";

import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import { requireAuthenticated } from "../../middleware/requireAuthenticated.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import { authController } from "./auth.controller.js";
import { loginSchema, logoutSchema, refreshSchema, registerSchema } from "./auth.schemas.js";

export const authRouter = Router();

authRouter.post("/register", validate(registerSchema), asyncHandler(authController.register));
authRouter.post("/login", validate(loginSchema), asyncHandler(authController.login));
authRouter.post("/refresh", validate(refreshSchema), asyncHandler(authController.refresh));
authRouter.post("/logout", validate(logoutSchema), asyncHandler(authController.logout));
authRouter.get("/me", requireAuthenticated, asyncHandler(authController.me));
