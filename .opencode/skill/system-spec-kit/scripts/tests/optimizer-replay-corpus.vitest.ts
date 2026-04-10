import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const WORKSPACE_ROOT = path.resolve(TEST_DIR, '../../../../../');
const require = createRequire(import.meta.url);

const replayCorpus = require(path.join(
  WORKSPACE_ROOT,
  '.opencode/skill/system-spec-kit/scripts/optimizer/replay-corpus.cjs',
)) as {
  PACKET_FAMILIES: Record<string, { role: string; required: boolean; compatibilityGrade: string }>;
  REQUIRED_ENTRY_FIELDS: readonly string[];
  buildCorpus: (
    packetFamily: string,
    options?: { fixturesDir?: string; jsonlContent?: string; sourceRunId?: string; timestamp?: string },
  ) => { corpus: Array<Record<string, any>>; errors: string[]; warnings: string[]; familyInfo: object | null };
  validateCorpusEntry: (entry: object) => { valid: boolean; errors: string[] };
  extractCorpusEntry: (records: object[], packetFamily: string, sourceRunId: string, options?: { timestamp?: string }) => Record<string, any>;
  parseJSONL: (content: string) => { records: object[]; skippedLines: Array<{ lineNumber: number; content: string; error: string }>; totalLines: number };
  saveCorpus: (corpus: object[], outputPath: string) => void;
  loadCorpus: (corpusPath: string) => object[];
};

const FIXTURES_DIR = path.join(TEST_DIR, 'fixtures/deep-loop-optimizer');
const REPLAY_FIXTURES_DIR = path.join(TEST_DIR, 'fixtures/deep-loop-replay');

