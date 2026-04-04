/* ───────────────────────────────────────────────────────────────
   2. CONFIDENCE TIER MAPPING
----------------------------------------------------------------*/
/**
 * Infer confidence tier from event type.
 * Callers may override by providing explicit confidence in the event.
 */
const EVENT_TYPE_CONFIDENCE = {
    result_cited: 'strong',
    follow_on_tool_use: 'strong',
    query_reformulated: 'medium',
    same_topic_requery: 'weak',
    search_shown: 'weak',
};
/**
 * Resolve confidence for a feedback event.
 * Uses the caller-supplied value when present, otherwise infers from type.
 */
export function resolveConfidence(type, explicit) {
    if (explicit)
        return explicit;
    return EVENT_TYPE_CONFIDENCE[type] ?? 'weak';
}
/* ───────────────────────────────────────────────────────────────
   3. FEATURE FLAG
----------------------------------------------------------------*/
/**
 * Check whether the implicit feedback log is enabled.
 * Default: TRUE (graduated). Set SPECKIT_IMPLICIT_FEEDBACK_LOG=false to disable.
 */
export function isImplicitFeedbackLogEnabled() {
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
const initializedDbs = new WeakSet();
/**
 * Ensure the feedback_events table and indices exist in the given database.
 * Idempotent — safe to call multiple times.
 */
export function initFeedbackLedger(db) {
    if (initializedDbs.has(db))
        return;
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
export function logFeedbackEvent(db, event) {
    if (!isImplicitFeedbackLogEnabled())
        return null;
    try {
        initFeedbackLedger(db);
        const confidence = resolveConfidence(event.type, event.confidence);
        const result = db.prepare(`
      INSERT INTO feedback_events (type, memory_id, query_id, confidence, timestamp, session_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(event.type, event.memoryId, event.queryId, confidence, event.timestamp, event.sessionId ?? null);
        return result.lastInsertRowid;
    }
    catch (err) {
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
export function logFeedbackEvents(db, events) {
    if (!isImplicitFeedbackLogEnabled())
        return 0;
    if (events.length === 0)
        return 0;
    let inserted = 0;
    for (const event of events) {
        const id = logFeedbackEvent(db, event);
        if (id !== null)
            inserted++;
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
export function getFeedbackEvents(db, opts = {}) {
    try {
        initFeedbackLedger(db);
        const conditions = [];
        const params = [];
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
        return db.prepare(sql).all(...params);
    }
    catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        console.warn('[feedback-ledger] getFeedbackEvents error:', message);
        return [];
    }
}
/**
 * Count total feedback events, optionally filtered by type.
 */
export function getFeedbackEventCount(db, type) {
    try {
        initFeedbackLedger(db);
        if (type) {
            const row = db.prepare('SELECT COUNT(*) as count FROM feedback_events WHERE type = ?')
                .get(type);
            return row.count;
        }
        const row = db.prepare('SELECT COUNT(*) as count FROM feedback_events').get();
        return row.count;
    }
    catch {
        return 0;
    }
}
export function getMemoryFeedbackSummary(db, memoryId) {
    try {
        initFeedbackLedger(db);
        const rows = db.prepare(`
      SELECT confidence, COUNT(*) as cnt
      FROM feedback_events
      WHERE memory_id = ?
      GROUP BY confidence
    `).all(memoryId);
        const summary = { memoryId, total: 0, strong: 0, medium: 0, weak: 0 };
        for (const row of rows) {
            summary[row.confidence] = row.cnt;
            summary.total += row.cnt;
        }
        return summary;
    }
    catch {
        return { memoryId, total: 0, strong: 0, medium: 0, weak: 0 };
    }
}
/* ───────────────────────────────────────────────────────────────
   8. EXPORTS (schema constants for testing)
----------------------------------------------------------------*/
export { FEEDBACK_SCHEMA_SQL, FEEDBACK_INDEX_SQL, EVENT_TYPE_CONFIDENCE, };
//# sourceMappingURL=feedback-ledger.js.map