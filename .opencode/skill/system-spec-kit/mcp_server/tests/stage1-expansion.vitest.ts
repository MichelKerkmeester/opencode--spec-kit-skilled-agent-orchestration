// ---------------------------------------------------------------
// TEST: Stage-1 Candidate Gen — Expansion & Dedup
// ---------------------------------------------------------------
// Covers CHK-016: stage1-candidate-gen.ts orchestrates expansion
//   T1: Stage-1 calls expansion when enabled (R12 path)
//   T2: Deduplication works correctly — baseline-first ordering
//   T3: Expansion suppressed for simple queries (R15 mutual exclusion)
//   T4: Expansion disabled when flag is OFF → single channel
// ---------------------------------------------------------------

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// We test the internal helpers via __testables and mock external deps
// to avoid needing a live DB or embedding provider.

const ENV_FLAGS = [
  'SPECKIT_EMBEDDING_EXPANSION',
  'SPECKIT_COMPLEXITY_ROUTER',
  'SPECKIT_MEMORY_SUMMARIES',
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
vi.mock('../lib/search/hybrid-search', () => ({
  searchWithFallback: vi.fn(async () => []),
}));

// Mock search-flags
const mockIsEmbeddingExpansionEnabled = vi.fn(() => true);
const mockIsMultiQueryEnabled = vi.fn(() => false);
const mockIsMemorySummariesEnabled = vi.fn(() => false);
vi.mock('../lib/search/search-flags', () => ({
  isEmbeddingExpansionEnabled: () => mockIsEmbeddingExpansionEnabled(),
  isMultiQueryEnabled: () => mockIsMultiQueryEnabled(),
  isMemorySummariesEnabled: () => mockIsMemorySummariesEnabled(),
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
vi.mock('../lib/search/query-expander', () => ({
  expandQuery: vi.fn((q: string) => [q]),
}));

// Mock memory-summaries
vi.mock('../lib/search/memory-summaries', () => ({
  querySummaryEmbeddings: vi.fn(() => []),
  checkScaleGate: vi.fn(() => false),
}));

// Mock retrieval-trace
vi.mock('@spec-kit/shared/contracts/retrieval-trace', () => ({
  addTraceEntry: vi.fn(),
}));

// Mock db-helpers
vi.mock('../utils/db-helpers', () => ({
  requireDb: vi.fn(() => ({})),
}));

// -- Import SUT after mocks ---------------------------------------------------

import { executeStage1 } from '../lib/search/pipeline/stage1-candidate-gen';
import { searchWithFallback } from '../lib/search/hybrid-search';
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

describe('Stage-1: Expansion & Dedup', () => {
  beforeEach(() => {
    saveEnv();
    vi.clearAllMocks();
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

    // searchWithFallback returns different results for baseline vs expansion
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

    // id=1 should appear once with baseline score (0.9), not expanded (0.6)
    const id1Rows = result.candidates.filter((r) => r.id === 1);
    expect(id1Rows).toHaveLength(1);
    expect(id1Rows[0]!.score).toBe(0.9);
    expect(id1Rows[0]!.title).toBe('baseline-version');

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
});
