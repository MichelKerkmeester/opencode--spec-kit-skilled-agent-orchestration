'use strict';

// ---------------------------------------------------------------
// MODULE: Coverage Graph Signals (T003)
// ---------------------------------------------------------------
// Extracted and adapted from mcp_server/lib/graph/graph-signals.ts
// Provides signal computation for in-memory coverage graphs:
// degree, depth, momentum, and cluster metrics.
// ---------------------------------------------------------------

/* ---------------------------------------------------------------
   1. DEGREE
----------------------------------------------------------------*/

/**
 * Check whether a value looks like an in-memory coverage graph.
 * @param {unknown} graph
 * @returns {boolean}
 */
function isValidGraph(graph) {
  return !!graph &&
    typeof graph === 'object' &&
    graph.nodes instanceof Map &&
    graph.edges instanceof Map;
}

/**
 * Compute the degree of a node (in-degree + out-degree).
 *
 * Adapted from graph-signals.ts getCurrentDegree():
 * - Counts both incoming and outgoing edges for a node
 * - Pure in-memory computation (no DB)
 *
 * @param {{ nodes: Map, edges: Map }} graph - In-memory coverage graph
 * @param {string} nodeId - Node identifier
 * @returns {{ inDegree: number, outDegree: number, total: number }}
 */
function computeDegree(graph, nodeId) {
  if (!isValidGraph(graph) || typeof nodeId !== 'string' || !nodeId) {
    return { inDegree: 0, outDegree: 0, total: 0 };
  }
  let inDegree = 0;
  let outDegree = 0;

  for (const edge of graph.edges.values()) {
    if (edge.target === nodeId) inDegree++;
    if (edge.source === nodeId) outDegree++;
  }

  return { inDegree, outDegree, total: inDegree + outDegree };
}

/* ---------------------------------------------------------------
   2. DEPTH
----------------------------------------------------------------*/

/**
 * Build a forward adjacency list from the graph's edges.
 * Also tracks in-degree for root detection.
 *
 * Adapted from graph-signals.ts buildAdjacencyList().
 *
 * @param {{ nodes: Map, edges: Map }} graph
 * @returns {{ adjacency: Map<string, string[]>, inDegree: Map<string, number> }}
 */
function buildAdjacencyList(graph) {
  if (!isValidGraph(graph)) {
    return { adjacency: new Map(), inDegree: new Map() };
  }
  const adjacency = new Map();
  const inDegree = new Map();

  // Initialize all nodes
  for (const nodeId of graph.nodes.keys()) {
    adjacency.set(nodeId, []);
    if (!inDegree.has(nodeId)) inDegree.set(nodeId, 0);
  }

  for (const edge of graph.edges.values()) {
    if (!adjacency.has(edge.source)) adjacency.set(edge.source, []);
    adjacency.get(edge.source).push(edge.target);

    inDegree.set(edge.target, (inDegree.get(edge.target) || 0) + 1);
    if (!inDegree.has(edge.source)) inDegree.set(edge.source, 0);
  }

  return { adjacency, inDegree };
}

/**
 * Compute the longest path depth from any root node to the given node.
 * Uses BFS-based topological longest-path on the DAG.
 * Handles cycles by capping at the number of nodes (graceful degradation).
 *
 * Adapted from graph-signals.ts computeComponentDepths():
 * - Simplified for in-memory graph without SCC decomposition
 * - Uses Kahn's algorithm for topological ordering with longest-path tracking
 *
 * @param {{ nodes: Map, edges: Map }} graph - In-memory coverage graph
 * @param {string} nodeId - Node identifier
 * @returns {number} Longest path depth from any root to this node
 */
function computeDepth(graph, nodeId) {
  if (!isValidGraph(graph) || typeof nodeId !== 'string' || !nodeId) return 0;
  if (!graph.nodes.has(nodeId)) return 0;

  const { adjacency, inDegree } = buildAdjacencyList(graph);

  // Kahn's algorithm with longest-path tracking
  const depths = new Map();
  const remaining = new Map(inDegree);
  const queue = [];

  // Seed roots (in-degree = 0)
  for (const [id, deg] of remaining) {
    if (deg === 0) {
      depths.set(id, 0);
      queue.push(id);
    }
  }

  let queueIndex = 0;
  while (queueIndex < queue.length) {
    const current = queue[queueIndex++];
    const currentDepth = depths.get(current) || 0;

    for (const neighbor of (adjacency.get(current) || [])) {
      const candidateDepth = currentDepth + 1;
      if (candidateDepth > (depths.get(neighbor) || 0)) {
        depths.set(neighbor, candidateDepth);
      }

      const nextDeg = (remaining.get(neighbor) || 0) - 1;
      remaining.set(neighbor, nextDeg);
      if (nextDeg === 0) {
        queue.push(neighbor);
      }
    }
  }

  // For nodes in cycles that never reached in-degree 0, assign 0
  return depths.get(nodeId) || 0;
}

/**
 * Compute depths for all nodes in the graph.
 *
 * @param {{ nodes: Map, edges: Map }} graph - In-memory coverage graph
 * @returns {Map<string, number>} Map of nodeId -> depth
 */
