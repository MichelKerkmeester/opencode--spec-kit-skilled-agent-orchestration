// ───────────────────────────────────────────────────────────────
// MODULE: Learned Feedback
// ───────────────────────────────────────────────────────────────
// Feature catalog: Learned relevance feedback
//
//
// Learns from user memory selections to improve future search results.
// Writes to a SEPARATE `learned_triggers` column (NOT FTS5 index).
//
// 10 Safeguards:
// 1. Separate column -- `learned_triggers` TEXT column, NOT in FTS5 index
// 2. 30-day TTL -- learned terms expire after 30 days
// 3. 100+ stop words denylist -- prevent noise injection
// 4. Rate cap -- max 3 terms per selection, max 8 terms per memory
// 5. Top-3 exclusion -- only learn from selections NOT already in top 3
// 6. 1-week shadow period -- log but don't apply for first week
// 7. Exclude <72h memories -- too new to learn from
// 8. Sprint gate review -- manual review before enabling
// 9. Rollback mechanism -- can clear all learned triggers
// 10. Provenance/audit log -- track what was learned and why
//
// Query weight: 0.7x (learned triggers weighted lower than organic triggers)
// Feature flag: SPECKIT_LEARN_FROM_SELECTION (graduated default ON;
// Disabled only when explicitly set to "false")
import type { DatabaseExtended as Database } from '@spec-kit/shared/types';
import { DENYLIST, isOnDenylist } from './feedback-denylist.js';
import {
  parseLearnedTriggers,
  serializeLearnedTriggers,
  type LearnedTriggerEntry,
} from '../storage/learned-triggers-schema.js';

// ───────────────────────────────────────────────────────────────
// 2. TYPES


// ───────────────────────────────────────────────────────────────
export type { Database };

/** Selection event recorded when a user selects a search result. */
export interface SelectionEvent {
  queryId: string;
  memoryId: number;
  queryTerms: string[];
  resultRank: number;
  timestamp: number;
}

/** Audit log entry tracking what was learned and why. */
export interface AuditLogEntry {
  memoryId: number;
  action: 'add' | 'expire' | 'clear';
  terms: string[];
  source: string;
  timestamp: number;
  shadowMode: boolean;
}

/** Result of a learned trigger query with 0.7x weighting. */
export interface LearnedTriggerMatch {
  memoryId: number;
  matchedTerms: string[];
  weight: number;
}

// ───────────────────────────────────────────────────────────────
// 3. CONSTANTS


// ───────────────────────────────────────────────────────────────
/** Feature flag environment variable name (graduated default ON) */
export const FEATURE_FLAG = 'SPECKIT_LEARN_FROM_SELECTION';

/** Learned trigger query weight multiplier (0.7x of organic triggers) */
export const LEARNED_TRIGGER_WEIGHT = 0.7;

/** Maximum terms that can be learned from a single selection event (Safeguard #4) */
export const MAX_TERMS_PER_SELECTION = 3;

/** Maximum total learned terms per memory (Safeguard #4) */
export const MAX_TERMS_PER_MEMORY = 8;

/** TTL for learned terms in milliseconds: 30 days (Safeguard #2) */
export const LEARNED_TERM_TTL_MS = 30 * 24 * 60 * 60 * 1000;

/** TTL for learned terms in seconds: 30 days */
export const LEARNED_TERM_TTL_SECONDS = 30 * 24 * 60 * 60;

/** Minimum memory age in milliseconds: 72 hours (Safeguard #7) */
export const MIN_MEMORY_AGE_MS = 72 * 60 * 60 * 1000;

/** Top-N results excluded from learning (Safeguard #5) */
export const TOP_N_EXCLUSION = 3;

/** Minimum term length to be learnable */
export const MIN_TERM_LENGTH = 3;

// ───────────────────────────────────────────────────────────────
// 4. AUDIT LOG TABLE


