'use strict';

// ---------------------------------------------------------------
// MODULE: Random Search Optimizer (T004 + T005)
// ---------------------------------------------------------------
// Searches bounded deterministic numeric config space via random
// sampling. Records an audit trail for ALL candidates, both
// accepted and rejected (REQ-007, REQ-008).
// ---------------------------------------------------------------

const fs = require('fs');
const path = require('path');

const { replayRun } = require('./replay-runner.cjs');
const { scoreRun } = require('./rubric.cjs');

/* ---------------------------------------------------------------
   1. CONSTANTS
----------------------------------------------------------------*/

/**
 * Step sizes for the manifest-declared tunable search space.
 * @type {Readonly<Record<string, number>>}
 */
const SEARCH_STEP_OVERRIDES = Object.freeze({
  convergenceThreshold: 0.01,
  stuckThreshold: 1,
  noProgressThreshold: 0.01,
  compositeStopScore: 0.05,
  maxIterations: 1,
});

const CANONICAL_MANIFEST_PATH = path.join(__dirname, 'optimizer-manifest.json');

function loadCanonicalManifest() {
  return JSON.parse(fs.readFileSync(CANONICAL_MANIFEST_PATH, 'utf8'));
}

function deriveParamSpaceFromManifest(manifest) {
  if (!manifest || typeof manifest !== 'object') {
    throw new Error('Canonical optimizer manifest is required');
  }

  const paramSpace = {};
  for (const field of manifest.tunableFields || []) {
    const name = field && typeof field === 'object' ? field.name : null;
    if (!name) continue;

    const range = field.range;
    const type = field.type;
    if (!range || typeof range.min !== 'number' || typeof range.max !== 'number') {
      continue;
    }
    if (type !== 'number' && type !== 'integer') {
      continue;
    }

    const step = SEARCH_STEP_OVERRIDES[name];
    if (typeof step !== 'number' || !Number.isFinite(step) || step <= 0) {
      throw new Error(`Tunable field "${name}" is missing a canonical search step`);
    }

    paramSpace[name] = {
      min: range.min,
      max: range.max,
      step,
    };
  }

  return paramSpace;
}

function validateParamSpaceAgainstManifest(paramSpace, manifest) {
  if (!paramSpace || typeof paramSpace !== 'object') {
    return { valid: false, violations: ['Parameter space must be an object'] };
  }
  if (!manifest || typeof manifest !== 'object') {
    return { valid: false, violations: ['Canonical optimizer manifest is required'] };
  }

  const violations = [];
  const tunableFields = new Map();
  for (const field of manifest.tunableFields || []) {
    if (field && typeof field === 'object' && field.name) {
      tunableFields.set(field.name, field);
    }
  }

  const lockedFields = new Set(
    (manifest.lockedFields || [])
      .map((field) => (field && typeof field === 'object' ? field.name : null))
      .filter(Boolean),
  );

  for (const [name, bounds] of Object.entries(paramSpace)) {
    if (lockedFields.has(name)) {
      violations.push(`Field "${name}" is locked and cannot be searched`);
      continue;
    }

    const manifestField = tunableFields.get(name);
    if (!manifestField) {
      violations.push(`Field "${name}" is not declared tunable in the canonical manifest`);
      continue;
    }

    if (!bounds || typeof bounds !== 'object') {
      violations.push(`Field "${name}" must define min/max/step bounds`);
      continue;
    }

    const { min, max, step } = bounds;
    if (typeof min !== 'number' || typeof max !== 'number' || typeof step !== 'number') {
      violations.push(`Field "${name}" must use numeric min/max/step bounds`);
      continue;
    }
    if (!Number.isFinite(min) || !Number.isFinite(max) || !Number.isFinite(step) || step <= 0) {
      violations.push(`Field "${name}" must use finite bounds and a positive step`);
      continue;
    }

    const manifestRange = manifestField.range || {};
    if (typeof manifestRange.min === 'number' && min < manifestRange.min) {
      violations.push(`Field "${name}" minimum ${min} is below manifest minimum ${manifestRange.min}`);
    }
    if (typeof manifestRange.max === 'number' && max > manifestRange.max) {
      violations.push(`Field "${name}" maximum ${max} exceeds manifest maximum ${manifestRange.max}`);
    }
    if (min > max) {
      violations.push(`Field "${name}" has min ${min} greater than max ${max}`);
    }
    if (manifestField.type === 'integer' && (!Number.isInteger(min) || !Number.isInteger(max) || !Number.isInteger(step))) {
      violations.push(`Field "${name}" requires integer min/max/step bounds`);
    }
  }

  return {
    valid: violations.length === 0,
    violations,
  };
}

const CANONICAL_MANIFEST = loadCanonicalManifest();

/**
 * Default parameter space for numeric thresholds.
 * Each entry defines min, max, and step for a tunable field.
 * @type {Readonly<Record<string, { min: number; max: number; step: number }>>}
 */
const DEFAULT_PARAM_SPACE = Object.freeze(deriveParamSpaceFromManifest(CANONICAL_MANIFEST));

/* ---------------------------------------------------------------
   2. PARAMETER SAMPLING
----------------------------------------------------------------*/

