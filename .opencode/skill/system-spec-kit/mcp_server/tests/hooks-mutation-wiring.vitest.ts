// TEST: Hooks Mutation Wiring
import fs from 'fs';
import path from 'path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { MutationHookResult } from '../handlers/mutation-hooks';

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

const MUTATION_OPERATIONS = ['save', 'update', 'delete', 'bulk-delete', 'atomic-save'] as const;

function assertMutationHookResultShape(result: MutationHookResult): void {
  expect(typeof result.latencyMs).toBe('number');
  expect(result.latencyMs).toBeGreaterThanOrEqual(0);
  expect(typeof result.triggerCacheCleared).toBe('boolean');
  expect(typeof result.constitutionalCacheCleared).toBe('boolean');
  expect(typeof result.graphSignalsCacheCleared).toBe('boolean');
  expect(typeof result.coactivationCacheCleared).toBe('boolean');
  expect(typeof result.toolCacheInvalidated).toBe('number');
  expect(Array.isArray(result.errors)).toBe(true);
}

describe('Hooks mutation wiring', () => {
  beforeEach(() => {
    mockClearCache.mockReset().mockReturnValue(undefined);
    mockInvalidateOnWrite.mockReset().mockReturnValue(2);
    mockClearConstitutionalCache.mockReset().mockReturnValue(undefined);
    mockClearGraphSignalsCache.mockReset().mockReturnValue(undefined);
    mockClearDegreeCache.mockReset().mockReturnValue(undefined);
    mockClearRelatedCache.mockReset().mockReturnValue(undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('runs post-mutation hooks for save/update/delete/bulk-delete/atomic-save with full MutationHookResult contract', () => {
    for (const operation of MUTATION_OPERATIONS) {
      const context = { operation };
      const result = runPostMutationHooks(operation, context);
      assertMutationHookResultShape(result);
    }

    expect(mockClearCache).toHaveBeenCalledTimes(MUTATION_OPERATIONS.length);
    expect(mockInvalidateOnWrite).toHaveBeenCalledTimes(MUTATION_OPERATIONS.length);
    expect(mockClearConstitutionalCache).toHaveBeenCalledTimes(MUTATION_OPERATIONS.length);
    expect(mockClearGraphSignalsCache).toHaveBeenCalledTimes(MUTATION_OPERATIONS.length);
    expect(mockClearDegreeCache).toHaveBeenCalledTimes(MUTATION_OPERATIONS.length);
    expect(mockClearRelatedCache).toHaveBeenCalledTimes(MUTATION_OPERATIONS.length);

    MUTATION_OPERATIONS.forEach((operation, index) => {
      expect(mockInvalidateOnWrite).toHaveBeenNthCalledWith(index + 1, operation, { operation });
    });
  });

  it('captures thrown hook error details in errors and marks the failing hook status false', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    mockClearRelatedCache.mockImplementationOnce(() => {
      throw new Error('coactivation hook blew up');
    });

    const result = runPostMutationHooks('delete', { memoryId: 10 });

    assertMutationHookResultShape(result);
    expect(result.coactivationCacheCleared).toBe(false);
    expect(result.errors).toEqual(
      expect.arrayContaining([expect.stringContaining('coactivation hook blew up')])
    );
    expect(warnSpy).toHaveBeenCalledWith(
      '[mutation-hooks] clearRelatedCache failed for operation="delete":',
      'coactivation hook blew up'
    );
  });

  it('keeps hooks README documented exports aligned with explicit hooks barrel exports', () => {
    const hooksIndexPath = path.join(__dirname, '..', 'hooks', 'index.ts');
    const hooksReadmePath = path.join(__dirname, '..', 'hooks', 'README.md');
    const indexSource = fs.readFileSync(hooksIndexPath, 'utf8');
    const readmeSource = fs.readFileSync(hooksReadmePath, 'utf8');

    expect(indexSource).not.toMatch(/export\s+\*\s+from\s+['"][^'"]+['"]/);

    const exportSectionMatch = readmeSource.match(
      /Main exports \(camelCase\):([\s\S]*?)\n\s*Data shape:/
    );
    expect(exportSectionMatch).not.toBeNull();
    const exportsSection = exportSectionMatch?.[1] ?? '';
    const documentedExports = Array.from(
      exportsSection.matchAll(/-\s+`([A-Za-z0-9_]+)/g),
      ([, exportedName]) => exportedName
    );

    expect(documentedExports.length).toBeGreaterThan(0);

    const explicitExports = Array.from(
      indexSource.matchAll(/export\s*\{([^}]+)\}\s*from\s*['"][^'"]+['"]/g)
    ).flatMap(([, groupedNames]) =>
      groupedNames
        .split(',')
        .map((name) => name.trim())
        .filter((name) => name.length > 0)
    );

    const explicitExportSet = new Set(explicitExports);
    for (const exportedName of documentedExports) {
      expect(explicitExportSet.has(exportedName)).toBe(true);
    }
  });
});
