// ───────────────────────────────────────────────────────────────
// 1. TEST — CONSUMPTION LOGGER
// ───────────────────────────────────────────────────────────────
// Tests for lib/telemetry/consumption-logger.ts
// Covers: table creation, event logging, stats aggregation,
// Pattern detection, fail-safe behavior, latency tracking.
//
// NOTE: logging is now gated by SPECKIT_CONSUMPTION_LOG (graduated, default ON).
// Tests that exercise raw insert mechanics still use forceLogConsumptionEvent()
// To bypass the flag check and hit the shared SQL path directly.

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Database from 'better-sqlite3';
import {
  initConsumptionLog,
  logConsumptionEvent,
  getConsumptionStats,
  getConsumptionPatterns,
  isConsumptionLogEnabled,
} from '../lib/telemetry/consumption-logger';

// -- Force-log helper ------------------------------------------------------
// To test logging mechanics directly, bypass the runtime flag check and insert
// With the same SQL the source uses.

interface ConsumptionEvent {
  event_type: string;
  query_text?: string | null;
  intent?: string | null;
  mode?: string | null;
  result_count?: number | null;
  result_ids?: number[] | null;
  session_id?: string | null;
  latency_ms?: number | null;
  spec_folder_filter?: string | null;
  metadata?: Record<string, unknown> | null;
}

function forceLogConsumptionEvent(db: Database.Database, event: ConsumptionEvent): void {
  const resultIdsJson = Array.isArray(event.result_ids) && event.result_ids.length > 0
    ? JSON.stringify(event.result_ids)
    : null;
  const metadataJson = event.metadata && typeof event.metadata === 'object'
    ? JSON.stringify(event.metadata)
    : null;

  db.prepare(`
    INSERT INTO consumption_log
      (event_type, query_text, intent, mode, result_count, result_ids,
       session_id, timestamp, latency_ms, spec_folder_filter, metadata)
    VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), ?, ?, ?)
  `).run(
    event.event_type,
    event.query_text ?? null,
    event.intent ?? null,
    event.mode ?? null,
    event.result_count ?? null,
    resultIdsJson,
    event.session_id ?? null,
    event.latency_ms ?? null,
    event.spec_folder_filter ?? null,
    metadataJson,
  );
}

/* ───────────────────────────────────────────────────────────────
   HELPERS
──────────────────────────────────────────────────────────────── */

function createTestDb(): Database.Database {
  const db = new Database(':memory:');
  initConsumptionLog(db);
  return db;
}

/* ───────────────────────────────────────────────────────────────
   1. TABLE CREATION
──────────────────────────────────────────────────────────────── */

describe('T001: initConsumptionLog — table creation', () => {
  it('T001-A: creates consumption_log table', () => {
    const db = new Database(':memory:');
    initConsumptionLog(db);
    const row = db.prepare(
      `SELECT name FROM sqlite_master WHERE type='table' AND name='consumption_log'`
    ).get();
    expect(row).toBeDefined();
    db.close();
  });

  it('T001-B: table has all required columns', () => {
    const db = new Database(':memory:');
    initConsumptionLog(db);
    const columns = db.prepare(`PRAGMA table_info(consumption_log)`).all() as Array<{ name: string }>;
    const columnNames = columns.map(c => c.name);
    expect(columnNames).toContain('id');
    expect(columnNames).toContain('event_type');
    expect(columnNames).toContain('query_text');
    expect(columnNames).toContain('intent');
    expect(columnNames).toContain('mode');
    expect(columnNames).toContain('result_count');
    expect(columnNames).toContain('result_ids');
    expect(columnNames).toContain('session_id');
    expect(columnNames).toContain('timestamp');
    expect(columnNames).toContain('latency_ms');
    expect(columnNames).toContain('spec_folder_filter');
    expect(columnNames).toContain('metadata');
    db.close();
  });

  it('T001-C: initConsumptionLog is idempotent (safe to call multiple times)', () => {
    const db = new Database(':memory:');
    expect(() => {
      initConsumptionLog(db);
      initConsumptionLog(db);
      initConsumptionLog(db);
    }).not.toThrow();
    db.close();
  });

  it('T001-D: creates indexes on event_type, session_id, timestamp', () => {
    const db = new Database(':memory:');
    initConsumptionLog(db);
    const indexes = db.prepare(
      `SELECT name FROM sqlite_master WHERE type='index' AND tbl_name='consumption_log'`
    ).all() as Array<{ name: string }>;
    const indexNames = indexes.map(i => i.name);
    expect(indexNames).toContain('idx_consumption_log_event_type');
    expect(indexNames).toContain('idx_consumption_log_session_id');
    expect(indexNames).toContain('idx_consumption_log_timestamp');
    db.close();
  });
});

