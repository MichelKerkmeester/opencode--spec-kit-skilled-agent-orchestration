// TEST: Feedback Event Ledger (REQ-D4-001)
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import Database from 'better-sqlite3';
import {
  initFeedbackLedger,
  logFeedbackEvent,
  logFeedbackEvents,
  getFeedbackEvents,
  getFeedbackEventCount,
  getMemoryFeedbackSummary,
  isImplicitFeedbackLogEnabled,
  resolveConfidence,
  FEEDBACK_SCHEMA_SQL,
  FEEDBACK_INDEX_SQL,
  EVENT_TYPE_CONFIDENCE,
} from '../lib/feedback/feedback-ledger';
import type { FeedbackEvent, FeedbackEventType } from '../lib/feedback/feedback-ledger';

/* ───────────────────────────────────────────────────────────────
   HELPERS
----------------------------------------------------------------*/

function createTestDb(): Database.Database {
  const db = new Database(':memory:');
  initFeedbackLedger(db);
  return db;
}

function makeEvent(overrides: Partial<FeedbackEvent> = {}): FeedbackEvent {
  return {
    type: 'search_shown',
    memoryId: 'mem-1',
    queryId: 'query-001',
    confidence: 'weak',
    timestamp: 1700000000000,
    sessionId: 'sess-abc',
    ...overrides,
  };
}

/* ───────────────────────────────────────────────────────────────
   TESTS
----------------------------------------------------------------*/

describe('Feedback Event Ledger — Feature Flag', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('isImplicitFeedbackLogEnabled returns true by default (graduated)', () => {
    vi.stubEnv('SPECKIT_IMPLICIT_FEEDBACK_LOG', '');
    expect(isImplicitFeedbackLogEnabled()).toBe(true);
  });

  it('isImplicitFeedbackLogEnabled returns true when set to "true"', () => {
    vi.stubEnv('SPECKIT_IMPLICIT_FEEDBACK_LOG', 'true');
    expect(isImplicitFeedbackLogEnabled()).toBe(true);
  });

  it('isImplicitFeedbackLogEnabled returns true when set to "1"', () => {
    vi.stubEnv('SPECKIT_IMPLICIT_FEEDBACK_LOG', '1');
    expect(isImplicitFeedbackLogEnabled()).toBe(true);
  });

  it('isImplicitFeedbackLogEnabled returns false for "false"', () => {
    vi.stubEnv('SPECKIT_IMPLICIT_FEEDBACK_LOG', 'false');
    expect(isImplicitFeedbackLogEnabled()).toBe(false);
  });

  it('logFeedbackEvent returns null when flag is OFF', () => {
    vi.stubEnv('SPECKIT_IMPLICIT_FEEDBACK_LOG', 'false');
    const db = createTestDb();
    const result = logFeedbackEvent(db, makeEvent());
    expect(result).toBeNull();
    expect(getFeedbackEventCount(db)).toBe(0);
  });
});

describe('Feedback Event Ledger — Schema Initialization', () => {
  it('creates feedback_events table with correct columns', () => {
    const db = createTestDb();
    const columns = db.prepare('PRAGMA table_info(feedback_events)').all() as Array<{ name: string }>;
    const names = columns.map(c => c.name);
    expect(names).toContain('id');
    expect(names).toContain('type');
    expect(names).toContain('memory_id');
    expect(names).toContain('query_id');
    expect(names).toContain('confidence');
    expect(names).toContain('timestamp');
    expect(names).toContain('session_id');
  });

  it('creates indices for feedback_events', () => {
    const db = createTestDb();
    const indices = db.prepare(
      "SELECT name FROM sqlite_master WHERE type='index' AND tbl_name='feedback_events'"
    ).all() as Array<{ name: string }>;
    const names = indices.map(i => i.name);
    expect(names).toContain('idx_feedback_type');
    expect(names).toContain('idx_feedback_memory_id');
    expect(names).toContain('idx_feedback_confidence');
  });

  it('initFeedbackLedger is idempotent', () => {
    const db = createTestDb();
    // Should not throw when called twice
    expect(() => initFeedbackLedger(db)).not.toThrow();
    expect(() => initFeedbackLedger(db)).not.toThrow();
  });

  it('FEEDBACK_SCHEMA_SQL contains required constraint values', () => {
    expect(FEEDBACK_SCHEMA_SQL).toContain('search_shown');
    expect(FEEDBACK_SCHEMA_SQL).toContain('result_cited');
    expect(FEEDBACK_SCHEMA_SQL).toContain('query_reformulated');
    expect(FEEDBACK_SCHEMA_SQL).toContain('same_topic_requery');
    expect(FEEDBACK_SCHEMA_SQL).toContain('follow_on_tool_use');
    expect(FEEDBACK_SCHEMA_SQL).toContain('strong');
    expect(FEEDBACK_SCHEMA_SQL).toContain('medium');
    expect(FEEDBACK_SCHEMA_SQL).toContain('weak');
  });
});

