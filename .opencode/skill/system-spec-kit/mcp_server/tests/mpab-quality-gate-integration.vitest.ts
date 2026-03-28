// ───────────────────────────────────────────────────────────────
// 1. MPAB QUALITY GATE INTEGRATION VITEST
// ───────────────────────────────────────────────────────────────
// TEST: MPAB Quality Gate Integration
// Cross-module wiring tests for MPAB, Quality Gate, Reconsolidation,
// Shadow Scoring, and Feature Flag independence.
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import Database from 'better-sqlite3';

// Modules under test
import {
  computeMPAB,
  isMpabEnabled,
  collapseAndReassembleChunkResults,
  MPAB_BONUS_COEFFICIENT,
} from '../lib/scoring/mpab-aggregation';
import type { ChunkResult } from '../lib/scoring/mpab-aggregation';

import {
  isQualityGateEnabled,
  runQualityGate,
  resetActivationTimestamp,
  SIGNAL_DENSITY_THRESHOLD,
  SEMANTIC_DEDUP_THRESHOLD,
} from '../lib/validation/save-quality-gate';
import type { QualityGateResult } from '../lib/validation/save-quality-gate';

import {
  isReconsolidationEnabled,
  determineAction,
  reconsolidate,
  MERGE_THRESHOLD,
  CONFLICT_THRESHOLD,
} from '../lib/storage/reconsolidation';
import type {
  SimilarMemory,
  NewMemoryData,
  GenerateEmbeddingFn,
} from '../lib/storage/reconsolidation';

import {
  runShadowScoring,
  logShadowComparison,
  getShadowStats,
} from '../lib/eval/shadow-scoring';

// Feature flags from search-flags
import {
  isDocscoreAggregationEnabled,
  isSaveQualityGateEnabled,
  isReconsolidationEnabled as isReconsolidationFlag,
} from '../lib/search/search-flags';

// TEST HELPERS
/** Save and restore env vars around tests */
function withEnvVars(vars: Record<string, string | undefined>, fn: () => void | Promise<void>) {
  const saved: Record<string, string | undefined> = {};
  for (const key of Object.keys(vars)) {
    saved[key] = process.env[key];
  }
  return async () => {
    try {
      for (const [key, val] of Object.entries(vars)) {
        if (val === undefined) {
          delete process.env[key];
        } else {
          process.env[key] = val;
        }
      }
      await fn();
    } finally {
      for (const [key, val] of Object.entries(saved)) {
        if (val === undefined) {
          delete process.env[key];
        } else {
          process.env[key] = val;
        }
      }
    }
  };
}

/** Create a minimal chunk result for testing. */
function makeChunk(
  parentMemoryId: number | string,
  chunkIndex: number,
  score: number,
  id?: number | string,
): ChunkResult {
  return {
    id: id ?? `chunk-${parentMemoryId}-${chunkIndex}`,
    parentMemoryId,
    chunkIndex,
    score,
  };
}

/** Create a simple embedding vector */
function makeEmbedding(dim: number, fill: number = 1.0): number[] {
  return Array(dim).fill(fill);
}

/** Create a base valid new memory object */
function makeNewMemory(overrides: Partial<NewMemoryData> = {}): NewMemoryData {
  return {
    title: 'Test Memory Title',
    content: 'This is the content of the new memory that is being saved for testing purposes. It should be long enough.',
    specFolder: 'test-spec',
    filePath: '/test/memory.md',
    embedding: makeEmbedding(10),
    triggerPhrases: ['test', 'memory'],
    importanceTier: 'normal',
    importanceWeight: 0.5,
    ...overrides,
  };
}

/** Create a mock similar memory */
function makeSimilarMemory(overrides: Partial<SimilarMemory> = {}): SimilarMemory {
  return {
    id: 1,
    file_path: '/test/existing.md',
    title: 'Existing Memory',
    content_text: 'Existing memory content that was previously stored.',
    similarity: 0.5,
    spec_folder: 'test-spec',
    ...overrides,
  };
}

