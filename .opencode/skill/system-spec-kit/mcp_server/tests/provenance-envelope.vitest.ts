import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { MCPEnvelope, MCPResponse } from '../lib/response/envelope';
import type { PipelineRow, Stage2Input } from '../lib/search/pipeline/types';
import { formatSearchResults, type MemoryResultEnvelope } from '../formatters/search-results';
import { executeStage2 } from '../lib/search/pipeline/stage2-fusion';

const provenanceMocks = vi.hoisted(() => ({
  requireDb: vi.fn(),
  applyCausalBoost: vi.fn(),
  applyGraphSignals: vi.fn(),
  applyCommunityBoost: vi.fn(),
  queryLearnedTriggers: vi.fn(),
  getNegativeFeedbackStats: vi.fn(),
  applyNegativeFeedback: vi.fn(),
  isNegativeFeedbackEnabled: vi.fn(() => false),
  isCommunityDetectionEnabled: vi.fn(() => false),
  isGraphCalibrationProfileEnabled: vi.fn(() => false),
  isGraphSignalsEnabled: vi.fn(() => false),
  isUsageRankingEnabled: vi.fn(() => false),
  resolveGraphWalkRolloutState: vi.fn(() => 'off'),
  isLearnedStage2CombinerEnabled: vi.fn(() => false),
  isResultProvenanceEnabled: vi.fn(() => true),
  isGraphUnifiedEnabled: vi.fn(() => true),
  isCoActivationEnabled: vi.fn(() => false),
  spreadActivation: vi.fn(() => []),
  getRelatedMemoryCounts: vi.fn(() => new Map<number, number>()),
  getAdaptiveMode: vi.fn(() => 'disabled'),
  ensureAdaptiveTables: vi.fn(),
  sortDeterministicRows: vi.fn(
    <TRow extends { id: number; score?: number; similarity?: number }>(rows: TRow[]) =>
      [...rows].sort((left, right) => {
        const rightScore = typeof right.score === 'number' ? right.score : (right.similarity ?? 0);
        const leftScore = typeof left.score === 'number' ? left.score : (left.similarity ?? 0);
        if (rightScore !== leftScore) {
          return rightScore - leftScore;
        }
        return left.id - right.id;
      }),
  ),
}));

vi.mock('../utils/db-helpers', () => ({
  requireDb: provenanceMocks.requireDb,
}));

vi.mock('../lib/search/search-flags', () => ({
  isNegativeFeedbackEnabled: provenanceMocks.isNegativeFeedbackEnabled,
  isCommunityDetectionEnabled: provenanceMocks.isCommunityDetectionEnabled,
  isGraphCalibrationProfileEnabled: provenanceMocks.isGraphCalibrationProfileEnabled,
  isGraphSignalsEnabled: provenanceMocks.isGraphSignalsEnabled,
  isUsageRankingEnabled: provenanceMocks.isUsageRankingEnabled,
  resolveGraphWalkRolloutState: provenanceMocks.resolveGraphWalkRolloutState,
  isLearnedStage2CombinerEnabled: provenanceMocks.isLearnedStage2CombinerEnabled,
  isResultProvenanceEnabled: provenanceMocks.isResultProvenanceEnabled,
}));

vi.mock('../lib/search/graph-flags', () => ({
  isGraphUnifiedEnabled: provenanceMocks.isGraphUnifiedEnabled,
}));

vi.mock('../lib/search/session-boost', () => ({
  applySessionBoost: <TRow>(rows: TRow[]) => ({ results: rows, metadata: { applied: false } }),
}));

vi.mock('../lib/search/causal-boost', () => ({
  applyCausalBoost: provenanceMocks.applyCausalBoost,
}));

vi.mock('../lib/cognitive/co-activation', () => ({
  isEnabled: provenanceMocks.isCoActivationEnabled,
  spreadActivation: provenanceMocks.spreadActivation,
  getRelatedMemoryCounts: provenanceMocks.getRelatedMemoryCounts,
  resolveCoActivationBoostFactor: () => 0.25,
}));

