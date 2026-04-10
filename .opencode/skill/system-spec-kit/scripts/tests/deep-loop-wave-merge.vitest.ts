import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const WORKSPACE_ROOT = path.resolve(TEST_DIR, '../../../../../');
const require = createRequire(import.meta.url);

const board = require(path.join(
  WORKSPACE_ROOT,
  '.opencode/skill/system-spec-kit/scripts/lib/wave-coordination-board.cjs',
)) as {
  BOARD_STATUSES: ReadonlyArray<string>;
  FINDING_MERGE_STATES: ReadonlyArray<string>;
  createBoard: (opts: { sessionId: string; generation?: number; loopType: string; target?: string }) => any;
  updateBoard: (board: any, results: any[]) => any;
  buildFindingRecord: (finding: any, segmentId: string, board: any) => any;
  mergeFinding: (board: any, record: any) => void;
  renderDashboard: (board: any) => string;
  generateFindingId: (finding: any, segmentId: string) => string;
  recalculateStats: (board: any) => void;
  compareSeverity: (a: string, b: string) => number;
};

const segState = require(path.join(
  WORKSPACE_ROOT,
  '.opencode/skill/system-spec-kit/scripts/lib/wave-segment-state.cjs',
)) as {
  MERGE_KEYS: ReadonlyArray<string>;
  SEGMENT_STATE_STATUSES: ReadonlyArray<string>;
  createSegmentState: (id: string, config: { sessionId: string; generation?: number; waveId?: string; loopType?: string; files?: string[]; domains?: string[] }) => any;
  createJsonlRecord: (data: any, state: any) => any;
  appendRecord: (state: any, record: any) => any;
  mergeSegmentStates: (states: any[], strategy?: string) => { merged: any; conflicts: any[]; dedupeLog: any[] };
  serializeJsonl: (state: any) => string;
  parseJsonl: (jsonl: string) => { records: any[]; errors: any[] };
  validateMergeKeys: (record: any) => { valid: boolean; missingKeys: string[] };
  buildMergeKey: (finding: any) => string;
  compareSeverity: (a: string, b: string) => number;
};

/* ---------------------------------------------------------------
   COORDINATION BOARD TESTS
----------------------------------------------------------------*/

