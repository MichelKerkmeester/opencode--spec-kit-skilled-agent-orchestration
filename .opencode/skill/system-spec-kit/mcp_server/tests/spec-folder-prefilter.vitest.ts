// TEST: Spec Folder Pre-filter
//
// Verifies that specFolder is correctly forwarded through the
// Search pipeline so results are pre-filtered at the DB layer
// (before entering the scoring pipeline), reducing latency for
// Scoped queries.
//
// Test plan:
// 1. specFolder forwarded in Stage 1 — vector channel
// 2. specFolder forwarded in Stage 1 — hybrid channel
// 3. specFolder forwarded in Stage 1 — multi-concept channel
// 4. specFolder forwarded in Stage 1 — constitutional injection
// 5. Unscoped queries — no folder restriction applied
// 6. Edge case: specFolder specified but no memories in that folder
// 7. structuralSearch (hybrid fallback Tier 3) respects specFolder
// 8. Stage 1 metadata consistency invariants
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import Database from 'better-sqlite3';

// -- Module-level mocks (vi.mock hoisted before all imports) ---
//
// Rule: mocks must be declared with vi.mock() at the top so Vitest
// Hoisting places them before the module-under-test is imported.

// Capture call arguments for vectorSearch and multiConceptSearch
const mockVectorSearchCalls: Array<[unknown, unknown]> = [];
const mockMultiConceptSearchCalls: Array<[unknown, unknown]> = [];

vi.mock('../lib/search/vector-index', () => ({
  vectorSearch: vi.fn((...args) => {
    mockVectorSearchCalls.push(args as [unknown, unknown]);
    return [];
  }),
  multiConceptSearch: vi.fn((...args) => {
    mockMultiConceptSearchCalls.push(args as [unknown, unknown]);
    return [];
  }),
}));

// Capture call arguments for the Stage 1 hybrid raw-collector path.
// Use importOriginal to keep init, structuralSearch, and other real exports.
const mockHybridSearchCalls: Array<[unknown, unknown, unknown]> = [];

vi.mock('../lib/search/hybrid-search', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../lib/search/hybrid-search')>();
  const mockStage1HybridSearch = vi.fn(async (...args) => {
    mockHybridSearchCalls.push(args as [unknown, unknown, unknown]);
    return [];
  });
  return {
    ...actual,
    searchWithFallback: mockStage1HybridSearch,
    collectRawCandidates: mockStage1HybridSearch,
  };
});

vi.mock('../lib/providers/embeddings', () => ({
  generateQueryEmbedding: vi.fn(async () => new Float32Array(768).fill(0.1)),
}));

// BM25 — prevent filesystem access during hybrid-search init
vi.mock('../lib/search/bm25-index', () => ({
  getIndex: vi.fn(() => ({
    search: vi.fn(() => []),
    getStats: vi.fn(() => ({ documentCount: 0 })),
  })),
  sanitizeFTS5Query: vi.fn((q: string) => q),
}));

// Sqlite-fts — prevent DB access
vi.mock('../lib/search/sqlite-fts', () => ({
  fts5Bm25Search: vi.fn(() => []),
}));

// Query-expander — safe no-op
vi.mock('../lib/search/query-expander', () => ({
  expandQuery: vi.fn((q: string) => [q]),
}));

// Embedding-expansion — safe no-ops (R12 feature, flag-gated)
vi.mock('../lib/search/embedding-expansion', () => ({
  isExpansionActive: vi.fn(() => false),
  expandQueryWithEmbeddings: vi.fn(async () => []),
}));

// Search-flags — disable all optional features to keep tests deterministic
vi.mock('../lib/search/search-flags', () => ({
  isMultiQueryEnabled: vi.fn(() => false),
  isEmbeddingExpansionEnabled: vi.fn(() => false),
  isSearchFallbackEnabled: vi.fn(() => false),
  isTemporalContiguityEnabled: vi.fn(() => false),
  isTRMEnabled: vi.fn(() => false),
  isNegativeFeedbackEnabled: vi.fn(() => false),
  isMemorySummariesEnabled: vi.fn(() => false),
  isGraphConceptRoutingEnabled: vi.fn(() => false),
  isQuerySurrogatesEnabled: vi.fn(() => false),
  isHyDEEnabled: vi.fn(() => false),
  isLlmReformulationEnabled: vi.fn(() => false),
  isQueryDecompositionEnabled: vi.fn(() => false),
  isSessionRetrievalStateEnabled: vi.fn(() => false),
  isProgressiveDisclosureEnabled: vi.fn(() => false),
}));

