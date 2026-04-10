'use strict';

// ---------------------------------------------------------------
// MODULE: Coverage Graph Core (T001 + T002)
// ---------------------------------------------------------------
// Extracted and adapted from mcp_server/lib/storage/causal-edges.ts
// Provides edge management primitives for in-memory coverage graphs
// used by deep-research and deep-review semantic coverage tracking.
// ---------------------------------------------------------------

/* ---------------------------------------------------------------
   1. CONSTANTS
----------------------------------------------------------------*/

/**
 * Research relation weight map.
 * Higher values amplify propagated strength; values < 1.0 dampen it.
 * @type {Readonly<Record<string, number>>}
 */
/* CALIBRATION-TODO: inherited from memory graph, recalibrate for coverage */
const RESEARCH_RELATION_WEIGHTS = Object.freeze({
  ANSWERS:      1.3,
  SUPPORTS:     1.0,
  CONTRADICTS:  0.8,
  SUPERSEDES:   1.5,
  DERIVED_FROM: 1.0,
  COVERS:       1.1,
  CITES:        1.0,
});

/**
 * Review relation weight map.
 * @type {Readonly<Record<string, number>>}
 */
/* CALIBRATION-TODO: inherited from memory graph, recalibrate for coverage */
const REVIEW_RELATION_WEIGHTS = Object.freeze({
  COVERS:       1.3,
  SUPPORTS:     1.0,
  DERIVED_FROM: 1.0,
  EVIDENCE_FOR: 1.0,
  CONTRADICTS:  0.8,
  RESOLVES:     1.5,
  CONFIRMS:     1.0,
});

const DEFAULT_MAX_DEPTH = 5;

/** Next auto-incremented edge ID. */
let nextEdgeId = 1;

/* ---------------------------------------------------------------
   2. HELPERS
----------------------------------------------------------------*/

/**
 * Clamp a weight value to the valid range [0.0, 2.0].
 * Returns null for non-finite inputs.
 * @param {number} weight
 * @returns {number|null}
 */
function clampWeight(weight) {
  if (typeof weight !== 'number' || !Number.isFinite(weight)) return null;
  return Math.max(0.0, Math.min(2.0, weight));
}

/**
 * Create a fresh, empty coverage graph.
 * @returns {{ nodes: Map<string, object>, edges: Map<string, object> }}
 */
function createGraph() {
  return {
    nodes: new Map(),
    edges: new Map(),
  };
}

/* ---------------------------------------------------------------
   3. EDGE OPERATIONS
----------------------------------------------------------------*/

/**
 * Insert an edge into the coverage graph.
 * Prevents self-loops (source === target).
 *
 * Adapted from causal-edges.ts insertEdge():
 * - Self-loop prevention
 * - Weight clamping (0.0-2.0 range for coverage, vs 0-1 for causal)
 * - Auto-generated string edge IDs
 *
 * @param {{ nodes: Map, edges: Map }} graph - In-memory coverage graph
 * @param {string} source - Source node ID
 * @param {string} target - Target node ID
 * @param {string} relation - Relation type (e.g., ANSWERS, COVERS)
 * @param {number} [weight=1.0] - Edge weight (clamped to 0.0-2.0)
 * @param {object} [metadata={}] - Arbitrary metadata for the edge
 * @returns {string|null} Edge ID if inserted, null if rejected
 */
function insertEdge(graph, source, target, relation, weight, metadata) {
  if (weight === undefined || weight === null) weight = 1.0;
  if (!metadata) metadata = {};

  // Prevent self-loops (adapted from causal-edges.ts line 179)
  if (source === target) {
    return null;
  }

  const clamped = clampWeight(weight);
  if (clamped === null) {
    return null;
  }

  const edgeId = `e-${nextEdgeId++}`;

  // Ensure source and target nodes exist
  if (!graph.nodes.has(source)) {
    graph.nodes.set(source, { id: source, createdAt: new Date().toISOString() });
  }
  if (!graph.nodes.has(target)) {
    graph.nodes.set(target, { id: target, createdAt: new Date().toISOString() });
  }

  graph.edges.set(edgeId, {
    id: edgeId,
    source,
    target,
    relation,
    weight: clamped,
    metadata,
    createdAt: new Date().toISOString(),
  });

  return edgeId;
}

/**
 * Update an existing edge in the coverage graph.
 * Weight is clamped to [0.0, 2.0].
 *
 * Adapted from causal-edges.ts updateEdge():
 * - Partial updates (weight and/or metadata)
 * - Weight clamping on update
 *
 * @param {{ nodes: Map, edges: Map }} graph - In-memory coverage graph
 * @param {string} edgeId - Edge identifier
 * @param {{ weight?: number, metadata?: object, relation?: string }} updates - Fields to update
 * @returns {boolean} True if edge was found and updated
 */
