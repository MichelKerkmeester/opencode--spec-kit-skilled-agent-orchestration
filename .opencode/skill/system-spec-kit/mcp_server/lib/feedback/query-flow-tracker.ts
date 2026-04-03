// ───────────────────────────────────────────────────────────────
// MODULE: Query Flow Tracker (REQ-014-001)
// ───────────────────────────────────────────────────────────────
// Tracks query history per session to detect reformulations and
// same-topic re-queries. Emits feedback events via the existing
// feedback ledger. Bounded in-memory session cache — no DB reads on hot path.
//
// Spec: 02--system-spec-kit/023-hybrid-rag-fusion-refinement/014-feedback-signal-pipeline
import type Database from 'better-sqlite3';
import {
  logFeedbackEvent,
  isImplicitFeedbackLogEnabled,
} from './feedback-ledger.js';
import type { FeedbackEvent } from './feedback-ledger.js';

/* ───────────────────────────────────────────────────────────────
   1. CONFIGURATION
──────────────────────────────────────────────────────────────── */

const MAX_QUERIES_PER_SESSION = 50;
const TTL_MS = 10 * 60 * 1000; // 10 minutes
const DEDUP_WINDOW_MS = 1000;  // ignore queries <1s apart
const FOLLOW_ON_WINDOW_MS = 60_000; // 60 seconds
const MIN_QUERY_LENGTH = 3;

// Similarity thresholds (Jaccard on normalized tokens)
const REFORMULATION_MIN = 0.3;  // similar enough to be related
const REFORMULATION_MAX = 0.8;  // but different enough to be a reformulation
const SAME_TOPIC_MIN = 0.8;     // very similar = same topic requery

/* ───────────────────────────────────────────────────────────────
   2. TYPES
──────────────────────────────────────────────────────────────── */

interface QueryEntry {
  tokens: Set<string>;
  timestamp: number;
  queryId: string;
  shownMemoryIds: string[];
}

interface FlowDetectionResult {
  type: 'query_reformulated' | 'same_topic_requery' | null;
  similarity: number;
  previousQueryId: string | null;
  previousMemoryIds: string[];
}

/* ───────────────────────────────────────────────────────────────
   3. SESSION QUERY CACHE
──────────────────────────────────────────────────────────────── */

const sessionQueries = new Map<string, QueryEntry[]>();

function evictStale(sessionId: string): void {
  const entries = sessionQueries.get(sessionId);
  if (!entries) return;
  const cutoff = Date.now() - TTL_MS;
  const fresh = entries.filter(e => e.timestamp > cutoff);
  if (fresh.length === 0) {
    sessionQueries.delete(sessionId);
  } else {
    // Keep only the last MAX_QUERIES_PER_SESSION entries
    sessionQueries.set(sessionId, fresh.slice(-MAX_QUERIES_PER_SESSION));
  }
}

/* ───────────────────────────────────────────────────────────────
   4. TOKEN SIMILARITY
──────────────────────────────────────────────────────────────── */

function tokenize(query: string): Set<string> {
  return new Set(
    query
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(t => t.length > 1)
  );
}

function jaccardSimilarity(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 && b.size === 0) return 1;
  let intersection = 0;
  for (const token of a) {
    if (b.has(token)) intersection++;
  }
  const union = a.size + b.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

/* ───────────────────────────────────────────────────────────────
   5. FLOW DETECTION
──────────────────────────────────────────────────────────────── */

/**
 * Detect if the current query is a reformulation or same-topic requery
 * relative to the most recent query in this session.
 */
