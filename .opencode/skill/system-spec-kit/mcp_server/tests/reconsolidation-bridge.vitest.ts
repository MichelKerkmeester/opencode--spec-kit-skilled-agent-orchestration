import { beforeEach, describe, expect, it, vi } from 'vitest';

const bridgeMocks = vi.hoisted(() => ({
  reconsolidate: vi.fn(),
  hasCheckpoint: vi.fn(() => true),
  isReconsolidationEnabled: vi.fn(() => true),
  isAssistiveReconsolidationEnabled: vi.fn(() => false),
  isEncodingIntentEnabled: vi.fn(() => false),
  appendMutationLedgerSafe: vi.fn(() => true),
  vectorSearch: vi.fn(() => []),
  indexMemory: vi.fn(() => 901),
  bm25RemoveDocument: vi.fn(() => true),
  bm25AddDocument: vi.fn(),
  bm25GetIndex: vi.fn(),
  bm25Enabled: vi.fn(() => false),
}));

vi.mock('../lib/search/vector-index', () => ({
  vectorSearch: bridgeMocks.vectorSearch,
  indexMemory: bridgeMocks.indexMemory,
}));

vi.mock('../lib/providers/embeddings', () => ({
  generateDocumentEmbedding: vi.fn(),
}));

vi.mock('../lib/search/bm25-index', () => ({
  isBm25Enabled: bridgeMocks.bm25Enabled,
  buildBm25DocumentText: vi.fn(() => 'bm25 text'),
  getIndex: bridgeMocks.bm25GetIndex,
}));

vi.mock('../lib/cognitive/fsrs-scheduler', () => ({
  DEFAULT_INITIAL_STABILITY: 5,
  DEFAULT_INITIAL_DIFFICULTY: 5,
}));

vi.mock('../lib/storage/incremental-index', () => ({
  getFileMetadata: vi.fn(() => null),
}));

vi.mock('../lib/storage/reconsolidation', () => ({
  reconsolidate: bridgeMocks.reconsolidate,
}));

vi.mock('../lib/search/encoding-intent', () => ({
  classifyEncodingIntent: vi.fn(() => 'document'),
}));

vi.mock('../lib/search/search-flags', () => ({
  isEncodingIntentEnabled: bridgeMocks.isEncodingIntentEnabled,
  isReconsolidationEnabled: bridgeMocks.isReconsolidationEnabled,
  isAssistiveReconsolidationEnabled: bridgeMocks.isAssistiveReconsolidationEnabled,
}));

vi.mock('../handlers/save/db-helpers', () => ({
  ALLOWED_POST_INSERT_COLUMNS: new Set<string>(),
  applyPostInsertMetadata: vi.fn(),
  hasReconsolidationCheckpoint: bridgeMocks.hasCheckpoint,
}));

vi.mock('../lib/storage/history', () => ({
  recordHistory: vi.fn(),
}));

vi.mock('../handlers/memory-crud-utils', () => ({
  appendMutationLedgerSafe: bridgeMocks.appendMutationLedgerSafe,
}));

vi.mock('../handlers/pe-gating', () => ({
  calculateDocumentWeight: vi.fn(() => 0.5),
  isSpecDocumentType: vi.fn(() => false),
}));

vi.mock('../handlers/handler-utils', () => ({
  detectSpecLevelFromParsed: vi.fn(() => null),
}));

vi.mock('../utils', () => ({
  toErrorMessage: vi.fn((error: unknown) => error instanceof Error ? error.message : String(error)),
}));

import { runReconsolidationIfEnabled } from '../handlers/save/reconsolidation-bridge';

