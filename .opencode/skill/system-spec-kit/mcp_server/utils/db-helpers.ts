// ---------------------------------------------------------------
// MODULE: Db Helpers
// ---------------------------------------------------------------
// UTILS: Database Helpers
// ---------------------------------------------------------------
// T304: Consolidated database access and error-coercion utilities
// to eliminate duplicate getDb()+null-check and instanceof Error
// patterns across handler files.
// ---------------------------------------------------------------

import * as vectorIndex from '../lib/search/vector-index';

/**
 * T304: Get the database instance, throwing if not initialized.
 *
 * Replaces the repeated pattern:
 * ```
 * const database = vectorIndex.getDb();
 * if (!database) {
 *   throw new Error('Database not initialized. Server may still be starting up.');
 * }
 * ```
 *
 * @returns Non-null database instance
 * @throws {Error} If the database is not initialized
 */
function requireDb(): NonNullable<ReturnType<typeof vectorIndex.getDb>> {
  const db = vectorIndex.getDb();
  if (!db) {
    throw new Error('Database not initialized. MCP server may not be running. Check server process is active, then retry.');
  }
  return db;
}

/**
 * T304: Coerce an unknown error value to a string message.
 *
 * Replaces the repeated pattern:
 * ```
 * const message = err instanceof Error ? err.message : String(err);
 * ```
 *
 * @param err - The caught error value (unknown type)
 * @returns The error message string
 */
function toErrorMessage(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}

export { requireDb, toErrorMessage };
