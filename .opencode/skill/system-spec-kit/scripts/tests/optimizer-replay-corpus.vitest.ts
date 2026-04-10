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
    options?: { fixturesDir?: string; jsonlContent?: string; sourceRunId?: string },
  ) => { corpus: object[]; errors: string[]; warnings: string[]; familyInfo: object | null };
  validateCorpusEntry: (entry: object) => { valid: boolean; errors: string[] };
  extractCorpusEntry: (records: object[], packetFamily: string, sourceRunId: string) => object;
  parseJSONL: (content: string) => object[];
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
      const records = replayCorpus.parseJSONL(content);
      expect(records).toHaveLength(2);
      expect(records[0]).toEqual({ type: 'config', topic: 'test' });
      expect(records[1]).toEqual({ type: 'iteration', run: 1 });
    });

    it('should skip blank lines', () => {
      const content = '{"type":"config"}\n\n{"type":"iteration"}\n\n';
      const records = replayCorpus.parseJSONL(content);
      expect(records).toHaveLength(2);
    });

    it('should skip malformed lines', () => {
      const content = '{"type":"config"}\nnot-json\n{"type":"iteration"}\n';
      const records = replayCorpus.parseJSONL(content);
      expect(records).toHaveLength(2);
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
});
