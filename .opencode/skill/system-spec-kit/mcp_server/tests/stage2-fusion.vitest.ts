// TEST: Stage 2 Fusion
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Stage2Input } from '../lib/search/pipeline/types';

const mockRequireDb = vi.fn();
const mockQueryLearnedTriggers = vi.fn();
const mockApplyGraphSignals = vi.fn();

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
  applyCommunityBoost: <T>(rows: T[]) => rows,
}));

vi.mock('../lib/cognitive/co-activation', () => ({
  isEnabled: () => false,
  spreadActivation: () => [],
  CO_ACTIVATION_CONFIG: { boostFactor: 0 },
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

    mockRequireDb.mockReturnValue({} as Record<string, unknown>);
    mockQueryLearnedTriggers.mockReturnValue([]);
    mockApplyGraphSignals.mockImplementation((rows: Array<Record<string, unknown>>) => rows);

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
      expect(row.score).toBe(row.attentionScore);
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
    expect(boosted.score).toBe(boosted.attentionScore);
    expect((boosted.graphContribution as Record<string, unknown>).appliedBonus).toBe(0.03);
    expect((boosted.graphContribution as Record<string, unknown>).capApplied).toBe(true);
    expect((boosted.graphContribution as Record<string, unknown>).rolloutState).toBe('bounded_runtime');
  });
});