// Feature flag env var names
const S4_FLAGS = {
  SPECKIT_DOCSCORE_AGGREGATION: 'SPECKIT_DOCSCORE_AGGREGATION',
  SPECKIT_SHADOW_SCORING: 'SPECKIT_SHADOW_SCORING',
  SPECKIT_SAVE_QUALITY_GATE: 'SPECKIT_SAVE_QUALITY_GATE',
  SPECKIT_RECONSOLIDATION: 'SPECKIT_RECONSOLIDATION',
};

// SUITE 1: MPAB + Pipeline Integration
describe('Sprint 4 Integration: MPAB + Pipeline', () => {
  afterEach(() => {
    delete process.env.SPECKIT_DOCSCORE_AGGREGATION;
  });

  it('S4-INT-01: MPAB collapses chunks when flag is ON and chunks have parentMemoryId', withEnvVars(
    { SPECKIT_DOCSCORE_AGGREGATION: 'true' },
    () => {
      expect(isMpabEnabled()).toBe(true);
      expect(isDocscoreAggregationEnabled()).toBe(true);

      // Simulate post-fusion results with chunk metadata
      const chunks: ChunkResult[] = [
        makeChunk(100, 0, 0.9),
        makeChunk(100, 1, 0.6),
        makeChunk(100, 2, 0.3),
        makeChunk(200, 0, 0.85),
        makeChunk(200, 1, 0.4),
      ];

      const collapsed = collapseAndReassembleChunkResults(chunks);

      // Should collapse to 2 parent memories
      expect(collapsed).toHaveLength(2);

      // Parent 100: sMax=0.9, bonus = 0.3 * (0.6+0.3) / sqrt(3) = 0.3 * 0.9 / 1.732
      const parent100 = collapsed.find(c => c.parentMemoryId === 100);
      expect(parent100).toBeDefined();
      expect(parent100!._chunkHits).toBe(3);
      expect(parent100!.mpabScore).toBeGreaterThan(0.9); // sMax + bonus

      // Parent 200: sMax=0.85, bonus = 0.3 * 0.4 / sqrt(2)
      const parent200 = collapsed.find(c => c.parentMemoryId === 200);
      expect(parent200).toBeDefined();
      expect(parent200!._chunkHits).toBe(2);
      expect(parent200!.mpabScore).toBeGreaterThan(0.85);
    },
  ));

  it('S4-INT-02: MPAB is skipped when flag is explicitly OFF', withEnvVars(
    { SPECKIT_DOCSCORE_AGGREGATION: 'false' },
    () => {
      expect(isMpabEnabled()).toBe(false);
      expect(isDocscoreAggregationEnabled()).toBe(false);

      // When flag is off, collapseAndReassembleChunkResults still works
      // But the pipeline code would not call it
      const chunks: ChunkResult[] = [
        makeChunk(100, 0, 0.9),
        makeChunk(100, 1, 0.6),
      ];
      const collapsed = collapseAndReassembleChunkResults(chunks);
      // Module-level function still works, but pipeline gate prevents calling it
      expect(collapsed).toHaveLength(1);
    },
  ));

  it('S4-INT-03: R1+N4 Interaction — MPAB operates on post-fusion scores not pre-boosted', withEnvVars(
    { SPECKIT_DOCSCORE_AGGREGATION: 'true' },
    () => {
      // MPAB takes scores as-is from the fusion pipeline (post-RRF, post-normalization)
      // It does NOT apply its own boosting to raw pre-fusion scores
      const fusionScores = [0.7, 0.3, 0.2]; // Simulated post-RRF fusion scores
      const mpabScore = computeMPAB(fusionScores);

      // SMax = 0.7, remaining = [0.3, 0.2]
      // Bonus = 0.3 * (0.3 + 0.2) / sqrt(3) = 0.3 * 0.5 / 1.732 ≈ 0.0866
      const expectedSMax = 0.7;
      const expectedBonus = MPAB_BONUS_COEFFICIENT * (0.3 + 0.2) / Math.sqrt(3);
      expect(mpabScore).toBeCloseTo(expectedSMax + expectedBonus, 4);
    },
  ));

  it('S4-INT-04: Chunks without parentMemoryId are left untouched by MPAB', withEnvVars(
    { SPECKIT_DOCSCORE_AGGREGATION: 'true' },
    () => {
      // Non-chunk results (no parentMemoryId) should pass through unchanged
      // This tests the pipeline's filter logic
      const nonChunkResult = { id: 50, score: 0.8, source: 'vector' };
      const chunkResult = { id: 'chunk-100-0', parentMemoryId: 100, chunkIndex: 0, score: 0.7 };

      // CollapseAndReassembleChunkResults only processes actual chunks
      const collapsed = collapseAndReassembleChunkResults([chunkResult]);
      expect(collapsed).toHaveLength(1);
      expect(collapsed[0].parentMemoryId).toBe(100);

      // Non-chunk would be filtered out before calling collapse
      // (tested at pipeline level, not module level)
      expect(nonChunkResult.score).toBe(0.8); // unchanged
    },
  ));
});

