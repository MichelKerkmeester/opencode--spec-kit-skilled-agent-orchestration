import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { describe, expect, it, beforeEach, afterEach } from 'vitest';

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const WORKSPACE_ROOT = path.resolve(TEST_DIR, '../../../../../../');
const require = createRequire(import.meta.url);

const coverage = require(path.join(
  WORKSPACE_ROOT,
  '.opencode/skill/sk-agent-improver/scripts/mutation-coverage.cjs',
)) as {
  LOOP_TYPE: string;
  MIN_TRAJECTORY_POINTS: number;
  DEFAULT_STABILITY_DELTA: number;
  createCoverageGraph: () => object;
  recordMutation: (coveragePath: string, mutation: object) => void;
  getExhaustedMutations: (coveragePath: string) => object[];
  markExhausted: (coveragePath: string, dimension: string, mutationType: string) => void;
  getMutationCoverage: (coveragePath: string) => { dimensions: Record<string, { tried: string[]; exhausted: string[]; triedCount: number; exhaustedCount: number }> };
  recordTrajectory: (coveragePath: string, dataPoint: object) => void;
  getTrajectory: (coveragePath: string) => object[];
  checkConvergenceEligibility: (coveragePath: string, options?: object) => { canConverge: boolean; reason: string; dataPoints: number };
};

let tmpDir: string;
let coveragePath: string;

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'coverage-test-'));
  coveragePath = path.join(tmpDir, 'coverage-graph.json');
});

