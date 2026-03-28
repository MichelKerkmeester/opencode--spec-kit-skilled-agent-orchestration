// TEST: Mutation Hooks
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const {
  mockClearCache,
  mockInvalidateOnWrite,
  mockClearConstitutionalCache,
  mockClearGraphSignalsCache,
  mockClearDegreeCache,
  mockClearRelatedCache,
} = vi.hoisted(() => ({
  mockClearCache: vi.fn(),
  mockInvalidateOnWrite: vi.fn(),
  mockClearConstitutionalCache: vi.fn(),
  mockClearGraphSignalsCache: vi.fn(),
  mockClearDegreeCache: vi.fn(),
  mockClearRelatedCache: vi.fn(),
}));

vi.mock('../lib/parsing/trigger-matcher', () => ({
  clearCache: mockClearCache,
}));

vi.mock('../lib/cache/tool-cache', () => ({
  invalidateOnWrite: mockInvalidateOnWrite,
}));

vi.mock('../hooks/memory-surface', () => ({
  clearConstitutionalCache: mockClearConstitutionalCache,
}));

vi.mock('../lib/graph/graph-signals', () => ({
  clearGraphSignalsCache: mockClearGraphSignalsCache,
}));

vi.mock('../lib/search/graph-search-fn', () => ({
  clearDegreeCache: mockClearDegreeCache,
}));

vi.mock('../lib/cognitive/co-activation', () => ({
  clearRelatedCache: mockClearRelatedCache,
}));

import { runPostMutationHooks } from '../handlers/mutation-hooks';

describe('Mutation hooks', () => {
  beforeEach(() => {
    mockClearCache.mockReset().mockReturnValue(undefined);
    mockInvalidateOnWrite.mockReset().mockReturnValue(3);
    mockClearConstitutionalCache.mockReset().mockReturnValue(undefined);
    mockClearGraphSignalsCache.mockReset().mockReturnValue(undefined);
    mockClearDegreeCache.mockReset().mockReturnValue(undefined);
    mockClearRelatedCache.mockReset().mockReturnValue(undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns success status flags when all hooks succeed', () => {
    const result = runPostMutationHooks('save', { memoryId: 42 });

    expect(result.latencyMs).toBeGreaterThanOrEqual(0);
    expect(result.triggerCacheCleared).toBe(true);
    expect(result.toolCacheInvalidated).toBe(3);
    expect(result.constitutionalCacheCleared).toBe(true);
    expect(result.graphSignalsCacheCleared).toBe(true);
    expect(result.coactivationCacheCleared).toBe(true);
    expect(result.errors).toEqual([]);

    expect(mockClearCache).toHaveBeenCalledTimes(1);
    expect(mockInvalidateOnWrite).toHaveBeenCalledWith('save', { memoryId: 42 });
    expect(mockClearConstitutionalCache).toHaveBeenCalledTimes(1);
    expect(mockClearGraphSignalsCache).toHaveBeenCalledTimes(1);
    expect(mockClearDegreeCache).toHaveBeenCalledTimes(1);
    expect(mockClearRelatedCache).toHaveBeenCalledTimes(1);
  });

  it('continues running remaining hooks when one hook fails', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    mockClearCache.mockImplementationOnce(() => {
      throw new Error('trigger cache failure');
    });
    mockInvalidateOnWrite.mockReturnValue(1);

    const result = runPostMutationHooks('update', { memoryId: 7 });

    expect(result.triggerCacheCleared).toBe(false);
    expect(result.toolCacheInvalidated).toBe(1);
    expect(result.constitutionalCacheCleared).toBe(true);
    expect(result.graphSignalsCacheCleared).toBe(true);
    expect(result.coactivationCacheCleared).toBe(true);
    expect(result.errors).toEqual(['triggerMatcher.clearCache: trigger cache failure']);

    expect(warnSpy).toHaveBeenCalledWith(
      '[mutation-hooks] triggerMatcher.clearCache failed for operation="update":',
      'trigger cache failure'
    );

    expect(mockInvalidateOnWrite).toHaveBeenCalledTimes(1);
    expect(mockClearConstitutionalCache).toHaveBeenCalledTimes(1);
    expect(mockClearGraphSignalsCache).toHaveBeenCalledTimes(1);
    expect(mockClearDegreeCache).toHaveBeenCalledTimes(1);
    expect(mockClearRelatedCache).toHaveBeenCalledTimes(1);
  });

  it('reports graph cache invalidation failures when degree cache clearing throws', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    mockClearDegreeCache.mockImplementationOnce(() => {
      throw new Error('degree cache failure');
    });

    const result = runPostMutationHooks('delete', { memoryId: 99 });

    expect(result.graphSignalsCacheCleared).toBe(false);
    expect(result.errors).toContain('graphCacheInvalidation: degree cache failure');
    expect(warnSpy).toHaveBeenCalledWith(
      '[mutation-hooks] graph cache invalidation failed for operation="delete":',
      'degree cache failure'
    );
  });
});
