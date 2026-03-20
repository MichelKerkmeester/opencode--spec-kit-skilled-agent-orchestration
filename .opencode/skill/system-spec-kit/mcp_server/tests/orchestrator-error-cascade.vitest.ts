// ───────────────────────────────────────────────────────────────
// TEST: Orchestrator Error Cascade (G1 + B1)
// ───────────────────────────────────────────────────────────────
// Verifies B1 error handling in executePipeline:
// - Stage 1 failure throws (mandatory — no candidates = no results)
// - Stage 2/3/4 failures degrade gracefully with fallback output
// - Timing metadata is always present
// - metadata.degraded is true when any stage fails
import { describe, it, expect, vi, beforeEach } from 'vitest';

import type {
  PipelineConfig,
  Stage1Output,
  Stage2Output,
  Stage3Output,
  Stage4Output,
} from '../lib/search/pipeline/types';

/* ───────────────────────────────────────────────────────────────
   MOCKS — hoisted before module imports
──────────────────────────────────────────────────────────────── */

const mockStage1 = vi.fn();
const mockStage2 = vi.fn();
const mockStage3 = vi.fn();
const mockStage4 = vi.fn();

vi.mock('../lib/search/pipeline/stage1-candidate-gen', () => ({
  executeStage1: (...args: unknown[]) => mockStage1(...args as []),
}));

vi.mock('../lib/search/pipeline/stage2-fusion', () => ({
  executeStage2: (...args: unknown[]) => mockStage2(...args as []),
}));

vi.mock('../lib/search/pipeline/stage3-rerank', () => ({
  executeStage3: (...args: unknown[]) => mockStage3(...args as []),
}));

vi.mock('../lib/search/pipeline/stage4-filter', () => ({
  executeStage4: (...args: unknown[]) => mockStage4(...args as []),
}));

// B1: Mock errors/core — withTimeout passes through, MemoryError is a plain Error subclass
vi.mock('../lib/errors/core', () => {
  class MemoryError extends Error {
    code: string;
    details: Record<string, unknown>;
    constructor(code: string, message: string, details: Record<string, unknown> = {}) {
      super(message);
      this.code = code;
      this.details = details;
      this.name = 'MemoryError';
    }
  }
  return {
    MemoryError,
    withTimeout: <T>(promise: Promise<T>, _ms: number, _op: string) => promise,
  };
});

import { executePipeline } from '../lib/search/pipeline/orchestrator';

/* ───────────────────────────────────────────────────────────────
   HELPERS
──────────────────────────────────────────────────────────────── */

