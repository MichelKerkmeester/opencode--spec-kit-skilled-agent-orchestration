// ───────────────────────────────────────────────────────────────
// MODULE: Tool Cache
// ───────────────────────────────────────────────────────────────
// Feature catalog: Tool-level TTL cache
import crypto from 'crypto';

/* ───────────────────────────────────────────────────────────────
   1. TYPES
──────────────────────────────────────────────────────────────── */

interface ToolCacheConfig {
  enabled: boolean;
  defaultTtlMs: number;
  maxEntries: number;
  cleanupIntervalMs: number;
}

interface CacheEntry<T = unknown> {
  value: T;
  expiresAt: number;
  toolName: string;
  createdAt: number;
}

interface CacheStats {
  hits: number;
  misses: number;
  evictions: number;
  invalidations: number;
  hitRate: string;
  currentSize: number;
  maxSize: number;
}

interface SetOptions {
  toolName?: string;
  ttlMs?: number;
}

interface WithCacheOptions {
  bypassCache?: boolean;
  ttlMs?: number;
}

interface InFlightEntry<T = unknown> {
  promise: Promise<T>;
  toolName: string;
  cacheGeneration: number;
  toolGeneration: number;
}

/* ───────────────────────────────────────────────────────────────
   2. CONFIGURATION
──────────────────────────────────────────────────────────────── */

const TOOL_CACHE_CONFIG: ToolCacheConfig = {
  enabled: process.env.ENABLE_TOOL_CACHE !== 'false',
  defaultTtlMs: parseInt(process.env.TOOL_CACHE_TTL_MS || '60000', 10) || 60000,
  maxEntries: parseInt(process.env.TOOL_CACHE_MAX_ENTRIES || '1000', 10) || 1000,
  cleanupIntervalMs: parseInt(process.env.TOOL_CACHE_CLEANUP_INTERVAL_MS || '30000', 10) || 30000,
};

/* ───────────────────────────────────────────────────────────────
   3. STATE
──────────────────────────────────────────────────────────────── */

const cache = new Map<string, CacheEntry>();
const inFlight = new Map<string, InFlightEntry>();
const toolGenerations = new Map<string, number>();

/** Maximum size for auxiliary maps (inFlight, toolGenerations). */
const AUX_CACHE_MAX_SIZE = 200;

/**
 * Enforce size bound on an auxiliary Map using the enforceCacheBound() pattern.
 * Clears the entire map when the limit is exceeded.
 */
function enforceAuxCacheBound<K, V>(map: Map<K, V>): void {
  if (map.size > AUX_CACHE_MAX_SIZE) {
    map.clear();
  }
}

const stats = {
  hits: 0,
  misses: 0,
  evictions: 0,
  invalidations: 0,
};

let cleanupInterval: ReturnType<typeof setInterval> | null = null;
let cacheGeneration = 0;

/* ───────────────────────────────────────────────────────────────
   4. CACHE KEY GENERATION
──────────────────────────────────────────────────────────────── */

function generateCacheKey(toolName: string, args: unknown): string {
  if (!toolName || typeof toolName !== 'string') {
    throw new Error('[tool-cache] toolName must be a non-empty string');
  }

  const canonicalArgs = canonicalizeArgs(args);
  const keyString = `${toolName}:${canonicalArgs}`;
  return crypto.createHash('sha256').update(keyString).digest('hex');
}

function canonicalizeArgs(args: unknown): string {
  return JSON.stringify(sortKeys(args));
}

/** Recursively sort object keys for stable serialization */
function sortKeys(value: unknown): unknown {
  if (value === undefined || value === null) {
    return null;
  }

  if (typeof value !== 'object') {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(sortKeys);
  }

  const sortedKeysList = Object.keys(value as Record<string, unknown>).sort();
  const sortedObj: Record<string, unknown> = {};

  for (const key of sortedKeysList) {
    const v = (value as Record<string, unknown>)[key];
    if (v !== undefined) {
      sortedObj[key] = sortKeys(v);
    }
  }

  return sortedObj;
}

/* ───────────────────────────────────────────────────────────────
   5. CORE CACHE OPERATIONS
──────────────────────────────────────────────────────────────── */

function get<T = unknown>(key: string): T | null {
  if (!TOOL_CACHE_CONFIG.enabled) return null;

  const entry = cache.get(key) as CacheEntry<T> | undefined;
  if (!entry) {
    stats.misses++;
    return null;
  }

  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    stats.misses++;
    stats.evictions++;
    return null;
  }

  stats.hits++;
  return entry.value;
}

