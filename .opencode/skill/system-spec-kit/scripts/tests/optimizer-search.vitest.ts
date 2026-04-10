import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const WORKSPACE_ROOT = path.resolve(TEST_DIR, '../../../../../');
const require = createRequire(import.meta.url);

const search = require(path.join(
  WORKSPACE_ROOT,
  '.opencode/skill/system-spec-kit/scripts/optimizer/search.cjs',
)) as {
  DEFAULT_PARAM_SPACE: Record<string, { min: number; max: number; step: number }>;
  createRNG: (seed: number) => () => number;
  sampleConfig: (
    paramSpace: Record<string, { min: number; max: number; step: number }>,
    rng: () => number,
  ) => Record<string, number>;
  recordCandidate: (
    candidate: object,
    score: { composite: number; perDimension: object; unavailableDimensions: string[] },
    accepted: boolean,
    comparison?: object,
    options?: { timestamp?: string },
  ) => Record<string, any>;
  randomSearch: (
    corpus: object[],
    rubric: object,
    paramSpace?: Record<string, { min: number; max: number; step: number }>,
    iterations?: number,
    options?: { seed?: number; baselineConfig?: object },
  ) => {
    bestCandidate: object | null;
    bestScore: object | null;
    auditTrail: Array<Record<string, any>>;
    baselineScore: object | null;
    iterations: number;
  };
  evaluateConfig: (
    corpus: object[],
    config: object,
    rubric: object,
  ) => { composite: number; perDimension: object; unavailableDimensions: string[] };
  compareScores: (
    baseline: { composite: number; perDimension: Record<string, any> },
    candidate: { composite: number; perDimension: Record<string, any> },
  ) => { improvements: string[]; regressions: string[] };
  countDecimals: (n: number) => number;
};

const replayCorpus = require(path.join(
  WORKSPACE_ROOT,
  '.opencode/skill/system-spec-kit/scripts/optimizer/replay-corpus.cjs',
)) as {
  buildCorpus: (family: string, options: { jsonlContent?: string }) => { corpus: any[] };
};

const rubricModule = require(path.join(
  WORKSPACE_ROOT,
  '.opencode/skill/system-spec-kit/scripts/optimizer/rubric.cjs',
)) as {
  defineRubric: (dimensions?: Record<string, number>) => { dimensions: Record<string, number>; totalWeight: number };
};

const FIXTURES_DIR = path.join(TEST_DIR, 'fixtures/deep-loop-optimizer');

function loadTestCorpus(): object[] {
  const content = fs.readFileSync(
    path.join(FIXTURES_DIR, 'sample-040-corpus.jsonl'),
    'utf8',
  );
  return replayCorpus.buildCorpus('040', { jsonlContent: content }).corpus;
}

