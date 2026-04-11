'use strict';
// ADR-001: sourceDiversity is an adapter replicating the MCP handler's canonical algorithm. Do not diverge. See ./mcp_server/lib/coverage-graph/coverage-graph-signals.ts for the authoritative implementation.

// ---------------------------------------------------------------
// MODULE: Coverage Graph Convergence (T005)
// ---------------------------------------------------------------
// Graph-aware convergence helpers that combine graph-structural
// signals with Phase 1 stop-trace convergence scoring. Provides
// STOP-BLOCKING guards (sourceDiversity, evidenceDepth) that must
// pass before a deep-research or deep-review loop can terminate.
// ---------------------------------------------------------------

const { computeClusterMetrics } = require('./coverage-graph-signals.cjs');

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
 * Parse node metadata into a plain object. Invalid metadata is ignored to
 * match the TS signal layer's tolerant behavior.
 *
 * @param {unknown} metadata
 * @returns {object | null}
 */
function parseMetadata(metadata) {
  if (!metadata) return null;
  if (typeof metadata === 'string') {
    try {
      const parsed = JSON.parse(metadata);
      return parsed && typeof parsed === 'object' ? parsed : null;
    } catch {
      return null;
    }
  }
  return typeof metadata === 'object' ? metadata : null;
}

/**
 * Normalize the in-memory graph into the canonical research-signal shape used
 * by the MCP layer.
 *
 * @param {{ nodes: Map, edges: Map }} graph
 * @returns {{ nodes: Array<{ id: string, kind: string, metadata: object | null }>, edges: Array<{ sourceId: string, targetId: string, relation: string }> }}
 */
function normalizeResearchGraph(graph) {
  const normalized = {
    nodes: [],
    edges: [],
  };

  if (!isValidGraph(graph)) return normalized;

  for (const [nodeId, rawNode] of graph.nodes.entries()) {
    const id = typeof rawNode.id === 'string' ? rawNode.id : nodeId;
    const rawKind = typeof rawNode.kind === 'string'
      ? rawNode.kind
      : typeof rawNode.type === 'string'
        ? rawNode.type
        : '';

    normalized.nodes.push({
      id,
      kind: rawKind.toUpperCase(),
      metadata: parseMetadata(rawNode.metadata),
    });
  }

  for (const rawEdge of graph.edges.values()) {
    normalized.edges.push({
      sourceId: rawEdge.source,
      targetId: rawEdge.target,
      relation: rawEdge.relation,
    });
  }

  return normalized;
}

/**
 * Build question -> finding adjacency for ANSWERS paths.
 *
 * @param {Array<{ sourceId: string, targetId: string, relation: string }>} edges
 * @returns {Map<string, string[]>}
 */
function buildAnsweringFindingsByQuestion(edges) {
  const answeringFindings = new Map();

  for (const edge of edges) {
    if (edge.relation !== 'ANSWERS') continue;
    if (!answeringFindings.has(edge.targetId)) answeringFindings.set(edge.targetId, []);
    answeringFindings.get(edge.targetId).push(edge.sourceId);
  }

  return answeringFindings;
}

/**
 * Build finding -> source adjacency for CITES paths.
 *
 * @param {Array<{ sourceId: string, targetId: string, relation: string }>} edges
 * @returns {Map<string, string[]>}
 */
function buildCitedSourcesByFinding(edges) {
  const citedSources = new Map();

  for (const edge of edges) {
    if (edge.relation !== 'CITES') continue;
    if (!citedSources.has(edge.sourceId)) citedSources.set(edge.sourceId, []);
    citedSources.get(edge.sourceId).push(edge.targetId);
  }

  return citedSources;
}

/* ---------------------------------------------------------------
   1. THRESHOLDS
----------------------------------------------------------------*/

/**
 * Minimum source diversity required for the STOP gate to pass.
 * Value: average 1.5 distinct source quality classes per question.
 * @type {number}
 */
const SOURCE_DIVERSITY_THRESHOLD = 1.5;

/**
 * Minimum average evidence chain depth required for the STOP gate to pass.
 * Value: evidence chains must average at least 1.5 hops deep.
 * @type {number}
 */
const EVIDENCE_DEPTH_THRESHOLD = 1.5;

/* ---------------------------------------------------------------
   2. SOURCE DIVERSITY
----------------------------------------------------------------*/

/**
 * Compute canonical research source diversity: for each question, count the
 * distinct source quality classes reachable through ANSWERS -> CITES paths and
 * average that count across all questions.
 *
 * @param {{ nodes: Map, edges: Map }} graph - In-memory coverage graph
 * @returns {number} Source diversity score
 */
