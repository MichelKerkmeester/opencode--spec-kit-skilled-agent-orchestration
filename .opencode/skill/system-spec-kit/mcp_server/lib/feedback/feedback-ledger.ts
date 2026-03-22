// ───────────────────────────────────────────────────────────────
// MODULE: Feedback Event Ledger (REQ-D4-001)
// ───────────────────────────────────────────────────────────────
// Feature catalog: Implicit feedback event ledger
// Records implicit feedback signals from search/save interactions
// into a shadow-only SQLite table. No ranking side effects.
//
// Feature flag: SPECKIT_IMPLICIT_FEEDBACK_LOG (default ON, graduated)
// Signal confidence tiers:
//   strong  — citation, follow_on_tool_use (result was used)
//   medium  — query_reformulated (implicit relevance dissatisfaction)
//   weak    — search_shown, same_topic_requery (passive exposure)
import type Database from 'better-sqlite3';

/* ───────────────────────────────────────────────────────────────
   1. TYPES
----------------------------------------------------------------*/

/**
 * The five implicit feedback event types.
 *
 * Confidence signal hierarchy (strongest → weakest):
 *   result_cited | follow_on_tool_use > query_reformulated > same_topic_requery > search_shown
 */
export type FeedbackEventType =
  | 'search_shown'
  | 'result_cited'
  | 'query_reformulated'
  | 'same_topic_requery'
  | 'follow_on_tool_use';

/** Confidence tier for the implicit signal. */
export type FeedbackConfidence = 'strong' | 'medium' | 'weak';

/** Input shape for recording a feedback event. */
export interface FeedbackEvent {
  type: FeedbackEventType;
  /** The memory ID this event relates to (string form of DB integer id). */
  memoryId: string;
  /** Opaque query identifier (e.g. eval query ID or hash of query text). */
  queryId: string;
  confidence: FeedbackConfidence;
  timestamp: number;
  sessionId?: string | null;
}

/** Row shape stored in feedback_events table. */
export interface FeedbackEventRow {
  id: number;
  type: FeedbackEventType;
  memory_id: string;
  query_id: string;
  confidence: FeedbackConfidence;
  timestamp: number;
  session_id: string | null;
}

export interface GetFeedbackEventsOptions {
  type?: FeedbackEventType;
  memoryId?: string;
  queryId?: string;
  confidence?: FeedbackConfidence;
  sessionId?: string;
  since?: number;   // Unix ms
  until?: number;   // Unix ms
  limit?: number;
  offset?: number;
}

/* ───────────────────────────────────────────────────────────────
   2. CONFIDENCE TIER MAPPING
----------------------------------------------------------------*/

/**
 * Infer confidence tier from event type.
 * Callers may override by providing explicit confidence in the event.
 */
const EVENT_TYPE_CONFIDENCE: Record<FeedbackEventType, FeedbackConfidence> = {
  result_cited:         'strong',
  follow_on_tool_use:   'strong',
  query_reformulated:   'medium',
  same_topic_requery:   'weak',
  search_shown:         'weak',
};

/**
 * Resolve confidence for a feedback event.
 * Uses the caller-supplied value when present, otherwise infers from type.
 */
export function resolveConfidence(
  type: FeedbackEventType,
  explicit?: FeedbackConfidence
): FeedbackConfidence {
  if (explicit) return explicit;
  return EVENT_TYPE_CONFIDENCE[type] ?? 'weak';
}

/* ───────────────────────────────────────────────────────────────
   3. FEATURE FLAG
----------------------------------------------------------------*/

/**
 * Check whether the implicit feedback log is enabled.
 * Default: TRUE (graduated). Set SPECKIT_IMPLICIT_FEEDBACK_LOG=false to disable.
 */
export function isImplicitFeedbackLogEnabled(): boolean {
  const val = process.env.SPECKIT_IMPLICIT_FEEDBACK_LOG?.toLowerCase().trim();
  return val !== 'false' && val !== '0';
}

/* ───────────────────────────────────────────────────────────────
   4. SCHEMA SQL
----------------------------------------------------------------*/

const FEEDBACK_SCHEMA_SQL = `
  CREATE TABLE IF NOT EXISTS feedback_events (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    type       TEXT NOT NULL CHECK(type IN (
                 'search_shown','result_cited','query_reformulated',
                 'same_topic_requery','follow_on_tool_use'
               )),
    memory_id  TEXT NOT NULL,
    query_id   TEXT NOT NULL,
    confidence TEXT NOT NULL CHECK(confidence IN ('strong','medium','weak')),
    timestamp  INTEGER NOT NULL,
    session_id TEXT
  )
`;

const FEEDBACK_INDEX_SQL = `
  CREATE INDEX IF NOT EXISTS idx_feedback_type      ON feedback_events(type);
  CREATE INDEX IF NOT EXISTS idx_feedback_memory_id ON feedback_events(memory_id);
  CREATE INDEX IF NOT EXISTS idx_feedback_query_id  ON feedback_events(query_id);
  CREATE INDEX IF NOT EXISTS idx_feedback_confidence ON feedback_events(confidence);
  CREATE INDEX IF NOT EXISTS idx_feedback_timestamp  ON feedback_events(timestamp);
  CREATE INDEX IF NOT EXISTS idx_feedback_session    ON feedback_events(session_id)
`;

/* ───────────────────────────────────────────────────────────────
   5. INITIALIZATION
----------------------------------------------------------------*/

/** Track which DB handles have had the schema initialized. */
const initializedDbs = new WeakSet<object>();

/**
 * Ensure the feedback_events table and indices exist in the given database.
 * Idempotent — safe to call multiple times.
 */
