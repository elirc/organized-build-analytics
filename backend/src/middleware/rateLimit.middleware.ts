import type { NextFunction, Request, Response } from "express";

import { env } from "../config/env.js";
import { AppError } from "../shared/errors/AppError.js";
import { ERROR_CODES } from "../shared/errors/errorCodes.js";

const requestBuckets = new Map<string, { count: number; windowStart: number }>();

export function rateLimitMiddleware(request: Request, _response: Response, next: NextFunction) {
  const key = request.ip ?? "unknown";
  const now = Date.now();
  const bucket = requestBuckets.get(key);

  if (!bucket || now - bucket.windowStart > env.RATE_LIMIT_WINDOW_MS) {
    requestBuckets.set(key, { count: 1, windowStart: now });
    return next();
  }

  if (bucket.count >= env.RATE_LIMIT_MAX_REQUESTS) {
    return next(
      new AppError(
        ERROR_CODES.FORBIDDEN,
        "Rate limit exceeded for this client. Please retry shortly.",
        429
      )
    );
  }

  bucket.count += 1;
  requestBuckets.set(key, bucket);
  return next();
}
