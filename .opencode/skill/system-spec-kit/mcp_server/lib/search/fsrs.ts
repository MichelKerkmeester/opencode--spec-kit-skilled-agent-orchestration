// ───────────────────────────────────────────────────────────────
// MODULE: Fsrs
// ───────────────────────────────────────────────────────────────
// Feature catalog: Classification-based decay
// Augments FSRS stability scores with graph centrality so that
// Central nodes decay slower and peripheral nodes decay faster.

/* --- 1. INTERFACES --- */

/**
 * Minimal graph interface required by `computeGraphCentrality`.
 * Defined locally — no imports outside this module's rootDir.
 */
interface MemoryGraphLike {
  /** All graph nodes keyed by node id. */
  nodes: Map<string, unknown>;
  /** Map from node id → list of node ids that point INTO it (inbound edges). */
  inbound: Map<string, string[]>;
  /** Map from node id → list of node ids that this node points TO (outbound edges). */
  outbound: Map<string, string[]>;
}

/* --- 2. CORE FUNCTIONS --- */

/**
 * Compute structural freshness by augmenting an FSRS stability score
 * with a graph centrality factor.
 *
 * Formula:
 *   structural_freshness = fsrs_stability * graph_centrality_normalized
 *
 * Central nodes (high centrality) retain more freshness, peripheral
 * nodes (low centrality) decay faster — reflecting the intuition that
 * highly connected knowledge is more reliably accessible over time.
 *
 * @param stability  - FSRS stability value, clamped to [0, 1].
 * @param centrality - Normalized graph centrality value, clamped to [0, 1].
 * @returns Structural freshness score in [0, 1].
 */
export function computeStructuralFreshness(
  stability: number,
  centrality: number
): number {
  const s = Math.min(1, Math.max(0, stability));
  const c = Math.min(1, Math.max(0, centrality));
  return s * c;
}

/**
 * Compute normalized degree centrality for a node in a graph.
 *
 * Formula:
 *   degree_centrality = (inDegree + outDegree) / (2 * (totalNodes - 1))
 *
 * Normalized to [0, 1]. Returns 0 when:
 * - The node is not found in the graph.
 * - The graph has fewer than 2 nodes (denominator would be 0).
 *
 * @param nodeId - The id of the node to compute centrality for.
 * @param graph  - A memory-graph-like object with `nodes`, `inbound`, and `outbound` maps.
 * @returns Normalized degree centrality in [0, 1].
 */
export function computeGraphCentrality(
  nodeId: string,
  graph: MemoryGraphLike
): number {
  const totalNodes = graph.nodes.size;

  // Cannot normalize with fewer than 2 nodes.
  if (totalNodes < 2) return 0;

  // Node must exist in the graph.
  if (!graph.nodes.has(nodeId)) return 0;

  const inDegree = (graph.inbound.get(nodeId) ?? []).length;
  const outDegree = (graph.outbound.get(nodeId) ?? []).length;

  const centrality = (inDegree + outDegree) / (2 * (totalNodes - 1));

  // Clamp to [0, 1] to guard against unexpected edge-list duplication.
  return Math.min(1, Math.max(0, centrality));
}