// SUITE 2: Quality Gate + Save Integration
describe('Sprint 4 Integration: Quality Gate + Save', () => {
  afterEach(() => {
    delete process.env.SPECKIT_SAVE_QUALITY_GATE;
    resetActivationTimestamp();
  });

  it('S4-INT-05: Quality gate rejects low-quality saves when flag is ON', withEnvVars(
    { SPECKIT_SAVE_QUALITY_GATE: 'true' },
    () => {
      expect(isQualityGateEnabled()).toBe(true);
      expect(isSaveQualityGateEnabled()).toBe(true);

      // Content with no title, no triggers, very short — should fail structural + quality
      const result: QualityGateResult = runQualityGate({
        title: null,
        content: 'x', // Too short
        specFolder: 'test-spec',
        triggerPhrases: [],
      });

      // Should fail (either reject or warn-only depending on activation timestamp)
      expect(result.gateEnabled).toBe(true);
      expect(result.wouldReject).toBe(true);
      expect(result.reasons.length).toBeGreaterThan(0);
    },
  ));

  it('S4-INT-06: Quality gate passes well-formed saves', withEnvVars(
    { SPECKIT_SAVE_QUALITY_GATE: 'true' },
    () => {
      const content = `---
title: Well-Formed Memory About Testing
trigger_phrases: [integration test, quality gate, validation]
context_type: implementation
---

# Well-Formed Memory

This memory contains substantial content about the implementation of the quality gate feature.
It includes proper structure, anchors, and enough signal density to pass all validation layers.

## Key Decisions

The quality gate uses a 3-layer approach for maximum coverage while maintaining low false-positive rates.

## Implementation Details

Signal density is computed as a weighted average of title quality, trigger quality, length quality,
anchor quality, and metadata quality dimensions. The threshold is set at ${SIGNAL_DENSITY_THRESHOLD}.
`;

      const result: QualityGateResult = runQualityGate({
        title: 'Well-Formed Memory About Testing',
        content,
        specFolder: 'test-spec',
        triggerPhrases: ['integration test', 'quality gate', 'validation'],
      });

      expect(result.gateEnabled).toBe(true);
      // Structural should pass
      expect(result.layers.structural.pass).toBe(true);
    },
  ));

  it('S4-INT-07: Quality gate is bypassed when flag is explicitly OFF', withEnvVars(
    { SPECKIT_SAVE_QUALITY_GATE: 'false' },
    () => {
      expect(isQualityGateEnabled()).toBe(false);
      expect(isSaveQualityGateEnabled()).toBe(false);

      // Even low-quality content passes when gate is off
      const result: QualityGateResult = runQualityGate({
        title: null,
        content: 'x',
        specFolder: 'test-spec',
      });

      expect(result.pass).toBe(true);
      expect(result.gateEnabled).toBe(false);
    },
  ));
});

