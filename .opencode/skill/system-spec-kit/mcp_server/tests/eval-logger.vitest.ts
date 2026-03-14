// ───────────────────────────────────────────────────────────────
// 1. TEST — EVAL LOGGER
// ───────────────────────────────────────────────────────────────
// Verifies that logSearchQuery, logChannelResult, and
// LogFinalResult correctly insert records into the eval DB,
// Are no-ops when SPECKIT_EVAL_LOGGING=false, and never throw.
//
// Verifies that enabling SPECKIT_EVAL_LOGGING does not add
// More than 10% overhead to the core logging operations
// (observer-effect mitigation benchmark).

import { describe, it, expect, beforeAll, afterAll, beforeEach, afterEach, vi } from 'vitest';
import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs';
import { initEvalDb, getEvalDb, closeEvalDb } from '../lib/eval/eval-db';
import {
  isEvalLoggingEnabled,
  generateEvalRunId,
  logSearchQuery,
  logChannelResult,
  logFinalResult,
} from '../lib/eval/eval-logger';

/* ───────────────────────────────────────────────────────────────
   HELPERS
──────────────────────────────────────────────────────────────── */

let testDataDir: string;

/** Force-set the env var and return a cleanup function. */
function setEvalLogging(value: string): () => void {
  const prev = process.env.SPECKIT_EVAL_LOGGING;
  process.env.SPECKIT_EVAL_LOGGING = value;
  return () => {
    if (prev === undefined) {
      delete process.env.SPECKIT_EVAL_LOGGING;
    } else {
      process.env.SPECKIT_EVAL_LOGGING = prev;
    }
  };
}

/** Row count for a given table. */
function rowCount(table: string): number {
  const db = getEvalDb();
  const result = db.prepare(`SELECT COUNT(*) as n FROM ${table}`).get() as { n: number };
  return result.n;
}

/* ───────────────────────────────────────────────────────────────
   SETUP / TEARDOWN
──────────────────────────────────────────────────────────────── */

beforeAll(() => {
  testDataDir = path.join(os.tmpdir(), `eval-logger-test-${Date.now()}`);
  fs.mkdirSync(testDataDir, { recursive: true });

  // Point the eval DB to our isolated test directory
  process.env.SPEC_KIT_DB_DIR = testDataDir;

  // Initialise DB so singleton is ready
  initEvalDb(testDataDir);
});

afterAll(() => {
  closeEvalDb();
  delete process.env.SPEC_KIT_DB_DIR;

  if (testDataDir && fs.existsSync(testDataDir)) {
    try {
      fs.rmSync(testDataDir, { recursive: true, force: true });
    } catch {
      // Ignore
    }
  }
});

/* ───────────────────────────────────────────────────────────────
   T005 TESTS
──────────────────────────────────────────────────────────────── */

