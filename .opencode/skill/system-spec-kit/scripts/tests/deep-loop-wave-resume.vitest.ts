import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const WORKSPACE_ROOT = path.resolve(TEST_DIR, '../../../../../');
const require = createRequire(import.meta.url);

const lifecycle = require(path.join(
  WORKSPACE_ROOT,
  '.opencode/skill/system-spec-kit/scripts/lib/wave-lifecycle.cjs',
)) as {
  canFanOut: (engine: any) => any;
  createWaveContext: (target: string, loopType: 'review' | 'research', opts?: any) => any;
  dispatchWave: (segments: any[], config: any) => any;
  joinWave: (results: any[], strategy?: string) => any;
  advancePhase: (ctx: any, phase: string) => any;
  isWaveComplete: (dispatches: any[]) => boolean;
};

const planner = require(path.join(
  WORKSPACE_ROOT,
  '.opencode/skill/system-spec-kit/scripts/lib/wave-segment-planner.cjs',
)) as {
  shouldActivateReviewWave: (files: any[], metrics?: any) => any;
  shouldActivateResearchWave: (domains: any[], metrics?: any) => any;
  generateHotspotInventory: (files: any[]) => any;
  segmentForReview: (inv: any, config?: any) => any[];
};

const board = require(path.join(
  WORKSPACE_ROOT,
  '.opencode/skill/system-spec-kit/scripts/lib/wave-coordination-board.cjs',
)) as {
  createBoard: (opts: any) => any;
  updateBoard: (board: any, results: any[]) => any;
};

const convergence = require(path.join(
  WORKSPACE_ROOT,
  '.opencode/skill/system-spec-kit/scripts/lib/wave-convergence.cjs',
)) as {
  evaluateWaveConvergence: (board: any, signals: any, threshold?: number) => any;
  shouldPruneSegment: (segment: any, signals: any, threshold?: number) => any;
  evaluateSegmentConvergence: (state: any, opts?: any) => any;
};

const segState = require(path.join(
  WORKSPACE_ROOT,
  '.opencode/skill/system-spec-kit/scripts/lib/wave-segment-state.cjs',
)) as {
  createSegmentState: (id: string, config: any) => any;
  appendRecord: (state: any, record: any) => any;
  mergeSegmentStates: (states: any[], strategy?: string) => any;
};

/* ---------------------------------------------------------------
   RESUME AND DEFAULT-PATH REGRESSION TESTS
----------------------------------------------------------------*/

describe('wave-resume', () => {

  describe('resume after partial wave completion', () => {
    it('preserves previously merged segment lineage', () => {
      // Simulate a partial wave: 2 of 3 segments completed
      const b = board.createBoard({ sessionId: 's1', loopType: 'review' });

      // First two segments complete
      board.updateBoard(b, [
        { segmentId: 'seg-1', status: 'completed', findings: [{ findingId: 'f1', title: 'A', severity: 'P1' }] },
        { segmentId: 'seg-2', status: 'completed', findings: [{ findingId: 'f2', title: 'B', severity: 'P2' }] },
      ]);

      expect(b.segments.length).toBe(2);
      expect(b.findings.length).toBe(2);

      // On resume: third segment completes
      board.updateBoard(b, [
        { segmentId: 'seg-3', status: 'completed', findings: [{ findingId: 'f3', title: 'C', severity: 'P0' }] },
      ]);

      // All three segments present, previous findings intact
      expect(b.segments.length).toBe(3);
      expect(b.findings.length).toBe(3);
      // Previously merged findings unchanged
      expect(b.findings.find((f: any) => f.findingId === 'f1')).toBeDefined();
      expect(b.findings.find((f: any) => f.findingId === 'f2')).toBeDefined();
    });

    it('only resumes incomplete segments', () => {
      const dispatches = [
        { dispatchId: 'd1', segmentId: 'seg-1', status: 'completed' },
        { dispatchId: 'd2', segmentId: 'seg-2', status: 'running' },
        { dispatchId: 'd3', segmentId: 'seg-3', status: 'pending' },
      ];

      expect(lifecycle.isWaveComplete(dispatches)).toBe(false);

      // Identify incomplete segments
      const incomplete = dispatches.filter(d => d.status !== 'completed' && d.status !== 'pruned' && d.status !== 'converged' && d.status !== 'failed');
      expect(incomplete.length).toBe(2);
      expect(incomplete.map(d => d.segmentId)).toEqual(['seg-2', 'seg-3']);
    });
  });

  describe('segment state merge preserves provenance after resume', () => {
    it('merged state includes provenance from all segments', () => {
      const s1 = segState.createSegmentState('seg-1', { sessionId: 's1' });
      s1.findings = [{ findingId: 'f1', title: 'Bug', severity: 'P1', segment: 'seg-1' }];

      const s2 = segState.createSegmentState('seg-2', { sessionId: 's1' });
      s2.findings = [{ findingId: 'f2', title: 'Issue', severity: 'P2', segment: 'seg-2' }];

      const result = segState.mergeSegmentStates([s1, s2]);
      expect(result.merged.findings.length).toBe(2);
      expect(result.merged.findings[0].provenance.sourceSegment).toBeDefined();
      expect(result.merged.findings[1].provenance.sourceSegment).toBeDefined();
    });
  });

  describe('convergence after partial wave', () => {
    it('does not converge while segments remain incomplete', () => {
      const b = board.createBoard({ sessionId: 's1', loopType: 'review' });
      const result = convergence.evaluateWaveConvergence(b, {
        segmentStates: [
          { convergenceScore: 0.98 },
          { convergenceScore: 0.01 },
        ],
        crossSegmentNovelty: 0.02,
        gapCoverage: 0.95,
      });

      expect(result.converged).toBe(false);
      expect(result.blockedBy.length).toBeGreaterThan(0);
    });

    it('converges when all segments pass threshold', () => {
      const b = board.createBoard({ sessionId: 's1', loopType: 'review' });
      const result = convergence.evaluateWaveConvergence(b, {
        segmentStates: [
          { convergenceScore: 0.98 },
          { convergenceScore: 0.97 },
        ],
        crossSegmentNovelty: 0.02,
        gapCoverage: 0.98,
      });

      expect(result.converged).toBe(true);
      expect(result.blockedBy.length).toBe(0);
    });
  });

  describe('segment pruning during wave', () => {
    it('allows pruning a converged segment without stopping global wave', () => {
      const segment = { segmentId: 'seg-1', status: 'running' };
      const pruneResult = convergence.shouldPruneSegment(segment, {
        convergenceScore: 0.98,
        stuckCount: 0,
      });

      expect(pruneResult.shouldPrune).toBe(true);
      expect(pruneResult.pruneType).toBe('converged');
    });

    it('allows pruning a stuck segment', () => {
      const segment = { segmentId: 'seg-2', status: 'running' };
      const pruneResult = convergence.shouldPruneSegment(segment, {
        convergenceScore: 0.1,
        stuckCount: 4,
      });

      expect(pruneResult.shouldPrune).toBe(true);
      expect(pruneResult.pruneType).toBe('stuck');
    });

    it('does not prune an active segment below threshold', () => {
      const segment = { segmentId: 'seg-3', status: 'running' };
      const pruneResult = convergence.shouldPruneSegment(segment, {
        convergenceScore: 0.3,
        stuckCount: 1,
      });

      expect(pruneResult.shouldPrune).toBe(false);
    });

    it('skips pruning for already-terminal segments', () => {
      const segment = { segmentId: 'seg-4', status: 'completed' };
      const pruneResult = convergence.shouldPruneSegment(segment, {
        convergenceScore: 0.99,
        stuckCount: 10,
      });

      expect(pruneResult.shouldPrune).toBe(false);
    });
  });
});

