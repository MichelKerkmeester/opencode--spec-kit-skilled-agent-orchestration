// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Mutation Coverage — Track Explored Mutations & Dimension Trajectories   ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────
const fs = require('node:fs');
const path = require('node:path');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Namespace for improvement loop coverage graph (ADR-002).
 * Isolates from deep-research/review coverage graphs.
 * @type {string}
 */
const LOOP_TYPE = 'improvement';

/**
 * Minimum data points required before convergence can be claimed (REQ-AI-007).
 * Research finding: at least 3 scored evidence iterations.
 * @type {number}
 */
const MIN_TRAJECTORY_POINTS = 3;

/**
 * Default stability threshold: all dimension deltas within +/- this value.
 * Research finding: "stable" = 3+ scored iterations with deltas within +/-2.
 * @type {number}
 */
const DEFAULT_STABILITY_DELTA = 2;

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function readJsonSafe(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (_err) {
    return null;
  }
}

function writeJson(filePath, data) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

/**
 * Create an empty coverage graph.
 * @returns {object} Empty coverage graph structure
 */
function createCoverageGraph() {
  return {
    loopType: LOOP_TYPE,
    mutations: [],
    exhausted: [],
    trajectory: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. MUTATION TRACKING
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Record a mutation attempt in the coverage graph (REQ-AI-006).
 *
 * @param {string} coveragePath - Path to the coverage graph JSON file
 * @param {object} mutation - Mutation record: { dimension, mutationType, candidateId, iteration, outcome? }
 */
function recordMutation(coveragePath, mutation) {
  let graph = readJsonSafe(coveragePath);
  if (!graph) {
    graph = createCoverageGraph();
  }

  graph.mutations.push({
    ...mutation,
    timestamp: new Date().toISOString(),
  });
  graph.updatedAt = new Date().toISOString();

  writeJson(coveragePath, graph);
}

/**
 * Get mutations already tried, to prevent redundant exploration (REQ-AI-009).
 *
 * @param {string} coveragePath - Path to the coverage graph JSON file
 * @returns {object[]} Array of exhausted mutation records
 */
function getExhaustedMutations(coveragePath) {
  const graph = readJsonSafe(coveragePath);
  if (!graph) {
    return [];
  }
  return graph.exhausted || [];
}

/**
 * Mark a mutation type as exhausted for a given dimension (REQ-AI-009).
 *
 * @param {string} coveragePath - Path to the coverage graph JSON file
 * @param {string} dimension - Dimension name
 * @param {string} mutationType - Mutation type that has been fully explored
 */
function markExhausted(coveragePath, dimension, mutationType) {
  let graph = readJsonSafe(coveragePath);
  if (!graph) {
    graph = createCoverageGraph();
  }

  const alreadyExhausted = (graph.exhausted || []).some(
    (e) => e.dimension === dimension && e.mutationType === mutationType
  );

  if (!alreadyExhausted) {
    graph.exhausted.push({
      dimension,
      mutationType,
      exhaustedAt: new Date().toISOString(),
    });
  }

  graph.updatedAt = new Date().toISOString();
  writeJson(coveragePath, graph);
}

/**
 * Get coverage statistics per dimension (REQ-AI-006).
 *
 * @param {string} coveragePath - Path to the coverage graph JSON file
 * @returns {object} Coverage stats: { dimensions: { [dim]: { tried: string[], exhausted: string[], triedCount, exhaustedCount } } }
 */
function getMutationCoverage(coveragePath) {
  const graph = readJsonSafe(coveragePath);
  if (!graph) {
    return { dimensions: {} };
  }

  const dimensions = {};

  for (const mutation of graph.mutations || []) {
    const dim = mutation.dimension || 'unknown';
    if (!dimensions[dim]) {
      dimensions[dim] = { tried: new Set(), exhausted: new Set() };
    }
    dimensions[dim].tried.add(mutation.mutationType);
  }

  for (const exhaust of graph.exhausted || []) {
    const dim = exhaust.dimension || 'unknown';
    if (!dimensions[dim]) {
      dimensions[dim] = { tried: new Set(), exhausted: new Set() };
    }
    dimensions[dim].exhausted.add(exhaust.mutationType);
  }

  // Convert Sets to arrays for JSON serialization
  const result = {};
  for (const [dim, data] of Object.entries(dimensions)) {
    result[dim] = {
      tried: [...data.tried],
      exhausted: [...data.exhausted],
      triedCount: data.tried.size,
      exhaustedCount: data.exhausted.size,
    };
  }

  return { dimensions: result };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. DIMENSION TRAJECTORY
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Record a trajectory data point with per-dimension scores (REQ-AI-007).
 *
 * @param {string} coveragePath - Path to the coverage graph JSON file
 * @param {object} dataPoint - { iteration, scores: { structural, ruleCoherence, integration, outputQuality, systemFitness }, weightedScore?, gateResults? }
 */
function recordTrajectory(coveragePath, dataPoint) {
  let graph = readJsonSafe(coveragePath);
  if (!graph) {
    graph = createCoverageGraph();
  }

  graph.trajectory.push({
    ...dataPoint,
    timestamp: new Date().toISOString(),
  });
  graph.updatedAt = new Date().toISOString();

  writeJson(coveragePath, graph);
}

/**
 * Get the full trajectory from the coverage graph.
 *
 * @param {string} coveragePath - Path to the coverage graph JSON file
 * @returns {object[]} Array of trajectory data points
 */
function getTrajectory(coveragePath) {
  const graph = readJsonSafe(coveragePath);
  if (!graph) {
    return [];
  }
  return graph.trajectory || [];
}

/**
 * Check if convergence can be claimed based on trajectory data (REQ-AI-007).
 * Research finding: "stable" = 3+ scored iterations with all dimension deltas within +/-2.
 *
 * @param {string} coveragePath - Path to the coverage graph JSON file
 * @param {object} [options] - { minDataPoints?, stabilityDelta? }
 * @returns {{ canConverge: boolean, reason: string, dataPoints: number }}
 */
function checkConvergenceEligibility(coveragePath, options) {
  const opts = {
    minDataPoints: MIN_TRAJECTORY_POINTS,
    stabilityDelta: DEFAULT_STABILITY_DELTA,
    ...options,
  };

  const trajectory = getTrajectory(coveragePath);

  if (trajectory.length < opts.minDataPoints) {
    return {
      canConverge: false,
      reason: `Insufficient data points: ${trajectory.length} < ${opts.minDataPoints}`,
      dataPoints: trajectory.length,
    };
  }

  // Check if the last minDataPoints entries are stable
  const recent = trajectory.slice(-opts.minDataPoints);
  const dimensions = ['structural', 'ruleCoherence', 'integration', 'outputQuality', 'systemFitness'];
  const unstableDimensions = [];

  for (const dim of dimensions) {
    const scores = recent.map((p) => (p.scores && p.scores[dim]) || 0);
    const maxScore = Math.max(...scores);
    const minScore = Math.min(...scores);
    if (maxScore - minScore > opts.stabilityDelta) {
      unstableDimensions.push(dim);
    }
  }

  if (unstableDimensions.length > 0) {
    return {
      canConverge: false,
      reason: `Unstable dimensions: ${unstableDimensions.join(', ')}`,
      dataPoints: trajectory.length,
    };
  }

  return {
    canConverge: true,
    reason: 'All dimensions stable across last ' + opts.minDataPoints + ' data points',
    dataPoints: trajectory.length,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  LOOP_TYPE,
  MIN_TRAJECTORY_POINTS,
  DEFAULT_STABILITY_DELTA,
  createCoverageGraph,
  recordMutation,
  getExhaustedMutations,
  markExhausted,
  getMutationCoverage,
  recordTrajectory,
  getTrajectory,
  checkConvergenceEligibility,
};