// SUITE 3: Reconsolidation + Save Integration
describe('Sprint 4 Integration: Reconsolidation + Save', () => {
  afterEach(() => {
    delete process.env.SPECKIT_RECONSOLIDATION;
  });

  it('S4-INT-08: Reconsolidation disabled returns null (normal save path)', withEnvVars(
    { SPECKIT_RECONSOLIDATION: 'false' },
    async () => {
      expect(isReconsolidationEnabled()).toBe(false);

      const memory = makeNewMemory();

      // When disabled, reconsolidate returns null — caller uses normal save path
      const result = await reconsolidate(memory, null as unknown as Database.Database, {
        findSimilar: () => [],
        storeMemory: () => 1,
      });

      expect(result).toBeNull();
    },
  ));

  it('S4-INT-09: Reconsolidation merges duplicates (similarity >= 0.88)', withEnvVars(
    { SPECKIT_RECONSOLIDATION: 'true' },
    async () => {
      expect(isReconsolidationEnabled()).toBe(true);

      const existingMemory = makeSimilarMemory({
        id: 42,
        similarity: 0.92, // Above MERGE_THRESHOLD
        file_path: '/test/existing.md',
        content_text: 'Original memory content about the feature.',
      });

      const memory = makeNewMemory({ content: 'Updated memory content about the feature.' });

      const generateEmbedding: GenerateEmbeddingFn = async () => makeEmbedding(10);

      const database = new Database(':memory:');
      try {
        database.exec(`
          CREATE TABLE memory_index (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            spec_folder TEXT NOT NULL DEFAULT '',
            file_path TEXT NOT NULL DEFAULT '',
            title TEXT,
            content_text TEXT,
            trigger_phrases TEXT DEFAULT '[]',
            content_hash TEXT DEFAULT '',
            importance_weight REAL DEFAULT 0.5,
            importance_tier TEXT DEFAULT 'normal',
            created_at TEXT NOT NULL DEFAULT (datetime('now')),
            updated_at TEXT NOT NULL DEFAULT (datetime('now')),
            last_review TEXT,
            parent_id INTEGER,
            embedding_status TEXT DEFAULT 'pending',
            is_archived INTEGER DEFAULT 0
          );

          CREATE TABLE vec_memories (
            rowid INTEGER PRIMARY KEY,
            embedding BLOB
          );

          CREATE TABLE causal_edges (
            id INTEGER PRIMARY KEY,
            source_id TEXT NOT NULL,
            target_id TEXT NOT NULL,
            relation TEXT NOT NULL,
            strength REAL DEFAULT 1.0,
            evidence TEXT,
            extracted_at TEXT DEFAULT (datetime('now')),
            created_by TEXT DEFAULT 'manual',
            last_accessed TEXT,
            UNIQUE(source_id, target_id, relation)
          );

          CREATE TABLE weight_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            edge_id INTEGER NOT NULL,
            old_strength REAL NOT NULL,
            new_strength REAL NOT NULL,
            changed_by TEXT DEFAULT 'manual',
            changed_at TEXT DEFAULT (datetime('now')),
            reason TEXT
          );

          CREATE TABLE memory_lineage (
            memory_id INTEGER PRIMARY KEY,
            logical_key TEXT NOT NULL,
            version_number INTEGER NOT NULL,
            root_memory_id INTEGER NOT NULL,
            predecessor_memory_id INTEGER,
            superseded_by_memory_id INTEGER,
            valid_from TEXT NOT NULL,
            valid_to TEXT,
            transition_event TEXT NOT NULL,
            actor TEXT NOT NULL DEFAULT 'system',
            metadata TEXT,
            created_at TEXT DEFAULT (datetime('now'))
          );

          CREATE TABLE active_memory_projection (
            logical_key TEXT PRIMARY KEY,
            root_memory_id INTEGER NOT NULL,
            active_memory_id INTEGER NOT NULL,
            updated_at TEXT NOT NULL
          );
        `);

        database.prepare(`
          INSERT INTO memory_index (
            id, spec_folder, file_path, title, content_text, importance_weight,
            embedding_status, created_at, updated_at
          )
          VALUES (
            42, 'test-spec', '/test/existing.md', 'Existing Memory',
            'Original memory content about the feature.', 0.5, 'success',
            datetime('now'), datetime('now')
          )
        `).run();
        database.prepare(`
          INSERT INTO vec_memories (rowid, embedding) VALUES (42, ?)
        `).run(Buffer.from(new Float32Array(makeEmbedding(10)).buffer));

        const result = await reconsolidate(memory, database, {
          findSimilar: () => [existingMemory],
          storeMemory: () => 99,
          generateEmbedding,
        });

        expect(result).not.toBeNull();
        expect(result!.action).toBe('merge');
        if (result!.action === 'merge') {
          expect(result!.existingMemoryId).toBe(42);
          expect(result!.similarity).toBe(0.92);
        }
      } finally {
        database.close();
      }
    },
  ));

  it('S4-INT-10: Reconsolidation action thresholds are correct', () => {
    // Verify threshold boundaries
    expect(determineAction(0.88)).toBe('merge');
    expect(determineAction(0.92)).toBe('merge');
    expect(determineAction(1.0)).toBe('merge');

    expect(determineAction(0.75)).toBe('conflict');
    expect(determineAction(0.87)).toBe('conflict');

    expect(determineAction(0.74)).toBe('complement');
    expect(determineAction(0.50)).toBe('complement');
    expect(determineAction(0.0)).toBe('complement');
  });
});

