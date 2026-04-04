import type Database from 'better-sqlite3';
export interface ContradictionResult {
    oldEdge: {
        sourceId: number;
        targetId: number;
        relation: string;
    };
    oldSourceId: number;
    oldTargetId: number;
    oldRelation: string;
    reason: string;
}
/**
 * Check if a new edge contradicts existing edges.
 * Contradiction rules:
 * 1. Same source+target with relation 'supersedes' → invalidate old edge
 * 2. Same source+target with conflicting relations (e.g., 'supports' vs 'contradicts')
 * Returns array of contradictions found and invalidated.
 */
export declare function detectContradictions(db: Database.Database, newSourceId: number, newTargetId: number, newRelation: string): ContradictionResult[];
//# sourceMappingURL=contradiction-detection.d.ts.map