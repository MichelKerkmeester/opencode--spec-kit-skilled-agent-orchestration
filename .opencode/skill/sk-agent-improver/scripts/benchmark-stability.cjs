// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Benchmark Stability — Score Variance & Weight Optimization Advisory     ║
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
 * Default number of replay runs for stability measurement.
 * @type {number}
 */
const DEFAULT_REPLAY_COUNT = 3;

/**
 * Default stability warning threshold. Below this coefficient, a warning is emitted.
 * Coefficient = 1 - (stddev / mean). Perfect stability = 1.0.
 * @type {number}
 */
const DEFAULT_WARNING_THRESHOLD = 0.95;

/**
 * Default minimum session count before weight optimizer produces recommendations.
 * Research finding (P2): refuse auto-apply until sufficient run history.
 * @type {number}
 */
const DEFAULT_SESSION_COUNT_THRESHOLD = 5;

/**
 * The 5 scoring dimensions.
 * @type {Readonly<string[]>}
 */
const DIMENSIONS = Object.freeze([
  'structural',
  'ruleCoherence',
  'integration',
  'outputQuality',
  'systemFitness',
]);

// ─────────────────────────────────────────────────────────────────────────────
// 3. STABILITY MEASUREMENT
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Compute mean of an array of numbers.
 * @param {number[]} values
 * @returns {number}
 */
