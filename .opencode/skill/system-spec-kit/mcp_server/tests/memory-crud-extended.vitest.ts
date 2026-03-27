// ───────────────────────────────────────────────────────────────
// 1. MEMORY CRUD EXTENDED VITEST
// ───────────────────────────────────────────────────────────────
import { describe, it, expect, beforeAll, afterAll, afterEach, vi } from 'vitest';

// TEST: HANDLER - MEMORY CRUD (EXTENDED) (Vitest)
// Happy-path execution, bulk delete transactions, causal edge
// Cleanup, folder scoring integration, embedding regeneration,
// AllowPartialUpdate, setEmbeddingModelReady.
// Mock modules at the vi.mock level so handler's internal imports are intercepted.
// Vi.mock is hoisted to the top of the file by vitest.
vi.mock('../core/db-state', async (importOriginal) => {
  const actual = await importOriginal() as any;
  return {
    ...actual,
    checkDatabaseUpdated: vi.fn(async () => false),
  };
});

vi.mock('../core', async (importOriginal) => {
  const actual = await importOriginal() as any;
  return {
    ...actual,
    checkDatabaseUpdated: vi.fn(async () => false),
  };
});

vi.mock('../lib/search/vector-index', async (importOriginal) => {
  const actual = await importOriginal() as any;
  return {
    ...actual,
    deleteMemory: vi.fn((...args: any[]) => actual.deleteMemory?.(...args)),
    getDb: vi.fn(() => actual.getDb?.()),
    getMemory: vi.fn((...args: any[]) => actual.getMemory?.(...args)),
    getMemoriesByFolder: vi.fn((...args: any[]) => actual.getMemoriesByFolder?.(...args)),
    updateMemory: vi.fn((...args: any[]) => actual.updateMemory?.(...args)),
    updateEmbeddingStatus: vi.fn((...args: any[]) => actual.updateEmbeddingStatus?.(...args)),
    getStatusCounts: vi.fn((...args: any[]) => actual.getStatusCounts?.(...args)),
    isVectorSearchAvailable: vi.fn(() => actual.isVectorSearchAvailable?.()),
    verifyIntegrity: vi.fn((...args: any[]) => actual.verifyIntegrity?.(...args)),
  };
});

vi.mock('../lib/storage/checkpoints', async (importOriginal) => {
  const actual = await importOriginal() as any;
  return {
    ...actual,
    createCheckpoint: vi.fn((...args: any[]) => actual.createCheckpoint?.(...args)),
  };
});

vi.mock('../lib/storage/causal-edges', async (importOriginal) => {
  const actual = await importOriginal() as any;
  return {
    ...actual,
    init: vi.fn((...args: any[]) => actual.init?.(...args)),
    deleteEdgesForMemory: vi.fn((...args: any[]) => actual.deleteEdgesForMemory?.(...args)),
    // Fix F23 — include cleanupOrphanedEdges in mock for health auto-repair coverage.
    cleanupOrphanedEdges: vi.fn((...args: any[]) => actual.cleanupOrphanedEdges?.(...args)),
  };
});

vi.mock('../lib/parsing/trigger-matcher', async (importOriginal) => {
  const actual = await importOriginal() as any;
  return {
    ...actual,
    clearCache: vi.fn((...args: any[]) => actual.clearCache?.(...args)),
  };
});

vi.mock('../lib/cache/tool-cache', async (importOriginal) => {
  const actual = await importOriginal() as any;
  return {
    ...actual,
    invalidateOnWrite: vi.fn((...args: any[]) => actual.invalidateOnWrite?.(...args)),
  };
});

vi.mock('../hooks/memory-surface', async (importOriginal) => {
  const actual = await importOriginal() as any;
  return {
    ...actual,
    clearConstitutionalCache: vi.fn((...args: any[]) => actual.clearConstitutionalCache?.(...args)),
  };
});

vi.mock('../lib/storage/mutation-ledger', async () => {
  return {
    initLedger: vi.fn(),
    appendEntry: vi.fn(() => ({ id: 1 })),
    computeHash: vi.fn((input: string) => `mock-hash-${String(input).length}`),
  };
});

// Mock the embeddings barrel that the handler actually imports
vi.mock('../lib/providers/embeddings', async (importOriginal) => {
  const actual = await importOriginal() as any;
  return {
    ...actual,
    generateDocumentEmbedding: vi.fn((...args: any[]) => actual.generateDocumentEmbedding?.(...args)),
    getProviderMetadata: vi.fn((...args: any[]) => actual.getProviderMetadata?.(...args)),
    getEmbeddingProfile: vi.fn((...args: any[]) => actual.getEmbeddingProfile?.(...args)),
    getEmbeddingProfileAsync: vi.fn((...args: any[]) => actual.getEmbeddingProfileAsync?.(...args)),
    getEmbeddingDimension: vi.fn((...args: any[]) => actual.getEmbeddingDimension?.(...args)),
    getModelName: vi.fn((...args: any[]) => actual.getModelName?.(...args)),
  };
});

// Mock the folder-scoring barrel that the handler actually imports
vi.mock('../lib/scoring/folder-scoring', async (importOriginal) => {
  const actual = await importOriginal() as any;
  return {
    ...actual,
    isArchived: vi.fn((...args: any[]) => actual.isArchived?.(...args)),
    computeFolderScores: vi.fn((...args: any[]) => actual.computeFolderScores?.(...args)),
  };
});

let handler: any = null;
let vectorIndex: any = null;
let checkpointsMod: any = null;
let embeddingsMod: any = null;
let embeddingsSourceMod: any = null;
let triggerMatcherMod: any = null;
let toolCacheMod: any = null;
let causalEdgesMod: any = null;
let memorySurfaceMod: any = null;
let folderScoringMod: any = null;
let folderScoringSourceMod: any = null;
let dbStateMod: any = null;
let mutationLedgerMod: any = null;

/** Parse the JSON envelope from an MCP response */
function parseResponse(result: any): any {
  if (!result || !result.content || !result.content[0]) return null;
  try { return JSON.parse(result.content[0].text); } catch (_error: unknown) { return null; }
}

beforeAll(async () => {
  handler = await import('../handlers/memory-crud');
  vectorIndex = await import('../lib/search/vector-index');

  try { checkpointsMod = await import('../lib/storage/checkpoints'); } catch (_error: unknown) { /* optional */ }
  try { embeddingsMod = await import('../lib/providers/embeddings'); } catch (_error: unknown) { /* optional */ }
  try { embeddingsSourceMod = await import('../lib/providers/embeddings'); } catch (_error: unknown) { /* optional */ }
  try { triggerMatcherMod = await import('../lib/parsing/trigger-matcher'); } catch (_error: unknown) { /* optional */ }
  try { toolCacheMod = await import('../lib/cache/tool-cache'); } catch (_error: unknown) { /* optional */ }
  try { causalEdgesMod = await import('../lib/storage/causal-edges'); } catch (_error: unknown) { /* optional */ }
  try { memorySurfaceMod = await import('../hooks/memory-surface'); } catch (_error: unknown) { /* optional */ }
  try { folderScoringMod = await import('../lib/scoring/folder-scoring'); } catch (_error: unknown) { /* optional */ }
  try { folderScoringSourceMod = await import('../lib/scoring/folder-scoring'); } catch (_error: unknown) { /* optional */ }
  try { dbStateMod = await import('../core/db-state'); } catch (_error: unknown) { /* optional */ }
  try { mutationLedgerMod = await import('../lib/storage/mutation-ledger'); } catch (_error: unknown) { /* optional */ }
});

afterEach(() => {
  vi.restoreAllMocks();
});

afterAll(() => {
  vi.restoreAllMocks();
  vi.resetModules();
});

/* ───────────────────────────────────────────────────────────────
   MOCK HELPERS
   Use vi.mocked().mockImplementation() on the vi.mock'd modules
──────────────────────────────────────────────────────────────── */

function installDeleteMocks(opts: {
  deleteResult?: boolean;
  dbAvailable?: boolean;
  edgeCleanupThrows?: boolean;
} = {}) {
  const { deleteResult = true, dbAvailable = true, edgeCleanupThrows = false } = opts;
  const calls: Record<string, any[]> = {
    deleteMemory: [],
    causalInit: [],
    causalDeleteEdges: [],
    clearCache: [],
    invalidateOnWrite: [],
    clearConstitutionalCache: [],
  };

  const fakeDb = dbAvailable ? { transaction: (fn: Function) => fn } : null;

  vi.mocked(vectorIndex.deleteMemory).mockImplementation((id: number) => { calls.deleteMemory.push(id); return deleteResult; });
  vi.mocked(vectorIndex.getDb).mockImplementation(() => fakeDb);

  if (causalEdgesMod) {
    vi.mocked(causalEdgesMod.init).mockImplementation((db: any) => { calls.causalInit.push(db); });
    vi.mocked(causalEdgesMod.deleteEdgesForMemory).mockImplementation((id: string) => {
      if (edgeCleanupThrows) throw new Error('Mock edge cleanup error');
      calls.causalDeleteEdges.push(id);
    });
  }

  if (triggerMatcherMod) {
    vi.mocked(triggerMatcherMod.clearCache).mockImplementation(() => { calls.clearCache.push(true); });
  }

  if (toolCacheMod) {
    vi.mocked(toolCacheMod.invalidateOnWrite).mockImplementation((...args: any[]) => { calls.invalidateOnWrite.push(args); });
  }

  if (memorySurfaceMod) {
    vi.mocked(memorySurfaceMod.clearConstitutionalCache).mockImplementation(() => { calls.clearConstitutionalCache.push(true); });
  }

  return calls;
}

function installBulkDeleteMocks(opts: {
  memories?: { id: number }[];
  checkpointThrows?: boolean;
  checkpointReturnsNull?: boolean;
  dbAvailable?: boolean;
} = {}) {
  const {
    memories = [{ id: 10 }, { id: 11 }, { id: 12 }],
    checkpointThrows = false,
    checkpointReturnsNull = false,
    dbAvailable = true,
  } = opts;
  const calls: Record<string, any[]> = {
    deleteMemory: [],
    getMemoriesByFolder: [],
    createCheckpoint: [],
    causalInit: [],
    causalDeleteEdges: [],
    clearCache: [],
    invalidateOnWrite: [],
    clearConstitutionalCache: [],
  };

  const fakeDb = dbAvailable ? {
    transaction: (fn: Function) => {
      return () => fn();
    }
  } : null;

  vi.mocked(vectorIndex.getMemoriesByFolder).mockImplementation((folder: string) => { calls.getMemoriesByFolder.push(folder); return memories; });
  vi.mocked(vectorIndex.deleteMemory).mockImplementation((id: number) => { calls.deleteMemory.push(id); return true; });
  vi.mocked(vectorIndex.getDb).mockImplementation(() => fakeDb);

  if (checkpointsMod) {
    vi.mocked(checkpointsMod.createCheckpoint).mockImplementation((opts: any) => {
      calls.createCheckpoint.push(opts);
      if (checkpointThrows) throw new Error('Mock checkpoint error');
      if (checkpointReturnsNull) return null;
      return {
        name: opts?.name ?? 'pre-cleanup-test',
        specFolder: opts?.specFolder ?? null,
      } as any;
    });
  }

  if (causalEdgesMod) {
    vi.mocked(causalEdgesMod.init).mockImplementation((db: any) => { calls.causalInit.push(db); });
    vi.mocked(causalEdgesMod.deleteEdgesForMemory).mockImplementation((id: string) => { calls.causalDeleteEdges.push(id); });
  }

  if (triggerMatcherMod) {
    vi.mocked(triggerMatcherMod.clearCache).mockImplementation(() => { calls.clearCache.push(true); });
  }

  if (toolCacheMod) {
    vi.mocked(toolCacheMod.invalidateOnWrite).mockImplementation((...args: any[]) => { calls.invalidateOnWrite.push(args); });
  }

  if (memorySurfaceMod) {
    vi.mocked(memorySurfaceMod.clearConstitutionalCache).mockImplementation(() => { calls.clearConstitutionalCache.push(true); });
  }

  return calls;
}

