// TEST: Stage-1 Candidate Gen — Expansion & Dedup
// Covers CHK-016: stage1-candidate-gen.ts orchestrates expansion
// T1: Stage-1 calls expansion when enabled (R12 path)
// T2: Deduplication works correctly — baseline-first ordering
// T3: Expansion suppressed for simple queries (R15 mutual exclusion)
// T4: Expansion disabled when flag is OFF → single channel
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// We test the internal helpers via __testables and mock external deps
// To avoid needing a live DB or embedding provider.

const ENV_FLAGS = [
  'SPECKIT_EMBEDDING_EXPANSION',
  'SPECKIT_COMPLEXITY_ROUTER',
  'SPECKIT_MEMORY_SUMMARIES',
  'SPECKIT_MEMORY_SCOPE_ENFORCEMENT',
  'SPECKIT_HYDRA_SCOPE_ENFORCEMENT',
] as const;

const savedEnv: Record<string, string | undefined> = {};

function saveEnv(): void {
  for (const f of ENV_FLAGS) {
    savedEnv[f] = process.env[f];
  }
}

function restoreEnv(): void {
  for (const f of ENV_FLAGS) {
    if (savedEnv[f] === undefined) {
      delete process.env[f];
    } else {
      process.env[f] = savedEnv[f];
    }
  }
}

// -- Mock modules before importing SUT ----------------------------------------

// Mock vector-index
vi.mock('../lib/search/vector-index', () => ({
  vectorSearch: vi.fn(() => []),
  multiConceptSearch: vi.fn(() => []),
}));

// Mock embeddings provider
vi.mock('../lib/providers/embeddings', () => ({
  generateQueryEmbedding: vi.fn(async () => new Float32Array([0.1, 0.2, 0.3])),
}));

// Mock hybrid-search
vi.mock('../lib/search/hybrid-search', () => {
  const mockHybridStage1Search = vi.fn(async () => []);
  return {
    searchWithFallback: mockHybridStage1Search,
    collectRawCandidates: mockHybridStage1Search,
  };
});

// Mock search-flags
const mockIsEmbeddingExpansionEnabled = vi.fn(() => true);
const mockIsMultiQueryEnabled = vi.fn(() => false);
const mockIsMemorySummariesEnabled = vi.fn(() => false);
const mockIsHyDEEnabled = vi.fn(() => false);
const mockIsLlmReformulationEnabled = vi.fn(() => false);
vi.mock('../lib/search/search-flags', () => ({
  isEmbeddingExpansionEnabled: () => mockIsEmbeddingExpansionEnabled(),
  isMultiQueryEnabled: () => mockIsMultiQueryEnabled(),
  isMemorySummariesEnabled: () => mockIsMemorySummariesEnabled(),
  isGraphConceptRoutingEnabled: vi.fn(() => false),
  isQuerySurrogatesEnabled: vi.fn(() => false),
  isHyDEEnabled: () => mockIsHyDEEnabled(),
  isLlmReformulationEnabled: () => mockIsLlmReformulationEnabled(),
  isSearchFallbackEnabled: vi.fn(() => false),
  isTRMEnabled: vi.fn(() => false),
  isNegativeFeedbackEnabled: vi.fn(() => false),
  isQueryDecompositionEnabled: vi.fn(() => false),
  isSessionRetrievalStateEnabled: vi.fn(() => false),
  isProgressiveDisclosureEnabled: vi.fn(() => false),
}));

// Mock embedding-expansion
const mockExpandQueryWithEmbeddings: any = vi.fn(async () => ({
  original: 'test query',
  expanded: ['related', 'terms'],
  combinedQuery: 'test query related terms',
}));
const mockIsExpansionActive: any = vi.fn(() => true);
vi.mock('../lib/search/embedding-expansion', () => ({
  expandQueryWithEmbeddings: (q: string, e: unknown) => mockExpandQueryWithEmbeddings(q, e),
  isExpansionActive: (q: string) => mockIsExpansionActive(q),
}));

