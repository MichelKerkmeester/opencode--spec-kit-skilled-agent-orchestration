import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const WORKSPACE_ROOT = path.resolve(TEST_DIR, '../../../../../');
const require = createRequire(import.meta.url);

const stability = require(path.join(
  WORKSPACE_ROOT,
  '.opencode/skill/sk-improve-agent/scripts/benchmark-stability.cjs',
)) as {
  MIN_REPLAY_COUNT_DEFAULT: number;
  DEFAULT_REPLAY_COUNT: number;
  DEFAULT_WARNING_THRESHOLD: number;
  DEFAULT_SESSION_COUNT_THRESHOLD: number;
  DIMENSIONS: readonly string[];
  mean: (values: number[]) => number;
  stddev: (values: number[]) => number;
  stabilityCoefficient: (values: number[]) => number;
  measureStability:
    (results: object[], config?: object) =>
      | { dimensions: Record<string, { coefficient: number; mean: number; stddev: number; samples: number }>; stable: boolean; warnings: string[] }
      | { state: string; replayCount: number; minRequired: number; reason: string };
  isStable: (stabilityResult: { state?: string; dimensions?: Record<string, { coefficient: number }> }, maxVariance?: number) => boolean;
  generateWeightRecommendations: (sessionHistory: object[], currentWeights: Record<string, number>, config?: object) => { recommendations: Record<string, number> | null; sufficient: boolean; report: string };
};

