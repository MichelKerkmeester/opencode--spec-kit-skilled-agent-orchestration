import { beforeEach, describe, expect, it, vi } from 'vitest';

const bridgeMocks = vi.hoisted(() => ({
  reconsolidate: vi.fn(),
  hasCheckpoint: vi.fn(() => true),
  isSaveReconsolidationEnabled: vi.fn(() => false),
  isAssistiveReconsolidationEnabled: vi.fn(() => false),
  isEncodingIntentEnabled: vi.fn(() => false),
  applyPostInsertMetadata: vi.fn(),
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
  isSaveReconsolidationEnabled: bridgeMocks.isSaveReconsolidationEnabled,
  isAssistiveReconsolidationEnabled: bridgeMocks.isAssistiveReconsolidationEnabled,
}));

vi.mock('../handlers/save/db-helpers', () => ({
  ALLOWED_POST_INSERT_COLUMNS: new Set<string>(),
  applyPostInsertMetadata: bridgeMocks.applyPostInsertMetadata,
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
    bridgeMocks.isSaveReconsolidationEnabled.mockReset();
    bridgeMocks.isSaveReconsolidationEnabled.mockReturnValue(false);
    bridgeMocks.isAssistiveReconsolidationEnabled.mockReset();
    bridgeMocks.isAssistiveReconsolidationEnabled.mockReturnValue(false);
    bridgeMocks.isEncodingIntentEnabled.mockReset();
    bridgeMocks.isEncodingIntentEnabled.mockReturnValue(false);
    bridgeMocks.applyPostInsertMetadata.mockReset();
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

  it('defaults plannerMode to plan-only until explicit full-auto follow-up is requested', async () => {
    bridgeMocks.isAssistiveReconsolidationEnabled.mockReturnValue(true);
    bridgeMocks.reconsolidate.mockResolvedValue({
      action: 'merge',
      existingMemoryId: 41,
      newMemoryId: 84,
      importanceWeight: 0.6,
      mergedContentLength: 128,
      similarity: 0.93,
    });

    const parsed = {
      title: 'Planner default memory',
      content: 'Planner default memory body',
      specFolder: 'test-spec',
      triggerPhrases: ['planner'],
      importanceTier: 'normal',
      contentHash: 'hash-plan-default',
      contextType: 'general',
      memoryType: 'memory',
      memoryTypeSource: 'test',
      documentType: 'memory',
      qualityScore: 1,
      qualityFlags: [],
    } as any;
    const embedding = new Float32Array([0.1, 0.2, 0.3]);

    const planOnlyResult = await runReconsolidationIfEnabled(
      {} as any,
      parsed,
      '/tmp/test-memory.md',
      false,
      embedding,
    );

    expect(planOnlyResult.earlyReturn).toBeNull();
    expect(bridgeMocks.reconsolidate).not.toHaveBeenCalled();
    expect(bridgeMocks.vectorSearch).not.toHaveBeenCalled();

    const fullAutoResult = await runReconsolidationIfEnabled(
      {} as any,
      parsed,
      '/tmp/test-memory.md',
      false,
      embedding,
      undefined,
      { plannerMode: 'full-auto' },
    );

    expect(bridgeMocks.reconsolidate).toHaveBeenCalledOnce();
    expect(fullAutoResult.earlyReturn?.status).toBe('merged');
    expect(fullAutoResult.earlyReturn?.id).toBe(84);
  });

  it('returns the merged survivor id instead of the archived predecessor id in full-auto mode', async () => {
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
      undefined,
      { plannerMode: 'full-auto' },
    );

    expect(result.earlyReturn).not.toBeNull();
    expect(result.earlyReturn?.status).toBe('merged');
    expect(result.earlyReturn?.id).toBe(84);
    expect(result.earlyReturn?.id).not.toBe(41);
    expect(bridgeMocks.appendMutationLedgerSafe).toHaveBeenCalledOnce();
  });

  it('keeps assistive high-similarity matches as a compatibility note in full-auto mode without archived BM25 cleanup side effects', async () => {
    const archiveRun = vi.fn();
    const database = {
      prepare: vi.fn(() => ({ run: archiveRun })),
    };

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
      undefined,
      { plannerMode: 'full-auto' },
    );

    expect(result.earlyReturn).toBeNull();
    expect(database.prepare).not.toHaveBeenCalled();
    expect(archiveRun).not.toHaveBeenCalled();
    expect(bridgeMocks.bm25RemoveDocument).not.toHaveBeenCalled();
  });

  it('rejects cross-scope reconsolidation candidates before merge evaluation', async () => {
    const database = {
      prepare: vi.fn(() => ({
        get: vi.fn(() => ({
          tenant_id: 'tenant-b',
          user_id: 'user-a',
          agent_id: 'agent-a',
          session_id: 'session-b',
        })),
      })),
    };

    bridgeMocks.vectorSearch.mockReturnValue([
      {
        id: 55,
        file_path: '/tmp/existing-memory.md',
        title: 'Existing memory',
        content_text: 'Existing memory body',
        similarity: 97,
      },
    ]);
    bridgeMocks.reconsolidate.mockImplementation(async (memory, _database, callbacks) => {
      const candidates = callbacks.findSimilar(memory.embedding, {
        limit: 3,
        specFolder: memory.specFolder,
      });
      if (candidates.length === 0) {
        return {
          action: 'complement',
          newMemoryId: 0,
          similarity: null,
        };
      }

      return {
        action: 'merge',
        existingMemoryId: candidates[0].id,
        newMemoryId: 99,
        importanceWeight: 0.6,
        mergedContentLength: 64,
        similarity: candidates[0].similarity,
      };
    });

    const result = await runReconsolidationIfEnabled(
      database as any,
      {
        title: 'Incoming governed memory',
        content: 'Incoming governed memory body',
        specFolder: 'test-spec',
        triggerPhrases: ['governed'],
        importanceTier: 'normal',
        contentHash: 'hash-governed',
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
      {
        tenantId: 'tenant-a',
        userId: 'user-a',
        agentId: 'agent-a',
        sessionId: 'session-a',
      },
      { plannerMode: 'full-auto' },
    );

    expect(result.earlyReturn).toBeNull();
    expect(database.prepare).toHaveBeenCalled();
    expect(bridgeMocks.appendMutationLedgerSafe).not.toHaveBeenCalled();
  });

  it('attempts BM25 repair for recon conflict stores in full-auto mode and surfaces the warning when repair fails', async () => {
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
      {
        tenantId: 'tenant-a',
        userId: 'user-a',
        agentId: 'agent-a',
        sessionId: 'session-a',
      },
      { plannerMode: 'full-auto' },
    );

    expect(bridgeMocks.bm25AddDocument).toHaveBeenCalledTimes(2);
    expect(bridgeMocks.bm25RemoveDocument).toHaveBeenCalledWith('901');
    expect(bridgeMocks.applyPostInsertMetadata).toHaveBeenCalledWith(
      expect.anything(),
      901,
      expect.objectContaining({
        tenant_id: 'tenant-a',
        user_id: 'user-a',
        agent_id: 'agent-a',
        session_id: 'session-a',
      }),
    );
    expect(result.earlyReturn?.warnings).toEqual(
      expect.arrayContaining([
        'BM25 repair failed after recon conflict store for memory 901: repair conflict-store bm25 failure',
      ]),
    );
  });
});
