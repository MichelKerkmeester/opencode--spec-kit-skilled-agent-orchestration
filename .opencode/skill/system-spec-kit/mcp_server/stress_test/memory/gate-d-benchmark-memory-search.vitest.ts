import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const SEARCH_QUERIES = [
  { intent: 'add_feature', query: 'add canonical resume summary for Gate D readers' },
  { intent: 'fix_bug', query: 'fix reader-ready canonical continuity mismatch' },
  { intent: 'refactor', query: 'refactor the reader-side canonical retrieval flow' },
  { intent: 'security_audit', query: 'audit the reader-ready retrieval path for governance leaks' },
  { intent: 'understand', query: 'how does Gate D canonical reader retrieval work' },
  { intent: 'find_spec', query: 'find the Gate D reader-ready specification details' },
  { intent: 'find_decision', query: 'find the canonical decision record for Gate D reader-ready' },
] as const;

vi.mock('../../core', () => ({
  checkDatabaseUpdated: vi.fn(async () => false),
}));

vi.mock('../../lib/cache/tool-cache', () => ({
  generateCacheKey: vi.fn(() => 'gate-d-benchmark-memory-search'),
  isEnabled: vi.fn(() => false),
  get: vi.fn(() => null),
  set: vi.fn(() => undefined),
  withCache: vi.fn(async (_tool: string, _args: unknown, fn: () => Promise<unknown>) => fn()),
}));

vi.mock('../../lib/search/pipeline', () => ({
  executePipeline: vi.fn(async () => ({
    results: [
      {
        id: 2001,
        score: 0.97,
        title: 'Gate D canonical spec',
        file_path: '/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/004-gate-d-reader-ready/spec.md',
        document_type: 'spec_doc',
      },
      {
        id: 2002,
        score: 0.92,
        title: 'Gate D continuity',
        file_path: '/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/004-gate-d-reader-ready/implementation-summary.md',
        document_type: 'continuity',
        anchor_id: '_memory.continuity',
      },
      {
        id: 2003,
        score: 0.99,
        title: 'Legacy row',
        file_path: '/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/004-gate-d-reader-ready/memory/legacy.md',
        document_type: 'memory',
      },
    ],
    metadata: {
      stage1: { searchType: 'hybrid', channelCount: 3, candidateCount: 3, constitutionalInjected: 0, durationMs: 1 },
      stage2: {
        sessionBoostApplied: 'off',
        causalBoostApplied: 'off',
        intentWeightsApplied: 'applied',
        artifactRoutingApplied: 'off',
        feedbackSignalsApplied: 'off',
        qualityFiltered: 0,
        durationMs: 1,
      },
      stage3: {
        rerankApplied: false,
        chunkReassemblyStats: { collapsedChunkHits: 0, chunkParents: 0, reassembled: 0, fallback: 0 },
        durationMs: 1,
      },
      stage4: { stateFiltered: 0, constitutionalInjected: 0, evidenceGapDetected: false, durationMs: 1 },
    },
    annotations: { stateStats: {}, featureFlags: {} },
    trace: undefined,
  })),
}));

vi.mock('../../formatters', () => ({
  formatSearchResults: vi.fn(async (
    results: Array<Record<string, unknown>>,
    _searchType: string,
    _includeContent?: boolean,
    _anchors?: string[] | null,
    _parserOverride?: unknown,
    _startTime?: number | null,
    extraData: Record<string, unknown> = {},
  ) => ({
    content: [{
      type: 'text',
      text: JSON.stringify({
        data: {
          count: results.length,
          results: results.map((row) => ({ ...row })),
          ...extraData,
        },
      }),
    }],
    isError: false,
  })),
}));

vi.mock('../../utils', () => ({
  validateQuery: vi.fn((query: unknown) => String(query ?? '').trim()),
  requireDb: vi.fn(() => {
    throw new Error('db unavailable in benchmark');
  }),
  toErrorMessage: vi.fn((err: unknown) => (err instanceof Error ? err.message : String(err))),
}));

vi.mock('../../lib/search/artifact-routing', () => ({
  getStrategyForQuery: vi.fn(() => null),
  applyRoutingWeights: vi.fn((results: unknown[]) => results),
}));

vi.mock('../../lib/search/intent-classifier', () => ({
  isValidIntent: vi.fn(() => true),
  getIntentWeights: vi.fn(() => ({ similarity: 0.6, importance: 0.25, recency: 0.15 })),
  classifyIntent: vi.fn((_query: string, explicitIntent?: string) => ({
    intent: explicitIntent ?? 'understand',
    confidence: 0.94,
    fallback: false,
  })),
  getIntentDescription: vi.fn(() => 'Gate D benchmark intent'),
  getProfileForIntent: vi.fn(() => null),
}));

vi.mock('../../lib/session/session-manager', () => ({
  isEnabled: vi.fn(() => false),
  filterSearchResults: vi.fn((_sessionId: string, results: unknown[]) => ({
    filtered: results,
    dedupStats: { enabled: false, filtered: 0, total: Array.isArray(results) ? results.length : 0 },
  })),
  markResultsSent: vi.fn(() => undefined),
}));

vi.mock('../../lib/eval/eval-logger', () => ({
  logSearchQuery: vi.fn(() => ({ queryId: 12, evalRunId: 34 })),
  logChannelResult: vi.fn(() => undefined),
  logFinalResult: vi.fn(() => undefined),
}));

vi.mock('../../lib/feedback/feedback-ledger', () => ({
  logFeedbackEvents: vi.fn(() => undefined),
  isImplicitFeedbackLogEnabled: vi.fn(() => false),
}));

import { handleMemorySearch } from '../../handlers/memory-search';

function percentile(sortedDurations: number[], ratio: number): number {
  const index = Math.min(sortedDurations.length - 1, Math.floor(sortedDurations.length * ratio));
  return sortedDurations[index] ?? 0;
}

function summarizeDurations(durations: number[]) {
  const sorted = [...durations].sort((left, right) => left - right);
  return {
    p50: percentile(sorted, 0.5),
    p95: percentile(sorted, 0.95),
    p99: percentile(sorted, 0.99),
  };
}

describe('Gate D benchmark — memory search', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('keeps canonical memory-search across 7 intents under the Gate D latency budget', async () => {
    const durations: number[] = [];
    const ITERATIONS_PER_INTENT = 25;

    for (const searchCase of SEARCH_QUERIES) {
      for (let iteration = 0; iteration < ITERATIONS_PER_INTENT; iteration += 1) {
        const start = performance.now();
        const response = await handleMemorySearch({
          query: searchCase.query,
          intent: searchCase.intent,
          includeArchived: true,
          limit: 5,
        });
        const elapsedMs = performance.now() - start;
        durations.push(elapsedMs);

        const envelope = JSON.parse(response.content[0].text) as Record<string, any>;
        expect(envelope.data.sourceContract.archivedTierEnabled).toBe(false);
        expect(envelope.data.sourceContract.legacyFallbackEnabled).toBe(false);
      }
    }

    const summary = summarizeDurations(durations);
    console.log(`[gate-d-benchmark][search] p50=${summary.p50.toFixed(2)}ms p95=${summary.p95.toFixed(2)}ms p99=${summary.p99.toFixed(2)}ms samples=${durations.length}`);

    expect(summary.p95).toBeLessThan(300);
  });
});