describe('Reconsolidation Bridge', () => {
  beforeEach(() => {
    bridgeMocks.reconsolidate.mockReset();
    bridgeMocks.hasCheckpoint.mockReset();
    bridgeMocks.hasCheckpoint.mockReturnValue(true);
    bridgeMocks.isReconsolidationEnabled.mockReset();
    bridgeMocks.isReconsolidationEnabled.mockReturnValue(true);
    bridgeMocks.isAssistiveReconsolidationEnabled.mockReset();
    bridgeMocks.isAssistiveReconsolidationEnabled.mockReturnValue(false);
    bridgeMocks.isEncodingIntentEnabled.mockReset();
    bridgeMocks.isEncodingIntentEnabled.mockReturnValue(false);
    bridgeMocks.appendMutationLedgerSafe.mockReset();
    bridgeMocks.appendMutationLedgerSafe.mockReturnValue(true);
    bridgeMocks.vectorSearch.mockReset();
    bridgeMocks.vectorSearch.mockReturnValue([]);
    bridgeMocks.indexMemory.mockReset();
    bridgeMocks.indexMemory.mockReturnValue(901);
    bridgeMocks.bm25RemoveDocument.mockReset();
    bridgeMocks.bm25RemoveDocument.mockReturnValue(true);
    bridgeMocks.bm25AddDocument.mockReset();
    bridgeMocks.bm25GetIndex.mockReset();
    bridgeMocks.bm25GetIndex.mockReturnValue({
      removeDocument: bridgeMocks.bm25RemoveDocument,
      addDocument: bridgeMocks.bm25AddDocument,
    });
    bridgeMocks.bm25Enabled.mockReset();
    bridgeMocks.bm25Enabled.mockReturnValue(false);
  });

  it('returns the merged survivor id instead of the archived predecessor id', async () => {
    bridgeMocks.reconsolidate.mockResolvedValue({
      action: 'merge',
      existingMemoryId: 41,
      newMemoryId: 84,
      importanceWeight: 0.6,
      mergedContentLength: 128,
      similarity: 0.93,
    });

    const result = await runReconsolidationIfEnabled(
      {} as any,
      {
        title: 'Merged memory',
        content: 'Merged memory body',
        specFolder: 'test-spec',
        triggerPhrases: ['merge'],
        importanceTier: 'normal',
        contentHash: 'hash-123',
        contextType: 'general',
        memoryType: 'memory',
        memoryTypeSource: 'test',
        documentType: 'memory',
        qualityScore: 1,
        qualityFlags: [],
      } as any,
      '/tmp/test-memory.md',
      false,
      new Float32Array([0.1, 0.2, 0.3]),
    );

    expect(result.earlyReturn).not.toBeNull();
    expect(result.earlyReturn?.status).toBe('merged');
    expect(result.earlyReturn?.id).toBe(84);
    expect(result.earlyReturn?.id).not.toBe(41);
    expect(bridgeMocks.appendMutationLedgerSafe).toHaveBeenCalledOnce();
  });

  it('removes archived assistive auto-merge documents from the BM25 singleton', async () => {
    const archiveRun = vi.fn();
    const database = {
      prepare: vi.fn(() => ({ run: archiveRun })),
    };

    bridgeMocks.isReconsolidationEnabled.mockReturnValue(false);
    bridgeMocks.isAssistiveReconsolidationEnabled.mockReturnValue(true);
    bridgeMocks.bm25Enabled.mockReturnValue(true);
    bridgeMocks.vectorSearch.mockReturnValue([
      {
        id: 55,
        similarity: 97,
        content_text: 'Older memory body',
      },
    ]);

    const result = await runReconsolidationIfEnabled(
      database as any,
      {
        title: 'Incoming memory',
        content: 'Incoming memory body',
        specFolder: 'test-spec',
        triggerPhrases: ['merge'],
        importanceTier: 'normal',
        contentHash: 'hash-456',
        contextType: 'general',
        memoryType: 'memory',
        memoryTypeSource: 'test',
        documentType: 'memory',
        qualityScore: 1,
        qualityFlags: [],
      } as any,
      '/tmp/test-memory.md',
      false,
      new Float32Array([0.1, 0.2, 0.3]),
    );

    expect(result.earlyReturn).toBeNull();
    expect(database.prepare).toHaveBeenCalled();
    expect(archiveRun).toHaveBeenCalledWith(55);
    expect(bridgeMocks.bm25RemoveDocument).toHaveBeenCalledWith('55');
  });

  it('attempts BM25 repair for recon conflict stores and surfaces the warning when repair fails', async () => {
    bridgeMocks.bm25Enabled.mockReturnValue(true);
    bridgeMocks.bm25AddDocument
      .mockImplementationOnce(() => {
        throw new Error('initial conflict-store bm25 failure');
      })
      .mockImplementationOnce(() => {
        throw new Error('repair conflict-store bm25 failure');
      });
    bridgeMocks.reconsolidate.mockImplementation(async (_memory, _database, callbacks) => {
      const storedId = callbacks.storeMemory({
        title: 'Conflict survivor',
        content: 'Conflict survivor body',
        specFolder: 'test-spec',
        filePath: '/tmp/test-memory.md',
        embedding: new Float32Array([0.1, 0.2, 0.3]),
        triggerPhrases: ['conflict'],
      });

      return {
        action: 'conflict',
        existingMemoryId: 12,
        newMemoryId: storedId,
        causalEdgeId: 77,
        similarity: 0.82,
      };
    });

    const result = await runReconsolidationIfEnabled(
      {
        transaction: (callback: () => number) => callback,
      } as any,
      {
        title: 'Conflict survivor',
        content: 'Conflict survivor body',
        specFolder: 'test-spec',
        triggerPhrases: ['conflict'],
        importanceTier: 'normal',
        contentHash: 'hash-789',
        contextType: 'general',
        memoryType: 'memory',
        memoryTypeSource: 'test',
        documentType: 'memory',
        qualityScore: 1,
        qualityFlags: [],
      } as any,
      '/tmp/test-memory.md',
      false,
      new Float32Array([0.1, 0.2, 0.3]),
    );

    expect(bridgeMocks.bm25AddDocument).toHaveBeenCalledTimes(2);
    expect(bridgeMocks.bm25RemoveDocument).toHaveBeenCalledWith('901');
    expect(result.earlyReturn?.warnings).toEqual(
      expect.arrayContaining([
        'BM25 repair failed after recon conflict store for memory 901: repair conflict-store bm25 failure',
      ]),
    );
  });
});