vi.mock('../lib/cognitive/adaptive-ranking', () => ({
  getAdaptiveMode: provenanceMocks.getAdaptiveMode,
  ensureAdaptiveTables: provenanceMocks.ensureAdaptiveTables,
}));

vi.mock('../lib/cognitive/fsrs-scheduler', () => ({
  GRADE_GOOD: 3,
  requestRetentionForDifficulty: vi.fn(() => 0.9),
  schedule: vi.fn(() => ({ stability: 2, difficulty: 3 })),
}));

vi.mock('../lib/search/learned-feedback', () => ({
  queryLearnedTriggers: provenanceMocks.queryLearnedTriggers,
}));

vi.mock('../lib/scoring/negative-feedback', () => ({
  applyNegativeFeedback: provenanceMocks.applyNegativeFeedback,
  getNegativeFeedbackStats: provenanceMocks.getNegativeFeedbackStats,
}));

vi.mock('../lib/search/anchor-metadata', () => ({
  enrichResultsWithAnchorMetadata: <TRow>(rows: TRow[]) => rows,
}));

vi.mock('../lib/search/validation-metadata', () => ({
  enrichResultsWithValidationMetadata: <TRow>(rows: TRow[]) => rows,
}));

vi.mock('../lib/search/pipeline/stage2b-enrichment', () => ({
  executeStage2bEnrichment: <TRow>(rows: TRow[]) => rows,
}));

vi.mock('../lib/graph/community-detection', () => ({
  applyCommunityBoost: provenanceMocks.applyCommunityBoost,
}));

vi.mock('../lib/graph/graph-signals', () => ({
  applyGraphSignals: provenanceMocks.applyGraphSignals,
}));

vi.mock('../lib/graph/usage-ranking-signal', () => ({
  computeUsageBoost: vi.fn(() => 0),
}));

vi.mock('../lib/graph/usage-tracking', () => ({
  ensureUsageColumn: vi.fn(),
}));

vi.mock('../lib/search/graph-calibration', () => ({
  applyCalibrationProfile: vi.fn((input: Record<string, number>) => ({
    graphWeightBoost: input.graphWeightBoost ?? 0,
    communityBoost: input.communityBoost ?? 0,
  })),
}));

vi.mock('../lib/search/pipeline/ranking-contract', () => ({
  sortDeterministicRows: provenanceMocks.sortDeterministicRows,
}));

vi.mock('../lib/scoring/folder-scoring', () => ({
  computeRecencyScore: vi.fn(() => 0),
}));

vi.mock('@spec-kit/shared/ranking/learned-combiner', () => ({
  shadowScore: vi.fn(() => null),
  extractFeatureVector: vi.fn(() => ({})),
  loadModel: vi.fn(),
}));

vi.mock('@spec-kit/shared/contracts/retrieval-trace', () => ({
  addTraceEntry: vi.fn(),
}));

vi.mock('../lib/parsing/memory-parser', () => ({
  extractAnchors: vi.fn(() => ({})),
}));

vi.mock('../lib/search/session-transition', () => ({
  readSessionTransitionTrace: vi.fn(() => null),
}));

vi.mock('../lib/search/recovery-payload', () => ({
  buildRecoveryPayload: vi.fn(() => null),
  shouldTriggerRecovery: vi.fn(() => false),
  isEmptyResultRecoveryEnabled: vi.fn(() => false),
}));

vi.mock('../lib/search/confidence-scoring', () => ({
  computeResultConfidence: vi.fn(() => null),
  assessRequestQuality: vi.fn(() => null),
  isResultConfidenceEnabled: vi.fn(() => false),
}));

vi.mock('../lib/search/result-explainability', () => ({
  attachExplainabilityToResults: vi.fn((results: unknown[]) => results),
  isResultExplainEnabled: vi.fn(() => false),
}));