// ───────────────────────────────────────────────────────────────
const AUDIT_TABLE_SQL = `
  CREATE TABLE IF NOT EXISTS learned_feedback_audit (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    memory_id INTEGER NOT NULL,
    action TEXT NOT NULL,
    terms TEXT NOT NULL,
    source TEXT NOT NULL,
    timestamp INTEGER NOT NULL,
    shadow_mode INTEGER NOT NULL DEFAULT 0
  )
`;

/**
 * Ensure the audit log table exists (idempotent).
 *
 * @param db - SQLite database connection
 */
function ensureAuditTable(db: Database): void {
  try {
    db.exec(AUDIT_TABLE_SQL);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error(`[learned-feedback] Failed to create audit table: ${msg}`);
  }
}

/**
 * SQL for partial covering index on learned_triggers (A2-P2-4).
 * Avoids full-table scan in queryLearnedTriggers / expireLearnedTerms / clearAll.
 * Only indexes rows that actually have learned trigger data.
 */
const LEARNED_TRIGGERS_INDEX_SQL = `
  CREATE INDEX IF NOT EXISTS idx_memory_learned_triggers
  ON memory_index(id, learned_triggers)
  WHERE learned_triggers IS NOT NULL AND learned_triggers != '[]'
`;

let _learnedTriggersIndexEnsured = false;

/**
 * Ensure the partial index on learned_triggers exists (idempotent, once per process).
 *
 * @param db - SQLite database connection
 */
function ensureLearnedTriggersIndex(db: Database): void {
  if (_learnedTriggersIndexEnsured) return;
  try {
    db.exec(LEARNED_TRIGGERS_INDEX_SQL);
    _learnedTriggersIndexEnsured = true;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error(`[learned-feedback] Failed to create learned_triggers index: ${msg}`);
  }
}

/* ───────────────────────────────────────────────────────────────
   4. FEATURE FLAG & GATING
   ──────────────────────────────────────────────────────────────── */

/**
 * Check if the learned relevance feedback feature is enabled.
 * Local gate behavior: disabled only when SPECKIT_LEARN_FROM_SELECTION is
 * explicitly set to "false".
 *
 * @returns true if SPECKIT_LEARN_FROM_SELECTION is not explicitly disabled
 */
export function isLearnedFeedbackEnabled(): boolean {
  return process.env[FEATURE_FLAG]?.toLowerCase() !== 'false';
}

/**
 * Check if a memory is old enough to learn from (Safeguard #7).
 * Memories younger than 72 hours are excluded because they haven't
 * had enough time to establish relevance patterns.
 *
 * @param memoryAgeMs - Age of the memory in milliseconds
 * @returns true if the memory is old enough (>72h) to learn from
 */
export function isMemoryEligible(memoryAgeMs: number): boolean {
  return memoryAgeMs >= MIN_MEMORY_AGE_MS;
}

// ───────────────────────────────────────────────────────────────
// 5. TERM EXTRACTION


// ───────────────────────────────────────────────────────────────
/**
 * Extract learnable terms from query terms, filtering against the denylist
 * and existing triggers (Safeguards #3, #4).
 *
 * Rules:
 * - Terms must NOT be on the 100+ word denylist
 * - Terms must NOT already exist as organic trigger phrases
 * - Terms must be at least MIN_TERM_LENGTH characters
 * - Maximum MAX_TERMS_PER_SELECTION (3) terms returned per call
 *
 * @param queryTerms - Terms from the user's search query
 * @param existingTriggers - Current trigger phrases already on the memory
 * @param denylist - The stop words denylist (defaults to module DENYLIST)
 * @returns Array of terms suitable for learning (max 3)
 */
