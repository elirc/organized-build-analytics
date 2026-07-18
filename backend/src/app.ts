import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";

import { env } from "./config/env.js";
import { authMiddleware } from "./middleware/auth.middleware.js";
import { errorMiddleware } from "./middleware/error.middleware.js";
import { rateLimitMiddleware } from "./middleware/rateLimit.middleware.js";
import { requestLoggerMiddleware } from "./middleware/requestLogger.middleware.js";
import { authRouter } from "./modules/auth/auth.routes.js";
import { usersRouter } from "./modules/users/users.routes.js";
import { eventsRouter } from "./modules/events/events.routes.js";
import { auditRouter } from "./modules/audit/audit.routes.js";
import { dashboardRouter } from "./modules/dashboard/dashboard.routes.js";
import { monitoringRouter } from "./modules/monitoring/monitoring.routes.js";
import { exportsRouter } from "./modules/exports/exports.routes.js";
import { dashboardConfigsRouter } from "./modules/dashboardConfigs/dashboardConfigs.routes.js";

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: env.FRONTEND_URL
    })
  );
  app.use(helmet());
  app.use(express.json());
  app.use(cookieParser());
  app.use(requestLoggerMiddleware);
  app.use(rateLimitMiddleware);
  app.use(authMiddleware);

  app.get("/health", (_request, response) => {
    response.status(200).json({ status: "ok" });
  });

  app.get("/health/ready", async (_request, response) => {
    response.status(200).json({
      status: "ready"
    });
  });

  app.use("/api/auth", authRouter);
  app.use("/api/users", usersRouter);
  app.use("/api/events", eventsRouter);
  app.use("/api/audit-events", auditRouter);
  app.use("/api/dashboard", dashboardRouter);
  app.use("/api/monitoring", monitoringRouter);
  app.use("/api/exports", exportsRouter);
  app.use("/api/dashboard-configs", dashboardConfigsRouter);

  app.use(errorMiddleware);

  return app;
}
