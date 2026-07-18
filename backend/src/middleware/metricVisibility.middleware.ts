import type { NextFunction, Request, Response } from "express";

export function metricVisibilityMiddleware(
  request: Request,
  _response: Response,
  next: NextFunction
) {
  request.query.refresh = request.user?.role === "SYSTEM_ADMIN" ? request.query.refresh : undefined;
  next();
}