afterEach(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

describe('mutation-coverage', () => {
  describe('constants', () => {
    it('uses improvement loop type for namespace isolation', () => {
      expect(coverage.LOOP_TYPE).toBe('improvement');
    });

    it('requires minimum 3 trajectory data points', () => {
      expect(coverage.MIN_TRAJECTORY_POINTS).toBe(3);
    });

    it('has default stability delta of 2', () => {
      expect(coverage.DEFAULT_STABILITY_DELTA).toBe(2);
    });
  });

  describe('createCoverageGraph', () => {
    it('creates an empty graph with improvement loop type', () => {
      const graph = coverage.createCoverageGraph() as { loopType: string; mutations: unknown[]; exhausted: unknown[]; trajectory: unknown[] };
      expect(graph.loopType).toBe('improvement');
      expect(graph.mutations).toEqual([]);
      expect(graph.exhausted).toEqual([]);
      expect(graph.trajectory).toEqual([]);
    });
  });

  describe('recordMutation', () => {
    it('creates file and records mutation', () => {
      coverage.recordMutation(coveragePath, {
        dimension: 'structural',
        mutationType: 'section-reorder',
        candidateId: 'c-001',
        iteration: 1,
      });

      expect(fs.existsSync(coveragePath)).toBe(true);
      const graph = JSON.parse(fs.readFileSync(coveragePath, 'utf8'));
      expect(graph.mutations).toHaveLength(1);
      expect(graph.mutations[0].dimension).toBe('structural');
      expect(graph.mutations[0].mutationType).toBe('section-reorder');
    });

    it('appends to existing mutations', () => {
      coverage.recordMutation(coveragePath, { dimension: 'structural', mutationType: 'a', candidateId: '1', iteration: 1 });
      coverage.recordMutation(coveragePath, { dimension: 'ruleCoherence', mutationType: 'b', candidateId: '2', iteration: 2 });

      const graph = JSON.parse(fs.readFileSync(coveragePath, 'utf8'));
      expect(graph.mutations).toHaveLength(2);
    });
  });

  describe('markExhausted and getExhaustedMutations', () => {
    it('marks a mutation type as exhausted', () => {
      coverage.markExhausted(coveragePath, 'structural', 'section-reorder');
      const exhausted = coverage.getExhaustedMutations(coveragePath);
      expect(exhausted).toHaveLength(1);
      expect((exhausted[0] as { dimension: string }).dimension).toBe('structural');
      expect((exhausted[0] as { mutationType: string }).mutationType).toBe('section-reorder');
    });

    it('prevents duplicate exhaustion entries', () => {
      coverage.markExhausted(coveragePath, 'structural', 'section-reorder');
      coverage.markExhausted(coveragePath, 'structural', 'section-reorder');
      const exhausted = coverage.getExhaustedMutations(coveragePath);
      expect(exhausted).toHaveLength(1);
    });

    it('returns empty for non-existent file', () => {
      const exhausted = coverage.getExhaustedMutations('/nonexistent/path.json');
      expect(exhausted).toEqual([]);
    });
  });

  describe('getMutationCoverage', () => {
    it('returns coverage stats per dimension', () => {
      coverage.recordMutation(coveragePath, { dimension: 'structural', mutationType: 'a', candidateId: '1', iteration: 1 });
      coverage.recordMutation(coveragePath, { dimension: 'structural', mutationType: 'b', candidateId: '2', iteration: 2 });
      coverage.recordMutation(coveragePath, { dimension: 'integration', mutationType: 'c', candidateId: '3', iteration: 3 });
      coverage.markExhausted(coveragePath, 'structural', 'a');

      const stats = coverage.getMutationCoverage(coveragePath);
      expect(stats.dimensions.structural.triedCount).toBe(2);
      expect(stats.dimensions.structural.exhaustedCount).toBe(1);
      expect(stats.dimensions.integration.triedCount).toBe(1);
    });

    it('returns empty dimensions for non-existent file', () => {
      const stats = coverage.getMutationCoverage('/nonexistent/path.json');
      expect(stats.dimensions).toEqual({});
    });
  });

  describe('trajectory', () => {
    it('records and retrieves trajectory data', () => {
      coverage.recordTrajectory(coveragePath, {
        iteration: 1,
        scores: { structural: 90, ruleCoherence: 85, integration: 88, outputQuality: 92, systemFitness: 95 },
      });

      const trajectory = coverage.getTrajectory(coveragePath);
      expect(trajectory).toHaveLength(1);
      expect((trajectory[0] as { iteration: number }).iteration).toBe(1);
    });

    it('returns empty array for non-existent file', () => {
      expect(coverage.getTrajectory('/nonexistent/path.json')).toEqual([]);
    });
  });

  describe('checkConvergenceEligibility', () => {
    it('rejects convergence with insufficient data points', () => {
      coverage.recordTrajectory(coveragePath, {
        iteration: 1,
        scores: { structural: 90, ruleCoherence: 85, integration: 88, outputQuality: 92, systemFitness: 95 },
      });

      const result = coverage.checkConvergenceEligibility(coveragePath);
      expect(result.canConverge).toBe(false);
      expect(result.reason).toContain('Insufficient');
      expect(result.dataPoints).toBe(1);
    });

    it('allows convergence with stable scores across 3+ points', () => {
      for (let i = 1; i <= 3; i++) {
        coverage.recordTrajectory(coveragePath, {
          iteration: i,
          scores: { structural: 95, ruleCoherence: 90, integration: 92, outputQuality: 88, systemFitness: 93 },
        });
      }

      const result = coverage.checkConvergenceEligibility(coveragePath);
      expect(result.canConverge).toBe(true);
      expect(result.dataPoints).toBe(3);
    });

    it('rejects convergence with unstable dimensions', () => {
      coverage.recordTrajectory(coveragePath, {
        iteration: 1,
        scores: { structural: 80, ruleCoherence: 90, integration: 92, outputQuality: 88, systemFitness: 93 },
      });
      coverage.recordTrajectory(coveragePath, {
        iteration: 2,
        scores: { structural: 85, ruleCoherence: 90, integration: 92, outputQuality: 88, systemFitness: 93 },
      });
      coverage.recordTrajectory(coveragePath, {
        iteration: 3,
        scores: { structural: 90, ruleCoherence: 90, integration: 92, outputQuality: 88, systemFitness: 93 },
      });

      const result = coverage.checkConvergenceEligibility(coveragePath);
      expect(result.canConverge).toBe(false);
      expect(result.reason).toContain('Unstable');
      expect(result.reason).toContain('structural');
    });
  });
});