function installUpdateMocks(opts: {
  existingMemory?: any;
  embeddingResult?: Float32Array | null;
  embeddingThrows?: boolean;
} = {}) {
  const { existingMemory = { id: 1, title: 'Old Title' }, embeddingResult = new Float32Array(768), embeddingThrows = false } = opts;
  const calls: Record<string, any[]> = {
    getMemory: [],
    getDb: [],
    updateMemory: [],
    generateDocumentEmbedding: [],
    updateEmbeddingStatus: [],
    clearCache: [],
    invalidateOnWrite: [],
    clearConstitutionalCache: [],
  };

  const fakeDb = {
    inTransaction: false,
    transaction: (fn: Function) => {
      return () => fn();
    },
    prepare: (_sql: string) => ({
      get: (_id: number) => ({
        id: existingMemory?.id ?? 1,
        title: existingMemory?.title ?? 'Old Title',
        content_hash: existingMemory?.content_hash ?? 'old-hash',
        spec_folder: existingMemory?.spec_folder ?? 'specs/test',
        file_path: existingMemory?.file_path ?? '/tmp/memory.md',
        content_text: existingMemory?.content_text ?? 'Mock content',
        trigger_phrases: existingMemory?.trigger_phrases ?? '[]',
      }),
    }),
  };

  vi.mocked(vectorIndex.getMemory).mockImplementation((id: number) => { calls.getMemory.push(id); return existingMemory; });
  vi.mocked(vectorIndex.getDb).mockImplementation(() => { calls.getDb.push(true); return fakeDb as any; });
  vi.mocked(vectorIndex.updateMemory).mockImplementation((params: any) => { calls.updateMemory.push(params); });
  vi.mocked(vectorIndex.updateEmbeddingStatus).mockImplementation((id: number, status: string) => { calls.updateEmbeddingStatus.push({ id, status }); });

  if (embeddingsSourceMod) {
    vi.mocked(embeddingsSourceMod.generateDocumentEmbedding).mockImplementation(async (text: string) => {
      calls.generateDocumentEmbedding.push(text);
      if (embeddingThrows) throw new Error('Mock embedding failure');
      return embeddingResult;
    });
  }

  if (triggerMatcherMod) {
    vi.mocked(triggerMatcherMod.clearCache).mockImplementation(() => { calls.clearCache.push(true); });
  }

  if (toolCacheMod) {
    vi.mocked(toolCacheMod.invalidateOnWrite).mockImplementation((...args: any[]) => { calls.invalidateOnWrite.push(args); });
  }

  if (memorySurfaceMod) {
    vi.mocked(memorySurfaceMod.clearConstitutionalCache).mockImplementation(() => { calls.clearConstitutionalCache.push(true); });
  }

  return calls;
}

function installListMocks(opts: {
  rows?: any[];
  total?: number;
} = {}) {
  const { rows = [], total = 0 } = opts;
  const queries: string[] = [];

  const fakeDb = {
    prepare: (sql: string) => {
      queries.push(sql);
      return ({
      get: (...params: any[]) => {
        if (sql.includes('COUNT(*)')) return { count: total };
        return rows[0] || null;
      },
      all: (...params: any[]) => rows,
      });
    },
    _queries: queries,
  };

  vi.mocked(vectorIndex.getDb).mockImplementation(() => fakeDb);

  return fakeDb;
}

function installStatsMocks(opts: {
  total?: number;
  statusCounts?: any;
  folderRows?: any[];
  dates?: any;
  triggerCount?: number;
  vectorSearchAvailable?: boolean;
  computeScoresResult?: any[];
  computeScoresThrows?: boolean;
} = {}) {
  const {
    total = 5,
    statusCounts = { success: 3, pending: 1, failed: 1 },
    folderRows = [{ spec_folder: 'specs/001-test', count: 3 }, { spec_folder: 'specs/002-other', count: 2 }],
    dates = { oldest: '2025-01-01T00:00:00Z', newest: '2025-06-01T00:00:00Z' },
    triggerCount = 10,
    vectorSearchAvailable = true,
    computeScoresResult = [],
    computeScoresThrows = false,
  } = opts;

  const fakeDb = {
    prepare: (sql: string) => ({
      get: (...params: any[]) => {
        if (sql.includes('COUNT(*)')) return { count: total };
        if (sql.includes('MIN(created_at)')) return dates;
        if (sql.includes('SUM(json_array_length')) return { count: triggerCount };
        return null;
      },
      all: (...params: any[]) => {
        if (sql.includes('GROUP BY spec_folder')) return folderRows;
        if (sql.includes('embedding_status')) {
          return folderRows.map((f: any) => ({
            id: 1, spec_folder: f.spec_folder, file_path: '/test/path.md',
            title: 'Test', importance_weight: 0.5, importance_tier: 'normal',
            created_at: '2025-01-01', updated_at: '2025-06-01',
            confidence: 0.8, validation_count: 2, access_count: 5,
          }));
        }
        return [];
      },
    }),
  };

  vi.mocked(vectorIndex.getDb).mockImplementation(() => fakeDb);
  vi.mocked(vectorIndex.getStatusCounts).mockImplementation(() => statusCounts);
  vi.mocked(vectorIndex.isVectorSearchAvailable).mockImplementation(() => vectorSearchAvailable);

  if (folderScoringSourceMod) {
    vi.mocked(folderScoringSourceMod.isArchived).mockImplementation((folder: string) => folder.includes('z_archive'));
    vi.mocked(folderScoringSourceMod.computeFolderScores).mockImplementation((memories: any[], options: any) => {
      if (computeScoresThrows) throw new Error('Mock scoring failure');
      return computeScoresResult;
    });
  }

  return fakeDb;
}

function installHealthMocks(opts: {
  dbAvailable?: boolean;
  memoryCount?: number;
  vectorSearchAvailable?: boolean;
  providerMetadata?: any;
  embeddingProfile?: any;
  embeddingProfileAsync?: any;
  embeddingDimension?: number;
  modelName?: string;
  aliasRows?: any[];
} = {}) {
  const {
    dbAvailable = true,
    memoryCount = 42,
    vectorSearchAvailable = true,
    providerMetadata = { provider: 'test', model: 'test-model', healthy: true },
    embeddingProfile = { dim: 768, getDatabasePath: (base: string) => base + '/test.db' },
    embeddingProfileAsync = embeddingProfile,
    embeddingDimension = embeddingProfile?.dim ?? 768,
    modelName = providerMetadata?.model ?? 'test-model',
    aliasRows = [],
  } = opts;

  const fakeDb = dbAvailable ? {
    prepare: (sql: string) => ({
      get: (...params: any[]) => {
        if (sql.includes('COUNT(*)')) return { count: memoryCount };
        return null;
      },
      all: (...params: any[]) => {
        if (sql.includes('file_path, content_hash')) return aliasRows;
        return [];
      },
    }),
  } : null;

  vi.mocked(vectorIndex.getDb).mockImplementation(() => fakeDb);
  vi.mocked(vectorIndex.isVectorSearchAvailable).mockImplementation(() => vectorSearchAvailable);
  vi.mocked(vectorIndex.verifyIntegrity).mockImplementation(() => ({
    totalMemories: memoryCount,
    totalVectors: 0,
    orphanedVectors: 0,
    missingVectors: 0,
    orphanedFiles: [],
    orphanedChunks: 0,
    isConsistent: true,
  }));
  vi.mocked(vectorIndex.deleteMemory).mockImplementation(() => true);

  if (embeddingsSourceMod) {
    vi.mocked(embeddingsSourceMod.getProviderMetadata).mockImplementation(() => providerMetadata);
    vi.mocked(embeddingsSourceMod.getEmbeddingProfile).mockImplementation(() => embeddingProfile);
    vi.mocked(embeddingsSourceMod.getEmbeddingProfileAsync).mockImplementation(async () => embeddingProfileAsync);
    vi.mocked(embeddingsSourceMod.getEmbeddingDimension).mockImplementation(() => embeddingDimension);
    vi.mocked(embeddingsSourceMod.getModelName).mockImplementation(() => modelName);
  }

  return fakeDb;
}

function installMutationLedgerMocks() {
  const calls: Record<string, any[]> = {
    initLedger: [],
    appendEntry: [],
    computeHash: [],
  };

  if (!mutationLedgerMod) {
    return calls;
  }

  vi.mocked(mutationLedgerMod.initLedger).mockImplementation((db: any) => {
    calls.initLedger.push(db);
  });

  vi.mocked(mutationLedgerMod.appendEntry).mockImplementation((db: any, entry: any) => {
    calls.appendEntry.push(entry);
    return { id: calls.appendEntry.length, ...entry };
  });

  vi.mocked(mutationLedgerMod.computeHash).mockImplementation((input: string) => {
    calls.computeHash.push(input);
    return `mock-hash-${calls.computeHash.length}`;
  });

  return calls;
}

/* ───────────────────────────────────────────────────────────────
   SUITE: handleMemoryDelete - Happy Path
──────────────────────────────────────────────────────────────── */

