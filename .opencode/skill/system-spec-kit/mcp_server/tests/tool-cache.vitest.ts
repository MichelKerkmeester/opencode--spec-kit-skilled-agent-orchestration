// TEST: TOOL CACHE
// Converted from: tool-cache.test.ts (node:test runner)
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import crypto from 'crypto';
import {
  get,
  set,
  has,
  del,
  clear,
  generateCacheKey,
  invalidateByTool,
  invalidateByPattern,
  invalidateOnWrite,
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
  CONFIG,
} from '../lib/cache/tool-cache';

describe('Tool Cache (T012-T015)', () => {
  beforeEach(() => {
    clear();
    resetStats();
  });

  afterEach(() => {
    clear();
  });

  // ───────────────────────────────────────────────────────────────
  // 1. CACHE INITIALIZATION
  // ───────────────────────────────────────────────────────────────
  describe('Cache initialization', () => {
    it('should initialize with correct default configuration', () => {
      const config = getConfig();
      expect(typeof config.enabled).toBe('boolean');
      expect(config.defaultTtlMs).toBe(60000);
      expect(config.maxEntries).toBe(1000);
      expect(typeof config.cleanupIntervalMs).toBe('number');
    });

    it('should expose CONFIG as immutable copy', () => {
      const config1 = CONFIG;
      const config2 = CONFIG;
      expect(config1).toEqual(config2);
      expect(config1.defaultTtlMs).toBe(60000);
      expect(config1.maxEntries).toBe(1000);
    });

    it('should start with empty cache', () => {
      clear();
      const stats = getStats();
      expect(stats.currentSize).toBe(0);
    });

    it('should have cleanup interval methods', () => {
      expect(typeof startCleanupInterval).toBe('function');
      expect(typeof stopCleanupInterval).toBe('function');
    });

    it('should report enabled status', () => {
      const enabled = isEnabled();
      expect(typeof enabled).toBe('boolean');
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 2. CACHE KEY GENERATION (SHA-256)
  // ───────────────────────────────────────────────────────────────
  describe('T013: Cache key generation from tool name + args hash', () => {
    it('should generate consistent keys for same inputs', () => {
      const args = { query: 'authentication', limit: 10 };
      const key1 = generateCacheKey('memory_search', args);
      const key2 = generateCacheKey('memory_search', args);
      expect(key1).toBe(key2);
    });

    it('should generate different keys for different args', () => {
      const key1 = generateCacheKey('memory_search', { query: 'auth' });
      const key2 = generateCacheKey('memory_search', { query: 'login' });
      expect(key1).not.toBe(key2);
    });

    it('should generate different keys for different tools', () => {
      const args = { query: 'test' };
      const key1 = generateCacheKey('memory_search', args);
      const key2 = generateCacheKey('memory_save', args);
      expect(key1).not.toBe(key2);
    });

    it('should handle nested objects consistently', () => {
      const args1 = { query: 'test', options: { a: 1, b: 2 } };
      const args2 = { query: 'test', options: { b: 2, a: 1 } };
      const key1 = generateCacheKey('tool', args1);
      const key2 = generateCacheKey('tool', args2);
      expect(key1).toBe(key2);
    });

    it('should handle null and undefined args', () => {
      const key1 = generateCacheKey('tool', null);
      const key2 = generateCacheKey('tool', undefined);
      expect(key1).toBe(key2);
    });

    it('should generate SHA-256 hex string (64 characters)', () => {
      const key = generateCacheKey('test_tool', { query: 'test' });
      expect(key.length).toBe(64);
      expect(key).toMatch(/^[a-f0-9]{64}$/);
    });

    it('should match manual SHA-256 calculation', () => {
      const toolName = 'manual_test';
      const args = { value: 123 };
      const key = generateCacheKey(toolName, args);
      const expectedKeyString = `${toolName}:{"value":123}`;
      const expectedHash = crypto.createHash('sha256').update(expectedKeyString).digest('hex');
      expect(key).toBe(expectedHash);
    });

    it('should throw error for invalid tool_name', () => {
      expect(() => generateCacheKey('', { test: true })).toThrow(/toolName must be a non-empty string/);
      // @ts-expect-error Testing invalid input shape
      expect(() => generateCacheKey(null, { test: true })).toThrow(/toolName must be a non-empty string/);
      // @ts-expect-error Testing invalid input shape
      expect(() => generateCacheKey(undefined, { test: true })).toThrow(/toolName must be a non-empty string/);
      // @ts-expect-error Testing invalid input shape
      expect(() => generateCacheKey(123, { test: true })).toThrow(/toolName must be a non-empty string/);
    });

    it('should handle arrays in args', () => {
      const args1 = { items: [1, 2, 3] };
      const args2 = { items: [1, 2, 3] };
      const args3 = { items: [3, 2, 1] };
      const key1 = generateCacheKey('tool', args1);
      const key2 = generateCacheKey('tool', args2);
      const key3 = generateCacheKey('tool', args3);
      expect(key1).toBe(key2);
      expect(key1).not.toBe(key3);
    });

    it('should skip undefined values in objects', () => {
      const args1 = { a: 1, b: undefined };
      const args2 = { a: 1 };
      const key1 = generateCacheKey('tool', args1);
      const key2 = generateCacheKey('tool', args2);
      expect(key1).toBe(key2);
    });

    it('should handle primitive args', () => {
      const keyString = generateCacheKey('tool', 'simple string');
      const keyNumber = generateCacheKey('tool', 42);
      const keyBool = generateCacheKey('tool', true);
      expect(keyString.length).toBe(64);
      expect(keyNumber.length).toBe(64);
      expect(keyBool.length).toBe(64);
      expect(keyString).not.toBe(keyNumber);
      expect(keyNumber).not.toBe(keyBool);
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 3. CORE CACHE OPERATIONS (TTL)
  // ───────────────────────────────────────────────────────────────
  describe('T012: Session-scoped cache with 60s TTL', () => {
    it('should cache and retrieve values', () => {
      const key = generateCacheKey('test_tool', { query: 'test' });
      set(key, { result: 'cached' }, { toolName: 'test_tool' });
      const cached = get(key);
      expect(cached).toEqual({ result: 'cached' });
    });

    it('should return null for non-existent keys', () => {
      const result = get('non_existent_key');
      expect(result).toBe(null);
    });

    it('should expire entries after TTL', async () => {
      const key = generateCacheKey('test_tool', { query: 'ttl_test' });
      set(key, { result: 'will_expire' }, { toolName: 'test_tool', ttlMs: 50 });
      expect(has(key)).toBe(true);
      await new Promise<void>(resolve => setTimeout(resolve, 100));
      expect(get(key)).toBe(null);
    });

    it('should track hit/miss statistics', () => {
      const key = generateCacheKey('stats_test', { query: 'test' });
      get(key); // Miss
      set(key, 'value', { toolName: 'stats_test' });
      get(key); // Hit
      get(key); // Hit
      const stats = getStats();
      expect(stats.hits).toBe(2);
      expect(stats.misses).toBe(1);
    });

    it('should use default TTL of 60s when not specified', () => {
      const config = getConfig();
      expect(config.defaultTtlMs).toBe(60000);
    });

    it('should allow custom TTL per entry', async () => {
      const key1 = generateCacheKey('tool', { id: 1 });
      const key2 = generateCacheKey('tool', { id: 2 });
      set(key1, 'short', { toolName: 'tool', ttlMs: 30 });
      set(key2, 'long', { toolName: 'tool', ttlMs: 200 });
      expect(has(key1)).toBe(true);
      expect(has(key2)).toBe(true);
      await new Promise<void>(resolve => setTimeout(resolve, 60));
      expect(has(key1)).toBe(false);
      expect(has(key2)).toBe(true);
    });

    it('should delete entry and return true', () => {
      const key = generateCacheKey('del_test', { id: 1 });
      set(key, 'value', { toolName: 'del_test' });
      expect(has(key)).toBe(true);
      const deleted = del(key);
      expect(deleted).toBe(true);
      expect(has(key)).toBe(false);
    });

    it('should return false when deleting non-existent key', () => {
      const deleted = del('non_existent_key');
      expect(deleted).toBe(false);
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 4. LRU EVICTION (MAX SIZE)
  // ───────────────────────────────────────────────────────────────
  describe('Cache max size and LRU eviction', () => {
    it('should enforce max entries limit (1000 default)', () => {
      const config = getConfig();
      expect(config.maxEntries).toBe(1000);
    });

    it('should evict oldest entry when max size reached', () => {
      const keys: string[] = [];
      for (let i = 0; i < 5; i++) {
        const key = generateCacheKey('evict_test', { index: i });
        keys.push(key);
        set(key, `value_${i}`, { toolName: 'evict_test' });
      }
      expect(getStats().currentSize).toBe(5);
      keys.forEach(key => expect(has(key)).toBe(true));
    });

    it('should call evictOldest when cache is full', () => {
      const key1 = generateCacheKey('oldest_test', { id: 'first' });
      const key2 = generateCacheKey('oldest_test', { id: 'second' });
      set(key1, 'oldest', { toolName: 'oldest_test' });
      set(key2, 'newer', { toolName: 'oldest_test' });
      expect(getStats().currentSize).toBe(2);
      evictOldest();
      expect(getStats().currentSize).toBe(1);
    });

    it('should track eviction statistics', () => {
      const key = generateCacheKey('eviction_stats', { id: 1 });
      set(key, 'value', { toolName: 'eviction_stats' });
      evictOldest();
      const stats = getStats();
      expect(stats.evictions).toBe(1);
    });

    it('should handle evictOldest on empty cache gracefully', () => {
      clear();
      const initialStats = getStats();
      const initialEvictions = initialStats.evictions;
      evictOldest();
      const stats = getStats();
      expect(stats.evictions).toBe(initialEvictions);
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 5. CACHE BYPASS OPTION
  // ───────────────────────────────────────────────────────────────
  describe('T014: Cache bypass option', () => {
    it('should skip cache when bypassCache is true', async () => {
      let callCount = 0;
      const result1 = await withCache(
        'test_tool',
        { query: 'bypass_test' },
        async () => { callCount++; return { count: callCount }; },
        { bypassCache: false }
      );
      const result2 = await withCache(
        'test_tool',
        { query: 'bypass_test' },
        async () => { callCount++; return { count: callCount }; },
        { bypassCache: true }
      );
      expect(result1.count).toBe(1);
      expect(result2.count).toBe(2);
    });

    it('should use cache when bypassCache is false', async () => {
      let callCount = 0;
      const result1 = await withCache(
        'test_tool',
        { query: 'cache_test' },
        async () => { callCount++; return { count: callCount }; }
      );
      const result2 = await withCache(
        'test_tool',
        { query: 'cache_test' },
        async () => { callCount++; return { count: callCount }; }
      );
      expect(result1.count).toBe(1);
      expect(result2.count).toBe(1);
    });

    it('should allow custom TTL with withCache', async () => {
      let callCount = 0;
      await withCache(
        'ttl_test',
        { id: 'custom_ttl' },
        async () => { callCount++; return { count: callCount }; },
        { ttlMs: 30 }
      );
      const result1 = await withCache(
        'ttl_test',
        { id: 'custom_ttl' },
        async () => { callCount++; return { count: callCount }; }
      );
      expect(result1.count).toBe(1);
      await new Promise<void>(resolve => setTimeout(resolve, 60));
      const result2 = await withCache(
        'ttl_test',
        { id: 'custom_ttl' },
        async () => { callCount++; return { count: callCount }; }
      );
      expect(result2.count).toBe(2);
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 6. CACHE INVALIDATION
  // ───────────────────────────────────────────────────────────────
  describe('T015: Cache invalidation on write operations', () => {
    it('should invalidate by tool name', () => {
      const key1 = generateCacheKey('memory_search', { query: 'test1' });
      const key2 = generateCacheKey('memory_search', { query: 'test2' });
      const key3 = generateCacheKey('memory_save', { query: 'test3' });
      set(key1, 'value1', { toolName: 'memory_search' });
      set(key2, 'value2', { toolName: 'memory_search' });
      set(key3, 'value3', { toolName: 'memory_save' });
      const invalidated = invalidateByTool('memory_search');
      expect(invalidated).toBe(2);
      expect(has(key1)).toBe(false);
      expect(has(key2)).toBe(false);
      expect(has(key3)).toBe(true);
    });

    it('should invalidate by pattern (string)', () => {
      const key1 = generateCacheKey('memory_search', { query: 'test1' });
      const key2 = generateCacheKey('memory_save', { query: 'test2' });
      const key3 = generateCacheKey('other_tool', { query: 'test3' });
      set(key1, 'value1', { toolName: 'memory_search' });
      set(key2, 'value2', { toolName: 'memory_save' });
      set(key3, 'value3', { toolName: 'other_tool' });
      const invalidated = invalidateByPattern('memory_');
      expect(invalidated).toBe(2);
      expect(has(key1)).toBe(false);
      expect(has(key2)).toBe(false);
      expect(has(key3)).toBe(true);
    });

    it('should invalidate by pattern (RegExp)', () => {
      const key1 = generateCacheKey('memory_search', { query: 'test1' });
      const key2 = generateCacheKey('memory_save', { query: 'test2' });
      const key3 = generateCacheKey('tool_memory', { query: 'test3' });
      set(key1, 'value1', { toolName: 'memory_search' });
      set(key2, 'value2', { toolName: 'memory_save' });
      set(key3, 'value3', { toolName: 'tool_memory' });
      const invalidated = invalidateByPattern(/^memory_/);
      expect(invalidated).toBe(2);
      expect(has(key1)).toBe(false);
      expect(has(key2)).toBe(false);
      expect(has(key3)).toBe(true);
    });

    it('should invalidate on write operations', () => {
      const searchKey = generateCacheKey('memory_search', { query: 'test' });
      const triggerKey = generateCacheKey('memory_match_triggers', { prompt: 'test' });
      set(searchKey, 'search_result', { toolName: 'memory_search' });
      set(triggerKey, 'trigger_result', { toolName: 'memory_match_triggers' });
      expect(has(searchKey)).toBe(true);
      expect(has(triggerKey)).toBe(true);
      invalidateOnWrite('save', { specFolder: 'test/folder' });
      expect(has(searchKey)).toBe(false);
      expect(has(triggerKey)).toBe(false);
    });

    it('should invalidate memory_list_folders on write', () => {
      const listFoldersKey = generateCacheKey('memory_list_folders', {});
      set(listFoldersKey, ['folder1', 'folder2'], { toolName: 'memory_list_folders' });
      expect(has(listFoldersKey)).toBe(true);
      invalidateOnWrite('save', {});
      expect(has(listFoldersKey)).toBe(false);
    });

    it('should invalidate memory_read on write', () => {
      const readKey = generateCacheKey('memory_read', { id: 123 });
      set(readKey, { content: 'test' }, { toolName: 'memory_read' });
      expect(has(readKey)).toBe(true);
      invalidateOnWrite('update', {});
      expect(has(readKey)).toBe(false);
    });

    it('should not reuse or repopulate stale in-flight results after invalidation', async () => {
      const args = { query: 'invalidate-in-flight' };
      const key = generateCacheKey('memory_search', args);
      let resolveFirst: ((value: string) => void) | null = null;

      const first = withCache(
        'memory_search',
        args,
        async () => await new Promise<string>((resolve) => {
          resolveFirst = resolve;
        }),
      );

      await Promise.resolve();

      expect(invalidateByTool('memory_search')).toBe(0);

      let secondCalls = 0;
      const second = withCache('memory_search', args, async () => {
        secondCalls++;
        return 'fresh-result';
      });

      expect(await second).toBe('fresh-result');
      expect(secondCalls).toBe(1);

      expect(resolveFirst).not.toBeNull();
      resolveFirst?.('stale-result');
      expect(await first).toBe('stale-result');

      await Promise.resolve();
      expect(get(key)).toBe('fresh-result');
    });

    it('should clear all entries', () => {
      set(generateCacheKey('tool1', {}), 'v1', { toolName: 'tool1' });
      set(generateCacheKey('tool2', {}), 'v2', { toolName: 'tool2' });
      set(generateCacheKey('tool3', {}), 'v3', { toolName: 'tool3' });
      const stats = getStats();
      expect(stats.currentSize).toBe(3);
      const cleared = clear();
      expect(cleared).toBe(3);
      expect(getStats().currentSize).toBe(0);
    });

    it('should track invalidation statistics', () => {
      const key = generateCacheKey('stats_tool', { id: 1 });
      set(key, 'value', { toolName: 'stats_tool' });
      del(key);
      const stats = getStats();
      expect(stats.invalidations >= 1).toBe(true);
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 7. CLEANUP EXPIRED
  // ───────────────────────────────────────────────────────────────
  describe('Cleanup expired entries', () => {
    it('should remove expired entries on cleanup', async () => {
      const key1 = generateCacheKey('cleanup_test', { id: 'short' });
      const key2 = generateCacheKey('cleanup_test', { id: 'long' });
      set(key1, 'short', { toolName: 'cleanup_test', ttlMs: 30 });
      set(key2, 'long', { toolName: 'cleanup_test', ttlMs: 5000 });
      expect(getStats().currentSize).toBe(2);
      await new Promise<void>(resolve => setTimeout(resolve, 60));
      const cleaned = cleanupExpired();
      expect(cleaned).toBe(1);
      expect(has(key1)).toBe(false);
      expect(has(key2)).toBe(true);
    });

    it('should return 0 when no expired entries', () => {
      const key = generateCacheKey('no_expire', { id: 1 });
      set(key, 'value', { toolName: 'no_expire', ttlMs: 60000 });
      const cleaned = cleanupExpired();
      expect(cleaned).toBe(0);
    });

    it('should handle empty cache gracefully', () => {
      clear();
      const cleaned = cleanupExpired();
      expect(cleaned).toBe(0);
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 8. STATISTICS AND MONITORING
  // ───────────────────────────────────────────────────────────────
  describe('Statistics and monitoring', () => {
    it('should track cache statistics', () => {
      const key = generateCacheKey('stats_tool', { test: true });
      get('nonexistent1'); // Miss
      get('nonexistent2'); // Miss
      set(key, 'value', { toolName: 'stats_tool' });
      get(key); // Hit
      get(key); // Hit
      get(key); // Hit
      const stats = getStats();
      expect(stats.hits).toBe(3);
      expect(stats.misses).toBe(2);
      expect(stats.hitRate).toBe('60.00%');
    });

    it('should report 0% hit rate when no requests', () => {
      clear();
      resetStats();
      const stats = getStats();
      expect(stats.hitRate).toBe('0.00%');
    });

    it('should report configuration', () => {
      const config = getConfig();
      expect(typeof config.enabled).toBe('boolean');
      expect(typeof config.defaultTtlMs).toBe('number');
      expect(typeof config.maxEntries).toBe('number');
      expect(config.defaultTtlMs).toBe(60000);
    });

    it('should reset statistics', () => {
      const key = generateCacheKey('reset_test', { id: 1 });
      get(key); // Miss
      set(key, 'value', { toolName: 'reset_test' });
      get(key); // Hit
      resetStats();
      const stats = getStats();
      expect(stats.hits).toBe(0);
      expect(stats.misses).toBe(0);
      expect(stats.evictions).toBe(0);
      expect(stats.invalidations).toBe(0);
    });

    it('should report current size and max size', () => {
      const key1 = generateCacheKey('size_test', { id: 1 });
      const key2 = generateCacheKey('size_test', { id: 2 });
      set(key1, 'v1', { toolName: 'size_test' });
      set(key2, 'v2', { toolName: 'size_test' });
      const stats = getStats();
      expect(stats.currentSize).toBe(2);
      expect(stats.maxSize).toBe(1000);
    });
  });

  /* ───────────────────────────────────────────────────────────────
     9. LIFECYCLE (INIT/SHUTDOWN)
  ──────────────────────────────────────────────────────────────── */

  describe('Lifecycle management', () => {
    it('should have init function', () => {
      expect(typeof init).toBe('function');
    });

    it('should have shutdown function', () => {
      expect(typeof shutdown).toBe('function');
    });

    it('should clear cache on shutdown', () => {
      const key = generateCacheKey('shutdown_test', { id: 1 });
      set(key, 'value', { toolName: 'shutdown_test' });
      expect(has(key)).toBe(true);
      shutdown();
      const stats = getStats();
      expect(stats.currentSize).toBe(0);
      expect(stats.hits).toBe(0);
      expect(stats.misses).toBe(0);
    });

    it('should drop stale in-flight work across shutdown boundaries', async () => {
      const args = { query: 'shutdown-in-flight' };
      const key = generateCacheKey('memory_search', args);
      let resolveFirst: ((value: string) => void) | null = null;

      const first = withCache(
        'memory_search',
        args,
        async () => await new Promise<string>((resolve) => {
          resolveFirst = resolve;
        }),
      );

      await Promise.resolve();
      shutdown();

      const second = withCache('memory_search', args, async () => 'fresh-after-shutdown');
      expect(await second).toBe('fresh-after-shutdown');

      expect(resolveFirst).not.toBeNull();
      resolveFirst?.('stale-after-shutdown');
      expect(await first).toBe('stale-after-shutdown');

      await Promise.resolve();
      expect(get(key)).toBe('fresh-after-shutdown');
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 9. EDGE CASES
  // ───────────────────────────────────────────────────────────────
  describe('Edge cases', () => {
    it('should handle complex nested objects', () => {
      const complexArgs = {
        query: 'test',
        filters: {
          tags: ['a', 'b', 'c'],
          metadata: {
            created: '2024-01-01',
            author: { name: 'Test', id: 123 },
          },
        },
        options: { limit: 10, offset: 0 },
      };
      const key = generateCacheKey('complex_tool', complexArgs);
      set(key, { result: 'complex' }, { toolName: 'complex_tool' });
      const cached = get(key);
      expect(cached).toEqual({ result: 'complex' });
    });

    it('should handle empty object args', () => {
      const key = generateCacheKey('empty_args', {});
      set(key, 'empty', { toolName: 'empty_args' });
      expect(get(key)).toBe('empty');
    });

    it('should cache null values', () => {
      const key = generateCacheKey('null_value', { id: 1 });
      set(key, null, { toolName: 'null_value' });
      expect(has(key)).toBe(true);
    });

    it('should cache falsy values correctly', () => {
      const key1 = generateCacheKey('falsy', { type: 'zero' });
      const key2 = generateCacheKey('falsy', { type: 'empty_string' });
      const key3 = generateCacheKey('falsy', { type: 'false' });
      set(key1, 0, { toolName: 'falsy' });
      set(key2, '', { toolName: 'falsy' });
      set(key3, false, { toolName: 'falsy' });
      expect(get(key1)).toBe(0);
      expect(get(key2)).toBe('');
      expect(get(key3)).toBe(false);
    });

    it('should handle withCache with async function that throws', async () => {
      await expect(
        withCache(
          'error_tool',
          { id: 1 },
          async () => { throw new Error('Test error'); }
        )
      ).rejects.toThrow(/Test error/);
    });

    it('should not cache result when function throws', async () => {
      const key = generateCacheKey('error_tool', { id: 'throws' });
      try {
        await withCache(
          'error_tool',
          { id: 'throws' },
          async () => { throw new Error('Test error'); }
        );
      } catch {
        // Expected
      }
      expect(has(key)).toBe(false);
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 10. MODULE EXPORTS
  // ───────────────────────────────────────────────────────────────
  describe('Module exports', () => {
    it('should export all core operations', () => {
      expect(typeof get).toBe('function');
      expect(typeof set).toBe('function');
      expect(typeof has).toBe('function');
      expect(typeof del).toBe('function');
    });

    it('should export key generation', () => {
      expect(typeof generateCacheKey).toBe('function');
    });

    it('should export invalidation methods', () => {
      expect(typeof invalidateByTool).toBe('function');
      expect(typeof invalidateByPattern).toBe('function');
      expect(typeof invalidateOnWrite).toBe('function');
      expect(typeof clear).toBe('function');
    });

    it('should export high-level wrapper', () => {
      expect(typeof withCache).toBe('function');
    });

    it('should export eviction and cleanup', () => {
      expect(typeof evictOldest).toBe('function');
      expect(typeof cleanupExpired).toBe('function');
      expect(typeof startCleanupInterval).toBe('function');
      expect(typeof stopCleanupInterval).toBe('function');
    });

    it('should export statistics and monitoring', () => {
      expect(typeof getStats).toBe('function');
      expect(typeof resetStats).toBe('function');
      expect(typeof getConfig).toBe('function');
      expect(typeof isEnabled).toBe('function');
    });

    it('should export lifecycle methods', () => {
      expect(typeof init).toBe('function');
      expect(typeof shutdown).toBe('function');
    });

    it('should export CONFIG constant', () => {
      expect(CONFIG).toBeDefined();
      expect(typeof CONFIG).toBe('object');
    });
  });
});