describe('wave-coordination-board', () => {

  describe('createBoard', () => {
    it('creates a board with required fields', () => {
      const b = board.createBoard({ sessionId: 'sess-1', loopType: 'review', target: 'my-repo' });
      expect(b.schema).toBe('wave-board-v1');
      expect(b.sessionId).toBe('sess-1');
      expect(b.loopType).toBe('review');
      expect(b.status).toBe('initialized');
      expect(b.findings).toEqual([]);
      expect(b.conflicts).toEqual([]);
    });

    it('throws for missing sessionId', () => {
      expect(board.createBoard({ loopType: 'review' } as any)).toBeNull();
    });

    it('throws for invalid loopType', () => {
      expect(board.createBoard({ sessionId: 's', loopType: 'invalid' } as any)).toBeNull();
    });
  });

  describe('updateBoard', () => {
    it('adds segment results to board', () => {
      const b = board.createBoard({ sessionId: 's1', loopType: 'review' });
      board.updateBoard(b, [
        { segmentId: 'seg-1', status: 'completed', findings: [{ findingId: 'f1', title: 'Bug', severity: 'P1' }] },
      ]);
      expect(b.segments.length).toBe(1);
      expect(b.findings.length).toBe(1);
      expect(b.stats.totalFindings).toBe(1);
    });

    it('deduplicates identical findings', () => {
      const b = board.createBoard({ sessionId: 's1', loopType: 'review' });
      board.updateBoard(b, [
        { segmentId: 'seg-1', findings: [{ findingId: 'f1', title: 'Bug', severity: 'P1', evidence: 'e1' }] },
        { segmentId: 'seg-2', findings: [{ findingId: 'f1', title: 'Bug', severity: 'P1', evidence: 'e1' }] },
      ]);
      expect(b.findings.length).toBe(1);
      expect(b.dedupeLog.length).toBe(1);
    });

    it('detects conflicts for different severity on same findingId', () => {
      const b = board.createBoard({ sessionId: 's1', loopType: 'review' });
      board.updateBoard(b, [
        { segmentId: 'seg-1', findings: [{ findingId: 'f1', title: 'Bug', severity: 'P2', evidence: 'e1' }] },
        { segmentId: 'seg-2', findings: [{ findingId: 'f1', title: 'Bug', severity: 'P0', evidence: 'e2' }] },
      ]);
      expect(b.conflicts.length).toBe(1);
      expect(b.promotions.length).toBe(1);
      // The promoted finding should now be P0
      const promoted = b.findings.find((f: any) => f.findingId === 'f1');
      expect(promoted.severity).toBe('P0');
    });

    it('preserves merge history for every operation', () => {
      const b = board.createBoard({ sessionId: 's1', loopType: 'review' });
      board.updateBoard(b, [
        { segmentId: 'seg-1', findings: [{ findingId: 'f1', title: 'A', severity: 'P1' }] },
        { segmentId: 'seg-2', findings: [{ findingId: 'f2', title: 'B', severity: 'P2' }] },
      ]);
      expect(b.mergeHistory.length).toBe(2);
      for (const entry of b.mergeHistory) {
        expect(entry).toHaveProperty('findingId');
        expect(entry).toHaveProperty('segment');
        expect(entry).toHaveProperty('mergeState');
        expect(entry).toHaveProperty('timestamp');
      }
    });
  });

  describe('buildFindingRecord', () => {
    it('attaches all explicit merge keys', () => {
      const b = board.createBoard({ sessionId: 's1', generation: 2, loopType: 'review' });
      const record = board.buildFindingRecord(
        { findingId: 'f1', title: 'Bug', severity: 'P1' },
        'seg-1',
        b,
      );
      expect(record.sessionId).toBe('s1');
      expect(record.generation).toBe(2);
      expect(record.segment).toBe('seg-1');
      expect(record.findingId).toBe('f1');
      expect(record.mergeState).toBe('original');
      expect(record.provenance.sourceSegment).toBe('seg-1');
    });

    it('generates deterministic findingId when absent', () => {
      const b = board.createBoard({ sessionId: 's1', loopType: 'review' });
      const r1 = board.buildFindingRecord({ title: 'Bug', file: 'a.ts', line: 10 }, 'seg-1', b);
      const r2 = board.buildFindingRecord({ title: 'Bug', file: 'a.ts', line: 10 }, 'seg-1', b);
      expect(r1.findingId).toBe(r2.findingId);
    });
  });

  describe('renderDashboard', () => {
    it('renders markdown for empty board', () => {
      const b = board.createBoard({ sessionId: 's1', loopType: 'review' });
      const md = board.renderDashboard(b);
      expect(md).toContain('# Wave Execution Dashboard');
      expect(md).toContain('Do not edit manually');
    });

    it('renders segments and conflicts when present', () => {
      const b = board.createBoard({ sessionId: 's1', loopType: 'review' });
      board.updateBoard(b, [
        { segmentId: 'seg-1', findings: [{ findingId: 'f1', title: 'Bug', severity: 'P2', evidence: 'e1' }] },
        { segmentId: 'seg-2', findings: [{ findingId: 'f1', title: 'Bug', severity: 'P0', evidence: 'e2' }] },
      ]);
      const md = board.renderDashboard(b);
      expect(md).toContain('seg-1');
      expect(md).toContain('seg-2');
      expect(md).toContain('## Conflicts');
      expect(md).toContain('## Promotions');
    });

    it('returns fallback for null board', () => {
      const md = board.renderDashboard(null);
      expect(md).toContain('No board data available');
    });
  });
});

/* ---------------------------------------------------------------
   SEGMENT STATE + JSONL MERGE TESTS
----------------------------------------------------------------*/

