// In-memory rate limiter. Swap for Upstash/Redis when scaling.
const hits = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(key: string, limit = 5, windowMs = 60_000) {
  const now = Date.now();
  const rec = hits.get(key);
  if (!rec || rec.resetAt < now) {
    hits.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1 };
  }
  if (rec.count >= limit) return { ok: false, remaining: 0 };
  rec.count++;
  return { ok: true, remaining: limit - rec.count };
}
