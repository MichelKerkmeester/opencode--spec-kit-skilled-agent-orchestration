import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { describe, expect, it, beforeEach, afterEach } from 'vitest';

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const WORKSPACE_ROOT = path.resolve(TEST_DIR, '../../../../../');
const require = createRequire(import.meta.url);

const detector = require(path.join(
  WORKSPACE_ROOT,
  '.opencode/skill/sk-improve-agent/scripts/trade-off-detector.cjs',
)) as {
  HARD_DIMENSIONS: readonly string[];
  SOFT_DIMENSIONS: readonly string[];
  DEFAULT_IMPROVEMENT_THRESHOLD: number;
  MIN_DATA_POINTS_DEFAULT: number;
  DEFAULT_REGRESSION_THRESHOLDS: Readonly<{ hard: number; soft: number }>;
  detectTradeOffs:
    (trajectoryData: object[], options?: object) =>
      | Array<{ improving: string; regressing: string; improvementDelta: number; regressionDelta: number; iteration: number }>
      | { state: string; dataPoints: number; minRequired: number; reason: string };
  getTrajectory: (journalPath: string) => object[];
  checkParetoDominance: (candidateScores: Record<string, number>, baselineScores: Record<string, number>) => { dominated: boolean; dominatingDimensions: string[]; regressions: string[] };
};

let tmpDir: string;

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tradeoff-test-'));
});

