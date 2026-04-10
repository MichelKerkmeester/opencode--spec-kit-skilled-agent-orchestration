'use strict';

// ---------------------------------------------------------------
// MODULE: Wave Convergence (T005)
// ---------------------------------------------------------------
// Segment-level convergence helpers that wrap Phase 002 graph
// metrics and stop traces. Provides wave-level convergence
// evaluation, segment pruning logic, and promotion decisions.
//
// v2 graph-enhanced convergence is gated on Phase 002 coverage
// graph being operational. v1 uses heuristic signals only.
// ---------------------------------------------------------------

/* ---------------------------------------------------------------
   1. CONSTANTS
----------------------------------------------------------------*/

/**
 * Default convergence threshold for wave segments.
 * @type {number}
 */
const DEFAULT_WAVE_CONVERGENCE_THRESHOLD = 0.05;

/**
 * Minimum iterations per segment before convergence is evaluable.
 * @type {number}
 */
const MIN_ITERATIONS_FOR_CONVERGENCE = 2;

/**
 * Maximum consecutive low-progress iterations before prune is suggested.
 * @type {number}
 */
const PRUNE_STUCK_THRESHOLD = 3;

/**
 * Convergence signal weights for wave-level evaluation.
 * @type {Readonly<Record<string, number>>}
 */
const WAVE_CONVERGENCE_WEIGHTS = Object.freeze({
  segmentConvergence: 0.40,
  crossSegmentNovelty: 0.30,
  gapCoverage: 0.30,
});

/* ---------------------------------------------------------------
   2. WAVE-LEVEL CONVERGENCE
----------------------------------------------------------------*/

/**
 * Evaluate whether wave-level convergence has been reached.
 * Combines per-segment convergence scores, cross-segment novelty,
 * and overall gap coverage.
 *
 * @param {object} board - Coordination board state
 * @param {object} signals - Convergence signal inputs
 * @param {Array<object>} [signals.segmentStates] - Per-segment states with convergence scores
 * @param {number} [signals.crossSegmentNovelty] - Novelty ratio across segments (0.0-1.0)
 * @param {number} [signals.gapCoverage] - Fraction of known gaps covered (0.0-1.0)
 * @param {object} [signals.graphMetrics] - Phase 002 graph metrics (optional, v2)
 * @param {number} [threshold] - Custom convergence threshold
 * @returns {{ converged: boolean, score: number, signals: object, blockedBy: Array<string> }}
 */
