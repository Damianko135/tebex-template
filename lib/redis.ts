import "server-only";

import Redis from "ioredis";

const redisUrl = process.env.REDIS_URL;

export const redisBackend: "redis" | "memory" = redisUrl ? "redis" : "memory";

// `lib/storage/storage.ts` (theme settings) goes through `unstorage`'s own
// redis driver, which manages its own internal ioredis connection and
// doesn't accept an externally-created client. This module is the single
// shared connection for everything that talks to Redis directly (currently:
// authentication) - cached on `globalThis` so Next.js dev-mode hot reloads
// reuse the same socket instead of leaking a new one on every edit.
declare global {
  var __authRedisClient: Redis | undefined;
}

function createClient(): Redis | null {
  if (!redisUrl) return null;
  if (!globalThis.__authRedisClient) {
    globalThis.__authRedisClient = new Redis(redisUrl, {
      // Fail fast instead of buffering commands indefinitely if Redis is
      // briefly unreachable - callers already handle a null client, and a
      // hung connection attempt shouldn't block auth requests.
      maxRetriesPerRequest: 3,
      lazyConnect: false,
    });
  }
  return globalThis.__authRedisClient;
}

if (!redisUrl) {
  console.warn(
    "[auth] REDIS_URL is not set - falling back to an in-memory store for authentication data. Admin sessions and accounts will not persist across restarts or across multiple server instances."
  );
}

export const redis = createClient();
