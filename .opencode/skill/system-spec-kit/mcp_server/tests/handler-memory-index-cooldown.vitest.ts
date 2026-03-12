// ---------------------------------------------------------------
// MODULE: Handler Memory Index Cooldown Tests
// ---------------------------------------------------------------

import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  mockGetLastScanTime: vi.fn(),
  mockSetLastScanTime: vi.fn(),
  mockCheckDatabaseUpdated: vi.fn(),
  mockProcessBatches: vi.fn(),
  mockFindMemoryFiles: vi.fn((): string[] => []),
  mockRequireDb: vi.fn(() => ({
    prepare: vi.fn(() => ({
      all: vi.fn(() => []),
      get: vi.fn(() => undefined),
    })),
  })),
  mockCategorizeFilesForIndexing: vi.fn((files: string[]) => ({
    toIndex: files,
    toUpdate: [] as string[],
    toSkip: [] as string[],
    toDelete: [] as string[],
  })),
  mockBatchUpdateMtimes: vi.fn(() => ({ updated: 0 })),
  mockListIndexedRecordIdsForDeletedPaths: vi.fn((): number[] => []),
  mockDeleteMemory: vi.fn((): boolean => true),
  mockRunPostMutationHooks: vi.fn(() => ({
    latencyMs: 0,
    triggerCacheCleared: true,
    constitutionalCacheCleared: true,
    toolCacheInvalidated: 1,
    graphSignalsCacheCleared: true,
    coactivationCacheCleared: true,
  })),
}));

vi.mock('../core', () => ({
  getLastScanTime: mocks.mockGetLastScanTime,
  setLastScanTime: mocks.mockSetLastScanTime,
  checkDatabaseUpdated: mocks.mockCheckDatabaseUpdated,
}));

vi.mock('../core/config', () => ({
  INDEX_SCAN_COOLDOWN: 60000,
  DEFAULT_BASE_PATH: '/tmp/mock-workspace',
  BATCH_SIZE: 5,
  SERVER_DIR: '/tmp/mock-server',
}));

vi.mock('../utils', () => ({
  processBatches: mocks.mockProcessBatches,
  requireDb: mocks.mockRequireDb,
  toErrorMessage: (error: unknown) => error instanceof Error ? error.message : String(error),
}));

vi.mock('../lib/parsing/memory-parser', () => ({
  findMemoryFiles: mocks.mockFindMemoryFiles,
}));

vi.mock('../lib/providers/embeddings', () => ({
  getEmbeddingProfile: vi.fn(() => null),
}));

vi.mock('../lib/parsing/trigger-matcher', () => ({
  clearCache: vi.fn(),
}));

vi.mock('../lib/storage/incremental-index', () => ({
  categorizeFilesForIndexing: mocks.mockCategorizeFilesForIndexing,
  batchUpdateMtimes: mocks.mockBatchUpdateMtimes,
  listIndexedRecordIdsForDeletedPaths: mocks.mockListIndexedRecordIdsForDeletedPaths,
}));

vi.mock('../lib/search/vector-index', () => ({
  deleteMemory: mocks.mockDeleteMemory,
}));

vi.mock('../handlers/mutation-hooks', () => ({
  runPostMutationHooks: mocks.mockRunPostMutationHooks,
}));

vi.mock('../lib/response/envelope', () => ({
  createMCPSuccessResponse: (payload: unknown) => ({
    content: [{ type: 'text', text: JSON.stringify(payload) }],
  }),
  createMCPErrorResponse: (payload: unknown) => ({
    content: [{ type: 'text', text: JSON.stringify(payload) }],
  }),
}));

vi.mock('../handlers/memory-save', () => ({
  indexMemoryFile: vi.fn(async () => ({ status: 'indexed', id: 1, specFolder: 'specs/test' })),
}));

import * as handler from '../handlers/memory-index';

