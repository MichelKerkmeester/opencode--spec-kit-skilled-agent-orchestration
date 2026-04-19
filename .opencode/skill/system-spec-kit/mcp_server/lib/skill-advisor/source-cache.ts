// ───────────────────────────────────────────────────────────────
// MODULE: Skill Advisor Source Cache
// ───────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────
// 1. TYPES
// ───────────────────────────────────────────────────────────────

interface SourceCacheEntry<TValue> {
  readonly value: TValue;
  expiresAt: number;
  lastAccessedAt: number;
}

// ───────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────

export const ADVISOR_SOURCE_CACHE_TTL_MS = 15 * 60 * 1_000;
export const ADVISOR_SOURCE_CACHE_MAX_ENTRIES = 16;

const entries = new Map<string, SourceCacheEntry<unknown>>();

// ───────────────────────────────────────────────────────────────
// 3. HELPERS
// ───────────────────────────────────────────────────────────────

function evictExpired(now: number): void {
  for (const [key, entry] of entries.entries()) {
    if (entry.expiresAt <= now) {
      entries.delete(key);
    }
  }
}

function evictOverflow(): void {
  while (entries.size > ADVISOR_SOURCE_CACHE_MAX_ENTRIES) {
    let oldestKey: string | null = null;
    let oldestAccess = Number.POSITIVE_INFINITY;
    for (const [key, entry] of entries.entries()) {
      if (entry.lastAccessedAt < oldestAccess) {
        oldestAccess = entry.lastAccessedAt;
        oldestKey = key;
      }
    }
    if (oldestKey === null) {
      return;
    }
    entries.delete(oldestKey);
  }
}

// ───────────────────────────────────────────────────────────────
// 4. PUBLIC API
// ───────────────────────────────────────────────────────────────

/** Return a cached source-derived value or compute and retain it with TTL/LRU bounds. */
export function getOrCompute<TValue>(
  key: string,
  ttlMs: number,
  factory: () => TValue,
): TValue {
  const now = Date.now();
  evictExpired(now);

  const existing = entries.get(key) as SourceCacheEntry<TValue> | undefined;
  if (existing) {
    existing.lastAccessedAt = now;
    return existing.value;
  }

  const value = factory();
  entries.set(key, {
    value,
    expiresAt: now + ttlMs,
    lastAccessedAt: now,
  });
  evictOverflow();
  return value;
}

/** Clear all source-cache entries for tests and host reset flows. */
export function clearAdvisorSourceCache(): void {
  entries.clear();
}