// Mock query-expander
const mockExpandQuery = vi.fn((q: string) => [q]);
vi.mock('../lib/search/query-expander', () => ({
  expandQuery: (q: string) => mockExpandQuery(q),
}));

const mockCheapSeedRetrieve = vi.fn(() => []);
const mockRewrite = vi.fn(async () => ({
  abstract: 'abstract variant',
  variants: ['llm variant'],
}));
const mockFanout = vi.fn((queries: string[]) => queries);
vi.mock('../lib/search/llm-reformulation', () => ({
  cheapSeedRetrieve: (...args: unknown[]) => mockCheapSeedRetrieve(...args),
  llm: {
    rewrite: (...args: unknown[]) => mockRewrite(...args),
  },
  fanout: (...args: [string[]]) => mockFanout(...args),
}));

const mockRunHyDE = vi.fn(async () => []);
vi.mock('../lib/search/hyde', () => ({
  runHyDE: (...args: unknown[]) => mockRunHyDE(...args),
}));

// Mock memory-summaries
const mockQuerySummaryEmbeddings = vi.fn(
  (_db?: unknown, _embedding?: Float32Array | number[], _limit?: number): Array<{ memoryId: number; similarity: number }> => []
);
const mockCheckScaleGate = vi.fn((_db?: unknown): boolean => false);
vi.mock('../lib/search/memory-summaries', () => ({
  querySummaryEmbeddings: (db: unknown, embedding: Float32Array | number[], limit: number) =>
    mockQuerySummaryEmbeddings(db, embedding, limit),
  checkScaleGate: (db: unknown) => mockCheckScaleGate(db),
}));

// Mock retrieval-trace
vi.mock('@spec-kit/shared/contracts/retrieval-trace', () => ({
  addTraceEntry: vi.fn(),
}));

// Mock db-helpers
const mockRequireDb = vi.fn(() => ({}));
vi.mock('../utils/db-helpers', () => ({
  requireDb: () => mockRequireDb(),
}));

// Mock governance scope filter
const mockFilterRowsByScope = vi.fn((rows: Array<Record<string, unknown>>, scope: Record<string, unknown>, allowedSharedSpaceIds?: Set<string>) => {
  const scopeEnforcementEnabled = process.env.SPECKIT_MEMORY_SCOPE_ENFORCEMENT === 'true'
    || process.env.SPECKIT_HYDRA_SCOPE_ENFORCEMENT === 'true';
  const hasGovernanceScope = Boolean(
    scope.tenantId
    || scope.userId
    || scope.agentId
    || scope.sessionId
    || scope.sharedSpaceId
  );

  if (scopeEnforcementEnabled && !hasGovernanceScope) {
    return [];
  }

  return rows.filter((row) => {
    const tenantMatches = !scope.tenantId || row.tenant_id === scope.tenantId;
    const userMatches = !scope.userId || row.user_id === scope.userId;
    const agentMatches = !scope.agentId || row.agent_id === scope.agentId;
    const sessionMatches = !scope.sessionId || row.session_id === scope.sessionId;
    const sharedMatches = !scope.sharedSpaceId || (
      row.shared_space_id === scope.sharedSpaceId
      && (!allowedSharedSpaceIds || allowedSharedSpaceIds.has(String(row.shared_space_id)))
    );
    return tenantMatches && userMatches && agentMatches && sessionMatches && sharedMatches;
  });
});
vi.mock('../lib/governance/scope-governance', () => ({
  filterRowsByScope: (rows: Array<Record<string, unknown>>, scope: Record<string, unknown>, allowedSharedSpaceIds?: Set<string>) =>
    mockFilterRowsByScope(rows, scope, allowedSharedSpaceIds),
  isScopeEnforcementEnabled: () =>
    process.env.SPECKIT_MEMORY_SCOPE_ENFORCEMENT === 'true'
    || process.env.SPECKIT_HYDRA_SCOPE_ENFORCEMENT === 'true',
}));

const mockGetAllowedSharedSpaceIds = vi.fn((_db: unknown, _scope: Record<string, unknown>) => undefined as Set<string> | undefined);
vi.mock('../lib/collab/shared-spaces', () => ({
  getAllowedSharedSpaceIds: (db: unknown, scope: Record<string, unknown>) => mockGetAllowedSharedSpaceIds(db, scope),
}));