describe('handler-memory-index cooldown behavior', () => {
  beforeEach(() => {
    mocks.mockGetLastScanTime.mockReset();
    mocks.mockSetLastScanTime.mockReset();
    mocks.mockCheckDatabaseUpdated.mockReset();
    mocks.mockFindMemoryFiles.mockReset();
    mocks.mockProcessBatches.mockReset();
    mocks.mockRequireDb.mockReset();
    mocks.mockCategorizeFilesForIndexing.mockReset();
    mocks.mockBatchUpdateMtimes.mockReset();
    mocks.mockListIndexedRecordIdsForDeletedPaths.mockReset();
    mocks.mockDeleteMemory.mockReset();
    mocks.mockRunPostMutationHooks.mockReset();

    mocks.mockGetLastScanTime.mockResolvedValue(0);
    mocks.mockSetLastScanTime.mockResolvedValue(undefined);
    mocks.mockCheckDatabaseUpdated.mockResolvedValue(false);
    mocks.mockFindMemoryFiles.mockReturnValue([]);
    mocks.mockProcessBatches.mockImplementation(async (files: string[], worker: (file: string) => Promise<unknown>) => Promise.all(files.map(worker)));
    mocks.mockRequireDb.mockReturnValue({
      prepare: vi.fn(() => ({
        all: vi.fn(() => []),
        get: vi.fn(() => undefined),
      })),
    });
    mocks.mockCategorizeFilesForIndexing.mockImplementation((files: string[]) => ({
      toIndex: files,
      toUpdate: [],
      toSkip: [],
      toDelete: [],
    }));
    mocks.mockBatchUpdateMtimes.mockReturnValue({ updated: 0 });
    mocks.mockListIndexedRecordIdsForDeletedPaths.mockReturnValue([]);
    mocks.mockDeleteMemory.mockReturnValue(true);
    mocks.mockRunPostMutationHooks.mockReturnValue({
      latencyMs: 0,
      triggerCacheCleared: true,
      constitutionalCacheCleared: true,
      toolCacheInvalidated: 1,
      graphSignalsCacheCleared: true,
      coactivationCacheCleared: true,
    });
  });

  it('does not set cooldown timestamp when request is rate-limited', async () => {
    const now = Date.now();
    mocks.mockGetLastScanTime.mockResolvedValue(now);

    const result = await handler.handleMemoryIndexScan({
      includeConstitutional: false,
      includeSpecDocs: false,
    });

    expect(mocks.mockSetLastScanTime).not.toHaveBeenCalled();

    const envelope = JSON.parse(result.content[0].text);
    expect(envelope.error).toBe('Rate limited');
  });

  it('sets cooldown timestamp after successful scan response', async () => {
    const result = await handler.handleMemoryIndexScan({
      includeConstitutional: false,
      includeSpecDocs: false,
    });

    expect(mocks.mockSetLastScanTime).toHaveBeenCalledTimes(1);
    expect(typeof mocks.mockSetLastScanTime.mock.calls[0][0]).toBe('number');

    const envelope = JSON.parse(result.content[0].text);
    expect(envelope.summary).toBe('No memory files found');
  });

  it('removes stale index records even when discovery finds zero files', async () => {
    mocks.mockFindMemoryFiles.mockReturnValue([]);
    mocks.mockCategorizeFilesForIndexing.mockReturnValue({
      toIndex: [],
      toUpdate: [],
      toSkip: [],
      toDelete: ['/tmp/deleted-only.md'],
    });
    mocks.mockListIndexedRecordIdsForDeletedPaths.mockReturnValue([901]);
    mocks.mockDeleteMemory.mockReturnValue(true);

    const result = await handler.handleMemoryIndexScan({
      includeConstitutional: false,
      includeSpecDocs: false,
    });

    expect(mocks.mockCategorizeFilesForIndexing).toHaveBeenCalledWith([]);
    expect(mocks.mockListIndexedRecordIdsForDeletedPaths).toHaveBeenCalledWith(['/tmp/deleted-only.md']);
    expect(mocks.mockDeleteMemory).toHaveBeenCalledWith(901);
    expect(mocks.mockRunPostMutationHooks).toHaveBeenCalledWith('scan', {
      staleDeleted: 1,
      staleDeleteFailed: 0,
      operation: 'stale-delete',
    });

    const envelope = JSON.parse(result.content[0].text);
    expect(envelope.summary).toBe('No memory files found');
    expect(envelope.data.staleDeleted).toBe(1);
    expect(envelope.data.staleDeleteFailed).toBe(0);
  });

  it('consumes incremental toDelete and removes stale indexed records', async () => {
    mocks.mockFindMemoryFiles.mockReturnValue(['/tmp/active.md']);
    mocks.mockCategorizeFilesForIndexing.mockReturnValue({
      toIndex: [],
      toUpdate: [],
      toSkip: ['/tmp/active.md'],
      toDelete: ['/tmp/deleted.md'],
    });
    mocks.mockListIndexedRecordIdsForDeletedPaths.mockReturnValue([101, 202]);
    mocks.mockDeleteMemory.mockReturnValue(true);

    const result = await handler.handleMemoryIndexScan({
      includeConstitutional: false,
      includeSpecDocs: false,
    });

    expect(mocks.mockListIndexedRecordIdsForDeletedPaths).toHaveBeenCalledWith(['/tmp/deleted.md']);
    expect(mocks.mockDeleteMemory).toHaveBeenCalledTimes(2);
    expect(mocks.mockDeleteMemory).toHaveBeenNthCalledWith(1, 101);
    expect(mocks.mockDeleteMemory).toHaveBeenNthCalledWith(2, 202);
    expect(mocks.mockRunPostMutationHooks).toHaveBeenCalledWith('scan', {
      indexed: 0,
      updated: 0,
      staleDeleted: 2,
      staleDeleteFailed: 0,
    });

    const envelope = JSON.parse(result.content[0].text);
    expect(envelope.data.staleDeleted).toBe(2);
    expect(envelope.data.staleDeleteFailed).toBe(0);
  });

  it('tracks stale delete failures without aborting scan', async () => {
    mocks.mockFindMemoryFiles.mockReturnValue(['/tmp/active.md']);
    mocks.mockCategorizeFilesForIndexing.mockReturnValue({
      toIndex: [],
      toUpdate: [],
      toSkip: ['/tmp/active.md'],
      toDelete: ['/tmp/deleted.md'],
    });
    mocks.mockListIndexedRecordIdsForDeletedPaths.mockReturnValue([301, 302]);
    mocks.mockDeleteMemory
      .mockReturnValueOnce(true)
      .mockImplementationOnce(() => {
        throw new Error('delete failed');
      });

    const result = await handler.handleMemoryIndexScan({
      includeConstitutional: false,
      includeSpecDocs: false,
    });

    const envelope = JSON.parse(result.content[0].text);
    expect(envelope.data.staleDeleted).toBe(1);
    expect(envelope.data.staleDeleteFailed).toBe(1);
    expect(mocks.mockRunPostMutationHooks).toHaveBeenCalledWith('scan', {
      indexed: 0,
      updated: 0,
      staleDeleted: 1,
      staleDeleteFailed: 1,
    });
  });

  it('treats RetryErrorResult entries as failed files and captures retry details', async () => {
    mocks.mockFindMemoryFiles.mockReturnValue(['/tmp/retry-target.md']);
    mocks.mockCategorizeFilesForIndexing.mockReturnValue({
      toIndex: ['/tmp/retry-target.md'],
      toUpdate: [],
      toSkip: [],
      toDelete: [],
    });
    mocks.mockProcessBatches.mockResolvedValue([
      {
        error: 'Transient failure after retries',
        errorDetail: '429 rate limit',
        item: '/tmp/retry-target.md',
        retries_failed: true,
      },
    ]);

    const result = await handler.handleMemoryIndexScan({
      includeConstitutional: false,
      includeSpecDocs: false,
    });

    const envelope = JSON.parse(result.content[0].text);
    expect(envelope.data.failed).toBe(1);
    expect(envelope.data.files).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          filePath: '/tmp/retry-target.md',
          status: 'failed',
          error: 'Transient failure after retries',
          errorDetail: '429 rate limit',
        }),
      ])
    );
    expect(mocks.mockRunPostMutationHooks).not.toHaveBeenCalled();
  });
});
