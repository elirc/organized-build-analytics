import type { NextFunction, Request, Response } from "express";

import { AppError } from "../shared/errors/AppError.js";
import { ERROR_CODES } from "../shared/errors/errorCodes.js";
import { type Permission, hasPermission } from "../shared/permissions.js";

export function requirePermission(permission: Permission) {
  return (request: Request, _response: Response, next: NextFunction) => {
    if (!request.user) {
      return next(new AppError(ERROR_CODES.UNAUTHORIZED, "Authentication required", 401));
    }

    if (!hasPermission(request.user.role, permission)) {
      return next(new AppError(ERROR_CODES.FORBIDDEN, "Insufficient permissions", 403));
    }

    return next();
  };
}
