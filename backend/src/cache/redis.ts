import { Redis } from "ioredis";

import { env } from "../config/env.js";

let redisClient: Redis | null = null;

export function getRedisClient() {
  if (!redisClient) {
    redisClient = new Redis(env.REDIS_URL, {
      maxRetriesPerRequest: null,
      lazyConnect: true
    });
  }

  return redisClient;
}