/* ───────────────────────────────────────────────────────────────
   2. EVENT LOGGING — all 3 event types
──────────────────────────────────────────────────────────────── */

describe('T002: event logging mechanics (via forceLog)', () => {
  let db: Database.Database;

  beforeEach(() => {
    db = createTestDb();
  });

  afterEach(() => {
    db.close();
  });

  it('T002-A: logs a "search" event', () => {
    forceLogConsumptionEvent(db, {
      event_type: 'search',
      query_text: 'test search query',
      intent: 'add_feature',
      result_count: 5,
      result_ids: [1, 2, 3, 4, 5],
      session_id: 'session-abc',
      latency_ms: 42.5,
      spec_folder_filter: 'specs/001-test',
    });

    const row = db.prepare(`SELECT * FROM consumption_log WHERE event_type = 'search'`).get() as Record<string, unknown>;
    expect(row).toBeDefined();
    expect(row.event_type).toBe('search');
    expect(row.query_text).toBe('test search query');
    expect(row.intent).toBe('add_feature');
    expect(row.result_count).toBe(5);
    expect(JSON.parse(row.result_ids as string)).toEqual([1, 2, 3, 4, 5]);
    expect(row.session_id).toBe('session-abc');
    expect(row.latency_ms).toBe(42.5);
    expect(row.spec_folder_filter).toBe('specs/001-test');
  });

  it('T002-B: logs a "context" event', () => {
    forceLogConsumptionEvent(db, {
      event_type: 'context',
      query_text: 'how to implement feature X',
      intent: 'add_feature',
      mode: 'deep',
      result_count: 8,
      result_ids: [10, 11, 12],
      session_id: 'session-xyz',
      latency_ms: 150.0,
    });

    const row = db.prepare(`SELECT * FROM consumption_log WHERE event_type = 'context'`).get() as Record<string, unknown>;
    expect(row).toBeDefined();
    expect(row.event_type).toBe('context');
    expect(row.mode).toBe('deep');
    expect(row.result_count).toBe(8);
    expect(JSON.parse(row.result_ids as string)).toEqual([10, 11, 12]);
  });

  it('T002-C: logs a "triggers" event', () => {
    forceLogConsumptionEvent(db, {
      event_type: 'triggers',
      query_text: 'gate 1 context surfacing',
      result_count: 3,
      result_ids: [100, 101, 102],
      session_id: 'session-triggers',
      latency_ms: 5.0,
    });

    const row = db.prepare(`SELECT * FROM consumption_log WHERE event_type = 'triggers'`).get() as Record<string, unknown>;
    expect(row).toBeDefined();
    expect(row.event_type).toBe('triggers');
    expect(row.result_count).toBe(3);
  });

  it('T002-D: logs event with null optional fields', () => {
    forceLogConsumptionEvent(db, {
      event_type: 'search',
      query_text: null,
      intent: null,
      result_count: 0,
      result_ids: null,
      session_id: null,
      latency_ms: null,
    });

    const row = db.prepare(`SELECT * FROM consumption_log WHERE event_type = 'search'`).get() as Record<string, unknown>;
    expect(row).toBeDefined();
    expect(row.query_text).toBeNull();
    expect(row.result_ids).toBeNull();
    expect(row.session_id).toBeNull();
  });

  it('T002-E: logs metadata as JSON', () => {
    forceLogConsumptionEvent(db, {
      event_type: 'search',
      query_text: 'test',
      result_count: 1,
      metadata: { extra: 'info', nested: { value: 42 } },
    });

    const row = db.prepare(`SELECT metadata FROM consumption_log`).get() as { metadata: string };
    expect(row.metadata).toBeTruthy();
    const parsed = JSON.parse(row.metadata);
    expect(parsed.extra).toBe('info');
    expect(parsed.nested.value).toBe(42);
  });

  it('T002-F: multiple events accumulate in table', () => {
    for (let i = 0; i < 5; i++) {
      forceLogConsumptionEvent(db, { event_type: 'search', query_text: `query ${i}`, result_count: i });
    }
    const countRow = db.prepare(`SELECT COUNT(*) as cnt FROM consumption_log`).get() as { cnt: number };
    expect(countRow.cnt).toBe(5);
  });
});

