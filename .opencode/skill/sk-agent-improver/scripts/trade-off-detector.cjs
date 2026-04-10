// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Trade-Off Detector — Cross-Dimension Regression Detection               ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────
const fs = require('node:fs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Hard dimensions: structural integrity matters more, lower regression tolerance.
 * Research finding: use < -3 threshold for hard dimensions (P1).
 * @type {Readonly<string[]>}
 */
const HARD_DIMENSIONS = Object.freeze([
  'structural',
  'integration',
  'systemFitness',
]);

/**
 * Soft dimensions: more tolerance for regressions.
 * Research finding: use < -5 threshold for soft dimensions (P1).
 * @type {Readonly<string[]>}
 */
const SOFT_DIMENSIONS = Object.freeze([
  'ruleCoherence',
  'outputQuality',
]);

/**
 * Default threshold for improvement detection.
 * @type {number}
 */
const DEFAULT_IMPROVEMENT_THRESHOLD = 3;

/**
 * Default regression thresholds.
 * Research finding: +3/-3 for hard dims, +3/-5 for soft dims.
 * @type {{ hard: number, soft: number }}
 */
const DEFAULT_REGRESSION_THRESHOLDS = Object.freeze({
  hard: -3,
  soft: -5,
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. CORE API
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Detect trade-offs between dimensions in trajectory data (REQ-AI-008).
 * A trade-off exists when one dimension improves significantly while another regresses.
 *
 * @param {object[]} trajectoryData - Array of trajectory data points with { scores: { dim: number } }
 * @param {object} [options] - { improvementThreshold?, regressionThresholds?: { hard?, soft? } }
 * @returns {object[]} Array of detected trade-offs: { improving, regressing, improvementDelta, regressionDelta, iteration? }
 */
function detectTradeOffs(trajectoryData, options) {
  if (!trajectoryData || trajectoryData.length < 2) {
    return [];
  }

  const opts = {
    improvementThreshold: DEFAULT_IMPROVEMENT_THRESHOLD,
    regressionThresholds: { ...DEFAULT_REGRESSION_THRESHOLDS },
    ...options,
  };

  if (options && options.regressionThresholds) {
    opts.regressionThresholds = {
      ...DEFAULT_REGRESSION_THRESHOLDS,
      ...options.regressionThresholds,
    };
  }

  const tradeOffs = [];
  const allDimensions = [...HARD_DIMENSIONS, ...SOFT_DIMENSIONS];

  // Compare consecutive trajectory points
  for (let i = 1; i < trajectoryData.length; i++) {
    const prev = trajectoryData[i - 1].scores || {};
    const curr = trajectoryData[i].scores || {};

    // Compute deltas
    const deltas = {};
    for (const dim of allDimensions) {
      const prevScore = typeof prev[dim] === 'number' ? prev[dim] : 0;
      const currScore = typeof curr[dim] === 'number' ? curr[dim] : 0;
      deltas[dim] = currScore - prevScore;
    }

    // Find improving dimensions
    const improving = allDimensions.filter(
      (dim) => deltas[dim] > opts.improvementThreshold
    );

    // Find regressing dimensions
    const regressing = allDimensions.filter((dim) => {
      const threshold = HARD_DIMENSIONS.includes(dim)
        ? opts.regressionThresholds.hard
        : opts.regressionThresholds.soft;
      return deltas[dim] < threshold;
    });

    // A trade-off exists when both improving and regressing dimensions are found
    if (improving.length > 0 && regressing.length > 0) {
      for (const impDim of improving) {
        for (const regDim of regressing) {
          tradeOffs.push({
            improving: impDim,
            regressing: regDim,
            improvementDelta: deltas[impDim],
            regressionDelta: deltas[regDim],
            iteration: trajectoryData[i].iteration || i,
          });
        }
      }
    }
  }

  return tradeOffs;
}

/**
 * Extract per-dimension score history from journal events.
 *
 * @param {string} journalPath - Path to the improvement-journal.jsonl file
 * @returns {object[]} Array of trajectory-like objects: { iteration, scores: { dim: number } }
 */
function getTrajectory(journalPath) {
  try {
    const content = fs.readFileSync(journalPath, 'utf8');
    const events = content
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .flatMap((line) => {
        try {
          return [JSON.parse(line)];
        } catch (_err) {
          return [];
        }
      });

    // Extract score data from candidate_scored events
    return events
      .filter(
        (e) =>
          e.eventType === 'candidate_scored' &&
          e.details &&
          e.details.dimensions
      )
      .map((e) => {
        const scores = {};
        for (const dim of e.details.dimensions) {
          scores[dim.name] = dim.score;
        }
        return {
          iteration: e.iteration || 0,
          scores,
        };
      });
  } catch (_err) {
    return [];
  }
}

/**
 * Check if a candidate is Pareto-dominated (REQ-AI-008).
 * A candidate is dominated if another candidate is at least as good in all dimensions
 * and strictly better in at least one.
 *
 * @param {object} candidateScores - { structural, ruleCoherence, integration, outputQuality, systemFitness }
 * @param {object} baselineScores - { structural, ruleCoherence, integration, outputQuality, systemFitness }
 * @returns {{ dominated: boolean, dominatingDimensions: string[], regressions: string[] }}
 */
function checkParetoDominance(candidateScores, baselineScores) {
  const allDimensions = [...HARD_DIMENSIONS, ...SOFT_DIMENSIONS];
  const regressions = [];
  const improvements = [];

  for (const dim of allDimensions) {
    const cand = candidateScores[dim] || 0;
    const base = baselineScores[dim] || 0;
    if (cand < base) {
      regressions.push(dim);
    } else if (cand > base) {
      improvements.push(dim);
    }
  }

  // Candidate is dominated by baseline if baseline is better in at least one dim
  // and at least as good in all others
  const dominated = regressions.length > 0 && improvements.length === 0;

  return {
    dominated,
    dominatingDimensions: regressions,
    regressions,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  HARD_DIMENSIONS,
  SOFT_DIMENSIONS,
  DEFAULT_IMPROVEMENT_THRESHOLD,
  DEFAULT_REGRESSION_THRESHOLDS,
  detectTradeOffs,
  getTrajectory,
  checkParetoDominance,
};
