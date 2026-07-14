import { createStorage } from "unstorage";
import redisDriver from "unstorage/drivers/redis";
import memoryDriver from "unstorage/drivers/memory";

const redisUrl = process.env.REDIS_URL;

export const storageBackend: "redis" | "memory" = redisUrl ? "redis" : "memory";

const driver = redisUrl ? redisDriver({ url: redisUrl }) : memoryDriver();

if (!redisUrl) {
  console.warn(
    "[storage] REDIS_URL is not set - falling back to an in-memory store. Data will not persist across restarts or across multiple server instances."
  );
}

export const storage = createStorage({ driver });