afterEach(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

describe('trade-off-detector', () => {
  describe('constants', () => {
    it('defines hard dimensions', () => {
      expect(detector.HARD_DIMENSIONS).toContain('structural');
      expect(detector.HARD_DIMENSIONS).toContain('integration');
      expect(detector.HARD_DIMENSIONS).toContain('systemFitness');
    });

    it('defines soft dimensions', () => {
      expect(detector.SOFT_DIMENSIONS).toContain('ruleCoherence');
      expect(detector.SOFT_DIMENSIONS).toContain('outputQuality');
    });

    it('has default improvement threshold of 3', () => {
      expect(detector.DEFAULT_IMPROVEMENT_THRESHOLD).toBe(3);
    });

    it('has default minimum data points of 3', () => {
      expect(detector.MIN_DATA_POINTS_DEFAULT).toBe(3);
    });

    it('has default regression thresholds', () => {
      expect(detector.DEFAULT_REGRESSION_THRESHOLDS.hard).toBe(-3);
      expect(detector.DEFAULT_REGRESSION_THRESHOLDS.soft).toBe(-5);
    });
  });

  describe('detectTradeOffs', () => {
    it('returns insufficientData for 2-point trajectories', () => {
      expect(detector.detectTradeOffs([
        { iteration: 1, scores: { structural: 90, ruleCoherence: 80, integration: 90, outputQuality: 85, systemFitness: 90 } },
        { iteration: 2, scores: { structural: 85, ruleCoherence: 90, integration: 90, outputQuality: 85, systemFitness: 90 } },
      ])).toEqual({
        state: 'insufficientData',
        dataPoints: 2,
        minRequired: 3,
        reason: 'Trade-off detection requires at least 3 data points before analysis',
      });
    });

    it('detects trade-off when 3-point trajectory has a hard regression and another improvement', () => {
      const trajectory = [
        { iteration: 1, scores: { structural: 92, ruleCoherence: 80, integration: 90, outputQuality: 85, systemFitness: 90 } },
        { iteration: 2, scores: { structural: 91, ruleCoherence: 82, integration: 90, outputQuality: 85, systemFitness: 90 } },
        { iteration: 3, scores: { structural: 85, ruleCoherence: 90, integration: 90, outputQuality: 85, systemFitness: 90 } },
      ];

      const tradeOffs = detector.detectTradeOffs(trajectory);
      expect(Array.isArray(tradeOffs)).toBe(true);
      if (!Array.isArray(tradeOffs)) {
        throw new Error('Expected trade-off array for 3-point trajectory');
      }
      expect(tradeOffs.length).toBeGreaterThan(0);

      const found = tradeOffs.find(
        (t) => t.improving === 'ruleCoherence' && t.regressing === 'structural'
      );
      expect(found).toBeDefined();
      expect(found!.improvementDelta).toBe(8);
      expect(found!.regressionDelta).toBe(-6);
    });

    it('does not flag when both dimensions improve', () => {
      const trajectory = [
        { iteration: 1, scores: { structural: 85, ruleCoherence: 80, integration: 88, outputQuality: 85, systemFitness: 88 } },
        { iteration: 2, scores: { structural: 88, ruleCoherence: 84, integration: 90, outputQuality: 87, systemFitness: 90 } },
        { iteration: 3, scores: { structural: 92, ruleCoherence: 88, integration: 92, outputQuality: 90, systemFitness: 93 } },
      ];

      const tradeOffs = detector.detectTradeOffs(trajectory);
      expect(tradeOffs).toEqual([]);
    });

    it('does not flag when regressions are below threshold', () => {
      const trajectory = [
        { iteration: 1, scores: { structural: 90, ruleCoherence: 85, integration: 90, outputQuality: 85, systemFitness: 90 } },
        { iteration: 2, scores: { structural: 90, ruleCoherence: 86, integration: 90, outputQuality: 85, systemFitness: 90 } },
        { iteration: 3, scores: { structural: 89, ruleCoherence: 90, integration: 90, outputQuality: 85, systemFitness: 90 } },
      ];

      const tradeOffs = detector.detectTradeOffs(trajectory);
      expect(tradeOffs).toEqual([]);
    });

    it('respects custom thresholds', () => {
      const trajectory = [
        { iteration: 1, scores: { structural: 90, ruleCoherence: 80, integration: 90, outputQuality: 85, systemFitness: 90 } },
        { iteration: 2, scores: { structural: 89, ruleCoherence: 82, integration: 90, outputQuality: 85, systemFitness: 90 } },
        { iteration: 3, scores: { structural: 85, ruleCoherence: 90, integration: 90, outputQuality: 85, systemFitness: 90 } },
      ];

      // With very strict thresholds, even -5 should not trigger
      const tradeOffs = detector.detectTradeOffs(trajectory, {
        regressionThresholds: { hard: -10, soft: -10 },
      });
      expect(tradeOffs).toEqual([]);
    });

    it('respects custom minDataPoints override', () => {
      const trajectory = [
        { iteration: 1, scores: { structural: 90, ruleCoherence: 80, integration: 90, outputQuality: 85, systemFitness: 90 } },
        { iteration: 2, scores: { structural: 89, ruleCoherence: 82, integration: 90, outputQuality: 85, systemFitness: 90 } },
        { iteration: 3, scores: { structural: 88, ruleCoherence: 84, integration: 90, outputQuality: 85, systemFitness: 90 } },
        { iteration: 4, scores: { structural: 83, ruleCoherence: 90, integration: 90, outputQuality: 85, systemFitness: 90 } },
      ];

      expect(detector.detectTradeOffs(trajectory, { minDataPoints: 5 })).toEqual({
        state: 'insufficientData',
        dataPoints: 4,
        minRequired: 5,
        reason: 'Trade-off detection requires at least 5 data points before analysis',
      });
    });

    it('handles empty trajectory gracefully', () => {
      const tradeOffs = detector.detectTradeOffs(null as unknown as object[]);
      expect(tradeOffs).toEqual({
        state: 'insufficientData',
        dataPoints: 0,
        minRequired: 3,
        reason: 'Trade-off detection requires at least 3 data points before analysis',
      });
    });
  });

  describe('getTrajectory', () => {
    it('returns empty for non-existent file', () => {
      expect(detector.getTrajectory('/nonexistent/path.jsonl')).toEqual([]);
    });

    it('extracts scores from candidate_scored journal events', () => {
      const journalPath = path.join(tmpDir, 'journal.jsonl');
      const events = [
        {
          eventType: 'candidate_scored',
          iteration: 1,
          details: {
            dimensions: [
              { name: 'structural', score: 90 },
              { name: 'ruleCoherence', score: 85 },
            ],
          },
        },
        {
          eventType: 'session_start',
          iteration: 0,
        },
      ];

      fs.writeFileSync(
        journalPath,
        events.map((e) => JSON.stringify(e)).join('\n') + '\n',
        'utf8'
      );

      const trajectory = detector.getTrajectory(journalPath) as Array<{ iteration: number; scores: Record<string, number> }>;
      expect(trajectory).toHaveLength(1);
      expect(trajectory[0].scores.structural).toBe(90);
    });
  });

  describe('checkParetoDominance', () => {
    it('detects Pareto-dominated candidate', () => {
      const candidate = { structural: 85, ruleCoherence: 80, integration: 88, outputQuality: 82, systemFitness: 90 };
      const baseline = { structural: 90, ruleCoherence: 85, integration: 92, outputQuality: 88, systemFitness: 95 };

      const result = detector.checkParetoDominance(candidate, baseline);
      expect(result.dominated).toBe(true);
      expect(result.regressions.length).toBeGreaterThan(0);
    });

    it('does not flag when candidate improves at least one dimension', () => {
      const candidate = { structural: 95, ruleCoherence: 80, integration: 88, outputQuality: 82, systemFitness: 90 };
      const baseline = { structural: 90, ruleCoherence: 85, integration: 92, outputQuality: 88, systemFitness: 95 };

      const result = detector.checkParetoDominance(candidate, baseline);
      expect(result.dominated).toBe(false);
    });

    it('detects equal candidates as non-dominated', () => {
      const scores = { structural: 90, ruleCoherence: 85, integration: 92, outputQuality: 88, systemFitness: 95 };

      const result = detector.checkParetoDominance(scores, scores);
      expect(result.dominated).toBe(false);
    });
  });
});