describe('T005: Eval Logger', () => {

  /* ───────────────────────────────────────────────────────────────
     Feature flag
  ──────────────────────────────────────────────────────────────── */
  describe('Feature flag: SPECKIT_EVAL_LOGGING', () => {
    it('T005-1: isEvalLoggingEnabled returns false when env var is absent', () => {
      const restore = setEvalLogging('');
      // Empty string is not "true"
      expect(isEvalLoggingEnabled()).toBe(false);
      restore();
    });

    it('T005-2: isEvalLoggingEnabled returns false when env var is "false"', () => {
      const restore = setEvalLogging('false');
      expect(isEvalLoggingEnabled()).toBe(false);
      restore();
    });

    it('T005-3: isEvalLoggingEnabled returns true when env var is "true"', () => {
      const restore = setEvalLogging('true');
      expect(isEvalLoggingEnabled()).toBe(true);
      restore();
    });

    it('T005-4: isEvalLoggingEnabled is case-insensitive ("TRUE")', () => {
      const restore = setEvalLogging('TRUE');
      expect(isEvalLoggingEnabled()).toBe(true);
      restore();
    });
  });

  /* ───────────────────────────────────────────────────────────────
     No-op when disabled
  ──────────────────────────────────────────────────────────────── */
  describe('No-op behaviour when logging is disabled', () => {
    it('T005-5: logSearchQuery is a no-op when SPECKIT_EVAL_LOGGING=false', () => {
      const restore = setEvalLogging('false');
      const before = rowCount('eval_queries');
      const result = logSearchQuery({ query: 'should not be inserted', intent: 'understand' });
      const after = rowCount('eval_queries');
      restore();

      expect(result).toEqual({ queryId: 0, evalRunId: 0 });
      expect(after).toBe(before); // no new row
    });

    it('T005-6: logChannelResult is a no-op when SPECKIT_EVAL_LOGGING=false', () => {
      const restore = setEvalLogging('false');
      const before = rowCount('eval_channel_results');
      logChannelResult({ evalRunId: 1, queryId: 1, channel: 'vector' });
      const after = rowCount('eval_channel_results');
      restore();

      expect(after).toBe(before);
    });

    it('T005-7: logFinalResult is a no-op when SPECKIT_EVAL_LOGGING=false', () => {
      const restore = setEvalLogging('false');
      const before = rowCount('eval_final_results');
      logFinalResult({ evalRunId: 1, queryId: 1 });
      const after = rowCount('eval_final_results');
      restore();

      expect(after).toBe(before);
    });
  });

  /* ───────────────────────────────────────────────────────────────
     Insertion when enabled
  ──────────────────────────────────────────────────────────────── */
  describe('DB insertion when logging is enabled', () => {
    it('T005-8: logSearchQuery inserts a row into eval_queries', () => {
      const restore = setEvalLogging('true');
      const result = logSearchQuery({
        query: 'hybrid search for memory retrieval',
        intent: 'add_feature',
        specFolder: 'specs/001-test',
      });
      restore();

      // Verify returned IDs are valid (non-zero)
      expect(result.queryId).toBeGreaterThan(0);
      expect(result.evalRunId).toBeGreaterThan(0);

      // Verify the row was actually inserted by fetching it by ID
      const db = getEvalDb();
      const row = db.prepare('SELECT id FROM eval_queries WHERE id = ?').get(result.queryId) as { id: number } | undefined;
      expect(row).toBeDefined();
      expect(row!.id).toBe(result.queryId);
    });

    it('T005-9: logSearchQuery stores query text correctly', () => {
      const restore = setEvalLogging('true');
      const { queryId } = logSearchQuery({ query: 'unique-query-text-T005-9', intent: null });
      const db = getEvalDb();
      const row = db.prepare('SELECT * FROM eval_queries WHERE id = ?').get(queryId) as Record<string, unknown>;
      restore();

      expect(row).toBeDefined();
      expect(row.query).toBe('unique-query-text-T005-9');
      expect(row.intent).toBeNull();
    });

    it('T005-9b: logSearchQuery uses queryId as evalRunId for cross-process-safe correlation', () => {
      const restore = setEvalLogging('true');
      const { queryId, evalRunId } = logSearchQuery({ query: 'run-id-from-query-id' });
      restore();

      expect(evalRunId).toBe(queryId);
    });

    it('T005-10: logChannelResult inserts a row into eval_channel_results', () => {
      const restore = setEvalLogging('true');
      const { queryId, evalRunId } = logSearchQuery({ query: 'channel-log-test-T005-10' });
      logChannelResult({
        evalRunId,
        queryId,
        channel: 'bm25',
        resultMemoryIds: [1, 2, 3],
        scores: [0.9, 0.7, 0.5],
        latencyMs: 42,
        hitCount: 3,
      });
      restore();

      // Verify row inserted by querying by the unique run+query ID
      const db = getEvalDb();
      const row = db.prepare(
        'SELECT id FROM eval_channel_results WHERE eval_run_id = ? AND query_id = ? AND channel = ?'
      ).get(evalRunId, queryId, 'bm25') as { id: number } | undefined;
      expect(row).toBeDefined();
    });

    it('T005-11: logChannelResult stores serialised memory IDs', () => {
      const restore = setEvalLogging('true');
      const { queryId, evalRunId } = logSearchQuery({ query: 'ids-serialisation-test' });
      logChannelResult({
        evalRunId,
        queryId,
        channel: 'vector',
        resultMemoryIds: [10, 20, 30],
        scores: [1.0, 0.8, 0.6],
      });
      const db = getEvalDb();
      const row = db.prepare(
        'SELECT * FROM eval_channel_results WHERE eval_run_id = ? AND query_id = ?'
      ).get(evalRunId, queryId) as Record<string, unknown>;
      restore();

      expect(row).toBeDefined();
      expect(JSON.parse(row.result_memory_ids as string)).toEqual([10, 20, 30]);
      expect(JSON.parse(row.scores as string)).toEqual([1.0, 0.8, 0.6]);
    });

    it('T005-12: logFinalResult inserts a row into eval_final_results', () => {
      const restore = setEvalLogging('true');
      const { queryId, evalRunId } = logSearchQuery({ query: 'final-result-test-T005-12' });
      logFinalResult({
        evalRunId,
        queryId,
        resultMemoryIds: [5, 6, 7],
        scores: [0.95, 0.85, 0.75],
        fusionMethod: 'rrf',
        latencyMs: 123,
      });
      restore();

      // Verify row inserted by querying by the unique run+query ID
      const db = getEvalDb();
      const row = db.prepare(
        'SELECT id FROM eval_final_results WHERE eval_run_id = ? AND query_id = ?'
      ).get(evalRunId, queryId) as { id: number } | undefined;
      expect(row).toBeDefined();
    });

    it('T005-13: logFinalResult stores fusion_method correctly', () => {
      const restore = setEvalLogging('true');
      const { queryId, evalRunId } = logSearchQuery({ query: 'fusion-method-test' });
      logFinalResult({ evalRunId, queryId, fusionMethod: 'rrf' });
      const db = getEvalDb();
      const row = db.prepare(
        'SELECT fusion_method FROM eval_final_results WHERE eval_run_id = ? AND query_id = ?'
      ).get(evalRunId, queryId) as { fusion_method: string };
      restore();

      expect(row.fusion_method).toBe('rrf');
    });
  });

  /* ───────────────────────────────────────────────────────────────
     eval_run_id consistency
  ──────────────────────────────────────────────────────────────── */
  describe('eval_run_id consistency within a single search invocation', () => {
    it('T005-14: generateEvalRunId returns 0 when logging is disabled', () => {
      const restore = setEvalLogging('false');
      const id = generateEvalRunId();
      restore();
      expect(id).toBe(0);
    });

    it('T005-15: generateEvalRunId returns incrementing values when enabled', () => {
      const restore = setEvalLogging('true');
      const a = generateEvalRunId();
      const b = generateEvalRunId();
      restore();
      expect(b).toBe(a + 1);
    });

    it('T005-16: evalRunId returned by logSearchQuery matches subsequent log calls', () => {
      const restore = setEvalLogging('true');
      const { queryId, evalRunId } = logSearchQuery({ query: 'run-id-consistency' });

      logChannelResult({ evalRunId, queryId, channel: 'vector' });
      logFinalResult({ evalRunId, queryId, fusionMethod: 'rrf' });

      const db = getEvalDb();
      const channelRow = db.prepare(
        'SELECT eval_run_id FROM eval_channel_results WHERE query_id = ? AND channel = ?'
      ).get(queryId, 'vector') as { eval_run_id: number };

      const finalRow = db.prepare(
        'SELECT eval_run_id FROM eval_final_results WHERE query_id = ?'
      ).get(queryId) as { eval_run_id: number };

      restore();

      expect(channelRow.eval_run_id).toBe(evalRunId);
      expect(finalRow.eval_run_id).toBe(evalRunId);
    });
  });

  /* ───────────────────────────────────────────────────────────────
     Fail-safe behaviour
  ──────────────────────────────────────────────────────────────── */
  describe('Fail-safe: logging errors never throw', () => {
    it('T005-17: logSearchQuery does not throw when DB has been closed', () => {
      const restore = setEvalLogging('true');
      // Close the DB to simulate a failure
      closeEvalDb();
      // LogSearchQuery must not throw — it should catch internally and return noop
      expect(() => {
        const r = logSearchQuery({ query: 'should-not-throw' });
        // Result will be the noop sentinel because initEvalDb re-opens OK or fails silently
        // (either way no throw)
        expect(typeof r.queryId).toBe('number');
      }).not.toThrow();

      // Re-open for remaining tests
      initEvalDb(testDataDir);
      restore();
    });

    it('T005-18: logChannelResult does not throw with invalid IDs', () => {
      const restore = setEvalLogging('true');
      expect(() => {
        logChannelResult({ evalRunId: 0, queryId: 0, channel: 'vector' });
      }).not.toThrow();
      restore();
    });

    it('T005-19: logFinalResult does not throw with invalid IDs', () => {
      const restore = setEvalLogging('true');
      expect(() => {
        logFinalResult({ evalRunId: 0, queryId: 0 });
      }).not.toThrow();
      restore();
    });

    it('T005-20: logChannelResult does not throw with undefined optional fields', () => {
      const restore = setEvalLogging('true');
      const { queryId, evalRunId } = logSearchQuery({ query: 'optional-fields-test' });
      expect(() => {
        logChannelResult({ evalRunId, queryId, channel: 'graph' });
      }).not.toThrow();
      restore();
    });
  });
});