// -- Import module under test AFTER mocks ----------------------
import { executeStage1 } from '../lib/search/pipeline/stage1-candidate-gen';
import type { Stage1Input, PipelineConfig } from '../lib/search/pipeline/types';
import { structuralSearch, init } from '../lib/search/hybrid-search';

// -- Helpers ---------------------------------------------------

/**
 * Build a minimal valid PipelineConfig for Stage 1 testing.
 */
function makePipelineConfig(overrides: Partial<PipelineConfig> = {}): PipelineConfig {
  return {
    query: 'test query',
    searchType: 'vector',
    mode: undefined,
    limit: 10,
    specFolder: undefined,
    tier: undefined,
    contextType: undefined,
    includeArchived: false,
    includeConstitutional: false,
    includeContent: false,
    anchors: undefined,
    qualityThreshold: undefined,
    minState: 'WARM',
    applyStateLimits: false,
    useDecay: false,
    rerank: false,
    applyLengthPenalty: false,
    sessionId: undefined,
    enableDedup: false,
    enableSessionBoost: false,
    enableCausalBoost: false,
    trackAccess: false,
    detectedIntent: null,
    intentConfidence: 0,
    intentWeights: null,
    ...overrides,
  };
}

/** Clear accumulated mock call logs between tests. */
function clearCallLogs(): void {
  mockVectorSearchCalls.length = 0;
  mockMultiConceptSearchCalls.length = 0;
  mockHybridSearchCalls.length = 0;
}

// -- In-memory DB helpers (for structuralSearch tests) ---------