function createPipelineConfig(overrides: Partial<PipelineConfig> = {}): PipelineConfig {
  return {
    query: 'test query',
    searchType: 'hybrid',
    limit: 10,
    includeArchived: false,
    includeConstitutional: false,
    includeContent: true,
    minState: 'ARCHIVED',
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

const STAGE1_OK: Stage1Output = {
  candidates: [{ id: 1, similarity: 85 }],
  metadata: {
    searchType: 'hybrid',
    channelCount: 2,
    candidateCount: 1,
    constitutionalInjected: 0,
    durationMs: 5,
  },
};

const STAGE2_OK: Stage2Output = {
  scored: [{ id: 1, similarity: 85, score: 0.85 }],
  metadata: {
    sessionBoostApplied: 'off',
    causalBoostApplied: 'off',
    intentWeightsApplied: 'off',
    artifactRoutingApplied: 'off',
    feedbackSignalsApplied: 'off',
    qualityFiltered: 0,
    durationMs: 3,
  },
};

const STAGE3_OK: Stage3Output = {
  reranked: [{ id: 1, similarity: 85, score: 0.85 }],
  metadata: {
    rerankApplied: false,
    chunkReassemblyStats: {
      collapsedChunkHits: 0,
      chunkParents: 0,
      reassembled: 0,
      fallback: 0,
    },
    durationMs: 2,
  },
};

const STAGE4_OK: Stage4Output = {
  final: [{ id: 1, similarity: 85, score: 0.85 }],
  metadata: {
    stateFiltered: 0,
    constitutionalInjected: 0,
    evidenceGapDetected: false,
    durationMs: 1,
  },
  annotations: {
    stateStats: {},
    featureFlags: {},
  },
};

/* ───────────────────────────────────────────────────────────────
   TESTS
──────────────────────────────────────────────────────────────── */

describe('executePipeline error cascading (B1)', () => {
  beforeEach(() => {
    mockStage1.mockReset().mockResolvedValue(STAGE1_OK);
    mockStage2.mockReset().mockResolvedValue(STAGE2_OK);
    mockStage3.mockReset().mockResolvedValue(STAGE3_OK);
    mockStage4.mockReset().mockResolvedValue(STAGE4_OK);
  });

  it('completes successfully when all stages succeed (baseline)', async () => {
    const config = createPipelineConfig();
    const result = await executePipeline(config);
    expect(result.results).toHaveLength(1);
    expect(result.metadata.stage1).toBeDefined();
    expect(result.metadata.stage2).toBeDefined();
    expect(result.metadata.stage3).toBeDefined();
    expect(result.metadata.stage4).toBeDefined();
    expect(result.metadata.timing).toBeDefined();
    expect(result.metadata.timing!.total).toBeGreaterThanOrEqual(0);
    expect(result.metadata.degraded).toBeUndefined();
  });

  it('throws on Stage 1 failure (mandatory — no fallback)', async () => {
    const stage1Error = new Error('embedding service unavailable');
    mockStage1.mockRejectedValue(stage1Error);
    const config = createPipelineConfig();

    await expect(executePipeline(config)).rejects.toThrow('embedding service unavailable');
    expect(mockStage2).not.toHaveBeenCalled();
    expect(mockStage3).not.toHaveBeenCalled();
    expect(mockStage4).not.toHaveBeenCalled();
  });

  it('degrades gracefully on Stage 2 failure (returns unsorted candidates)', async () => {
    mockStage2.mockRejectedValue(new Error('RRF fusion NaN overflow'));
    const config = createPipelineConfig();

    const result = await executePipeline(config);

    // Returns results from Stage 1 candidates (fallback)
    expect(result.results).toHaveLength(1);
    expect(result.metadata.degraded).toBe(true);
    // Stage 2 metadata uses fallback values
    expect(result.metadata.stage2.sessionBoostApplied).toBe('failed');
    expect(result.metadata.stage2.durationMs).toBe(0);
    // Stage 3 and 4 still called (with degraded Stage 2 output)
    expect(mockStage3).toHaveBeenCalledOnce();
    expect(mockStage4).toHaveBeenCalledOnce();
  });

  it('degrades gracefully on Stage 3 failure (returns unranked results)', async () => {
    mockStage3.mockRejectedValue(new Error('cross-encoder timeout'));
    const config = createPipelineConfig();

    const result = await executePipeline(config);

    expect(result.results).toHaveLength(1);
    expect(result.metadata.degraded).toBe(true);
    // Stage 3 metadata uses fallback values
    expect(result.metadata.stage3.rerankApplied).toBe(false);
    expect(result.metadata.stage3.durationMs).toBe(0);
    // Stage 4 still called
    expect(mockStage4).toHaveBeenCalledOnce();
  });

  it('degrades gracefully on Stage 4 failure (returns unfiltered results)', async () => {
    mockStage4.mockRejectedValue(new Error('score invariant violation'));
    const config = createPipelineConfig();

    const result = await executePipeline(config);

    expect(result.results).toHaveLength(1);
    expect(result.metadata.degraded).toBe(true);
    // Stage 4 metadata uses fallback values
    expect(result.metadata.stage4.stateFiltered).toBe(0);
    expect(result.metadata.stage4.evidenceGapDetected).toBe(false);
  });

  it('records timing for all stages including total', async () => {
    const config = createPipelineConfig();
    const result = await executePipeline(config);

    const timing = result.metadata.timing!;
    expect(timing.stage1).toBeGreaterThanOrEqual(0);
    expect(timing.stage2).toBeGreaterThanOrEqual(0);
    expect(timing.stage3).toBeGreaterThanOrEqual(0);
    expect(timing.stage4).toBeGreaterThanOrEqual(0);
    expect(timing.total).toBeGreaterThanOrEqual(0);
  });

  it('handles multiple stage failures (Stage 2 + Stage 4)', async () => {
    mockStage2.mockRejectedValue(new Error('scoring crash'));
    mockStage4.mockRejectedValue(new Error('filter crash'));
    const config = createPipelineConfig();

    const result = await executePipeline(config);

    expect(result.results).toHaveLength(1);
    expect(result.metadata.degraded).toBe(true);
    expect(result.metadata.timing).toBeDefined();
  });
});
