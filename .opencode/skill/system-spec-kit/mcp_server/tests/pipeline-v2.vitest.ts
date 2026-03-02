// ---------------------------------------------------------------
// TEST: 4-Stage Pipeline Architecture (v2)
// Validates pipeline types, stage interfaces, Stage 4 invariant,
// and pipeline orchestration under SPECKIT_PIPELINE_V2 flag.
// ---------------------------------------------------------------

import { describe, it, expect, beforeEach, afterEach } from 'vitest';

// Pipeline types and utilities
import {
  captureScoreSnapshot,
  verifyScoreInvariant,
} from '../lib/search/pipeline/types';

import type {
  PipelineRow,
  Stage4ReadonlyRow,
  ScoreSnapshot,
  PipelineConfig,
  Stage1Input,
  Stage1Output,
  Stage2Input,
  Stage2Output,
  Stage3Input,
  Stage3Output,
  Stage4Input,
  Stage4Output,
} from '../lib/search/pipeline/types';

// Feature flags
import { isPipelineV2Enabled, isEmbeddingExpansionEnabled } from '../lib/search/search-flags';

// Stage testables
import { __testables as stage4Testables } from '../lib/search/pipeline/stage4-filter';

// ── Pipeline Type Tests ──

describe('R6: Pipeline Types', () => {
  describe('PipelineRow', () => {
    it('R6-T1: PipelineRow extends Record<string, unknown>', () => {
      const row: PipelineRow = {
        id: 1,
        similarity: 85.5,
        score: 0.72,
        importance_tier: 'important',
      };
      expect(row.id).toBe(1);
      expect(row.similarity).toBe(85.5);
      // Can add arbitrary keys (extends Record)
      row.customField = 'test';
      expect(row.customField).toBe('test');
    });
  });

  describe('Stage4ReadonlyRow', () => {
    it('R6-T2: Stage4ReadonlyRow has readonly score fields at type level', () => {
      // This test verifies the type structure exists
      const row: Stage4ReadonlyRow = {
        id: 1,
        similarity: 85.5,
        score: 0.72,
        importance_tier: 'important',
      };
      expect(row.id).toBe(1);
      expect(row.similarity).toBe(85.5);
      // Stage 4 can still read score fields
      expect(row.score).toBe(0.72);
    });

    it('R6-T3: Stage4ReadonlyRow allows annotation field writes', () => {
      const row: Stage4ReadonlyRow = {
        id: 1,
        similarity: 85.5,
      };
      // Non-score fields are mutable for annotation
      row.channelAttribution = ['vector', 'fts5'];
      row.evidenceGap = { gapDetected: false };
      expect(row.channelAttribution).toEqual(['vector', 'fts5']);
    });
  });
});

// ── Score Snapshot Tests ──

describe('R6: Score Snapshot & Invariant', () => {
  const testResults: Stage4ReadonlyRow[] = [
    { id: 1, similarity: 85.5, score: 0.72, rrfScore: 0.95, intentAdjustedScore: 0.68 },
    { id: 2, similarity: 60.2, score: 0.55, rrfScore: 0.80, intentAdjustedScore: 0.52 },
    { id: 3, similarity: 45.0, score: 0.40, rrfScore: 0.60 },
  ];

  it('R6-T4: captureScoreSnapshot captures all score fields', () => {
    const snapshot = captureScoreSnapshot(testResults);
    expect(snapshot).toHaveLength(3);
    expect(snapshot[0]).toEqual({
      id: 1,
      similarity: 85.5,
      score: 0.72,
      rrfScore: 0.95,
      intentAdjustedScore: 0.68,
    });
    expect(snapshot[2]).toEqual({
      id: 3,
      similarity: 45.0,
      score: 0.40,
      rrfScore: 0.60,
      intentAdjustedScore: undefined,
    });
  });

  it('R6-T5: verifyScoreInvariant passes when no scores changed', () => {
    const before = captureScoreSnapshot(testResults);
    // No modifications — should pass
    expect(() => verifyScoreInvariant(before, testResults)).not.toThrow();
  });

  it('R6-T6: verifyScoreInvariant passes when items are filtered out', () => {
    const before = captureScoreSnapshot(testResults);
    // Remove item with id=2 (filtering is allowed in Stage 4)
    const filtered = testResults.filter(r => r.id !== 2);
    expect(() => verifyScoreInvariant(before, filtered)).not.toThrow();
  });

  it('R6-T7: verifyScoreInvariant throws when similarity changed', () => {
    const before = captureScoreSnapshot(testResults);
    const modified = testResults.map(r =>
      r.id === 1 ? { ...r, similarity: 90.0 } : r
    );
    expect(() => verifyScoreInvariant(before, modified)).toThrow(
      /Stage4Invariant.*similarity changed/
    );
  });

  it('R6-T8: verifyScoreInvariant throws when score changed', () => {
    const before = captureScoreSnapshot(testResults);
    const modified = testResults.map(r =>
      r.id === 2 ? { ...r, score: 0.99 } : r
    );
    expect(() => verifyScoreInvariant(before, modified)).toThrow(
      /Stage4Invariant.*score changed/
    );
  });

  it('R6-T9: verifyScoreInvariant throws when rrfScore changed', () => {
    const before = captureScoreSnapshot(testResults);
    const modified = testResults.map(r =>
      r.id === 3 ? { ...r, rrfScore: 0.99 } : r
    );
    expect(() => verifyScoreInvariant(before, modified)).toThrow(
      /Stage4Invariant.*rrfScore changed/
    );
  });

  it('R6-T10: verifyScoreInvariant throws when intentAdjustedScore changed', () => {
    const before = captureScoreSnapshot(testResults);
    const modified = testResults.map(r =>
      r.id === 1 ? { ...r, intentAdjustedScore: 0.99 } : r
    );
    expect(() => verifyScoreInvariant(before, modified)).toThrow(
      /Stage4Invariant.*intentAdjustedScore changed/
    );
  });
});

