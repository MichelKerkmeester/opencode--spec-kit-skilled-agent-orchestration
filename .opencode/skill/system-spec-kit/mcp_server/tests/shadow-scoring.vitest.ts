// TEST: Shadow Scoring
// R13-S2: Shadow scoring infrastructure and disabled compatibility paths.
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';

import {
  runShadowScoring,
  compareShadowResults,
  logShadowComparison,
  getShadowStats,
  _resetSchemaFlag,
  type ScoredResult,
  type ShadowConfig,
  type ShadowComparison,
} from '../lib/eval/shadow-scoring';

import { initEvalDb, closeEvalDb } from '../lib/eval/eval-db';

/* --- Test Fixtures --- */

function makeResults(ids: number[]): ScoredResult[] {
  return ids.map((id, idx) => ({
    memoryId: id,
    score: 1.0 - idx * 0.1,
    rank: idx + 1,
  }));
}

/* --- Shadow Scoring Tests --- */

describe('Shadow Scoring (R13-S2)', () => {
  describe('compareShadowResults', () => {
    it('computes correct deltas for overlapping results', () => {
      const production = makeResults([1, 2, 3]);
      const shadow: ScoredResult[] = [
        { memoryId: 2, score: 0.95, rank: 1 },
        { memoryId: 1, score: 0.85, rank: 2 },
        { memoryId: 3, score: 0.75, rank: 3 },
      ];

      const comparison = compareShadowResults(
        'test query',
        production,
        shadow,
        'test-algo',
      );

      expect(comparison.query).toBe('test query');
      expect(comparison.algorithmName).toBe('test-algo');
      expect(comparison.deltas).toHaveLength(3);
      expect(comparison.summary.overlapCount).toBe(3);
      expect(comparison.summary.productionOnlyIds).toHaveLength(0);
      expect(comparison.summary.shadowOnlyIds).toHaveLength(0);
    });

    it('identifies production-only and shadow-only results', () => {
      const production = makeResults([1, 2, 3]);
      const shadow: ScoredResult[] = [
        { memoryId: 2, score: 0.9, rank: 1 },
        { memoryId: 4, score: 0.8, rank: 2 },
      ];

      const comparison = compareShadowResults(
        'test query',
        production,
        shadow,
        'test-algo',
      );

      expect(comparison.summary.overlapCount).toBe(1);
      expect(comparison.summary.productionOnlyIds).toContain(1);
      expect(comparison.summary.productionOnlyIds).toContain(3);
      expect(comparison.summary.shadowOnlyIds).toContain(4);
    });

    it('computes rank correlation = 1 for identical ordering', () => {
      const production = makeResults([1, 2, 3, 4, 5]);
      const shadow = makeResults([1, 2, 3, 4, 5]);

      const comparison = compareShadowResults(
        'test query',
        production,
        shadow,
        'same-algo',
      );

      expect(comparison.summary.rankCorrelation).toBe(1);
    });

    it('computes rank correlation = -1 for fully reversed ordering', () => {
      const production = makeResults([1, 2, 3]);
      const shadow: ScoredResult[] = [
        { memoryId: 3, score: 0.9, rank: 1 },
        { memoryId: 2, score: 0.8, rank: 2 },
        { memoryId: 1, score: 0.7, rank: 3 },
      ];

      const comparison = compareShadowResults(
        'test query',
        production,
        shadow,
        'reverse-algo',
      );

      expect(comparison.summary.rankCorrelation).toBe(-1);
    });

    it('handles empty production results', () => {
      const comparison = compareShadowResults(
        'test query',
        [],
        makeResults([1, 2]),
        'test-algo',
      );

      expect(comparison.summary.productionCount).toBe(0);
      expect(comparison.summary.overlapCount).toBe(0);
      expect(comparison.summary.shadowOnlyIds).toHaveLength(2);
    });

    it('handles empty shadow results', () => {
      const comparison = compareShadowResults(
        'test query',
        makeResults([1, 2]),
        [],
        'test-algo',
      );

      expect(comparison.summary.shadowCount).toBe(0);
      expect(comparison.summary.overlapCount).toBe(0);
      expect(comparison.summary.productionOnlyIds).toHaveLength(2);
    });

    it('computes correct mean absolute score delta', () => {
      const production: ScoredResult[] = [
        { memoryId: 1, score: 1.0, rank: 1 },
        { memoryId: 2, score: 0.5, rank: 2 },
      ];
      const shadow: ScoredResult[] = [
        { memoryId: 1, score: 0.8, rank: 1 },
        { memoryId: 2, score: 0.7, rank: 2 },
      ];

      const comparison = compareShadowResults(
        'test query',
        production,
        shadow,
        'test-algo',
      );

      // |0.8-1.0| = 0.2, |0.7-0.5| = 0.2, mean = 0.2
      expect(comparison.summary.meanAbsScoreDelta).toBeCloseTo(0.2, 5);
    });

    it('attaches metadata when provided', () => {
      const comparison = compareShadowResults(
        'test query',
        makeResults([1]),
        makeResults([1]),
        'test-algo',
        { version: '2.0', sprint: 4 },
      );

      expect(comparison.metadata).toEqual({ version: '2.0', sprint: 4 });
    });
  });

  describe('runShadowScoring', () => {
    const originalEnv = process.env.SPECKIT_SHADOW_SCORING;

    afterEach(() => {
      if (originalEnv === undefined) {
        delete process.env.SPECKIT_SHADOW_SCORING;
      } else {
        process.env.SPECKIT_SHADOW_SCORING = originalEnv;
      }
    });

    it('returns null when shadow scoring is disabled', async () => {
      delete process.env.SPECKIT_SHADOW_SCORING;

      const config: ShadowConfig = {
        algorithmName: 'test-algo',
        shadowScoringFn: () => makeResults([1, 2, 3]),
      };

      const result = await runShadowScoring('test query', makeResults([1, 2, 3]), config);
      expect(result).toBeNull();
    });

    it('returns null when env var is "true" (REMOVED flag — always disabled)', async () => {
      process.env.SPECKIT_SHADOW_SCORING = 'true';

      const config: ShadowConfig = {
        algorithmName: 'test-algo',
        shadowScoringFn: (_query, results) => {
          return results.map((r, idx) => ({
            memoryId: r.memoryId,
            score: 1.0 - idx * 0.1,
            rank: idx + 1,
          })).reverse();
        },
      };

      const result = await runShadowScoring('test query', makeResults([1, 2, 3]), config);
      expect(result).toBeNull();
    });

    it('does NOT call shadow scoring function (REMOVED flag)', async () => {
      process.env.SPECKIT_SHADOW_SCORING = 'true';

      const production = makeResults([1, 2, 3]);
      const originalScores = production.map(r => r.score);

      const config: ShadowConfig = {
        algorithmName: 'mutator-algo',
        shadowScoringFn: (_query, results) => {
          for (const r of results) {
            r.score = 999;
          }
          return results;
        },
      };

      const result = await runShadowScoring('test query', production, config);
      expect(result).toBeNull();

      // Original production results must be unchanged
      const currentScores = production.map(r => r.score);
      expect(currentScores).toEqual(originalScores);
    });

    it('returns null for async shadow scoring functions (REMOVED flag)', async () => {
      process.env.SPECKIT_SHADOW_SCORING = 'true';

      const config: ShadowConfig = {
        algorithmName: 'async-algo',
        shadowScoringFn: async (_query, results) => {
          await new Promise(resolve => setTimeout(resolve, 1));
          return results;
        },
      };

      const result = await runShadowScoring('test query', makeResults([1, 2]), config);
      expect(result).toBeNull();
    });

    it('returns null on shadow scoring function error (REMOVED flag — always null)', async () => {
      process.env.SPECKIT_SHADOW_SCORING = 'true';

      const config: ShadowConfig = {
        algorithmName: 'error-algo',
        shadowScoringFn: () => {
          throw new Error('intentional test error');
        },
      };

      const result = await runShadowScoring('test query', makeResults([1, 2]), config);
      expect(result).toBeNull();
    });
  });

  describe('DB Persistence (logShadowComparison + getShadowStats)', () => {
    let tmpDir: string;
    const originalEnv = process.env.SPECKIT_SHADOW_SCORING;
    const originalDbDir = process.env.SPEC_KIT_DB_DIR;

    beforeEach(() => {
      tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'shadow-test-'));
      process.env.SPEC_KIT_DB_DIR = tmpDir;
      process.env.SPECKIT_SHADOW_SCORING = 'true';
      closeEvalDb();
      _resetSchemaFlag();
      initEvalDb(tmpDir);
    });

    afterEach(() => {
      closeEvalDb();
      _resetSchemaFlag();
      if (originalEnv === undefined) {
        delete process.env.SPECKIT_SHADOW_SCORING;
      } else {
        process.env.SPECKIT_SHADOW_SCORING = originalEnv;
      }
      if (originalDbDir === undefined) {
        delete process.env.SPEC_KIT_DB_DIR;
      } else {
        process.env.SPEC_KIT_DB_DIR = originalDbDir;
      }
      try {
        fs.rmSync(tmpDir, { recursive: true, force: true });
      } catch {
        // Ignore cleanup errors
      }
    });

    it('logShadowComparison returns false (REMOVED flag — always disabled)', () => {
      const comparison = compareShadowResults(
        'test query',
        makeResults([1, 2, 3]),
        makeResults([2, 1, 3]),
        'test-algo',
      );

      const success = logShadowComparison(comparison);
      expect(success).toBe(false);
    });

    it('getShadowStats returns empty stats (REMOVED flag — logging disabled)', () => {
      const comp1 = compareShadowResults('q1', makeResults([1, 2]), makeResults([1, 2]), 'algo-a');
      const comp2 = compareShadowResults('q2', makeResults([3, 4]), makeResults([4, 3]), 'algo-b');

      logShadowComparison(comp1);
      logShadowComparison(comp2);

      const stats = getShadowStats();
      expect(stats).not.toBeNull();
      expect(stats!.totalComparisons).toBe(0);
      expect(stats!.algorithms).toHaveLength(0);
    });

    it('getShadowStats returns empty stats when no data', () => {
      const stats = getShadowStats();
      expect(stats).not.toBeNull();
      expect(stats!.totalComparisons).toBe(0);
      expect(stats!.algorithms).toHaveLength(0);
    });

    it('logShadowComparison returns false when disabled', () => {
      process.env.SPECKIT_SHADOW_SCORING = 'false';
      const comparison = compareShadowResults(
        'test query',
        makeResults([1]),
        makeResults([1]),
        'test-algo',
      );
      const success = logShadowComparison(comparison);
      expect(success).toBe(false);
    });
  });
});

