import type { DatabaseExtended } from '@spec-kit/shared/types';
import type { GraphSearchFn } from '../lib/search/search-types.js';
/** Minimal vector index interface for database operations */
type VectorSearchFn = (embedding: Float32Array | number[], options: Record<string, unknown>) => Array<Record<string, unknown>>;
export interface VectorIndexLike {
    initializeDb(): void;
    getDb(): DatabaseLike | null;
    closeDb?(): void;
    vectorSearch?: VectorSearchFn;
    onDatabaseConnectionChange?: (listener: (database: DatabaseLike) => void) => (() => void);
}
/** Canonical DB type shared across MCP runtime modules */
export type DatabaseLike = DatabaseExtended;
/** Checkpoints module interface */
export interface CheckpointsLike {
    init(database: DatabaseLike): void;
}
/** Access tracker module interface */
export interface AccessTrackerLike {
    init(database: DatabaseLike): void;
}
/** Hybrid search module interface */
export interface HybridSearchLike {
    init(database: DatabaseLike, vectorSearch: VectorSearchFn | undefined, graphSearch?: GraphSearchFn | null): void;
}
/** Session manager module interface */
export interface SessionManagerLike {
    init(database: DatabaseLike): {
        success: boolean;
        error?: string;
    };
}
/** Incremental index module interface */
export interface IncrementalIndexLike {
    init(database: DatabaseLike): void;
}
/** Generic DB consumer interface for modules that cache DB handles internally. */
export interface DatabaseConsumerLike {
    init(database: DatabaseLike): unknown;
}
/** Dependencies for db-state initialization */
export interface DbStateDeps {
    vectorIndex?: VectorIndexLike;
    checkpoints?: CheckpointsLike;
    accessTracker?: AccessTrackerLike;
    hybridSearch?: HybridSearchLike;
    sessionManager?: SessionManagerLike;
    incrementalIndex?: IncrementalIndexLike;
    graphSearchFn?: GraphSearchFn | null;
    dbConsumers?: DatabaseConsumerLike[];
}
type DatabaseRebindListener = (database: DatabaseLike) => void;
export declare function registerDatabaseRebindListener(listener: DatabaseRebindListener): () => void;
/** Initialize db-state with module dependencies for database lifecycle management. */
export declare function init(deps: DbStateDeps): void;
/** Check if the database was updated externally and reinitialize if needed. */
export declare function checkDatabaseUpdated(): Promise<boolean>;
/** Close and reinitialize the database connection, refreshing all dependent module handles. */
export declare function reinitializeDatabase(updatedMarkerTime?: number): Promise<boolean>;
export interface IndexScanLeaseResult {
    acquired: boolean;
    reason: 'ok' | 'cooldown' | 'lease_active';
    waitSeconds: number;
    lastIndexScan: number;
    scanStartedAt: number;
    leaseExpiryMs: number;
    cooldownMs: number;
}
/**
 * Acquire the index-scan lease atomically.
 *
 * The lease blocks overlapping scans via `scan_started_at` and preserves
 * cooldown via `last_index_scan`. Stale leases are automatically expired.
 */
export declare function acquireIndexScanLease(options?: {
    now?: number;
    cooldownMs?: number;
    leaseExpiryMs?: number;
}): Promise<IndexScanLeaseResult>;
/** Complete an index scan and convert active lease to last_index_scan timestamp. */
export declare function completeIndexScanLease(time: number): Promise<void>;
/** Retrieve the timestamp of the last index scan from the config table. */
export declare function getLastScanTime(): Promise<number>;
/** Persist the timestamp of the last index scan to the config table. */
export declare function setLastScanTime(time: number): Promise<void>;
/** Return whether the embedding model has been marked as ready. */
export declare function isEmbeddingModelReady(): boolean;
/** Set the embedding model readiness flag. */
export declare function setEmbeddingModelReady(ready: boolean): void;
/** Poll until the embedding model is ready, returning false on timeout. */
export declare function waitForEmbeddingModel(timeoutMs?: number): Promise<boolean>;
/** Return the cached constitutional memory entries, or null if not cached. */
export declare function getConstitutionalCache(): unknown;
/** Update the constitutional memory cache and record the current timestamp. */
export declare function setConstitutionalCache(cache: unknown): void;
/** Return the timestamp when the constitutional cache was last populated. */
export declare function getConstitutionalCacheTime(): number;
/** Invalidate the constitutional cache, forcing a fresh fetch on next access. */
export declare function clearConstitutionalCache(): void;
export {};
//# sourceMappingURL=db-state.d.ts.map