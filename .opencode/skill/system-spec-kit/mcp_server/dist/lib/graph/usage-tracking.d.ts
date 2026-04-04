import type Database from 'better-sqlite3';
/**
 * Add access_count column to memory_index if not present.
 * Uses ALTER TABLE with try/catch for idempotency.
 */
export declare function ensureUsageColumn(db: Database.Database): void;
/**
 * Increment access count for a memory.
 * No-op if the memory ID does not exist.
 */
export declare function incrementAccessCount(db: Database.Database, memoryId: number): void;
/**
 * Get access count for a memory.
 * Returns 0 if the memory does not exist or on error.
 */
export declare function getAccessCount(db: Database.Database, memoryId: number): number;
//# sourceMappingURL=usage-tracking.d.ts.map