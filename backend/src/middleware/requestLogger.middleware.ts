import { randomUUID } from "node:crypto";

import type { NextFunction, Request, Response } from "express";

import { logInfo } from "../shared/utils/logger.js";

export function requestLoggerMiddleware(request: Request, response: Response, next: NextFunction) {
  const start = Date.now();
  request.requestId = request.headers["x-request-id"]?.toString() ?? randomUUID();
  response.setHeader("x-request-id", request.requestId);

  response.on("finish", () => {
    logInfo("request.completed", {
      requestId: request.requestId,
      method: request.method,
      path: request.originalUrl,
      statusCode: response.statusCode,
      durationMs: Date.now() - start
    });
  });

  next();
}
