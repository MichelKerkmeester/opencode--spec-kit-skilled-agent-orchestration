'use strict';

// ---------------------------------------------------------------
// MODULE: Coverage Graph Session Helpers
// ---------------------------------------------------------------
// Shared session normalization and filtering helpers for the
// in-memory coverage-graph CJS libraries.
// ---------------------------------------------------------------

/* ---------------------------------------------------------------
   1. NORMALIZATION
----------------------------------------------------------------*/

/**
 * Normalize a session identifier into a comparable string.
 * @param {unknown} sessionId
 * @returns {string|null}
 */
function normalizeSessionId(sessionId) {
  if (typeof sessionId !== 'string') return null;
  const normalized = sessionId.trim();
  return normalized.length > 0 ? normalized : null;
}

/**
 * Read a normalized session identifier from a node record.
 * @param {unknown} node
 * @returns {string|null}
 */
function getNodeSessionId(node) {
  if (!node || typeof node !== 'object') return null;
  if (normalizeSessionId(node.sessionId)) return normalizeSessionId(node.sessionId);
  if (node.metadata && typeof node.metadata === 'object') {
    return normalizeSessionId(node.metadata.sessionId);
  }
  return null;
}

/**
 * Read a normalized session identifier from an edge or its endpoint nodes.
 * Resolution order is explicit edge session -> edge metadata session -> endpoint nodes.
 * If the edge itself carries no session id and the source/target nodes disagree, the
 * target node session wins; mixed-session edges should set edge.sessionId explicitly.
 * @param {{ nodes?: Map<string, object> }} graph
 * @param {unknown} edge
 * @returns {string|null}
 */
function getEdgeSessionId(graph, edge) {
  if (!edge || typeof edge !== 'object') return null;
  if (normalizeSessionId(edge.sessionId)) return normalizeSessionId(edge.sessionId);
  if (edge.metadata && typeof edge.metadata === 'object') {
    const metadataSessionId = normalizeSessionId(edge.metadata.sessionId);
    if (metadataSessionId) return metadataSessionId;
  }

  const nodes = graph && graph.nodes instanceof Map ? graph.nodes : null;
  if (!nodes) return null;

  const sourceSessionId = getNodeSessionId(nodes.get(edge.source));
  const targetSessionId = getNodeSessionId(nodes.get(edge.target));
  if (sourceSessionId && (!targetSessionId || targetSessionId === sourceSessionId)) return sourceSessionId;
  return targetSessionId;
}

/* ---------------------------------------------------------------
   2. FILTERING
----------------------------------------------------------------*/

/**
 * Check whether a node or edge belongs to the requested session.
 * @param {{ nodes?: Map<string, object> }} graph
 * @param {unknown} record
 * @param {unknown} sessionId
 * @param {'node'|'edge'} recordType
 * @returns {boolean}
 */
function matchesSession(graph, record, sessionId, recordType) {
  const requestedSessionId = normalizeSessionId(sessionId);
  if (!requestedSessionId) return true;

  const actualSessionId = recordType === 'edge'
    ? getEdgeSessionId(graph, record)
    : getNodeSessionId(record);

  return actualSessionId === requestedSessionId;
}

/**
 * Filter node identifiers by normalized session id.
 * @param {{ nodes?: Map<string, object> }} graph
 * @param {unknown} sessionId
 * @returns {string[]}
 */
function getFilteredNodeIds(graph, sessionId) {
  if (!graph || !(graph.nodes instanceof Map)) return [];
  const results = [];
  for (const [nodeId, node] of graph.nodes.entries()) {
    if (matchesSession(graph, node, sessionId, 'node')) results.push(nodeId);
  }
  return results;
}

/**
 * Filter edge records by normalized session id.
 * @param {{ nodes?: Map<string, object>, edges?: Map<string, object> }} graph
 * @param {unknown} sessionId
 * @returns {object[]}
 */
function getFilteredEdges(graph, sessionId) {
  if (!graph || !(graph.edges instanceof Map)) return [];
  const results = [];
  for (const edge of graph.edges.values()) {
    if (matchesSession(graph, edge, sessionId, 'edge')) results.push(edge);
  }
  return results;
}

/* ---------------------------------------------------------------
   3. EXPORTS
----------------------------------------------------------------*/

module.exports = {
  normalizeSessionId,
  getNodeSessionId,
  getEdgeSessionId,
  matchesSession,
  getFilteredNodeIds,
  getFilteredEdges,
};
