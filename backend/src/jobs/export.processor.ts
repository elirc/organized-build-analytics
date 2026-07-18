import { Worker } from "bullmq";

import { env } from "../config/env.js";
import { logError, logInfo } from "../shared/utils/logger.js";
import { exportsService } from "../modules/exports/exports.service.js";

let worker: Worker | null = null;

export async function registerExportProcessor() {
  if (worker) {
    return worker;
  }

  worker = new Worker(
    "exports",
    async (job) => {
      await exportsService.processJob(String(job.data.exportJobId));
    },
    {
      connection: {
        url: env.REDIS_URL
      }
    }
  );

  worker.on("completed", (job) => {
    logInfo("export.job.completed", { exportJobId: job.data.exportJobId });
  });

  worker.on("failed", (job, error) => {
    logError("export.job.failed", {
      exportJobId: job?.data.exportJobId,
      error: error.message
    });
  });

  return worker;
}
