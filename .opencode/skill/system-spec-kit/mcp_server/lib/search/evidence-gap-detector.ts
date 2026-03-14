// ───────────────────────────────────────────────────────────────
// MODULE: Evidence Gap Detector
// ───────────────────────────────────────────────────────────────
// Feature catalog: Signal vocabulary expansion
// Transparent Reasoning Module (TRM): Z-score confidence check
// On RRF scores to detect low-confidence retrieval and inject
// Warnings for the MCP markdown output layer.
// ───────────────────────────────────────────────────────────────
// 1. CONSTANTS

// ───────────────────────────────────────────────────────────────
/** Z-score threshold below which retrieval confidence is considered low. */
const Z_SCORE_THRESHOLD = 1.5;

/** Absolute minimum score; any top score below this triggers a gap. */
const MIN_ABSOLUTE_SCORE = 0.015;

/**
 * Minimum number of memory nodes that must be connected to matched graph
 * nodes before the graph coverage is considered sufficient.
 */
const MIN_GRAPH_MEMORY_NODES = 3;

// ───────────────────────────────────────────────────────────────
// 2. INTERFACES

// ───────────────────────────────────────────────────────────────
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
  nodes: Map<string, { id: string; labels: string[]; properties: Record<string, unknown> }>;
  /** Map from node id → list of node ids that point INTO it (inbound edges). */
  inbound: Map<string, string[]>;
}

// ───────────────────────────────────────────────────────────────
// 3. CORE FUNCTIONS

// ───────────────────────────────────────────────────────────────
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
export function predictGraphCoverage(
  query: string,
  graph: MemoryGraphLike
): GraphCoverageResult {
  // Tokenize the query into lowercase keywords.
  const tokens = query
    .toLowerCase()
    .split(/\s+/)
    .map(t => t.trim())
    .filter(t => t.length > 0);

  if (tokens.length === 0) {
    return { earlyGap: true, connectedNodes: 0 };
  }

  // Find graph nodes whose id or labels match any query token.
  const matchedNodeIds: string[] = [];
  for (const [nodeId, node] of graph.nodes) {
    const idLower = nodeId.toLowerCase();
    const labelMatch = node.labels.some(l => tokens.some(t => l.toLowerCase().includes(t)));
    const idMatch = tokens.some(t => idLower.includes(t));
    if (idMatch || labelMatch) {
      matchedNodeIds.push(nodeId);
    }
  }

  if (matchedNodeIds.length === 0) {
    return { earlyGap: true, connectedNodes: 0 };
  }

  // Count distinct memory nodes connected (via inbound edges) to matched nodes.
  const connectedMemoryNodes = new Set<string>();
  for (const nodeId of matchedNodeIds) {
    const inboundList = graph.inbound.get(nodeId) ?? [];
    for (const memNodeId of inboundList) {
      connectedMemoryNodes.add(memNodeId);
    }
  }

  const connectedNodes = connectedMemoryNodes.size;
  const earlyGap = connectedNodes < MIN_GRAPH_MEMORY_NODES;

  return { earlyGap, connectedNodes };
}

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
export function detectEvidenceGap(rrfScores: number[]): TRMResult {
  if (rrfScores.length === 0) {
    return { gapDetected: true, zScore: 0, mean: 0, stdDev: 0 };
  }

  const finiteScores = rrfScores.filter((score) => Number.isFinite(score));
  if (finiteScores.length === 0) {
    return { gapDetected: true, zScore: 0, mean: 0, stdDev: 0 };
  }

  if (finiteScores.length === 1) {
    // Single score: can't compute a meaningful Z-score, fall back to absolute threshold.
    const score = finiteScores[0];
    return {
      gapDetected: score < MIN_ABSOLUTE_SCORE,
      zScore: 0,
      mean: score,
      stdDev: 0,
    };
  }

  const mean = finiteScores.reduce((acc, s) => acc + s, 0) / finiteScores.length;
  const variance = finiteScores.reduce((acc, s) => acc + (s - mean) ** 2, 0) / finiteScores.length;
  const stdDev = Math.sqrt(variance);

  // Reduce avoids stack overflow on arrays >100K elements (spread pushes all onto call stack)
  const topScore = finiteScores.reduce((a, b) => Math.max(a, b), -Infinity);
  if (!Number.isFinite(mean) || !Number.isFinite(stdDev) || !Number.isFinite(topScore)) {
    return { gapDetected: true, zScore: 0, mean: 0, stdDev: 0 };
  }

  // Avoid division by zero when all scores are identical (stdDev === 0 → Z = 0).
  const zScore = stdDev === 0 ? 0 : (topScore - mean) / stdDev;

  // When stdDev===0 all scores are identical; Z-score is meaningless.
  // Only flag a gap if the uniform score is below the absolute threshold.
  const gapDetected = stdDev === 0
    ? topScore < MIN_ABSOLUTE_SCORE
    : zScore < Z_SCORE_THRESHOLD || topScore < MIN_ABSOLUTE_SCORE;

  return { gapDetected, zScore, mean, stdDev };
}

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
export function formatEvidenceGapWarning(trm: TRMResult): string {
  return `> **[EVIDENCE GAP DETECTED]: Retrieved context has low mathematical confidence (Z=${trm.zScore.toFixed(2)}). Consider first principles.**`;
}

/* ───────────────────────────────────────────────────────────────
   4. EXPORTS (constants for consumer use)
   ──────────────────────────────────────────────────────────────── */

export { Z_SCORE_THRESHOLD, MIN_ABSOLUTE_SCORE, MIN_GRAPH_MEMORY_NODES };
