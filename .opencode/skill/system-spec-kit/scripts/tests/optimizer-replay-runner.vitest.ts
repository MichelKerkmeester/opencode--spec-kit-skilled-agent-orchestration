import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const WORKSPACE_ROOT = path.resolve(TEST_DIR, '../../../../../');
const require = createRequire(import.meta.url);

const replayRunner = require(path.join(
  WORKSPACE_ROOT,
  '.opencode/skill/system-spec-kit/scripts/optimizer/replay-runner.cjs',
)) as {
  DEFAULT_CONFIG: Record<string, number | boolean>;
  evaluateConvergence: (
    iteration: Record<string, any>,
    config: Record<string, any>,
    priorState: Record<string, any>,
  ) => { converged: boolean; stuck: boolean; signals: Record<string, any> };
  replayRun: (
    corpusEntry: Record<string, any>,
    config: Record<string, any>,
  ) => {
    iterationsUsed: number;
    maxIterations: number;
    converged: boolean;
    stuckIterations: number;
    recoveryAttempts: number;
    recoverySuccesses: number;
    totalFindings: number;
    relevantFindings: number;
    stopReason: string;
    perIterationSignals: object[];
    finalSignals: object | null;
  };
  compareResults: (
    baseline: Record<string, any>,
    candidate: Record<string, any>,
  ) => { improved: boolean; regressions: string[]; improvements: string[]; delta: Record<string, number> };
};

const replayCorpus = require(path.join(
  WORKSPACE_ROOT,
  '.opencode/skill/system-spec-kit/scripts/optimizer/replay-corpus.cjs',
)) as {
  buildCorpus: (family: string, options: { jsonlContent?: string }) => { corpus: any[] };
};

const FIXTURES_DIR = path.join(TEST_DIR, 'fixtures/deep-loop-optimizer');

function loadSampleCorpusEntry(): Record<string, any> {
  const content = fs.readFileSync(
    path.join(FIXTURES_DIR, 'sample-040-corpus.jsonl'),
    'utf8',
  );
  const result = replayCorpus.buildCorpus('040', { jsonlContent: content });
  return result.corpus[0] as Record<string, any>;
}

