import type Database from 'better-sqlite3';
/**
 * Describes the HistoryEntry shape.
 */
export interface HistoryEntry {
    id: string;
    memory_id: number;
    spec_folder: string | null;
    prev_value: string | null;
    new_value: string | null;
    event: 'ADD' | 'UPDATE' | 'DELETE';
    timestamp: string;
    is_deleted: number;
    actor: string;
}
/**
 * Describes the HistoryStats shape.
 */
export interface HistoryStats {
    total: number;
    adds: number;
    updates: number;
    deletes: number;
}
/**
 * Normalized history event shape for lineage backfill/replay helpers.
 */
export interface HistoryLineageEvent {
    id: string;
    memoryId: number;
    event: 'ADD' | 'UPDATE' | 'DELETE';
    timestamp: string;
    actor: string;
    prevValue: string | null;
    newValue: string | null;
}
export interface LineageTransitionAnchor {
    memory_id: number;
    event: 'ADD' | 'UPDATE' | 'DELETE';
    timestamp: string;
    actor: string;
}
/**
 * Provides the init helper.
 */
export declare function init(database: Database.Database): void;
/**
 * Provides the generateUuid helper.
 */
export declare function generateUuid(): string;
/**
 * Provides the recordHistory helper.
 */
export declare function recordHistory(memoryId: number, event: 'ADD' | 'UPDATE' | 'DELETE', prevValue: unknown, newValue: unknown, actor: string, specFolder?: string | null): string;
/**
 * Provides the getHistory helper.
 */
export declare function getHistory(memoryId: number, limit?: number): HistoryEntry[];
/**
 * Returns chronological history events for lineage backfill/replay helpers.
 */
export declare function getHistoryEventsForLineage(memoryId: number, databaseOverride?: Database.Database | null): HistoryLineageEvent[];
/**
 * Returns the lightweight history facts used to bridge legacy history into
 * Lineage inspection and backfill metadata.
 */
export declare function getLineageTransitionAnchors(memoryId: number): LineageTransitionAnchor[];
/**
 * Provides the getHistoryStats helper.
 */
export declare function getHistoryStats(specFolder?: string): HistoryStats;
//# sourceMappingURL=history.d.ts.map