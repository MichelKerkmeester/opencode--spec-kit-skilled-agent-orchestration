'use strict';

// ---------------------------------------------------------------
// MODULE: Coverage Graph Convergence (T005)
// ---------------------------------------------------------------
// Graph-aware convergence helpers that combine graph-structural
// signals with Phase 1 stop-trace convergence scoring. Provides
// STOP-BLOCKING guards (sourceDiversity, evidenceDepth) that must
// pass before a deep-research or deep-review loop can terminate.
// ---------------------------------------------------------------

const { computeAllDepths, computeClusterMetrics } = require('./coverage-graph-signals.cjs');

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

/* ---------------------------------------------------------------
   1. THRESHOLDS
----------------------------------------------------------------*/

/**
 * Minimum source diversity ratio required for the STOP gate to pass.
 * Value: at least 40% of nodes must be unique sources.
 * @type {number}
 */
const SOURCE_DIVERSITY_THRESHOLD = 0.4;

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
 * Compute source diversity: ratio of unique source nodes to total nodes.
 * A "source node" is any node that has at least one outgoing edge
 * (i.e., it provides evidence/answers to other nodes).
 *
 * This is a STOP-BLOCKING guard: if diversity is too low, the research
 * loop has not explored enough independent sources.
 *
 * @param {{ nodes: Map, edges: Map }} graph - In-memory coverage graph
 * @returns {number} Source diversity ratio in [0.0, 1.0]
 */
function computeSourceDiversity(graph) {
  if (!isValidGraph(graph)) return 0;
  if (graph.nodes.size === 0) return 0;

  const sources = new Set();
  for (const edge of graph.edges.values()) {
    sources.add(edge.source);
  }

  return sources.size / graph.nodes.size;
}

/* ---------------------------------------------------------------
   3. EVIDENCE DEPTH
----------------------------------------------------------------*/

/**
 * Compute the average evidence chain depth across all nodes.
 * Uses longest-path depth from roots (nodes with in-degree 0) to
 * each node.
 *
 * This is a STOP-BLOCKING guard: if evidence chains are too shallow,
 * findings lack sufficient corroboration depth.
 *
 * @param {{ nodes: Map, edges: Map }} graph - In-memory coverage graph
 * @returns {number} Average depth across all nodes
 */
function computeEvidenceDepth(graph) {
  if (!isValidGraph(graph)) return 0;
  if (graph.nodes.size === 0) return 0;

  const depths = computeAllDepths(graph);
  let totalDepth = 0;
  let count = 0;

  for (const depth of depths.values()) {
    totalDepth += depth;
    count++;
  }

  return count > 0 ? totalDepth / count : 0;
}

/* ---------------------------------------------------------------
   4. QUESTION COVERAGE
----------------------------------------------------------------*/

/**
 * Compute question coverage: ratio of answered questions to total questions.
 * Questions are identified by node metadata: nodes with `type: 'question'`
 * are questions; those with an ANSWERS edge pointing to them are answered.
 *
 * @param {{ nodes: Map, edges: Map }} graph - In-memory coverage graph
 * @returns {number} Coverage ratio in [0.0, 1.0]
 */
function computeQuestionCoverage(graph) {
  if (!isValidGraph(graph)) return 0;
  // Collect question nodes
  const questionIds = new Set();
  for (const [nodeId, node] of graph.nodes) {
    if (node.type === 'question') {
      questionIds.add(nodeId);
    }
  }

  if (questionIds.size === 0) return 1.0; // No questions = fully covered

  // Find answered questions: any question that is a target of an ANSWERS edge
  const answeredIds = new Set();
  for (const edge of graph.edges.values()) {
    if (edge.relation === 'ANSWERS' && questionIds.has(edge.target)) {
      answeredIds.add(edge.target);
    }
  }

  return answeredIds.size / questionIds.size;
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
 * - Question coverage (answered questions = progress toward convergence)
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
        sourceDiversity: 0,
        compositeStop: null,
      },
    };
  }
  if (!signals) signals = {};

  const cluster = computeClusterMetrics(graph);
  const questionCoverage = computeQuestionCoverage(graph);
  const evidenceDepth = computeEvidenceDepth(graph);
  const sourceDiversity = computeSourceDiversity(graph);

  // Graph-structural convergence components
  //
  // Fragmentation penalty: if there are many small isolated components,
  // the research hasn't connected findings together yet
  const nodeCount = graph.nodes.size;
  const fragmentationScore = nodeCount > 0
    ? 1.0 - (cluster.isolatedNodes / nodeCount)
    : 0;

  // Normalize evidence depth to [0, 1] with a soft cap at depth 5
  const normalizedDepth = Math.min(evidenceDepth / 5.0, 1.0);

  // Graph convergence score: weighted combination of structural signals
  const graphScore = (
    (fragmentationScore * 0.25) +
    (normalizedDepth * 0.25) +
    (questionCoverage * 0.30) +
    (sourceDiversity * 0.20)
  );

  // Blend with Phase 1 compositeStop if available
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
 * - sourceDiversity: unique sources / total nodes >= threshold
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

  // Combined convergence
  computeGraphConvergence,

  // Stop gates
  evaluateGraphGates,
};
