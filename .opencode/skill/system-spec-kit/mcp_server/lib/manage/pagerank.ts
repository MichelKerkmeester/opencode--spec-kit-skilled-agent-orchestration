// --- 1. PAGERANK ---
// Iterative PageRank algorithm for memory graph authority scoring.
// Computes convergence-based rank scores for weighted node retrieval.
// Reference: C138-P4 — graph-based importance scoring for memory nodes.
// --- 2. TYPES ---

/** Adjacency list node: each node has a unique numeric id and out-edges. */
export interface GraphNode {
  id: number;
  outLinks: number[];
}

/** Result returned by computePageRank. */
export interface PageRankResult {
  /** Per-node rank scores; values sum to approximately 1.0. */
  scores: Map<number, number>;
  /** Number of iterations executed before convergence or limit. */
  iterations: number;
  /** True if the algorithm converged before reaching maxIterations. */
  converged: boolean;
}

// --- 3. CONSTANTS ---

/** Standard PageRank damping factor — probability of following an outbound link. */
const DAMPING_FACTOR = 0.85;

/** Default iteration cap before returning unconverged results. */
const DEFAULT_ITERATIONS = 10;

/** L∞ delta threshold below which scores are considered converged. */
const CONVERGENCE_THRESHOLD = 1e-6;

// --- 4. ALGORITHM ---

/**
 * Compute iterative PageRank scores for a directed graph.
 *
 * Scores are initialised uniformly at 1/n and updated each iteration using
 * the standard damped sum-of-contributions formula:
 *   PR(u) = (1 - d) / n + d * Σ PR(v) / out(v)
 *
 * Convergence is declared when the maximum per-node delta falls below
 * CONVERGENCE_THRESHOLD, or maxIterations is reached.
 *
 * @param nodes          - Array of graph nodes with outbound adjacency lists.
 * @param maxIterations  - Upper bound on iterations (default: 10).
 * @param dampingFactor  - Probability of following a link, 0 < d < 1 (default: 0.85).
 * @returns PageRankResult with final scores, iteration count, and convergence flag.
 */
export function computePageRank(
  nodes: GraphNode[],
  maxIterations: number = DEFAULT_ITERATIONS,
  dampingFactor: number = DAMPING_FACTOR,
): PageRankResult {
  const nodeCount = nodes.length;

  // Guard: empty graph converges immediately with no scores.
  if (nodeCount === 0) {
    return { scores: new Map(), iterations: 0, converged: true };
  }

  // Build id → node lookup for O(1) out-degree access.
  const nodeMap = new Map<number, GraphNode>();
  for (const node of nodes) {
    nodeMap.set(node.id, node);
  }

  // Initialise uniform prior: 1/n for each node.
  let scores = new Map<number, number>();
  for (const node of nodes) {
    scores.set(node.id, 1 / nodeCount);
  }

  // Pre-compute inbound link lists to avoid scanning all edges each iteration.
  const inLinks = new Map<number, number[]>();
  for (const node of nodes) {
    if (!inLinks.has(node.id)) inLinks.set(node.id, []);
    for (const targetId of node.outLinks) {
      if (!inLinks.has(targetId)) inLinks.set(targetId, []);
      // InLinks.set(targetId, []) on the preceding line guarantees the key exists
      inLinks.get(targetId)!.push(node.id);
    }
  }

  let converged = false;
  let iteration = 0;

  for (iteration = 0; iteration < maxIterations; iteration++) {
    const nextScores = new Map<number, number>();
    let maxDelta = 0;
    let danglingMass = 0;

    // Standard dangling-node correction: redistribute sink-node rank uniformly.
    for (const sourceNode of nodes) {
      if (sourceNode.outLinks.length === 0) {
        danglingMass += (scores.get(sourceNode.id) ?? 0);
      }
    }

    for (const node of nodes) {
      // Sum contributions from all nodes that link into this one.
      let linkSum = 0;
      const inboundSources = inLinks.get(node.id) ?? [];
      for (const sourceId of inboundSources) {
        const sourceNode = nodeMap.get(sourceId);
        if (sourceNode && sourceNode.outLinks.length > 0) {
          // Distribute source score evenly across all outbound edges.
          const outDegree = sourceNode.outLinks.length;
          linkSum += (scores.get(sourceId) ?? 0) / outDegree;
        }
      }

      const updatedScore = (1 - dampingFactor) / nodeCount + dampingFactor * (linkSum + (danglingMass / nodeCount));
      nextScores.set(node.id, updatedScore);

      const delta = Math.abs(updatedScore - (scores.get(node.id) ?? 0));
      if (delta > maxDelta) maxDelta = delta;
    }

    scores = nextScores;

    // Declare convergence if all scores shifted by less than threshold.
    if (maxDelta < CONVERGENCE_THRESHOLD) {
      converged = true;
      iteration++;
      break;
    }
  }

  return { scores, iterations: iteration, converged };
}
