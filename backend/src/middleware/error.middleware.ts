import type { NextFunction, Request, Response } from "express";

import { AppError } from "../shared/errors/AppError.js";
import { ERROR_CODES } from "../shared/errors/errorCodes.js";
import { logError } from "../shared/utils/logger.js";

export function errorMiddleware(
  error: unknown,
  _request: Request,
  response: Response,
  _next: NextFunction
) {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      error: {
        code: error.code,
        message: error.message,
        requestId: _request.requestId
      }
    });
  }

  logError("request.failed", {
    requestId: _request.requestId,
    error
  });

  return response.status(500).json({
    error: {
      code: ERROR_CODES.INTERNAL_SERVER_ERROR,
      message: "Internal server error",
      requestId: _request.requestId
    }
  });
}