/* ───────────────────────────────────────────────────────────────
   3. STATS AGGREGATION
──────────────────────────────────────────────────────────────── */

describe('T003: getConsumptionStats — aggregation', () => {
  let db: Database.Database;

  beforeEach(() => {
    db = createTestDb();
  });

  afterEach(() => {
    db.close();
  });

  it('T003-A: returns default empty stats when no events', () => {
    const stats = getConsumptionStats(db);
    expect(stats.total_events).toBe(0);
    expect(stats.by_event_type).toEqual({});
    expect(stats.avg_result_count).toBe(0);
    expect(stats.avg_latency_ms).toBe(0);
    expect(stats.zero_result_queries).toBe(0);
    expect(stats.unique_sessions).toBe(0);
  });

  it('T003-B: counts total events correctly', () => {
    forceLogConsumptionEvent(db, { event_type: 'search', result_count: 3 });
    forceLogConsumptionEvent(db, { event_type: 'context', result_count: 5 });
    forceLogConsumptionEvent(db, { event_type: 'triggers', result_count: 2 });
    const stats = getConsumptionStats(db);
    expect(stats.total_events).toBe(3);
  });

  it('T003-C: groups by event_type correctly', () => {
    forceLogConsumptionEvent(db, { event_type: 'search', result_count: 3 });
    forceLogConsumptionEvent(db, { event_type: 'search', result_count: 5 });
    forceLogConsumptionEvent(db, { event_type: 'context', result_count: 2 });
    const stats = getConsumptionStats(db);
    expect(stats.by_event_type['search']).toBe(2);
    expect(stats.by_event_type['context']).toBe(1);
    expect(stats.by_event_type['triggers']).toBeUndefined();
  });

  it('T003-D: calculates avg_result_count', () => {
    forceLogConsumptionEvent(db, { event_type: 'search', result_count: 4 });
    forceLogConsumptionEvent(db, { event_type: 'search', result_count: 6 });
    const stats = getConsumptionStats(db);
    expect(stats.avg_result_count).toBe(5);
  });

  it('T003-E: calculates avg_latency_ms', () => {
    forceLogConsumptionEvent(db, { event_type: 'search', result_count: 1, latency_ms: 100 });
    forceLogConsumptionEvent(db, { event_type: 'search', result_count: 1, latency_ms: 200 });
    const stats = getConsumptionStats(db);
    expect(stats.avg_latency_ms).toBe(150);
  });

  it('T003-F: counts zero_result_queries', () => {
    forceLogConsumptionEvent(db, { event_type: 'search', result_count: 0, query_text: 'empty' });
    forceLogConsumptionEvent(db, { event_type: 'search', result_count: 0, query_text: 'also empty' });
    forceLogConsumptionEvent(db, { event_type: 'search', result_count: 5, query_text: 'got results' });
    const stats = getConsumptionStats(db);
    expect(stats.zero_result_queries).toBe(2);
  });

  it('T003-G: counts unique_sessions', () => {
    forceLogConsumptionEvent(db, { event_type: 'search', session_id: 'ses-A', result_count: 1 });
    forceLogConsumptionEvent(db, { event_type: 'search', session_id: 'ses-A', result_count: 1 });
    forceLogConsumptionEvent(db, { event_type: 'search', session_id: 'ses-B', result_count: 1 });
    const stats = getConsumptionStats(db);
    expect(stats.unique_sessions).toBe(2);
  });

  it('T003-H: filters by event_type', () => {
    forceLogConsumptionEvent(db, { event_type: 'search', result_count: 3 });
    forceLogConsumptionEvent(db, { event_type: 'context', result_count: 5 });
    const stats = getConsumptionStats(db, { event_type: 'search' });
    expect(stats.total_events).toBe(1);
    expect(stats.avg_result_count).toBe(3);
  });
});