describe('handleMemoryDelete - Happy Path', () => {
  it('EXT-D1: Single ID delete returns deleted=1', async () => {
    if (!handler?.handleMemoryDelete || !vectorIndex) {
      throw new Error('Test setup incomplete: memory-crud handler or vector-index unavailable');
    }
    const calls = installDeleteMocks({ deleteResult: true, dbAvailable: true });
    const result = await handler.handleMemoryDelete({ id: 42 });
    const parsed = parseResponse(result);
    expect(parsed?.data?.deleted).toBe(1);
  });

  it('EXT-D2: Delete non-existent returns deleted=0', async () => {
    if (!handler?.handleMemoryDelete || !vectorIndex) { throw new Error('Test setup incomplete: memory-crud handler or vector-index unavailable'); }
    const calls = installDeleteMocks({ deleteResult: false, dbAvailable: true });
    const result = await handler.handleMemoryDelete({ id: 999 });
    const parsed = parseResponse(result);
    expect(parsed?.data?.deleted).toBe(0);
  });

  it('EXT-D3: String ID "7" parsed to numeric 7', async () => {
    if (!handler?.handleMemoryDelete || !vectorIndex) { throw new Error('Test setup incomplete: memory-crud handler or vector-index unavailable'); }
    const calls = installDeleteMocks({ deleteResult: true });
    await handler.handleMemoryDelete({ id: '7' });
    expect(calls.deleteMemory[0]).toBe(7);
  });

  it('EXT-D4: Successful delete clears caches', async () => {
    if (!handler?.handleMemoryDelete || !vectorIndex) { throw new Error('Test setup incomplete: memory-crud handler or vector-index unavailable'); }
    const calls = installDeleteMocks({ deleteResult: true });
    await handler.handleMemoryDelete({ id: 1 });
    const cacheCleared = calls.clearCache.length > 0;
    const cacheInvalidated = calls.invalidateOnWrite.length > 0;
    expect(cacheCleared || cacheInvalidated).toBe(true);
    expect(calls.clearConstitutionalCache.length).toBeGreaterThan(0);
  });

  it('EXT-D5: Failed delete does not clear caches', async () => {
    if (!handler?.handleMemoryDelete || !vectorIndex) { throw new Error('Test setup incomplete: memory-crud handler or vector-index unavailable'); }
    const calls = installDeleteMocks({ deleteResult: false });
    await handler.handleMemoryDelete({ id: 999 });
    expect(calls.clearCache).toHaveLength(0);
    expect(calls.invalidateOnWrite).toHaveLength(0);
  });

  it('EXT-D6: Single delete with unavailable DB returns E_DB_UNAVAILABLE envelope', async () => {
    if (!handler?.handleMemoryDelete || !vectorIndex) { throw new Error('Test setup incomplete: memory-crud handler or vector-index unavailable'); }
    installDeleteMocks({ dbAvailable: false });

    const result = await handler.handleMemoryDelete({ id: 42 });
    const parsed = parseResponse(result);

    expect(result?.isError).toBe(true);
    expect(parsed?.data?.code).toBe('E_DB_UNAVAILABLE');
    expect(parsed?.data?.error).toBe('Delete aborted: database unavailable');
    expect(parsed?.data?.details?.deleted).toBe(0);
  });

  it('EXT-D7: Single delete surfaces mutation-ledger append warnings', async (ctx) => {
    if (!mutationLedgerMod) { ctx.skip(); return; }
    if (!handler?.handleMemoryDelete || !vectorIndex) { throw new Error('Test setup incomplete: memory-crud handler or vector-index unavailable'); }
    installDeleteMocks({ deleteResult: true, dbAvailable: true });
    vi.mocked(mutationLedgerMod.appendEntry).mockImplementationOnce(() => {
      throw new Error('ledger offline');
    });

    const result = await handler.handleMemoryDelete({ id: 42 });
    const parsed = parseResponse(result);

    expect(parsed?.data?.deleted).toBe(1);
    expect(parsed?.data?.warning).toBe('Mutation ledger append failed; audit trail may be incomplete.');
    expect(parsed?.hints).toContain('Mutation ledger append failed; audit trail may be incomplete.');
  });
});

/* ───────────────────────────────────────────────────────────────
   SUITE: handleMemoryDelete - Causal Edge Cleanup
──────────────────────────────────────────────────────────────── */

describe('handleMemoryDelete - Causal Edge Cleanup', () => {
  it('EXT-CE1: Causal edges cleaned up on single delete', async (ctx) => {
    // Optional module — test skipped at runtime when causalEdgesMod unavailable
    if (!causalEdgesMod) { ctx.skip(); return; }
    if (!handler?.handleMemoryDelete || !vectorIndex) { throw new Error('Test setup incomplete: memory-crud handler or vector-index unavailable'); }
    const calls = installDeleteMocks({ deleteResult: true, dbAvailable: true });
    await handler.handleMemoryDelete({ id: 5 });
    expect(calls.causalDeleteEdges.length).toBeGreaterThan(0);
    expect(calls.causalDeleteEdges[0]).toBe('5');
  });

  it('EXT-CE2: Causal edge cleanup failure aborts delete transaction', async (ctx) => {
    // Optional module — test skipped at runtime when causalEdgesMod unavailable
    if (!causalEdgesMod) { ctx.skip(); return; }
    if (!handler?.handleMemoryDelete || !vectorIndex) { throw new Error('Test setup incomplete: memory-crud handler or vector-index unavailable'); }
    const calls = installDeleteMocks({ deleteResult: true, dbAvailable: true, edgeCleanupThrows: true });
    await expect(handler.handleMemoryDelete({ id: 3 })).rejects.toThrow('Mock edge cleanup error');
  });

  it('EXT-CE3: No edge cleanup when delete fails', async (ctx) => {
    // Optional module — test skipped at runtime when causalEdgesMod unavailable
    if (!causalEdgesMod) { ctx.skip(); return; }
    if (!handler?.handleMemoryDelete || !vectorIndex) { throw new Error('Test setup incomplete: memory-crud handler or vector-index unavailable'); }
    const calls = installDeleteMocks({ deleteResult: false, dbAvailable: true });
    await handler.handleMemoryDelete({ id: 999 });
    expect(calls.causalDeleteEdges).toHaveLength(0);
  });
});

/* ───────────────────────────────────────────────────────────────
   SUITE: handleMemoryDelete - Bulk Delete Transaction
──────────────────────────────────────────────────────────────── */

describe('handleMemoryDelete - Bulk Delete Transaction', () => {
  it('EXT-BD1: Bulk delete 3 memories succeeds', async () => {
    if (!handler?.handleMemoryDelete || !vectorIndex) { throw new Error('Test setup incomplete: memory-crud handler or vector-index unavailable'); }
    const calls = installBulkDeleteMocks({ memories: [{ id: 10 }, { id: 11 }, { id: 12 }] });
    const result = await handler.handleMemoryDelete({ specFolder: 'specs/test-folder', confirm: true });
    const parsed = parseResponse(result);
    expect(parsed?.data?.deleted).toBe(3);
    expect(calls.clearConstitutionalCache.length).toBeGreaterThan(0);
  });

  it('EXT-BD2: Bulk delete creates checkpoint', async (ctx) => {
    // Optional module — test skipped at runtime when checkpointsMod unavailable
    if (!checkpointsMod) { ctx.skip(); return; }
    if (!handler?.handleMemoryDelete || !vectorIndex) { throw new Error('Test setup incomplete: memory-crud handler or vector-index unavailable'); }
    const calls = installBulkDeleteMocks({ memories: [{ id: 20 }] });
    await handler.handleMemoryDelete({ specFolder: 'specs/test', confirm: true });
    expect(calls.createCheckpoint.length).toBeGreaterThan(0);
    expect(calls.createCheckpoint[0].name).toMatch(/^pre-cleanup-/);
  });

  it('EXT-BD3: Response includes checkpoint name', async (ctx) => {
    // Optional module — test skipped at runtime when checkpointsMod unavailable
    if (!checkpointsMod) { ctx.skip(); return; }
    if (!handler?.handleMemoryDelete || !vectorIndex) { throw new Error('Test setup incomplete: memory-crud handler or vector-index unavailable'); }
    const calls = installBulkDeleteMocks({ memories: [{ id: 30 }] });
    const result = await handler.handleMemoryDelete({ specFolder: 'specs/test', confirm: true });
    const parsed = parseResponse(result);
    expect(parsed?.data?.checkpoint).toBeDefined();
  });

  it('EXT-BD4: Checkpoint failure + confirm proceeds', async () => {
    if (!handler?.handleMemoryDelete || !vectorIndex) { throw new Error('Test setup incomplete: memory-crud handler or vector-index unavailable'); }
    const calls = installBulkDeleteMocks({ memories: [{ id: 40 }], checkpointThrows: true });
    const result = await handler.handleMemoryDelete({ specFolder: 'specs/test', confirm: true });
    const parsed = parseResponse(result);
    // With confirm=true, checkpoint failure should be non-fatal and delete should still succeed.
    expect(result?.isError).toBeFalsy();
    expect(parsed?.data?.deleted).toBe(1);
    expect(parsed?.summary).toMatch(/Deleted 1 memory/);
  });

  it('EXT-BD5: Bulk delete cleans causal edges for each memory', async (ctx) => {
    // Optional module — test skipped at runtime when causalEdgesMod unavailable
    if (!causalEdgesMod) { ctx.skip(); return; }
    if (!handler?.handleMemoryDelete || !vectorIndex) { throw new Error('Test setup incomplete: memory-crud handler or vector-index unavailable'); }
    const calls = installBulkDeleteMocks({ memories: [{ id: 50 }, { id: 51 }] });
    await handler.handleMemoryDelete({ specFolder: 'specs/test', confirm: true });
    expect(calls.causalDeleteEdges).toHaveLength(2);
    expect(calls.causalDeleteEdges).toContain('50');
    expect(calls.causalDeleteEdges).toContain('51');
  });

  it('EXT-BD6: Empty folder delete returns deleted=0', async () => {
    if (!handler?.handleMemoryDelete || !vectorIndex) { throw new Error('Test setup incomplete: memory-crud handler or vector-index unavailable'); }
    const calls = installBulkDeleteMocks({ memories: [] });
    const result = await handler.handleMemoryDelete({ specFolder: 'specs/empty', confirm: true });
    const parsed = parseResponse(result);
    expect(parsed?.data?.deleted).toBe(0);
  });

  it('EXT-BD7: Null checkpoint response omits restore metadata', async (ctx) => {
    // Optional module — test skipped at runtime when checkpointsMod unavailable
    if (!checkpointsMod) { ctx.skip(); return; }
    if (!handler?.handleMemoryDelete || !vectorIndex) { throw new Error('Test setup incomplete: memory-crud handler or vector-index unavailable'); }
    const calls = installBulkDeleteMocks({ memories: [{ id: 60 }], checkpointReturnsNull: true });
    const result = await handler.handleMemoryDelete({ specFolder: 'specs/test', confirm: true });
    const parsed = parseResponse(result);
    expect(parsed?.data?.deleted).toBe(1);
    expect(parsed?.data?.checkpoint).toBeUndefined();
    expect(parsed?.data?.restoreCommand).toBeUndefined();
    expect(calls.createCheckpoint.length).toBe(1);
  });

  it('EXT-BD8: Bulk delete with unavailable DB returns same E_DB_UNAVAILABLE envelope', async () => {
    if (!handler?.handleMemoryDelete || !vectorIndex) { throw new Error('Test setup incomplete: memory-crud handler or vector-index unavailable'); }
    const calls = installBulkDeleteMocks({ memories: [{ id: 70 }], dbAvailable: false });

    const result = await handler.handleMemoryDelete({ specFolder: 'specs/test', confirm: true });
    const parsed = parseResponse(result);

    expect(result?.isError).toBe(true);
    expect(parsed?.data?.code).toBe('E_DB_UNAVAILABLE');
    expect(parsed?.data?.error).toBe('Delete aborted: database unavailable');
    expect(parsed?.data?.details?.deleted).toBe(0);
    expect(calls.deleteMemory).toHaveLength(0);
  });
});

/* ───────────────────────────────────────────────────────────────
   SUITE: handleMemoryUpdate - Happy Path
──────────────────────────────────────────────────────────────── */

