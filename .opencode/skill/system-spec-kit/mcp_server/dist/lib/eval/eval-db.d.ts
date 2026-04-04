import Database from 'better-sqlite3';
declare const DEFAULT_DB_DIR: string;
declare const EVAL_DB_FILENAME = "speckit-eval.db";
/**
 * Initialize the evaluation database.
 * Creates the DB file in dataDir (same directory as main DB) and
 * ensures all 5 eval tables exist. Safe to call multiple times (idempotent).
 *
 * @param dataDir - Directory where the DB file will be created.
 *                  Defaults to same dir as main DB.
 */
declare function initEvalDb(dataDir?: string): Database.Database;
/**
 * Get the singleton eval DB instance.
 * Throws if initEvalDb() has not been called.
 */
declare function getEvalDb(): Database.Database;
/**
 * Get the path to the eval DB file.
 * Returns null if not yet initialized.
 */
declare function getEvalDbPath(): string | null;
/**
 * Close and reset the eval DB singleton (useful for tests).
 */
declare function closeEvalDb(): void;
export { initEvalDb, getEvalDb, getEvalDbPath, closeEvalDb, DEFAULT_DB_DIR, EVAL_DB_FILENAME, };
//# sourceMappingURL=eval-db.d.ts.map