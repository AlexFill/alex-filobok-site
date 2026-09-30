/**
 * A small fixed-window limiter. It lives in one server instance's memory, so
 * on serverless hosting it is best-effort protection for the API key, not a
 * guarantee. Pure and clock-injected so it can be tested.
 */
export interface Limiter {
  hit(key: string, now?: number): boolean;
}

export function createLimiter(max: number, windowMs: number): Limiter {
  const seen = new Map<string, { count: number; resetAt: number }>();
  return {
    hit(key, now = Date.now()) {
      const entry = seen.get(key);
      if (!entry || now >= entry.resetAt) {
        // Drop expired entries so the map cannot grow without bound.
        if (seen.size > 500) for (const [k, v] of seen) if (now >= v.resetAt) seen.delete(k);
        seen.set(key, { count: 1, resetAt: now + windowMs });
        return true;
      }
      entry.count += 1;
      return entry.count <= max;
    },
  };
}
