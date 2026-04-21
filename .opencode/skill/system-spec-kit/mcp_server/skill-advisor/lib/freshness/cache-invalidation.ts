// ───────────────────────────────────────────────────────────────
// MODULE: Advisor Freshness Cache Invalidation
// ───────────────────────────────────────────────────────────────

export interface CacheInvalidationEvent {
  readonly generation: number;
  readonly changedPaths: readonly string[];
  readonly invalidatedAt: string;
  readonly reason: string;
}

export type CacheInvalidationListener = (event: CacheInvalidationEvent) => void;

const listeners = new Set<CacheInvalidationListener>();
let lastInvalidation: CacheInvalidationEvent | null = null;

export function onCacheInvalidation(listener: CacheInvalidationListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function invalidateSkillGraphCaches(event: Omit<CacheInvalidationEvent, 'invalidatedAt'>): CacheInvalidationEvent {
  const published: CacheInvalidationEvent = {
    ...event,
    invalidatedAt: new Date().toISOString(),
  };
  lastInvalidation = published;
  for (const listener of listeners) {
    try {
      listener(published);
    } catch {
      // Invalidation fan-out is best effort per listener; one bad hook must not
      // prevent later caches from seeing the generation bump.
    }
  }
  return published;
}

export function getLastCacheInvalidation(): CacheInvalidationEvent | null {
  return lastInvalidation;
}

export function clearCacheInvalidationListeners(): void {
  listeners.clear();
  lastInvalidation = null;
}
