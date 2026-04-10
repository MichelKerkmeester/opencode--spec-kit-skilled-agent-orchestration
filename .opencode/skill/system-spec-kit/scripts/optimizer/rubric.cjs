'use strict';

// ---------------------------------------------------------------
// MODULE: Quality Rubric (T002)
// ---------------------------------------------------------------
// Defines a quality rubric with per-dimension scoring for
// evaluating deep-loop replay runs. Dimensions include
// convergenceEfficiency, recoverySuccessRate, findingAccuracy,
// and synthesisQuality. Scores are broken down by dimension (REQ-003).
// ---------------------------------------------------------------

/* ---------------------------------------------------------------
   1. CONSTANTS
----------------------------------------------------------------*/

/**
 * Default dimension weights. Must sum to 1.0.
 * @type {Readonly<Record<string, number>>}
 */
const DEFAULT_WEIGHTS = Object.freeze({
  convergenceEfficiency: 0.30,
  recoverySuccessRate: 0.20,
  findingAccuracy: 0.30,
  synthesisQuality: 0.20,
});

/**
 * Score range bounds.
 * @type {{ min: number; max: number }}
 */
const SCORE_RANGE = Object.freeze({ min: 0.0, max: 1.0 });

/* ---------------------------------------------------------------
   2. RUBRIC DEFINITION
----------------------------------------------------------------*/

/**
 * Create a quality rubric with named dimensions.
 *
 * @param {object} [dimensions] - Optional dimension weight overrides.
 * @returns {{ dimensions: Record<string, number>; totalWeight: number }}
 */
function defineRubric(dimensions) {
  const merged = { ...DEFAULT_WEIGHTS, ...(dimensions || {}) };

  // Validate all weights are in [0, 1]
  for (const [name, weight] of Object.entries(merged)) {
    if (typeof weight !== 'number' || !Number.isFinite(weight)) {
      throw new Error(`Dimension "${name}" weight must be a finite number`);
    }
    if (weight < 0 || weight > 1) {
      throw new Error(`Dimension "${name}" weight must be in [0, 1], got ${weight}`);
    }
  }

  const totalWeight = Object.values(merged).reduce((sum, w) => sum + w, 0);

  return {
    dimensions: merged,
    totalWeight,
  };
}

/* ---------------------------------------------------------------
   3. DIMENSION SCORERS
----------------------------------------------------------------*/

/**
 * Score convergence efficiency from replay results.
 * Lower iteration counts relative to max = more efficient.
 *
 * @param {object} replayResults - Results from a replay run.
 * @returns {number} Score in [0.0, 1.0].
 */
function scoreConvergenceEfficiency(replayResults) {
  const { iterationsUsed, maxIterations, converged, graphBonus } = replayResults;

  if (!converged) return 0.0;
  if (!maxIterations || maxIterations <= 0) return 0.0;
  if (iterationsUsed <= 0) return 0.0;

  // Score: how much of the iteration budget was saved
  let efficiency = 1.0 - (iterationsUsed / maxIterations);

  // Apply graph bonus multiplier when graph/wave metrics contributed positively
  if (typeof graphBonus === 'number' && graphBonus > 1.0) {
    efficiency *= graphBonus;
  }

  return clampScore(efficiency);
}

/**
 * Score recovery success rate from replay results.
 * Ratio of successful recoveries to total recovery attempts.
 *
 * @param {object} replayResults - Results from a replay run.
 * @returns {number} Score in [0.0, 1.0].
 */
function scoreRecoverySuccessRate(replayResults) {
  const { recoveryAttempts, recoverySuccesses } = replayResults;

  // No recovery needed = perfect score (no stuck situations)
  if (!recoveryAttempts || recoveryAttempts === 0) return 1.0;

  return clampScore(recoverySuccesses / recoveryAttempts);
}

/**
 * Score finding accuracy from replay results.
 * Based on the ratio of new/useful findings to total findings.
 *
 * @param {object} replayResults - Results from a replay run.
 * @returns {number} Score in [0.0, 1.0].
 */
