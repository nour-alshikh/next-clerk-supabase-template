import "server-only";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { serverEnv } from "@/lib/env.server";

const redis =
  serverEnv.UPSTASH_REDIS_REST_URL && serverEnv.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({ url: serverEnv.UPSTASH_REDIS_REST_URL, token: serverEnv.UPSTASH_REDIS_REST_TOKEN })
    : null;

// Default budget: 30 requests per minute per key. Make more limiters with other
// windows (e.g. stricter for sign-up forms or AI calls) the same way.
const defaultLimiter = redis
  ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(30, "60 s"), prefix: "ratelimit" })
  : null;

/**
 * Counts one request for `key` (e.g. `action:${userId}` or `ip:${ip}`).
 * Without Upstash env vars (local dev) every request is allowed.
 */
export async function rateLimit(key: string, limiter = defaultLimiter) {
  if (!limiter) return { success: true };
  return limiter.limit(key);
}