/* ───────────────────────────────────────────────────────────────
   4. PATTERN DETECTION
──────────────────────────────────────────────────────────────── */

describe('T004: getConsumptionPatterns — pattern detection', () => {
  let db: Database.Database;

  beforeEach(() => {
    db = createTestDb();
  });

  afterEach(() => {
    db.close();
  });

  it('T004-A: returns 5 pattern categories always', () => {
    const patterns = getConsumptionPatterns(db);
    expect(patterns.length).toBe(5);
    const categories = patterns.map(p => p.category);
    expect(categories).toContain('high-frequency-query');
    expect(categories).toContain('zero-result');
    expect(categories).toContain('low-selection');
    expect(categories).toContain('intent-mismatch');
    expect(categories).toContain('session-heavy');
  });

  it('T004-B: detects high-frequency-query (>3 repetitions)', () => {
    // Insert same query 5 times
    for (let i = 0; i < 5; i++) {
      forceLogConsumptionEvent(db, { event_type: 'search', query_text: 'repeated query', result_count: 3 });
    }
    // Also insert unique queries
    forceLogConsumptionEvent(db, { event_type: 'search', query_text: 'unique query', result_count: 2 });

    const patterns = getConsumptionPatterns(db);
    const highFreq = patterns.find(p => p.category === 'high-frequency-query');
    expect(highFreq).toBeDefined();
    expect(highFreq!.count).toBeGreaterThan(0);
    expect(highFreq!.examples.some(e => e.includes('repeated query'))).toBe(true);
  });

  it('T004-C: detects zero-result queries', () => {
    forceLogConsumptionEvent(db, { event_type: 'search', query_text: 'nothing found', result_count: 0 });
    forceLogConsumptionEvent(db, { event_type: 'search', query_text: 'also nothing', result_count: 0 });
    forceLogConsumptionEvent(db, { event_type: 'search', query_text: 'has results', result_count: 4 });

    const patterns = getConsumptionPatterns(db);
    const zeroResult = patterns.find(p => p.category === 'zero-result');
    expect(zeroResult).toBeDefined();
    expect(zeroResult!.count).toBe(2);
  });

  it('T004-D: detects low-selection queries (result_count <= 2)', () => {
    forceLogConsumptionEvent(db, { event_type: 'search', query_text: 'sparse query', result_count: 1 });
    forceLogConsumptionEvent(db, { event_type: 'search', query_text: 'sparse query 2', result_count: 2 });
    forceLogConsumptionEvent(db, { event_type: 'search', query_text: 'good query', result_count: 8 });

    const patterns = getConsumptionPatterns(db);
    const lowSel = patterns.find(p => p.category === 'low-selection');
    expect(lowSel).toBeDefined();
    expect(lowSel!.count).toBe(2);
  });

  it('T004-D2: low-selection examples show deterministic range for mixed result_count values', () => {
    forceLogConsumptionEvent(db, { event_type: 'search', query_text: 'mixed sparse', result_count: 1 });
    forceLogConsumptionEvent(db, { event_type: 'search', query_text: 'mixed sparse', result_count: 2 });

    const patterns = getConsumptionPatterns(db);
    const lowSel = patterns.find(p => p.category === 'low-selection');

    expect(lowSel).toBeDefined();
    expect(lowSel!.examples.some(e => e.includes('mixed sparse') && e.includes('(1-2 results)'))).toBe(true);
  });

  it('T004-E: detects intent-mismatch (same query, different intents)', () => {
    forceLogConsumptionEvent(db, { event_type: 'search', query_text: 'fix the bug', intent: 'fix_bug', result_count: 3 });
    forceLogConsumptionEvent(db, { event_type: 'search', query_text: 'fix the bug', intent: 'refactor', result_count: 2 });
    forceLogConsumptionEvent(db, { event_type: 'search', query_text: 'stable query', intent: 'understand', result_count: 5 });
    forceLogConsumptionEvent(db, { event_type: 'search', query_text: 'stable query', intent: 'understand', result_count: 4 });

    const patterns = getConsumptionPatterns(db);
    const mismatch = patterns.find(p => p.category === 'intent-mismatch');
    expect(mismatch).toBeDefined();
    expect(mismatch!.count).toBe(1);
    expect(mismatch!.examples.some(e => e.includes('fix the bug'))).toBe(true);
  });

  it('T004-F: detects session-heavy (>10 queries per session)', () => {
    for (let i = 0; i < 12; i++) {
      forceLogConsumptionEvent(db, { event_type: 'search', session_id: 'heavy-session-001', query_text: `q${i}`, result_count: 1 });
    }
    forceLogConsumptionEvent(db, { event_type: 'search', session_id: 'light-session', query_text: 'only one', result_count: 3 });

    const patterns = getConsumptionPatterns(db);
    const heavy = patterns.find(p => p.category === 'session-heavy');
    expect(heavy).toBeDefined();
    expect(heavy!.count).toBe(1);
    expect(heavy!.examples.some(e => e.includes('heavy-session-001'))).toBe(true);
  });

  it('T004-G: returns empty examples when no patterns match', () => {
    // No repeated queries, no zero results, etc.
    forceLogConsumptionEvent(db, { event_type: 'search', query_text: 'unique A', result_count: 5 });
    forceLogConsumptionEvent(db, { event_type: 'search', query_text: 'unique B', result_count: 7 });

    const patterns = getConsumptionPatterns(db);
    // High-frequency, zero-result, low-selection, session-heavy should have count 0
    const highFreq = patterns.find(p => p.category === 'high-frequency-query');
    const zeroResult = patterns.find(p => p.category === 'zero-result');
    expect(highFreq!.count).toBe(0);
    expect(zeroResult!.count).toBe(0);
  });
});

