import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Database from 'better-sqlite3';

import {
  getFeedbackEventCount,
  getFeedbackEvents,
  initFeedbackLedger,
} from '../lib/feedback/feedback-ledger.js';
import {
  clearSession,
  getSessionQueryCount,
  logFollowOnToolUse,
  logResultCited,
  trackQueryAndDetect,
} from '../lib/feedback/query-flow-tracker.js';

function createTestDb(): Database.Database {
  const db = new Database(':memory:');
  initFeedbackLedger(db);
  return db;
}

describe('Query Flow Tracker', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-04-03T12:00:00.000Z'));
    vi.stubEnv('SPECKIT_IMPLICIT_FEEDBACK_LOG', 'true');
    clearSession('sess-a');
    clearSession('sess-b');
    clearSession('sess-c');
    clearSession('sess-d');
    clearSession('sess-e');
    clearSession('sess-f');
    clearSession('sess-g');
    clearSession('sess-h');
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllEnvs();
  });

  it('tracks reformulations when consecutive queries have medium similarity', () => {
    const db = createTestDb();

    trackQueryAndDetect(db, 'sess-a', 'error handling patterns', 'q1', ['mem-1', 'mem-2']);
    vi.advanceTimersByTime(1_100);
    const detection = trackQueryAndDetect(db, 'sess-a', 'error handling approach', 'q2', ['mem-3']);

    expect(detection?.type).toBe('query_reformulated');
    expect(detection?.previousQueryId).toBe('q1');
    expect(getFeedbackEventCount(db, 'query_reformulated')).toBe(2);
    expect(getSessionQueryCount('sess-a')).toBe(2);
  });

  it('tracks same-topic requery when similarity is high', () => {
    const db = createTestDb();

    trackQueryAndDetect(db, 'sess-b', 'memory context resume', 'q1', ['mem-9']);
    vi.advanceTimersByTime(1_100);
    const detection = trackQueryAndDetect(db, 'sess-b', 'resume memory context', 'q2', ['mem-10']);

    expect(detection?.type).toBe('same_topic_requery');
    expect(getFeedbackEventCount(db, 'same_topic_requery')).toBe(1);
  });

  it('skips short queries and rapid duplicates', () => {
    const db = createTestDb();

    expect(trackQueryAndDetect(db, 'sess-c', 'hi', 'q-short', ['mem-1'])).toBeNull();
    expect(getSessionQueryCount('sess-c')).toBe(0);

    trackQueryAndDetect(db, 'sess-c', 'follow on analysis', 'q1', ['mem-2']);
    const duplicate = trackQueryAndDetect(db, 'sess-c', 'follow on analysis', 'q2', ['mem-3']);

    expect(duplicate?.type).toBeNull();
    expect(getFeedbackEventCount(db, 'query_reformulated')).toBe(0);
    expect(getFeedbackEventCount(db, 'same_topic_requery')).toBe(0);
    expect(getSessionQueryCount('sess-c')).toBe(2);
  });

  it('evicts stale queries after the 10 minute TTL', () => {
    const db = createTestDb();

    trackQueryAndDetect(db, 'sess-d', 'initial lookup', 'q1', ['mem-1']);
    expect(getSessionQueryCount('sess-d')).toBe(1);

    vi.advanceTimersByTime(10 * 60 * 1000 + 1_000);
    trackQueryAndDetect(db, 'sess-d', 'fresh lookup', 'q2', ['mem-2']);

    expect(getSessionQueryCount('sess-d')).toBe(1);
    expect(getFeedbackEventCount(db, 'query_reformulated')).toBe(0);
    expect(getFeedbackEventCount(db, 'same_topic_requery')).toBe(0);
  });

  it('logs result_cited for each cited memory id', () => {
    const db = createTestDb();

    logResultCited(db, 'sess-e', 'q-cite', ['mem-1', 'mem-2']);

    expect(getFeedbackEventCount(db, 'result_cited')).toBe(2);
    const events = getFeedbackEvents(db, { type: 'result_cited' });
    expect(events.map((event) => event.memory_id)).toEqual(['mem-1', 'mem-2']);
    expect(events.every((event) => event.session_id === 'sess-e')).toBe(true);
  });

  it('logs follow_on_tool_use within the 60 second window and stops after expiry', () => {
    const db = createTestDb();

    trackQueryAndDetect(db, 'sess-f', 'sticky session issue', 'q-follow', ['mem-5', 'mem-6']);
    vi.advanceTimersByTime(30_000);
    logFollowOnToolUse(db, 'sess-f');

    expect(getFeedbackEventCount(db, 'follow_on_tool_use')).toBe(2);

    vi.advanceTimersByTime(31_000);
    logFollowOnToolUse(db, 'sess-f');

    expect(getFeedbackEventCount(db, 'follow_on_tool_use')).toBe(2);
  });

  it('records the packet flow of search citation, follow-on tool use, and reformulation in the ledger', () => {
    const db = createTestDb();

    trackQueryAndDetect(db, 'sess-h', 'error handling patterns', 'q1', ['mem-1', 'mem-2']);
    logResultCited(db, 'sess-h', 'q1', ['mem-1', 'mem-2']);

    vi.advanceTimersByTime(30_000);
    logFollowOnToolUse(db, 'sess-h');

    vi.advanceTimersByTime(1_100);
    const detection = trackQueryAndDetect(
      db,
      'sess-h',
      'error handling approach',
      'q2',
      ['mem-3']
    );

    expect(detection?.type).toBe('query_reformulated');
    expect(getFeedbackEventCount(db, 'result_cited')).toBe(2);
    expect(getFeedbackEventCount(db, 'follow_on_tool_use')).toBe(2);
    expect(getFeedbackEventCount(db, 'query_reformulated')).toBe(2);

    const reformulationEvents = getFeedbackEvents(db, { type: 'query_reformulated' });
    expect(reformulationEvents.map((event) => event.memory_id)).toEqual(['mem-1', 'mem-2']);
  });

  it('clearSession removes in-memory session history', () => {
    const db = createTestDb();

    trackQueryAndDetect(db, 'sess-g', 'cleanup target', 'q1', ['mem-1']);
    expect(getSessionQueryCount('sess-g')).toBe(1);

    clearSession('sess-g');

    expect(getSessionQueryCount('sess-g')).toBe(0);
    vi.advanceTimersByTime(1_100);
    const detection = trackQueryAndDetect(db, 'sess-g', 'cleanup target follow-up', 'q2', ['mem-2']);
    expect(detection?.type ?? null).toBeNull();
  });
});
