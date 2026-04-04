import Database from 'better-sqlite3';
/**
 * Defines the ConsumptionEventType type.
 */
export type ConsumptionEventType = 'search' | 'context' | 'triggers';
/**
 * Describes the ConsumptionEvent shape.
 */
export interface ConsumptionEvent {
    event_type: ConsumptionEventType;
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
/**
 * Describes the ConsumptionStatsOptions shape.
 */
export interface ConsumptionStatsOptions {
    event_type?: ConsumptionEventType;
    session_id?: string;
    since?: string;
}
/**
 * Describes the ConsumptionStats shape.
 */
export interface ConsumptionStats {
    total_events: number;
    by_event_type: Record<string, number>;
    avg_result_count: number;
    avg_latency_ms: number;
    zero_result_queries: number;
    unique_sessions: number;
}
/**
 * Describes the ConsumptionPattern shape.
 */
export interface ConsumptionPattern {
    category: string;
    description: string;
    count: number;
    examples: string[];
}
/**
 * Describes the ConsumptionPatternsOptions shape.
 */
export interface ConsumptionPatternsOptions {
    limit?: number;
}
/**
 * Returns true when SPECKIT_CONSUMPTION_LOG is enabled (graduated, default ON).
 */
declare function isConsumptionLogEnabled(): boolean;
/**
 * Create consumption_log table if it doesn't exist.
 * Safe to call multiple times (idempotent).
 */
declare function initConsumptionLog(db: Database.Database): void;
/**
 * Insert a consumption event row.
 * FAIL-SAFE: never throws — all errors are swallowed to ensure
 * instrumentation never causes the calling handler to fail.
 */
declare function logConsumptionEvent(db: Database.Database, event: ConsumptionEvent): void;
/**
 * Return aggregate statistics from consumption_log.
 * Returns default empty stats if the table doesn't exist or query fails.
 */
declare function getConsumptionStats(db: Database.Database, options?: ConsumptionStatsOptions): ConsumptionStats;
/**
 * Identify consumption pattern categories from logged events.
 *
 * Returns at least 5 categories:
 * 1. high-frequency-query   — queries repeated >3 times
 * 2. zero-result            — queries returning 0 results
 * 3. low-selection          — result_count < threshold (proxy for low relevance)
 * 4. intent-mismatch        — same query_text with different intents across calls
 * 5. session-heavy          — sessions with >10 queries
 */
declare function getConsumptionPatterns(db: Database.Database, options?: ConsumptionPatternsOptions): ConsumptionPattern[];
export { isConsumptionLogEnabled, initConsumptionLog, logConsumptionEvent, getConsumptionStats, getConsumptionPatterns, };
//# sourceMappingURL=consumption-logger.d.ts.map