export function extractLearnableTerms(
  queryTerms: string[],
  existingTriggers: string[],
  denylist: Set<string> = DENYLIST
): string[] {
  const existingLower = new Set(existingTriggers.map((t) => t.toLowerCase().trim()));

  const candidates = queryTerms
    .map((t) => t.toLowerCase().trim())
    .filter((term) => {
      // Must meet minimum length
      if (term.length < MIN_TERM_LENGTH) return false;
      // Must not be on denylist (Safeguard #3)
      if (denylist.has(term)) return false;
      // Must not already be an organic trigger
      if (existingLower.has(term)) return false;
      // Must be alphanumeric (no symbols/punctuation only)
      if (!/[a-z0-9]/.test(term)) return false;
      return true;
    });

  // Deduplicate
  const unique = [...new Set(candidates)];

  // Rate cap: max 3 per selection (Safeguard #4)
  return unique.slice(0, MAX_TERMS_PER_SELECTION);
}

// ───────────────────────────────────────────────────────────────
// 6. CORE OPERATIONS


// ───────────────────────────────────────────────────────────────
/**
 * Record a user selection and learn from it (Safeguards #1-#10).
 *
 * This is the main entry point for the feedback loop. When a user selects
 * a search result, this function:
 * 1. Checks if the feature is enabled (Safeguard #8)
 * 2. Checks if the result was NOT in the top-3 (Safeguard #5)
 * 3. Checks if the memory is old enough (Safeguard #7)
 * 4. Extracts learnable terms (Safeguards #3, #4)
 * 5. Applies or logs depending on shadow period (Safeguard #6)
 * 6. Writes to audit log (Safeguard #10)
 *
 * @param queryId - Unique identifier for the search query
 * @param memoryId - ID of the selected memory
 * @param queryTerms - Terms from the user's search query
 * @param resultRank - The rank position of this result (1-based)
 * @param db - SQLite database connection
 * @returns Object with learned terms and whether they were applied
 */
export function recordSelection(
  queryId: string,
  memoryId: number,
  queryTerms: string[],
  resultRank: number,
  db: Database
): { terms: string[]; applied: boolean; reason?: string } {
  try {
    // Safeguard #8: Feature must be enabled
    if (!isLearnedFeedbackEnabled()) {
      return { terms: [], applied: false, reason: 'feature_disabled' };
    }

    // Safeguard #5: Only learn from selections NOT in top-3
    if (resultRank <= TOP_N_EXCLUSION) {
      return { terms: [], applied: false, reason: 'top_3_exclusion' };
    }

    // Safeguard #7: Check memory age
    const memory = db.prepare(
      'SELECT created_at, trigger_phrases, learned_triggers FROM memory_index WHERE id = ?'
    ).get(memoryId) as { created_at?: string; trigger_phrases?: string; learned_triggers?: string } | undefined;

    if (!memory) {
      return { terms: [], applied: false, reason: 'memory_not_found' };
    }

    if (memory.created_at) {
      const ageMs = Date.now() - new Date(memory.created_at).getTime();
      if (!isMemoryEligible(ageMs)) {
        return { terms: [], applied: false, reason: 'memory_too_new' };
      }
    }

    // Extract existing organic triggers
    let existingTriggers: string[] = [];
    if (memory.trigger_phrases) {
      if (Array.isArray(memory.trigger_phrases)) {
        existingTriggers = memory.trigger_phrases;
      } else {
        try {
          const parsed = JSON.parse(memory.trigger_phrases);
          existingTriggers = Array.isArray(parsed) ? parsed : [memory.trigger_phrases];
        } catch (_error: unknown) {
          existingTriggers = memory.trigger_phrases.split(',').map((t: string) => t.trim());
        }
      }
    }

    // Extract learnable terms (Safeguards #3, #4)
    const terms = extractLearnableTerms(queryTerms, existingTriggers);

    if (terms.length === 0) {
      return { terms: [], applied: false, reason: 'no_learnable_terms' };
    }

    const now = Date.now();
    const shadowMode = isInShadowPeriod(db);

    // Ensure audit table exists (Safeguard #10)
    ensureAuditTable(db);

    // Log to audit (Safeguard #10)
    db.prepare(
      'INSERT INTO learned_feedback_audit (memory_id, action, terms, source, timestamp, shadow_mode) VALUES (?, ?, ?, ?, ?, ?)'
    ).run(memoryId, 'add', JSON.stringify(terms), queryId, now, shadowMode ? 1 : 0);

    // Safeguard #6: Shadow period is log-only end-to-end (no persistence/apply effects)
    if (shadowMode) {
      return { terms, applied: false, reason: 'shadow_period' };
    }

    // Apply learned triggers (Safeguard #1 -- separate column, NOT FTS5)
    // F-04 — applyLearnedTriggers swallowed errors and returned void,
    // So recordSelection always returned applied: true even on failure.
    // Now propagate success/failure from the callee.
    const applied = applyLearnedTriggers(memoryId, terms, db, queryId);

    return { terms, applied };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error(`[learned-feedback] recordSelection failed: ${msg}`);
    return { terms: [], applied: false, reason: 'error' };
  }
}

