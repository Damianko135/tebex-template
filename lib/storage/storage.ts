import { createStorage } from "unstorage";
import redisDriver from "unstorage/drivers/redis";
import memoryDriver from "unstorage/drivers/memory";

const driver = process.env.REDIS_URL
  ? redisDriver({ url: process.env.REDIS_URL })
  : memoryDriver();

if (!process.env.REDIS_URL) {
  console.warn(
    "[storage] REDIS_URL is not set - falling back to an in-memory store. Data will not persist across restarts or across multiple server instances."
  );
}

export const storage = createStorage({ driver });
