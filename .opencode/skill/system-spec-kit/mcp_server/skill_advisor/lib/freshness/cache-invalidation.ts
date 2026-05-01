// ───────────────────────────────────────────────────────────────
// MODULE: Advisor Freshness Cache Invalidation
// ───────────────────────────────────────────────────────────────

import { isSpeckitMetricsEnabled, speckitMetrics } from '../metrics.js';

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
  // F-001-A1-04: enforce monotonic generation observation.
  //
  // publishSkillGraphGeneration() releases its file lock BEFORE calling this
  // function. That means two publishers can interleave such that generation
  // N+1's invalidateSkillGraphCaches() runs before generation N's, which would
  // overwrite `lastInvalidation` with an older generation and notify listeners
  // out of order. Cache consumers downstream (e.g. the prompt cache that
  // refreshes its source signature on each event) rely on the latest event
  // representing the latest committed state.
  //
  // Resolution: drop any event whose `generation` is strictly older than the
  // most recent observed generation. The newer generation already invalidated
  // every cache the older one would have invalidated, so this is safe and
  // strictly more correct than overwriting with stale state.
  const isStale = lastInvalidation !== null && published.generation < lastInvalidation.generation;
  if (!isStale) {
    lastInvalidation = published;
  }
  if (isSpeckitMetricsEnabled()) {
    speckitMetrics.incrementCounter('spec_kit.freshness.source_signature_bumps_total');
  }
  if (isStale) {
    return published;
  }
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