describe('Replay Corpus Builder (T001)', () => {
  describe('PACKET_FAMILIES', () => {
    it('should define 040 as the required primary corpus', () => {
      const family = replayCorpus.PACKET_FAMILIES['040'];
      expect(family).toBeDefined();
      expect(family.role).toBe('primary');
      expect(family.required).toBe(true);
      expect(family.compatibilityGrade).toBe('full');
    });

    it('should define 028 as an optional holdout', () => {
      const family = replayCorpus.PACKET_FAMILIES['028'];
      expect(family).toBeDefined();
      expect(family.role).toBe('holdout');
      expect(family.required).toBe(false);
      expect(family.compatibilityGrade).toBe('legacy');
    });

    it('should define 042 as excluded', () => {
      const family = replayCorpus.PACKET_FAMILIES['042'];
      expect(family).toBeDefined();
      expect(family.role).toBe('excluded');
      expect(family.required).toBe(false);
      expect(family.compatibilityGrade).toBe('none');
    });
  });

  describe('parseJSONL', () => {
    it('should parse valid JSONL content', () => {
      const content = '{"type":"config","topic":"test"}\n{"type":"iteration","run":1}\n';
      const result = replayCorpus.parseJSONL(content);
      expect(result.records).toHaveLength(2);
      expect(result.records[0]).toEqual({ type: 'config', topic: 'test' });
      expect(result.records[1]).toEqual({ type: 'iteration', run: 1 });
      expect(result.skippedLines).toHaveLength(0);
      expect(result.totalLines).toBe(2);
    });

    it('should skip blank lines', () => {
      const content = '{"type":"config"}\n\n{"type":"iteration"}\n\n';
      const result = replayCorpus.parseJSONL(content);
      expect(result.records).toHaveLength(2);
      expect(result.totalLines).toBe(2);
    });

    it('should track malformed lines with metadata (P1-4)', () => {
      const content = '{"type":"config"}\nnot-json\n{"type":"iteration"}\n';
      const result = replayCorpus.parseJSONL(content);
      expect(result.records).toHaveLength(2);
      expect(result.skippedLines).toHaveLength(1);
      expect(result.skippedLines[0].lineNumber).toBe(2);
      expect(result.skippedLines[0].content).toBe('not-json');
      expect(result.skippedLines[0].error).toBeDefined();
      expect(result.totalLines).toBe(3);
    });

    it('should truncate long malformed line content to 200 chars (P1-4)', () => {
      const longLine = 'x'.repeat(300);
      const content = `{"type":"config"}\n${longLine}\n`;
      const result = replayCorpus.parseJSONL(content);
      expect(result.skippedLines).toHaveLength(1);
      expect(result.skippedLines[0].content.length).toBeLessThanOrEqual(203); // 200 + '...'
    });
  });

  describe('validateCorpusEntry', () => {
    it('should accept a valid entry', () => {
      const entry = {
        id: '040-run-1',
        packetFamily: '040',
        sourceRun: 'run-1',
        config: { maxIterations: 7 },
        iterations: [{ run: 1 }],
        stopOutcome: { stopReason: 'converged' },
      };
      const result = replayCorpus.validateCorpusEntry(entry);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject null input', () => {
      const result = replayCorpus.validateCorpusEntry(null as any);
      expect(result.valid).toBe(false);
    });

    it('should report missing required fields', () => {
      const result = replayCorpus.validateCorpusEntry({});
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      for (const field of replayCorpus.REQUIRED_ENTRY_FIELDS) {
        expect(result.errors.some((e: string) => e.includes(field))).toBe(true);
      }
    });

    it('should reject packet family 042', () => {
      const entry = {
        id: '042-run-1',
        packetFamily: '042',
        sourceRun: 'run-1',
        config: {},
        iterations: [{ run: 1 }],
        stopOutcome: { stopReason: 'converged' },
      };
      const result = replayCorpus.validateCorpusEntry(entry);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e: string) => e.includes('042'))).toBe(true);
    });

    it('should reject empty iterations array', () => {
      const entry = {
        id: '040-run-1',
        packetFamily: '040',
        sourceRun: 'run-1',
        config: {},
        iterations: [],
        stopOutcome: { stopReason: 'converged' },
      };
      const result = replayCorpus.validateCorpusEntry(entry);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e: string) => e.includes('empty'))).toBe(true);
    });
  });

  describe('buildCorpus', () => {
    it('should build corpus from 040 JSONL fixtures', () => {
      const result = replayCorpus.buildCorpus('040', {
        fixturesDir: REPLAY_FIXTURES_DIR,
      });
      expect(result.errors).toHaveLength(0);
      expect(result.corpus).toHaveLength(1);
      expect(result.familyInfo).toBeDefined();
      expect(result.familyInfo!.role).toBe('primary');
    });

    it('should build corpus from 028 with holdout warning', () => {
      const result = replayCorpus.buildCorpus('028', {
        fixturesDir: REPLAY_FIXTURES_DIR,
      });
      expect(result.errors).toHaveLength(0);
      expect(result.corpus).toHaveLength(1);
      expect(result.warnings.some((w: string) => w.includes('holdout'))).toBe(true);
    });

    it('should reject 042 corpus building', () => {
      const result = replayCorpus.buildCorpus('042', {
        fixturesDir: REPLAY_FIXTURES_DIR,
      });
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors.some((e: string) => e.includes('042'))).toBe(true);
      expect(result.corpus).toHaveLength(0);
    });

    it('should reject unknown packet family', () => {
      const result = replayCorpus.buildCorpus('999', {
        fixturesDir: REPLAY_FIXTURES_DIR,
      });
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.familyInfo).toBeNull();
    });

    it('should build corpus from raw JSONL content', () => {
      const content = fs.readFileSync(
        path.join(FIXTURES_DIR, 'sample-040-corpus.jsonl'),
        'utf8',
      );
      const result = replayCorpus.buildCorpus('040', {
        jsonlContent: content,
        sourceRunId: 'test-run-1',
      });
      expect(result.errors).toHaveLength(0);
      expect(result.corpus).toHaveLength(1);
      const entry = result.corpus[0] as Record<string, any>;
      expect(entry.id).toBe('040-test-run-1');
    });

    it('should warn when graph metrics are unavailable (REQ-009)', () => {
      const content = fs.readFileSync(
        path.join(FIXTURES_DIR, 'sample-040-corpus.jsonl'),
        'utf8',
      );
      const result = replayCorpus.buildCorpus('040', {
        jsonlContent: content,
      });
      // Our sample data does not have graphCoverage, so expect warning
      expect(result.warnings.some((w: string) => w.includes('graph metrics unavailable'))).toBe(true);
    });

    it('should error when no input source is provided', () => {
      const result = replayCorpus.buildCorpus('040', {});
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors.some((e: string) => e.includes('fixturesDir'))).toBe(true);
    });
  });

  describe('saveCorpus / loadCorpus', () => {
    it('should round-trip corpus through disk', () => {
      const corpus = [
        {
          id: '040-test',
          packetFamily: '040',
          sourceRun: 'test',
          config: { maxIterations: 7 },
          iterations: [{ run: 1 }],
          stopOutcome: { stopReason: 'converged' },
        },
      ];
      const tmpPath = path.join(
        process.env.TMPDIR || '/tmp',
        `corpus-test-${Date.now()}.json`,
      );

      try {
        replayCorpus.saveCorpus(corpus, tmpPath);
        expect(fs.existsSync(tmpPath)).toBe(true);
        const loaded = replayCorpus.loadCorpus(tmpPath);
        expect(loaded).toEqual(corpus);
      } finally {
        if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath);
      }
    });

    it('should throw on missing corpus file', () => {
      expect(() => replayCorpus.loadCorpus('/nonexistent/path.json')).toThrow();
    });
  });

  describe('P1-1: deterministic timestamps', () => {
    it('should use provided timestamp in extractCorpusEntry', () => {
      const records = [
        { type: 'config', maxIterations: 7 },
        { type: 'iteration', run: 1, status: 'complete' },
        { type: 'event', event: 'synthesis_complete', stopReason: 'converged', totalIterations: 1 },
      ];
      const fixedTime = '2026-01-01T00:00:00.000Z';
      const entry = replayCorpus.extractCorpusEntry(records, '040', 'run-1', { timestamp: fixedTime });
      expect(entry.metadata.extractedAt).toBe(fixedTime);
    });

    it('should default to current time when no timestamp override', () => {
      const records = [
        { type: 'config', maxIterations: 7 },
        { type: 'iteration', run: 1, status: 'complete' },
        { type: 'event', event: 'synthesis_complete', stopReason: 'converged', totalIterations: 1 },
      ];
      const before = new Date().toISOString();
      const entry = replayCorpus.extractCorpusEntry(records, '040', 'run-1');
      const after = new Date().toISOString();
      expect(entry.metadata.extractedAt >= before).toBe(true);
      expect(entry.metadata.extractedAt <= after).toBe(true);
    });

    it('should pass timestamp through buildCorpus to extractCorpusEntry', () => {
      const content = '{"type":"config","maxIterations":7}\n{"type":"iteration","run":1,"status":"complete"}\n{"type":"event","event":"synthesis_complete","stopReason":"converged","totalIterations":1}\n';
      const fixedTime = '2025-06-15T12:00:00.000Z';
      const result = replayCorpus.buildCorpus('040', {
        jsonlContent: content,
        sourceRunId: 'ts-test',
        timestamp: fixedTime,
      });
      expect(result.errors).toHaveLength(0);
      expect(result.corpus).toHaveLength(1);
      expect(result.corpus[0].metadata.extractedAt).toBe(fixedTime);
    });
  });

  describe('P1-3: last terminal event wins', () => {
    it('should use the LAST terminal event, not the first', () => {
      const records = [
        { type: 'config', maxIterations: 10 },
        { type: 'iteration', run: 1, status: 'complete' },
        { type: 'event', event: 'stop_decision', stopReason: 'early_stop', totalIterations: 1 },
        { type: 'iteration', run: 2, status: 'complete' },
        { type: 'event', event: 'synthesis_complete', stopReason: 'converged', totalIterations: 2, verdict: 'complete' },
      ];
      const entry = replayCorpus.extractCorpusEntry(records, '040', 'run-multi');
      expect(entry.stopOutcome.stopReason).toBe('converged');
      expect(entry.stopOutcome.verdict).toBe('complete');
      expect(entry.stopOutcome.totalIterations).toBe(2);
    });

    it('should not pick an intermediate stop_decision over a later synthesis_complete', () => {
      const records = [
        { type: 'config' },
        { type: 'iteration', run: 1, status: 'running' },
        { type: 'event', event: 'stop_decision', stopReason: 'stuck', totalIterations: 1, verdict: null },
        { type: 'iteration', run: 2, status: 'running' },
        { type: 'iteration', run: 3, status: 'running' },
        { type: 'event', event: 'synthesis_complete', stopReason: 'natural', totalIterations: 3, verdict: 'synthesized' },
      ];
      const entry = replayCorpus.extractCorpusEntry(records, '040', 'run-fix');
      expect(entry.stopOutcome.stopReason).toBe('natural');
      expect(entry.stopOutcome.verdict).toBe('synthesized');
    });
  });

  describe('P1-4: corrupted JSONL rejection', () => {
    it('should reject traces where >20% of lines are malformed', () => {
      // 5 lines total, 2 valid, 3 malformed = 60% malformed
      const content = '{"type":"config"}\nBAD1\nBAD2\nBAD3\n{"type":"iteration","run":1}\n';
      const result = replayCorpus.buildCorpus('040', {
        jsonlContent: content,
        sourceRunId: 'bad-trace',
      });
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors.some((e: string) => e.includes('malformed') && e.includes('20%'))).toBe(true);
      expect(result.corpus).toHaveLength(0);
    });

    it('should accept traces with malformed lines under 20% threshold', () => {
      // 10 lines, 1 malformed = 10%
      const lines = [
        '{"type":"config","maxIterations":7}',
        '{"type":"iteration","run":1,"status":"complete"}',
        '{"type":"iteration","run":2,"status":"complete"}',
        '{"type":"iteration","run":3,"status":"complete"}',
        '{"type":"iteration","run":4,"status":"complete"}',
        '{"type":"iteration","run":5,"status":"complete"}',
        '{"type":"iteration","run":6,"status":"complete"}',
        '{"type":"iteration","run":7,"status":"complete"}',
        'MALFORMED_LINE',
        '{"type":"event","event":"synthesis_complete","stopReason":"converged","totalIterations":7}',
      ];
      const result = replayCorpus.buildCorpus('040', {
        jsonlContent: lines.join('\n'),
        sourceRunId: 'ok-trace',
      });
      expect(result.errors).toHaveLength(0);
      expect(result.corpus).toHaveLength(1);
      expect(result.warnings.some((w: string) => w.includes('Skipped 1 malformed'))).toBe(true);
      expect(result.corpus[0].metadata.skippedLines).toHaveLength(1);
    });

    it('should include validationErrors array in corpus entry metadata', () => {
      const content = '{"type":"config","maxIterations":7}\n{"type":"iteration","run":1,"status":"complete"}\n{"type":"event","event":"synthesis_complete","stopReason":"converged","totalIterations":1}\n';
      const result = replayCorpus.buildCorpus('040', {
        jsonlContent: content,
        sourceRunId: 'valid-trace',
      });
      expect(result.corpus).toHaveLength(1);
      expect(result.corpus[0].metadata.validationErrors).toEqual([]);
    });
  });
});