describe('wave-segment-state', () => {

  describe('MERGE_KEYS', () => {
    it('contains exactly 5 required keys', () => {
      expect(segState.MERGE_KEYS).toEqual(['sessionId', 'generation', 'segment', 'wave', 'findingId']);
    });
  });

  describe('createSegmentState', () => {
    it('creates state with required fields', () => {
      const s = segState.createSegmentState('seg-1', { sessionId: 'sess-1', files: ['a.ts'] });
      expect(s.segmentId).toBe('seg-1');
      expect(s.sessionId).toBe('sess-1');
      expect(s.status).toBe('initialized');
      expect(s.files).toEqual(['a.ts']);
      expect(s.jsonlRecords).toEqual([]);
    });

    it('throws for empty segmentId', () => {
      expect(segState.createSegmentState('', { sessionId: 's' })).toBeNull();
    });

    it('throws for missing sessionId', () => {
      expect(segState.createSegmentState('seg-1', {} as any)).toBeNull();
    });
  });

  describe('createJsonlRecord', () => {
    it('attaches all merge keys from segment state', () => {
      const state = segState.createSegmentState('seg-1', { sessionId: 's1', generation: 2, waveId: 'w1' });
      const record = segState.createJsonlRecord({ type: 'finding', findingId: 'f1' }, state);
      expect(record.sessionId).toBe('s1');
      expect(record.generation).toBe(2);
      expect(record.segment).toBe('seg-1');
      expect(record.wave).toBe('w1');
      expect(record.findingId).toBe('f1');
    });
  });

  describe('appendRecord', () => {
    it('appends record to segment state', () => {
      const state = segState.createSegmentState('seg-1', { sessionId: 's1' });
      segState.appendRecord(state, { type: 'iteration', findingId: null });
      expect(state.jsonlRecords.length).toBe(1);
      expect(state.jsonlRecords[0].sessionId).toBe('s1');
      expect(state.jsonlRecords[0].segment).toBe('seg-1');
    });
  });

  describe('mergeSegmentStates', () => {
    it('merges findings from multiple segments', () => {
      const s1 = segState.createSegmentState('seg-1', { sessionId: 's1' });
      s1.findings = [{ findingId: 'f1', title: 'Bug A', severity: 'P1' }];

      const s2 = segState.createSegmentState('seg-2', { sessionId: 's1' });
      s2.findings = [{ findingId: 'f2', title: 'Bug B', severity: 'P2' }];

      const result = segState.mergeSegmentStates([s1, s2]);
      expect(result.merged.findings.length).toBe(2);
      expect(result.conflicts.length).toBe(0);
    });

    it('deduplicates findings with same ID', () => {
      const s1 = segState.createSegmentState('seg-1', { sessionId: 's1' });
      s1.findings = [{ findingId: 'f1', title: 'Bug', severity: 'P1' }];

      const s2 = segState.createSegmentState('seg-2', { sessionId: 's1' });
      s2.findings = [{ findingId: 'f1', title: 'Bug', severity: 'P1' }];

      const result = segState.mergeSegmentStates([s1, s2], 'dedupe');
      expect(result.merged.findings.length).toBe(1);
      expect(result.dedupeLog.length).toBe(1);
    });

    it('detects severity conflicts and keeps higher', () => {
      const s1 = segState.createSegmentState('seg-1', { sessionId: 's1' });
      s1.findings = [{ findingId: 'f1', title: 'Bug', severity: 'P2' }];

      const s2 = segState.createSegmentState('seg-2', { sessionId: 's1' });
      s2.findings = [{ findingId: 'f1', title: 'Bug', severity: 'P0' }];

      const result = segState.mergeSegmentStates([s1, s2], 'dedupe');
      expect(result.conflicts.length).toBe(1);
      expect(result.merged.findings[0].severity).toBe('P0');
    });

    it('sorts JSONL records by explicit keys, not append order', () => {
      const s1 = segState.createSegmentState('seg-2', { sessionId: 's1', generation: 1 });
      segState.appendRecord(s1, { type: 'iter', timestamp: '2026-01-02T00:00:00Z' });

      const s2 = segState.createSegmentState('seg-1', { sessionId: 's1', generation: 1 });
      segState.appendRecord(s2, { type: 'iter', timestamp: '2026-01-01T00:00:00Z' });

      const result = segState.mergeSegmentStates([s1, s2]);
      // seg-1 should come before seg-2 (sorted by segment name)
      expect(result.merged.jsonlRecords[0].segment).toBe('seg-1');
      expect(result.merged.jsonlRecords[1].segment).toBe('seg-2');
    });

    it('returns null merged for empty input', () => {
      const result = segState.mergeSegmentStates([]);
      expect(result.merged).toBeNull();
    });
  });

  describe('JSONL serialization', () => {
    it('serializes and parses round-trip', () => {
      const state = segState.createSegmentState('seg-1', { sessionId: 's1' });
      segState.appendRecord(state, { type: 'finding', findingId: 'f1' });
      segState.appendRecord(state, { type: 'iteration', findingId: null });

      const jsonl = segState.serializeJsonl(state);
      const parsed = segState.parseJsonl(jsonl);
      expect(parsed.records.length).toBe(2);
      expect(parsed.errors.length).toBe(0);
    });

    it('handles malformed JSONL lines', () => {
      const jsonl = [
        '{"sessionId":"s1","generation":1,"segment":"seg-1","wave":"w1","findingId":"f1","valid":true}',
        'not json',
        '{"sessionId":"s1","generation":1,"segment":"seg-1","wave":"w1","findingId":"f2","also":"valid"}',
      ].join('\n');
      const parsed = segState.parseJsonl(jsonl);
      expect(parsed.records.length).toBe(2);
      expect(parsed.errors.length).toBe(1);
      expect(parsed.errors[0].line).toBe(2);
    });
  });

  describe('validateMergeKeys', () => {
    it('passes for complete record', () => {
      const result = segState.validateMergeKeys({
        sessionId: 's1', generation: 1, segment: 'seg-1', wave: 'w1', findingId: 'f1',
      });
      expect(result.valid).toBe(true);
      expect(result.missingKeys).toEqual([]);
    });

    it('fails for incomplete record', () => {
      const result = segState.validateMergeKeys({ sessionId: 's1' });
      expect(result.valid).toBe(false);
      expect(result.missingKeys).toContain('generation');
      expect(result.missingKeys).toContain('segment');
    });

    it('fails for null record', () => {
      const result = segState.validateMergeKeys(null);
      expect(result.valid).toBe(false);
      expect(result.missingKeys.length).toBe(5);
    });
  });
});
