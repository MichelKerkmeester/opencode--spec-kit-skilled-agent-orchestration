import type Database from 'better-sqlite3';
export interface Edge {
    sourceId: number;
    targetId: number;
    relation: string;
    strength: number;
    validAt: string | null;
    invalidAt: string | null;
}
export type TemporalEdge = Edge;
/**
 * Add valid_at and invalid_at columns to causal_edges if not present.
 * Uses ALTER TABLE with try/catch for idempotency — re-running is safe.
 */
export declare function ensureTemporalColumns(db: Database.Database): void;
/**
 * Mark an edge as invalidated (set invalid_at to current ISO timestamp).
 * Optionally records the reason in the evidence column.
 * No-op if the edge does not exist or is already invalidated.
 */
export declare function invalidateEdge(db: Database.Database, sourceId: number, targetId: number, reason?: string, relation?: string): void;
/**
 * Get only currently valid edges for a node (invalid_at IS NULL).
 * Returns edges where the node appears as either source or target.
 */
export declare function getValidEdges(db: Database.Database, nodeId: number): Edge[];
//# sourceMappingURL=temporal-edges.d.ts.map