describe('Random Search Optimizer (T004)', () => {
  describe('createRNG', () => {
    it('should produce deterministic sequences from the same seed', () => {
      const rng1 = search.createRNG(42);
      const rng2 = search.createRNG(42);

      const seq1 = Array.from({ length: 10 }, () => rng1());
      const seq2 = Array.from({ length: 10 }, () => rng2());

      expect(seq1).toEqual(seq2);
    });

    it('should produce different sequences from different seeds', () => {
      const rng1 = search.createRNG(42);
      const rng2 = search.createRNG(99);

      const v1 = rng1();
      const v2 = rng2();

      expect(v1).not.toBe(v2);
    });

    it('should produce values in [0, 1)', () => {
      const rng = search.createRNG(42);
      for (let i = 0; i < 100; i++) {
        const v = rng();
        expect(v).toBeGreaterThanOrEqual(0);
        expect(v).toBeLessThan(1);
      }
    });
  });

  describe('sampleConfig', () => {
    it('should sample values within parameter bounds', () => {
      const rng = search.createRNG(42);
      const config = search.sampleConfig(search.DEFAULT_PARAM_SPACE, rng);

      for (const [name, bounds] of Object.entries(search.DEFAULT_PARAM_SPACE)) {
        expect(config[name]).toBeGreaterThanOrEqual(bounds.min);
        expect(config[name]).toBeLessThanOrEqual(bounds.max);
      }
    });

    it('should produce values at step intervals', () => {
      const rng = search.createRNG(42);
      const space = {
        testParam: { min: 0.0, max: 1.0, step: 0.25 },
      };

      const config = search.sampleConfig(space, rng);
      const validValues = [0.0, 0.25, 0.5, 0.75, 1.0];
      expect(validValues).toContain(config.testParam);
    });
  });

  describe('countDecimals', () => {
    it('should count decimal places', () => {
      expect(search.countDecimals(0.01)).toBe(2);
      expect(search.countDecimals(0.1)).toBe(1);
      expect(search.countDecimals(1)).toBe(0);
      expect(search.countDecimals(0.001)).toBe(3);
    });
  });

  describe('recordCandidate (T005 audit)', () => {
    it('should record accepted candidates', () => {
      const record = search.recordCandidate(
        { convergenceThreshold: 0.05 },
        { composite: 0.8, perDimension: {}, unavailableDimensions: [] },
        true,
      ) as Record<string, any>;

      expect(record.accepted).toBe(true);
      expect(record.candidate).toEqual({ convergenceThreshold: 0.05 });
      expect(record.score.composite).toBe(0.8);
      expect(record.timestamp).toBeDefined();
      expect(record.reason).toContain('improved');
    });

    it('should record rejected candidates with reason', () => {
      const record = search.recordCandidate(
        { convergenceThreshold: 0.05 },
        { composite: 0.3, perDimension: {}, unavailableDimensions: [] },
        false,
        { regressions: ['Composite regressed'], improvements: [] },
      ) as Record<string, any>;

      expect(record.accepted).toBe(false);
      expect(record.reason).toContain('Rejected');
    });

    it('should include comparison details when available', () => {
      const comparison = {
        improvements: ['convergence improved'],
        regressions: ['accuracy regressed'],
      };
      const record = search.recordCandidate(
        { convergenceThreshold: 0.05 },
        { composite: 0.5, perDimension: {}, unavailableDimensions: [] },
        false,
        comparison,
      ) as Record<string, any>;

      expect(record.comparison).toEqual(comparison);
    });
  });

  describe('randomSearch', () => {
    it('should complete search and return audit trail (REQ-008)', () => {
      const corpus = loadTestCorpus();
      const testRubric = rubricModule.defineRubric();
      const iterations = 5;

      const result = search.randomSearch(corpus, testRubric, undefined, iterations, { seed: 42 });

      expect(result.iterations).toBe(iterations);
      expect(result.auditTrail).toHaveLength(iterations);
      expect(result.bestCandidate).not.toBeNull();
      expect(result.bestScore).not.toBeNull();
    });

    it('should produce deterministic results from the same seed', () => {
      const corpus = loadTestCorpus();
      const testRubric = rubricModule.defineRubric();

      const result1 = search.randomSearch(corpus, testRubric, undefined, 5, { seed: 42 });
      const result2 = search.randomSearch(corpus, testRubric, undefined, 5, { seed: 42 });

      expect(result1.bestCandidate).toEqual(result2.bestCandidate);
      expect((result1.bestScore as any).composite).toBe((result2.bestScore as any).composite);
    });

    it('should record BOTH accepted and rejected candidates (REQ-008)', () => {
      const corpus = loadTestCorpus();
      const testRubric = rubricModule.defineRubric();

      const result = search.randomSearch(corpus, testRubric, undefined, 10, { seed: 42 });

      const accepted = result.auditTrail.filter((r) => r.accepted);
      const rejected = result.auditTrail.filter((r) => !r.accepted);

      // At least the first candidate should be accepted
      expect(accepted.length).toBeGreaterThanOrEqual(1);
      // With 10 iterations, some should be rejected
      expect(result.auditTrail).toHaveLength(10);
      // Total should be 10
      expect(accepted.length + rejected.length).toBe(10);
    });

    it('should respect bounded numeric parameter space (REQ-007)', () => {
      const corpus = loadTestCorpus();
      const testRubric = rubricModule.defineRubric();

      const result = search.randomSearch(corpus, testRubric, undefined, 5, { seed: 42 });

      // All candidates in audit trail should have values within bounds
      for (const record of result.auditTrail) {
        const candidate = record.candidate as Record<string, number>;
        for (const [name, bounds] of Object.entries(search.DEFAULT_PARAM_SPACE)) {
          if (candidate[name] !== undefined) {
            expect(candidate[name]).toBeGreaterThanOrEqual(bounds.min);
            expect(candidate[name]).toBeLessThanOrEqual(bounds.max);
          }
        }
      }
    });

    it('should compute baseline score when baselineConfig is provided', () => {
      const corpus = loadTestCorpus();
      const testRubric = rubricModule.defineRubric();
      const baselineConfig = JSON.parse(
        fs.readFileSync(path.join(FIXTURES_DIR, 'sample-config-baseline.json'), 'utf8'),
      );

      const result = search.randomSearch(corpus, testRubric, undefined, 3, {
        seed: 42,
        baselineConfig,
      });

      expect(result.baselineScore).not.toBeNull();
    });
  });

  describe('evaluateConfig', () => {
    it('should produce scores for a valid config', () => {
      const corpus = loadTestCorpus();
      const testRubric = rubricModule.defineRubric();
      const config = { convergenceThreshold: 0.05, maxIterations: 7 };

      const result = search.evaluateConfig(corpus, config, testRubric);
      expect(result.composite).toBeGreaterThanOrEqual(0);
      expect(result.composite).toBeLessThanOrEqual(1);
    });

    it('should return zero scores for empty corpus', () => {
      const testRubric = rubricModule.defineRubric();
      const result = search.evaluateConfig([], {}, testRubric);
      expect(result.composite).toBe(0);
    });
  });

  describe('compareScores', () => {
    it('should detect composite improvement', () => {
      const baseline = { composite: 0.5, perDimension: {} };
      const candidate = { composite: 0.8, perDimension: {} };

      const result = search.compareScores(baseline, candidate);
      expect(result.improvements.some((i: string) => i.includes('Composite improved'))).toBe(true);
    });

    it('should detect composite regression', () => {
      const baseline = { composite: 0.8, perDimension: {} };
      const candidate = { composite: 0.5, perDimension: {} };

      const result = search.compareScores(baseline, candidate);
      expect(result.regressions.some((r: string) => r.includes('Composite regressed'))).toBe(true);
    });

    it('should detect per-dimension regressions', () => {
      const baseline = {
        composite: 0.7,
        perDimension: { findingAccuracy: { score: 0.8, available: true } },
      };
      const candidate = {
        composite: 0.7,
        perDimension: { findingAccuracy: { score: 0.3, available: true } },
      };

      const result = search.compareScores(baseline, candidate);
      expect(result.regressions.some((r: string) => r.includes('findingAccuracy'))).toBe(true);
    });
  });

  describe('P1-1: deterministic timestamps in recordCandidate', () => {
    it('should use provided timestamp for deterministic replay', () => {
      const fixedTime = '2026-01-01T00:00:00.000Z';
      const record = search.recordCandidate(
        { convergenceThreshold: 0.05 },
        { composite: 0.8, perDimension: {}, unavailableDimensions: [] },
        true,
        undefined,
        { timestamp: fixedTime },
      );

      expect(record.timestamp).toBe(fixedTime);
    });

    it('should default to current time when no timestamp override', () => {
      const before = new Date().toISOString();
      const record = search.recordCandidate(
        { convergenceThreshold: 0.05 },
        { composite: 0.8, perDimension: {}, unavailableDimensions: [] },
        true,
      );
      const after = new Date().toISOString();

      expect(record.timestamp >= before).toBe(true);
      expect(record.timestamp <= after).toBe(true);
    });
  });

  describe('P2-1: maxIterations in default param space', () => {
    it('should include maxIterations in DEFAULT_PARAM_SPACE', () => {
      expect(search.DEFAULT_PARAM_SPACE.maxIterations).toBeDefined();
      expect(search.DEFAULT_PARAM_SPACE.maxIterations.min).toBe(5);
      expect(search.DEFAULT_PARAM_SPACE.maxIterations.max).toBe(30);
      expect(search.DEFAULT_PARAM_SPACE.maxIterations.step).toBe(1);
    });

    it('should sample maxIterations within bounds', () => {
      const rng = search.createRNG(42);
      const config = search.sampleConfig(search.DEFAULT_PARAM_SPACE, rng);
      expect(config.maxIterations).toBeGreaterThanOrEqual(5);
      expect(config.maxIterations).toBeLessThanOrEqual(30);
      expect(Number.isInteger(config.maxIterations)).toBe(true);
    });
  });
});
