// ───────────────────────────────────────────────────────────────
// MODULE: Progressive Disclosure
// ───────────────────────────────────────────────────────────────
// REQ-D5-005: Progressive disclosure for search results
//
// PURPOSE: Replace hard tail-truncation with a multi-layer response:
// 1. Summary layer — compact digest of result quality distribution
// 2. Snippet extraction — short previews with detail-available flags
// 3. Continuation cursors — opaque tokens for paginated retrieval
// 4. Progressive response builder — orchestrates all layers
//
// FEATURE FLAG: SPECKIT_PROGRESSIVE_DISCLOSURE_V1 (default ON, graduated)
import { randomUUID } from 'node:crypto';

// -- Constants --

/** Default number of results per page. */
const DEFAULT_PAGE_SIZE = 5;

/** Cursor TTL in milliseconds (5 minutes). */
const DEFAULT_CURSOR_TTL_MS = 5 * 60 * 1000;

/** Maximum snippet length in characters before truncation. */
const SNIPPET_MAX_LENGTH = 100;

/** Maximum number of cursors stored in memory. */
const MAX_CURSORS = 1000;

// -- Types --

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

// -- Internal: Cursor Store --

/**
 * In-memory cache of result sets keyed by an opaque cursor identifier.
 * Used for cursor resolution (pagination).
 */
const cursorStore = new Map<string, { results: DisclosureResult[]; storedAt: number }>();

// -- Internal Helpers --

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
function hashQuery(query: string): string {
  let hash = 5381;
  for (let i = 0; i < query.length; i++) {
    hash = ((hash << 5) + hash + query.charCodeAt(i)) >>> 0;
  }
  return hash.toString(36);
}

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
function encodeCursor(payload: CursorPayload): string {
  const json = JSON.stringify(payload);
  return Buffer.from(json, 'utf-8').toString('base64');
}

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
function decodeCursor(cursor: string): CursorPayload | null {
  try {
    const json = Buffer.from(cursor, 'base64').toString('utf-8');
    const parsed = JSON.parse(json) as Record<string, unknown>;
    if (
      typeof parsed.offset !== 'number' ||
      typeof parsed.queryHash !== 'string' ||
      typeof parsed.timestamp !== 'number'
  ) {
      return null;
    }
    return parsed as unknown as CursorPayload;
  } catch (error: unknown) {
    void error;
    /* Cursor decode failure is non-fatal */
    return null;
  }
}

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
function classifyByConfidence(results: DisclosureResult[]): { high: number; medium: number; low: number } {
  let high = 0;
  let medium = 0;
  let low = 0;

  for (const result of results) {
    const label = result.confidence?.label;
    if (label === 'high') high++;
    else if (label === 'medium') medium++;
    else low++;
  }

  return { high, medium, low };
}

function pruneExpiredCursorEntries(
  ttlMs: number = DEFAULT_CURSOR_TTL_MS,
  now: number = Date.now(),
): void {
  for (const [key, entry] of cursorStore.entries()) {
    if (now - entry.storedAt > ttlMs) {
      cursorStore.delete(key);
    }
  }
}

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
function buildDigest(classification: { high: number; medium: number; low: number }): string {
  const parts: string[] = [];
  if (classification.high > 0) parts.push(`${classification.high} strong`);
  if (classification.medium > 0) parts.push(`${classification.medium} moderate`);
  if (classification.low > 0) parts.push(`${classification.low} weak`);
  return parts.length > 0 ? parts.join(', ') : '0 results';
}

// -- Feature Flag --

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
function isProgressiveDisclosureEnabled(): boolean {
  const val = process.env.SPECKIT_PROGRESSIVE_DISCLOSURE_V1?.toLowerCase().trim();
  return val !== 'false' && val !== '0';
}