/**
 * Apply learned trigger terms to a memory's learned_triggers column.
 * Respects the rate cap of MAX_TERMS_PER_MEMORY (Safeguard #4).
 *
 * CRITICAL: Writes ONLY to memory_index.learned_triggers column,
 * NEVER to the FTS5 index (Safeguard #1).
 *
 * @param memoryId - ID of the memory to update
 * @param terms - Terms to add as learned triggers
 * @param db - SQLite database connection
 * @param source - Source identifier for provenance tracking
 */
export function applyLearnedTriggers(
  memoryId: number,
  terms: string[],
  db: Database,
  source: string = 'unknown'
): boolean {
  try {
    const row = db.prepare(
      'SELECT learned_triggers FROM memory_index WHERE id = ?'
    ).get(memoryId) as { learned_triggers?: string } | undefined;

    if (!row) {
      throw new Error(`Memory not found: ${memoryId}`);
    }

    const existing = parseLearnedTriggers(row.learned_triggers);
    const existingTerms = new Set(existing.map((e) => e.term.toLowerCase()));

    const nowSeconds = Math.floor(Date.now() / 1000);
    const expiresAt = nowSeconds + LEARNED_TERM_TTL_SECONDS;

    // Filter out already-learned terms and respect rate cap (Safeguard #4)
    const newEntries: LearnedTriggerEntry[] = [];
    for (const term of terms) {
      const normalizedTerm = term.toLowerCase();
      if (existingTerms.has(normalizedTerm)) continue;
      if (existing.length + newEntries.length >= MAX_TERMS_PER_MEMORY) break;

      newEntries.push({
        term: normalizedTerm,
        addedAt: nowSeconds,
        source,
        expiresAt,
      });
      // Prevent duplicate insertions from repeated terms in a single call.
      existingTerms.add(normalizedTerm);
    }

    if (newEntries.length === 0) return true;

    const updated = [...existing, ...newEntries];
    const serialized = serializeLearnedTriggers(updated);

    // CRITICAL: Update ONLY the learned_triggers column on memory_index.
    // Do NOT touch memory_fts or any FTS5 table (Safeguard #1).
    db.prepare(
      'UPDATE memory_index SET learned_triggers = ? WHERE id = ?'
    ).run(serialized, memoryId);
    return true;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error(`[learned-feedback] applyLearnedTriggers failed for memory ${memoryId}: ${msg}`);
    return false;
  }
}

