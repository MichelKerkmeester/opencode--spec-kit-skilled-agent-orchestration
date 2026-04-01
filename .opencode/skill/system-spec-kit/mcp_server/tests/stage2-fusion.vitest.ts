// TEST: Stage 2 Fusion
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Stage2Input } from '../lib/search/pipeline/types';

const mockRequireDb = vi.fn();
const mockQueryLearnedTriggers = vi.fn();
const mockApplyGraphSignals = vi.fn();
const mockApplyCommunityBoost = vi.fn();
const mockCoActivationEnabled = vi.fn(() => false);
const mockSpreadActivation = vi.fn(() => []);
const mockGetRelatedMemoryCounts = vi.fn(() => new Map<number, number>());
const mockGetAdaptiveMode = vi.fn(() => 'disabled');
const mockEnsureAdaptiveTables = vi.fn();

vi.mock('../utils/db-helpers', () => ({
  requireDb: mockRequireDb,
}));

vi.mock('../lib/search/learned-feedback', () => ({
  queryLearnedTriggers: mockQueryLearnedTriggers,
}));

vi.mock('../lib/graph/graph-signals', () => ({
  applyGraphSignals: mockApplyGraphSignals,
}));

vi.mock('../lib/graph/community-detection', () => ({
  applyCommunityBoost: mockApplyCommunityBoost,
}));

vi.mock('../lib/cognitive/co-activation', () => ({
  isEnabled: mockCoActivationEnabled,
  spreadActivation: mockSpreadActivation,
  getRelatedMemoryCounts: mockGetRelatedMemoryCounts,
  resolveCoActivationBoostFactor: () => 0.25,
  CO_ACTIVATION_CONFIG: { boostFactor: 0.25 },
}));

vi.mock('../lib/cognitive/adaptive-ranking.js', () => ({
  getAdaptiveMode: mockGetAdaptiveMode,
  ensureAdaptiveTables: mockEnsureAdaptiveTables,
}));

vi.mock('../lib/search/session-boost', () => ({
  applySessionBoost: <T>(rows: T[]) => ({ results: rows, metadata: { applied: false } }),
}));

vi.mock('../lib/search/causal-boost', () => ({
  applyCausalBoost: <T>(rows: T[]) => ({ results: rows, metadata: { applied: false } }),
}));

vi.mock('../lib/search/anchor-metadata', () => ({
  enrichResultsWithAnchorMetadata: <T>(rows: T[]) => rows,
}));

vi.mock('../lib/search/validation-metadata', () => ({
  enrichResultsWithValidationMetadata: <T>(rows: T[]) => rows,
}));

function createStage2Input(candidates: Array<Record<string, unknown>>): Stage2Input {
  return {
    candidates: candidates as Array<Record<string, unknown> & { id: number }>,
    stage1Metadata: {
      searchType: 'vector',
      channelCount: 1,
      candidateCount: candidates.length,
      constitutionalInjected: 0,
      durationMs: 1,
    },
    config: {
      query: 'graph rollout regression',
      searchType: 'vector' as const,
      limit: candidates.length,
      includeArchived: false,
      includeConstitutional: true,
      includeContent: false,
      minState: 'hot',
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
    },
  };
}

