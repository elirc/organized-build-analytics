import { getRedisClient } from "./redis.js";

export const cacheService = {
  async get<T>(key: string) {
    try {
      const raw = await getRedisClient().get(key);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch {
      return null;
    }
  },
  async set(key: string, value: unknown, ttlSeconds: number) {
    try {
      await getRedisClient().set(key, JSON.stringify(value), "EX", ttlSeconds);
    } catch {
      return null;
    }
  }
};