function set<T = unknown>(key: string, value: T, options: SetOptions = {}): boolean {
  if (!TOOL_CACHE_CONFIG.enabled) return false;

  const { toolName = 'unknown', ttlMs = TOOL_CACHE_CONFIG.defaultTtlMs } = options;
  const now = Date.now();

  if (cache.size >= TOOL_CACHE_CONFIG.maxEntries) {
    evictOldest();
  }

  const entry: CacheEntry<T> = {
    value,
    expiresAt: now + ttlMs,
    toolName,
    createdAt: now,
  };

  cache.set(key, entry as CacheEntry);
  return true;
}

function has(key: string): boolean {
  if (!TOOL_CACHE_CONFIG.enabled) return false;

  const entry = cache.get(key);
  if (!entry) return false;

  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    stats.evictions++;
    return false;
  }

  return true;
}

function del(key: string): boolean {
  const deleted = cache.delete(key);
  if (deleted) {
    stats.invalidations++;
  }
  return deleted;
}

function getToolGeneration(toolName: string): number {
  return toolGenerations.get(toolName) ?? 0;
}

function bumpToolGeneration(toolName: string): void {
  toolGenerations.set(toolName, getToolGeneration(toolName) + 1);
  enforceAuxCacheBound(toolGenerations);
}

function removeInFlightWhere(predicate: (entry: InFlightEntry) => boolean): number {
  let removed = 0;

  for (const [key, entry] of inFlight.entries()) {
    if (predicate(entry)) {
      inFlight.delete(key);
      removed++;
    }
  }

  if (removed > 0) {
    stats.invalidations += removed;
  }

  return removed;
}

function matchesTool(regex: RegExp, toolName: string): boolean {
  regex.lastIndex = 0;
  return regex.test(toolName);
}

/* ───────────────────────────────────────────────────────────────
   6. CACHE INVALIDATION
──────────────────────────────────────────────────────────────── */

function invalidateByTool(toolName: string): number {
  const keysToDelete: string[] = [];

  for (const [key, entry] of cache.entries()) {
    if (entry.toolName === toolName) {
      keysToDelete.push(key);
    }
  }

  for (const key of keysToDelete) {
    cache.delete(key);
    stats.invalidations++;
  }

  bumpToolGeneration(toolName);
  removeInFlightWhere((entry) => entry.toolName === toolName);

  return keysToDelete.length;
}

function invalidateByPattern(pattern: RegExp | string): number {
  let regex: RegExp;
  try {
    regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;
  } catch (error: unknown) {
    console.warn(`[tool-cache] Invalid regex pattern: ${error instanceof Error ? error.message : String(error)}`);
    return 0;
  }
  const keysToDelete: string[] = [];
  const affectedTools = new Set<string>();

  for (const [key, entry] of cache.entries()) {
    if (matchesTool(regex, entry.toolName)) {
      keysToDelete.push(key);
      affectedTools.add(entry.toolName);
    }
  }

  for (const entry of inFlight.values()) {
    if (matchesTool(regex, entry.toolName)) {
      affectedTools.add(entry.toolName);
    }
  }

  for (const key of keysToDelete) {
    cache.delete(key);
    stats.invalidations++;
  }

  for (const toolName of affectedTools) {
    bumpToolGeneration(toolName);
  }
  removeInFlightWhere((entry) => affectedTools.has(entry.toolName));

  return keysToDelete.length;
}

function clear(): number {
  const count = cache.size;
  const inFlightCount = inFlight.size;
  cache.clear();
  inFlight.clear();
  toolGenerations.clear();
  cacheGeneration++;
  stats.invalidations += count + inFlightCount;
  return count;
}

function invalidateOnWrite(operation: string, _context: Record<string, unknown> = {}): number {
  const affectedTools = [
    'memory_search',
    'memory_match_triggers',
    'memory_context',
    'memory_list',
    'memory_list_folders',
    'memory_read',
  ];

  let totalInvalidated = 0;

  for (const tool of affectedTools) {
    totalInvalidated += invalidateByTool(tool);
  }

  if (totalInvalidated > 0) {
    console.error(`[tool-cache] Invalidated ${totalInvalidated} entries after ${operation}`);
  }

  return totalInvalidated;
}

/* ───────────────────────────────────────────────────────────────
   7. EVICTION & CLEANUP
──────────────────────────────────────────────────────────────── */

// Maps maintain insertion order; the first key is always the oldest
// Entry. This replaces an O(n) full-scan with O(1) eviction.
function evictOldest(): void {
  const oldestKey = cache.keys().next().value;
  if (oldestKey !== undefined) {
    cache.delete(oldestKey);
    stats.evictions++;
  }
}

function cleanupExpired(): number {
  const now = Date.now();
  const keysToDelete: string[] = [];

  for (const [key, entry] of cache.entries()) {
    if (now > entry.expiresAt) {
      keysToDelete.push(key);
    }
  }

  for (const key of keysToDelete) {
    cache.delete(key);
    stats.evictions++;
  }

  return keysToDelete.length;
}