/** Shadow period duration: 7 days in milliseconds (Safeguard #6). */
const SHADOW_PERIOD_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Check if the system is still within the 1-week shadow period (Safeguard #6).
 * Computes the earliest audit timestamp; if the system is less than 7 days old,
 * learned feedback should be logged but not applied.
 *
 * @param db - SQLite database connection
 * @returns true if still in shadow period (boosts should NOT be applied)
 */
function isInShadowPeriod(db: Database): boolean {
  try {
    ensureAuditTable(db);
    const row = db.prepare(
      'SELECT MIN(timestamp) AS earliest FROM learned_feedback_audit'
    ).get() as { earliest: number | null } | undefined;

    if (!row?.earliest) {
      // No audit entries yet — system is brand new, treat as shadow period
      return true;
    }

    const ageMs = Date.now() - row.earliest;
    return ageMs < SHADOW_PERIOD_MS;
  } catch (_error: unknown) {
    // On error, be conservative: assume shadow period to avoid premature boosting
    return true;
  }
}

/**
 * Query learned triggers for search results, applying 0.7x weight.
 *
 * Searches the learned_triggers column (NOT FTS5) for matches against
 * the query terms. Returns matching memories with a weighted score.
 *
 * @param query - Search query string
 * @param db - SQLite database connection
 * @returns Array of matching memories with 0.7x weighted scores
 */
export function queryLearnedTriggers(
  query: string,
  db: Database
): LearnedTriggerMatch[] {
  try {
    if (!isLearnedFeedbackEnabled()) {
      return [];
    }

    // Safeguard #6 — 1-week shadow period. Compute earliest audit timestamp;
    // If system is less than 7 days old, log but don't apply learned feedback.
    if (isInShadowPeriod(db)) {
      return [];
    }

    const queryTerms = query
      .toLowerCase()
      .split(/\s+/)
      .filter((t) => t.length >= MIN_TERM_LENGTH && !isOnDenylist(t));

    if (queryTerms.length === 0) return [];

    // Ensure partial index exists to avoid full-table scan (A2-P2-4)
    ensureLearnedTriggersIndex(db);

    // Fetch memories that have learned triggers (uses idx_memory_learned_triggers partial index)
    const rows = db.prepare(
      `SELECT id, learned_triggers FROM memory_index WHERE learned_triggers IS NOT NULL AND learned_triggers != '[]'`
    ).all() as Array<{ id: number; learned_triggers: string }>;

    const matches: LearnedTriggerMatch[] = [];
    const nowSeconds = Math.floor(Date.now() / 1000);

    for (const row of rows) {
      const entries = parseLearnedTriggers(row.learned_triggers);
      // Filter out expired terms (Safeguard #2)
      const validEntries = entries.filter((e) => e.expiresAt > nowSeconds);

      const matchedTerms = validEntries
        .filter((entry) => queryTerms.some((qt) => entry.term.includes(qt) || qt.includes(entry.term)))
        .map((entry) => entry.term);

      if (matchedTerms.length > 0) {
        matches.push({
          memoryId: row.id,
          matchedTerms,
          weight: LEARNED_TRIGGER_WEIGHT * (matchedTerms.length / queryTerms.length),
        });
      }
    }

    return matches;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error(`[learned-feedback] queryLearnedTriggers failed: ${msg}`);
    return [];
  }
}

// ───────────────────────────────────────────────────────────────
// 7. MAINTENANCE


// ───────────────────────────────────────────────────────────────
/**
 * Remove expired learned terms from all memories (Safeguard #2).
 * Terms older than 30 days are removed.
 *
 * @param db - SQLite database connection
 * @returns Number of memories that had expired terms removed
 */
export function expireLearnedTerms(db: Database): number {
  try {
    ensureLearnedTriggersIndex(db);
    const rows = db.prepare(
      `SELECT id, learned_triggers FROM memory_index WHERE learned_triggers IS NOT NULL AND learned_triggers != '[]'`
    ).all() as Array<{ id: number; learned_triggers: string }>;

    const nowSeconds = Math.floor(Date.now() / 1000);
    let affectedCount = 0;

    ensureAuditTable(db);

    for (const row of rows) {
      const entries = parseLearnedTriggers(row.learned_triggers);
      const valid = entries.filter((e) => e.expiresAt > nowSeconds);
      const expired = entries.filter((e) => e.expiresAt <= nowSeconds);

      if (expired.length > 0) {
        // Log expired terms to audit (Safeguard #10)
        db.prepare(
          'INSERT INTO learned_feedback_audit (memory_id, action, terms, source, timestamp, shadow_mode) VALUES (?, ?, ?, ?, ?, ?)'
        ).run(
          row.id,
          'expire',
          JSON.stringify(expired.map((e) => e.term)),
          'ttl_expiry',
          Date.now(),
          0
        );

        // Update the column with only valid entries
        db.prepare(
          'UPDATE memory_index SET learned_triggers = ? WHERE id = ?'
        ).run(serializeLearnedTriggers(valid), row.id);

        affectedCount++;
      }
    }

    return affectedCount;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error(`[learned-feedback] expireLearnedTerms failed: ${msg}`);
    return 0;
  }
}

/**
 * Clear ALL learned triggers from all memories (Safeguard #9 -- Rollback).
 * This is the nuclear option for rolling back all learned feedback.
 *
 * @param db - SQLite database connection
 * @returns Number of memories that had triggers cleared
 */
export function clearAllLearnedTriggers(db: Database): number {
  try {
    ensureAuditTable(db);
    ensureLearnedTriggersIndex(db);

    // Log the rollback to audit (Safeguard #10)
    const rows = db.prepare(
      `SELECT id, learned_triggers FROM memory_index WHERE learned_triggers IS NOT NULL AND learned_triggers != '[]'`
    ).all() as Array<{ id: number; learned_triggers: string }>;

    for (const row of rows) {
      const entries = parseLearnedTriggers(row.learned_triggers);
      if (entries.length > 0) {
        db.prepare(
          'INSERT INTO learned_feedback_audit (memory_id, action, terms, source, timestamp, shadow_mode) VALUES (?, ?, ?, ?, ?, ?)'
        ).run(
          row.id,
          'clear',
          JSON.stringify(entries.map((e) => e.term)),
          'rollback',
          Date.now(),
          0
        );
      }
    }

    // Reset all learned_triggers to empty
    const result = db.prepare(
      `UPDATE memory_index SET learned_triggers = '[]' WHERE learned_triggers IS NOT NULL AND learned_triggers != '[]'`
    ).run();

    const count = result.changes ?? 0;
    console.warn(`[learned-feedback] Rollback complete: cleared learned triggers from ${count} memories`);
    return count;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error(`[learned-feedback] clearAllLearnedTriggers failed: ${msg}`);
    return 0;
  }
}

// ───────────────────────────────────────────────────────────────
// 8. AUDIT LOG


// ───────────────────────────────────────────────────────────────
/**
 * Retrieve the provenance audit log (Safeguard #10).
 *
 * @param memoryId - Optional: filter to a specific memory
 * @param limit - Maximum entries to return (default 50)
 * @returns Array of audit log entries
 */
export function getAuditLog(
  db: Database,
  memoryId?: number,
  limit: number = 50
): AuditLogEntry[] {
  try {
    ensureAuditTable(db);

    let sql: string;
    let params: (number | string)[];

    if (memoryId !== undefined) {
      sql = 'SELECT * FROM learned_feedback_audit WHERE memory_id = ? ORDER BY timestamp DESC LIMIT ?';
      params = [memoryId, limit];
    } else {
      sql = 'SELECT * FROM learned_feedback_audit ORDER BY timestamp DESC LIMIT ?';
      params = [limit];
    }

    const rows = db.prepare(sql).all(...params) as Array<{
      memory_id: number;
      action: string;
      terms: string;
      source: string;
      timestamp: number;
      shadow_mode: number;
    }>;

    return rows.map((row) => ({
      memoryId: row.memory_id,
      action: row.action as AuditLogEntry['action'],
      terms: JSON.parse(row.terms) as string[],
      source: row.source,
      timestamp: row.timestamp,
      shadowMode: row.shadow_mode === 1,
    }));
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error(`[learned-feedback] getAuditLog failed: ${msg}`);
    return [];
  }
}
