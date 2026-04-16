'use strict';

// ---------------------------------------------------------------
// MODULE: Coverage Graph Signals (T003)
// ---------------------------------------------------------------
// Extracted and adapted from mcp_server/lib/graph/graph-signals.ts
// Provides signal computation for in-memory coverage graphs:
// degree, depth, recent-edge activity, and cluster metrics.
// ---------------------------------------------------------------

const {
  getFilteredEdges,
  getFilteredNodeIds,
  matchesSession,
} = require('./coverage-graph-session.cjs');

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
function computeDegree(graph, nodeId, sessionId) {
  if (!isValidGraph(graph) || typeof nodeId !== 'string' || !nodeId) {
    return { inDegree: 0, outDegree: 0, total: 0 };
  }
  const node = graph.nodes.get(nodeId);
  if (!node || !matchesSession(graph, node, sessionId, 'node')) {
    return { inDegree: 0, outDegree: 0, total: 0 };
  }
  let inDegree = 0;
  let outDegree = 0;

  for (const edge of getFilteredEdges(graph, sessionId)) {
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
function buildAdjacencyList(graph, sessionId) {
  if (!isValidGraph(graph)) {
    return { adjacency: new Map(), inDegree: new Map() };
  }
  const adjacency = new Map();
  const inDegree = new Map();

  // Initialize all nodes
  for (const nodeId of getFilteredNodeIds(graph, sessionId)) {
    adjacency.set(nodeId, []);
    if (!inDegree.has(nodeId)) inDegree.set(nodeId, 0);
  }

  for (const edge of getFilteredEdges(graph, sessionId)) {
    if (!adjacency.has(edge.source) || !adjacency.has(edge.target)) continue;
    adjacency.get(edge.source).push(edge.target);

    inDegree.set(edge.target, (inDegree.get(edge.target) || 0) + 1);
    if (!inDegree.has(edge.source)) inDegree.set(edge.source, 0);
  }

  return { adjacency, inDegree };
}

/**
 * Compute the longest path depth from any root node to the given node.
 * Uses longest-path on the DAG formed by collapsing strongly connected
 * components so cycles share one bounded depth layer.
 *
 * Adapted from graph-signals.ts computeComponentDepths().
 *
 * @param {{ nodes: Map, edges: Map }} graph - In-memory coverage graph
 * @param {string} nodeId - Node identifier
 * @returns {number} Longest path depth from any root to this node
 */
function computeDepth(graph, nodeId, sessionId) {
  if (!isValidGraph(graph) || typeof nodeId !== 'string' || !nodeId) return 0;
  if (!graph.nodes.has(nodeId)) return 0;
  if (!matchesSession(graph, graph.nodes.get(nodeId), sessionId, 'node')) return 0;

  const { adjacency, inDegree } = buildAdjacencyList(graph, sessionId);
  return computeComponentDepths(adjacency, Array.from(inDegree.keys())).depthByNode.get(nodeId) || 0;
}

/**
 * Compute depths for all nodes in the graph.
 *
 * @param {{ nodes: Map, edges: Map }} graph - In-memory coverage graph
 * @returns {Map<string, number>} Map of nodeId -> depth
 */
function computeAllDepths(graph, sessionId) {
  if (!isValidGraph(graph)) return new Map();
  const { adjacency, inDegree } = buildAdjacencyList(graph, sessionId);
  return computeComponentDepths(adjacency, Array.from(inDegree.keys())).depthByNode;
}

/* ---------------------------------------------------------------
   3. RECENT EDGE ACTIVITY
----------------------------------------------------------------*/

/**
 * Compute recent edge activity for a node within a recent window.
 * Counts edges created within the last `windowSize` milliseconds.
 *
 * @param {{ nodes: Map, edges: Map }} graph - In-memory coverage graph
 * @param {string} nodeId - Node identifier
 * @param {number} [windowSize=300000] - Window in milliseconds (default 5 minutes)
 * @returns {number} Count of edges involving this node within the window
 */
function computeRecentEdgeActivity(graph, nodeId, windowSize, sessionId) {
  if (!isValidGraph(graph) || typeof nodeId !== 'string' || !nodeId) return 0;
  const node = graph.nodes.get(nodeId);
  if (!node || !matchesSession(graph, node, sessionId, 'node')) return 0;
  if (windowSize === undefined || windowSize === null) windowSize = 300000; // 5 min default
  if (typeof windowSize !== 'number' || !Number.isFinite(windowSize) || windowSize < 0) {
    windowSize = 300000;
  }

  const cutoff = Date.now() - windowSize;
  let count = 0;

  for (const edge of getFilteredEdges(graph, sessionId)) {
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
function computeClusterMetrics(graph, sessionId) {
  if (!isValidGraph(graph)) {
    return { componentCount: 0, sizes: [], largestSize: 0, isolatedNodes: 0 };
  }
  const filteredNodeIds = getFilteredNodeIds(graph, sessionId);
  if (filteredNodeIds.length === 0) {
    return { componentCount: 0, sizes: [], largestSize: 0, isolatedNodes: 0 };
  }

  // Build undirected adjacency
  const undirected = new Map();
  for (const nodeId of filteredNodeIds) {
    undirected.set(nodeId, new Set());
  }

  for (const edge of getFilteredEdges(graph, sessionId)) {
    if (!undirected.has(edge.source) || !undirected.has(edge.target)) continue;
    undirected.get(edge.source).add(edge.target);
    undirected.get(edge.target).add(edge.source);
  }

  const visited = new Set();
  const sizes = [];
  let isolatedNodes = 0;

  for (const nodeId of filteredNodeIds) {
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

/**
 * Collapse cycles into strongly connected components so longest-path
 * depth remains stable in cyclic graphs.
 *
 * @param {Map<string, string[]>} adjacency
 * @param {string[]} allNodes
 * @returns {{ componentByNode: Map<string, number>, components: string[][] }}
 */
function buildStronglyConnectedComponents(adjacency, allNodes) {
  const componentByNode = new Map();
  const components = [];
  const indices = new Map();
  const lowLinks = new Map();
  const stack = [];
  const inStack = new Set();
  let nextIndex = 0;

  function strongConnect(nodeId) {
    indices.set(nodeId, nextIndex);
    lowLinks.set(nodeId, nextIndex);
    nextIndex++;

    stack.push(nodeId);
    inStack.add(nodeId);

    for (const neighbor of adjacency.get(nodeId) || []) {
      if (!indices.has(neighbor)) {
        strongConnect(neighbor);
        lowLinks.set(nodeId, Math.min(lowLinks.get(nodeId) ?? 0, lowLinks.get(neighbor) ?? 0));
      } else if (inStack.has(neighbor)) {
        lowLinks.set(nodeId, Math.min(lowLinks.get(nodeId) ?? 0, indices.get(neighbor) ?? 0));
      }
    }

    if ((lowLinks.get(nodeId) ?? -1) !== (indices.get(nodeId) ?? -2)) {
      return;
    }

    const componentId = components.length;
    const members = [];

    while (stack.length > 0) {
      const member = stack.pop();
      if (member === undefined) break;

      inStack.delete(member);
      componentByNode.set(member, componentId);
      members.push(member);

      if (member === nodeId) break;
    }

    components.push(members);
  }

  for (const nodeId of allNodes) {
    if (!indices.has(nodeId)) {
      strongConnect(nodeId);
    }
  }

  return { componentByNode, components };
}

/**
 * Compute longest-path depths on the SCC-collapsed component DAG.
 *
 * @param {Map<string, string[]>} adjacency
 * @param {string[]} allNodes
 * @returns {{ depthByNode: Map<string, number>, maxDepth: number }}
 */
function computeComponentDepths(adjacency, allNodes) {
  const { componentByNode, components } = buildStronglyConnectedComponents(adjacency, allNodes);
  const componentAdjacency = new Map();
  const componentInDegree = new Map();

  for (let componentId = 0; componentId < components.length; componentId++) {
    componentAdjacency.set(componentId, new Set());
    componentInDegree.set(componentId, 0);
  }

  for (const [sourceId, neighbors] of adjacency.entries()) {
    const sourceComponent = componentByNode.get(sourceId);
    if (sourceComponent === undefined) continue;

    const componentNeighbors = componentAdjacency.get(sourceComponent);
    if (!componentNeighbors) continue;

    for (const neighborId of neighbors) {
      const targetComponent = componentByNode.get(neighborId);
      if (targetComponent === undefined || targetComponent === sourceComponent || componentNeighbors.has(targetComponent)) {
        continue;
      }

      componentNeighbors.add(targetComponent);
      componentInDegree.set(targetComponent, (componentInDegree.get(targetComponent) || 0) + 1);
    }
  }

  const remainingInDegree = new Map(componentInDegree);
  const componentDepths = new Map();
  const queue = [];

  for (let componentId = 0; componentId < components.length; componentId++) {
    if ((remainingInDegree.get(componentId) || 0) === 0) {
      componentDepths.set(componentId, 0);
      queue.push(componentId);
    }
  }

  let maxDepth = 0;
  let queueIndex = 0;

  while (queueIndex < queue.length) {
    const componentId = queue[queueIndex++];
    const componentDepth = componentDepths.get(componentId) || 0;

    for (const neighborComponent of componentAdjacency.get(componentId) || []) {
      const candidateDepth = componentDepth + 1;
      if (candidateDepth > (componentDepths.get(neighborComponent) || 0)) {
        componentDepths.set(neighborComponent, candidateDepth);
        if (candidateDepth > maxDepth) maxDepth = candidateDepth;
      }

      const nextInDegree = (remainingInDegree.get(neighborComponent) || 0) - 1;
      remainingInDegree.set(neighborComponent, nextInDegree);
      if (nextInDegree === 0) {
        queue.push(neighborComponent);
      }
    }
  }

  const depthByNode = new Map();
  for (const nodeId of allNodes) {
    const componentId = componentByNode.get(nodeId);
    if (componentId === undefined) continue;
    depthByNode.set(nodeId, componentDepths.get(componentId) || 0);
  }

  return { depthByNode, maxDepth };
}

/* ---------------------------------------------------------------
   5. EXPORTS
----------------------------------------------------------------*/

module.exports = {
  computeDegree,
  computeDepth,
  computeAllDepths,
  computeRecentEdgeActivity,
  computeClusterMetrics,

  // Internal helpers exposed for testing
  __testables: {
    buildAdjacencyList,
    buildStronglyConnectedComponents,
    computeComponentDepths,
  },
};