describe('handleMemoryUpdate - Happy Path', () => {
  it('EXT-U1: Same title skips embedding regen', async () => {
    if (!handler?.handleMemoryUpdate || !vectorIndex) { throw new Error('Test setup incomplete: memory-crud handler or vector-index unavailable'); }
    const calls = installUpdateMocks({ existingMemory: { id: 1, title: 'Same Title' } });
    const result = await handler.handleMemoryUpdate({ id: 1, title: 'Same Title' });
    const parsed = parseResponse(result);
    expect(parsed?.data?.embeddingRegenerated).toBe(false);
  });

  it('EXT-U2: Changed title triggers embedding regen', async (ctx) => {
    // Optional module — test skipped at runtime when embeddingsSourceMod unavailable
    if (!embeddingsSourceMod) { ctx.skip(); return; }
    if (!handler?.handleMemoryUpdate || !vectorIndex) { throw new Error('Test setup incomplete: memory-crud handler or vector-index unavailable'); }
    const calls = installUpdateMocks({ existingMemory: { id: 1, title: 'Old Title' } });
    const result = await handler.handleMemoryUpdate({ id: 1, title: 'New Title' });
    const parsed = parseResponse(result);
    expect(parsed?.data?.embeddingRegenerated).toBe(true);
  });

  it('EXT-U3: Metadata update includes all fields', async () => {
    if (!handler?.handleMemoryUpdate || !vectorIndex) { throw new Error('Test setup incomplete: memory-crud handler or vector-index unavailable'); }
    const calls = installUpdateMocks({ existingMemory: { id: 2, title: 'Test' } });
    const result = await handler.handleMemoryUpdate({
      id: 2,
      triggerPhrases: ['new trigger'],
      importanceWeight: 0.9,
      importanceTier: 'critical',
    });
    const parsed = parseResponse(result);
    expect(parsed?.data?.updated).toBe(2);
    const fields = parsed?.data?.fields;
    expect(fields).toContain('triggerPhrases');
    expect(fields).toContain('importanceWeight');
    expect(fields).toContain('importanceTier');
  });

  it('EXT-U3b: Update surfaces mutation-ledger append warnings', async (ctx) => {
    if (!mutationLedgerMod) { ctx.skip(); return; }
    if (!handler?.handleMemoryUpdate || !vectorIndex) { throw new Error('Test setup incomplete: memory-crud handler or vector-index unavailable'); }
    installUpdateMocks({ existingMemory: { id: 7, title: 'Old Title' } });
    vi.mocked(mutationLedgerMod.appendEntry).mockImplementationOnce(() => {
      throw new Error('ledger offline');
    });

    const result = await handler.handleMemoryUpdate({ id: 7, title: 'New Title' });
    const parsed = parseResponse(result);

    expect(parsed?.data?.updated).toBe(7);
    expect(parsed?.data?.mutationLedgerWarning).toBe('Mutation ledger append failed; audit trail may be incomplete.');
    expect(parsed?.hints).toContain('Mutation ledger append failed; audit trail may be incomplete.');
  });

  it('EXT-U4: Update clears caches', async () => {
    if (!handler?.handleMemoryUpdate || !vectorIndex) { throw new Error('Test setup incomplete: memory-crud handler or vector-index unavailable'); }
    const calls = installUpdateMocks({ existingMemory: { id: 3, title: 'Test' } });
    await handler.handleMemoryUpdate({ id: 3, importanceWeight: 0.5 });
    const cachesCleared = calls.clearCache.length > 0 || calls.invalidateOnWrite.length > 0;
    expect(cachesCleared).toBe(true);
    expect(calls.clearConstitutionalCache.length).toBeGreaterThan(0);
  });

  it('EXT-U5: Update non-existent memory throws', async () => {
    if (!handler?.handleMemoryUpdate || !vectorIndex) { throw new Error('Test setup incomplete: memory-crud handler or vector-index unavailable'); }
    const calls = installUpdateMocks({ existingMemory: null });
    try {
      await handler.handleMemoryUpdate({ id: 999 });
      // If no throw, fail
      expect(true).toBe(false);
    } catch (error: unknown) {
      const err = error as any;
      const isExpected = err.name === 'MemoryError' ||
                         (err.code && err.code.startsWith('E')) ||
                         err.message.includes('not found') ||
                         err.message.includes('Memory');
      expect(isExpected).toBe(true);
    }
  });
});

/* ───────────────────────────────────────────────────────────────
   SUITE: handleMemoryUpdate - Embedding Regeneration
──────────────────────────────────────────────────────────────── */

describe('handleMemoryUpdate - Embedding Regeneration', () => {
  it('EXT-ER1: Embedding failure without partial rolls back', async (ctx) => {
    // Optional module — test skipped at runtime when embeddingsSourceMod unavailable
    if (!embeddingsSourceMod) { ctx.skip(); return; }
    if (!handler?.handleMemoryUpdate || !vectorIndex) { throw new Error('Test setup incomplete: memory-crud handler or vector-index unavailable'); }
    const calls = installUpdateMocks({ existingMemory: { id: 1, title: 'Old' }, embeddingThrows: true });
    try {
      await handler.handleMemoryUpdate({ id: 1, title: 'New Title', allowPartialUpdate: false });
      expect(true).toBe(false); // should have thrown
    } catch (error: unknown) {
      const err = error as any;
      const isExpected = err.name === 'MemoryError' ||
                         err.message.includes('rolled back') ||
                         err.message.includes('Embedding');
      expect(isExpected).toBe(true);
    }
  });

  it('EXT-ER2: Partial update marks embedding pending', async (ctx) => {
    // Optional module — test skipped at runtime when embeddingsSourceMod unavailable
    if (!embeddingsSourceMod) { ctx.skip(); return; }
    if (!handler?.handleMemoryUpdate || !vectorIndex) { throw new Error('Test setup incomplete: memory-crud handler or vector-index unavailable'); }
    const calls = installUpdateMocks({ existingMemory: { id: 2, title: 'Old' }, embeddingThrows: true });
    const result = await handler.handleMemoryUpdate({ id: 2, title: 'New Title', allowPartialUpdate: true });
    const parsed = parseResponse(result);
    const hasPending = parsed?.data?.embeddingStatus === 'pending' || parsed?.data?.warning;
    expect(hasPending).toBeTruthy();
  });

  it('EXT-ER3: Null embedding without partial throws', async (ctx) => {
    // Optional module — test skipped at runtime when embeddingsSourceMod unavailable
    if (!embeddingsSourceMod) { ctx.skip(); return; }
    if (!handler?.handleMemoryUpdate || !vectorIndex) { throw new Error('Test setup incomplete: memory-crud handler or vector-index unavailable'); }
    const calls = installUpdateMocks({ existingMemory: { id: 3, title: 'Old' }, embeddingResult: null });
    try {
      await handler.handleMemoryUpdate({ id: 3, title: 'New Title', allowPartialUpdate: false });
      expect(true).toBe(false);
    } catch (error: unknown) {
      const err = error as any;
      const isExpected = err.message.includes('null') ||
                         err.message.includes('rolled back') ||
                         err.message.includes('Embedding') ||
                         err.name === 'MemoryError';
      expect(isExpected).toBe(true);
    }
  });

  it('EXT-ER4: Null embedding + partial marks pending', async (ctx) => {
    // Optional module — test skipped at runtime when embeddingsSourceMod unavailable
    if (!embeddingsSourceMod) { ctx.skip(); return; }
    if (!handler?.handleMemoryUpdate || !vectorIndex) { throw new Error('Test setup incomplete: memory-crud handler or vector-index unavailable'); }
    const calls = installUpdateMocks({ existingMemory: { id: 4, title: 'Old' }, embeddingResult: null });
    const result = await handler.handleMemoryUpdate({ id: 4, title: 'New Title', allowPartialUpdate: true });
    const parsed = parseResponse(result);
    const hasPending = (calls.updateEmbeddingStatus.length > 0 && calls.updateEmbeddingStatus[0].status === 'pending') ||
                       parsed?.data?.warning;
    expect(hasPending).toBeTruthy();
  });

  it('EXT-ER5: Embedding regen completes successfully', async (ctx) => {
    // Optional module — test skipped at runtime when embeddingsSourceMod unavailable
    if (!embeddingsSourceMod) { ctx.skip(); return; }
    if (!handler?.handleMemoryUpdate || !vectorIndex) { throw new Error('Test setup incomplete: memory-crud handler or vector-index unavailable'); }
    const calls = installUpdateMocks({ existingMemory: { id: 5, title: 'Old' }, embeddingResult: new Float32Array(768) });
    const result = await handler.handleMemoryUpdate({ id: 5, title: 'Brand New Title' });
    const parsed = parseResponse(result);
    expect(parsed?.data?.embeddingRegenerated).toBe(true);
  });
});

/* ───────────────────────────────────────────────────────────────
   SUITE: handleMemoryList - Happy Path
──────────────────────────────────────────────────────────────── */

describe('handleMemoryList - Happy Path', () => {
  it('EXT-L1: List returns proper structure', async () => {
    if (!handler?.handleMemoryList || !vectorIndex) { throw new Error('Test setup incomplete: memory-crud handler or vector-index unavailable'); }
    const rows = [
      { id: 1, spec_folder: 'specs/001-test', file_path: '/test/mem1.md', title: 'Memory One', trigger_phrases: '["hello"]', importance_weight: 0.8, created_at: '2025-01-01', updated_at: '2025-06-01' },
      { id: 2, spec_folder: 'specs/001-test', file_path: '/test/mem2.md', title: null, trigger_phrases: null, importance_weight: 0.5, created_at: '2025-02-01', updated_at: '2025-05-01' },
    ];
    installListMocks({ rows, total: 2 });
    const result = await handler.handleMemoryList({});
    const parsed = parseResponse(result);
    expect(parsed?.data?.total).toBe(2);
    expect(parsed?.data?.results).toHaveLength(2);
  });

  it('EXT-L2: Null title renders as "(untitled)"', async () => {
    if (!handler?.handleMemoryList || !vectorIndex) { throw new Error('Test setup incomplete: memory-crud handler or vector-index unavailable'); }
    const rows = [
      { id: 1, spec_folder: 'specs/test', file_path: '/p.md', title: null, trigger_phrases: null, importance_weight: 0.5, created_at: '2025-01-01', updated_at: '2025-01-01' },
    ];
    installListMocks({ rows, total: 1 });
    const result = await handler.handleMemoryList({});
    const parsed = parseResponse(result);
    expect(parsed?.data?.results[0].title).toBe('(untitled)');
  });

  it('EXT-L3: Empty list returns total=0, results=[]', async () => {
    if (!handler?.handleMemoryList || !vectorIndex) { throw new Error('Test setup incomplete: memory-crud handler or vector-index unavailable'); }
    installListMocks({ rows: [], total: 0 });
    const result = await handler.handleMemoryList({});
    const parsed = parseResponse(result);
    expect(parsed?.data?.total).toBe(0);
    expect(parsed?.data?.results).toHaveLength(0);
  });

  it('EXT-L4: List with limit/offset returns data', async () => {
    if (!handler?.handleMemoryList || !vectorIndex) { throw new Error('Test setup incomplete: memory-crud handler or vector-index unavailable'); }
    const rows = [{ id: 1, spec_folder: 's', file_path: 'f', title: 't', trigger_phrases: '[]', importance_weight: 0.5, created_at: 'c', updated_at: 'u' }];
    installListMocks({ rows, total: 50 });
    const result = await handler.handleMemoryList({ limit: 10, offset: 0 });
    const parsed = parseResponse(result);
    expect(parsed?.data?.total).toBe(50);
  });

  it('EXT-L5: Limit clamped to max 100', async () => {
    if (!handler?.handleMemoryList || !vectorIndex) { throw new Error('Test setup incomplete: memory-crud handler or vector-index unavailable'); }
    installListMocks({ rows: [], total: 0 });
    const result = await handler.handleMemoryList({ limit: 500 });
    const parsed = parseResponse(result);
    expect(parsed?.data?.limit).toBeLessThanOrEqual(100);
  });

  it('EXT-L6: No DB returns error response', async () => {
    if (!handler?.handleMemoryList || !vectorIndex) { throw new Error('Test setup incomplete: memory-crud handler or vector-index unavailable'); }
    vi.mocked(vectorIndex.getDb).mockImplementation(() => null);
    const result = await handler.handleMemoryList({});
    const isError = result?.isError === true ||
                    (parseResponse(result)?.summary || '').includes('Error');
    expect(isError).toBe(true);
  });

  it('EXT-L7: triggerCount parsed from JSON', async () => {
    if (!handler?.handleMemoryList || !vectorIndex) { throw new Error('Test setup incomplete: memory-crud handler or vector-index unavailable'); }
    const rows = [
      { id: 1, spec_folder: 's', file_path: 'f', title: 't', trigger_phrases: '["a","b","c"]', importance_weight: 0.5, created_at: 'c', updated_at: 'u' },
    ];
    installListMocks({ rows, total: 1 });
    const result = await handler.handleMemoryList({});
    const parsed = parseResponse(result);
    expect(parsed?.data?.results[0].triggerCount).toBe(3);
  });

  it('EXT-L8: parent-only listing is default, includeChunks bypasses filter', async () => {
    if (!handler?.handleMemoryList || !vectorIndex) {
      throw new Error('Test setup incomplete: memory-crud handler or vector-index unavailable');
    }

    const dbDefault = installListMocks({ rows: [], total: 0 });
    await handler.handleMemoryList({});
    expect(dbDefault._queries.some((sql: string) => sql.includes('parent_id IS NULL'))).toBe(true);

    const dbWithChunks = installListMocks({ rows: [], total: 0 });
    await handler.handleMemoryList({ includeChunks: true });
    expect(dbWithChunks._queries.some((sql: string) => sql.includes('parent_id IS NULL'))).toBe(false);
  });
});