function detectFlow(
  sessionId: string,
  tokens: Set<string>,
  timestamp: number,
): FlowDetectionResult {
  const entries = sessionQueries.get(sessionId);
  if (!entries || entries.length === 0) {
    return { type: null, similarity: 0, previousQueryId: null, previousMemoryIds: [] };
  }

  const previous = entries[entries.length - 1];

  // Dedup: skip if query is identical or too fast
  if (timestamp - previous.timestamp < DEDUP_WINDOW_MS) {
    return { type: null, similarity: 0, previousQueryId: null, previousMemoryIds: [] };
  }

  const similarity = jaccardSimilarity(tokens, previous.tokens);

  if (similarity >= SAME_TOPIC_MIN) {
    return {
      type: 'same_topic_requery',
      similarity,
      previousQueryId: previous.queryId,
      previousMemoryIds: previous.shownMemoryIds,
    };
  }

  if (similarity >= REFORMULATION_MIN && similarity < REFORMULATION_MAX) {
    return {
      type: 'query_reformulated',
      similarity,
      previousQueryId: previous.queryId,
      previousMemoryIds: previous.shownMemoryIds,
    };
  }

  return { type: null, similarity, previousQueryId: null, previousMemoryIds: [] };
}

/* ───────────────────────────────────────────────────────────────
   6. PUBLIC API
──────────────────────────────────────────────────────────────── */

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
export function trackQueryAndDetect(
  db: Database.Database,
  sessionId: string | null,
  query: string,
  queryId: string,
  shownMemoryIds: string[],
): FlowDetectionResult | null {
  if (!isImplicitFeedbackLogEnabled()) return null;
  if (!sessionId) return null;
  if (query.length < MIN_QUERY_LENGTH) return null;

  const timestamp = Date.now();
  const tokens = tokenize(query);

  // Evict stale entries
  evictStale(sessionId);

  // Detect flow before adding current query
  const detection = detectFlow(sessionId, tokens, timestamp);

  // Add current query to history
  const entries = sessionQueries.get(sessionId) ?? [];
  entries.push({ tokens, timestamp, queryId, shownMemoryIds });
  sessionQueries.set(sessionId, entries.slice(-MAX_QUERIES_PER_SESSION));

  // Emit feedback events for detected patterns
  if (detection.type && detection.previousMemoryIds.length > 0) {
    const confidence = detection.type === 'query_reformulated' ? 'medium' : 'weak';
    for (const memoryId of detection.previousMemoryIds) {
      const event: FeedbackEvent = {
        type: detection.type,
        memoryId,
        queryId: detection.previousQueryId ?? queryId,
        confidence,
        timestamp,
        sessionId,
      };
      logFeedbackEvent(db, event);
    }
  }

  return detection;
}

/**
 * Log `result_cited` events for memories whose content was loaded.
 * Call when includeContent=true and results contain content.
 */
export function logResultCited(
  db: Database.Database,
  sessionId: string | null,
  queryId: string,
  memoryIds: string[],
): void {
  if (!isImplicitFeedbackLogEnabled()) return;
  if (memoryIds.length === 0) return;

  const timestamp = Date.now();
  for (const memoryId of memoryIds) {
    logFeedbackEvent(db, {
      type: 'result_cited',
      memoryId,
      queryId,
      confidence: 'strong',
      timestamp,
      sessionId: sessionId ?? null,
    });
  }
}

/**
 * Log `follow_on_tool_use` events for memories shown in a recent search.
 * Call when any non-search tool is invoked within the follow-on window.
 */
export function logFollowOnToolUse(
  db: Database.Database,
  sessionId: string | null,
): void {
  if (!isImplicitFeedbackLogEnabled()) return;
  if (!sessionId) return;

  const entries = sessionQueries.get(sessionId);
  if (!entries || entries.length === 0) return;

  const latest = entries[entries.length - 1];
  const elapsed = Date.now() - latest.timestamp;

  if (elapsed > FOLLOW_ON_WINDOW_MS) return;
  if (latest.shownMemoryIds.length === 0) return;

  const timestamp = Date.now();
  for (const memoryId of latest.shownMemoryIds) {
    logFeedbackEvent(db, {
      type: 'follow_on_tool_use',
      memoryId,
      queryId: latest.queryId,
      confidence: 'strong',
      timestamp,
      sessionId,
    });
  }
}

/**
 * Clear query history for a session (e.g., on session cleanup).
 */
export function clearSession(sessionId: string): void {
  sessionQueries.delete(sessionId);
}

/**
 * Get current session query count (for testing/diagnostics).
 */
export function getSessionQueryCount(sessionId: string): number {
  return sessionQueries.get(sessionId)?.length ?? 0;
}