function evaluateWaveConvergence(board, signals, threshold) {
  const thresh = typeof threshold === 'number' ? threshold : DEFAULT_WAVE_CONVERGENCE_THRESHOLD;

  if (!board || !signals) {
    return {
      converged: false,
      score: 0,
      signals: {},
      blockedBy: ['missing-inputs'],
    };
  }

  const segmentStates = signals.segmentStates || [];
  const blockedBy = [];
  const signalResults = {};

  // Gate: All board segments must be in terminal status before convergence is possible
  const TERMINAL_STATUSES = new Set(['completed', 'pruned', 'failed', 'converged']);
  if (board.segments && board.segments.length > 0) {
    const nonTerminal = board.segments.filter(s => !TERMINAL_STATUSES.has(s.status));
    if (nonTerminal.length > 0) {
      blockedBy.push(`${nonTerminal.length} segments not in terminal status`);
    }
  }

  // Signal 1: Segment convergence (per-segment scores)
  let segmentConvergenceScore = 0;
  if (segmentStates.length > 0) {
    const convergenceScores = segmentStates.map(s => s.convergenceScore || 0);
    segmentConvergenceScore = convergenceScores.reduce((a, b) => a + b, 0) / convergenceScores.length;

    // Check if any segment has not converged (score must reach >= 1-threshold, e.g. >= 0.95 for threshold 0.05)
    const unconverged = segmentStates.filter(s => (s.convergenceScore || 0) < (1.0 - thresh));
    if (unconverged.length > 0) {
      blockedBy.push(`${unconverged.length} segments not converged`);
    }
  } else {
    blockedBy.push('no-segment-states');
  }
  signalResults.segmentConvergence = {
    score: segmentConvergenceScore,
    weight: WAVE_CONVERGENCE_WEIGHTS.segmentConvergence,
    detail: `${segmentStates.length} segments evaluated`,
  };

  // Signal 2: Cross-segment novelty
  const crossNovelty = typeof signals.crossSegmentNovelty === 'number' ? signals.crossSegmentNovelty : 1.0;
  const crossNoveltyConverged = crossNovelty <= thresh;
  if (!crossNoveltyConverged) {
    blockedBy.push(`cross-segment novelty ${crossNovelty.toFixed(3)} above threshold`);
  }
  signalResults.crossSegmentNovelty = {
    score: 1.0 - crossNovelty, // Invert: low novelty = high convergence
    weight: WAVE_CONVERGENCE_WEIGHTS.crossSegmentNovelty,
    converged: crossNoveltyConverged,
  };

  // Signal 3: Gap coverage
  const gapCov = typeof signals.gapCoverage === 'number' ? signals.gapCoverage : 0;
  const gapCoverageConverged = gapCov >= (1.0 - thresh);
  if (!gapCoverageConverged) {
    blockedBy.push(`gap coverage ${gapCov.toFixed(3)} below required ${(1.0 - thresh).toFixed(3)}`);
  }
  signalResults.gapCoverage = {
    score: gapCov,
    weight: WAVE_CONVERGENCE_WEIGHTS.gapCoverage,
    converged: gapCoverageConverged,
  };

  // Signal 4: Graph metrics (v2, optional)
  if (signals.graphMetrics) {
    signalResults.graphMetrics = {
      available: true,
      sourceDiversity: signals.graphMetrics.sourceDiversity || 0,
      evidenceDepth: signals.graphMetrics.evidenceDepth || 0,
      clusterCoverage: signals.graphMetrics.clusterCoverage || 0,
    };
  } else {
    signalResults.graphMetrics = { available: false };
  }

  // Compute weighted convergence score
  const weightedScore =
    (signalResults.segmentConvergence.score * WAVE_CONVERGENCE_WEIGHTS.segmentConvergence) +
    (signalResults.crossSegmentNovelty.score * WAVE_CONVERGENCE_WEIGHTS.crossSegmentNovelty) +
    (signalResults.gapCoverage.score * WAVE_CONVERGENCE_WEIGHTS.gapCoverage);

  const converged = blockedBy.length === 0;

  return {
    converged,
    score: weightedScore,
    signals: signalResults,
    blockedBy,
    threshold: thresh,
  };
}

/* ---------------------------------------------------------------
   3. SEGMENT PRUNING
----------------------------------------------------------------*/

/**
 * Check if a segment should be pruned (retired early).
 * A segment can be pruned if it has converged or is stuck.
 * Pruning does not make global STOP legal -- remaining segments
 * must still satisfy their own convergence criteria.
 *
 * @param {object} segment - Segment state
 * @param {object} signals - Pruning signal inputs
 * @param {number} [signals.stuckCount] - Consecutive low-progress iterations
 * @param {number} [signals.convergenceScore] - Current convergence score
 * @param {boolean} [signals.graphConverged] - Phase 002 graph says converged
 * @param {number} [threshold] - Custom convergence threshold
 * @returns {{ shouldPrune: boolean, reason: string, pruneType: string }}
 */