/* ───────────────────────────────────────────────────────────────
   SUITE: handleMemoryStats - Happy Path
──────────────────────────────────────────────────────────────── */

describe('handleMemoryStats - Happy Path', () => {
  it('EXT-S1: Count-based stats returns structure', async () => {
    if (!handler?.handleMemoryStats || !vectorIndex) { throw new Error('Test setup incomplete: memory-crud handler or vector-index unavailable'); }
    installStatsMocks({
      total: 5,
      folderRows: [
        { spec_folder: 'specs/001-test', count: 3 },
        { spec_folder: 'specs/002-other', count: 2 },
      ],
    });
    const result = await handler.handleMemoryStats({ folderRanking: 'count' });
    const parsed = parseResponse(result);
    expect(parsed?.data?.totalMemories).toBe(5);
    expect(parsed?.data?.topFolders).toHaveLength(2);
  });

  it('EXT-S2: Stats includes status breakdown', async () => {
    if (!handler?.handleMemoryStats || !vectorIndex) { throw new Error('Test setup incomplete: memory-crud handler or vector-index unavailable'); }
    installStatsMocks({ statusCounts: { success: 10, pending: 2, failed: 1 } });
    const result = await handler.handleMemoryStats({});
    const parsed = parseResponse(result);
    expect(parsed?.data?.byStatus?.success).toBe(10);
  });

  it('EXT-S3: Stats includes date range', async () => {
    if (!handler?.handleMemoryStats || !vectorIndex) { throw new Error('Test setup incomplete: memory-crud handler or vector-index unavailable'); }
    installStatsMocks({ dates: { oldest: '2024-01-01', newest: '2025-06-01' } });
    const result = await handler.handleMemoryStats({});
    const parsed = parseResponse(result);
    expect(parsed?.data?.oldestMemory).toBe('2024-01-01');
  });

  it('EXT-S4: Null args uses defaults', async () => {
    if (!handler?.handleMemoryStats || !vectorIndex) { throw new Error('Test setup incomplete: memory-crud handler or vector-index unavailable'); }
    installStatsMocks({});
    const result = await handler.handleMemoryStats(null);
    const parsed = parseResponse(result);
    expect(typeof parsed?.data?.totalMemories).toBe('number');
  });

  it('EXT-S5: Stats returns without error', async () => {
    if (!handler?.handleMemoryStats || !vectorIndex) { throw new Error('Test setup incomplete: memory-crud handler or vector-index unavailable'); }
    installStatsMocks({ statusCounts: { success: 5, pending: 3, failed: 0 } });
    const result = await handler.handleMemoryStats({});
    const parsed = parseResponse(result);
    expect(parsed).not.toBeNull();
    expect(parsed?.data).toEqual(expect.objectContaining({
      totalMemories: expect.any(Number),
      byStatus: expect.any(Object),
      topFolders: expect.any(Array),
    }));
  });

  it('EXT-S6: Stats returns without error (no vector)', async () => {
    if (!handler?.handleMemoryStats || !vectorIndex) { throw new Error('Test setup incomplete: memory-crud handler or vector-index unavailable'); }
    installStatsMocks({ vectorSearchAvailable: false });
    const result = await handler.handleMemoryStats({});
    const parsed = parseResponse(result);
    expect(parsed).toBeDefined();
    expect(parsed?.data).toBeDefined();
  });

  it('EXT-S8: Stats exposes graph channel metrics from hybrid-search', async () => {
    if (!handler?.handleMemoryStats || !vectorIndex) { throw new Error('Test setup incomplete: memory-crud handler or vector-index unavailable'); }
    installStatsMocks({});
    const hybridSearch = await import('../lib/search/hybrid-search');

    const result = await handler.handleMemoryStats({});
    const parsed = parseResponse(result);

    expect(parsed?.data?.graphChannelMetrics).toEqual(hybridSearch.getGraphMetrics());
    expect(typeof parsed?.data?.graphChannelMetrics?.graphHitRate).toBe('number');
  });

  it('EXT-S7: No DB returns error response', async () => {
    if (!handler?.handleMemoryStats || !vectorIndex) { throw new Error('Test setup incomplete: memory-crud handler or vector-index unavailable'); }
    vi.mocked(vectorIndex.getDb).mockImplementation(() => null);
    vi.mocked(vectorIndex.getStatusCounts).mockImplementation(() => ({ success: 0, pending: 0, failed: 0 }));
    const result = await handler.handleMemoryStats({});
    const isError = result?.isError === true ||
                    (parseResponse(result)?.summary || '').includes('Error');
    expect(isError).toBe(true);
  });
});

/* ───────────────────────────────────────────────────────────────
   SUITE: handleMemoryStats - Folder Scoring
──────────────────────────────────────────────────────────────── */

describe('handleMemoryStats - Folder Scoring', () => {
  it('EXT-FS1: Composite ranking returns scored folders', async (ctx) => {
    // Optional module — test skipped at runtime when folderScoringSourceMod unavailable
    if (!folderScoringSourceMod) { ctx.skip(); return; }
    if (!handler?.handleMemoryStats || !vectorIndex) { throw new Error('Test setup incomplete: memory-crud handler or vector-index unavailable'); }
    const scoredFolders = [
      { folder: 'specs/001-top', simplified: '001-top', count: 5, score: 0.95, recencyScore: 0.9, importanceScore: 0.8, activityScore: 0.7, validationScore: 0.6, lastActivity: '2025-06-01', isArchived: false, topTier: 'critical' },
    ];
    installStatsMocks({ computeScoresResult: scoredFolders });
    const result = await handler.handleMemoryStats({ folderRanking: 'composite', includeScores: true });
    const parsed = parseResponse(result);
    expect(parsed?.data?.topFolders?.length).toBeGreaterThan(0);
    expect(parsed?.data?.topFolders[0].score).toBeDefined();
  });

  it('EXT-FS2: Scoring failure falls back gracefully', async (ctx) => {
    // Optional module — test skipped at runtime when folderScoringSourceMod unavailable
    if (!folderScoringSourceMod) { ctx.skip(); return; }
    if (!handler?.handleMemoryStats || !vectorIndex) { throw new Error('Test setup incomplete: memory-crud handler or vector-index unavailable'); }
    installStatsMocks({ computeScoresThrows: true });
    const result = await handler.handleMemoryStats({ folderRanking: 'recency' });
    const parsed = parseResponse(result);
    expect(Array.isArray(parsed?.data?.topFolders)).toBe(true);
  });

  it('EXT-FS3: Archived folders filtered out', async (ctx) => {
    // Optional module — test skipped at runtime when folderScoringSourceMod unavailable
    if (!folderScoringSourceMod) { ctx.skip(); return; }
    if (!handler?.handleMemoryStats || !vectorIndex) { throw new Error('Test setup incomplete: memory-crud handler or vector-index unavailable'); }
    installStatsMocks({
      folderRows: [
        { spec_folder: 'specs/001-active', count: 5 },
        { spec_folder: 'specs/z_archive/old', count: 3 },
      ],
    });
    const result = await handler.handleMemoryStats({ folderRanking: 'count', includeArchived: false });
    const parsed = parseResponse(result);
    const hasArchived = parsed?.data?.topFolders?.some((f: any) => (f.folder || '').includes('z_archive'));
    expect(hasArchived).toBeFalsy();
  });

  it('EXT-FS4: excludePatterns filters scratch folder', async (ctx) => {
    // Optional module — test skipped at runtime when folderScoringSourceMod unavailable
    if (!folderScoringSourceMod) { ctx.skip(); return; }
    if (!handler?.handleMemoryStats || !vectorIndex) { throw new Error('Test setup incomplete: memory-crud handler or vector-index unavailable'); }
    installStatsMocks({
      folderRows: [
        { spec_folder: 'specs/001-feature', count: 5 },
        { spec_folder: 'specs/scratch-test', count: 3 },
      ],
    });
    const result = await handler.handleMemoryStats({ folderRanking: 'count', excludePatterns: ['scratch'] });
    const parsed = parseResponse(result);
    const hasScratch = parsed?.data?.topFolders?.some((f: any) => (f.folder || '').includes('scratch'));
    expect(hasScratch).toBeFalsy();
  });
});

/* ───────────────────────────────────────────────────────────────
   SUITE: handleMemoryHealth - Happy Path
──────────────────────────────────────────────────────────────── */

