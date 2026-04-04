import type Database from 'better-sqlite3';
/**
 * The five implicit feedback event types.
 *
 * Confidence signal hierarchy (strongest → weakest):
 *   result_cited | follow_on_tool_use > query_reformulated > same_topic_requery > search_shown
 */
export type FeedbackEventType = 'search_shown' | 'result_cited' | 'query_reformulated' | 'same_topic_requery' | 'follow_on_tool_use';
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
    since?: number;
    until?: number;
    limit?: number;
    offset?: number;
}
/**
 * Infer confidence tier from event type.
 * Callers may override by providing explicit confidence in the event.
 */
declare const EVENT_TYPE_CONFIDENCE: Record<FeedbackEventType, FeedbackConfidence>;
/**
 * Resolve confidence for a feedback event.
 * Uses the caller-supplied value when present, otherwise infers from type.
 */
export declare function resolveConfidence(type: FeedbackEventType, explicit?: FeedbackConfidence): FeedbackConfidence;
/**
 * Check whether the implicit feedback log is enabled.
 * Default: TRUE (graduated). Set SPECKIT_IMPLICIT_FEEDBACK_LOG=false to disable.
 */
export declare function isImplicitFeedbackLogEnabled(): boolean;
declare const FEEDBACK_SCHEMA_SQL = "\n  CREATE TABLE IF NOT EXISTS feedback_events (\n    id         INTEGER PRIMARY KEY AUTOINCREMENT,\n    type       TEXT NOT NULL CHECK(type IN (\n                 'search_shown','result_cited','query_reformulated',\n                 'same_topic_requery','follow_on_tool_use'\n               )),\n    memory_id  TEXT NOT NULL,\n    query_id   TEXT NOT NULL,\n    confidence TEXT NOT NULL CHECK(confidence IN ('strong','medium','weak')),\n    timestamp  INTEGER NOT NULL,\n    session_id TEXT\n  )\n";
declare const FEEDBACK_INDEX_SQL = "\n  CREATE INDEX IF NOT EXISTS idx_feedback_type      ON feedback_events(type);\n  CREATE INDEX IF NOT EXISTS idx_feedback_memory_id ON feedback_events(memory_id);\n  CREATE INDEX IF NOT EXISTS idx_feedback_query_id  ON feedback_events(query_id);\n  CREATE INDEX IF NOT EXISTS idx_feedback_confidence ON feedback_events(confidence);\n  CREATE INDEX IF NOT EXISTS idx_feedback_timestamp  ON feedback_events(timestamp);\n  CREATE INDEX IF NOT EXISTS idx_feedback_session    ON feedback_events(session_id)\n";
/**
 * Ensure the feedback_events table and indices exist in the given database.
 * Idempotent — safe to call multiple times.
 */
export declare function initFeedbackLedger(db: Database.Database): void;
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
export declare function logFeedbackEvent(db: Database.Database, event: FeedbackEvent): number | null;
/**
 * Record a batch of feedback events (e.g., all search_shown results from
 * a single search response).
 *
 * Returns the count of successfully inserted rows.
 */
export declare function logFeedbackEvents(db: Database.Database, events: FeedbackEvent[]): number;
/**
 * Query feedback events with optional filters.
 * Returns matching rows ordered by timestamp ascending.
 */
export declare function getFeedbackEvents(db: Database.Database, opts?: GetFeedbackEventsOptions): FeedbackEventRow[];
/**
 * Count total feedback events, optionally filtered by type.
 */
export declare function getFeedbackEventCount(db: Database.Database, type?: FeedbackEventType): number;
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
export declare function getMemoryFeedbackSummary(db: Database.Database, memoryId: string): MemoryFeedbackSummary;
export { FEEDBACK_SCHEMA_SQL, FEEDBACK_INDEX_SQL, EVENT_TYPE_CONFIDENCE, };
//# sourceMappingURL=feedback-ledger.d.ts.map