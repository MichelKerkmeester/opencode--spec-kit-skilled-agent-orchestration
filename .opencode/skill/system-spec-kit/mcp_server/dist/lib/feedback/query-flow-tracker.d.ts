import type Database from 'better-sqlite3';
interface FlowDetectionResult {
    type: 'query_reformulated' | 'same_topic_requery' | null;
    similarity: number;
    previousQueryId: string | null;
    previousMemoryIds: string[];
}
/**
 * Track a query and detect reformulation/requery patterns.
 * Emits feedback events for detected patterns.
 *
 * Call this after every search completion.
 *
 * @param db - Database for logging feedback events
 * @param sessionId - Session identifier (null = skip tracking)
 * @param query - The search query text
 * @param queryId - Opaque query identifier for event correlation
 * @param shownMemoryIds - Memory IDs shown in this search's results
 * @returns The detection result (or null if skipped)
 */
export declare function trackQueryAndDetect(db: Database.Database, sessionId: string | null, query: string, queryId: string, shownMemoryIds: string[]): FlowDetectionResult | null;
/**
 * Log `result_cited` events for memories whose content was loaded.
 * Call when includeContent=true and results contain content.
 */
export declare function logResultCited(db: Database.Database, sessionId: string | null, queryId: string, memoryIds: string[]): void;
/**
 * Log `follow_on_tool_use` events for memories shown in a recent search.
 * Call when any non-search tool is invoked within the follow-on window.
 */
export declare function logFollowOnToolUse(db: Database.Database, sessionId: string | null): void;
/**
 * Clear query history for a session (e.g., on session cleanup).
 */
export declare function clearSession(sessionId: string): void;
/**
 * Get current session query count (for testing/diagnostics).
 */
export declare function getSessionQueryCount(sessionId: string): number;
export {};
//# sourceMappingURL=query-flow-tracker.d.ts.map