function computeAllDepths(graph) {
  if (!isValidGraph(graph)) return new Map();
  const { adjacency, inDegree } = buildAdjacencyList(graph);
  const depths = new Map();
  const remaining = new Map(inDegree);
  const queue = [];

  for (const [id, deg] of remaining) {
    if (deg === 0) {
      depths.set(id, 0);
      queue.push(id);
    }
  }

  let queueIndex = 0;
  while (queueIndex < queue.length) {
    const current = queue[queueIndex++];
    const currentDepth = depths.get(current) || 0;

    for (const neighbor of (adjacency.get(current) || [])) {
      const candidateDepth = currentDepth + 1;
      if (candidateDepth > (depths.get(neighbor) || 0)) {
        depths.set(neighbor, candidateDepth);
      }

      const nextDeg = (remaining.get(neighbor) || 0) - 1;
      remaining.set(neighbor, nextDeg);
      if (nextDeg === 0) {
        queue.push(neighbor);
      }
    }
  }

  // Ensure every node has a depth entry
  for (const nodeId of graph.nodes.keys()) {
    if (!depths.has(nodeId)) depths.set(nodeId, 0);
  }

  return depths;
}

/* ---------------------------------------------------------------
   3. MOMENTUM
----------------------------------------------------------------*/

/**
 * Compute momentum for a node: edge activity within a recent window.
 * Counts edges created within the last `windowSize` milliseconds.
 *
 * Adapted from graph-signals.ts computeMomentum():
 * - Uses edge createdAt timestamps instead of degree_snapshots table
 * - Windowed activity count rather than delta comparison
 *
 * @param {{ nodes: Map, edges: Map }} graph - In-memory coverage graph
 * @param {string} nodeId - Node identifier
 * @param {number} [windowSize=300000] - Window in milliseconds (default 5 minutes)
 * @returns {number} Count of edges involving this node within the window
 */
function computeMomentum(graph, nodeId, windowSize) {
  if (!isValidGraph(graph) || typeof nodeId !== 'string' || !nodeId) return 0;
  if (windowSize === undefined || windowSize === null) windowSize = 300000; // 5 min default
  if (typeof windowSize !== 'number' || !Number.isFinite(windowSize) || windowSize < 0) {
    windowSize = 300000;
  }

  const cutoff = Date.now() - windowSize;
  let count = 0;

  for (const edge of graph.edges.values()) {
    if (edge.source !== nodeId && edge.target !== nodeId) continue;

    const edgeTime = edge.createdAt ? new Date(edge.createdAt).getTime() : 0;
    if (edgeTime >= cutoff) {
      count++;
    }
  }

  return count;
}

/* ---------------------------------------------------------------
   4. CLUSTER METRICS
----------------------------------------------------------------*/

/**
 * Compute connected component counts and sizes using BFS.
 * Treats the graph as undirected for connectivity analysis.
 *
 * Adapted from community-detection.ts detectCommunitiesBFS():
 * - BFS-based connected component discovery
 * - Returns component count, sizes, and largest component size
 *
 * @param {{ nodes: Map, edges: Map }} graph - In-memory coverage graph
 * @returns {{ componentCount: number, sizes: number[], largestSize: number, isolatedNodes: number }}
 */
function computeClusterMetrics(graph) {
  if (!isValidGraph(graph)) {
    return { componentCount: 0, sizes: [], largestSize: 0, isolatedNodes: 0 };
  }
  if (graph.nodes.size === 0) {
    return { componentCount: 0, sizes: [], largestSize: 0, isolatedNodes: 0 };
  }

  // Build undirected adjacency
  const undirected = new Map();
  for (const nodeId of graph.nodes.keys()) {
    undirected.set(nodeId, new Set());
  }

  for (const edge of graph.edges.values()) {
    if (!undirected.has(edge.source)) undirected.set(edge.source, new Set());
    if (!undirected.has(edge.target)) undirected.set(edge.target, new Set());
    undirected.get(edge.source).add(edge.target);
    undirected.get(edge.target).add(edge.source);
  }

  const visited = new Set();
  const sizes = [];
  let isolatedNodes = 0;

  for (const nodeId of graph.nodes.keys()) {
    if (visited.has(nodeId)) continue;

    // BFS from this node
    const queue = [nodeId];
    let queueIndex = 0;
    visited.add(nodeId);
    let size = 0;

    while (queueIndex < queue.length) {
      const current = queue[queueIndex++];
      size++;

      const neighbors = undirected.get(current);
      if (!neighbors) continue;

      for (const neighbor of neighbors) {
        if (visited.has(neighbor)) continue;
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }

    sizes.push(size);
    if (size === 1) isolatedNodes++;
  }

  // Sort sizes descending for convenience
  sizes.sort((a, b) => b - a);

  return {
    componentCount: sizes.length,
    sizes,
    largestSize: sizes.length > 0 ? sizes[0] : 0,
    isolatedNodes,
  };
}

/* ---------------------------------------------------------------
   5. EXPORTS
----------------------------------------------------------------*/

module.exports = {
  computeDegree,
  computeDepth,
  computeAllDepths,
  computeMomentum,
  computeClusterMetrics,

  // Internal helpers exposed for testing
  __testables: {
    buildAdjacencyList,
  },
};
