/** Default number of results per page. */
declare const DEFAULT_PAGE_SIZE = 5;
/** Cursor TTL in milliseconds (5 minutes). */
declare const DEFAULT_CURSOR_TTL_MS: number;
/** Maximum snippet length in characters before truncation. */
declare const SNIPPET_MAX_LENGTH = 100;
/** Compact digest of result quality distribution. */
interface SummaryLayer {
    count: number;
    digest: string;
}
/** Snippet preview of a single result. */
interface Snippet {
    snippet: string;
    detailAvailable: boolean;
    resultId: string;
}
/** Decoded cursor payload. */
interface CursorPayload {
    cursorKey?: string;
    offset: number;
    queryHash: string;
    timestamp: number;
    scopeKey?: string;
}
/** Cursor with remaining count metadata. */
interface CursorInfo {
    cursor: string;
    remainingCount: number;
}
/** Full progressive response shape. */
interface ProgressiveResponse {
    summaryLayer: SummaryLayer;
    results: Snippet[];
    continuation: CursorInfo | null;
}
/** Minimal result shape for progressive disclosure. */
interface DisclosureResult {
    id: number | string;
    content?: string;
    score?: number;
    confidence?: {
        label: 'high' | 'medium' | 'low';
        value: number;
    };
    [key: string]: unknown;
}
/** Options for cursor creation. */
interface CursorOptions {
    ttlMs?: number;
    scopeKey?: string;
}
/**
 * Produce a simple hash string from a query for cursor identification.
 * Uses a djb2-style hash for speed and determinism.
 *
 * @param query - Query text to hash.
 * @returns Deterministic base-36 hash string for the query.
 * @example
 * ```ts
 * const queryHash = hashQuery('memory search');
 * ```
 */
declare function hashQuery(query: string): string;
/**
 * Encode a cursor payload as a base64 string.
 *
 * @param payload - Cursor metadata to serialize.
 * @returns Base64-encoded cursor token.
 * @example
 * ```ts
 * const token = encodeCursor({ offset: 5, queryHash: 'abc', timestamp: Date.now() });
 * ```
 */
declare function encodeCursor(payload: CursorPayload): string;
/**
 * Decode a base64-encoded cursor back to a payload.
 * Returns null if the cursor is malformed.
 *
 * @param cursor - Opaque base64 cursor token.
 * @returns Decoded cursor payload, or `null` when the token is invalid.
 * @example
 * ```ts
 * const payload = decodeCursor(cursor);
 * ```
 */
declare function decodeCursor(cursor: string): CursorPayload | null;
/**
 * Classify results by confidence label.
 * Returns counts for high, medium, low (and unknown when no confidence data).
 *
 * @param results - Results to classify by confidence label.
 * @returns Counts for each confidence bucket.
 * @example
 * ```ts
 * const summary = classifyByConfidence(results);
 * ```
 */
declare function classifyByConfidence(results: DisclosureResult[]): {
    high: number;
    medium: number;
    low: number;
};
/**
 * Build a human-readable digest string from confidence distribution.
 * Format: "3 strong, 2 weak, 1 conflict" style.
 *
 * @param classification - Confidence bucket counts.
 * @returns Human-readable digest string.
 * @example
 * ```ts
 * buildDigest({ high: 2, medium: 1, low: 0 });
 * // '2 strong, 1 moderate'
 * ```
 */
declare function buildDigest(classification: {
    high: number;
    medium: number;
    low: number;
}): string;
/**
 * Check whether progressive disclosure is enabled.
 * Default: TRUE (graduated). Set SPECKIT_PROGRESSIVE_DISCLOSURE_V1=false to disable.
 *
 * @returns `true` when progressive disclosure should be used for responses.
 * @example
 * ```ts
 * if (isProgressiveDisclosureEnabled()) {
 *   // build paginated response
 * }
 * ```
 */
declare function isProgressiveDisclosureEnabled(): boolean;
/**
 * Generate a summary layer for a set of results.
 * Produces a compact digest of result quality distribution.
 *
 * @param results - Full result set to summarize.
 * @returns SummaryLayer with count and human-readable digest.
 * @example
 * ```ts
 * const summary = generateSummaryLayer(results);
 * ```
 */
declare function generateSummaryLayer(results: DisclosureResult[]): SummaryLayer;
/**
 * Extract snippet previews from full results.
 * Each snippet is the first SNIPPET_MAX_LENGTH characters of content + "...".
 *
 * @param results - Full result set to extract snippets from.
 * @returns Array of Snippet objects, one per result.
 * @example
 * ```ts
 * const previews = extractSnippets(results);
 * ```
 */
declare function extractSnippets(results: DisclosureResult[]): Snippet[];
/**
 * Create a continuation cursor for paginated result retrieval.
 *
 * @param resultSet - Full result set (stored for later resolution).
 * @param pageSize - Number of results per page. Default: 5.
 * @param query - Original query string for hash-based identification.
 * @param options - Optional cursor configuration (TTL).
 * @returns CursorInfo with opaque cursor token and remaining count, or null if no more results.
 * @example
 * ```ts
 * const continuation = createCursor(results, 5, 'memory search');
 * ```
 */
declare function createCursor(resultSet: DisclosureResult[], pageSize?: number, query?: string, options?: CursorOptions): CursorInfo | null;
/**
 * Resolve a continuation cursor to the next page of results.
 *
 * @param cursor - Opaque cursor token from createCursor.
 * @param pageSize - Number of results to return. Default: 5.
 * @param options - Optional cursor configuration (TTL).
 * @returns Object with next page of results, next cursor (if more), or null if cursor is invalid/expired.
 * @example
 * ```ts
 * const page = resolveCursor(cursor, 5);
 * ```
 */
declare function resolveCursor(cursor: string, pageSize?: number, options?: CursorOptions): {
    results: DisclosureResult[];
    continuation: CursorInfo | null;
} | null;
/**
 * Build a progressive response from a full result set.
 * Replaces hard tail-truncation with summary layer + snippets + cursor.
 *
 * When the feature flag is OFF, returns all results as snippets with no cursor.
 *
 * @param results - Full result set.
 * @param pageSize - Number of results per page. Default: 5.
 * @param query - Original query string for cursor identification.
 * @returns ProgressiveResponse with summary, snippets, and optional continuation.
 * @example
 * ```ts
 * const response = buildProgressiveResponse(results, 5, 'memory search');
 * ```
 */
declare function buildProgressiveResponse(results: DisclosureResult[], pageSize?: number, query?: string, options?: CursorOptions): ProgressiveResponse;
/**
 * Clear the cursor store. Useful for testing and cleanup.
 *
 * @returns Nothing.
 * @example
 * ```ts
 * clearCursorStore();
 * ```
 */
declare function clearCursorStore(): void;
export { type SummaryLayer, type Snippet, type CursorPayload, type CursorInfo, type ProgressiveResponse, type DisclosureResult, type CursorOptions, DEFAULT_PAGE_SIZE, DEFAULT_CURSOR_TTL_MS, SNIPPET_MAX_LENGTH, isProgressiveDisclosureEnabled, generateSummaryLayer, extractSnippets, createCursor, resolveCursor, buildProgressiveResponse, clearCursorStore, hashQuery, encodeCursor, decodeCursor, classifyByConfidence, buildDigest, };
//# sourceMappingURL=progressive-disclosure.d.ts.map