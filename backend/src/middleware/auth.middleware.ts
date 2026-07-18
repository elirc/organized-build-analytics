import type { NextFunction, Request, Response } from "express";

import { verifyAccessToken } from "../shared/utils/jwt.js";

export function authMiddleware(request: Request, _response: Response, next: NextFunction) {
  const authorization = request.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    return next();
  }

  const token = authorization.replace("Bearer ", "");

  try {
    const payload = verifyAccessToken(token);
    request.user = {
      id: payload.sub,
      email: payload.email,
      role: payload.role as Express.User["role"]
    };
  } catch {
    request.user = undefined;
  }

  return next();
}