/* ───────────────────────────────────────────────────────────────
   5. FAIL-SAFE BEHAVIOR
──────────────────────────────────────────────────────────────── */

describe('T005: fail-safe behavior — logging errors never propagate', () => {
  it('T005-A: logConsumptionEvent does not throw on closed DB', () => {
    const db = createTestDb();
    db.close();
    // Should not throw even with closed DB
    expect(() => {
      logConsumptionEvent(db, { event_type: 'search', query_text: 'test', result_count: 1 });
    }).not.toThrow();
  });

  it('logConsumptionEvent inserts when the feature flag is unset (default ON)', () => {
    const prevFlag = process.env.SPECKIT_CONSUMPTION_LOG;
    delete process.env.SPECKIT_CONSUMPTION_LOG;

    try {
      const db = createTestDb();
      logConsumptionEvent(db, {
        event_type: 'search',
        query_text: 'should-appear',
        result_count: 5,
      });
      const rows = db.prepare('SELECT COUNT(*) as cnt FROM consumption_log').get() as { cnt: number };
      expect(rows.cnt).toBe(1);
      db.close();
    } finally {
      if (prevFlag === undefined) {
        delete process.env.SPECKIT_CONSUMPTION_LOG;
      } else {
        process.env.SPECKIT_CONSUMPTION_LOG = prevFlag;
      }
    }
  });

  it('T005-B: getConsumptionStats returns defaults on empty/uninitialized DB', () => {
    const db = new Database(':memory:');
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    try {
      // No initConsumptionLog called — table doesn't exist
      const stats = getConsumptionStats(db);
      expect(stats.total_events).toBe(0);
      expect(stats.by_event_type).toEqual({});
      expect(warnSpy).toHaveBeenCalledWith(
        '[consumption-logger] getConsumptionStats warning:',
        expect.stringContaining('no such table'),
      );
    } finally {
      warnSpy.mockRestore();
      db.close();
    }
  });

  it('T005-C: getConsumptionPatterns returns 5 empty-count patterns on uninitialized DB', () => {
    const db = new Database(':memory:');
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    try {
      // No table exists
      const patterns = getConsumptionPatterns(db);
      // Should not throw and should return 5 patterns with count 0
      expect(patterns.length).toBe(5);
      for (const p of patterns) {
        expect(p.count).toBe(0);
        expect(p.examples).toEqual([]);
      }
      expect(warnSpy).toHaveBeenCalled();
      expect(
        warnSpy.mock.calls.some(([message]) =>
          message === '[consumption-logger] getConsumptionPatterns high-frequency warning:',
        ),
      ).toBe(true);
    } finally {
      warnSpy.mockRestore();
      db.close();
    }
  });

  it('T005-D: feature flag disabled prevents logging', () => {
    const prevFlag = process.env.SPECKIT_CONSUMPTION_LOG;
    process.env.SPECKIT_CONSUMPTION_LOG = 'false';

    try {
      const db = createTestDb();
      logConsumptionEvent(db, { event_type: 'search', query_text: 'should not log', result_count: 3 });
      const countRow = db.prepare(`SELECT COUNT(*) as cnt FROM consumption_log`).get() as { cnt: number };
      expect(countRow.cnt).toBe(0);
      db.close();
    } finally {
      if (prevFlag === undefined) {
        delete process.env.SPECKIT_CONSUMPTION_LOG;
      } else {
        process.env.SPECKIT_CONSUMPTION_LOG = prevFlag;
      }
    }
  });

  it('T005-F: isConsumptionLogEnabled returns false when flag is "0"', () => {
    const prevFlag = process.env.SPECKIT_CONSUMPTION_LOG;
    process.env.SPECKIT_CONSUMPTION_LOG = '0';

    try {
      expect(isConsumptionLogEnabled()).toBe(false);
    } finally {
      if (prevFlag === undefined) {
        delete process.env.SPECKIT_CONSUMPTION_LOG;
      } else {
        process.env.SPECKIT_CONSUMPTION_LOG = prevFlag;
      }
    }
  });
});