function createMockDb(
  edgeRows: Array<Record<string, unknown>> = [],
  communityRows: Array<Record<string, unknown>> = [],
) {
  return {
    prepare: vi.fn((sql: string) => ({
      all: vi.fn(() => {
        if (sql.includes('FROM causal_edges')) {
          return edgeRows;
        }
        if (sql.includes('FROM community_members')) {
          return communityRows;
        }
        return [];
      }),
      get: vi.fn(),
      run: vi.fn(),
    })),
  };
}

function createStage2Input(
  candidates: PipelineRow[],
  overrides: Partial<Stage2Input['config']> = {},
): Stage2Input {
  return {
    candidates,
    stage1Metadata: {
      searchType: overrides.searchType ?? 'vector',
      channelCount: 1,
      candidateCount: candidates.length,
      constitutionalInjected: 0,
      durationMs: 1,
    },
    config: {
      query: 'graph provenance envelope',
      searchType: 'vector',
      limit: candidates.length,
      includeArchived: false,
      includeConstitutional: false,
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
      ...overrides,
    },
  };
}

function parseEnvelope(response: MCPResponse): MCPEnvelope<{ results: MemoryResultEnvelope[] }> {
  const firstContent = response.content[0];
  expect(firstContent).toBeDefined();
  expect(firstContent?.type).toBe('text');
  if (!firstContent || firstContent.type !== 'text') {
    throw new Error('Expected text response content');
  }
  return JSON.parse(firstContent.text) as MCPEnvelope<{ results: MemoryResultEnvelope[] }>;
}