function computeSourceDiversity(graph) {
  const normalized = normalizeResearchGraph(graph);
  const questionIds = normalized.nodes
    .filter((node) => node.kind === 'QUESTION')
    .map((node) => node.id);

  if (questionIds.length === 0) return 0;

  const answeringFindings = buildAnsweringFindingsByQuestion(normalized.edges);
  const citedSources = buildCitedSourcesByFinding(normalized.edges);
  const sourceMetadataById = new Map();

  for (const node of normalized.nodes) {
    if (node.kind !== 'SOURCE' || !node.metadata) continue;
    sourceMetadataById.set(node.id, node.metadata);
  }

  let totalDiversity = 0;

  for (const questionId of questionIds) {
    const qualityClasses = new Set();

    for (const findingId of answeringFindings.get(questionId) || []) {
      for (const sourceId of citedSources.get(findingId) || []) {
        const qualityClass = sourceMetadataById.get(sourceId)?.quality_class;
        if (typeof qualityClass === 'string' && qualityClass.length > 0) {
          qualityClasses.add(qualityClass);
        }
      }
    }

    totalDiversity += qualityClasses.size;
  }

  return totalDiversity / questionIds.length;
}

/* ---------------------------------------------------------------
   3. EVIDENCE DEPTH
----------------------------------------------------------------*/

/**
 * Compute canonical research evidence depth: average path length across all
 * question -> finding paths, scoring 2 when the finding cites at least one
 * source and 1 when it does not.
 *
 * @param {{ nodes: Map, edges: Map }} graph - In-memory coverage graph
 * @returns {number} Average evidence depth
 */
function computeEvidenceDepth(graph) {
  const normalized = normalizeResearchGraph(graph);
  const questionIds = normalized.nodes
    .filter((node) => node.kind === 'QUESTION')
    .map((node) => node.id);

  if (questionIds.length === 0) return 0;

  const answeringFindings = buildAnsweringFindingsByQuestion(normalized.edges);
  const citedSources = buildCitedSourcesByFinding(normalized.edges);
  let totalDepth = 0;
  let pathCount = 0;

  for (const questionId of questionIds) {
    for (const findingId of answeringFindings.get(questionId) || []) {
      totalDepth += (citedSources.get(findingId) || []).length > 0 ? 2 : 1;
      pathCount++;
    }
  }

  return pathCount > 0 ? totalDepth / pathCount : 0;
}

/* ---------------------------------------------------------------
   4. QUESTION COVERAGE
----------------------------------------------------------------*/

/**
 * Compute canonical research question coverage: questions with at least two
 * ANSWERS edges divided by all questions.
 *
 * @param {{ nodes: Map, edges: Map }} graph - In-memory coverage graph
 * @returns {number} Coverage ratio in [0.0, 1.0]
 */
function computeQuestionCoverage(graph) {
  const normalized = normalizeResearchGraph(graph);
  const questionIds = normalized.nodes
    .filter((node) => node.kind === 'QUESTION')
    .map((node) => node.id);

  if (questionIds.length === 0) return 0;

  const answeringFindings = buildAnsweringFindingsByQuestion(normalized.edges);
  let coveredQuestions = 0;

  for (const questionId of questionIds) {
    if ((answeringFindings.get(questionId) || []).length >= 2) {
      coveredQuestions++;
    }
  }

  return coveredQuestions / questionIds.length;
}

/**
 * Compute canonical research contradiction density: CONTRADICTS edges divided
 * by all edges.
 *
 * @param {{ nodes: Map, edges: Map }} graph - In-memory coverage graph
 * @returns {number} Contradiction density in [0.0, 1.0]
 */
function computeContradictionDensity(graph) {
  const normalized = normalizeResearchGraph(graph);
  if (normalized.edges.length === 0) return 0;

  let contradictionCount = 0;
  for (const edge of normalized.edges) {
    if (edge.relation === 'CONTRADICTS') contradictionCount++;
  }

  return contradictionCount / normalized.edges.length;
}

/* ---------------------------------------------------------------
   5. GRAPH CONVERGENCE
----------------------------------------------------------------*/

/**
 * Compute a combined graph convergence score that blends graph-structural
 * signals with Phase 1 stop-trace signals.
 *
 * The graph convergence score supplements (does not replace) the existing
 * compositeStop score from Phase 1. It adds structural awareness:
 * - Cluster fragmentation penalty (many small disconnected components = low convergence)
 * - Evidence depth bonus (deep chains = high convergence)
 * - Question coverage (covered questions = progress toward convergence)
 *
 * @param {{ nodes: Map, edges: Map }} graph - In-memory coverage graph
 * @param {{ compositeStop?: number, rollingAvg?: number, madScore?: number }} [signals={}]
 *   Phase 1 stop-trace signals to blend with graph signals
 * @returns {{ graphScore: number, blendedScore: number, components: object }}
 */
