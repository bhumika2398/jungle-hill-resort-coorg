import "server-only";
import { Redis } from "@upstash/redis";

/**
 * Shared Redis cache (Upstash). Optional: without UPSTASH_REDIS_REST_URL / _TOKEN every helper
 * falls back to doing the work directly, and Redis errors never break a request.
 */
const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;
export const redis = url && token ? new Redis({ url, token }) : null;

/** Next fetch-cache tag for everything read from site_content. Cleared by the admin on every save. */
export const CONTENT_TAG = "site-content";

/** Cache keys. Bump the suffix if the cached shape changes. */
export const KEYS = {
  content: "content:v1",
  dashboard: "dashboard:v1",
} as const;

/** Safety-net expiry: the admin clears keys on save, so this only matters if an edit bypasses it. */
export const TTL = {
  content: 60 * 60,
  dashboard: 60,
} as const;

/** Returns the cached value for `key`, or runs `loader`, stores the result for `ttl` seconds and returns it. */
export async function cached<T>(
  key: string,
  ttl: number,
  loader: () => Promise<T>,
): Promise<T> {
  if (!redis) return loader();
  try {
    const hit = await redis.get<T>(key);
    if (hit !== null && hit !== undefined) return hit;
  } catch (error) {
    console.error("Redis read failed", error);
  }
  const value = await loader();
  try {
    await redis.set(key, value, { ex: ttl });
  } catch (error) {
    console.error("Redis write failed", error);
  }
  return value;
}

/** Deletes cached keys. Call after writing to the database and before revalidating pages. */
export async function invalidate(...keys: string[]) {
  if (!redis || keys.length === 0) return;
  try {
    await redis.del(...keys);
  } catch (error) {
    console.error("Redis delete failed", error);
  }
}