/* ───────────────────────────────────────────────────────────────
   T004b TESTS — Observer Effect Mitigation
──────────────────────────────────────────────────────────────── */

describe('T004b: Observer Effect Mitigation', () => {
  /**
   * Measure p95 latency for N iterations of a function.
   * Returns the p95 in milliseconds.
   */
  function measureP95(fn: () => void, iterations: number): number {
    const times: number[] = [];
    for (let i = 0; i < iterations; i++) {
      const t0 = process.hrtime.bigint();
      fn();
      const t1 = process.hrtime.bigint();
      times.push(Number(t1 - t0) / 1_000_000); // ns → ms
    }
    times.sort((a, b) => a - b);
    const p95idx = Math.floor(times.length * 0.95);
    return times[p95idx];
  }

  it('T004b-1: eval logging overhead (p95) is less than 10ms absolute', () => {
    // This is a loose guard: each individual log call should complete in < 10ms on p95.
    // A full end-to-end search takes 100-500ms, so 10ms headroom is well within 10%.

    const ITERATIONS = 200;

    // Control: no-op path (logging disabled)
    const restoreOff = setEvalLogging('false');
    const controlP95 = measureP95(() => {
      logSearchQuery({ query: 'bench query', intent: 'understand' });
    }, ITERATIONS);
    restoreOff();

    // Treatment: logging enabled
    const restoreOn = setEvalLogging('true');
    const treatmentP95 = measureP95(() => {
      const { queryId, evalRunId } = logSearchQuery({ query: 'bench query', intent: 'understand' });
      logChannelResult({ evalRunId, queryId, channel: 'vector', resultMemoryIds: [1, 2, 3], scores: [0.9, 0.8, 0.7] });
      logFinalResult({ evalRunId, queryId, resultMemoryIds: [1, 2, 3], scores: [0.9, 0.8, 0.7] });
    }, ITERATIONS);
    restoreOn();

    // Assert absolute overhead < 10ms on p95
    expect(treatmentP95).toBeLessThan(10);

    // Also assert that the overhead ratio is reasonable
    // (treatment should be < controlP95 + 10ms, accounting for tiny no-op baseline)
    const overhead = treatmentP95 - controlP95;
    expect(overhead).toBeLessThan(10);
  });

  it('T004b-2: disabling SPECKIT_EVAL_LOGGING makes all three functions near-zero cost', () => {
    const ITERATIONS = 500;
    const restoreOff = setEvalLogging('false');

    const p95 = measureP95(() => {
      logSearchQuery({ query: 'noop bench' });
      logChannelResult({ evalRunId: 1, queryId: 1, channel: 'vector' });
      logFinalResult({ evalRunId: 1, queryId: 1 });
    }, ITERATIONS);

    restoreOff();

    // No-op path should be sub-millisecond on p95
    expect(p95).toBeLessThan(1);
  });

  it('T004b-3: observer effect relative overhead does not exceed 10% of a representative search baseline', () => {
    // Simulate a representative "search baseline" time: 50ms (well within real search latency).
    // The logging overhead (treatment - control) must be < 10% of 50ms = 5ms.
    const ITERATIONS = 200;
    const simulatedSearchBaselineMs = 50;
    const maxAllowedOverheadMs = simulatedSearchBaselineMs * 0.10; // 5ms

    const restoreOff = setEvalLogging('false');
    const controlP95 = measureP95(() => {
      logSearchQuery({ query: 'overhead test' });
    }, ITERATIONS);
    restoreOff();

    const restoreOn = setEvalLogging('true');
    const treatmentP95 = measureP95(() => {
      const { queryId, evalRunId } = logSearchQuery({ query: 'overhead test' });
      logChannelResult({ evalRunId, queryId, channel: 'hybrid', resultMemoryIds: [1, 2], scores: [0.9, 0.8] });
      logFinalResult({ evalRunId, queryId, resultMemoryIds: [1, 2], scores: [0.9, 0.8] });
    }, ITERATIONS);
    restoreOn();

    const overhead = Math.max(0, treatmentP95 - controlP95);
    expect(overhead).toBeLessThan(maxAllowedOverheadMs);
  });
});