describe('benchmark-stability', () => {
  describe('constants', () => {
    it('has default minimum replay count of 3', () => {
      expect(stability.MIN_REPLAY_COUNT_DEFAULT).toBe(3);
    });

    it('has default replay count of 3', () => {
      expect(stability.DEFAULT_REPLAY_COUNT).toBe(3);
    });

    it('has default warning threshold of 0.95', () => {
      expect(stability.DEFAULT_WARNING_THRESHOLD).toBe(0.95);
    });

    it('has default session count threshold of 5', () => {
      expect(stability.DEFAULT_SESSION_COUNT_THRESHOLD).toBe(5);
    });

    it('defines all 5 dimensions', () => {
      expect(stability.DIMENSIONS).toHaveLength(5);
      expect(stability.DIMENSIONS).toContain('structural');
      expect(stability.DIMENSIONS).toContain('ruleCoherence');
      expect(stability.DIMENSIONS).toContain('integration');
      expect(stability.DIMENSIONS).toContain('outputQuality');
      expect(stability.DIMENSIONS).toContain('systemFitness');
    });
  });

  describe('math helpers', () => {
    it('computes mean correctly', () => {
      expect(stability.mean([1, 2, 3, 4, 5])).toBe(3);
      expect(stability.mean([])).toBe(0);
      expect(stability.mean([10])).toBe(10);
    });

    it('computes stddev correctly', () => {
      expect(stability.stddev([])).toBe(0);
      expect(stability.stddev([5])).toBe(0);
      // stddev of [2, 4, 4, 4, 5, 5, 7, 9] should be ~2.14
      const sd = stability.stddev([2, 4, 4, 4, 5, 5, 7, 9]);
      expect(sd).toBeGreaterThan(2);
      expect(sd).toBeLessThan(2.5);
    });

    it('computes stability coefficient — perfect stability = 1.0', () => {
      expect(stability.stabilityCoefficient([90, 90, 90])).toBe(1.0);
    });

    it('computes stability coefficient — high variance = low coefficient', () => {
      const coeff = stability.stabilityCoefficient([50, 90, 10, 80]);
      expect(coeff).toBeLessThan(0.7);
    });

    it('returns 1.0 for zero mean', () => {
      expect(stability.stabilityCoefficient([0, 0, 0])).toBe(1.0);
    });
  });

  describe('measureStability', () => {
    it('returns insufficientSample for 1 replay', () => {
      expect(stability.measureStability([
        { scores: { structural: 95, ruleCoherence: 90, integration: 92, outputQuality: 88, systemFitness: 93 } },
      ])).toEqual({
        state: 'insufficientSample',
        replayCount: 1,
        minRequired: 3,
        reason: 'Benchmark stability requires at least 3 replays before verdict',
      });
    });

    it('returns insufficientSample for 2 replays', () => {
      expect(stability.measureStability([
        { scores: { structural: 95, ruleCoherence: 90, integration: 92, outputQuality: 88, systemFitness: 93 } },
        { scores: { structural: 95, ruleCoherence: 90, integration: 92, outputQuality: 88, systemFitness: 93 } },
      ])).toEqual({
        state: 'insufficientSample',
        replayCount: 2,
        minRequired: 3,
        reason: 'Benchmark stability requires at least 3 replays before verdict',
      });
    });

    it('returns stable for identical replays', () => {
      const results = [
        { scores: { structural: 95, ruleCoherence: 90, integration: 92, outputQuality: 88, systemFitness: 93 } },
        { scores: { structural: 95, ruleCoherence: 90, integration: 92, outputQuality: 88, systemFitness: 93 } },
        { scores: { structural: 95, ruleCoherence: 90, integration: 92, outputQuality: 88, systemFitness: 93 } },
      ];

      const result = stability.measureStability(results);
      if ('state' in result) {
        throw new Error('Expected full stability verdict for 3 replays');
      }
      expect(result.stable).toBe(true);
      expect(result.warnings).toHaveLength(0);
      expect(result.dimensions.structural.coefficient).toBe(1.0);
    });

    it('detects instability and emits warnings', () => {
      const results = [
        { scores: { structural: 95, ruleCoherence: 90, integration: 50, outputQuality: 88, systemFitness: 93 } },
        { scores: { structural: 95, ruleCoherence: 90, integration: 90, outputQuality: 88, systemFitness: 93 } },
        { scores: { structural: 95, ruleCoherence: 90, integration: 70, outputQuality: 88, systemFitness: 93 } },
      ];

      const result = stability.measureStability(results);
      if ('state' in result) {
        throw new Error('Expected full stability verdict for 3 replays');
      }
      expect(result.stable).toBe(false);
      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.warnings[0]).toContain('stabilityWarning');
      expect(result.warnings[0]).toContain('integration');
    });

    it('handles dimension array format', () => {
      const results = [
        { dimensions: [{ name: 'structural', score: 95 }, { name: 'ruleCoherence', score: 90 }] },
        { dimensions: [{ name: 'structural', score: 95 }, { name: 'ruleCoherence', score: 90 }] },
        { dimensions: [{ name: 'structural', score: 95 }, { name: 'ruleCoherence', score: 90 }] },
      ];

      const result = stability.measureStability(results);
      if ('state' in result) {
        throw new Error('Expected full stability verdict for 3 replays');
      }
      expect(result.dimensions.structural.coefficient).toBe(1.0);
    });

    it('returns insufficientSample for empty results', () => {
      const result = stability.measureStability([]);
      expect(result).toEqual({
        state: 'insufficientSample',
        replayCount: 0,
        minRequired: 3,
        reason: 'Benchmark stability requires at least 3 replays before verdict',
      });
    });

    it('respects custom minReplayCount override', () => {
      const result = stability.measureStability([
        { scores: { structural: 95, ruleCoherence: 90, integration: 92, outputQuality: 88, systemFitness: 93 } },
        { scores: { structural: 95, ruleCoherence: 90, integration: 92, outputQuality: 88, systemFitness: 93 } },
        { scores: { structural: 95, ruleCoherence: 90, integration: 92, outputQuality: 88, systemFitness: 93 } },
        { scores: { structural: 95, ruleCoherence: 90, integration: 92, outputQuality: 88, systemFitness: 93 } },
      ], { minReplayCount: 5 });

      expect(result).toEqual({
        state: 'insufficientSample',
        replayCount: 4,
        minRequired: 5,
        reason: 'Benchmark stability requires at least 5 replays before verdict',
      });
    });
  });

  describe('isStable', () => {
    it('accepts results with low variance', () => {
      const result = stability.measureStability([
        { scores: { structural: 95, ruleCoherence: 90, integration: 92, outputQuality: 88, systemFitness: 93 } },
        { scores: { structural: 95, ruleCoherence: 90, integration: 92, outputQuality: 88, systemFitness: 93 } },
        { scores: { structural: 95, ruleCoherence: 90, integration: 92, outputQuality: 88, systemFitness: 93 } },
      ]);
      expect(stability.isStable(result)).toBe(true);
    });

    it('rejects results with high variance', () => {
      const result = stability.measureStability([
        { scores: { structural: 50, ruleCoherence: 90, integration: 92, outputQuality: 88, systemFitness: 93 } },
        { scores: { structural: 95, ruleCoherence: 90, integration: 92, outputQuality: 88, systemFitness: 93 } },
        { scores: { structural: 70, ruleCoherence: 90, integration: 92, outputQuality: 88, systemFitness: 93 } },
      ]);
      expect(stability.isStable(result, 0.01)).toBe(false);
    });

    it('treats insufficientSample as not stable', () => {
      const result = stability.measureStability([
        { scores: { structural: 95, ruleCoherence: 90, integration: 92, outputQuality: 88, systemFitness: 93 } },
      ]);
      expect(stability.isStable(result)).toBe(false);
    });
  });

  describe('generateWeightRecommendations', () => {
    it('returns insufficient when session count is below threshold', () => {
      const result = stability.generateWeightRecommendations(
        [{ scores: { structural: 90 } }],
        { structural: 0.20, ruleCoherence: 0.25, integration: 0.25, outputQuality: 0.15, systemFitness: 0.15 },
      );
      expect(result.sufficient).toBe(false);
      expect(result.recommendations).toBeNull();
      expect(result.report).toContain('Insufficient');
    });

    it('generates recommendations when sufficient sessions exist', () => {
      const sessions = Array.from({ length: 6 }, (_, i) => ({
        scores: {
          structural: 95 - i,
          ruleCoherence: 70 + i,
          integration: 92,
          outputQuality: 88,
          systemFitness: 93,
        },
      }));

      const currentWeights = {
        structural: 0.20,
        ruleCoherence: 0.25,
        integration: 0.25,
        outputQuality: 0.15,
        systemFitness: 0.15,
      };

      const result = stability.generateWeightRecommendations(sessions, currentWeights);
      expect(result.sufficient).toBe(true);
      expect(result.recommendations).toBeDefined();
      expect(result.report).toContain('Weight Optimization Report');
      expect(result.report).toContain('advisory only');

      // All weights should sum to approximately 1.0
      const totalWeight = Object.values(result.recommendations!).reduce((s, w) => s + w, 0);
      expect(totalWeight).toBeGreaterThan(0.98);
      expect(totalWeight).toBeLessThan(1.02);
    });

    it('respects custom session count threshold', () => {
      const sessions = Array.from({ length: 3 }, () => ({
        scores: { structural: 90, ruleCoherence: 85, integration: 92, outputQuality: 88, systemFitness: 93 },
      }));

      const result = stability.generateWeightRecommendations(
        sessions,
        { structural: 0.20, ruleCoherence: 0.25, integration: 0.25, outputQuality: 0.15, systemFitness: 0.15 },
        { sessionCountThreshold: 3 },
      );
      expect(result.sufficient).toBe(true);
    });
  });
});