function scoreFindingAccuracy(replayResults) {
  const { totalFindings, relevantFindings } = replayResults;

  if (!totalFindings || totalFindings === 0) return 0.0;

  return clampScore(relevantFindings / totalFindings);
}

/**
 * Score synthesis quality from replay results.
 * Evaluates completeness of synthesis sections and evidence citations in conclusions.
 * Higher scores indicate better synthesis output quality.
 *
 * @param {object} replayResults - Results from a replay run.
 * @returns {number} Score in [0.0, 1.0].
 */
function scoreSynthesisQuality(replayResults) {
  const { totalFindings, relevantFindings, converged, iterationsUsed } = replayResults;

  if (!iterationsUsed || iterationsUsed === 0) return 0.0;

  // Synthesis quality: combination of finding relevance ratio and convergence
  let score = 0.0;

  // Component 1: Relevant findings ratio (evidence citations in conclusions)
  if (totalFindings && totalFindings > 0) {
    score += 0.6 * (relevantFindings / totalFindings);
  }

  // Component 2: Convergence bonus (completeness of synthesis sections)
  if (converged) {
    score += 0.4;
  }

  return clampScore(score);
}

/**
 * Map of dimension names to their scorer functions.
 * @type {Readonly<Record<string, (replayResults: object) => number>>}
 */
const DIMENSION_SCORERS = Object.freeze({
  convergenceEfficiency: scoreConvergenceEfficiency,
  recoverySuccessRate: scoreRecoverySuccessRate,
  findingAccuracy: scoreFindingAccuracy,
  synthesisQuality: scoreSynthesisQuality,
});

/* ---------------------------------------------------------------
   4. SCORING
----------------------------------------------------------------*/

/**
 * Clamp a score to the valid range.
 *
 * @param {number} score
 * @returns {number}
 */
function clampScore(score) {
  if (typeof score !== 'number' || !Number.isFinite(score)) return 0.0;
  return Math.max(SCORE_RANGE.min, Math.min(SCORE_RANGE.max, score));
}

/**
 * Score a replay run against the rubric, producing per-dimension
 * breakdown plus a weighted composite.
 *
 * @param {object} rubric - A rubric from defineRubric().
 * @param {object} replayResults - Results from a replay run.
 * @returns {{ perDimension: Record<string, { score: number; weight: number; weighted: number; available: boolean }>; composite: number; unavailableDimensions: string[] }}
 */
function scoreRun(rubric, replayResults) {
  const perDimension = {};
  const unavailableDimensions = [];
  let weightedSum = 0;
  let activeWeight = 0;

  for (const [name, weight] of Object.entries(rubric.dimensions)) {
    const scorer = DIMENSION_SCORERS[name];

    if (!scorer) {
      // Unknown dimension, mark unavailable (REQ-009: no fake values)
      perDimension[name] = {
        score: null,
        weight,
        weighted: 0,
        available: false,
      };
      unavailableDimensions.push(name);
      continue;
    }

    const score = scorer(replayResults);
    const weighted = score * weight;

    perDimension[name] = {
      score,
      weight,
      weighted,
      available: true,
    };

    weightedSum += weighted;
    activeWeight += weight;
  }

  // Normalize composite by active weight to handle unavailable dimensions
  const composite = activeWeight > 0 ? weightedSum / activeWeight : 0;

  return {
    perDimension,
    composite: clampScore(composite),
    unavailableDimensions,
  };
}

/* ---------------------------------------------------------------
   5. EXPORTS
----------------------------------------------------------------*/

module.exports = {
  DEFAULT_WEIGHTS,
  SCORE_RANGE,
  DIMENSION_SCORERS,
  defineRubric,
  scoreRun,
  scoreConvergenceEfficiency,
  scoreRecoverySuccessRate,
  scoreFindingAccuracy,
  scoreSynthesisQuality,
  clampScore,
};