// ── Stage 4 Filter Tests ──

describe('R6: Stage 4 — Filter + Annotate', () => {
  describe('filterByMemoryState', () => {
    const { filterByMemoryState, STATE_PRIORITY } = stage4Testables;

    const testRows: Stage4ReadonlyRow[] = [
      { id: 1, similarity: 90, memoryState: 'HOT' },
      { id: 2, similarity: 80, memoryState: 'WARM' },
      { id: 3, similarity: 70, memoryState: 'COLD' },
      { id: 4, similarity: 60, memoryState: 'DORMANT' },
      { id: 5, similarity: 50, memoryState: 'ARCHIVED' },
    ];

    it('R6-T11: STATE_PRIORITY maps all 5 states', () => {
      expect(STATE_PRIORITY.HOT).toBe(5);
      expect(STATE_PRIORITY.WARM).toBe(4);
      expect(STATE_PRIORITY.COLD).toBe(3);
      expect(STATE_PRIORITY.DORMANT).toBe(2);
      expect(STATE_PRIORITY.ARCHIVED).toBe(1);
    });

    it('R6-T12: minState=WARM filters out COLD, DORMANT, ARCHIVED', () => {
      const result = filterByMemoryState(testRows, 'WARM', false);
      expect(result.filtered).toHaveLength(2);
      expect(result.filtered.map(r => r.id)).toEqual([1, 2]);
    });

    it('R6-T13: minState=ARCHIVED keeps all results', () => {
      const result = filterByMemoryState(testRows, 'ARCHIVED', false);
      expect(result.filtered).toHaveLength(5);
    });

    it('R6-T14: minState=HOT keeps only HOT', () => {
      const result = filterByMemoryState(testRows, 'HOT', false);
      expect(result.filtered).toHaveLength(1);
      expect(result.filtered[0].id).toBe(1);
    });

    it('R6-T15: filtering does NOT change scores', () => {
      const result = filterByMemoryState(testRows, 'WARM', false);
      for (const row of result.filtered) {
        const original = testRows.find(r => r.id === row.id)!;
        expect(row.similarity).toBe(original.similarity);
      }
    });

    it('R6-T16: missing memoryState rows are filtered out', () => {
      const rowsWithMissing: Stage4ReadonlyRow[] = [
        { id: 1, similarity: 90, memoryState: 'HOT' },
        { id: 2, similarity: 80 }, // no memoryState
      ];
      const result = filterByMemoryState(rowsWithMissing, 'WARM', false);
      expect(result.filtered).toHaveLength(1);
      expect(result.filtered[0].id).toBe(1);
    });

    it('R6-T17: case-insensitive state matching', () => {
      const rowsLowerCase: Stage4ReadonlyRow[] = [
        { id: 1, similarity: 90, memoryState: 'hot' },
        { id: 2, similarity: 80, memoryState: 'warm' },
      ];
      const result = filterByMemoryState(rowsLowerCase, 'WARM', false);
      expect(result.filtered).toHaveLength(2);
    });
  });
});