/* ---------------------------------------------------------------
   DEFAULT-PATH REGRESSION TESTS
----------------------------------------------------------------*/

describe('wave-default-path-regression', () => {

  describe('small targets stay sequential', () => {
    it('review with <1000 files does not activate wave', () => {
      const files = Array.from({ length: 500 }, (_, i) => ({
        path: `src/file${i}.ts`,
        complexity: 5,
        churnRate: 0.5,
        issueCount: 0,
      }));
      const result = planner.shouldActivateReviewWave(files, { hotspotSpread: 0.5 });
      expect(result.activate).toBe(false);
    });

    it('research with <50 domains does not activate wave', () => {
      const domains = Array.from({ length: 30 }, (_, i) => ({
        domain: `domain${i}.com`,
        authority: 0.5,
        cluster: `c-${i % 5}`,
      }));
      const result = planner.shouldActivateResearchWave(domains, { clusterDiversity: 0.5 });
      expect(result.activate).toBe(false);
    });
  });

  describe('fan-out proof fallback', () => {
    it('when fan-out is not proven, wave mode stays blocked', () => {
      const proof = lifecycle.canFanOut({});
      expect(proof.canFanOut).toBe(false);
      expect(proof.maxParallel).toBe(0);

      // Without fan-out proof, wave context can still be created
      // but dispatch should not proceed
      const ctx = lifecycle.createWaveContext('test', 'review');
      expect(ctx.phase).toBe('prepass');
      // Attempting to advance to fan-out should be blocked by
      // the orchestrator checking canFanOut first
    });
  });

  describe('large target with no spread stays sequential', () => {
    it('1000+ files but low hotspot spread does not activate', () => {
      const files = Array.from({ length: 1500 }, (_, i) => ({
        path: `src/single-dir/file${i}.ts`,
        complexity: 1,
        churnRate: 0,
        issueCount: 0,
      }));
      const result = planner.shouldActivateReviewWave(files, { hotspotSpread: 0.05 });
      expect(result.activate).toBe(false);
      expect(result.reason).toContain('spread');
    });
  });

  describe('segment convergence evaluation', () => {
    it('requires minimum iterations before convergence', () => {
      const state = segState.createSegmentState('seg-1', { sessionId: 's1' });
      state.iterations = [{ newInfoRatio: 0.01, status: 'evidence' }];

      const result = convergence.evaluateSegmentConvergence(state);
      expect(result.converged).toBe(false);
      expect(result.iterationCount).toBe(1);
    });

    it('converges after sufficient low-ratio iterations', () => {
      const state = segState.createSegmentState('seg-1', { sessionId: 's1' });
      state.iterations = [
        { newInfoRatio: 0.2, status: 'evidence' },
        { newInfoRatio: 0.1, status: 'evidence' },
        { newInfoRatio: 0.02, status: 'evidence' },
        { newInfoRatio: 0.01, status: 'evidence' },
        { newInfoRatio: 0.01, status: 'evidence' },
      ];

      const result = convergence.evaluateSegmentConvergence(state, { threshold: 0.05 });
      expect(result.converged).toBe(true);
      expect(result.score).toBeGreaterThan(0);
    });
  });
});
