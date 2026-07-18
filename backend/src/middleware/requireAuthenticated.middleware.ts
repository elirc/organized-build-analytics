import type { NextFunction, Request, Response } from "express";

import { AppError } from "../shared/errors/AppError.js";
import { ERROR_CODES } from "../shared/errors/errorCodes.js";

export function requireAuthenticated(request: Request, _response: Response, next: NextFunction) {
  if (!request.user) {
    return next(new AppError(ERROR_CODES.UNAUTHORIZED, "Authentication required", 401));
  }

  return next();
}
