'use strict';

// ---------------------------------------------------------------
// MODULE: Coverage Graph Contradictions (T004)
// ---------------------------------------------------------------
// Extracted and adapted from mcp_server/lib/graph/contradiction-detection.ts
// Provides contradiction scanning and reporting for in-memory
// coverage graphs used by deep-research and deep-review.
// ---------------------------------------------------------------

/* ---------------------------------------------------------------
   1. CONSTANTS
----------------------------------------------------------------*/

/**
 * The relation type that indicates a contradiction edge.
 * @type {string}
 */
const CONTRADICTION_RELATION = 'CONTRADICTS';

/* ---------------------------------------------------------------
   2. SCAN
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

function getNodeSessionId(node) {
  if (!node || typeof node !== 'object') return null;
  if (typeof node.sessionId === 'string' && node.sessionId) return node.sessionId;
  if (node.metadata && typeof node.metadata === 'object' && typeof node.metadata.sessionId === 'string' && node.metadata.sessionId) {
    return node.metadata.sessionId;
  }
  return null;
}

function getEdgeSessionId(graph, edge) {
  if (!edge || typeof edge !== 'object') return null;
  if (typeof edge.sessionId === 'string' && edge.sessionId) return edge.sessionId;
  if (edge.metadata && typeof edge.metadata === 'object' && typeof edge.metadata.sessionId === 'string' && edge.metadata.sessionId) {
    return edge.metadata.sessionId;
  }
  const sourceSessionId = getNodeSessionId(graph.nodes.get(edge.source));
  const targetSessionId = getNodeSessionId(graph.nodes.get(edge.target));
  if (sourceSessionId && (!targetSessionId || targetSessionId === sourceSessionId)) return sourceSessionId;
  return targetSessionId;
}

function matchesSession(graph, edge, sessionId) {
  if (!sessionId) return true;
  return getEdgeSessionId(graph, edge) === sessionId;
}

/**
 * Scan the graph for all CONTRADICTS edges and return contradiction pairs.
 * Each pair includes the source node, target node, edge details, and any
 * evidence metadata attached to the edge.
 *
 * Adapted from contradiction-detection.ts detectContradictions():
 * - Scans all edges rather than checking a single new edge
 * - Returns structured pairs for downstream analysis
 * - No DB dependency; pure in-memory scan
 *
 * @param {{ nodes: Map, edges: Map }} graph - In-memory coverage graph
 * @returns {Array<{ edgeId: string, source: string, target: string, weight: number, metadata: object }>}
 */
function scanContradictions(graph, sessionId) {
  if (!isValidGraph(graph)) return [];
  const contradictions = [];

  for (const edge of graph.edges.values()) {
    if (edge.relation !== CONTRADICTION_RELATION) continue;
    if (!matchesSession(graph, edge, sessionId)) continue;

    contradictions.push({
      edgeId: edge.id,
      source: edge.source,
      target: edge.target,
      weight: edge.weight,
      metadata: edge.metadata || {},
    });
  }

  return contradictions;
}

/* ---------------------------------------------------------------
   3. REPORT
----------------------------------------------------------------*/

/**
 * Generate a structured contradiction report with node details
 * and evidence references.
 *
 * Adapted from contradiction-detection.ts's result structure:
 * - Enriches each contradiction pair with source/target node data
 * - Collects evidence references from edge metadata
 * - Groups by affected node for summary view
 *
 * @param {{ nodes: Map, edges: Map }} graph - In-memory coverage graph
 * @returns {{ total: number, pairs: Array<object>, byNode: Map<string, object[]> }}
 */
function reportContradictions(graph, sessionId) {
  if (!isValidGraph(graph)) {
    return { total: 0, pairs: [], byNode: new Map() };
  }
  const raw = scanContradictions(graph, sessionId);

  const pairs = raw.map((c) => {
    const sourceNode = graph.nodes.get(c.source) || { id: c.source };
    const targetNode = graph.nodes.get(c.target) || { id: c.target };

    return {
      edgeId: c.edgeId,
      source: {
        id: c.source,
        ...sourceNode,
      },
      target: {
        id: c.target,
        ...targetNode,
      },
      weight: c.weight,
      evidence: c.metadata.evidence || null,
      reason: c.metadata.reason || null,
    };
  });

  // Group contradictions by affected node (both sides)
  const byNode = new Map();

  for (const pair of pairs) {
    // Source side
    if (!byNode.has(pair.source.id)) byNode.set(pair.source.id, []);
    byNode.get(pair.source.id).push(pair);

    // Target side
    if (!byNode.has(pair.target.id)) byNode.set(pair.target.id, []);
    byNode.get(pair.target.id).push(pair);
  }

  return {
    total: pairs.length,
    pairs,
    byNode,
  };
}

/* ---------------------------------------------------------------
   4. DENSITY
----------------------------------------------------------------*/

/**
 * Compute the contradiction density: ratio of nodes involved in
 * at least one contradiction to total node count.
 *
 * A density of 0.0 means no contradictions; 1.0 means every node
 * is involved in at least one contradiction edge.
 *
 * @param {{ nodes: Map, edges: Map }} graph - In-memory coverage graph
 * @returns {number} Contradiction density in [0.0, 1.0]
 */
function contradictionDensity(graph, sessionId) {
  if (!isValidGraph(graph)) return 0;
  const scopedNodeIds = new Set();
  for (const [nodeId, node] of graph.nodes.entries()) {
    if (sessionId && getNodeSessionId(node) !== sessionId) continue;
    scopedNodeIds.add(nodeId);
  }
  if (scopedNodeIds.size === 0) return 0;

  const contradictedNodes = new Set();

  for (const edge of graph.edges.values()) {
    if (edge.relation !== CONTRADICTION_RELATION) continue;
    if (!matchesSession(graph, edge, sessionId)) continue;
    contradictedNodes.add(edge.source);
    contradictedNodes.add(edge.target);
  }

  return contradictedNodes.size / scopedNodeIds.size;
}

/* ---------------------------------------------------------------
   5. EXPORTS
----------------------------------------------------------------*/

module.exports = {
  CONTRADICTION_RELATION,
  scanContradictions,
  reportContradictions,
  contradictionDensity,
};