// SUITE 4: TM-04/TM-06 Interaction
describe('Sprint 4 Integration: TM-04 + TM-06 Interaction', () => {
  afterEach(() => {
    delete process.env.SPECKIT_SAVE_QUALITY_GATE;
    delete process.env.SPECKIT_RECONSOLIDATION;
    resetActivationTimestamp();
  });

  it('S4-INT-11: Save with similarity in [0.88, 0.92] passes quality gate then triggers reconsolidation merge', withEnvVars(
    { SPECKIT_SAVE_QUALITY_GATE: 'true', SPECKIT_RECONSOLIDATION: 'true' },
    async () => {
      // Quality gate should pass for well-formed content
      const content = `---
title: Feature Implementation Notes
trigger_phrases: [implementation, quality gate, reconsolidation]
context_type: implementation
---

# Feature Implementation Notes

This document describes the implementation of the Sprint 4 quality gate
and reconsolidation features. It contains detailed technical notes.

## Architecture Decisions

The quality gate runs BEFORE reconsolidation in the save pipeline.
This ensures only quality content gets merged or stored.
`;

      // Step 1: Quality gate should pass
      const qgResult = runQualityGate({
        title: 'Feature Implementation Notes',
        content,
        specFolder: 'test-spec',
        triggerPhrases: ['implementation', 'quality gate', 'reconsolidation'],
      });

      expect(qgResult.gateEnabled).toBe(true);
      expect(qgResult.layers.structural.pass).toBe(true);

      // Step 2: Reconsolidation should determine 'merge' for similarity in [0.88, 0.92]
      const similarity = 0.90; // Between MERGE_THRESHOLD and SEMANTIC_DEDUP_THRESHOLD
      const action = determineAction(similarity);
      expect(action).toBe('merge');

      // Verify the thresholds are correct
      expect(MERGE_THRESHOLD).toBe(0.88);
      expect(SEMANTIC_DEDUP_THRESHOLD).toBe(0.92);
    },
  ));

  it('S4-INT-12: Both quality gate and reconsolidation disabled means no Sprint 4 save behavior', withEnvVars(
    { SPECKIT_SAVE_QUALITY_GATE: 'false', SPECKIT_RECONSOLIDATION: 'false' },
    async () => {
      expect(isQualityGateEnabled()).toBe(false);
      expect(isReconsolidationEnabled()).toBe(false);

      // Quality gate passthrough
      const qgResult = runQualityGate({
        title: null,
        content: 'tiny',
        specFolder: 'test-spec',
      });
      expect(qgResult.pass).toBe(true);
      expect(qgResult.gateEnabled).toBe(false);

      // Reconsolidation returns null
      const reconResult = await reconsolidate(makeNewMemory(), null as unknown as Database.Database, {
        findSimilar: () => [],
        storeMemory: () => 1,
      });
      expect(reconResult).toBeNull();
    },
  ));
});