function updateEdge(graph, edgeId, updates) {
  const edge = graph.edges.get(edgeId);
  if (!edge) return false;

  if (!updates || typeof updates !== 'object') return false;

  let changed = false;

  if (updates.weight !== undefined) {
    const clamped = clampWeight(updates.weight);
    if (clamped === null) return false;
    edge.weight = clamped;
    changed = true;
  }

  if (updates.metadata !== undefined) {
    edge.metadata = { ...edge.metadata, ...updates.metadata };
    changed = true;
  }

  if (updates.relation !== undefined) {
    edge.relation = updates.relation;
    changed = true;
  }

  return changed;
}

/**
 * Delete an edge from the coverage graph.
 *
 * Adapted from causal-edges.ts deleteEdge().
 *
 * @param {{ nodes: Map, edges: Map }} graph - In-memory coverage graph
 * @param {string} edgeId - Edge identifier
 * @returns {boolean} True if edge was found and deleted
 */
function deleteEdge(graph, edgeId) {
  return graph.edges.delete(edgeId);
}

/* ---------------------------------------------------------------
   4. GRAPH TRAVERSAL
----------------------------------------------------------------*/

/**
 * BFS traversal following provenance chains from a starting node.
 * Returns all reachable nodes with their depth and traversal path.
 *
 * Adapted from causal-edges.ts getCausalChain():
 * - BFS instead of DFS for breadth-first provenance
 * - Cycle prevention via visited set
 * - Depth limiting
 *
 * @param {{ nodes: Map, edges: Map }} graph - In-memory coverage graph
 * @param {string} nodeId - Starting node ID
 * @param {number} [maxDepth=5] - Maximum traversal depth
 * @returns {Array<{ id: string, depth: number, relation: string, weight: number, path: string[] }>}
 */
function traverseProvenance(graph, nodeId, maxDepth) {
  if (maxDepth === undefined || maxDepth === null) maxDepth = DEFAULT_MAX_DEPTH;

  const results = [];
  const visited = new Set();
  visited.add(nodeId);

  // BFS queue: each entry is { id, depth, relation, weight, path }
  const queue = [{ id: nodeId, depth: 0, relation: 'ROOT', weight: 1.0, path: [nodeId] }];
  let queueIndex = 0;

  while (queueIndex < queue.length) {
    const current = queue[queueIndex++];

    if (current.depth > 0) {
      results.push({
        id: current.id,
        depth: current.depth,
        relation: current.relation,
        weight: current.weight,
        path: current.path,
      });
    }

    if (current.depth >= maxDepth) continue;

    // Find outgoing edges from current node
    for (const edge of graph.edges.values()) {
      if (edge.source !== current.id) continue;
      if (visited.has(edge.target)) continue;

      visited.add(edge.target);
      queue.push({
        id: edge.target,
        depth: current.depth + 1,
        relation: edge.relation,
        weight: current.weight * edge.weight,
        path: [...current.path, edge.target],
      });
    }
  }

  return results;
}

/**
 * Get all edges originating from a given node.
 *
 * @param {{ nodes: Map, edges: Map }} graph - In-memory coverage graph
 * @param {string} nodeId - Source node ID
 * @returns {Array<object>} Edges from this node
 */
function getEdgesFrom(graph, nodeId) {
  const results = [];
  for (const edge of graph.edges.values()) {
    if (edge.source === nodeId) results.push(edge);
  }
  return results;
}

/**
 * Get all edges pointing to a given node.
 *
 * @param {{ nodes: Map, edges: Map }} graph - In-memory coverage graph
 * @param {string} nodeId - Target node ID
 * @returns {Array<object>} Edges to this node
 */
function getEdgesTo(graph, nodeId) {
  const results = [];
  for (const edge of graph.edges.values()) {
    if (edge.target === nodeId) results.push(edge);
  }
  return results;
}

/**
 * Reset the internal edge ID counter. Useful for tests.
 */
function resetEdgeIdCounter() {
  nextEdgeId = 1;
}

/* ---------------------------------------------------------------
   5. EXPORTS
----------------------------------------------------------------*/

module.exports = {
  // Constants
  RESEARCH_RELATION_WEIGHTS,
  REVIEW_RELATION_WEIGHTS,
  DEFAULT_MAX_DEPTH,

  // Factory
  createGraph,

  // Edge operations
  insertEdge,
  updateEdge,
  deleteEdge,

  // Traversal
  traverseProvenance,
  getEdgesFrom,
  getEdgesTo,

  // Helpers
  clampWeight,
  resetEdgeIdCounter,
};
