import { registerExportProcessor } from "./jobs/export.processor.js";
import { getRedisClient } from "./cache/redis.js";
import { logInfo, logWarn } from "./shared/utils/logger.js";

async function bootstrapWorker() {
  try {
    await getRedisClient().connect();
    await registerExportProcessor();
    logInfo("worker.started", { queue: "exports" });
  } catch (error) {
    logWarn("worker.failed_to_start", {
      error: error instanceof Error ? error.message : "unknown"
    });
    process.exit(1);
  }
}

bootstrapWorker();
