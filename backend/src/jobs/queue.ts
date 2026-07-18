import { Queue } from "bullmq";

import { env } from "../config/env.js";

let exportQueue: Queue | null = null;

export function getExportQueue() {
  if (!exportQueue) {
    exportQueue = new Queue("exports", {
      connection: {
        url: env.REDIS_URL
      }
    });
  }

  return exportQueue;
}
