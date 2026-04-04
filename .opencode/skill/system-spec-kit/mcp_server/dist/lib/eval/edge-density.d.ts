import type Database from 'better-sqlite3';
/** Density classification label. */
export type DensityClassification = 'dense' | 'moderate' | 'sparse';
/** Full result returned by measureEdgeDensity(). */
export interface EdgeDensityResult {
    /** Total number of rows in causal_edges. */
    edgeCount: number;
    /** Number of unique memory IDs participating in at least one edge. */
    nodeCount: number;
    /** Total memories in memory_index (used for coverage context). */
    totalMemories: number;
    /**
     * Edge density: edgeCount / totalMemories (primary denominator).
     * Falls back to edgeCount / nodeCount when totalMemories is 0.
     * Returns 0 when both denominators are 0 (empty graph).
     */
    density: number;
    /** Human-readable density band. */
    classification: DensityClassification;
    /** true when density < 0.5 — triggers R10 escalation. */
    r10Escalation: boolean;
    /** Present when r10Escalation is true. Contains timeline recommendation. */
    r10Recommendation?: string;
}
/**
 * Measure the edge density of the causal graph stored in `database`.
 *
 * Queries:
 *   - Total edge count from causal_edges.
 *   - Unique node count = UNION of source_id and target_id values.
 *   - Total memory count from memory_index (coverage context).
 *
 * @param database - An initialized better-sqlite3 Database instance.
 * @returns EdgeDensityResult with all metrics and optional R10 escalation.
 */
export declare function measureEdgeDensity(database: Database.Database): EdgeDensityResult;
/**
 * Format an EdgeDensityResult into a human-readable multi-line report.
 *
 * @param result - The result returned by measureEdgeDensity().
 * @returns Multi-line report string suitable for logs or console output.
 */
export declare function formatDensityReport(result: EdgeDensityResult): string;
//# sourceMappingURL=edge-density.d.ts.map