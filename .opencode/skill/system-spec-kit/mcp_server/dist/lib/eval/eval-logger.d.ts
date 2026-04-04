/**
 * Returns true only when SPECKIT_EVAL_LOGGING=true (case-insensitive).
 * Anything else (undefined, "false", "1", …) disables logging.
 */
declare function isEvalLoggingEnabled(): boolean;
/**
 * Generate a new eval_run_id for a single search invocation.
 * Callers should capture this once at the start of a handler
 * and pass it to every logChannelResult / logFinalResult call
 * for that same invocation.
 *
 * Returns 0 when eval logging is disabled (no-op sentinel).
 */
declare function generateEvalRunId(): number;
interface LogSearchQueryParams {
    /** Raw query text as supplied by the caller. */
    query: string;
    /** Intent label, e.g. "understand" or "fix_bug". */
    intent?: string | null;
    /** Spec folder filter, if any. */
    specFolder?: string | null;
}
interface LogSearchQueryResult {
    /** Inserted row ID in eval_queries. 0 means logging is disabled or failed. */
    queryId: number;
    /** Eval run ID to pass to channel / final result loggers. */
    evalRunId: number;
}
interface LogChannelResultParams {
    evalRunId: number;
    queryId: number;
    /** Channel name: "vector", "bm25", "graph", or "trigger". */
    channel: string;
    /** Memory IDs returned by this channel. */
    resultMemoryIds?: number[];
    /** Per-result scores (same order as resultMemoryIds). */
    scores?: number[];
    /** Wall-clock latency for this channel in milliseconds. */
    latencyMs?: number;
    /** Number of results that are judged hits (when known). */
    hitCount?: number;
}
interface LogFinalResultParams {
    evalRunId: number;
    queryId: number;
    /** Memory IDs in the fused / final ranked list. */
    resultMemoryIds?: number[];
    /** Per-result scores in the final list. */
    scores?: number[];
    /** Fusion method used, e.g. "rrf". */
    fusionMethod?: string;
    /** Total end-to-end latency in milliseconds. */
    latencyMs?: number;
}
/**
 * Log a search query to eval_queries.
 *
 * Should be called at the entry point of each handler (search,
 * context, triggers). Returns the queryId and evalRunId that
 * must be forwarded to channel / final result loggers.
 *
 * Fail-safe: never throws. Returns { queryId: 0, evalRunId: 0 }
 * when logging is disabled or an error occurs.
 */
declare function logSearchQuery(params: LogSearchQueryParams): LogSearchQueryResult;
/**
 * Log the result set from a single retrieval channel.
 *
 * Fail-safe: never throws.
 */
declare function logChannelResult(params: LogChannelResultParams): void;
/**
 * Log the fused / final ranked result list.
 *
 * Fail-safe: never throws.
 */
declare function logFinalResult(params: LogFinalResultParams): void;
export { isEvalLoggingEnabled, generateEvalRunId, logSearchQuery, logChannelResult, logFinalResult, };
export type { LogSearchQueryParams, LogSearchQueryResult, LogChannelResultParams, LogFinalResultParams, };
//# sourceMappingURL=eval-logger.d.ts.map