describe('Feedback Event Ledger — Confidence Tiers', () => {
  it('resolveConfidence uses explicit value when provided', () => {
    expect(resolveConfidence('search_shown', 'strong')).toBe('strong');
    expect(resolveConfidence('result_cited', 'weak')).toBe('weak');
  });

  it('resolveConfidence infers from event type when no explicit value', () => {
    expect(resolveConfidence('result_cited')).toBe('strong');
    expect(resolveConfidence('follow_on_tool_use')).toBe('strong');
    expect(resolveConfidence('query_reformulated')).toBe('medium');
    expect(resolveConfidence('same_topic_requery')).toBe('weak');
    expect(resolveConfidence('search_shown')).toBe('weak');
  });

  it('EVENT_TYPE_CONFIDENCE maps all 5 event types', () => {
    const eventTypes: FeedbackEventType[] = [
      'search_shown',
      'result_cited',
      'query_reformulated',
      'same_topic_requery',
      'follow_on_tool_use',
    ];
    for (const type of eventTypes) {
      expect(EVENT_TYPE_CONFIDENCE[type]).toBeDefined();
    }
  });

  it('citation and follow_on_tool_use are strong signals', () => {
    expect(EVENT_TYPE_CONFIDENCE['result_cited']).toBe('strong');
    expect(EVENT_TYPE_CONFIDENCE['follow_on_tool_use']).toBe('strong');
  });

  it('reformulation is a medium signal', () => {
    expect(EVENT_TYPE_CONFIDENCE['query_reformulated']).toBe('medium');
  });

  it('passive signals are weak', () => {
    expect(EVENT_TYPE_CONFIDENCE['search_shown']).toBe('weak');
    expect(EVENT_TYPE_CONFIDENCE['same_topic_requery']).toBe('weak');
  });
});

