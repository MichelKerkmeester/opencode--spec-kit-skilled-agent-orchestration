/** Z-score threshold below which retrieval confidence is considered low. */
declare const Z_SCORE_THRESHOLD = 1.5;
/** Absolute minimum score; any top score below this triggers a gap. */
declare const MIN_ABSOLUTE_SCORE = 0.015;
/**
 * Minimum number of memory nodes that must be connected to matched graph
 * nodes before the graph coverage is considered sufficient.
 */
declare const MIN_GRAPH_MEMORY_NODES = 3;
/**
 * Result of a Transparent Reasoning Module evidence-gap check.
 * Summarises Z-score statistics for the RRF score distribution.
 */
export interface TRMResult {
    /** True when retrieval confidence is too low to trust results. */
    gapDetected: boolean;
    /** Z-score of the top-ranked result relative to the distribution. */
    zScore: number;
    /** Arithmetic mean of all RRF scores. */
    mean: number;
    /** Population standard deviation of all RRF scores. */
    stdDev: number;
}
/**
 * Result of a graph-topology-based coverage pre-check (T014).
 * Produced before the TRM Z-score check to detect low coverage early
 * and allow the caller to skip full retrieval scatter (saves 30-50ms).
 */
export interface GraphCoverageResult {
    /** True when the graph topology predicts insufficient memory coverage. */
    earlyGap: boolean;
    /** Number of memory nodes connected to query-matched graph nodes. */
    connectedNodes: number;
}
/**
 * Minimal graph interface required by `predictGraphCoverage`.
 * Define locally so this module has no dependency outside its rootDir.
 */
interface MemoryGraphLike {
    nodes: Map<string, {
        id: string;
        labels: string[];
        properties: Record<string, unknown>;
    }>;
    /** Map from node id → list of node ids that point INTO it (inbound edges). */
    inbound: Map<string, string[]>;
}
/**
 * Graph-topology coverage pre-check (T014).
 *
 * Before running the more expensive TRM Z-score check, estimate whether
 * the graph has enough connected memory nodes to produce useful results.
 * When `earlyGap` is true the caller can skip full retrieval scatter and
 * save 30-50 ms of latency.
 *
 * @param query - Raw query string to tokenize and match against graph nodes.
 * @param graph - A memory-graph-like object with `nodes` and `inbound` maps.
 * @returns GraphCoverageResult with early-gap flag and connected node count.
 */
export declare function predictGraphCoverage(query: string, graph: MemoryGraphLike): GraphCoverageResult;
/**
 * Detect evidence gaps in an RRF score distribution.
 *
 * A gap is detected when either:
 * - The top score's Z-score falls below `Z_SCORE_THRESHOLD` (flat distribution),
 * - The top score is below `MIN_ABSOLUTE_SCORE` (all scores too small), or
 * - The input array is empty.
 *
 * @param rrfScores - Array of Reciprocal Rank Fusion scores (any length).
 * @returns TRMResult with gap flag, Z-score, mean, and standard deviation.
 */
export declare function detectEvidenceGap(rrfScores: number[]): TRMResult;
/**
 * Format an evidence-gap warning for MCP markdown output.
 *
 * Uses plain text (no emoji) to comply with project conventions.
 * The markdown block-quote prefix (`> **`) allows the MCP layer to
 * render the warning prominently without requiring emoji support.
 *
 * @param trm - TRMResult from `detectEvidenceGap`.
 * @returns A formatted markdown warning string.
 */
export declare function formatEvidenceGapWarning(trm: TRMResult): string;
export { Z_SCORE_THRESHOLD, MIN_ABSOLUTE_SCORE, MIN_GRAPH_MEMORY_NODES };
//# sourceMappingURL=evidence-gap-detector.d.ts.map