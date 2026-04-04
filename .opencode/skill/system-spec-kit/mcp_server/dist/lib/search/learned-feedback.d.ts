import type { DatabaseExtended as Database } from '@spec-kit/shared/types';
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
/** Feature flag environment variable name (graduated default ON) */
export declare const FEATURE_FLAG = "SPECKIT_LEARN_FROM_SELECTION";
/** Learned trigger query weight multiplier (0.7x of organic triggers) */
export declare const LEARNED_TRIGGER_WEIGHT = 0.7;
/** Maximum terms that can be learned from a single selection event (Safeguard #4) */
export declare const MAX_TERMS_PER_SELECTION = 3;
/** Maximum total learned terms per memory (Safeguard #4) */
export declare const MAX_TERMS_PER_MEMORY = 8;
/** TTL for learned terms in milliseconds: 30 days (Safeguard #2) */
export declare const LEARNED_TERM_TTL_MS: number;
/** TTL for learned terms in seconds: 30 days */
export declare const LEARNED_TERM_TTL_SECONDS: number;
/** Minimum memory age in milliseconds: 72 hours (Safeguard #7) */
export declare const MIN_MEMORY_AGE_MS: number;
/** Top-N results excluded from learning (Safeguard #5) */
export declare const TOP_N_EXCLUSION = 3;
/** Minimum term length to be learnable */
export declare const MIN_TERM_LENGTH = 3;
/**
 * Check if the learned relevance feedback feature is enabled.
 * Local gate behavior: disabled only when SPECKIT_LEARN_FROM_SELECTION is
 * explicitly set to "false".
 *
 * @returns true if SPECKIT_LEARN_FROM_SELECTION is not explicitly disabled
 */
export declare function isLearnedFeedbackEnabled(): boolean;
/**
 * Check if a memory is old enough to learn from (Safeguard #7).
 * Memories younger than 72 hours are excluded because they haven't
 * had enough time to establish relevance patterns.
 *
 * @param memoryAgeMs - Age of the memory in milliseconds
 * @returns true if the memory is old enough (>72h) to learn from
 */
export declare function isMemoryEligible(memoryAgeMs: number): boolean;
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
export declare function extractLearnableTerms(queryTerms: string[], existingTriggers: string[], denylist?: Set<string>): string[];
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
export declare function recordSelection(queryId: string, memoryId: number, queryTerms: string[], resultRank: number, db: Database): {
    terms: string[];
    applied: boolean;
    reason?: string;
};
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
export declare function applyLearnedTriggers(memoryId: number, terms: string[], db: Database, source?: string): boolean;
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
export declare function queryLearnedTriggers(query: string, db: Database): LearnedTriggerMatch[];
/**
 * Remove expired learned terms from all memories (Safeguard #2).
 * Terms older than 30 days are removed.
 *
 * @param db - SQLite database connection
 * @returns Number of memories that had expired terms removed
 */
export declare function expireLearnedTerms(db: Database): number;
/**
 * Clear ALL learned triggers from all memories (Safeguard #9 -- Rollback).
 * This is the nuclear option for rolling back all learned feedback.
 *
 * @param db - SQLite database connection
 * @returns Number of memories that had triggers cleared
 */
export declare function clearAllLearnedTriggers(db: Database): number;
/**
 * Retrieve the provenance audit log (Safeguard #10).
 *
 * @param memoryId - Optional: filter to a specific memory
 * @param limit - Maximum entries to return (default 50)
 * @returns Array of audit log entries
 */
export declare function getAuditLog(db: Database, memoryId?: number, limit?: number): AuditLogEntry[];
//# sourceMappingURL=learned-feedback.d.ts.map