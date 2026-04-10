import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const WORKSPACE_ROOT = path.resolve(TEST_DIR, '../../../../../');
const require = createRequire(import.meta.url);

const rubric = require(path.join(
  WORKSPACE_ROOT,
  '.opencode/skill/system-spec-kit/scripts/optimizer/rubric.cjs',
)) as {
  DEFAULT_WEIGHTS: Record<string, number>;
  SCORE_RANGE: { min: number; max: number };
  DIMENSION_SCORERS: Record<string, (results: any) => number>;
  defineRubric: (dimensions?: Record<string, number>) => { dimensions: Record<string, number>; totalWeight: number };
  scoreRun: (
    rubric: { dimensions: Record<string, number>; totalWeight: number },
    replayResults: Record<string, any>,
  ) => {
    perDimension: Record<string, { score: number | null; weight: number; weighted: number; available: boolean }>;
    composite: number;
    unavailableDimensions: string[];
  };
  scoreConvergenceEfficiency: (results: any) => number;
  scoreRecoverySuccessRate: (results: any) => number;
  scoreFindingAccuracy: (results: any) => number;
  scoreSynthesisQuality: (results: any) => number;
  clampScore: (score: number) => number;
};

describe('Quality Rubric (T002)', () => {
  describe('defineRubric', () => {
    it('should create a rubric with default weights', () => {
      const r = rubric.defineRubric();
      expect(r.dimensions).toEqual(rubric.DEFAULT_WEIGHTS);
      expect(r.totalWeight).toBeCloseTo(1.0, 5);
    });

    it('should allow weight overrides', () => {
      const r = rubric.defineRubric({
        convergenceEfficiency: 0.50,
        recoverySuccessRate: 0.10,
        findingAccuracy: 0.30,
        synthesisQuality: 0.10,
      });
      expect(r.dimensions.convergenceEfficiency).toBe(0.50);
      expect(r.totalWeight).toBeCloseTo(1.0, 5);
    });

    it('should report negative weights as validation errors', () => {
      const result = rubric.defineRubric({ convergenceEfficiency: -0.1 }) as {
        errors?: string[];
      };
      expect(result.errors?.some((error) => error.includes('convergenceEfficiency'))).toBe(true);
    });

    it('should report weights above 1 as validation errors', () => {
      const result = rubric.defineRubric({ convergenceEfficiency: 1.5 }) as {
        errors?: string[];
      };
      expect(result.errors?.some((error) => error.includes('convergenceEfficiency'))).toBe(true);
    });

    it('should report non-finite weights as validation errors', () => {
      const result = rubric.defineRubric({ convergenceEfficiency: NaN }) as {
        errors?: string[];
      };
      expect(result.errors?.some((error) => error.includes('convergenceEfficiency'))).toBe(true);
    });
  });

  describe('dimension scorers', () => {
    describe('convergenceEfficiency', () => {
      it('should score high for early convergence', () => {
        const score = rubric.scoreConvergenceEfficiency({
          iterationsUsed: 3,
          maxIterations: 10,
          converged: true,
        });
        expect(score).toBe(0.7);
      });

      it('should score 0 when not converged', () => {
        const score = rubric.scoreConvergenceEfficiency({
          iterationsUsed: 10,
          maxIterations: 10,
          converged: false,
        });
        expect(score).toBe(0);
      });

      it('should score 0 for max iterations used', () => {
        const score = rubric.scoreConvergenceEfficiency({
          iterationsUsed: 10,
          maxIterations: 10,
          converged: true,
        });
        expect(score).toBe(0);
      });
    });

    describe('recoverySuccessRate', () => {
      it('should score 1.0 when no recovery was needed', () => {
        const score = rubric.scoreRecoverySuccessRate({
          recoveryAttempts: 0,
          recoverySuccesses: 0,
        });
        expect(score).toBe(1.0);
      });

      it('should score based on success ratio', () => {
        const score = rubric.scoreRecoverySuccessRate({
          recoveryAttempts: 4,
          recoverySuccesses: 3,
        });
        expect(score).toBe(0.75);
      });

      it('should score 0 for all failed recoveries', () => {
        const score = rubric.scoreRecoverySuccessRate({
          recoveryAttempts: 3,
          recoverySuccesses: 0,
        });
        expect(score).toBe(0);
      });
    });

    describe('findingAccuracy', () => {
      it('should score based on relevant/total ratio', () => {
        const score = rubric.scoreFindingAccuracy({
          totalFindings: 10,
          relevantFindings: 8,
        });
        expect(score).toBe(0.8);
      });

      it('should score 0 for no findings', () => {
        const score = rubric.scoreFindingAccuracy({
          totalFindings: 0,
          relevantFindings: 0,
        });
        expect(score).toBe(0);
      });
    });

    describe('synthesisQuality', () => {
      it('should score high when relevant findings are preserved and the run converged', () => {
        const score = rubric.scoreSynthesisQuality({
          totalFindings: 10,
          relevantFindings: 8,
          converged: true,
          iterationsUsed: 5,
        });
        expect(score).toBe(0.88);
      });

      it('should score only the findings component when not converged', () => {
        const score = rubric.scoreSynthesisQuality({
          totalFindings: 10,
          relevantFindings: 8,
          converged: false,
          iterationsUsed: 5,
        });
        expect(score).toBe(0.48);
      });

      it('should score 0 when no iterations were recorded', () => {
        const score = rubric.scoreSynthesisQuality({
          totalFindings: 10,
          relevantFindings: 8,
          converged: true,
          iterationsUsed: 0,
        });
        expect(score).toBe(0);
      });
    });
  });

  describe('scoreRun', () => {
    it('should produce per-dimension breakdown (REQ-003)', () => {
      const r = rubric.defineRubric();
      const result = rubric.scoreRun(r, {
        iterationsUsed: 3,
        maxIterations: 10,
        converged: true,
        recoveryAttempts: 0,
        recoverySuccesses: 0,
        totalFindings: 10,
        relevantFindings: 8,
      });

      expect(result.perDimension).toBeDefined();
      expect(Object.keys(result.perDimension)).toContain('convergenceEfficiency');
      expect(Object.keys(result.perDimension)).toContain('recoverySuccessRate');
      expect(Object.keys(result.perDimension)).toContain('findingAccuracy');
      expect(Object.keys(result.perDimension)).toContain('synthesisQuality');

      // Each dimension should have score, weight, weighted, available
      for (const dim of Object.values(result.perDimension)) {
        expect(dim).toHaveProperty('score');
        expect(dim).toHaveProperty('weight');
        expect(dim).toHaveProperty('weighted');
        expect(dim).toHaveProperty('available');
        expect(dim.available).toBe(true);
      }

      expect(result.composite).toBeGreaterThan(0);
      expect(result.composite).toBeLessThanOrEqual(1.0);
    });

    it('should mark unknown dimensions as unavailable (REQ-009)', () => {
      const r = rubric.defineRubric({ unknownDimension: 0.5 });
      const result = rubric.scoreRun(r, {
        iterationsUsed: 3,
        maxIterations: 10,
        converged: true,
        recoveryAttempts: 0,
        recoverySuccesses: 0,
        totalFindings: 10,
        relevantFindings: 8,
      });

      expect(result.unavailableDimensions).toContain('unknownDimension');
      expect(result.perDimension.unknownDimension.available).toBe(false);
      expect(result.perDimension.unknownDimension.score).toBeNull();
    });

    it('should produce composite that reflects weighted average', () => {
      // Use only one dimension to isolate the composite calculation
      const r = rubric.defineRubric({
        convergenceEfficiency: 1.0,
        recoverySuccessRate: 0,
        findingAccuracy: 0,
        synthesisQuality: 0,
      });
      const result = rubric.scoreRun(r, {
        iterationsUsed: 5,
        maxIterations: 10,
        converged: true,
        recoveryAttempts: 0,
        recoverySuccesses: 0,
        totalFindings: 0,
        relevantFindings: 0,
      });

      // convergenceEfficiency = 1 - (5/10) = 0.5, only active dimension with weight 1.0
      expect(result.composite).toBeCloseTo(0.5, 5);
    });
  });

  describe('clampScore', () => {
    it('should clamp values to [0, 1]', () => {
      expect(rubric.clampScore(-0.5)).toBe(0);
      expect(rubric.clampScore(1.5)).toBe(1.0);
      expect(rubric.clampScore(0.5)).toBe(0.5);
    });

    it('should return 0 for NaN', () => {
      expect(rubric.clampScore(NaN)).toBe(0);
    });

    it('should return 0 for Infinity', () => {
      expect(rubric.clampScore(Infinity)).toBe(0);
    });
  });
});