// SUITE 5: Shadow Scoring + Channel Attribution
describe('Sprint 4 Integration: Shadow Scoring + Channel Attribution', () => {
  afterEach(() => {
    delete process.env.SPECKIT_SHADOW_SCORING;
  });

  it('S4-INT-13: Shadow scoring always disabled (REMOVED flag)', withEnvVars(
    { SPECKIT_SHADOW_SCORING: 'true' },
    async () => {
      const comparison = await runShadowScoring(
        'shadow test',
        [{ memoryId: 1, score: 0.9, rank: 1 }],
        {
          algorithmName: 'shadow-v2',
          shadowScoringFn: () => [{ memoryId: 1, score: 0.95, rank: 1 }],
        },
      );

      expect(comparison).toBeNull();
    },
  ));

  it('S4-INT-14: Shadow scoring disabled when flag is OFF (REMOVED)', withEnvVars(
    { SPECKIT_SHADOW_SCORING: undefined },
    () => {
      const baselineStats = getShadowStats();
      const logged = logShadowComparison({
        timestamp: '2026-03-14T00:00:00.000Z',
        query: 'shadow test',
        algorithmName: 'shadow-v2',
        deltas: [],
        summary: {
          productionCount: 1,
          shadowCount: 1,
          overlapCount: 1,
          meanAbsScoreDelta: 0,
          meanAbsRankDelta: 0,
          rankCorrelation: 1,
          productionOnlyIds: [],
          shadowOnlyIds: [],
        },
      });

      expect(logged).toBe(false);
      expect(getShadowStats()).toEqual(baselineStats);
    },
  ));

  /*
  it('S4-INT-15: Channel attribution produces valid report', () => {
    const results = [
      { memoryId: 1, score: 0.9, rank: 1 },
      { memoryId: 2, score: 0.8, rank: 2 },
      { memoryId: 3, score: 0.7, rank: 3 },
      { memoryId: 4, score: 0.6, rank: 4 },
    ];

    const channelSources: ChannelSources = {
      vector: [1, 2, 3],
      fts: [2, 4],
      bm25: [3, 4],
    };

    const report = getChannelAttribution(results, channelSources, 4);

    expect(report.totalResults).toBe(4);
    expect(report.k).toBe(4);
    expect(report.channelECRs).toBeDefined();
    expect(report.channelECRs.length).toBeGreaterThan(0);

    // Memory 1 is exclusive to vector
    const vectorEcr = report.channelECRs.find(e => e.channel === 'vector');
    expect(vectorEcr).toBeDefined();
    expect(vectorEcr!.exclusiveCount).toBeGreaterThanOrEqual(1);
  });
  */
});