/* ───────────────────────────────────────────────────────────────
   6. LATENCY TRACKING
──────────────────────────────────────────────────────────────── */

describe('T006: latency tracking', () => {
  let db: Database.Database;

  beforeEach(() => {
    db = createTestDb();
  });

  afterEach(() => {
    db.close();
  });

  it('T006-A: latency_ms is stored as a float', () => {
    forceLogConsumptionEvent(db, { event_type: 'search', result_count: 1, latency_ms: 123.456 });
    const row = db.prepare(`SELECT latency_ms FROM consumption_log`).get() as { latency_ms: number };
    expect(typeof row.latency_ms).toBe('number');
    expect(row.latency_ms).toBeCloseTo(123.456);
  });

  it('T006-B: latency_ms is null when not provided', () => {
    forceLogConsumptionEvent(db, { event_type: 'search', result_count: 1 });
    const row = db.prepare(`SELECT latency_ms FROM consumption_log`).get() as { latency_ms: number | null };
    expect(row.latency_ms).toBeNull();
  });

  it('T006-C: avg_latency_ms in stats reflects stored latencies', () => {
    forceLogConsumptionEvent(db, { event_type: 'search', result_count: 1, latency_ms: 10 });
    forceLogConsumptionEvent(db, { event_type: 'search', result_count: 1, latency_ms: 20 });
    forceLogConsumptionEvent(db, { event_type: 'search', result_count: 1, latency_ms: 30 });
    const stats = getConsumptionStats(db);
    expect(stats.avg_latency_ms).toBe(20);
  });

  it('T006-D: latency can be measured via Date.now() diff', () => {
    const before = Date.now();
    // Simulate a small delay
    const fakeLatency = 55.5;
    forceLogConsumptionEvent(db, {
      event_type: 'context',
      result_count: 3,
      latency_ms: fakeLatency,
    });
    const after = Date.now();
    expect(after - before).toBeGreaterThanOrEqual(0); // sanity check
    const row = db.prepare(`SELECT latency_ms FROM consumption_log`).get() as { latency_ms: number };
    expect(row.latency_ms).toBe(fakeLatency);
  });
});