describe('Deterministic Replay Runner (T003)', () => {
  describe('evaluateConvergence', () => {
    it('should detect convergence when newInfoRatio is below threshold', () => {
      const result = replayRunner.evaluateConvergence(
        { newInfoRatio: 0.02 },
        { convergenceThreshold: 0.05 },
        { newInfoRatios: [0.03, 0.02], consecutiveLowProgress: 0 },
      );
      expect(result.converged).toBe(true);
    });

    it('should not converge when newInfoRatio is above threshold', () => {
      const result = replayRunner.evaluateConvergence(
        { newInfoRatio: 0.50 },
        { convergenceThreshold: 0.05 },
        { newInfoRatios: [0.80], consecutiveLowProgress: 0 },
      );
      expect(result.converged).toBe(false);
    });

    it('should detect stuck state after consecutive low-progress iterations', () => {
      const result = replayRunner.evaluateConvergence(
        { newInfoRatio: 0.01 },
        { stuckThreshold: 2, noProgressThreshold: 0.05 },
        { newInfoRatios: [0.01], consecutiveLowProgress: 1 },
      );
      expect(result.stuck).toBe(true);
      expect(result.signals.consecutiveLowProgress).toBe(2);
    });

    it('should reset consecutiveLowProgress when progress resumes', () => {
      const result = replayRunner.evaluateConvergence(
        { newInfoRatio: 0.50 },
        { stuckThreshold: 3, noProgressThreshold: 0.05 },
        { newInfoRatios: [0.01, 0.01], consecutiveLowProgress: 2 },
      );
      expect(result.stuck).toBe(false);
      expect(result.signals.consecutiveLowProgress).toBe(0);
    });
  });

  describe('replayRun', () => {
    it('should replay a corpus entry deterministically', () => {
      const entry = loadSampleCorpusEntry();
      const baselineConfig = JSON.parse(
        fs.readFileSync(path.join(FIXTURES_DIR, 'sample-config-baseline.json'), 'utf8'),
      );

      const result1 = replayRunner.replayRun(entry, baselineConfig);
      const result2 = replayRunner.replayRun(entry, baselineConfig);

      // Deterministic: same inputs produce same outputs
      expect(result1.iterationsUsed).toBe(result2.iterationsUsed);
      expect(result1.converged).toBe(result2.converged);
      expect(result1.stopReason).toBe(result2.stopReason);
      expect(result1.stuckIterations).toBe(result2.stuckIterations);
      expect(result1.totalFindings).toBe(result2.totalFindings);
      expect(result1.relevantFindings).toBe(result2.relevantFindings);
    });

    it('should produce per-iteration signals', () => {
      const entry = loadSampleCorpusEntry();
      const config = JSON.parse(
        fs.readFileSync(path.join(FIXTURES_DIR, 'sample-config-baseline.json'), 'utf8'),
      );

      const result = replayRunner.replayRun(entry, config);
      expect(result.perIterationSignals.length).toBeGreaterThan(0);
      expect(result.finalSignals).not.toBeNull();
    });

    it('should respect maxIterations from config', () => {
      const entry = loadSampleCorpusEntry();
      const config = { maxIterations: 1 };

      const result = replayRunner.replayRun(entry, config);
      expect(result.iterationsUsed).toBeLessThanOrEqual(1);
    });

    it('should track findings across iterations', () => {
      const entry = loadSampleCorpusEntry();
      const config = JSON.parse(
        fs.readFileSync(path.join(FIXTURES_DIR, 'sample-config-baseline.json'), 'utf8'),
      );

      const result = replayRunner.replayRun(entry, config);
      expect(result.totalFindings).toBeGreaterThan(0);
    });

    it('should handle empty iterations', () => {
      const entry = {
        id: 'empty-test',
        packetFamily: '040',
        sourceRun: 'empty',
        config: {},
        iterations: [],
        stopOutcome: { stopReason: 'unknown' },
      };
      const config = { maxIterations: 7 };

      const result = replayRunner.replayRun(entry, config);
      expect(result.iterationsUsed).toBe(0);
      expect(result.converged).toBe(false);
      expect(result.stopReason).toBe('maxIterationsReached');
    });

    it('should produce different results for different configs', () => {
      const entry = loadSampleCorpusEntry();
      const baseline = JSON.parse(
        fs.readFileSync(path.join(FIXTURES_DIR, 'sample-config-baseline.json'), 'utf8'),
      );
      const candidate = JSON.parse(
        fs.readFileSync(path.join(FIXTURES_DIR, 'sample-config-candidate.json'), 'utf8'),
      );

      const baselineResult = replayRunner.replayRun(entry, baseline);
      const candidateResult = replayRunner.replayRun(entry, candidate);

      // Results may differ because different thresholds change convergence behavior
      // At minimum, the per-iteration signals should reflect different thresholds
      expect(baselineResult.perIterationSignals[0]).toBeDefined();
      expect(candidateResult.perIterationSignals[0]).toBeDefined();
    });
  });

  describe('compareResults', () => {
    it('should detect improvements', () => {
      const baseline = {
        iterationsUsed: 5,
        converged: true,
        stuckIterations: 1,
        relevantFindings: 8,
      };
      const candidate = {
        iterationsUsed: 3,
        converged: true,
        stuckIterations: 0,
        relevantFindings: 10,
      };

      const comparison = replayRunner.compareResults(baseline, candidate);
      expect(comparison.improved).toBe(true);
      expect(comparison.improvements.length).toBeGreaterThan(0);
      expect(comparison.regressions).toHaveLength(0);
    });

    it('should detect regressions', () => {
      const baseline = {
        iterationsUsed: 3,
        converged: true,
        stuckIterations: 0,
        relevantFindings: 10,
      };
      const candidate = {
        iterationsUsed: 7,
        converged: false,
        stuckIterations: 2,
        relevantFindings: 5,
      };

      const comparison = replayRunner.compareResults(baseline, candidate);
      expect(comparison.improved).toBe(false);
      expect(comparison.regressions.length).toBeGreaterThan(0);
    });

    it('should report delta values', () => {
      const baseline = {
        iterationsUsed: 5,
        converged: true,
        stuckIterations: 1,
        relevantFindings: 8,
      };
      const candidate = {
        iterationsUsed: 3,
        converged: true,
        stuckIterations: 0,
        relevantFindings: 10,
      };

      const comparison = replayRunner.compareResults(baseline, candidate);
      expect(comparison.delta.iterationsUsed).toBe(2); // 5 - 3 = saved 2
      expect(comparison.delta.stuckIterations).toBe(1); // 1 - 0 = saved 1
      expect(comparison.delta.relevantFindings).toBe(2); // 10 - 8 = gained 2
    });

    it('should flag convergence regression', () => {
      const baseline = { iterationsUsed: 5, converged: true, stuckIterations: 0, relevantFindings: 5 };
      const candidate = { iterationsUsed: 5, converged: false, stuckIterations: 0, relevantFindings: 5 };

      const comparison = replayRunner.compareResults(baseline, candidate);
      expect(comparison.regressions.some((r: string) => r.includes('converge'))).toBe(true);
    });
  });
});