describe('handleMemoryHealth - Happy Path', () => {
  it('EXT-H1: Healthy system returns status=healthy', async () => {
    if (!handler?.handleMemoryHealth || !vectorIndex) { throw new Error('Test setup incomplete: memory-crud handler or vector-index unavailable'); }
    handler.setEmbeddingModelReady(true);
    installHealthMocks({ dbAvailable: true, memoryCount: 42, vectorSearchAvailable: true });
    const result = await handler.handleMemoryHealth({});
    const parsed = parseResponse(result);
    expect(parsed?.data?.status).toBe('healthy');
  });

  it('EXT-H2: No DB returns status=degraded', async () => {
    if (!handler?.handleMemoryHealth || !vectorIndex) { throw new Error('Test setup incomplete: memory-crud handler or vector-index unavailable'); }
    handler.setEmbeddingModelReady(true);
    installHealthMocks({ dbAvailable: false });
    const result = await handler.handleMemoryHealth({});
    const parsed = parseResponse(result);
    expect(parsed?.data?.status).toBe('degraded');
  });

  it('EXT-H3: Model not ready returns degraded', async () => {
    if (!handler?.handleMemoryHealth || !vectorIndex) { throw new Error('Test setup incomplete: memory-crud handler or vector-index unavailable'); }
    handler.setEmbeddingModelReady(false);
    installHealthMocks({ dbAvailable: true, memoryCount: 10 });
    const result = await handler.handleMemoryHealth({});
    const parsed = parseResponse(result);
    expect(parsed?.data?.status).toBe('degraded');
  });

  it('EXT-H4: Health includes provider info', async (ctx) => {
    // Optional module — test skipped at runtime when embeddingsSourceMod unavailable
    if (!embeddingsSourceMod) { ctx.skip(); return; }
    if (!handler?.handleMemoryHealth || !vectorIndex) { throw new Error('Test setup incomplete: memory-crud handler or vector-index unavailable'); }
    handler.setEmbeddingModelReady(true);
    installHealthMocks({
      dbAvailable: true,
      providerMetadata: { provider: 'huggingface', model: 'gte-small', healthy: true },
      embeddingProfile: { dim: 384, getDatabasePath: (base: string) => base + '/gte.db' },
    });
    const result = await handler.handleMemoryHealth({});
    const parsed = parseResponse(result);
    expect(parsed?.data?.embeddingProvider?.provider).toBe('huggingface');
    expect(parsed?.data?.embeddingProvider?.dimension).toBe(384);
  });

  it('EXT-H4b: Health resolves lazy profile before reporting provider dimensions', async (ctx) => {
    if (!embeddingsSourceMod) { ctx.skip(); return; }
    if (!handler?.handleMemoryHealth || !vectorIndex) { throw new Error('Test setup incomplete: memory-crud handler or vector-index unavailable'); }
    handler.setEmbeddingModelReady(true);
    installHealthMocks({
      dbAvailable: true,
      providerMetadata: { provider: 'voyage' },
      embeddingProfile: null,
      embeddingProfileAsync: { provider: 'voyage', model: 'voyage-4', dim: 1024 },
      embeddingDimension: 768,
      modelName: 'voyage-4',
    });
    vi.mocked(embeddingsSourceMod.getProviderMetadata)
      .mockImplementationOnce(() => ({ provider: 'voyage' }))
      .mockImplementation(() => ({ provider: 'voyage', model: 'voyage-4', healthy: true, dim: 1024 }));

    const result = await handler.handleMemoryHealth({});
    const parsed = parseResponse(result);

    expect(embeddingsSourceMod.getEmbeddingProfileAsync).toHaveBeenCalledTimes(1);
    expect(parsed?.data?.embeddingProvider?.provider).toBe('voyage');
    expect(parsed?.data?.embeddingProvider?.model).toBe('voyage-4');
    expect(parsed?.data?.embeddingProvider?.dimension).toBe(1024);
  });

  it('EXT-H4c: Health falls back to configured model and dimension when lazy profile stays unavailable', async (ctx) => {
    if (!embeddingsSourceMod) { ctx.skip(); return; }
    if (!handler?.handleMemoryHealth || !vectorIndex) { throw new Error('Test setup incomplete: memory-crud handler or vector-index unavailable'); }
    handler.setEmbeddingModelReady(true);
    installHealthMocks({
      dbAvailable: true,
      providerMetadata: { provider: 'voyage', healthy: true },
      embeddingProfile: null,
      embeddingDimension: 1024,
      modelName: 'voyage-4',
    });

    const result = await handler.handleMemoryHealth({});
    const parsed = parseResponse(result);

    expect(parsed?.data?.embeddingProvider?.provider).toBe('voyage');
    expect(parsed?.data?.embeddingProvider?.model).toBe('voyage-4');
    expect(parsed?.data?.embeddingProvider?.dimension).toBe(1024);
  });

  it('EXT-H4d: Health handles getEmbeddingProfileAsync rejection gracefully', async (ctx) => {
    if (!embeddingsSourceMod) { ctx.skip(); return; }
    if (!handler?.handleMemoryHealth || !vectorIndex) {
      throw new Error('Test setup incomplete');
    }
    handler.setEmbeddingModelReady(true);
    installHealthMocks({
      dbAvailable: true,
      providerMetadata: { provider: 'voyage', healthy: true },
      embeddingProfile: null,
      embeddingDimension: 1024,
      modelName: 'voyage-4',
    });
    // Force getEmbeddingProfileAsync to reject (simulating network failure)
    vi.mocked(embeddingsSourceMod.getEmbeddingProfileAsync)
      .mockRejectedValueOnce(new Error('Network timeout'));

    const result = await handler.handleMemoryHealth({});
    const parsed = parseResponse(result);

    // Should NOT throw - handler catches the error and falls back
    expect(parsed).not.toBeNull();
    expect(parsed?.data?.embeddingProvider?.provider).toBe('voyage');
    // Should include a hint about the profile failure
    expect(parsed?.hints?.some((h: string) =>
      h.includes('Embedding profile unavailable')
    )).toBe(true);
  });

  it('EXT-H4e: Health sanitizes absolute profile-error paths that contain spaces', async (ctx) => {
    if (!embeddingsSourceMod) { ctx.skip(); return; }
    if (!handler?.handleMemoryHealth || !vectorIndex) {
      throw new Error('Test setup incomplete');
    }
    handler.setEmbeddingModelReady(true);
    installHealthMocks({
      dbAvailable: true,
      providerMetadata: { provider: 'voyage', healthy: true },
      embeddingProfile: null,
      embeddingDimension: 1024,
      modelName: 'voyage-4',
    });
    vi.mocked(embeddingsSourceMod.getEmbeddingProfileAsync)
      .mockRejectedValueOnce(
        new Error(
          'Profile load failed at /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/demo/file.md: dimension mismatch'
        )
      );

    const result = await handler.handleMemoryHealth({});
    const parsed = parseResponse(result);
    const profileHint = parsed?.hints?.find((hint: string) =>
      hint.includes('Embedding profile unavailable')
    );

    expect(profileHint).toContain('[path]');
    expect(profileHint).not.toContain('/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public');
  });

  it('EXT-H5: Health includes version', async () => {
    if (!handler?.handleMemoryHealth || !vectorIndex) { throw new Error('Test setup incomplete: memory-crud handler or vector-index unavailable'); }
    handler.setEmbeddingModelReady(true);
    installHealthMocks({ dbAvailable: true });
    const result = await handler.handleMemoryHealth({});
    const parsed = parseResponse(result);
    expect(parsed?.data?.version).toBeDefined();
  });

  it('EXT-H6: Health includes uptime', async () => {
    if (!handler?.handleMemoryHealth || !vectorIndex) { throw new Error('Test setup incomplete: memory-crud handler or vector-index unavailable'); }
    handler.setEmbeddingModelReady(true);
    installHealthMocks({ dbAvailable: true });
    const result = await handler.handleMemoryHealth({});
    const parsed = parseResponse(result);
    expect(typeof parsed?.data?.uptime).toBe('number');
    expect(parsed?.data?.uptime).toBeGreaterThan(0);
  });

  it('EXT-H7: Health completes without vector search', async () => {
    if (!handler?.handleMemoryHealth || !vectorIndex) { throw new Error('Test setup incomplete: memory-crud handler or vector-index unavailable'); }
    handler.setEmbeddingModelReady(true);
    installHealthMocks({ dbAvailable: true, vectorSearchAvailable: false });
    const result = await handler.handleMemoryHealth({});
    const parsed = parseResponse(result);
    expect(parsed).not.toBeNull();
    expect(parsed?.data).toEqual(expect.objectContaining({
      embeddingModelReady: expect.any(Boolean),
      databaseConnected: expect.any(Boolean),
      vectorSearchAvailable: false,
    }));
    // Reset
    handler.setEmbeddingModelReady(false);
  });

  it('EXT-H8: Health includes alias conflict summary', async () => {
    if (!handler?.handleMemoryHealth || !vectorIndex) { throw new Error('Test setup incomplete: memory-crud handler or vector-index unavailable'); }
    handler.setEmbeddingModelReady(true);
    installHealthMocks({
      dbAvailable: true,
      aliasRows: [
        { file_path: '/workspace/specs/02--system-spec-kit/001-test/memory/a.md', content_hash: 'hash-1' },
        { file_path: '/workspace/.opencode/specs/02--system-spec-kit/001-test/memory/a.md', content_hash: 'hash-1' },
      ],
    });
    const result = await handler.handleMemoryHealth({});
    const parsed = parseResponse(result);
    expect(parsed?.data?.aliasConflicts?.groups).toBe(1);
    expect(parsed?.data?.aliasConflicts?.identicalHashGroups).toBe(1);
    expect(parsed?.data?.aliasConflicts?.divergentHashGroups).toBe(0);
  });

  it('EXT-H9: Health hints include divergent alias warning', async () => {
    if (!handler?.handleMemoryHealth || !vectorIndex) { throw new Error('Test setup incomplete: memory-crud handler or vector-index unavailable'); }
    handler.setEmbeddingModelReady(true);
    installHealthMocks({
      dbAvailable: true,
      aliasRows: [
        { file_path: '/workspace/specs/02--system-spec-kit/002-test/memory/b.md', content_hash: 'hash-1' },
        { file_path: '/workspace/.opencode/specs/02--system-spec-kit/002-test/memory/b.md', content_hash: 'hash-2' },
      ],
    });
    const result = await handler.handleMemoryHealth({});
    const parsed = parseResponse(result);
    const hints = parsed?.hints || [];
    expect(hints.some((hint: string) => hint.includes('divergent content hashes'))).toBe(true);
  });

  it('EXT-H10: divergent_aliases mode returns compact divergent-only payload', async () => {
    if (!handler?.handleMemoryHealth || !vectorIndex) { throw new Error('Test setup incomplete: memory-crud handler or vector-index unavailable'); }
    handler.setEmbeddingModelReady(true);
    installHealthMocks({
      dbAvailable: true,
      aliasRows: [
        { file_path: '/workspace/specs/02--system-spec-kit/010-test/memory/a.md', content_hash: 'hash-1', spec_folder: '02--system-spec-kit/010-test' },
        { file_path: '/workspace/.opencode/specs/02--system-spec-kit/010-test/memory/a.md', content_hash: 'hash-2', spec_folder: '02--system-spec-kit/010-test' },
      ],
    });
    const result = await handler.handleMemoryHealth({ reportMode: 'divergent_aliases', limit: 20 });
    const parsed = parseResponse(result);
    expect(parsed?.data?.reportMode).toBe('divergent_aliases');
    expect(parsed?.data?.totalDivergentGroups).toBe(1);
    expect(parsed?.data?.returnedGroups).toBe(1);
    expect(parsed?.data?.groups?.[0]?.normalizedPath).toBe('specs/02--system-spec-kit/010-test/memory/a.md');
    expect(parsed?.data?.groups?.[0]?.variants?.map((variant: { filePath: string }) => variant.filePath)).toEqual([
      '.opencode/specs/02--system-spec-kit/010-test/memory/a.md',
      'specs/02--system-spec-kit/010-test/memory/a.md',
    ]);
    expect(parsed?.data?.embeddingProvider).toBeUndefined();
  });

  it('EXT-H10b: divergent_aliases mode normalizes Windows alias paths without leaking absolute prefixes', async () => {
    if (!handler?.handleMemoryHealth || !vectorIndex) { throw new Error('Test setup incomplete: memory-crud handler or vector-index unavailable'); }
    handler.setEmbeddingModelReady(true);
    installHealthMocks({
      dbAvailable: true,
      aliasRows: [
        { file_path: 'C:\\workspace\\specs\\02--system-spec-kit\\011-test\\memory\\b.md', content_hash: 'hash-1', spec_folder: '02--system-spec-kit/011-test' },
        { file_path: 'C:\\workspace\\.opencode\\specs\\02--system-spec-kit\\011-test\\memory\\b.md', content_hash: 'hash-2', spec_folder: '02--system-spec-kit/011-test' },
      ],
    });
    const result = await handler.handleMemoryHealth({ reportMode: 'divergent_aliases', limit: 20 });
    const parsed = parseResponse(result);
    expect(parsed?.data?.totalDivergentGroups).toBe(1);
    expect(parsed?.data?.returnedGroups).toBe(1);
    expect(parsed?.data?.groups?.[0]?.normalizedPath).toBe('specs/02--system-spec-kit/011-test/memory/b.md');
    expect(parsed?.data?.groups?.[0]?.variants?.map((variant: { filePath: string }) => variant.filePath)).toEqual([
      '.opencode/specs/02--system-spec-kit/011-test/memory/b.md',
      'specs/02--system-spec-kit/011-test/memory/b.md',
    ]);
  });

  it('EXT-H10c: divergent_aliases mode detects relative specs aliases and groups them correctly', async () => {
    if (!handler?.handleMemoryHealth || !vectorIndex) { throw new Error('Test setup incomplete: memory-crud handler or vector-index unavailable'); }
    handler.setEmbeddingModelReady(true);
    installHealthMocks({
      dbAvailable: true,
      aliasRows: [
        { file_path: 'specs/02--system-spec-kit/012-test/memory/c.md', content_hash: 'hash-1', spec_folder: '02--system-spec-kit/012-test' },
        { file_path: '.opencode/specs/02--system-spec-kit/012-test/memory/c.md', content_hash: 'hash-2', spec_folder: '02--system-spec-kit/012-test' },
      ],
    });
    const result = await handler.handleMemoryHealth({ reportMode: 'divergent_aliases', limit: 20 });
    const parsed = parseResponse(result);
    expect(parsed?.data?.totalDivergentGroups).toBe(1);
    expect(parsed?.data?.returnedGroups).toBe(1);
    expect(parsed?.data?.groups?.[0]?.normalizedPath).toBe('specs/02--system-spec-kit/012-test/memory/c.md');
    expect(parsed?.data?.groups?.[0]?.variants?.map((variant: { filePath: string }) => variant.filePath)).toEqual([
      '.opencode/specs/02--system-spec-kit/012-test/memory/c.md',
      'specs/02--system-spec-kit/012-test/memory/c.md',
    ]);
  });

  it('EXT-H11: divergent_aliases mode respects limit', async () => {
    if (!handler?.handleMemoryHealth || !vectorIndex) { throw new Error('Test setup incomplete: memory-crud handler or vector-index unavailable'); }
    handler.setEmbeddingModelReady(true);
    installHealthMocks({
      dbAvailable: true,
      aliasRows: [
        { file_path: '/workspace/specs/02--system-spec-kit/020-test/memory/a.md', content_hash: 'hash-1', spec_folder: '02--system-spec-kit/020-test' },
        { file_path: '/workspace/.opencode/specs/02--system-spec-kit/020-test/memory/a.md', content_hash: 'hash-2', spec_folder: '02--system-spec-kit/020-test' },
        { file_path: '/workspace/specs/02--system-spec-kit/021-test/memory/b.md', content_hash: 'hash-3', spec_folder: '02--system-spec-kit/021-test' },
        { file_path: '/workspace/.opencode/specs/02--system-spec-kit/021-test/memory/b.md', content_hash: 'hash-4', spec_folder: '02--system-spec-kit/021-test' },
      ],
    });
    const result = await handler.handleMemoryHealth({ reportMode: 'divergent_aliases', limit: 1 });
    const parsed = parseResponse(result);
    expect(parsed?.data?.totalDivergentGroups).toBe(2);
    expect(parsed?.data?.returnedGroups).toBe(1);
    const hints = parsed?.hints || [];
    expect(hints.some((hint: string) => hint.includes('More divergent alias groups available'))).toBe(true);
  });

  it('EXT-H12: autoRepair rebuilds FTS drift and records repair metadata', async (ctx) => {
    if (!handler?.handleMemoryHealth || !vectorIndex || !embeddingsSourceMod || !triggerMatcherMod?.refreshTriggerCache) {
      ctx.skip();
      return;
    }

    handler.setEmbeddingModelReady(true);

    let ftsCount = 2;
    const execMock = vi.fn(() => {
      ftsCount = 42;
    });
    const fakeDb = {
      prepare: (sql: string) => ({
        get: () => {
          if (sql.includes('FROM memory_index')) return { count: 42 };
          if (sql.includes('FROM memory_fts')) return { count: ftsCount };
          return null;
        },
        all: () => [],
      }),
      exec: execMock,
    };

    vi.mocked(vectorIndex.getDb).mockImplementation(() => fakeDb as any);
    vi.mocked(vectorIndex.isVectorSearchAvailable).mockImplementation(() => true);
    vi.mocked(embeddingsSourceMod.getProviderMetadata).mockImplementation(() => ({
      provider: 'test',
      model: 'test-model',
      healthy: true,
    }));
    vi.mocked(embeddingsSourceMod.getEmbeddingProfile).mockImplementation(() => ({
      dim: 768,
      getDatabasePath: (base: string) => `${base}/test.db`,
    }));
    vi.mocked(vectorIndex.verifyIntegrity).mockImplementation(() => ({
      totalMemories: 42,
      totalVectors: 42,
      orphanedVectors: 0,
      missingVectors: 0,
      orphanedFiles: [],
      orphanedChunks: 0,
      isConsistent: true,
    }));

    const refreshSpy = vi.spyOn(triggerMatcherMod, 'refreshTriggerCache').mockImplementation(() => undefined as never);

    try {
      const result = await handler.handleMemoryHealth({ autoRepair: true, confirmed: true });
      const parsed = parseResponse(result);

      expect(execMock).toHaveBeenCalledTimes(1);
      expect(refreshSpy).toHaveBeenCalledTimes(1);
      expect(parsed?.data?.repair).toEqual(expect.objectContaining({
        requested: true,
        attempted: true,
        repaired: true,
        partialSuccess: false,
      }));
      expect(parsed?.data?.repair?.actions).toContain('fts_rebuild');
      expect(parsed?.data?.repair?.actions).toContain('trigger_cache_refresh');
      expect(parsed?.hints?.some((hint: string) => hint.includes('Auto-repair completed'))).toBe(true);
    } finally {
      refreshSpy.mockRestore();
    }
  });

  it('EXT-H13: autoRepair marks partial success when FTS mismatch remains but orphan cleanup succeeds', async (ctx) => {
    if (
      !handler?.handleMemoryHealth ||
      !vectorIndex ||
      !embeddingsSourceMod ||
      !triggerMatcherMod?.refreshTriggerCache ||
      !causalEdgesMod?.init ||
      !causalEdgesMod?.cleanupOrphanedEdges
    ) {
      ctx.skip();
      return;
    }

    handler.setEmbeddingModelReady(true);

    let ftsCount = 2;
    const execMock = vi.fn(() => {
      ftsCount = 41;
    });
    const fakeDb = {
      prepare: (sql: string) => ({
        get: () => {
          if (sql.includes('FROM memory_index')) return { count: 42 };
          if (sql.includes('FROM memory_fts')) return { count: ftsCount };
          return null;
        },
        all: () => [],
      }),
      exec: execMock,
    };

    vi.mocked(vectorIndex.getDb).mockImplementation(() => fakeDb as any);
    vi.mocked(vectorIndex.isVectorSearchAvailable).mockImplementation(() => true);
    vi.mocked(embeddingsSourceMod.getProviderMetadata).mockImplementation(() => ({
      provider: 'test',
      model: 'test-model',
      healthy: true,
    }));
    vi.mocked(embeddingsSourceMod.getEmbeddingProfile).mockImplementation(() => ({
      dim: 768,
      getDatabasePath: (base: string) => `${base}/test.db`,
    }));
    vi.mocked(causalEdgesMod.init).mockImplementation(() => undefined);
    vi.mocked(causalEdgesMod.cleanupOrphanedEdges).mockImplementation(() => ({ deleted: 3 }));
    vi.mocked(vectorIndex.verifyIntegrity).mockImplementation(() => ({
      totalMemories: 42,
      totalVectors: 42,
      orphanedVectors: 0,
      missingVectors: 0,
      orphanedFiles: [],
      orphanedChunks: 0,
      isConsistent: true,
    }));

    const refreshSpy = vi.spyOn(triggerMatcherMod, 'refreshTriggerCache').mockImplementation(() => undefined as never);

    try {
      const result = await handler.handleMemoryHealth({ autoRepair: true, confirmed: true });
      const parsed = parseResponse(result);

      expect(execMock).toHaveBeenCalledTimes(1);
      expect(refreshSpy).toHaveBeenCalledTimes(1);
      expect(parsed?.data?.repair).toEqual(expect.objectContaining({
        requested: true,
        attempted: true,
        repaired: false,
        partialSuccess: true,
      }));
      expect(parsed?.data?.repair?.warnings).toEqual(
        expect.arrayContaining([expect.stringContaining('Post-repair mismatch persists')])
      );
      expect(parsed?.data?.repair?.actions).toContain('orphan_edges_cleaned:3');
    } finally {
      refreshSpy.mockRestore();
    }
  });

  it('EXT-H14: autoRepair marks partial success when FTS consistency check throws but orphan cleanup succeeds', async (ctx) => {
    if (
      !handler?.handleMemoryHealth ||
      !vectorIndex ||
      !embeddingsSourceMod ||
      !causalEdgesMod?.init ||
      !causalEdgesMod?.cleanupOrphanedEdges
    ) {
      ctx.skip();
      return;
    }

    handler.setEmbeddingModelReady(true);

    // Make the FTS consistency check throw before any repair attempt
    const fakeDb = {
      prepare: (_sql: string) => ({
        get: () => { throw new Error('FTS5 table corrupted'); },
        all: () => [],
      }),
      exec: vi.fn(),
    };

    vi.mocked(vectorIndex.getDb).mockImplementation(() => fakeDb as any);
    vi.mocked(vectorIndex.isVectorSearchAvailable).mockImplementation(() => true);
    vi.mocked(embeddingsSourceMod.getProviderMetadata).mockImplementation(() => ({
      provider: 'test',
      model: 'test-model',
      healthy: true,
    }));
    vi.mocked(embeddingsSourceMod.getEmbeddingProfile).mockImplementation(() => ({
      dim: 768,
      getDatabasePath: (base: string) => `${base}/test.db`,
    }));
    vi.mocked(causalEdgesMod.init).mockImplementation(() => undefined);
    vi.mocked(causalEdgesMod.cleanupOrphanedEdges).mockImplementation(() => ({ deleted: 2 }));
    vi.mocked(vectorIndex.verifyIntegrity).mockImplementation(() => ({
      totalMemories: 42,
      totalVectors: 42,
      orphanedVectors: 0,
      missingVectors: 0,
      orphanedFiles: [],
      orphanedChunks: 0,
      isConsistent: true,
    }));

    const result = await handler.handleMemoryHealth({ autoRepair: true, confirmed: true });
    const parsed = parseResponse(result);

    expect(parsed?.data?.repair).toEqual(expect.objectContaining({
      requested: true,
      attempted: true,
      repaired: false,
      partialSuccess: true,
    }));
    expect(parsed?.data?.repair?.errors).toEqual(
      expect.arrayContaining([expect.stringContaining('Consistency check failed before repair')])
    );
    expect(parsed?.data?.repair?.actions).toContain('orphan_edges_cleaned:2');
  });

  it('EXT-H15: autoRepair cleans orphaned vectors but preserves orphaned files under temp-root workspaces', async (ctx) => {
    if (
      !handler?.handleMemoryHealth ||
      !vectorIndex ||
      !embeddingsSourceMod ||
      !causalEdgesMod?.init ||
      !causalEdgesMod?.cleanupOrphanedEdges
    ) {
      ctx.skip();
      return;
    }

    handler.setEmbeddingModelReady(true);
    installHealthMocks({ dbAvailable: true, memoryCount: 42 });

    vi.mocked(embeddingsSourceMod.getProviderMetadata).mockImplementation(() => ({
      provider: 'test',
      model: 'test-model',
      healthy: true,
    }));
    vi.mocked(embeddingsSourceMod.getEmbeddingProfile).mockImplementation(() => ({
      dim: 768,
      getDatabasePath: (base: string) => `${base}/test.db`,
    }));
    vi.mocked(causalEdgesMod.init).mockImplementation(() => undefined);
    vi.mocked(causalEdgesMod.cleanupOrphanedEdges).mockImplementation(() => ({ deleted: 0 }));
    vi.mocked(vectorIndex.deleteMemory).mockImplementation(() => true);
    vi.mocked(vectorIndex.verifyIntegrity)
      .mockReturnValueOnce({
        totalMemories: 42,
        totalVectors: 45,
        orphanedVectors: 0,
        missingVectors: 2,
        orphanedFiles: [
          { id: 101, file_path: '/tmp/specs/123-scratch/a.md', reason: 'File no longer exists on filesystem' },
          { id: 102, file_path: '/tmp/workspaces/client-repo/specs/123-keep/b.md', reason: 'File no longer exists on filesystem' },
        ],
        orphanedChunks: 0,
        isConsistent: false,
        cleaned: { vectors: 3, chunks: 0 },
      })
      .mockReturnValueOnce({
        totalMemories: 42,
        totalVectors: 42,
        orphanedVectors: 0,
        missingVectors: 0,
        orphanedFiles: [
          { id: 101, file_path: '/tmp/specs/123-scratch/a.md', reason: 'File no longer exists on filesystem' },
          { id: 102, file_path: '/tmp/workspaces/client-repo/specs/123-keep/b.md', reason: 'File no longer exists on filesystem' },
        ],
        orphanedChunks: 0,
        isConsistent: false,
      });
    vi.mocked(vectorIndex.deleteMemory).mockClear();

    const result = await handler.handleMemoryHealth({ autoRepair: true, confirmed: true });
    const parsed = parseResponse(result);

    expect(vi.mocked(vectorIndex.deleteMemory)).not.toHaveBeenCalled();
    expect(parsed?.data?.repair?.repaired).toBe(true);
    expect(parsed?.data?.repair?.actions).toContain('orphan_vectors_cleaned:3');
    expect(parsed?.data?.repair?.actions).not.toEqual(
      expect.arrayContaining([expect.stringMatching(/^temp_fixture_memories_deleted:/)])
    );
    expect(parsed?.hints).toEqual(
      expect.arrayContaining([
        expect.stringContaining('removed 3 orphaned vector'),
      ])
    );
    expect(parsed?.hints).not.toEqual(
      expect.arrayContaining([expect.stringContaining('temp fixture memory row')])
    );
    expect(parsed?.data?.repair?.warnings).toEqual(
      expect.arrayContaining([expect.stringContaining('orphanedFiles=2')])
    );
  });
});