function computeGraphConvergence(graph, signals) {
  if (!isValidGraph(graph)) {
    return {
      graphScore: 0,
      blendedScore: 0,
      components: {
        fragmentationScore: 0,
        normalizedDepth: 0,
        questionCoverage: 0,
        contradictionDensity: 0,
        evidenceDepth: 0,
        sourceDiversity: 0,
        compositeStop: null,
      },
    };
  }
  if (!signals) signals = {};

  const cluster = computeClusterMetrics(graph);
  const questionCoverage = computeQuestionCoverage(graph);
  const contradictionDensity = computeContradictionDensity(graph);
  const evidenceDepth = computeEvidenceDepth(graph);
  const sourceDiversity = computeSourceDiversity(graph);

  const nodeCount = graph.nodes.size;
  const fragmentationScore = nodeCount > 0
    ? 1.0 - (cluster.isolatedNodes / nodeCount)
    : 0;

  // Preserve the existing soft-cap behavior for the graph-only blend.
  const normalizedDepth = Math.min(evidenceDepth / 5.0, 1.0);

  const graphScore = (
    (fragmentationScore * 0.25) +
    (normalizedDepth * 0.25) +
    (questionCoverage * 0.30) +
    (sourceDiversity * 0.20)
  );

  const compositeStop = typeof signals.compositeStop === 'number' ? signals.compositeStop : null;
  const blendedScore = compositeStop !== null
    ? (compositeStop * 0.6) + (graphScore * 0.4)
    : graphScore;

  return {
    graphScore: Math.round(graphScore * 1000) / 1000,
    blendedScore: Math.round(blendedScore * 1000) / 1000,
    components: {
      fragmentationScore: Math.round(fragmentationScore * 1000) / 1000,
      normalizedDepth: Math.round(normalizedDepth * 1000) / 1000,
      questionCoverage: Math.round(questionCoverage * 1000) / 1000,
      contradictionDensity: Math.round(contradictionDensity * 1000) / 1000,
      evidenceDepth: Math.round(evidenceDepth * 1000) / 1000,
      sourceDiversity: Math.round(sourceDiversity * 1000) / 1000,
      compositeStop: compositeStop !== null ? compositeStop : null,
    },
  };
}

/* ---------------------------------------------------------------
   6. STOP GATES
----------------------------------------------------------------*/

/**
 * Evaluate the STOP-BLOCKING graph gates.
 * Both gates must pass for the deep loop to be allowed to terminate.
 *
 * Gates:
 * - sourceDiversity: average distinct source quality classes per question >= threshold
 * - evidenceDepth: average evidence chain depth >= threshold
 *
 * @param {{ nodes: Map, edges: Map }} graph - In-memory coverage graph
 * @returns {{ sourceDiversity: { pass: boolean, value: number, threshold: number }, evidenceDepth: { pass: boolean, value: number, threshold: number }, allPass: boolean }}
 */
function evaluateGraphGates(graph) {
  if (!isValidGraph(graph)) {
    return {
      sourceDiversity: { pass: false, value: 0, threshold: SOURCE_DIVERSITY_THRESHOLD },
      evidenceDepth: { pass: false, value: 0, threshold: EVIDENCE_DEPTH_THRESHOLD },
      allPass: false,
    };
  }
  const diversity = computeSourceDiversity(graph);
  const depth = computeEvidenceDepth(graph);

  const sourceDiversityGate = {
    pass: diversity >= SOURCE_DIVERSITY_THRESHOLD,
    value: Math.round(diversity * 1000) / 1000,
    threshold: SOURCE_DIVERSITY_THRESHOLD,
  };

  const evidenceDepthGate = {
    pass: depth >= EVIDENCE_DEPTH_THRESHOLD,
    value: Math.round(depth * 1000) / 1000,
    threshold: EVIDENCE_DEPTH_THRESHOLD,
  };

  return {
    sourceDiversity: sourceDiversityGate,
    evidenceDepth: evidenceDepthGate,
    allPass: sourceDiversityGate.pass && evidenceDepthGate.pass,
  };
}

/* ---------------------------------------------------------------
   7. EXPORTS
----------------------------------------------------------------*/

module.exports = {
  // Thresholds
  SOURCE_DIVERSITY_THRESHOLD,
  EVIDENCE_DEPTH_THRESHOLD,

  // Individual computations
  computeSourceDiversity,
  computeEvidenceDepth,
  computeQuestionCoverage,
  computeContradictionDensity,

  // Combined convergence
  computeGraphConvergence,

  // Stop gates
  evaluateGraphGates,
};
