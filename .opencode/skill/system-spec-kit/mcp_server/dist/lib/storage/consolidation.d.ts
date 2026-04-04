import type Database from 'better-sqlite3';
import type { CausalEdge } from './causal-edges.js';
/**
 * Describes the ContradictionPair shape.
 */
export interface ContradictionPair {
    memoryA: {
        id: number;
        title: string | null;
        content: string | null;
    };
    memoryB: {
        id: number;
        title: string | null;
        content: string | null;
    };
    similarity: number;
    conflictType: 'keyword_negation' | 'semantic_opposition';
}
/**
 * Describes the ContradictionCluster shape.
 */
export interface ContradictionCluster {
    /** The initially detected pair */
    seedPair: ContradictionPair;
    /** All cluster members (IDs of related memories) */
    members: number[];
}
/**
 * Describes the ConsolidationResult shape.
 */
export interface ConsolidationResult {
    contradictions: ContradictionCluster[];
    hebbian: {
        strengthened: number;
        decayed: number;
    };
    stale: {
        flagged: number;
    };
    edgeBounds: {
        rejected: number;
    };
}
/** Cosine similarity threshold for contradiction candidates */
declare const CONTRADICTION_SIMILARITY_THRESHOLD = 0.85;
/**
 * Find potential contradictions by:
 * 1. Candidate generation — high cosine similarity pairs (>0.85)
 * 2. Conflict check — keyword negation heuristic
 *
 * Returns pairs that are both semantically similar AND contain
 * negation patterns suggesting conflicting information.
 */
export declare function scanContradictions(database: Database.Database): ContradictionPair[];
/**
 * Check if two texts contain negation patterns suggesting contradiction.
 */
export declare function hasNegationConflict(textA: string, textB: string): boolean;
/**
 * Surface all members of a contradiction cluster.
 * When a contradiction pair is detected, find ALL related memories
 * (via causal edges) to surface the full context for resolution.
 */
export declare function buildContradictionClusters(database: Database.Database, pairs: ContradictionPair[]): ContradictionCluster[];
/**
 * Hebbian strengthening: increase edge strength for recently co-accessed edges.
 * +0.05 per cycle, capped at MAX_STRENGTH_INCREASE_PER_CYCLE.
 * 30-day decay: edges not accessed in 30 days lose 0.1 strength.
 *
 * All weight changes are logged to weight_history via updateEdge().
 */
export declare function runHebbianCycle(database: Database.Database): {
    strengthened: number;
    decayed: number;
};
/**
 * Detect stale edges (not accessed in 90+ days).
 * Flags them for review without deletion.
 */
export declare function detectStaleEdges(_database: Database.Database): CausalEdge[];
/**
 * Enforce edge bounds for a node:
 * - MAX_EDGES_PER_NODE = 20
 * - Auto edges capped at strength = 0.5
 *
 * Returns count of edges that would be rejected.
 */
export declare function checkEdgeBounds(nodeId: string): {
    currentCount: number;
    maxAllowed: number;
    canAddAuto: boolean;
};
/**
 * Run a full N3-lite consolidation cycle:
 * 1. Contradiction scan
 * 2. Hebbian strengthening + decay
 * 3. Staleness detection
 * 4. Edge bounds check
 *
 * Designed to run as a weekly batch job.
 */
export declare function runConsolidationCycle(database: Database.Database): ConsolidationResult;
/**
 * Runtime gate for N3-lite consolidation.
 * Returns null when consolidation is disabled.
 */
export declare function runConsolidationCycleIfEnabled(database: Database.Database): ConsolidationResult | null;
export { CONTRADICTION_SIMILARITY_THRESHOLD, };
//# sourceMappingURL=consolidation.d.ts.map