export function initFeedbackLedger(db: Database.Database): void {
  if (initializedDbs.has(db)) return;
  db.exec(FEEDBACK_SCHEMA_SQL);
  db.exec(FEEDBACK_INDEX_SQL);
  initializedDbs.add(db);
}

/* ───────────────────────────────────────────────────────────────
   6. LOG EVENT
----------------------------------------------------------------*/

/**
 * Record a single implicit feedback event.
 *
 * Shadow-only: this function has NO effect on search ranking.
 * Returns the inserted row ID, or null when the feature flag is OFF
 * or the DB write fails.
 *
 * Errors are caught and logged as warnings — feedback recording must
 * never interrupt search or save operations.
 */
export function logFeedbackEvent(
  db: Database.Database,
  event: FeedbackEvent
): number | null {
  if (!isImplicitFeedbackLogEnabled()) return null;

  try {
    initFeedbackLedger(db);

    const confidence = resolveConfidence(event.type, event.confidence);

    const result = db.prepare(`
      INSERT INTO feedback_events (type, memory_id, query_id, confidence, timestamp, session_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      event.type,
      event.memoryId,
      event.queryId,
      confidence,
      event.timestamp,
      event.sessionId ?? null
    );

    return (result as { lastInsertRowid: number | bigint }).lastInsertRowid as number;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn('[feedback-ledger] logFeedbackEvent error:', message);
    return null;
  }
}

/**
 * Record a batch of feedback events (e.g., all search_shown results from
 * a single search response).
 *
 * Returns the count of successfully inserted rows.
 */
export function logFeedbackEvents(
  db: Database.Database,
  events: FeedbackEvent[]
): number {
  if (!isImplicitFeedbackLogEnabled()) return 0;
  if (events.length === 0) return 0;

  let inserted = 0;
  for (const event of events) {
    const id = logFeedbackEvent(db, event);
    if (id !== null) inserted++;
  }
  return inserted;
}

/* ───────────────────────────────────────────────────────────────
   7. QUERY EVENTS
----------------------------------------------------------------*/

/**
 * Query feedback events with optional filters.
 * Returns matching rows ordered by timestamp ascending.
 */
export function getFeedbackEvents(
  db: Database.Database,
  opts: GetFeedbackEventsOptions = {}
): FeedbackEventRow[] {
  try {
    initFeedbackLedger(db);

    const conditions: string[] = [];
    const params: Array<string | number> = [];

    if (opts.type) {
      conditions.push('type = ?');
      params.push(opts.type);
    }
    if (opts.memoryId !== undefined) {
      conditions.push('memory_id = ?');
      params.push(opts.memoryId);
    }
    if (opts.queryId !== undefined) {
      conditions.push('query_id = ?');
      params.push(opts.queryId);
    }
    if (opts.confidence) {
      conditions.push('confidence = ?');
      params.push(opts.confidence);
    }
    if (opts.sessionId !== undefined) {
      conditions.push('session_id = ?');
      params.push(opts.sessionId);
    }
    if (opts.since !== undefined) {
      conditions.push('timestamp >= ?');
      params.push(opts.since);
    }
    if (opts.until !== undefined) {
      conditions.push('timestamp <= ?');
      params.push(opts.until);
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const limit = opts.limit ? `LIMIT ${Math.max(1, Math.floor(opts.limit))}` : '';
    const offset = opts.offset ? `OFFSET ${Math.max(0, Math.floor(opts.offset))}` : '';
    const effectiveLimit = !limit && offset ? 'LIMIT -1' : limit;

    const sql = `SELECT * FROM feedback_events ${where} ORDER BY timestamp ASC ${effectiveLimit} ${offset}`;
    return db.prepare(sql).all(...params) as FeedbackEventRow[];
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn('[feedback-ledger] getFeedbackEvents error:', message);
    return [];
  }
}

/**
 * Count total feedback events, optionally filtered by type.
 */
export function getFeedbackEventCount(
  db: Database.Database,
  type?: FeedbackEventType
): number {
  try {
    initFeedbackLedger(db);
    if (type) {
      const row = db.prepare('SELECT COUNT(*) as count FROM feedback_events WHERE type = ?')
        .get(type) as { count: number };
      return row.count;
    }
    const row = db.prepare('SELECT COUNT(*) as count FROM feedback_events').get() as { count: number };
    return row.count;
  } catch {
    return 0;
  }
}

/**
 * Get aggregated signal counts for a specific memory (by memoryId).
 * Returns counts broken down by confidence tier.
 */
export interface MemoryFeedbackSummary {
  memoryId: string;
  total: number;
  strong: number;
  medium: number;
  weak: number;
}

export function getMemoryFeedbackSummary(
  db: Database.Database,
  memoryId: string
): MemoryFeedbackSummary {
  try {
    initFeedbackLedger(db);
    const rows = db.prepare(`
      SELECT confidence, COUNT(*) as cnt
      FROM feedback_events
      WHERE memory_id = ?
      GROUP BY confidence
    `).all(memoryId) as Array<{ confidence: FeedbackConfidence; cnt: number }>;

    const summary: MemoryFeedbackSummary = { memoryId, total: 0, strong: 0, medium: 0, weak: 0 };
    for (const row of rows) {
      summary[row.confidence] = row.cnt;
      summary.total += row.cnt;
    }
    return summary;
  } catch {
    return { memoryId, total: 0, strong: 0, medium: 0, weak: 0 };
  }
}

/* ───────────────────────────────────────────────────────────────
   8. EXPORTS (schema constants for testing)
----------------------------------------------------------------*/

export {
  FEEDBACK_SCHEMA_SQL,
  FEEDBACK_INDEX_SQL,
  EVENT_TYPE_CONFIDENCE,
};
