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
  LIFECYCLE_PHASES: ReadonlyArray<string>;
  LIFECYCLE_TRANSITIONS: Readonly<Record<string, readonly string[]>>;
  SEGMENT_STATUSES: ReadonlyArray<string>;
  MAX_PARALLEL_SEGMENTS: number;
  MERGE_STRATEGIES: Readonly<Record<string, string>>;
  canFanOut: (engine: { hasNativeParallel?: boolean; hasHelperOrchestration?: boolean }) => { canFanOut: boolean; method: string; proof: string; maxParallel: number };
  createWaveContext: (target: string, loopType: 'review' | 'research', options?: { sessionId?: string; generation?: number }) => object;
  dispatchWave: (segments: object[], config: { sessionId: string; generation?: number; waveNumber: number; maxParallel?: number }) => { waveId: string; dispatches: object[]; timestamp: string; totalSegments: number; activeSegments: number; deferredSegments: number };
  joinWave: (results: object[], mergeStrategy?: string) => { merged: object[]; conflicts: object[]; stats: object };
  advancePhase: (ctx: any, phase: string) => { success: boolean; previousPhase: string; currentPhase: string; error?: string };
  isWaveComplete: (dispatches: object[]) => boolean;
  buildFindingKey: (finding: object) => string;
  compareSeverity: (a: string, b: string) => number;
};

/* ---------------------------------------------------------------
   TESTS
----------------------------------------------------------------*/