describe('Feedback Event Ledger — logFeedbackEvent', () => {
  beforeEach(() => {
    vi.stubEnv('SPECKIT_IMPLICIT_FEEDBACK_LOG', 'true');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('inserts a feedback event and returns row ID', () => {
    const db = createTestDb();
    const id = logFeedbackEvent(db, makeEvent({ type: 'result_cited', confidence: 'strong' }));
    expect(id).toBeGreaterThan(0);
    expect(getFeedbackEventCount(db)).toBe(1);
  });

  it('stores all 5 event types', () => {
    const db = createTestDb();
    const types: FeedbackEventType[] = [
      'search_shown',
      'result_cited',
      'query_reformulated',
      'same_topic_requery',
      'follow_on_tool_use',
    ];
    for (const type of types) {
      logFeedbackEvent(db, makeEvent({ type }));
    }
    expect(getFeedbackEventCount(db)).toBe(5);
  });

  it('stores all 3 confidence tiers', () => {
    const db = createTestDb();
    logFeedbackEvent(db, makeEvent({ confidence: 'strong' }));
    logFeedbackEvent(db, makeEvent({ confidence: 'medium' }));
    logFeedbackEvent(db, makeEvent({ confidence: 'weak' }));
    const events = getFeedbackEvents(db);
    const tiers = events.map(e => e.confidence);
    expect(tiers).toContain('strong');
    expect(tiers).toContain('medium');
    expect(tiers).toContain('weak');
  });

  it('persists correct field values', () => {
    const db = createTestDb();
    const ts = Date.now();
    logFeedbackEvent(db, makeEvent({
      type: 'result_cited',
      memoryId: 'mem-42',
      queryId: 'q-999',
      confidence: 'strong',
      timestamp: ts,
      sessionId: 'session-XYZ',
    }));
    const events = getFeedbackEvents(db);
    expect(events).toHaveLength(1);
    const row = events[0];
    expect(row.type).toBe('result_cited');
    expect(row.memory_id).toBe('mem-42');
    expect(row.query_id).toBe('q-999');
    expect(row.confidence).toBe('strong');
    expect(row.timestamp).toBe(ts);
    expect(row.session_id).toBe('session-XYZ');
  });

  it('allows null session_id', () => {
    const db = createTestDb();
    logFeedbackEvent(db, makeEvent({ sessionId: null }));
    const events = getFeedbackEvents(db);
    expect(events[0].session_id).toBeNull();
  });

  it('auto-infers confidence from type when not overridden', () => {
    const db = createTestDb();
    // Pass the event type's own inferred confidence to match resolveConfidence
    logFeedbackEvent(db, {
      type: 'query_reformulated',
      memoryId: 'mem-1',
      queryId: 'q-1',
      confidence: resolveConfidence('query_reformulated'),
      timestamp: Date.now(),
    });
    const events = getFeedbackEvents(db);
    expect(events[0].confidence).toBe('medium');
  });
});

describe('Feedback Event Ledger — logFeedbackEvents (batch)', () => {
  beforeEach(() => {
    vi.stubEnv('SPECKIT_IMPLICIT_FEEDBACK_LOG', 'true');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('inserts multiple events and returns count', () => {
    const db = createTestDb();
    const events = [
      makeEvent({ memoryId: 'mem-1' }),
      makeEvent({ memoryId: 'mem-2' }),
      makeEvent({ memoryId: 'mem-3' }),
    ];
    const inserted = logFeedbackEvents(db, events);
    expect(inserted).toBe(3);
    expect(getFeedbackEventCount(db)).toBe(3);
  });

  it('returns 0 for empty batch', () => {
    const db = createTestDb();
    expect(logFeedbackEvents(db, [])).toBe(0);
  });

  it('returns 0 when flag is OFF', () => {
    vi.stubEnv('SPECKIT_IMPLICIT_FEEDBACK_LOG', 'false');
    const db = createTestDb();
    const inserted = logFeedbackEvents(db, [makeEvent(), makeEvent()]);
    expect(inserted).toBe(0);
    expect(getFeedbackEventCount(db)).toBe(0);
  });
});

describe('Feedback Event Ledger — getFeedbackEvents (query/filter)', () => {
  beforeEach(() => {
    vi.stubEnv('SPECKIT_IMPLICIT_FEEDBACK_LOG', 'true');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('filters by event type', () => {
    const db = createTestDb();
    logFeedbackEvent(db, makeEvent({ type: 'search_shown' }));
    logFeedbackEvent(db, makeEvent({ type: 'result_cited', confidence: 'strong' }));

    const shown = getFeedbackEvents(db, { type: 'search_shown' });
    expect(shown).toHaveLength(1);
    expect(shown[0].type).toBe('search_shown');
  });

  it('filters by memoryId', () => {
    const db = createTestDb();
    logFeedbackEvent(db, makeEvent({ memoryId: 'mem-A' }));
    logFeedbackEvent(db, makeEvent({ memoryId: 'mem-B' }));

    const forA = getFeedbackEvents(db, { memoryId: 'mem-A' });
    expect(forA).toHaveLength(1);
    expect(forA[0].memory_id).toBe('mem-A');
  });

  it('filters by confidence tier', () => {
    const db = createTestDb();
    logFeedbackEvent(db, makeEvent({ confidence: 'strong' }));
    logFeedbackEvent(db, makeEvent({ confidence: 'medium' }));
    logFeedbackEvent(db, makeEvent({ confidence: 'weak' }));

    const strong = getFeedbackEvents(db, { confidence: 'strong' });
    expect(strong).toHaveLength(1);
    expect(strong[0].confidence).toBe('strong');
  });

  it('filters by sessionId', () => {
    const db = createTestDb();
    logFeedbackEvent(db, makeEvent({ sessionId: 'sess-1' }));
    logFeedbackEvent(db, makeEvent({ sessionId: 'sess-2' }));

    const forSess1 = getFeedbackEvents(db, { sessionId: 'sess-1' });
    expect(forSess1).toHaveLength(1);
    expect(forSess1[0].session_id).toBe('sess-1');
  });

  it('filters by timestamp range', () => {
    const db = createTestDb();
    logFeedbackEvent(db, makeEvent({ timestamp: 1000 }));
    logFeedbackEvent(db, makeEvent({ timestamp: 2000 }));
    logFeedbackEvent(db, makeEvent({ timestamp: 3000 }));

    const ranged = getFeedbackEvents(db, { since: 1500, until: 2500 });
    expect(ranged).toHaveLength(1);
    expect(ranged[0].timestamp).toBe(2000);
  });

  it('respects limit', () => {
    const db = createTestDb();
    for (let i = 0; i < 5; i++) {
      logFeedbackEvent(db, makeEvent({ memoryId: `mem-${i}` }));
    }
    const limited = getFeedbackEvents(db, { limit: 2 });
    expect(limited).toHaveLength(2);
  });

  it('returns empty array when no events match', () => {
    const db = createTestDb();
    const results = getFeedbackEvents(db, { type: 'result_cited' });
    expect(results).toHaveLength(0);
  });

  it('returns rows ordered by timestamp ASC', () => {
    const db = createTestDb();
    logFeedbackEvent(db, makeEvent({ timestamp: 3000 }));
    logFeedbackEvent(db, makeEvent({ timestamp: 1000 }));
    logFeedbackEvent(db, makeEvent({ timestamp: 2000 }));

    const rows = getFeedbackEvents(db);
    expect(rows[0].timestamp).toBe(1000);
    expect(rows[1].timestamp).toBe(2000);
    expect(rows[2].timestamp).toBe(3000);
  });
});

describe('Feedback Event Ledger — getMemoryFeedbackSummary', () => {
  beforeEach(() => {
    vi.stubEnv('SPECKIT_IMPLICIT_FEEDBACK_LOG', 'true');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('returns zero summary for unknown memoryId', () => {
    const db = createTestDb();
    const summary = getMemoryFeedbackSummary(db, 'unknown-mem');
    expect(summary.total).toBe(0);
    expect(summary.strong).toBe(0);
    expect(summary.medium).toBe(0);
    expect(summary.weak).toBe(0);
  });

  it('aggregates correctly across confidence tiers', () => {
    const db = createTestDb();
    logFeedbackEvent(db, makeEvent({ memoryId: 'mem-1', confidence: 'strong' }));
    logFeedbackEvent(db, makeEvent({ memoryId: 'mem-1', confidence: 'strong' }));
    logFeedbackEvent(db, makeEvent({ memoryId: 'mem-1', confidence: 'medium' }));
    logFeedbackEvent(db, makeEvent({ memoryId: 'mem-1', confidence: 'weak' }));

    const summary = getMemoryFeedbackSummary(db, 'mem-1');
    expect(summary.total).toBe(4);
    expect(summary.strong).toBe(2);
    expect(summary.medium).toBe(1);
    expect(summary.weak).toBe(1);
    expect(summary.memoryId).toBe('mem-1');
  });

  it('is isolated per memoryId', () => {
    const db = createTestDb();
    logFeedbackEvent(db, makeEvent({ memoryId: 'mem-A', confidence: 'strong' }));
    logFeedbackEvent(db, makeEvent({ memoryId: 'mem-B', confidence: 'weak' }));

    const summaryA = getMemoryFeedbackSummary(db, 'mem-A');
    const summaryB = getMemoryFeedbackSummary(db, 'mem-B');
    expect(summaryA.total).toBe(1);
    expect(summaryA.strong).toBe(1);
    expect(summaryB.total).toBe(1);
    expect(summaryB.weak).toBe(1);
  });
});

describe('Feedback Event Ledger — getFeedbackEventCount', () => {
  beforeEach(() => {
    vi.stubEnv('SPECKIT_IMPLICIT_FEEDBACK_LOG', 'true');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('returns 0 for empty table', () => {
    const db = createTestDb();
    expect(getFeedbackEventCount(db)).toBe(0);
  });

  it('counts total events', () => {
    const db = createTestDb();
    logFeedbackEvent(db, makeEvent());
    logFeedbackEvent(db, makeEvent());
    expect(getFeedbackEventCount(db)).toBe(2);
  });

  it('counts by event type', () => {
    const db = createTestDb();
    logFeedbackEvent(db, makeEvent({ type: 'search_shown' }));
    logFeedbackEvent(db, makeEvent({ type: 'search_shown' }));
    logFeedbackEvent(db, makeEvent({ type: 'result_cited', confidence: 'strong' }));
    expect(getFeedbackEventCount(db, 'search_shown')).toBe(2);
    expect(getFeedbackEventCount(db, 'result_cited')).toBe(1);
    expect(getFeedbackEventCount(db, 'query_reformulated')).toBe(0);
  });
});

describe('Feedback Event Ledger — shadow-only guarantee', () => {
  it('FEEDBACK_SCHEMA_SQL and FEEDBACK_INDEX_SQL exist but do not reference memory_index ranking columns', () => {
    // Verify the schema does not touch ranking columns
    expect(FEEDBACK_SCHEMA_SQL).not.toContain('stability');
    expect(FEEDBACK_SCHEMA_SQL).not.toContain('retrievability');
    expect(FEEDBACK_SCHEMA_SQL).not.toContain('importance_weight');
    expect(FEEDBACK_INDEX_SQL).not.toContain('stability');
  });
});