describe('T028: provenance envelope', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    provenanceMocks.isNegativeFeedbackEnabled.mockReturnValue(false);
    provenanceMocks.isCommunityDetectionEnabled.mockReturnValue(false);
    provenanceMocks.isGraphCalibrationProfileEnabled.mockReturnValue(false);
    provenanceMocks.isGraphSignalsEnabled.mockReturnValue(false);
    provenanceMocks.isUsageRankingEnabled.mockReturnValue(false);
    provenanceMocks.isLearnedStage2CombinerEnabled.mockReturnValue(false);
    provenanceMocks.isResultProvenanceEnabled.mockReturnValue(true);
    provenanceMocks.isGraphUnifiedEnabled.mockReturnValue(true);
    provenanceMocks.isCoActivationEnabled.mockReturnValue(false);
    provenanceMocks.queryLearnedTriggers.mockReturnValue([]);
    provenanceMocks.getNegativeFeedbackStats.mockReturnValue(new Map());
    provenanceMocks.applyNegativeFeedback.mockImplementation((score: number) => score);
    provenanceMocks.applyCausalBoost.mockImplementation((rows: PipelineRow[]) => ({
      results: rows,
      metadata: { applied: false },
    }));
    provenanceMocks.applyGraphSignals.mockImplementation((rows: PipelineRow[]) => rows);
    provenanceMocks.applyCommunityBoost.mockImplementation((rows: PipelineRow[]) => rows);
    provenanceMocks.requireDb.mockReturnValue(createMockDb());
  });

  it('leaves graphEvidence undefined when result provenance is disabled', async () => {
    provenanceMocks.isResultProvenanceEnabled.mockReturnValue(false);
    provenanceMocks.requireDb.mockReturnValue(
      createMockDb(
        [{ source_id: 11, target_id: 41, relation: 'caused', strength: 0.9 }],
        [{ memory_id: 11, community_id: 7, summary: 'Disabled cluster' }],
      ),
    );

    const output = await executeStage2(createStage2Input([
      {
        id: 11,
        score: 0.61,
        similarity: 61,
        graphContribution: {
          causalDelta: 0.04,
          totalDelta: 0.04,
        },
      } as PipelineRow,
    ]));

    expect(output.scored[0]?.graphEvidence).toBeUndefined();
  });

  it('includes an edges array when causal boost fires', async () => {
    provenanceMocks.applyCausalBoost.mockImplementation((rows: PipelineRow[]) => ({
      results: rows.map((row) => row.id === 101 ? { ...row, score: 0.64 } : row),
      metadata: { applied: true },
    }));
    provenanceMocks.requireDb.mockReturnValue(
      createMockDb([
        { source_id: 101, target_id: 17, relation: 'caused', strength: 0.9 },
        { source_id: 4, target_id: 101, relation: 'supports', strength: 0.5 },
      ]),
    );

    const output = await executeStage2(createStage2Input(
      [
        { id: 101, score: 0.6, similarity: 60 } as PipelineRow,
        { id: 102, score: 0.4, similarity: 40 } as PipelineRow,
      ],
      { searchType: 'hybrid', enableCausalBoost: true },
    ));

    const boostedRow = output.scored.find((row) => row.id === 101);
    expect(boostedRow?.graphEvidence?.edges).toEqual([
      { sourceId: 101, targetId: 17, relation: 'caused', strength: 0.9 },
      { sourceId: 4, targetId: 101, relation: 'supports', strength: 0.5 },
    ]);
    expect(boostedRow?.graphEvidence?.boostFactors).toHaveLength(1);
    expect(boostedRow?.graphEvidence?.boostFactors[0]?.type).toBe('causal');
    expect(boostedRow?.graphEvidence?.boostFactors[0]?.delta).toBeCloseTo(0.04, 9);
  });

  it('includes a communities array when community memberships are available', async () => {
    provenanceMocks.requireDb.mockReturnValue(
      createMockDb(
        [],
        [
          { memory_id: 205, community_id: 42, summary: 'Auth cluster' },
          { memory_id: 205, community_id: 99, summary: 'Session neighbors' },
        ],
      ),
    );

    const output = await executeStage2(createStage2Input([
      {
        id: 205,
        score: 0.58,
        similarity: 58,
        graphContribution: {
          causalDelta: 0.02,
          totalDelta: 0.02,
        },
      } as PipelineRow,
    ]));

    expect(output.scored[0]?.graphEvidence?.communities).toEqual([
      { communityId: 42, summary: 'Auth cluster' },
      { communityId: 99, summary: 'Session neighbors' },
    ]);
  });

  it('records each graph boost type and delta in boostFactors', async () => {
    const output = await executeStage2(createStage2Input([
      {
        id: 309,
        score: 0.7,
        similarity: 70,
        graphContribution: {
          causalDelta: 0.04,
          coActivationDelta: 0.03,
          communityDelta: 0.02,
          graphSignalDelta: 0.01,
          totalDelta: 0.1,
        },
      } as PipelineRow,
    ]));

    expect(output.scored[0]?.graphEvidence).toMatchObject({
      edges: [],
      communities: [],
      boostFactors: [
        { type: 'causal', delta: 0.04 },
        { type: 'co-activation', delta: 0.03 },
        { type: 'community', delta: 0.02 },
        { type: 'graph-signals', delta: 0.01 },
      ],
    });
  });

  it('includes graphEvidence in the formatted search response', async () => {
    const response = await formatSearchResults([
      {
        id: 501,
        spec_folder: 'specs/provenance',
        file_path: '/tmp/provenance.md',
        title: 'Graph provenance result',
        similarity: 91,
        importance_tier: 'important',
        isConstitutional: false,
        graphEvidence: {
          edges: [{ sourceId: 1, targetId: 2, relation: 'caused', strength: 0.9 }],
          communities: [{ communityId: 42, summary: 'Auth cluster' }],
          boostFactors: [
            { type: 'causal', delta: 0.04 },
            { type: 'graph-signals', delta: 0.01 },
          ],
        },
      },
    ], 'hybrid');

    const envelope = parseEnvelope(response);
    expect(envelope.data.results[0]?.graphEvidence).toEqual({
      edges: [{ sourceId: 1, targetId: 2, relation: 'caused', strength: 0.9 }],
      communities: [{ communityId: 42, summary: 'Auth cluster' }],
      boostFactors: [
        { type: 'causal', delta: 0.04 },
        { type: 'graph-signals', delta: 0.01 },
      ],
    });
  });
});