describe('wave-lifecycle', () => {

  describe('constants', () => {
    it('exports lifecycle phases in correct order', () => {
      expect(lifecycle.LIFECYCLE_PHASES).toEqual([
        'prepass', 'plan', 'fan-out', 'prune', 'promote', 'join', 'merge',
      ]);
    });

    it('exports segment statuses', () => {
      expect(lifecycle.SEGMENT_STATUSES).toContain('pending');
      expect(lifecycle.SEGMENT_STATUSES).toContain('completed');
      expect(lifecycle.SEGMENT_STATUSES).toContain('pruned');
    });

    it('lifecycle phases are frozen', () => {
      expect(Object.isFrozen(lifecycle.LIFECYCLE_PHASES)).toBe(true);
    });

    it('exports the allowed adjacent transition matrix', () => {
      expect(lifecycle.LIFECYCLE_TRANSITIONS.prepass).toEqual(['plan']);
      expect(lifecycle.LIFECYCLE_TRANSITIONS.join).toEqual(['merge']);
      expect(lifecycle.LIFECYCLE_TRANSITIONS.merge).toEqual([]);
    });
  });

  describe('fan-out/join proof (canFanOut)', () => {
    it('returns false for null input', () => {
      const result = lifecycle.canFanOut(null as any);
      expect(result.canFanOut).toBe(false);
      expect(result.method).toBe('none');
    });

    it('returns true for helper orchestration', () => {
      const result = lifecycle.canFanOut({ hasHelperOrchestration: true });
      expect(result.canFanOut).toBe(true);
      expect(result.method).toBe('helper-module');
      expect(result.maxParallel).toBe(lifecycle.MAX_PARALLEL_SEGMENTS);
    });

    it('returns true for native parallel', () => {
      const result = lifecycle.canFanOut({ hasNativeParallel: true });
      expect(result.canFanOut).toBe(true);
      expect(result.method).toBe('native');
    });

    it('prefers helper orchestration over native', () => {
      const result = lifecycle.canFanOut({ hasHelperOrchestration: true, hasNativeParallel: true });
      expect(result.method).toBe('helper-module');
    });

    it('returns false when neither capability exists', () => {
      const result = lifecycle.canFanOut({});
      expect(result.canFanOut).toBe(false);
    });
  });

  describe('createWaveContext', () => {
    it('creates a valid review context', () => {
      const ctx = lifecycle.createWaveContext('my-repo', 'review') as any;
      expect(ctx.target).toBe('my-repo');
      expect(ctx.loopType).toBe('review');
      expect(ctx.phase).toBe('prepass');
      expect(ctx.status).toBe('initialized');
      expect(ctx.sessionId).toMatch(/^wave-/);
    });

    it('creates a valid research context', () => {
      const ctx = lifecycle.createWaveContext('ml-papers', 'research', { generation: 2 }) as any;
      expect(ctx.loopType).toBe('research');
      expect(ctx.generation).toBe(2);
    });

    it('returns null for empty target', () => {
      expect(lifecycle.createWaveContext('', 'review')).toBeNull();
    });

    it('returns null for invalid loop type', () => {
      expect(lifecycle.createWaveContext('test', 'invalid' as any)).toBeNull();
    });
  });

  describe('dispatchWave', () => {
    it('dispatches segments with unique IDs', () => {
      const segments = [
        { segmentId: 'seg-001' },
        { segmentId: 'seg-002' },
        { segmentId: 'seg-003' },
      ];
      const result = lifecycle.dispatchWave(segments, {
        sessionId: 'test-session',
        waveNumber: 1,
      });
      expect(result.dispatches.length).toBe(3);
      expect(result.waveId).toBe('test-session-w1');
      expect(result.totalSegments).toBe(3);
      expect(result.deferredSegments).toBe(0);
    });

    it('caps dispatches to maxParallel', () => {
      const segments = Array.from({ length: 15 }, (_, i) => ({ segmentId: `seg-${i}` }));
      const result = lifecycle.dispatchWave(segments, {
        sessionId: 'test',
        waveNumber: 1,
        maxParallel: 5,
      });
      expect(result.activeSegments).toBe(5);
      expect(result.deferredSegments).toBe(10);
    });

    it('returns null for empty segments', () => {
      expect(lifecycle.dispatchWave([], { sessionId: 's', waveNumber: 1 })).toBeNull();
    });

    it('returns null for missing config', () => {
      expect(lifecycle.dispatchWave([{ segmentId: 'x' }], null as any)).toBeNull();
    });
  });

  describe('joinWave', () => {
    it('merges findings from multiple segments', () => {
      const results = [
        { segmentId: 'seg-1', findings: [{ findingId: 'f1', title: 'Bug A', severity: 'P1' }] },
        { segmentId: 'seg-2', findings: [{ findingId: 'f2', title: 'Bug B', severity: 'P0' }] },
      ];
      const joined = lifecycle.joinWave(results);
      expect(joined.merged.length).toBe(2);
      expect(joined.conflicts.length).toBe(0);
    });

    it('preserves cross-segment findings that share a logical findingId', () => {
      const results = [
        { segmentId: 'seg-1', findings: [{ findingId: 'f1', title: 'Bug A', severity: 'P1' }] },
        { segmentId: 'seg-2', findings: [{ findingId: 'f1', title: 'Bug A', severity: 'P1' }] },
      ];
      const joined = lifecycle.joinWave(results, 'dedupe');
      expect(joined.merged.length).toBe(2);
      expect(joined.conflicts.length).toBe(0);
    });

    it('deduplicates exact duplicates only when the full 5-key composite matches', () => {
      const results = [
        { segmentId: 'seg-1', waveId: 'wave-1', findings: [{ findingId: 'f1', title: 'Bug A', severity: 'P1' }] },
        { segmentId: 'seg-1', waveId: 'wave-1', findings: [{ findingId: 'f1', title: 'Bug A', severity: 'P1' }] },
      ];
      const joined = lifecycle.joinWave(results, 'dedupe');
      expect(joined.merged.length).toBe(1);
      expect(joined.conflicts.length).toBe(0);
    });

    it('records cross-segment promotions through the canonical board merge contract', () => {
      const results = [
        { segmentId: 'seg-1', findings: [{ findingId: 'f1', title: 'Bug', severity: 'P2' }] },
        { segmentId: 'seg-2', findings: [{ findingId: 'f1', title: 'Bug', severity: 'P0' }] },
      ];
      const joined = lifecycle.joinWave(results, 'priority');
      expect(joined.merged.length).toBe(2);
      expect(joined.conflicts.length).toBe(1);
      const promoted = joined.merged.find((finding: any) => finding.segment === 'seg-2');
      expect((promoted as any).severity).toBe('P0');
      expect((promoted as any).mergeState).toBe('promoted');
    });

    it('keeps all findings in concat mode', () => {
      const results = [
        { segmentId: 'seg-1', findings: [{ findingId: 'f1', title: 'Bug', severity: 'P1' }] },
        { segmentId: 'seg-2', findings: [{ findingId: 'f1', title: 'Bug', severity: 'P1' }] },
      ];
      const joined = lifecycle.joinWave(results, 'concat');
      expect(joined.merged.length).toBe(2);
    });

    it('handles empty results gracefully', () => {
      const joined = lifecycle.joinWave([]);
      expect(joined.merged.length).toBe(0);
      expect((joined.stats as any).totalInput).toBe(0);
    });
  });

  describe('advancePhase', () => {
    it('advances forward through lifecycle', () => {
      const ctx = lifecycle.createWaveContext('test', 'review') as any;
      const r1 = lifecycle.advancePhase(ctx, 'plan');
      expect(r1.success).toBe(true);
      expect(r1.previousPhase).toBe('prepass');
      expect(r1.currentPhase).toBe('plan');
      expect(ctx.phase).toBe('plan');
    });

    it('rejects backward transitions', () => {
      const ctx = lifecycle.createWaveContext('test', 'review') as any;
      lifecycle.advancePhase(ctx, 'plan');
      lifecycle.advancePhase(ctx, 'fan-out');
      const r2 = lifecycle.advancePhase(ctx, 'plan');
      expect(r2.success).toBe(false);
      expect(r2.error).toContain('Cannot transition backward');
    });

    it('rejects skipped transitions that bypass an adjacent phase', () => {
      const ctx = lifecycle.createWaveContext('test', 'review') as any;
      const result = lifecycle.advancePhase(ctx, 'fan-out');
      expect(result.success).toBe(false);
      expect(result.error).toContain('allowed next phase');
      expect(ctx.phase).toBe('prepass');
    });

    it('rejects invalid phases', () => {
      const ctx = lifecycle.createWaveContext('test', 'review') as any;
      const r = lifecycle.advancePhase(ctx, 'invalid-phase');
      expect(r.success).toBe(false);
    });

    it('treats merge as a terminal phase', () => {
      const ctx = lifecycle.createWaveContext('test', 'review') as any;
      lifecycle.advancePhase(ctx, 'plan');
      lifecycle.advancePhase(ctx, 'fan-out');
      lifecycle.advancePhase(ctx, 'prune');
      lifecycle.advancePhase(ctx, 'promote');
      lifecycle.advancePhase(ctx, 'join');
      lifecycle.advancePhase(ctx, 'merge');

      const result = lifecycle.advancePhase(ctx, 'merge');
      expect(result.success).toBe(false);
      expect(result.error).toContain('allowed next phase(s): none');
    });
  });

  describe('isWaveComplete', () => {
    it('returns true for all-completed dispatches', () => {
      const dispatches = [
        { status: 'completed' },
        { status: 'pruned' },
        { status: 'converged' },
      ];
      expect(lifecycle.isWaveComplete(dispatches)).toBe(true);
    });

    it('returns false when dispatches are still running', () => {
      const dispatches = [
        { status: 'completed' },
        { status: 'running' },
      ];
      expect(lifecycle.isWaveComplete(dispatches)).toBe(false);
    });

    it('returns true for empty array', () => {
      expect(lifecycle.isWaveComplete([])).toBe(true);
    });
  });

  describe('helpers', () => {
    it('buildFindingKey uses findingId when available', () => {
      expect(lifecycle.buildFindingKey({ findingId: 'abc' })).toBe('abc');
    });

    it('buildFindingKey builds from file:line:title', () => {
      const key = lifecycle.buildFindingKey({ file: 'src/a.ts', line: 42, title: 'Bug Here' });
      expect(key).toContain('src/a.ts');
      expect(key).toContain('42');
    });

    it('compareSeverity ranks P0 > P1 > P2', () => {
      expect(lifecycle.compareSeverity('P0', 'P1')).toBeGreaterThan(0);
      expect(lifecycle.compareSeverity('P1', 'P2')).toBeGreaterThan(0);
      expect(lifecycle.compareSeverity('P2', 'P0')).toBeLessThan(0);
      expect(lifecycle.compareSeverity('P1', 'P1')).toBe(0);
    });
  });
});