function startCleanupInterval(): void {
  if (cleanupInterval) return;

  cleanupInterval = setInterval(() => {
    cleanupExpired();
  }, TOOL_CACHE_CONFIG.cleanupIntervalMs);

  if (cleanupInterval.unref) {
    cleanupInterval.unref();
  }
}

function stopCleanupInterval(): void {
  if (cleanupInterval) {
    clearInterval(cleanupInterval);
    cleanupInterval = null;
  }
}

/* ───────────────────────────────────────────────────────────────
   8. HIGH-LEVEL WRAPPER
──────────────────────────────────────────────────────────────── */

async function withCache<T>(
  tool_name: string,
  args: unknown,
  fn: () => Promise<T>,
  options: WithCacheOptions = {}
): Promise<T> {
  const { bypassCache = false, ttlMs } = options;

  if (!TOOL_CACHE_CONFIG.enabled || bypassCache) {
    return await fn();
  }

  const key = generateCacheKey(tool_name, args);
  const generationAtStart = cacheGeneration;
  const toolGenerationAtStart = getToolGeneration(tool_name);

  // Use get() directly to avoid TOCTOU race between has() and get()
  const cached = get<T>(key);
  if (cached !== null) {
    return cached;
  }

  const existing = inFlight.get(key);
  if (
    existing
    && existing.toolName === tool_name
    && existing.cacheGeneration === generationAtStart
    && existing.toolGeneration === toolGenerationAtStart
  ) {
    return await existing.promise as T;
  }
  if (existing) {
    inFlight.delete(key);
  }

  const pendingEntry = {
    promise: undefined as unknown as Promise<T>,
    toolName: tool_name,
    cacheGeneration: generationAtStart,
    toolGeneration: toolGenerationAtStart,
  };

  const pending = (async () => {
    const result = await fn();
    if (
      generationAtStart === cacheGeneration
      && toolGenerationAtStart === getToolGeneration(tool_name)
      && inFlight.get(key) === pendingEntry
    ) {
      set(key, result, { toolName: tool_name, ttlMs });
    }
    return result;
  })();

  pendingEntry.promise = pending;
  inFlight.set(key, pendingEntry);
  enforceAuxCacheBound(inFlight);
  try {
    return await pending;
  } finally {
    if (inFlight.get(key) === pendingEntry) {
      inFlight.delete(key);
    }
  }

}

/* ───────────────────────────────────────────────────────────────
   9. STATISTICS & MONITORING
──────────────────────────────────────────────────────────────── */

function getStats(): CacheStats {
  const totalRequests = stats.hits + stats.misses;
  const hitRate = totalRequests > 0 ? (stats.hits / totalRequests) * 100 : 0;

  return {
    hits: stats.hits,
    misses: stats.misses,
    evictions: stats.evictions,
    invalidations: stats.invalidations,
    hitRate: hitRate.toFixed(2) + '%',
    currentSize: cache.size,
    maxSize: TOOL_CACHE_CONFIG.maxEntries,
  };
}

function resetStats(): void {
  stats.hits = 0;
  stats.misses = 0;
  stats.evictions = 0;
  stats.invalidations = 0;
}

function getConfig(): ToolCacheConfig {
  return { ...TOOL_CACHE_CONFIG };
}

function isEnabled(): boolean {
  return TOOL_CACHE_CONFIG.enabled;
}

/* ───────────────────────────────────────────────────────────────
   10. INITIALIZATION
──────────────────────────────────────────────────────────────── */

function init(): void {
  startCleanupInterval();
  console.error(`[tool-cache] Initialized with ${TOOL_CACHE_CONFIG.defaultTtlMs}ms TTL, max ${TOOL_CACHE_CONFIG.maxEntries} entries`);
}

function shutdown(): void {
  stopCleanupInterval();
  clear();
  resetStats();
  console.error('[tool-cache] Shutdown complete');
}

// Auto-initialize on module load
if (TOOL_CACHE_CONFIG.enabled) {
  startCleanupInterval();
}

/* ───────────────────────────────────────────────────────────────
   11. EXPORTS
──────────────────────────────────────────────────────────────── */

export {
  get,
  set,
  has,
  del,
  generateCacheKey,
  invalidateByTool,
  invalidateByPattern,
  invalidateOnWrite,
  clear,
  withCache,
  evictOldest,
  cleanupExpired,
  startCleanupInterval,
  stopCleanupInterval,
  getStats,
  resetStats,
  getConfig,
  isEnabled,
  init,
  shutdown,
  TOOL_CACHE_CONFIG as CONFIG,
};