function createTestDb(): Database.Database {
  const db = new Database(':memory:');
  db.exec(`
    CREATE TABLE IF NOT EXISTS memory_index (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      file_path TEXT NOT NULL DEFAULT '',
      importance_tier TEXT DEFAULT 'normal',
      importance_weight REAL DEFAULT 0.5,
      spec_folder TEXT,
      is_archived INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);
  return db;
}

function seedRows(
  db: Database.Database,
  rows: Array<{
    title: string;
    file_path?: string;
    importance_tier?: string;
    importance_weight?: number;
    spec_folder?: string | null;
  }>
): void {
  const stmt = db.prepare(
    `INSERT INTO memory_index (title, file_path, importance_tier, importance_weight, spec_folder)
     VALUES (?, ?, ?, ?, ?)`
  );
  for (const row of rows) {
    stmt.run(
      row.title,
      row.file_path ?? '/test.md',
      row.importance_tier ?? 'normal',
      row.importance_weight ?? 0.5,
      row.spec_folder ?? null,
    );
  }
}

// ═══════════════════════════════════════════════════════════════
// 1. Stage 1 — specFolder forwarded to vector channel
// ═══════════════════════════════════════════════════════════════

describe('R9: Stage 1 spec-folder forwarding — vector channel', () => {
  beforeEach(() => clearCallLogs());

  it('R9-01: vectorSearch is called with specFolder when provided', async () => {
    const input: Stage1Input = {
      config: makePipelineConfig({
        searchType: 'vector',
        specFolder: 'specs/005-my-folder',
      }),
    };

    await executeStage1(input);

    // At least one call to vectorSearch must have occurred.
    expect(mockVectorSearchCalls.length).toBeGreaterThanOrEqual(1);

    // The primary vector channel call must carry specFolder.
    const firstCallOptions = mockVectorSearchCalls[0]?.[1] ?? {};
    expect(firstCallOptions).toMatchObject({ specFolder: 'specs/005-my-folder' });
  });

  it('R9-02: vectorSearch is called with no specFolder (falsy) when not provided', async () => {
    const input: Stage1Input = {
      config: makePipelineConfig({
        searchType: 'vector',
        specFolder: undefined,
      }),
    };

    await executeStage1(input);

    expect(mockVectorSearchCalls.length).toBeGreaterThanOrEqual(1);

    // When no specFolder is set, the option must be absent or null/undefined.
    const firstCallOptions = mockVectorSearchCalls[0]?.[1] as { specFolder?: string | null } | undefined;
    expect(firstCallOptions?.specFolder == null).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════
// 2. Stage 1 — specFolder forwarded to hybrid channel
// ═══════════════════════════════════════════════════════════════

describe('R9: Stage 1 spec-folder forwarding — hybrid channel', () => {
  beforeEach(() => clearCallLogs());

  it('R9-03: searchWithFallback is called with specFolder when provided', async () => {
    const input: Stage1Input = {
      config: makePipelineConfig({
        searchType: 'hybrid',
        specFolder: 'specs/042-rag-fusion',
      }),
    };

    await executeStage1(input);

    expect(mockHybridSearchCalls.length).toBeGreaterThanOrEqual(1);

    // SearchWithFallback signature: (query, embedding, options) — options is index 2
    const callOptions = mockHybridSearchCalls[0]?.[2] ?? {};
    expect(callOptions).toMatchObject({ specFolder: 'specs/042-rag-fusion' });
  });

  it('R9-04: searchWithFallback is called with no specFolder when not provided', async () => {
    const input: Stage1Input = {
      config: makePipelineConfig({
        searchType: 'hybrid',
        specFolder: undefined,
      }),
    };

    await executeStage1(input);

    expect(mockHybridSearchCalls.length).toBeGreaterThanOrEqual(1);

    const callOptions = mockHybridSearchCalls[0]?.[2] as { specFolder?: string | null } | undefined;
    expect(callOptions?.specFolder == null).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════
// 3. Stage 1 — specFolder forwarded to multi-concept channel
// ═══════════════════════════════════════════════════════════════

describe('R9: Stage 1 spec-folder forwarding — multi-concept channel', () => {
  beforeEach(() => clearCallLogs());

  it('R9-05: multiConceptSearch is called with specFolder when provided', async () => {
    const input: Stage1Input = {
      config: makePipelineConfig({
        searchType: 'multi-concept',
        concepts: ['hybrid RAG', 'vector search'],
        specFolder: 'specs/018-sprint5',
      }),
    };

    await executeStage1(input);

    expect(mockMultiConceptSearchCalls.length).toBeGreaterThanOrEqual(1);

    // MultiConceptSearch(embeddings, options) — options is index 1
    const callOptions = mockMultiConceptSearchCalls[0]?.[1] ?? {};
    expect(callOptions).toMatchObject({ specFolder: 'specs/018-sprint5' });
  });

  it('R9-06: multiConceptSearch is called with no specFolder when not provided', async () => {
    const input: Stage1Input = {
      config: makePipelineConfig({
        searchType: 'multi-concept',
        concepts: ['authentication', 'token'],
        specFolder: undefined,
      }),
    };

    await executeStage1(input);

    expect(mockMultiConceptSearchCalls.length).toBeGreaterThanOrEqual(1);

    const callOptions = mockMultiConceptSearchCalls[0]?.[1] as { specFolder?: string | null } | undefined;
    expect(callOptions?.specFolder == null).toBe(true);
  });

  it('R9-06b: multi-concept rejects more than 5 concepts', async () => {
    const input: Stage1Input = {
      config: makePipelineConfig({
        searchType: 'multi-concept',
        concepts: ['a', 'b', 'c', 'd', 'e', 'f'], // 6 — exceeds maximum
        specFolder: 'specs/018-sprint5',
      }),
    };

    await expect(executeStage1(input)).rejects.toThrow(/Maximum 5 concepts/);
  });
});

// ═══════════════════════════════════════════════════════════════
// 4. Stage 1 — constitutional injection also carries specFolder
// ═══════════════════════════════════════════════════════════════

describe('R9: Stage 1 spec-folder forwarding — constitutional injection', () => {
  beforeEach(() => clearCallLogs());

  it('R9-07: all vectorSearch calls (primary + constitutional) carry the same specFolder', async () => {
    // When includeConstitutional is true and the primary channel returns no constitutional
    // Results, Stage 1 does an extra vectorSearch call with tier='constitutional'.
    // Both calls must carry the same specFolder.
    const input: Stage1Input = {
      config: makePipelineConfig({
        searchType: 'vector',
        specFolder: 'specs/007-auth',
        includeConstitutional: true,
      }),
    };

    await executeStage1(input);

    // At least the primary vector channel call.
    expect(mockVectorSearchCalls.length).toBeGreaterThanOrEqual(1);

    // All calls to vectorSearch — primary channel + constitutional injection — must carry specFolder.
    for (const [, opts] of mockVectorSearchCalls) {
      expect((opts as Record<string, unknown>).specFolder).toBe('specs/007-auth');
    }
  });
});

// ═══════════════════════════════════════════════════════════════
// 5. Unscoped queries — no folder restriction applied
// ═══════════════════════════════════════════════════════════════

describe('R9: Unscoped queries — cross-folder behaviour', () => {
  beforeEach(() => clearCallLogs());

  it('R9-08: no specFolder means no folder filter in vectorSearch options', async () => {
    // SpecFolder being absent/null in the options object means the DB layer will
    // Not apply a WHERE spec_folder = ? clause, producing cross-folder results.
    const input: Stage1Input = {
      config: makePipelineConfig({
        searchType: 'vector',
        specFolder: undefined,
      }),
    };

    await executeStage1(input);

    expect(mockVectorSearchCalls.length).toBeGreaterThanOrEqual(1);

    for (const [, opts] of mockVectorSearchCalls) {
      expect((opts as Record<string, unknown>).specFolder == null).toBe(true);
    }
  });

  it('R9-09: no specFolder means no folder filter in searchWithFallback options', async () => {
    const input: Stage1Input = {
      config: makePipelineConfig({
        searchType: 'hybrid',
        specFolder: undefined,
      }),
    };

    await executeStage1(input);

    expect(mockHybridSearchCalls.length).toBeGreaterThanOrEqual(1);

    for (const [, , opts] of mockHybridSearchCalls) {
      expect((opts as Record<string, unknown>).specFolder == null).toBe(true);
    }
  });

  it('R9-09b: no specFolder means no folder filter in multiConceptSearch options', async () => {
    const input: Stage1Input = {
      config: makePipelineConfig({
        searchType: 'multi-concept',
        concepts: ['concept one', 'concept two'],
        specFolder: undefined,
      }),
    };

    await executeStage1(input);

    expect(mockMultiConceptSearchCalls.length).toBeGreaterThanOrEqual(1);

    for (const [, opts] of mockMultiConceptSearchCalls) {
      expect((opts as Record<string, unknown>).specFolder == null).toBe(true);
    }
  });
});

// ═══════════════════════════════════════════════════════════════
// 6. Edge case: specFolder specified but no memories in that folder
// ═══════════════════════════════════════════════════════════════

describe('R9: Edge case — specFolder with no matching memories', () => {
  beforeEach(() => clearCallLogs());

  it('R9-10: returns empty candidates when vectorSearch returns [] for non-existent specFolder', async () => {
    // Mock returns [] — simulates the DB pre-filter eliminating all rows.
    const input: Stage1Input = {
      config: makePipelineConfig({
        searchType: 'vector',
        specFolder: 'specs/999-nonexistent',
      }),
    };

    const output = await executeStage1(input);

    expect(output.candidates).toEqual([]);
    expect(output.metadata.candidateCount).toBe(0);
    // The specFolder must still have been forwarded correctly.
    expect(mockVectorSearchCalls.length).toBeGreaterThanOrEqual(1);
    expect(mockVectorSearchCalls[0]?.[1]).toMatchObject({ specFolder: 'specs/999-nonexistent' });
  });

  it('R9-11: returns empty candidates when searchWithFallback returns [] for non-existent specFolder', async () => {
    const input: Stage1Input = {
      config: makePipelineConfig({
        searchType: 'hybrid',
        specFolder: 'specs/999-nonexistent',
      }),
    };

    const output = await executeStage1(input);

    expect(output.candidates).toEqual([]);
    expect(output.metadata.candidateCount).toBe(0);
    expect(mockHybridSearchCalls.length).toBeGreaterThanOrEqual(1);
    expect(mockHybridSearchCalls[0]?.[2]).toMatchObject({ specFolder: 'specs/999-nonexistent' });
  });

  it('R9-12: returns empty candidates when multiConceptSearch returns [] for non-existent specFolder', async () => {
    const input: Stage1Input = {
      config: makePipelineConfig({
        searchType: 'multi-concept',
        concepts: ['authentication', 'session management'],
        specFolder: 'specs/999-nonexistent',
      }),
    };

    const output = await executeStage1(input);

    expect(output.candidates).toEqual([]);
    expect(output.metadata.candidateCount).toBe(0);
    expect(mockMultiConceptSearchCalls.length).toBeGreaterThanOrEqual(1);
    expect(mockMultiConceptSearchCalls[0]?.[1]).toMatchObject({ specFolder: 'specs/999-nonexistent' });
  });
});

// ═══════════════════════════════════════════════════════════════
// 7. structuralSearch (hybrid fallback Tier 3) — real DB tests
// These tests import the actual `structuralSearch` + `init`
// (via importOriginal in the mock), and use an in-memory SQLite DB.
// ═══════════════════════════════════════════════════════════════

describe('R9: structuralSearch (fallback Tier 3) respects specFolder', () => {
  let testDb: Database.Database;

  beforeEach(() => {
    testDb = createTestDb();
    seedRows(testDb, [
      { title: 'Alpha Auth',  spec_folder: 'specs/001-auth',   importance_tier: 'critical',  importance_weight: 0.9 },
      { title: 'Beta Config', spec_folder: 'specs/002-config', importance_tier: 'important', importance_weight: 0.7 },
      { title: 'Alpha Notes', spec_folder: 'specs/001-auth',   importance_tier: 'normal',    importance_weight: 0.5 },
    ]);
    init(testDb, null);
  });

  afterEach(() => {
    testDb.close();
  });

  it('R9-13: with specFolder — returns only memories from that folder', () => {
    const results = structuralSearch({ specFolder: 'specs/001-auth', limit: 10 });

    expect(results.length).toBe(2);
    expect(results.every((r) => r.spec_folder === 'specs/001-auth')).toBe(true);
  });

  it('R9-14: without specFolder — returns memories from all folders', () => {
    const results = structuralSearch({ limit: 10 });

    expect(results.length).toBe(3);
    const folders = new Set(results.map((r) => r.spec_folder));
    expect(folders.has('specs/001-auth')).toBe(true);
    expect(folders.has('specs/002-config')).toBe(true);
  });

  it('R9-15: with non-existent specFolder — returns empty array', () => {
    const results = structuralSearch({ specFolder: 'specs/999-nonexistent', limit: 10 });
    expect(results).toEqual([]);
  });

  it('R9-15b: scoped result set is a strict subset of cross-folder result set', () => {
    // The R9 spec requires: "Cross-folder queries produce identical results to without pre-filter."
    // Equivalently: all scoped results must also appear in the unscoped result set.
    const scoped = structuralSearch({ specFolder: 'specs/001-auth', limit: 10 });
    const unscoped = structuralSearch({ limit: 10 });

    const unscopedIds = new Set(unscoped.map((r) => r.id));
    for (const row of scoped) {
      expect(unscopedIds.has(row.id)).toBe(true);
    }

    // Unscoped contains rows from other folders as well.
    expect(unscoped.length).toBeGreaterThan(scoped.length);
  });
});

// ═══════════════════════════════════════════════════════════════
// 8. Stage 1 metadata consistency invariants
// ═══════════════════════════════════════════════════════════════

describe('R9: Stage 1 metadata correctness', () => {
  beforeEach(() => clearCallLogs());

  it('R9-16: metadata.candidateCount always equals candidates.length', async () => {
    // The mocks return [] so candidateCount must be 0.
    const output = await executeStage1({
      config: makePipelineConfig({
        searchType: 'vector',
        specFolder: 'specs/001-auth',
      }),
    });
    expect(output.metadata.candidateCount).toBe(output.candidates.length);
  });

  it('R9-17: metadata.candidateCount is 0 when specFolder matches nothing (empty mock)', async () => {
    const output = await executeStage1({
      config: makePipelineConfig({
        searchType: 'vector',
        specFolder: 'specs/999-nonexistent',
      }),
    });
    expect(output.metadata.candidateCount).toBe(0);
    expect(output.candidates).toEqual([]);
  });

  it('R9-18: metadata.searchType reflects the configured search channel', async () => {
    for (const searchType of ['vector', 'hybrid'] as const) {
      clearCallLogs();
      const output = await executeStage1({
        config: makePipelineConfig({ searchType }),
      });
      expect(output.metadata.searchType).toBe(searchType);
    }
  });

  it('R9-19: metadata.durationMs is a non-negative number', async () => {
    const output = await executeStage1({
      config: makePipelineConfig({ searchType: 'vector' }),
    });
    expect(typeof output.metadata.durationMs).toBe('number');
    expect(output.metadata.durationMs).toBeGreaterThanOrEqual(0);
  });
});
