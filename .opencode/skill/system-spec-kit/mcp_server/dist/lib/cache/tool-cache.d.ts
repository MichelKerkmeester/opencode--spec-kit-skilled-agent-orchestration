interface ToolCacheConfig {
    enabled: boolean;
    defaultTtlMs: number;
    maxEntries: number;
    cleanupIntervalMs: number;
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
declare const TOOL_CACHE_CONFIG: ToolCacheConfig;
declare function generateCacheKey(toolName: string, args: unknown): string;
declare function get<T = unknown>(key: string): T | null;
declare function set<T = unknown>(key: string, value: T, options?: SetOptions): boolean;
declare function has(key: string): boolean;
declare function del(key: string): boolean;
declare function invalidateByTool(toolName: string): number;
declare function invalidateByPattern(pattern: RegExp | string): number;
declare function clear(): number;
declare function invalidateOnWrite(operation: string, _context?: Record<string, unknown>): number;
declare function evictOldest(): void;
declare function cleanupExpired(): number;
declare function startCleanupInterval(): void;
declare function stopCleanupInterval(): void;
declare function withCache<T>(tool_name: string, args: unknown, fn: () => Promise<T>, options?: WithCacheOptions): Promise<T>;
declare function getStats(): CacheStats;
declare function resetStats(): void;
declare function getConfig(): ToolCacheConfig;
declare function isEnabled(): boolean;
declare function init(): void;
declare function shutdown(): void;
export { get, set, has, del, generateCacheKey, invalidateByTool, invalidateByPattern, invalidateOnWrite, clear, withCache, evictOldest, cleanupExpired, startCleanupInterval, stopCleanupInterval, getStats, resetStats, getConfig, isEnabled, init, shutdown, TOOL_CACHE_CONFIG as CONFIG, };
//# sourceMappingURL=tool-cache.d.ts.map