// -- Public API --

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
function generateSummaryLayer(results: DisclosureResult[]): SummaryLayer {
  if (!Array.isArray(results) || results.length === 0) {
    return { count: 0, digest: '0 results' };
  }

  const classification = classifyByConfidence(results);
  return {
    count: results.length,
    digest: buildDigest(classification),
  };
}

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
function extractSnippets(results: DisclosureResult[]): Snippet[] {
  if (!Array.isArray(results)) return [];

  return results.map((result): Snippet => {
    const content = typeof result.content === 'string' ? result.content : '';
    const hasFullContent = content.length > 0;
    const truncated = content.length > SNIPPET_MAX_LENGTH
      ? content.slice(0, SNIPPET_MAX_LENGTH) + '...'
      : content;

    return {
      snippet: truncated,
      detailAvailable: hasFullContent,
      resultId: String(result.id),
    };
  });
}

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
function createCursor(
  resultSet: DisclosureResult[],
  pageSize: number = DEFAULT_PAGE_SIZE,
  query: string = '',
  options?: CursorOptions,
): CursorInfo | null {
  if (!Array.isArray(resultSet) || resultSet.length <= pageSize) {
    return null;
  }

  const queryHash = hashQuery(query);
  const now = Date.now();
  const cursorKey = randomUUID();

  pruneExpiredCursorEntries(options?.ttlMs ?? DEFAULT_CURSOR_TTL_MS, now);

  // Store the full result set for later resolution
  cursorStore.set(cursorKey, { results: resultSet, storedAt: now });

  // Evict oldest cursors when exceeding max capacity
  if (cursorStore.size > MAX_CURSORS) {
    const sorted = [...cursorStore.entries()].sort((a, b) => a[1].storedAt - b[1].storedAt);
    const excess = cursorStore.size - MAX_CURSORS;
    for (let i = 0; i < excess; i++) {
      cursorStore.delete(sorted[i][0]);
    }
  }

  const payload: CursorPayload = {
    cursorKey,
    offset: pageSize,
    queryHash,
    timestamp: now,
    scopeKey: typeof options?.scopeKey === 'string' && options.scopeKey.length > 0
      ? options.scopeKey
      : undefined,
  };

  return {
    cursor: encodeCursor(payload),
    remainingCount: resultSet.length - pageSize,
  };
}

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
function resolveCursor(
  cursor: string,
  pageSize: number = DEFAULT_PAGE_SIZE,
  options?: CursorOptions,
): { results: DisclosureResult[]; continuation: CursorInfo | null } | null {
  const ttlMs = options?.ttlMs ?? DEFAULT_CURSOR_TTL_MS;
  const payload = decodeCursor(cursor);
  if (!payload) return null;
  const storeKey = payload.cursorKey ?? payload.queryHash;

  if (
    typeof payload.scopeKey === 'string'
    && payload.scopeKey.length > 0
    && payload.scopeKey !== options?.scopeKey
  ) {
    return null;
  }

  pruneExpiredCursorEntries(ttlMs);

  // Check expiry
  const now = Date.now();
  if (now - payload.timestamp > ttlMs) {
    // Expired cursor — clean up stored data
    cursorStore.delete(storeKey);
    return null;
  }

  // Retrieve stored result set
  const stored = cursorStore.get(storeKey);
  if (!stored) return null;

  // Extract the requested page
  const start = payload.offset;
  const end = start + pageSize;
  const pageResults = stored.results.slice(start, end);

  if (pageResults.length === 0) {
    cursorStore.delete(storeKey);
    return null;
  }

  // Create a new cursor for the next page if there are more results
  let continuation: CursorInfo | null = null;
  if (end < stored.results.length) {
    const nextPayload: CursorPayload = {
      cursorKey: payload.cursorKey,
      offset: end,
      queryHash: payload.queryHash,
      timestamp: payload.timestamp, // Preserve original timestamp for TTL
    };
    continuation = {
      cursor: encodeCursor(nextPayload),
      remainingCount: stored.results.length - end,
    };
  }

  return { results: pageResults, continuation };
}

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
function buildProgressiveResponse(
  results: DisclosureResult[],
  pageSize: number = DEFAULT_PAGE_SIZE,
  query: string = '',
  options?: CursorOptions,
): ProgressiveResponse {
  if (!Array.isArray(results) || results.length === 0) {
    return {
      summaryLayer: { count: 0, digest: '0 results' },
      results: [],
      continuation: null,
    };
  }

  // When feature flag is OFF, return all results as snippets, no pagination
  if (!isProgressiveDisclosureEnabled()) {
    return {
      summaryLayer: generateSummaryLayer(results),
      results: extractSnippets(results),
      continuation: null,
    };
  }

  // First page of snippets
  const firstPage = results.slice(0, pageSize);
  const snippets = extractSnippets(firstPage);

  // Summary covers ALL results, not just the first page
  const summaryLayer = generateSummaryLayer(results);

  // Cursor for the remainder
  const continuation = createCursor(results, pageSize, query, options);

  return {
    summaryLayer,
    results: snippets,
    continuation,
  };
}

/**
 * Clear the cursor store. Useful for testing and cleanup.
 *
 * @returns Nothing.
 * @example
 * ```ts
 * clearCursorStore();
 * ```
 */
function clearCursorStore(): void {
  cursorStore.clear();
}

// -- Exports --

export {
  // Types
  type SummaryLayer,
  type Snippet,
  type CursorPayload,
  type CursorInfo,
  type ProgressiveResponse,
  type DisclosureResult,
  type CursorOptions,

  // Constants
  DEFAULT_PAGE_SIZE,
  DEFAULT_CURSOR_TTL_MS,
  SNIPPET_MAX_LENGTH,

  // Feature flag
  isProgressiveDisclosureEnabled,

  // Public API
  generateSummaryLayer,
  extractSnippets,
  createCursor,
  resolveCursor,
  buildProgressiveResponse,

  // Testing utilities
  clearCursorStore,

  // Internal helpers (exported for testing)
  hashQuery,
  encodeCursor,
  decodeCursor,
  classifyByConfidence,
  buildDigest,
};