describe('Eval run counter bootstrap across tables', () => {
  async function bootstrapAndGenerateNextId(
    channelMaxId: number | null,
    finalMaxId: number | null,
  ): Promise<number> {
    const uniqueDir = path.join(
      os.tmpdir(),
      `eval-logger-bootstrap-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    );
    fs.mkdirSync(uniqueDir, { recursive: true });

    const prevDbDir = process.env.SPEC_KIT_DB_DIR;
    const prevLogging = process.env.SPECKIT_EVAL_LOGGING;
    process.env.SPEC_KIT_DB_DIR = uniqueDir;
    process.env.SPECKIT_EVAL_LOGGING = 'true';

    let freshEvalDb: typeof import('../lib/eval/eval-db') | null = null;
    try {
      vi.resetModules();
      freshEvalDb = await import('../lib/eval/eval-db');
      const db = freshEvalDb.initEvalDb(uniqueDir);

      if (channelMaxId !== null) {
        db.prepare(
          'INSERT INTO eval_channel_results (eval_run_id, query_id, channel) VALUES (?, ?, ?)',
        ).run(channelMaxId, 1, 'vector');
      }

      if (finalMaxId !== null) {
        db.prepare(
          'INSERT INTO eval_final_results (eval_run_id, query_id) VALUES (?, ?)',
        ).run(finalMaxId, 1);
      }

      const freshEvalLogger = await import('../lib/eval/eval-logger');
      return freshEvalLogger.generateEvalRunId();
    } finally {
      try {
        freshEvalDb?.closeEvalDb();
      } catch {
        // Ignore close errors in test cleanup.
      }

      if (prevDbDir === undefined) delete process.env.SPEC_KIT_DB_DIR;
      else process.env.SPEC_KIT_DB_DIR = prevDbDir;

      if (prevLogging === undefined) delete process.env.SPECKIT_EVAL_LOGGING;
      else process.env.SPECKIT_EVAL_LOGGING = prevLogging;

      try {
        fs.rmSync(uniqueDir, { recursive: true, force: true });
      } catch {
        // Ignore cleanup errors.
      }
    }
  }

  it('boots from eval_final_results when final max ID is higher than channel max ID', async () => {
    const id = await bootstrapAndGenerateNextId(7, 12);
    expect(id).toBe(13);
  });

  it('boots from eval_channel_results when channel max ID is higher than final max ID', async () => {
    const id = await bootstrapAndGenerateNextId(15, 9);
    expect(id).toBe(16);
  });

  it('starts from zero when both tables are empty', async () => {
    const id = await bootstrapAndGenerateNextId(null, null);
    // Counter bootstraps to 0, then returns incremented first run ID.
    expect(id).toBe(1);
  });
});