/* --- Disabled Channel Attribution Tests (module removed) --- */

/*
describe('Channel Attribution (R13-S2)', () => {
  describe('attributeChannels', () => {
    it('tags results with correct single channels', () => {
      const results = makeResults([1, 2, 3]);
      const sources: ChannelSources = {
        vector: [1],
        bm25: [2],
        graph: [3],
      };

      const attributed = attributeChannels(results, sources);

      expect(attributed[0].channels.has('vector')).toBe(true);
      expect(attributed[0].isExclusive).toBe(true);
      expect(attributed[0].exclusiveChannel).toBe('vector');

      expect(attributed[1].channels.has('bm25')).toBe(true);
      expect(attributed[1].isExclusive).toBe(true);

      expect(attributed[2].channels.has('graph')).toBe(true);
      expect(attributed[2].isExclusive).toBe(true);
    });

    it('tags results with multiple channels (convergence)', () => {
      const results = makeResults([1, 2]);
      const sources: ChannelSources = {
        vector: [1, 2],
        bm25: [1],
        graph: [2],
      };

      const attributed = attributeChannels(results, sources);

      // ID 1: vector + bm25
      expect(attributed[0].channels.size).toBe(2);
      expect(attributed[0].channels.has('vector')).toBe(true);
      expect(attributed[0].channels.has('bm25')).toBe(true);
      expect(attributed[0].isExclusive).toBe(false);
      expect(attributed[0].exclusiveChannel).toBeUndefined();

      // ID 2: vector + graph
      expect(attributed[1].channels.size).toBe(2);
      expect(attributed[1].channels.has('vector')).toBe(true);
      expect(attributed[1].channels.has('graph')).toBe(true);
      expect(attributed[1].isExclusive).toBe(false);
    });

    it('handles results with no channel attribution', () => {
      const results = makeResults([1, 2, 3]);
      const sources: ChannelSources = {
        vector: [1],
      };

      const attributed = attributeChannels(results, sources);

      expect(attributed[0].channels.size).toBe(1); // ID 1 in vector
      expect(attributed[1].channels.size).toBe(0); // ID 2 not in any
      expect(attributed[2].channels.size).toBe(0); // ID 3 not in any
    });

    it('preserves original result properties', () => {
      const results = [
        { memoryId: 42, score: 0.95, rank: 1 },
      ];
      const sources: ChannelSources = { vector: [42] };

      const attributed = attributeChannels(results, sources);

      expect(attributed[0].memoryId).toBe(42);
      expect(attributed[0].score).toBe(0.95);
      expect(attributed[0].rank).toBe(1);
    });
  });

  describe('computeExclusiveContributionRate', () => {
    it('returns correct ECR for single-source results', () => {
      const results = makeResults([1, 2, 3]);
      const sources: ChannelSources = {
        vector: [1],
        bm25: [2],
        graph: [3],
      };

      const attributed = attributeChannels(results, sources);
      const ecrs = computeExclusiveContributionRate(attributed, 3);

      // Each channel has 1 exclusive out of 3 total
      for (const ecr of ecrs) {
        expect(ecr.exclusiveCount).toBe(1);
        expect(ecr.totalInTopK).toBe(3);
        expect(ecr.ecr).toBeCloseTo(1 / 3, 5);
      }
    });

    it('returns ECR = 0 for channels with no exclusive results', () => {
      const results = makeResults([1, 2]);
      const sources: ChannelSources = {
        vector: [1, 2],
        bm25: [1, 2],
      };

      const attributed = attributeChannels(results, sources);
      const ecrs = computeExclusiveContributionRate(attributed, 2);

      // Both results come from both channels — no exclusives
      for (const ecr of ecrs) {
        expect(ecr.exclusiveCount).toBe(0);
        expect(ecr.ecr).toBe(0);
      }
    });

    it('handles mixed exclusive and multi-source results', () => {
      const results = makeResults([1, 2, 3, 4]);
      const sources: ChannelSources = {
        vector: [1, 2, 3],
        bm25: [2, 4],
        trigger: [3],
      };

      const attributed = attributeChannels(results, sources);
      const ecrs = computeExclusiveContributionRate(attributed, 4);

      // ID 1: vector only (exclusive)
      // ID 2: vector + bm25 (not exclusive)
      // ID 3: vector + trigger (not exclusive)
      // ID 4: bm25 only (exclusive)
      const vectorEcr = ecrs.find(e => e.channel === 'vector');
      const bm25Ecr = ecrs.find(e => e.channel === 'bm25');
      const triggerEcr = ecrs.find(e => e.channel === 'trigger');

      expect(vectorEcr!.exclusiveCount).toBe(1); // ID 1 only
      expect(bm25Ecr!.exclusiveCount).toBe(1);   // ID 4 only
      expect(triggerEcr!.exclusiveCount).toBe(0); // ID 3 is also in vector
    });

    it('returns empty array for no results', () => {
      const ecrs = computeExclusiveContributionRate([], 10);
      expect(ecrs).toHaveLength(0);
    });

    it('respects the K cutoff', () => {
      const results = makeResults([1, 2, 3, 4, 5]);
      const sources: ChannelSources = {
        vector: [1, 2, 3, 4, 5],
        bm25: [4, 5], // only in bottom 2
      };

      const attributed = attributeChannels(results, sources);
      const ecrs = computeExclusiveContributionRate(attributed, 3);

      // Only top-3 analyzed: IDs 1, 2, 3 — all vector-only
      const vectorEcr = ecrs.find(e => e.channel === 'vector');
      expect(vectorEcr!.exclusiveCount).toBe(3);
      expect(vectorEcr!.totalInTopK).toBe(3);
      expect(vectorEcr!.ecr).toBe(1);
    });

    it('handles all results from a single channel (ECR = 1)', () => {
      const results = makeResults([1, 2, 3]);
      const sources: ChannelSources = {
        vector: [1, 2, 3],
      };

      const attributed = attributeChannels(results, sources);
      const ecrs = computeExclusiveContributionRate(attributed, 3);

      expect(ecrs).toHaveLength(1);
      expect(ecrs[0].channel).toBe('vector');
      expect(ecrs[0].ecr).toBe(1);
    });
  });

  describe('getChannelAttribution', () => {
    it('returns a complete attribution report', () => {
      const results = makeResults([1, 2, 3, 4]);
      const sources: ChannelSources = {
        vector: [1, 2, 3],
        bm25: [2, 4],
      };

      const report = getChannelAttribution(results, sources, 4);

      expect(report.totalResults).toBe(4);
      expect(report.k).toBe(4);

      // ID 1: vector only (single)
      // ID 2: vector + bm25 (multi)
      // ID 3: vector only (single)
      // ID 4: bm25 only (single)
      expect(report.singleChannelCount).toBe(3);
      expect(report.multiChannelCount).toBe(1);
      expect(report.unattributedCount).toBe(0);

      // Channel coverage
      expect(report.channelCoverage['vector']).toBe(3); // IDs 1, 2, 3
      expect(report.channelCoverage['bm25']).toBe(2);   // IDs 2, 4
    });

    it('tracks unattributed results', () => {
      const results = makeResults([1, 2, 3]);
      const sources: ChannelSources = {
        vector: [1],
      };

      const report = getChannelAttribution(results, sources, 3);

      expect(report.unattributedCount).toBe(2); // IDs 2, 3 have no channel
    });

    it('respects K cutoff for the report', () => {
      const results = makeResults([1, 2, 3, 4, 5]);
      const sources: ChannelSources = {
        vector: [1, 2, 3, 4, 5],
      };

      const report = getChannelAttribution(results, sources, 3);

      expect(report.totalResults).toBe(3);
      expect(report.singleChannelCount).toBe(3);
    });
  });
});
*/