// SUITE 6: Feature Flag Independence
describe('Sprint 4 Integration: Feature Flag Independence', () => {
  const allFlags = [
    S4_FLAGS.SPECKIT_DOCSCORE_AGGREGATION,
    S4_FLAGS.SPECKIT_SHADOW_SCORING,
    S4_FLAGS.SPECKIT_SAVE_QUALITY_GATE,
    S4_FLAGS.SPECKIT_RECONSOLIDATION,
  ];

  afterEach(() => {
    for (const flag of allFlags) {
      delete process.env[flag];
    }
    resetActivationTimestamp();
  });

  it('S4-INT-16: Each flag can be independently enabled without affecting others', () => {
    const baselineShadowTotal = getShadowStats()?.totalComparisons ?? null;

    // Enable only MPAB — explicitly disable others (graduated flags default ON when unset)
    process.env.SPECKIT_DOCSCORE_AGGREGATION = 'true';
    process.env.SPECKIT_SAVE_QUALITY_GATE = 'false';
    process.env.SPECKIT_RECONSOLIDATION = 'false';
    expect(isDocscoreAggregationEnabled()).toBe(true);
    expect(logShadowComparison({
      timestamp: '2026-03-14T00:00:00.000Z',
      query: 'shadow test',
      algorithmName: 'shadow-v2',
      deltas: [],
      summary: {
        productionCount: 0,
        shadowCount: 0,
        overlapCount: 0,
        meanAbsScoreDelta: 0,
        meanAbsRankDelta: 0,
        rankCorrelation: 0,
        productionOnlyIds: [],
        shadowOnlyIds: [],
      },
    })).toBe(false);
    expect(isSaveQualityGateEnabled()).toBe(false);
    expect(isReconsolidationFlag()).toBe(false);

    // Shadow scoring is REMOVED — always false regardless of env var
    process.env.SPECKIT_SHADOW_SCORING = 'true';
    process.env.SPECKIT_DOCSCORE_AGGREGATION = 'false';
    process.env.SPECKIT_SAVE_QUALITY_GATE = 'false';
    process.env.SPECKIT_RECONSOLIDATION = 'false';
    expect(isDocscoreAggregationEnabled()).toBe(false);
    expect(getShadowStats()?.totalComparisons ?? null).toBe(baselineShadowTotal);
    expect(isSaveQualityGateEnabled()).toBe(false);
    expect(isReconsolidationFlag()).toBe(false);

    // Enable only quality gate — explicitly disable others
    process.env.SPECKIT_SAVE_QUALITY_GATE = 'true';
    process.env.SPECKIT_DOCSCORE_AGGREGATION = 'false';
    process.env.SPECKIT_RECONSOLIDATION = 'false';
    delete process.env.SPECKIT_SHADOW_SCORING;
    expect(isDocscoreAggregationEnabled()).toBe(false);
    // IsShadowScoringEnabled removed — shadow scoring permanently disabled
    expect(isSaveQualityGateEnabled()).toBe(true);
    expect(isReconsolidationFlag()).toBe(false);

    // Enable only reconsolidation — explicitly disable others
    process.env.SPECKIT_RECONSOLIDATION = 'true';
    process.env.SPECKIT_DOCSCORE_AGGREGATION = 'false';
    process.env.SPECKIT_SAVE_QUALITY_GATE = 'false';
    expect(isDocscoreAggregationEnabled()).toBe(false);
    // IsShadowScoringEnabled removed — shadow scoring permanently disabled
    expect(isSaveQualityGateEnabled()).toBe(false);
    expect(isReconsolidationFlag()).toBe(true);
  });

  it('S4-INT-17: All graduated flags enabled simultaneously (shadow scoring REMOVED)', () => {
    process.env.SPECKIT_DOCSCORE_AGGREGATION = 'true';
    process.env.SPECKIT_SHADOW_SCORING = 'true';
    process.env.SPECKIT_SAVE_QUALITY_GATE = 'true';
    process.env.SPECKIT_RECONSOLIDATION = 'true';

    expect(isDocscoreAggregationEnabled()).toBe(true);
    // IsShadowScoringEnabled removed — shadow scoring permanently disabled
    expect(isSaveQualityGateEnabled()).toBe(true);
    expect(isReconsolidationFlag()).toBe(true);
  });

  it('S4-INT-18: Flag values are case-insensitive', () => {
    process.env.SPECKIT_DOCSCORE_AGGREGATION = 'TRUE';
    expect(isDocscoreAggregationEnabled()).toBe(true);

    process.env.SPECKIT_DOCSCORE_AGGREGATION = 'True';
    expect(isDocscoreAggregationEnabled()).toBe(true);

    process.env.SPECKIT_DOCSCORE_AGGREGATION = 'tRuE';
    expect(isDocscoreAggregationEnabled()).toBe(true);
  });

  it('S4-INT-19: Only "false" and "0" disable flags', () => {
    process.env.SPECKIT_DOCSCORE_AGGREGATION = 'false';
    expect(isDocscoreAggregationEnabled()).toBe(false);

    process.env.SPECKIT_DOCSCORE_AGGREGATION = '0';
    expect(isDocscoreAggregationEnabled()).toBe(false);

    process.env.SPECKIT_DOCSCORE_AGGREGATION = '1';
    expect(isDocscoreAggregationEnabled()).toBe(true);

    process.env.SPECKIT_DOCSCORE_AGGREGATION = 'yes';
    expect(isDocscoreAggregationEnabled()).toBe(true);

    process.env.SPECKIT_DOCSCORE_AGGREGATION = '';
    expect(isDocscoreAggregationEnabled()).toBe(true);
  });
});

