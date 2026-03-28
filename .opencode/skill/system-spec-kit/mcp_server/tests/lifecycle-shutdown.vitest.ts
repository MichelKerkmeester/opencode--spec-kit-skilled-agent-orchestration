import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { runCleanupStep, runAsyncCleanupStep } from '../lib/utils/cleanup-helpers';
import {
  cleanupExpired,
  generateCacheKey,
  get,
  getStats,
  resetStats,
  set,
  shutdown,
  clear,
} from '../lib/cache/tool-cache';

describe('lifecycle shutdown coverage', () => {
  beforeEach(() => {
    clear();
    resetStats();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    clear();
    resetStats();
    vi.restoreAllMocks();
  });

  it('runCleanupStep catches errors and continues', () => {
    const error = new Error('cleanup blew up');
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      runCleanupStep('test-step', () => {
        throw error;
      });
    }).not.toThrow();

    expect(errorSpy).toHaveBeenCalledWith('[context-server] test-step cleanup failed:', error.message);
  });

  it('runAsyncCleanupStep catches async errors', async () => {
    const error = new Error('async cleanup blew up');
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    await expect(
      runAsyncCleanupStep('async-step', async () => {
        throw error;
      })
    ).resolves.toBeUndefined();

    expect(errorSpy).toHaveBeenCalledWith('[context-server] async-step cleanup failed:', error.message);
  });

  it('tool-cache cleanupExpired evicts entries past TTL', async () => {
    const expiredKey = generateCacheKey('test_tool', { id: 'expired' });
    const liveKey = generateCacheKey('test_tool', { id: 'live' });

    set(expiredKey, { value: 'old' }, { toolName: 'test_tool', ttlMs: 5 });
    set(liveKey, { value: 'fresh' }, { toolName: 'test_tool', ttlMs: 1000 });

    await new Promise<void>((resolve) => setTimeout(resolve, 20));

    expect(cleanupExpired()).toBe(1);
    expect(get(expiredKey)).toBe(null);
    expect(get(liveKey)).toEqual({ value: 'fresh' });
    expect(getStats().currentSize).toBe(1);
  });

  it('tool-cache shutdown clears all state', () => {
    const firstKey = generateCacheKey('test_tool', { id: 1 });
    const secondKey = generateCacheKey('test_tool', { id: 2 });
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    set(firstKey, { value: 'one' }, { toolName: 'test_tool' });
    set(secondKey, { value: 'two' }, { toolName: 'test_tool' });

    expect(getStats().currentSize).toBe(2);

    shutdown();

    expect(get(firstKey)).toBe(null);
    expect(get(secondKey)).toBe(null);
    expect(getStats().currentSize).toBe(0);
    expect(errorSpy).toHaveBeenCalledWith('[tool-cache] Shutdown complete');
  });
});