/**
 * Deterministic pseudo-random number generator (mulberry32).
 * Produces repeatable sequences given the same seed.
 *
 * @param {number} seed
 * @returns {() => number} A function that returns the next random value in [0, 1).
 */
function createRNG(seed) {
  if (typeof seed !== 'number' || !Number.isFinite(seed)) seed = 42;
  let state = seed | 0;
  return function () {
    state = (state + 0x6D2B79F5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Sample a random config from the parameter space.
 *
 * @param {Record<string, { min: number; max: number; step: number }>} paramSpace
 * @param {() => number} rng - Random number generator.
 * @returns {Record<string, number>}
 */
function sampleConfig(paramSpace, rng) {
  if (!paramSpace || typeof paramSpace !== 'object' || typeof rng !== 'function') return {};
  const config = {};

  for (const [name, bounds] of Object.entries(paramSpace)) {
    const range = bounds.max - bounds.min;
    const steps = Math.round(range / bounds.step);
    const stepIndex = Math.floor(rng() * (steps + 1));
    const value = bounds.min + stepIndex * bounds.step;

    // Round to avoid floating point drift
    const decimals = countDecimals(bounds.step);
    config[name] = Number(value.toFixed(decimals));
  }

  return config;
}

/**
 * Count decimal places in a number.
 * @param {number} n
 * @returns {number}
 */
function countDecimals(n) {
  if (typeof n !== 'number' || !Number.isFinite(n)) return 0;
  const str = n.toString();
  const dotIndex = str.indexOf('.');
  return dotIndex < 0 ? 0 : str.length - dotIndex - 1;
}

/* ---------------------------------------------------------------
   3. AUDIT TRAIL
----------------------------------------------------------------*/

/**
 * Record a candidate to the audit trail.
 *
 * @param {object} candidate - The candidate config.
 * @param {object} score - The rubric score result.
 * @param {boolean} accepted - Whether the candidate was accepted.
 * @param {object} [comparison] - Optional comparison details.
 * @param {object} [options] - Additional options.
 * @param {string} [options.timestamp] - Override timestamp for deterministic replay. Defaults to current time.
 * @returns {object} An audit record.
 */
function recordCandidate(candidate, score, accepted, comparison, options) {
  if (!score || typeof score !== 'object') {
    score = { composite: 0, perDimension: {}, unavailableDimensions: [] };
  }
  const opts = options || {};
  return {
    timestamp: opts.timestamp || new Date().toISOString(),
    candidate,
    score: {
      composite: score.composite,
      perDimension: score.perDimension,
      unavailableDimensions: score.unavailableDimensions,
    },
    accepted,
    comparison: comparison || null,
    reason: accepted
      ? 'Candidate improved composite score without regressions'
      : comparison && comparison.regressions && comparison.regressions.length > 0
        ? `Rejected: ${comparison.regressions.join('; ')}`
        : 'Rejected: no improvement over baseline',
  };
}

/* ---------------------------------------------------------------
   4. RANDOM SEARCH
----------------------------------------------------------------*/

/**
 * Run random search over the config space, evaluating each
 * candidate against the corpus using replay and rubric scoring.
 *
 * @param {object[]} corpus - Array of corpus entries.
 * @param {object} rubric - A rubric from defineRubric().
 * @param {Record<string, { min: number; max: number; step: number }>} [paramSpace] - Parameter space definition.
 * @param {number} [iterations=20] - Number of random candidates to try.
 * @param {object} [options={}] - Additional options.
 * @param {number} [options.seed=42] - RNG seed for reproducibility.
 * @param {object} [options.baselineConfig] - Baseline config for comparison.
 * @returns {{ bestCandidate: object|null; bestScore: object|null; auditTrail: object[]; baselineScore: object|null; iterations: number }}
 */
function randomSearch(corpus, rubric, paramSpace, iterations, options) {
  if (!Array.isArray(corpus) || !rubric || typeof rubric !== 'object') {
    return {
      bestCandidate: null,
      bestScore: null,
      auditTrail: [],
      baselineScore: null,
      iterations: 0,
    };
  }
  const opts = options || {};
  let space = DEFAULT_PARAM_SPACE;
  if (paramSpace !== undefined) {
    const validation = validateParamSpaceAgainstManifest(paramSpace, CANONICAL_MANIFEST);
    if (!validation.valid) {
      throw new Error(`Invalid optimizer parameter space: ${validation.violations.join('; ')}`);
    }
    space = paramSpace;
  }
  const maxIter = typeof iterations === 'number' && iterations > 0 ? iterations : 20;
  const seed = opts.seed ?? 42;
  const rng = createRNG(seed);

  const auditTrail = [];
  let bestCandidate = null;
  let bestScore = null;
  let baselineScore = null;

  // Compute baseline if provided
  if (opts.baselineConfig) {
    const baselineResults = evaluateConfig(corpus, opts.baselineConfig, rubric);
    baselineScore = baselineResults;
    // Initialize best to baseline so first candidate must beat it
    bestScore = baselineResults;
    bestCandidate = opts.baselineConfig;
  }

  for (let i = 0; i < maxIter; i++) {
    const candidateConfig = sampleConfig(space, rng);
    const candidateResults = evaluateConfig(corpus, candidateConfig, rubric);

    let accepted = false;
    let comparison = null;

    if (bestScore === null) {
      // First candidate is accepted as initial best only when no baseline was provided
      accepted = true;
      bestCandidate = candidateConfig;
      bestScore = candidateResults;
    } else if (candidateResults.composite > bestScore.composite) {
      // Check for regressions against baseline if available
      if (baselineScore) {
        comparison = compareScores(baselineScore, candidateResults);
        // Only accept if no critical regressions
        if (comparison.regressions.length === 0) {
          accepted = true;
          bestCandidate = candidateConfig;
          bestScore = candidateResults;
        }
      } else {
        comparison = compareScores(bestScore, candidateResults);
        accepted = true;
        bestCandidate = candidateConfig;
        bestScore = candidateResults;
      }
    } else {
      comparison = compareScores(bestScore || baselineScore, candidateResults);
    }

    auditTrail.push(
      recordCandidate(candidateConfig, candidateResults, accepted, comparison, { timestamp: opts.timestamp }),
    );
  }

  return {
    bestCandidate,
    bestScore,
    auditTrail,
    baselineScore,
    iterations: maxIter,
  };
}

/**
 * Evaluate a config against the full corpus.
 * Averages rubric scores across all corpus entries.
 *
 * @param {object[]} corpus - Corpus entries.
 * @param {object} config - Config to evaluate.
 * @param {object} rubric - Rubric for scoring.
 * @returns {object} Aggregated score result.
 */
function evaluateConfig(corpus, config, rubric) {
  if (!Array.isArray(corpus) || corpus.length === 0 || !config || typeof config !== 'object' || !rubric || typeof rubric !== 'object') {
    return { composite: 0, perDimension: {}, unavailableDimensions: [] };
  }

  const scores = corpus.map((entry) => {
    const replayResults = replayRun(entry, config);
    return scoreRun(rubric, replayResults);
  });

  // Average across corpus entries
  const avgComposite =
    scores.reduce((sum, s) => sum + s.composite, 0) / scores.length;

  // Average per-dimension scores
  const perDimension = {};
  const allDimensionNames = new Set();
  for (const s of scores) {
    for (const name of Object.keys(s.perDimension)) {
      allDimensionNames.add(name);
    }
  }

  for (const name of allDimensionNames) {
    const dimScores = scores
      .map((s) => s.perDimension[name])
      .filter((d) => d && d.available);

    if (dimScores.length === 0) {
      perDimension[name] = { score: null, weight: 0, weighted: 0, available: false };
    } else {
      const avgScore = dimScores.reduce((sum, d) => sum + d.score, 0) / dimScores.length;
      const weight = dimScores[0].weight;
      perDimension[name] = {
        score: avgScore,
        weight,
        weighted: avgScore * weight,
        available: true,
      };
    }
  }

  const unavailableDimensions = [...allDimensionNames].filter(
    (name) => perDimension[name] && !perDimension[name].available,
  );

  return { composite: avgComposite, perDimension, unavailableDimensions };
}

/**
 * Compare two score results for improvements and regressions.
 *
 * @param {object} baseline - Baseline score.
 * @param {object} candidate - Candidate score.
 * @returns {{ improvements: string[]; regressions: string[] }}
 */
function compareScores(baseline, candidate) {
  if (!baseline || typeof baseline !== 'object' || !candidate || typeof candidate !== 'object') {
    return { improvements: [], regressions: ['Missing baseline or candidate score'] };
  }
  const improvements = [];
  const regressions = [];

  if (candidate.composite > baseline.composite) {
    improvements.push(
      `Composite improved: ${baseline.composite.toFixed(3)} -> ${candidate.composite.toFixed(3)}`,
    );
  } else if (candidate.composite < baseline.composite) {
    regressions.push(
      `Composite regressed: ${baseline.composite.toFixed(3)} -> ${candidate.composite.toFixed(3)}`,
    );
  }

  // Check per-dimension regressions
  for (const [name, candidateDim] of Object.entries(candidate.perDimension)) {
    const baselineDim = baseline.perDimension[name];
    if (!baselineDim || !baselineDim.available || !candidateDim.available) continue;

    if (candidateDim.score < baselineDim.score - 0.05) {
      regressions.push(
        `${name} regressed: ${baselineDim.score.toFixed(3)} -> ${candidateDim.score.toFixed(3)}`,
      );
    } else if (candidateDim.score > baselineDim.score + 0.05) {
      improvements.push(
        `${name} improved: ${baselineDim.score.toFixed(3)} -> ${candidateDim.score.toFixed(3)}`,
      );
    }
  }

  return { improvements, regressions };
}

/* ---------------------------------------------------------------
   5. EXPORTS
----------------------------------------------------------------*/

module.exports = {
  DEFAULT_PARAM_SPACE,
  createRNG,
  sampleConfig,
  recordCandidate,
  randomSearch,
  evaluateConfig,
  compareScores,
  countDecimals,
};