/* ───────────────────────────────────────────────────────────────
   SUITE: setEmbeddingModelReady
──────────────────────────────────────────────────────────────── */

describe('setEmbeddingModelReady', () => {
  it('EXT-EMR1: setEmbeddingModelReady(true) reflected in health', async () => {
    if (!handler?.setEmbeddingModelReady || !handler?.handleMemoryHealth || !vectorIndex) { throw new Error('Test setup incomplete: memory-crud handler or vector-index unavailable'); }
    handler.setEmbeddingModelReady(true);
    installHealthMocks({ dbAvailable: true });
    const result = await handler.handleMemoryHealth({});
    const parsed = parseResponse(result);
    expect(parsed?.data?.embeddingModelReady).toBe(true);
  });

  it('EXT-EMR2: setEmbeddingModelReady(false) -> degraded', async () => {
    if (!handler?.setEmbeddingModelReady || !handler?.handleMemoryHealth || !vectorIndex) { throw new Error('Test setup incomplete: memory-crud handler or vector-index unavailable'); }
    handler.setEmbeddingModelReady(false);
    installHealthMocks({ dbAvailable: true });
    const result = await handler.handleMemoryHealth({});
    const parsed = parseResponse(result);
    expect(parsed?.data?.embeddingModelReady).toBe(false);
    expect(parsed?.data?.status).toBe('degraded');
  });

  it('EXT-EMR3: Toggle sequence ends healthy', async () => {
    if (!handler?.setEmbeddingModelReady || !handler?.handleMemoryHealth || !vectorIndex) { throw new Error('Test setup incomplete: memory-crud handler or vector-index unavailable'); }
    handler.setEmbeddingModelReady(true);
    handler.setEmbeddingModelReady(false);
    handler.setEmbeddingModelReady(true);
    installHealthMocks({ dbAvailable: true });
    const result = await handler.handleMemoryHealth({});
    const parsed = parseResponse(result);
    expect(parsed?.data?.status).toBe('healthy');
    // Cleanup
    handler.setEmbeddingModelReady(false);
  });
});