function mean(values) {
  if (values.length === 0) {
    return 0;
  }
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

/**
 * Compute standard deviation of an array of numbers.
 * @param {number[]} values
 * @returns {number}
 */
function stddev(values) {
  if (values.length <= 1) {
    return 0;
  }
  const m = mean(values);
  const variance = values.reduce((sum, v) => sum + (v - m) ** 2, 0) / (values.length - 1);
  return Math.sqrt(variance);
}

/**
 * Compute stability coefficient: 1 - (stddev / mean).
 * Perfect stability = 1.0, high variance = low coefficient.
 *
 * @param {number[]} values - Array of score values from replays
 * @returns {number} Stability coefficient (0.0 to 1.0, or 1.0 if mean is 0)
 */
function stabilityCoefficient(values) {
  const m = mean(values);
  if (m === 0) {
    return 1.0;
  }
  const sd = stddev(values);
  return Math.max(0, 1 - sd / Math.abs(m));
}

/**
 * Run stability measurement on benchmark results (REQ-AI-013).
 * Accepts an array of result sets from identical replays and computes
 * per-dimension stability coefficients.
 *
 * @param {object[]} results - Array of benchmark result objects, each with { dimensions: [{ name, score }] } or { scores: { dim: number } }
 * @param {object} [config] - { warningThreshold? }
 * @returns {{ dimensions: object, stable: boolean, warnings: string[] }}
 */
function measureStability(results, config) {
  const opts = {
    warningThreshold: DEFAULT_WARNING_THRESHOLD,
    ...config,
  };

  if (!results || results.length === 0) {
    return {
      dimensions: {},
      stable: true,
      warnings: ['No results provided for stability measurement'],
    };
  }

  const dimensionScores = {};
  for (const dim of DIMENSIONS) {
    dimensionScores[dim] = [];
  }

  // Extract scores from results
  for (const result of results) {
    if (result.dimensions && Array.isArray(result.dimensions)) {
      for (const dim of result.dimensions) {
        if (dimensionScores[dim.name] !== undefined) {
          dimensionScores[dim.name].push(dim.score);
        }
      }
    } else if (result.scores) {
      for (const dim of DIMENSIONS) {
        if (typeof result.scores[dim] === 'number') {
          dimensionScores[dim].push(result.scores[dim]);
        }
      }
    }
  }

  const dimensionResults = {};
  const warnings = [];
  let allStable = true;

  for (const dim of DIMENSIONS) {
    const scores = dimensionScores[dim];
    if (scores.length === 0) {
      dimensionResults[dim] = { coefficient: 1.0, mean: 0, stddev: 0, samples: 0 };
      continue;
    }

    const coeff = stabilityCoefficient(scores);
    const m = mean(scores);
    const sd = stddev(scores);

    dimensionResults[dim] = {
      coefficient: Math.round(coeff * 10000) / 10000,
      mean: Math.round(m * 100) / 100,
      stddev: Math.round(sd * 100) / 100,
      samples: scores.length,
    };

    if (coeff < opts.warningThreshold) {
      allStable = false;
      warnings.push(`stabilityWarning: ${dim} coefficient ${coeff.toFixed(4)} < threshold ${opts.warningThreshold}`);
    }
  }

  return {
    dimensions: dimensionResults,
    stable: allStable,
    warnings,
  };
}

/**
 * Check if stability results are acceptable.
 *
 * @param {object} stabilityResult - Result from measureStability
 * @param {number} [maxVariance] - Maximum acceptable variance (1 - coefficient). Default: 0.05.
 * @returns {boolean} True if all dimensions have acceptable variance
 */
function isStable(stabilityResult, maxVariance) {
  const threshold = typeof maxVariance === 'number' ? maxVariance : 0.05;

  for (const dim of DIMENSIONS) {
    const dimResult = stabilityResult.dimensions[dim];
    if (dimResult && (1 - dimResult.coefficient) > threshold) {
      return false;
    }
  }
  return true;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. WEIGHT OPTIMIZER (Advisory Only — REQ-AI-012)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generate weight optimization recommendations based on historical session data.
 * Research finding (P2): advisory-only, never auto-apply.
 *
 * @param {object[]} sessionHistory - Array of session summary objects with { dimensions: [{ name, score }], outcome? }
 * @param {object} currentWeights - Current dimension weights: { structural, ruleCoherence, integration, outputQuality, systemFitness }
 * @param {object} [config] - { sessionCountThreshold? }
 * @returns {{ recommendations: object, sufficient: boolean, report: string }}
 */
function generateWeightRecommendations(sessionHistory, currentWeights, config) {
  const opts = {
    sessionCountThreshold: DEFAULT_SESSION_COUNT_THRESHOLD,
    ...config,
  };

  if (!sessionHistory || sessionHistory.length < opts.sessionCountThreshold) {
    return {
      recommendations: null,
      sufficient: false,
      report: `Insufficient session history: ${(sessionHistory || []).length} < ${opts.sessionCountThreshold}. Recommendations require at least ${opts.sessionCountThreshold} sessions.`,
    };
  }

  // Compute per-dimension variance across sessions
  const dimensionVariances = {};
  for (const dim of DIMENSIONS) {
    const scores = [];
    for (const session of sessionHistory) {
      if (session.dimensions && Array.isArray(session.dimensions)) {
        const dimEntry = session.dimensions.find((d) => d.name === dim);
        if (dimEntry) {
          scores.push(dimEntry.score);
        }
      } else if (session.scores && typeof session.scores[dim] === 'number') {
        scores.push(session.scores[dim]);
      }
    }
    dimensionVariances[dim] = {
      mean: mean(scores),
      stddev: stddev(scores),
      count: scores.length,
    };
  }

  // Simple heuristic: dimensions with consistently low scores deserve higher weight;
  // dimensions with high variance should be investigated before weight changes.
  const recommended = {};
  let totalWeight = 0;

  for (const dim of DIMENSIONS) {
    const current = currentWeights[dim] || 0.20;
    const dimData = dimensionVariances[dim];

    // If a dimension consistently scores low (mean < 80), suggest increasing weight
    // If it consistently scores high (mean > 95), suggest slightly decreasing weight
    let adjustment = 0;
    if (dimData.mean < 80 && dimData.count >= 3) {
      adjustment = 0.02;
    } else if (dimData.mean > 95 && dimData.count >= 3) {
      adjustment = -0.01;
    }

    recommended[dim] = Math.max(0.05, Math.min(0.40, current + adjustment));
    totalWeight += recommended[dim];
  }

  // Normalize to sum to 1.0
  for (const dim of DIMENSIONS) {
    recommended[dim] = Math.round((recommended[dim] / totalWeight) * 100) / 100;
  }

  // Build report lines
  const reportLines = [
    'Weight Optimization Report',
    '═'.repeat(40),
    `Sessions analyzed: ${sessionHistory.length}`,
    '',
    '| Dimension | Current | Recommended | Mean Score | StdDev |',
    '|-----------|---------|-------------|------------|--------|',
  ];

  for (const dim of DIMENSIONS) {
    const current = currentWeights[dim] || 0.20;
    const rec = recommended[dim];
    const data = dimensionVariances[dim];
    reportLines.push(
      `| ${dim} | ${current.toFixed(2)} | ${rec.toFixed(2)} | ${data.mean.toFixed(1)} | ${data.stddev.toFixed(1)} |`
    );
  }

  reportLines.push('');
  reportLines.push('NOTE: These recommendations are advisory only. Do NOT auto-apply.');
  reportLines.push('Review the report and apply manually if appropriate.');

  return {
    recommendations: recommended,
    sufficient: true,
    report: reportLines.join('\n'),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  DEFAULT_REPLAY_COUNT,
  DEFAULT_WARNING_THRESHOLD,
  DEFAULT_SESSION_COUNT_THRESHOLD,
  DIMENSIONS,
  mean,
  stddev,
  stabilityCoefficient,
  measureStability,
  isStable,
  generateWeightRecommendations,
};
