import type { DatabaseExtended as Database } from '@spec-kit/shared/types';
/**
 * A single learned trigger entry stored in the learned_triggers JSON array.
 */
export interface LearnedTriggerEntry {
    /** The learned term */
    term: string;
    /** Unix timestamp (seconds) when this term was added */
    addedAt: number;
    /** Source identifier (e.g., query ID that led to this learning) */
    source: string;
    /** Unix timestamp (seconds) when this term expires (30-day TTL) */
    expiresAt: number;
}
/** Column name for learned triggers (NOT in FTS5 index) */
export declare const LEARNED_TRIGGERS_COLUMN = "learned_triggers";
/** Default value for the learned_triggers column */
export declare const LEARNED_TRIGGERS_DEFAULT = "[]";
/**
 * Add the learned_triggers column to memory_index if it does not already exist.
 * This migration is idempotent -- safe to run multiple times.
 *
 * CRITICAL: This column is stored on memory_index only. It is NOT added to
 * the memory_fts FTS5 virtual table. The FTS5 index columns are:
 *   title, trigger_phrases, file_path, content_text
 * learned_triggers is deliberately excluded to keep user-generated content
 * isolated from the organic search index.
 *
 * @param db - SQLite database connection
 * @returns true if migration ran (column was added), false if already present
 */
export declare function migrateLearnedTriggers(db: Database): boolean;
/**
 * CRITICAL test: Verify that learned_triggers is NOT present in the
 * FTS5 index (memory_fts). This is a safety check that should be run
 * after migration and during tests.
 *
 * The FTS5 virtual table memory_fts should only contain:
 *   title, trigger_phrases, file_path, content_text
 *
 * If learned_triggers appears in FTS5, it means user-generated feedback
 * has polluted the organic search index -- a data integrity violation.
 *
 * @param db - SQLite database connection
 * @returns true if isolation is verified (learned_triggers NOT in FTS5)
 * @throws Error if learned_triggers IS found in FTS5 (critical violation)
 */
export declare function verifyFts5Isolation(db: Database): boolean;
/**
 * Drop the learned_triggers column from memory_index.
 * Requires SQLite 3.35.0+ which supports ALTER TABLE DROP COLUMN.
 *
 * @param db - SQLite database connection
 * @returns true if column was dropped, false if it did not exist
 */
export declare function rollbackLearnedTriggers(db: Database): boolean;
/**
 * Parse the learned_triggers JSON column value into typed entries.
 *
 * @param raw - Raw JSON string from the database column
 * @returns Parsed array of learned trigger entries
 */
export declare function parseLearnedTriggers(raw: string | null | undefined): LearnedTriggerEntry[];
/**
 * Serialize learned trigger entries to JSON for storage.
 *
 * @param entries - Array of learned trigger entries
 * @returns JSON string for database storage
 */
export declare function serializeLearnedTriggers(entries: LearnedTriggerEntry[]): string;
//# sourceMappingURL=learned-triggers-schema.d.ts.map