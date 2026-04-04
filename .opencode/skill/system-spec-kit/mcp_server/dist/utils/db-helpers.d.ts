import * as vectorIndex from '../lib/search/vector-index.js';
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
declare function requireDb(): NonNullable<ReturnType<typeof vectorIndex.getDb>>;
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
declare function toErrorMessage(err: unknown): string;
export { requireDb, toErrorMessage };
//# sourceMappingURL=db-helpers.d.ts.map