// -- Import SUT after mocks ---------------------------------------------------

import { executeStage1 } from '../lib/search/pipeline/stage1-candidate-gen';
import { searchWithFallback } from '../lib/search/hybrid-search';
import * as vectorIndex from '../lib/search/vector-index';
import type { PipelineConfig } from '../lib/search/pipeline/types';

function makeConfig(overrides: Partial<PipelineConfig> = {}): PipelineConfig {
  return {
    query: 'test query',
    searchType: 'hybrid',
    limit: 20,
    includeArchived: false,
    includeConstitutional: false,
    includeContent: false,
    minState: 'active',
    applyStateLimits: false,
    useDecay: false,
    rerank: false,
    applyLengthPenalty: false,
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

function makeSummaryDb(rowsById: Record<number, Record<string, unknown>>): { prepare: (sql: string) => { get: (id: number) => Record<string, unknown> | undefined; all: (...ids: number[]) => Array<Record<string, unknown>> } } {
  return {
    prepare: vi.fn((_sql: string) => ({
      get: vi.fn((id: number) => rowsById[id]),
      all: vi.fn((...ids: number[]) => ids.map((id) => rowsById[id]).filter(Boolean)),
    })),
  };
}

describe('Stage-1: Expansion & Dedup', () => {
  beforeEach(() => {
    saveEnv();
    vi.clearAllMocks();
    mockIsEmbeddingExpansionEnabled.mockReturnValue(true);
    mockIsMultiQueryEnabled.mockReturnValue(false);
    mockIsMemorySummariesEnabled.mockReturnValue(false);
    mockIsHyDEEnabled.mockReturnValue(false);
    mockIsLlmReformulationEnabled.mockReturnValue(false);
    mockIsExpansionActive.mockReset().mockReturnValue(true);
    mockExpandQuery.mockReset().mockImplementation((q: string) => [q]);
    mockCheckScaleGate.mockReset().mockReturnValue(false);
    mockQuerySummaryEmbeddings.mockReset().mockReturnValue([]);
    mockRequireDb.mockReset().mockReturnValue({});
    mockFilterRowsByScope.mockClear();
    mockGetAllowedSharedSpaceIds.mockReset().mockReturnValue(undefined);
    mockCheapSeedRetrieve.mockReset().mockReturnValue([]);
    mockRewrite.mockReset().mockResolvedValue({
      abstract: 'abstract variant',
      variants: ['llm variant'],
    });
    mockFanout.mockReset().mockImplementation((queries: string[]) => queries);
    mockRunHyDE.mockReset().mockResolvedValue([]);
  });

  afterEach(() => {
    restoreEnv();
  });

  it('T1: calls expansion when R12 flag is enabled and query is not simple', async () => {
    mockIsEmbeddingExpansionEnabled.mockReturnValue(true);
    mockIsExpansionActive.mockReturnValue(true);
    mockExpandQueryWithEmbeddings.mockResolvedValue({
      original: 'test query',
      expanded: ['related', 'terms'],
      combinedQuery: 'test query related terms',
    });

    // SearchWithFallback returns different results for baseline vs expansion
    const mockSearch = searchWithFallback as ReturnType<typeof vi.fn>;
    mockSearch
      .mockResolvedValueOnce([{ id: 1, score: 0.9, title: 'baseline' }])
      .mockResolvedValueOnce([{ id: 2, score: 0.8, title: 'expanded' }]);

    const result = await executeStage1({ config: makeConfig() });

    // Expansion was called
    expect(mockExpandQueryWithEmbeddings).toHaveBeenCalled();
    // Two channels: baseline + expanded
    expect(result.metadata.channelCount).toBe(2);
    // Both results present
    expect(result.candidates.length).toBe(2);
  });

  it('T2: deduplication preserves baseline-first ordering', async () => {
    mockIsEmbeddingExpansionEnabled.mockReturnValue(true);
    mockIsExpansionActive.mockReturnValue(true);
    mockExpandQueryWithEmbeddings.mockResolvedValue({
      original: 'test query',
      expanded: ['extra'],
      combinedQuery: 'test query extra',
    });

    const mockSearch = searchWithFallback as ReturnType<typeof vi.fn>;
    // Both channels return overlapping result (id=1)
    mockSearch
      .mockResolvedValueOnce([
        { id: 1, score: 0.9, title: 'baseline-version' },
        { id: 3, score: 0.7, title: 'baseline-only' },
      ])
      .mockResolvedValueOnce([
        { id: 1, score: 0.6, title: 'expanded-version' },
        { id: 4, score: 0.5, title: 'expanded-only' },
      ]);

    const result = await executeStage1({ config: makeConfig() });

    // Id=1 should appear once with baseline score (0.9), not expanded (0.6)
    const id1Rows = result.candidates.filter((r) => r.id === 1);
    expect(id1Rows).toHaveLength(1);
    expect(id1Rows[0]!.score).toBe(0.9);
    expect(id1Rows[0]!.title).toBe('baseline-version');
    expect(id1Rows[0]!.stage1BranchScores).toEqual({
      'test query': 0.9,
      'test query extra': 0.6,
    });
    expect(id1Rows[0]!.stage1BranchCount).toBe(2);

    // Total should be 3 unique (1, 3, 4)
    expect(result.candidates).toHaveLength(3);
  });

  it('T3: expansion suppressed for simple queries (R15 mutual exclusion)', async () => {
    mockIsEmbeddingExpansionEnabled.mockReturnValue(true);
    mockIsExpansionActive.mockReturnValue(false); // R15 says "simple"

    const mockSearch = searchWithFallback as ReturnType<typeof vi.fn>;
    mockSearch.mockResolvedValue([{ id: 1, score: 0.9, title: 'result' }]);

    const result = await executeStage1({ config: makeConfig() });

    // Expansion should NOT have been called
    expect(mockExpandQueryWithEmbeddings).not.toHaveBeenCalled();
    // Single channel
    expect(result.metadata.channelCount).toBe(1);
  });

  it('T4: expansion disabled when flag is OFF → single channel', async () => {
    mockIsEmbeddingExpansionEnabled.mockReturnValue(false);

    const mockSearch = searchWithFallback as ReturnType<typeof vi.fn>;
    mockSearch.mockResolvedValue([{ id: 1, score: 0.9, title: 'result' }]);

    const result = await executeStage1({ config: makeConfig() });

    expect(mockExpandQueryWithEmbeddings).not.toHaveBeenCalled();
    expect(result.metadata.channelCount).toBe(1);
  });

  it('T5: merges summary-channel candidates with baseline candidates', async () => {
    mockIsEmbeddingExpansionEnabled.mockReturnValue(false);
    mockIsMemorySummariesEnabled.mockReturnValue(true);
    mockCheckScaleGate.mockReturnValue(true);
    mockQuerySummaryEmbeddings.mockReturnValue([{ memoryId: 2, similarity: 0.82 }]);
    mockRequireDb.mockReturnValue(
      makeSummaryDb({
        2: {
          id: 2,
          title: 'summary-hit',
          spec_folder: 'specs/200-summary',
          file_path: 'specs/200-summary/memory/summary-hit.md',
          importance_tier: 'normal',
          importance_weight: 1,
          quality_score: 0.91,
          created_at: '2026-01-01T00:00:00.000Z',
          is_archived: 0,
        },
      })
    );

    const mockSearch = searchWithFallback as ReturnType<typeof vi.fn>;
    mockSearch.mockResolvedValue([{ id: 1, score: 0.93, title: 'baseline-hit', quality_score: 0.93 }]);

    const result = await executeStage1({ config: makeConfig() });
    const ids = result.candidates.map((row) => row.id);

    expect(ids).toEqual([1, 2]);
    expect(result.metadata.channelCount).toBe(2);

    const summaryRow = result.candidates.find((row) => row.id === 2);
    expect(summaryRow?.title).toBe('summary-hit');
    expect(summaryRow?.score).toBeCloseTo(0.82, 10);
  });

  it('T6: deduplicates summary candidates by memory id and preserves baseline result', async () => {
    mockIsEmbeddingExpansionEnabled.mockReturnValue(false);
    mockIsMemorySummariesEnabled.mockReturnValue(true);
    mockCheckScaleGate.mockReturnValue(true);
    mockQuerySummaryEmbeddings.mockReturnValue([{ memoryId: 1, similarity: 0.15 }]);

    const summaryGetSpy = vi.fn((id: number) => ({
      id,
      title: 'summary-version',
      spec_folder: 'specs/dup',
      file_path: 'specs/dup/memory/dup.md',
      importance_tier: 'normal',
      importance_weight: 1,
      quality_score: 0.99,
      created_at: '2026-01-01T00:00:00.000Z',
      is_archived: 0,
    }));
    mockRequireDb.mockReturnValue({
      prepare: vi.fn(() => ({ get: summaryGetSpy })),
    });

    const mockSearch = searchWithFallback as ReturnType<typeof vi.fn>;
    mockSearch.mockResolvedValue([{ id: 1, score: 0.95, title: 'baseline-version', quality_score: 0.95 }]);

    const result = await executeStage1({ config: makeConfig() });

    expect(result.candidates).toHaveLength(1);
    expect(result.candidates[0]?.id).toBe(1);
    expect(result.candidates[0]?.title).toBe('baseline-version');
    expect(result.metadata.channelCount).toBe(1);
    expect(summaryGetSpy).not.toHaveBeenCalled();
  });

  it('T7: applies minQualityScore threshold to summary candidates before merge', async () => {
    mockIsEmbeddingExpansionEnabled.mockReturnValue(false);
    mockIsMemorySummariesEnabled.mockReturnValue(true);
    mockCheckScaleGate.mockReturnValue(true);
    mockQuerySummaryEmbeddings.mockReturnValue([
      { memoryId: 3, similarity: 0.8 },
      { memoryId: 4, similarity: 0.79 },
    ]);
    mockRequireDb.mockReturnValue(
      makeSummaryDb({
        3: {
          id: 3,
          title: 'high-quality-summary',
          spec_folder: 'specs/quality/high',
          file_path: 'specs/quality/high/memory/high.md',
          importance_tier: 'normal',
          importance_weight: 1,
          quality_score: 0.95,
          created_at: '2026-01-01T00:00:00.000Z',
          is_archived: 0,
        },
        4: {
          id: 4,
          title: 'low-quality-summary',
          spec_folder: 'specs/quality/low',
          file_path: 'specs/quality/low/memory/low.md',
          importance_tier: 'normal',
          importance_weight: 1,
          quality_score: 0.3,
          created_at: '2026-01-01T00:00:00.000Z',
          is_archived: 0,
        },
      })
    );

    const mockSearch = searchWithFallback as ReturnType<typeof vi.fn>;
    mockSearch.mockResolvedValue([]);

    const result = await executeStage1({
      config: makeConfig({ qualityThreshold: 0.8 }),
    });

    expect(result.metadata.channelCount).toBe(2);
    expect(result.candidates).toHaveLength(1);
    expect(result.candidates[0]?.id).toBe(3);
    expect(result.candidates[0]?.title).toBe('high-quality-summary');
  });

  it('T8: summary-channel hits are filtered by governance scope before merge', async () => {
    mockIsEmbeddingExpansionEnabled.mockReturnValue(false);
    mockIsMemorySummariesEnabled.mockReturnValue(true);
    mockCheckScaleGate.mockReturnValue(true);
    mockGetAllowedSharedSpaceIds.mockReturnValue(new Set(['shared-allowed']));
    mockQuerySummaryEmbeddings.mockReturnValue([
      { memoryId: 8, similarity: 0.84 },
      { memoryId: 9, similarity: 0.81 },
    ]);
    mockRequireDb.mockReturnValue(
      makeSummaryDb({
        8: {
          id: 8,
          title: 'allowed-summary',
          spec_folder: 'specs/governed',
          file_path: 'specs/governed/memory/allowed.md',
          importance_tier: 'normal',
          importance_weight: 1,
          quality_score: 0.92,
          created_at: '2026-01-01T00:00:00.000Z',
          is_archived: 0,
          context_type: 'general',
          tenant_id: 'tenant-a',
          shared_space_id: 'shared-allowed',
        },
        9: {
          id: 9,
          title: 'blocked-summary',
          spec_folder: 'specs/governed',
          file_path: 'specs/governed/memory/blocked.md',
          importance_tier: 'normal',
          importance_weight: 1,
          quality_score: 0.9,
          created_at: '2026-01-01T00:00:00.000Z',
          is_archived: 0,
          context_type: 'general',
          tenant_id: 'tenant-b',
          shared_space_id: 'shared-blocked',
        },
      })
    );

    const mockSearch = searchWithFallback as ReturnType<typeof vi.fn>;
    mockSearch.mockResolvedValue([]);

    const result = await executeStage1({
      config: makeConfig({
        tenantId: 'tenant-a',
        sharedSpaceId: 'shared-allowed',
      }),
    });

    expect(mockFilterRowsByScope).toHaveBeenCalled();
    expect(result.metadata.channelCount).toBe(2);
    expect(result.candidates).toHaveLength(1);
    expect(result.candidates[0]?.id).toBe(8);
    expect(result.candidates[0]?.title).toBe('allowed-summary');
  });

  it('T9: constitutional injection re-applies governance scope after vector fetch', async () => {
    const mockSearch = searchWithFallback as ReturnType<typeof vi.fn>;
    const mockVectorSearch = vectorIndex.vectorSearch as ReturnType<typeof vi.fn>;

    mockSearch.mockResolvedValueOnce([
      {
        id: 1,
        title: 'baseline',
        importance_tier: 'normal',
        tenant_id: 'tenant-a',
        shared_space_id: 'allowed-space',
      },
    ]);
    mockVectorSearch.mockReturnValue([
      {
        id: 2,
        title: 'constitutional allowed',
        importance_tier: 'constitutional',
        tenant_id: 'tenant-a',
        shared_space_id: 'allowed-space',
      },
      {
        id: 3,
        title: 'constitutional blocked',
        importance_tier: 'constitutional',
        tenant_id: 'tenant-a',
        shared_space_id: 'blocked-space',
      },
    ]);
    mockGetAllowedSharedSpaceIds.mockReturnValue(new Set(['allowed-space']));

    const result = await executeStage1({
      config: makeConfig({
        includeConstitutional: true,
        tenantId: 'tenant-a',
        sharedSpaceId: 'allowed-space',
      }),
    });

    expect(result.candidates.map((row) => row.id)).toEqual([1, 2]);
    expect(result.candidates.find((row) => row.id === 3)).toBeUndefined();
  });

  it('T10: deny-by-default filters empty-scope candidates when enforcement is enabled', async () => {
    process.env.SPECKIT_MEMORY_SCOPE_ENFORCEMENT = 'true';

    const mockSearch = searchWithFallback as ReturnType<typeof vi.fn>;
    mockSearch.mockResolvedValue([
      { id: 42, score: 0.91, title: 'would-have-leaked', tenant_id: 'tenant-a' },
    ]);

    const result = await executeStage1({ config: makeConfig() });

    expect(mockFilterRowsByScope).toHaveBeenCalled();
    expect(result.candidates).toHaveLength(0);
  });

  it('T11: deep-mode LLM reformulation results are scope-filtered before merge', async () => {
    mockIsEmbeddingExpansionEnabled.mockReturnValue(false);
    mockIsLlmReformulationEnabled.mockReturnValue(true);
    mockGetAllowedSharedSpaceIds.mockReturnValue(new Set(['shared-allowed']));

    const mockSearch = searchWithFallback as ReturnType<typeof vi.fn>;
    mockSearch
      .mockResolvedValueOnce([
        { id: 1, title: 'baseline allowed', tenant_id: 'tenant-a', shared_space_id: 'shared-allowed' },
      ])
      .mockResolvedValueOnce([
        { id: 1, title: 'baseline duplicate', tenant_id: 'tenant-a', shared_space_id: 'shared-allowed' },
      ])
      .mockResolvedValueOnce([
        { id: 2, title: 'reform blocked', tenant_id: 'tenant-b', shared_space_id: 'shared-blocked' },
      ])
      .mockResolvedValueOnce([
        { id: 1, title: 'reform duplicate', score: 0.77, tenant_id: 'tenant-a', shared_space_id: 'shared-allowed' },
        { id: 3, title: 'reform allowed', tenant_id: 'tenant-a', shared_space_id: 'shared-allowed' },
      ]);

    const result = await executeStage1({
      config: makeConfig({
        mode: 'deep',
        tenantId: 'tenant-a',
        sharedSpaceId: 'shared-allowed',
      }),
    });

    expect(result.candidates.map((row) => row.id)).toEqual([1, 3]);
    expect(result.candidates.find((row) => row.id === 2)).toBeUndefined();
    const baseline = result.candidates.find((row) => row.id === 1);
    expect(baseline?.stage1BranchScores).toMatchObject({
      'test query': 0,
      'llm variant': 0.77,
    });
    expect(baseline?.stage1BranchCount).toBe(2);
  });

  it('T12: deep-mode HyDE results are scope-filtered before merge', async () => {
    mockIsEmbeddingExpansionEnabled.mockReturnValue(false);
    mockIsHyDEEnabled.mockReturnValue(true);
    mockGetAllowedSharedSpaceIds.mockReturnValue(new Set(['shared-allowed']));

    const mockSearch = searchWithFallback as ReturnType<typeof vi.fn>;
    mockSearch.mockResolvedValue([
      { id: 1, title: 'baseline allowed', tenant_id: 'tenant-a', shared_space_id: 'shared-allowed' },
    ]);
    mockRunHyDE.mockResolvedValue([
      { id: 1, title: 'hyde duplicate', score: 0.94, tenant_id: 'tenant-a', shared_space_id: 'shared-allowed' },
      { id: 2, title: 'hyde allowed', tenant_id: 'tenant-a', shared_space_id: 'shared-allowed' },
      { id: 3, title: 'hyde blocked', tenant_id: 'tenant-b', shared_space_id: 'shared-blocked' },
    ]);

    const result = await executeStage1({
      config: makeConfig({
        mode: 'deep',
        tenantId: 'tenant-a',
        sharedSpaceId: 'shared-allowed',
      }),
    });

    expect(result.candidates.map((row) => row.id)).toEqual([1, 2]);
    expect(result.candidates.find((row) => row.id === 3)).toBeUndefined();
    const baseline = result.candidates.find((row) => row.id === 1);
    expect(baseline?.stage1BranchScores).toMatchObject({
      'test query': 0,
      hyde: 0.94,
    });
    expect(baseline?.stage1BranchCount).toBe(2);
  });

  it('T13: deep-mode multi-query merges duplicate ids and keeps later branch evidence', async () => {
    mockIsEmbeddingExpansionEnabled.mockReturnValue(false);
    mockIsMultiQueryEnabled.mockReturnValue(true);
    mockExpandQuery.mockReturnValue(['test query', 'test query variant']);

    const mockSearch = searchWithFallback as ReturnType<typeof vi.fn>;
    mockSearch
      .mockResolvedValueOnce([
        { id: 1, score: 0.42, title: 'baseline variant' },
      ])
      .mockResolvedValueOnce([
        { id: 1, score: 0.87, title: 'better duplicate' },
      ]);

    const result = await executeStage1({
      config: makeConfig({ mode: 'deep' }),
    });

    expect(result.candidates.map((row) => row.id)).toEqual([1]);
    const merged = result.candidates.find((row) => row.id === 1);
    expect(merged?.score).toBe(0.87);
    expect(merged?.title).toBe('better duplicate');
    expect(merged?.stage1BranchScores).toEqual({
      'test query': 0.42,
      'test query variant': 0.87,
    });
    expect(merged?.stage1BranchCount).toBe(2);
  });
});