/* ───────────────────────────────────────────────────────────────
   SUITE: MCP Response Envelope Structure
──────────────────────────────────────────────────────────────── */

describe('MCP Response Envelope Structure', () => {
  it('EXT-ENV1: Success response envelope structure', async () => {
    if (!handler?.handleMemoryDelete || !vectorIndex) { throw new Error('Test setup incomplete: memory-crud handler or vector-index unavailable'); }
    const calls = installDeleteMocks({ deleteResult: true });
    const result = await handler.handleMemoryDelete({ id: 1 });
    expect(result?.content?.[0]?.type).toBe('text');
    expect(result?.isError).toBe(false);
  });

  it('EXT-ENV2: Envelope has summary, data, hints, meta', async () => {
    if (!handler?.handleMemoryDelete || !vectorIndex) { throw new Error('Test setup incomplete: memory-crud handler or vector-index unavailable'); }
    const calls = installDeleteMocks({ deleteResult: true });
    const result = await handler.handleMemoryDelete({ id: 1 });
    const parsed = parseResponse(result);
    expect(parsed?.summary).toBeDefined();
    expect(parsed?.data).toBeDefined();
    expect(parsed?.hints).toBeDefined();
    expect(parsed?.meta).toBeDefined();
  });

  it('EXT-ENV3: Error response has isError=true', async () => {
    if (!handler?.handleMemoryList || !vectorIndex) { throw new Error('Test setup incomplete: memory-crud handler or vector-index unavailable'); }
    vi.mocked(vectorIndex.getDb).mockImplementation(() => null);
    const result = await handler.handleMemoryList({});
    expect(result?.isError).toBe(true);
  });
});

describe('Mutation ledger wiring', () => {
  it('EXT-ML1: single delete logs a delete mutation', async (ctx) => {
    // Optional module — test skipped at runtime when mutationLedgerMod unavailable
    if (!mutationLedgerMod) { ctx.skip(); return; }
    if (!handler?.handleMemoryDelete || !vectorIndex) { throw new Error('Test setup incomplete: memory-crud handler or vector-index unavailable'); }
    installDeleteMocks({ deleteResult: true, dbAvailable: true });
    const ledgerCalls = installMutationLedgerMocks();

    await handler.handleMemoryDelete({ id: 42 });

    expect(ledgerCalls.initLedger.length).toBeGreaterThan(0);
    expect(ledgerCalls.appendEntry.length).toBe(1);
    expect(ledgerCalls.appendEntry[0].mutation_type).toBe('delete');
    expect(ledgerCalls.appendEntry[0].linked_memory_ids).toEqual([42]);
  });

  it('EXT-ML2: bulk delete logs one ledger entry per deleted memory', async (ctx) => {
    // Optional module — test skipped at runtime when mutationLedgerMod unavailable
    if (!mutationLedgerMod) { ctx.skip(); return; }
    if (!handler?.handleMemoryDelete || !vectorIndex) { throw new Error('Test setup incomplete: memory-crud handler or vector-index unavailable'); }
    installBulkDeleteMocks({ memories: [{ id: 90 }, { id: 91 }], dbAvailable: true });
    const ledgerCalls = installMutationLedgerMocks();

    await handler.handleMemoryDelete({ specFolder: 'specs/test', confirm: true });

    expect(ledgerCalls.appendEntry.length).toBe(2);
    expect(ledgerCalls.appendEntry[0].mutation_type).toBe('delete');
    expect(ledgerCalls.appendEntry[1].mutation_type).toBe('delete');
  });

  it('EXT-ML3: memory update logs an update mutation', async (ctx) => {
    // Optional module — test skipped at runtime when mutationLedgerMod unavailable
    if (!mutationLedgerMod) { ctx.skip(); return; }
    if (!handler?.handleMemoryUpdate || !vectorIndex) { throw new Error('Test setup incomplete: memory-crud handler or vector-index unavailable'); }
    installUpdateMocks({ existingMemory: { id: 7, title: 'Old title', content_hash: 'old-hash' } });
    vi.mocked(vectorIndex.getDb).mockImplementation(() => ({
      prepare: (_sql: string) => ({
        get: (_id: number) => ({ id: 7, content_hash: 'old-hash', spec_folder: 'specs/test', file_path: '/tmp/memory.md' }),
      }),
      transaction: (fn: Function) => fn,
    }));
    const ledgerCalls = installMutationLedgerMocks();

    await handler.handleMemoryUpdate({ id: 7, importanceWeight: 0.8 });

    expect(ledgerCalls.appendEntry.length).toBe(1);
    expect(ledgerCalls.appendEntry[0].mutation_type).toBe('update');
    expect(ledgerCalls.appendEntry[0].linked_memory_ids).toEqual([7]);
  });
});