describe('Stage 2 fusion regression coverage', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    vi.resetModules();
    mockRequireDb.mockReset();
    mockQueryLearnedTriggers.mockReset();
    mockApplyGraphSignals.mockReset();
    mockApplyCommunityBoost.mockReset();
    mockCoActivationEnabled.mockReset();
    mockSpreadActivation.mockReset();
    mockGetRelatedMemoryCounts.mockReset();
    mockGetAdaptiveMode.mockReset();
    mockEnsureAdaptiveTables.mockReset();

    mockRequireDb.mockReturnValue({} as Record<string, unknown>);
    mockQueryLearnedTriggers.mockReturnValue([]);
    mockApplyGraphSignals.mockImplementation((rows: Array<Record<string, unknown>>) => rows);
    mockApplyCommunityBoost.mockImplementation((rows: Array<Record<string, unknown>>) => rows);
    mockCoActivationEnabled.mockReturnValue(false);
    mockSpreadActivation.mockReturnValue([]);
    mockGetRelatedMemoryCounts.mockReturnValue(new Map());
    mockGetAdaptiveMode.mockReturnValue('disabled');

    process.env = {
      ...originalEnv,
      SPECKIT_NEGATIVE_FEEDBACK: 'false',
      SPECKIT_GRAPH_UNIFIED: 'true',
      SPECKIT_GRAPH_SIGNALS: 'true',
    };
  });

  afterEach(() => {
    process.env = { ...originalEnv };
    vi.restoreAllMocks();
  });

  it('applies learned-trigger match.weight exactly once (no extra 0.7x scaling)', async () => {
    mockQueryLearnedTriggers.mockReturnValue([
      { memoryId: 1, matchedTerms: ['authentication'], weight: 0.35 },
    ]);

    const { __testables } = await import('../lib/search/pipeline/stage2-fusion');

    const results = [
      { id: 1, score: 0.4 },
      { id: 2, score: 0.4 },
    ];

    const adjusted = __testables.applyFeedbackSignals(
      results as Parameters<typeof __testables.applyFeedbackSignals>[0],
      'authentication flow'
    );

    const boosted = adjusted.find((r) => r.id === 1);
    const untouched = adjusted.find((r) => r.id === 2);

    expect(boosted).toBeDefined();
    expect(untouched).toBeDefined();
    expect(boosted!.score).toBeCloseTo(0.75, 9);
    expect(untouched!.score).toBeCloseTo(0.4, 9);
  });

  it('keeps broader graph signals active while graph-walk rollout off preserves baseline ordering', async () => {
    process.env.SPECKIT_GRAPH_WALK_ROLLOUT = 'off';
    const { executeStage2 } = await import('../lib/search/pipeline/stage2-fusion');

    const result = await executeStage2(createStage2Input([
      { id: 9, score: 0.5, similarity: 80 },
      { id: 4, score: 0.5, similarity: 80 },
      { id: 3, score: 0.5, similarity: 79 },
    ]));

    expect(mockApplyGraphSignals).toHaveBeenCalledWith(
      expect.any(Array),
      expect.anything(),
      expect.objectContaining({ rolloutState: 'off' }),
    );
    expect(result.metadata.graphContribution?.rolloutState).toBe('off');
    expect(result.scored.map((row) => row.id)).toEqual([4, 9, 3]);
  });

  it('records trace-only graph diagnostics without changing ordering or score aliases', async () => {
    process.env.SPECKIT_GRAPH_WALK_ROLLOUT = 'trace_only';
    mockApplyGraphSignals.mockImplementation((rows: Array<Record<string, unknown>>) =>
      rows.map((row) => ({
        ...row,
        graphContribution: {
          raw: row.id === 2 ? 1.5 : 1,
          normalized: row.id === 2 ? 0.75 : 0.5,
          appliedBonus: 0,
          capApplied: false,
          rolloutState: 'trace_only',
        },
      }))
    );

    const { executeStage2 } = await import('../lib/search/pipeline/stage2-fusion');
    const result = await executeStage2(createStage2Input([
      { id: 2, score: 0.6, similarity: 60 },
      { id: 1, score: 0.6, similarity: 55 },
    ]));

    expect(result.metadata.graphContribution?.rolloutState).toBe('trace_only');
    expect(result.scored.map((row) => row.id)).toEqual([2, 1]);
    for (const row of result.scored) {
      expect(row.score).toBe(row.rrfScore);
      expect(row.score).toBe(row.intentAdjustedScore);
      // attentionScore is now independent and not set by stage2 fusion
      expect(row.attentionScore).toBeUndefined();
      expect((row.graphContribution as Record<string, unknown>).rolloutState).toBe('trace_only');
      expect((row.graphContribution as Record<string, unknown>).appliedBonus).toBe(0);
    }
  });

  it('applies bounded_runtime graph bonus deterministically across repeated runs', async () => {
    process.env.SPECKIT_GRAPH_WALK_ROLLOUT = 'bounded_runtime';
    mockApplyGraphSignals.mockImplementation((rows: Array<Record<string, unknown>>) =>
      rows.map((row) => row.id === 2
        ? {
            ...row,
            score: 0.63,
            graphContribution: {
              raw: 2,
              normalized: 1,
              appliedBonus: 0.03,
              capApplied: true,
              rolloutState: 'bounded_runtime',
            },
          }
        : {
            ...row,
            graphContribution: {
              raw: 1,
              normalized: 0.5,
              appliedBonus: 0.015,
              capApplied: false,
              rolloutState: 'bounded_runtime',
            },
          })
    );

    const { executeStage2 } = await import('../lib/search/pipeline/stage2-fusion');
    const input = createStage2Input([
      { id: 1, score: 0.6, similarity: 60 },
      { id: 2, score: 0.6, similarity: 60 },
      { id: 3, score: 0.6, similarity: 55 },
    ]);

    const first = await executeStage2(input);
    const second = await executeStage2(input);

    expect(first.metadata.graphContribution?.rolloutState).toBe('bounded_runtime');
    expect(first.scored.map((row) => row.id)).toEqual([2, 1, 3]);
    expect(second.scored.map((row) => row.id)).toEqual([2, 1, 3]);
    expect(first.scored.map((row) => row.id)).toEqual(second.scored.map((row) => row.id));

    const boosted = first.scored[0];
    expect(boosted.score).toBe(0.63);
    expect(boosted.score).toBe(boosted.rrfScore);
    expect(boosted.score).toBe(boosted.intentAdjustedScore);
    // attentionScore is now independent and not set by stage2 fusion
    expect(boosted.attentionScore).toBeUndefined();
    expect((boosted.graphContribution as Record<string, unknown>).appliedBonus).toBe(0.03);
    expect((boosted.graphContribution as Record<string, unknown>).capApplied).toBe(true);
    expect((boosted.graphContribution as Record<string, unknown>).rolloutState).toBe('bounded_runtime');
  });

  it('T-degradation: fusion continues when DB unavailable', async () => {
    mockRequireDb.mockImplementation(() => {
      throw new Error('db unavailable');
    });

    const { executeStage2 } = await import('../lib/search/pipeline/stage2-fusion');
    const result = await executeStage2(createStage2Input([
      { id: 1, score: 0.9, similarity: 90 },
      { id: 2, score: 0.8, similarity: 80 },
    ]));

    expect(mockApplyGraphSignals).not.toHaveBeenCalled();
    expect(mockQueryLearnedTriggers).not.toHaveBeenCalled();
    expect(result.scored.map((row) => ({ id: row.id, score: row.score }))).toEqual([
      { id: 1, score: 0.9 },
      { id: 2, score: 0.8 },
    ]);
  });

  it('hydrates memoryState for community-injected rows from memory_index', async () => {
    process.env.SPECKIT_GRAPH_SIGNALS = 'false';
    mockApplyCommunityBoost.mockImplementation((rows: Array<Record<string, unknown>>) => [
      ...rows,
      { id: 2, score: 0.3, similarity: 30, _communityBoosted: true },
    ]);

    const mockDb = {
      prepare: vi.fn().mockReturnValue({
        all: vi.fn().mockReturnValue([
          { id: 2, memory_state: 'ARCHIVED' },
        ]),
      }),
    };
    mockRequireDb.mockReturnValue(mockDb);

    const { executeStage2 } = await import('../lib/search/pipeline/stage2-fusion');
    const result = await executeStage2(createStage2Input([
      { id: 1, score: 0.9, similarity: 90, memoryState: 'HOT' },
    ]));

    const injected = result.scored.find((row) => row.id === 2);

    expect(mockApplyCommunityBoost).toHaveBeenCalled();
    expect(mockDb.prepare).toHaveBeenCalledWith(
      'SELECT id, memory_state FROM memory_index WHERE id IN (?)'
    );
    expect(injected).toBeDefined();
    expect(injected?.memoryState).toBe('ARCHIVED');
    expect((injected?.graphContribution as Record<string, unknown>)?.injected).toBe(true);
  });

  it('precomputes co-activation neighbor counts once per boosted batch', async () => {
    mockCoActivationEnabled.mockReturnValue(true);
    mockSpreadActivation.mockReturnValue([
      { id: 2, activationScore: 0.4, hop: 1, path: [1, 2] },
    ]);
    mockGetRelatedMemoryCounts.mockReturnValue(new Map([[2, 4]]));
    process.env.SPECKIT_GRAPH_SIGNALS = 'false';

    const { executeStage2 } = await import('../lib/search/pipeline/stage2-fusion');
    const result = await executeStage2(createStage2Input([
      { id: 1, score: 0.8, similarity: 80 },
      { id: 2, score: 0.5, similarity: 50 },
    ]));

    expect(mockSpreadActivation).toHaveBeenCalledWith([1, 2]);
    expect(mockGetRelatedMemoryCounts).toHaveBeenCalledWith([2]);
    const boosted = result.scored.find((row) => row.id === 2);
    expect(boosted?.score).toBeCloseTo(0.55, 9);
  });

  it('batches adaptive access signal writes into a single transaction', async () => {
    mockGetAdaptiveMode.mockReturnValue('shadow');

    const insertRun = vi.fn();
    const prepare = vi.fn().mockReturnValue({ run: insertRun });
    const transaction = vi.fn((callback: (rows: Array<Record<string, unknown>>) => void) =>
      (rows: Array<Record<string, unknown>>) => callback(rows)
    );
    const mockDb = { prepare, transaction };
    mockRequireDb.mockReturnValue(mockDb);

    const { executeStage2 } = await import('../lib/search/pipeline/stage2-fusion');
    const input = createStage2Input([
      { id: 1, score: 0.9, similarity: 90 },
      { id: 2, score: 0.8, similarity: 80 },
    ]);
    input.config.trackAccess = true;

    await executeStage2(input);

    expect(mockGetAdaptiveMode).toHaveBeenCalledTimes(1);
    expect(mockEnsureAdaptiveTables).toHaveBeenCalledTimes(1);
    expect(mockEnsureAdaptiveTables).toHaveBeenCalledWith(mockDb);
    expect(prepare).toHaveBeenCalledWith(expect.stringContaining('INSERT INTO adaptive_signal_events'));
    expect(transaction).toHaveBeenCalledTimes(1);
    expect(insertRun).toHaveBeenCalledTimes(2);
    expect(insertRun).toHaveBeenNthCalledWith(1, 1, 'access', 1.0, 'graph rollout regression', '', '{}');
    expect(insertRun).toHaveBeenNthCalledWith(2, 2, 'access', 1.0, 'graph rollout regression', '', '{}');
  });

  it('reports sessionBoostApplied as "enabled" when boost runs but finds no data', async () => {
    vi.doMock('../lib/search/session-boost', () => ({
      applySessionBoost: <T>(rows: T[]) => ({
        results: rows,
        metadata: { applied: false, enabled: true, sessionId: 'test-001', boostedCount: 0, maxBoostApplied: 0 },
      }),
    }));

    const { executeStage2 } = await import('../lib/search/pipeline/stage2-fusion');
    const input = createStage2Input([
      { id: 1, score: 0.5, similarity: 50 },
    ]);
    input.config.searchType = 'hybrid';
    input.config.enableSessionBoost = true;
    input.config.sessionId = 'test-001';

    const result = await executeStage2(input);
    expect(result.metadata.sessionBoostApplied).toBe('enabled');
  });

  it('reports causalBoostApplied as "enabled" when boost runs but finds no edges', async () => {
    vi.doMock('../lib/search/causal-boost', () => ({
      applyCausalBoost: <T>(rows: T[]) => ({
        results: rows,
        metadata: { applied: false, enabled: true, boostedCount: 0, injectedCount: 0, maxBoostApplied: 0, traversalDepth: 2 },
      }),
    }));

    const { executeStage2 } = await import('../lib/search/pipeline/stage2-fusion');
    const input = createStage2Input([
      { id: 1, score: 0.5, similarity: 50 },
    ]);
    input.config.searchType = 'hybrid';
    input.config.enableCausalBoost = true;

    const result = await executeStage2(input);
    expect(result.metadata.causalBoostApplied).toBe('enabled');
  });

  it('reports sessionBoostApplied as "off" when feature is disabled', async () => {
    const { executeStage2 } = await import('../lib/search/pipeline/stage2-fusion');
    const input = createStage2Input([
      { id: 1, score: 0.5, similarity: 50 },
    ]);
    input.config.searchType = 'hybrid';
    input.config.enableSessionBoost = false;
    input.config.sessionId = 'test-001';

    const result = await executeStage2(input);
    expect(result.metadata.sessionBoostApplied).toBe('off');
  });
});