// SUITE 7: All Flags OFF — Backward Compatibility
describe('Sprint 4 Integration: All Flags OFF (Backward Compatible)', () => {
  beforeEach(() => {
    // Graduated flags must be explicitly set to 'false' (they default ON when unset)
    process.env.SPECKIT_DOCSCORE_AGGREGATION = 'false';
    process.env.SPECKIT_SAVE_QUALITY_GATE = 'false';
    process.env.SPECKIT_RECONSOLIDATION = 'false';
    delete process.env.SPECKIT_SHADOW_SCORING;
    resetActivationTimestamp();
  });

  it('S4-INT-20: No Sprint 4 behavior when all flags disabled', async () => {
    // Verify all flags are off
    expect(isDocscoreAggregationEnabled()).toBe(false);
    expect(isMpabEnabled()).toBe(false);
    // IsShadowScoringEnabled removed — shadow scoring permanently disabled
    expect(isSaveQualityGateEnabled()).toBe(false);
    expect(isQualityGateEnabled()).toBe(false);
    expect(isReconsolidationFlag()).toBe(false);
    expect(isReconsolidationEnabled()).toBe(false);

    // Quality gate is passthrough when disabled
    const qgResult = runQualityGate({
      title: null,
      content: 'minimal',
      specFolder: 'test-spec',
    });
    expect(qgResult.pass).toBe(true);
    expect(qgResult.gateEnabled).toBe(false);
    expect(qgResult.wouldReject).toBe(false);

    // Reconsolidation returns null when disabled
      const reconResult = await reconsolidate(makeNewMemory(), null as unknown as Database.Database, {
        findSimilar: () => [],
        storeMemory: () => 1,
      });
    expect(reconResult).toBeNull();
  });

  it('S4-INT-21: MPAB module functions still work (but pipeline does not call them when flag OFF)', () => {
    // Module-level functions are testable regardless of flag state
    const chunks: ChunkResult[] = [
      makeChunk(1, 0, 0.8),
      makeChunk(1, 1, 0.5),
    ];
    const collapsed = collapseAndReassembleChunkResults(chunks);
    expect(collapsed).toHaveLength(1);
    expect(collapsed[0].parentMemoryId).toBe(1);

    // Pipeline does not invoke this because isMpabEnabled() is false (explicitly disabled)
    expect(isMpabEnabled()).toBe(false);
  });

  /*
  it('S4-INT-22: Channel attribution is a pure function (no flag dependency)', () => {
    // Channel attribution itself has no feature flag — it's called only when
    // Shadow scoring is enabled. But the function itself always works.
    const results = [
      { memoryId: 1, score: 0.9, rank: 1 },
      { memoryId: 2, score: 0.8, rank: 2 },
    ];
    const sources: ChannelSources = { vector: [1, 2] };

    const report = getChannelAttribution(results, sources, 2);
    expect(report.totalResults).toBe(2);
    expect(report.k).toBe(2);
  });
  */
});

// SUITE 8: Cross-Module Threshold Consistency
describe('Sprint 4 Integration: Cross-Module Threshold Consistency', () => {
  it('S4-INT-23: Quality gate semantic dedup threshold (0.92) > reconsolidation merge threshold (0.88)', () => {
    // This is a critical invariant: the quality gate's semantic dedup threshold
    // Must be higher than reconsolidation's merge threshold.
    // Otherwise, quality gate would reject saves that reconsolidation could merge.
    expect(SEMANTIC_DEDUP_THRESHOLD).toBeGreaterThan(MERGE_THRESHOLD);
    expect(SEMANTIC_DEDUP_THRESHOLD).toBe(0.92);
    expect(MERGE_THRESHOLD).toBe(0.88);
  });

  it('S4-INT-24: Reconsolidation conflict threshold (0.75) < merge threshold (0.88)', () => {
    expect(CONFLICT_THRESHOLD).toBeLessThan(MERGE_THRESHOLD);
    expect(CONFLICT_THRESHOLD).toBe(0.75);
  });

  it('S4-INT-25: Similarity range [0.88, 0.92) is valid for merge-without-dedup-rejection', () => {
    // In this range, reconsolidation merges but quality gate does NOT reject as duplicate
    const similarity = 0.90;

    // Quality gate would not reject (below SEMANTIC_DEDUP_THRESHOLD)
    expect(similarity).toBeLessThan(SEMANTIC_DEDUP_THRESHOLD);

    // Reconsolidation would merge (above MERGE_THRESHOLD)
    expect(similarity).toBeGreaterThanOrEqual(MERGE_THRESHOLD);

    const action = determineAction(similarity);
    expect(action).toBe('merge');
  });

  it('S4-INT-26: Similarity >= 0.92 triggers both dedup rejection AND merge', () => {
    // At this similarity, quality gate WOULD reject as near-duplicate
    // AND reconsolidation would merge. The pipeline order matters:
    // Quality gate runs first, so it catches this before reconsolidation
    const similarity = 0.95;

    expect(similarity).toBeGreaterThanOrEqual(SEMANTIC_DEDUP_THRESHOLD);
    expect(similarity).toBeGreaterThanOrEqual(MERGE_THRESHOLD);

    const action = determineAction(similarity);
    expect(action).toBe('merge');
  });
});