// ── Feature Flag Tests ──

describe('R6: Feature Flags', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('R6-T18: SPECKIT_PIPELINE_V2 defaults to true (graduated)', () => {
    delete process.env.SPECKIT_PIPELINE_V2;
    expect(isPipelineV2Enabled()).toBe(true);
  });

  it('R6-T19: SPECKIT_PIPELINE_V2=true enables pipeline V2', () => {
    process.env.SPECKIT_PIPELINE_V2 = 'true';
    expect(isPipelineV2Enabled()).toBe(true);
  });

  it('R6-T20: SPECKIT_PIPELINE_V2=false still returns true (deprecated, V2 always on)', () => {
    process.env.SPECKIT_PIPELINE_V2 = 'false';
    // AI-WHY: Legacy V1 pipeline removed in 017-refinement-phase-6.
    // isPipelineV2Enabled() now always returns true regardless of env var.
    expect(isPipelineV2Enabled()).toBe(true);
  });

  it('R6-T21: SPECKIT_EMBEDDING_EXPANSION defaults to true (graduated)', () => {
    delete process.env.SPECKIT_EMBEDDING_EXPANSION;
    expect(isEmbeddingExpansionEnabled()).toBe(true);
  });

  it('R6-T22: SPECKIT_EMBEDDING_EXPANSION=true enables expansion', () => {
    process.env.SPECKIT_EMBEDDING_EXPANSION = 'true';
    expect(isEmbeddingExpansionEnabled()).toBe(true);
  });
});

// ── Stage Interface Contract Tests ──

describe('R6: Stage Interface Contracts', () => {
  it('R6-T23: Stage1Output structure is well-formed', () => {
    const output: Stage1Output = {
      candidates: [{ id: 1, similarity: 85 }],
      metadata: {
        searchType: 'hybrid',
        channelCount: 5,
        candidateCount: 1,
        constitutionalInjected: 0,
        durationMs: 42,
      },
    };
    expect(output.candidates).toHaveLength(1);
    expect(output.metadata.searchType).toBe('hybrid');
  });

  it('R6-T24: Stage2Output structure includes G2-prevention fields', () => {
    const output: Stage2Output = {
      scored: [{ id: 1, similarity: 85, intentAdjustedScore: 0.72 }],
      metadata: {
        sessionBoostApplied: false,
        causalBoostApplied: false,
        intentWeightsApplied: true,
        artifactRoutingApplied: false,
        feedbackSignalsApplied: false,
        qualityFiltered: 0,
        durationMs: 15,
      },
    };
    // G2 prevention: intentWeightsApplied is tracked
    expect(output.metadata.intentWeightsApplied).toBe(true);
  });

  it('R6-T25: Stage3Output preserves MPAB stats', () => {
    const output: Stage3Output = {
      reranked: [{ id: 1, similarity: 85 }],
      metadata: {
        rerankApplied: true,
        chunkReassemblyStats: {
          collapsedChunkHits: 3,
          chunkParents: 2,
          reassembled: 1,
          fallback: 1,
        },
        durationMs: 25,
      },
    };
    expect(output.metadata.chunkReassemblyStats.chunkParents).toBe(2);
  });

  it('R6-T26: Stage4Output enforces zero score changes', () => {
    const output: Stage4Output = {
      final: [{ id: 1, similarity: 85 }],
      metadata: {
        stateFiltered: 2,
        // AI-WHY: sessionDeduped removed (Fix #14) — dedup is post-cache in main handler
        constitutionalInjected: 0,
        evidenceGapDetected: false,
        durationMs: 5,
      },
      annotations: {
        stateStats: { HOT: 1, WARM: 2 },
        featureFlags: { pipelineV2: true, trmEnabled: true },
      },
    };
    expect(output.metadata.constitutionalInjected).toBe(0);
    expect(output.annotations.featureFlags.pipelineV2).toBe(true);
  });
});

// ── Pipeline Orchestrator Integration ──

describe('R6: Pipeline Orchestrator', () => {
  it('R6-T27: executePipeline is exported from pipeline index', async () => {
    const { executePipeline } = await import('../lib/search/pipeline');
    expect(typeof executePipeline).toBe('function');
  });
});
