// ───────────────────────────────────────────────────────────────
// MODULE: Learned Triggers Schema Migration (R11)
// ───────────────────────────────────────────────────────────────
// Feature catalog: Learned relevance feedback
// Schema migration for the learned_triggers column.
//
// ALTER TABLE memory_index ADD COLUMN learned_triggers TEXT DEFAULT '[]';
//
// CRITICAL: This column MUST NOT be added to the FTS5 index.
// The column stores JSON array of { term, addedAt, source, expiresAt }
// Objects representing learned relevance feedback terms.
//
// Rollback: ALTER TABLE memory_index DROP COLUMN learned_triggers;
// (SQLite 3.35.0+)
import type { DatabaseExtended as Database } from '@spec-kit/shared/types';

// ───────────────────────────────────────────────────────────────
// 1. TYPES

// ───────────────────────────────────────────────────────────────
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

// ───────────────────────────────────────────────────────────────
// 2. CONSTANTS

// ───────────────────────────────────────────────────────────────
/** Column name for learned triggers (NOT in FTS5 index) */
export const LEARNED_TRIGGERS_COLUMN = 'learned_triggers';

/** Default value for the learned_triggers column */
export const LEARNED_TRIGGERS_DEFAULT = '[]';

// ───────────────────────────────────────────────────────────────
// 3. MIGRATION

// ───────────────────────────────────────────────────────────────
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
export function migrateLearnedTriggers(db: Database): boolean {
  try {
    // Check if column already exists using PRAGMA table_info
    const columns = db.prepare('PRAGMA table_info(memory_index)').all() as Array<{ name: string }>;
    const hasColumn = columns.some((col) => col.name === LEARNED_TRIGGERS_COLUMN);

    if (hasColumn) {
      return false; // Already migrated
    }

    db.exec(
      `ALTER TABLE memory_index ADD COLUMN ${LEARNED_TRIGGERS_COLUMN} TEXT DEFAULT '${LEARNED_TRIGGERS_DEFAULT}'`
    );

    console.warn('[learned-triggers-schema] Migration complete: learned_triggers column added');
    return true;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    // SQLite may report "duplicate column name" if run concurrently
    if (msg.includes('duplicate column')) {
      return false;
    }
    console.error(`[learned-triggers-schema] Migration failed: ${msg}`);
    throw error;
  }
}

// ───────────────────────────────────────────────────────────────
// 4. FTS5 ISOLATION VERIFICATION

// ───────────────────────────────────────────────────────────────
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
export function verifyFts5Isolation(db: Database): boolean {
  try {
    // Check if FTS5 table exists
    const ftsTable = db.prepare(
      `SELECT sql FROM sqlite_master WHERE type='table' AND name='memory_fts'`
    ).get() as { sql: string } | undefined;

    if (!ftsTable) {
      // FTS5 table does not exist; isolation trivially holds
      return true;
    }

    const createSql = ftsTable.sql.toLowerCase();

    // Check that learned_triggers does NOT appear in the FTS5 CREATE statement
    if (createSql.includes('learned_triggers')) {
      throw new Error(
        'CRITICAL: learned_triggers found in FTS5 index (memory_fts). ' +
        'This violates data isolation requirements. Learned triggers must ' +
        'ONLY exist in the memory_index.learned_triggers column, never in FTS5.'
      );
    }

    return true;
  } catch (error: unknown) {
    if (error instanceof Error && error.message.startsWith('CRITICAL:')) {
      throw error; // Re-throw critical violations
    }
    const msg = error instanceof Error ? error.message : String(error);
    console.error(`[learned-triggers-schema] FTS5 isolation check failed: ${msg}`);
    return false;
  }
}

// ───────────────────────────────────────────────────────────────
// 5. ROLLBACK

// ───────────────────────────────────────────────────────────────
/**
 * Drop the learned_triggers column from memory_index.
 * Requires SQLite 3.35.0+ which supports ALTER TABLE DROP COLUMN.
 *
 * @param db - SQLite database connection
 * @returns true if column was dropped, false if it did not exist
 */
export function rollbackLearnedTriggers(db: Database): boolean {
  try {
    // Check if column exists first
    const columns = db.prepare('PRAGMA table_info(memory_index)').all() as Array<{ name: string }>;
    const hasColumn = columns.some((col) => col.name === LEARNED_TRIGGERS_COLUMN);

    if (!hasColumn) {
      return false; // Nothing to rollback
    }

    db.exec(`ALTER TABLE memory_index DROP COLUMN ${LEARNED_TRIGGERS_COLUMN}`);
    console.warn('[learned-triggers-schema] Rollback complete: learned_triggers column removed');
    return true;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error(`[learned-triggers-schema] Rollback failed: ${msg}`);
    throw error;
  }
}

// ───────────────────────────────────────────────────────────────
// 6. HELPERS

// ───────────────────────────────────────────────────────────────
/**
 * Parse the learned_triggers JSON column value into typed entries.
 *
 * @param raw - Raw JSON string from the database column
 * @returns Parsed array of learned trigger entries
 */
export function parseLearnedTriggers(raw: string | null | undefined): LearnedTriggerEntry[] {
  if (!raw || raw === LEARNED_TRIGGERS_DEFAULT) {
    return [];
  }
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (e: unknown): e is LearnedTriggerEntry =>
        typeof e === 'object' && e !== null &&
        typeof (e as LearnedTriggerEntry).term === 'string' &&
        typeof (e as LearnedTriggerEntry).addedAt === 'number' &&
        typeof (e as LearnedTriggerEntry).expiresAt === 'number'
    );
  } catch {
    return [];
  }
}

/**
 * Serialize learned trigger entries to JSON for storage.
 *
 * @param entries - Array of learned trigger entries
 * @returns JSON string for database storage
 */
export function serializeLearnedTriggers(entries: LearnedTriggerEntry[]): string {
  return JSON.stringify(entries);
}