function shouldPruneSegment(segment, signals, threshold) {
  const thresh = typeof threshold === 'number' ? threshold : DEFAULT_WAVE_CONVERGENCE_THRESHOLD;

  if (!segment || !signals) {
    return { shouldPrune: false, reason: 'Missing segment or signals', pruneType: 'none' };
  }

  // Already in a terminal state
  if (segment.status === 'completed' || segment.status === 'pruned' || segment.status === 'failed' || segment.status === 'converged') {
    return { shouldPrune: false, reason: `Already in terminal status: ${segment.status}`, pruneType: 'none' };
  }

  // Check convergence-based pruning
  const convergenceScore = typeof signals.convergenceScore === 'number' ? signals.convergenceScore : 0;
  if (convergenceScore >= (1.0 - thresh)) {
    return {
      shouldPrune: true,
      reason: `Segment converged: score ${convergenceScore.toFixed(3)} >= threshold ${(1.0 - thresh).toFixed(3)}`,
      pruneType: 'converged',
    };
  }

  // Check graph-backed convergence (v2)
  if (signals.graphConverged === true) {
    return {
      shouldPrune: true,
      reason: 'Graph convergence signals segment is complete',
      pruneType: 'graph-converged',
    };
  }

  // Check stuck-based pruning
  const stuckCount = typeof signals.stuckCount === 'number' ? signals.stuckCount : 0;
  if (stuckCount >= PRUNE_STUCK_THRESHOLD) {
    return {
      shouldPrune: true,
      reason: `Stuck for ${stuckCount} iterations (threshold: ${PRUNE_STUCK_THRESHOLD})`,
      pruneType: 'stuck',
    };
  }

  return {
    shouldPrune: false,
    reason: 'No prune criteria met',
    pruneType: 'none',
  };
}

/* ---------------------------------------------------------------
   4. SEGMENT CONVERGENCE
----------------------------------------------------------------*/

/**
 * Evaluate convergence for a single segment.
 * Uses the same convergence algorithm as the main loop but
 * scoped to segment-local metrics.
 *
 * @param {object} segmentState - Per-segment state
 * @param {object} [options] - Evaluation options
 * @param {number} [options.threshold] - Convergence threshold
 * @param {number} [options.windowSize] - Rolling average window
 * @returns {{ converged: boolean, score: number, iterationCount: number, signals: object }}
 */
function evaluateSegmentConvergence(segmentState, options) {
  const opts = options || {};
  const threshold = typeof opts.threshold === 'number' ? opts.threshold : DEFAULT_WAVE_CONVERGENCE_THRESHOLD;
  const windowSize = typeof opts.windowSize === 'number' ? opts.windowSize : 3;

  if (!segmentState || !Array.isArray(segmentState.iterations)) {
    return { converged: false, score: 0, iterationCount: 0, signals: {} };
  }

  const iterations = segmentState.iterations;
  const count = iterations.length;

  if (count < MIN_ITERATIONS_FOR_CONVERGENCE) {
    return {
      converged: false,
      score: 0,
      iterationCount: count,
      signals: { reason: `Need ${MIN_ITERATIONS_FOR_CONVERGENCE} iterations, have ${count}` },
    };
  }

  // Extract novelty ratios
  const ratios = iterations
    .filter(it => it.status !== 'thought')
    .map(it => typeof it.newInfoRatio === 'number' ? it.newInfoRatio : (typeof it.newFindingsRatio === 'number' ? it.newFindingsRatio : 1.0));

  const signals = {};

  // Rolling average
  if (ratios.length >= windowSize) {
    const window = ratios.slice(-windowSize);
    const avg = window.reduce((a, b) => a + b, 0) / window.length;
    signals.rollingAvg = { value: avg, converged: avg < threshold };
  }

  // Latest ratio
  if (ratios.length > 0) {
    const latest = ratios[ratios.length - 1];
    signals.latestRatio = { value: latest, converged: latest < threshold };
  }

  // Compute overall convergence score
  const score = ratios.length > 0
    ? 1.0 - (ratios.slice(-windowSize).reduce((a, b) => a + b, 0) / Math.min(ratios.length, windowSize))
    : 0;

  const allSignalsConverged = Object.values(signals).every(s => s.converged === true || s.converged === undefined);

  return {
    converged: allSignalsConverged && ratios.length >= windowSize,
    score: Math.max(0, Math.min(1, score)),
    iterationCount: count,
    signals,
  };
}

/* ---------------------------------------------------------------
   5. EXPORTS
----------------------------------------------------------------*/

module.exports = {
  // Constants
  DEFAULT_WAVE_CONVERGENCE_THRESHOLD,
  MIN_ITERATIONS_FOR_CONVERGENCE,
  PRUNE_STUCK_THRESHOLD,
  WAVE_CONVERGENCE_WEIGHTS,
  // Wave convergence
  evaluateWaveConvergence,
  // Segment pruning
  shouldPruneSegment,
  // Segment convergence
  evaluateSegmentConvergence,
};
