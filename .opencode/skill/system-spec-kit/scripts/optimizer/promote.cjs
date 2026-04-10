'use strict';

// ---------------------------------------------------------------
// MODULE: Advisory Promotion Gate (T007)
// ---------------------------------------------------------------
// Evaluates candidates against baseline and produces advisory-only
// promotion reports. NEVER auto-promotes. Production promotion is
// blocked until Phase 1 replay fixtures AND Phase 3 behavioral
// suites exist (REQ-006).
// ---------------------------------------------------------------

const fs = require('fs');
const path = require('path');

/* ---------------------------------------------------------------
   1. CONSTANTS
----------------------------------------------------------------*/

/**
 * Prerequisite checks for production promotion.
 * All must pass before promotion graduates beyond advisory.
 * @type {ReadonlyArray<string>}
 */
const PROMOTION_PREREQUISITES = Object.freeze([
  'replayFixturesExist',
  'behavioralSuitesExist',
]);

/**
 * Promotion decision enum values.
 * @type {Readonly<Record<string, string>>}
 */
const PROMOTION_DECISIONS = Object.freeze({
  ADVISORY_ACCEPT: 'advisory-accept',
  ADVISORY_REJECT: 'advisory-reject',
  BLOCKED: 'blocked',
});

/* ---------------------------------------------------------------
   2. PREREQUISITE CHECKING
----------------------------------------------------------------*/

/**
 * Check whether production promotion prerequisites exist.
 * Until both replay fixtures and behavioral suites exist,
 * promotion is advisory-only.
 *
 * @param {object} [context={}] - Context for checking prerequisites.
 * @param {boolean} [context.replayFixturesExist=false] - Whether Phase 1 replay fixtures exist.
 * @param {boolean} [context.behavioralSuitesExist=false] - Whether Phase 3 behavioral suites exist.
 * @returns {{ allMet: boolean; results: Record<string, boolean>; missing: string[] }}
 */
function checkPrerequisites(context) {
  const ctx = context || {};

  const results = {
    replayFixturesExist: !!ctx.replayFixturesExist,
    behavioralSuitesExist: !!ctx.behavioralSuitesExist,
  };

  const missing = PROMOTION_PREREQUISITES.filter((p) => !results[p]);
  const allMet = missing.length === 0;

  return { allMet, results, missing };
}

/* ---------------------------------------------------------------
   3. MANIFEST BOUNDARY CHECKING
----------------------------------------------------------------*/

/**
 * Check whether a candidate config only touches tunable fields
 * (not locked contract fields).
 *
 * @param {object} candidate - The candidate config.
 * @param {object} manifest - The optimizer manifest.
 * @returns {{ valid: boolean; violations: string[] }}
 */
function checkManifestBoundary(candidate, manifest) {
  const violations = [];
  const tunableFields = new Set(
    (manifest.tunableFields || []).map((f) => f.name || f),
  );
  const lockedFields = new Set(
    (manifest.lockedFields || []).map((f) => f.name || f),
  );

  for (const field of Object.keys(candidate)) {
    if (lockedFields.has(field)) {
      violations.push(`Field "${field}" is a locked contract field and cannot be modified by the optimizer`);
    } else if (!tunableFields.has(field)) {
      violations.push(`Field "${field}" is not listed as tunable in the optimizer manifest`);
    }
  }

  return {
    valid: violations.length === 0,
    violations,
  };
}

/* ---------------------------------------------------------------
   4. CANDIDATE EVALUATION
----------------------------------------------------------------*/

/**
 * Evaluate a candidate against the baseline score.
 *
 * @param {object} candidate - The candidate config + score.
 * @param {object} candidate.config - The config values.
 * @param {object} candidate.score - The rubric score result.
 * @param {object} baselineScore - The baseline rubric score result.
 * @param {object} [options={}] - Additional options.
 * @param {object} [options.manifest] - Optimizer manifest for boundary checking.
 * @returns {{ decision: string; improved: boolean; regressions: string[]; improvements: string[]; manifestCheck: object|null; prerequisiteCheck: object; advisoryOnly: boolean }}
 */
function evaluateCandidate(candidate, baselineScore, options) {
  const opts = options || {};

  // Always check prerequisites
  const prerequisiteCheck = checkPrerequisites(opts.prerequisites || {});
  const advisoryOnly = !prerequisiteCheck.allMet;

  // Check manifest boundaries if manifest provided
  let manifestCheck = null;
  if (opts.manifest) {
    manifestCheck = checkManifestBoundary(candidate.config, opts.manifest);
    if (!manifestCheck.valid) {
      return {
        decision: PROMOTION_DECISIONS.BLOCKED,
        improved: false,
        regressions: manifestCheck.violations,
        improvements: [],
        manifestCheck,
        prerequisiteCheck,
        advisoryOnly: true,
      };
    }
  }

  // Compare scores
  const improvements = [];
  const regressions = [];

  const candidateComposite = candidate.score.composite;
  const baselineComposite = baselineScore.composite;

  if (candidateComposite > baselineComposite) {
    improvements.push(
      `Composite score improved: ${baselineComposite.toFixed(3)} -> ${candidateComposite.toFixed(3)}`,
    );
  } else if (candidateComposite < baselineComposite) {
    regressions.push(
      `Composite score regressed: ${baselineComposite.toFixed(3)} -> ${candidateComposite.toFixed(3)}`,
    );
  }

  // Per-dimension comparison
  if (candidate.score.perDimension && baselineScore.perDimension) {
    for (const [name, candidateDim] of Object.entries(candidate.score.perDimension)) {
      const baselineDim = baselineScore.perDimension[name];
      if (!baselineDim || !baselineDim.available || !candidateDim.available) continue;

      if (candidateDim.score < baselineDim.score - 0.01) {
        regressions.push(
          `${name} regressed: ${baselineDim.score.toFixed(3)} -> ${candidateDim.score.toFixed(3)}`,
        );
      } else if (candidateDim.score > baselineDim.score + 0.01) {
        improvements.push(
          `${name} improved: ${baselineDim.score.toFixed(3)} -> ${candidateDim.score.toFixed(3)}`,
        );
      }
    }
  }

  const improved = improvements.length > 0 && regressions.length === 0;

  let decision;
  if (!improved || regressions.length > 0) {
    decision = PROMOTION_DECISIONS.ADVISORY_REJECT;
  } else {
    decision = PROMOTION_DECISIONS.ADVISORY_ACCEPT;
  }

  return {
    decision,
    improved,
    regressions,
    improvements,
    manifestCheck,
    prerequisiteCheck,
    advisoryOnly,
  };
}

/* ---------------------------------------------------------------
   5. PROMOTION REPORT
----------------------------------------------------------------*/

/**
 * Generate an advisory-only promotion report.
 * Never auto-promotes. Always produces a report for human review.
 *
 * @param {object} candidate - The candidate config.
 * @param {object} score - The rubric score result.
 * @param {string} decision - The promotion decision.
 * @param {object} [options={}] - Additional context for the report.
 * @returns {object} A structured promotion report.
 */
function generatePromotionReport(candidate, score, decision, options) {
  const opts = options || {};

  const report = {
    reportType: 'advisory-promotion',
    generatedAt: new Date().toISOString(),
    decision,
    advisoryOnly: true,
    autoPromotionAllowed: false,

    candidate: {
      config: candidate,
      score: {
        composite: score.composite,
        perDimension: score.perDimension,
        unavailableDimensions: score.unavailableDimensions || [],
      },
    },

    evaluation: {
      improved: opts.improved ?? false,
      improvements: opts.improvements || [],
      regressions: opts.regressions || [],
    },

    prerequisites: opts.prerequisiteCheck || {
      allMet: false,
      results: {
        replayFixturesExist: false,
        behavioralSuitesExist: false,
      },
      missing: ['replayFixturesExist', 'behavioralSuitesExist'],
    },

    manifestBoundary: opts.manifestCheck || null,

    recommendation:
      decision === PROMOTION_DECISIONS.ADVISORY_ACCEPT
        ? 'Candidate shows improvement in replay. Review the per-dimension breakdown and audit trail before manual promotion.'
        : decision === PROMOTION_DECISIONS.BLOCKED
          ? 'Candidate touches locked or non-tunable fields. Promotion is blocked.'
          : 'Candidate does not improve over baseline or has regressions. Not recommended for promotion.',

    humanReviewRequired: true,
    nextSteps: [
      'Review per-dimension score breakdown',
      'Inspect audit trail for rejected candidates',
      'Verify no locked fields were modified',
      ...(opts.prerequisiteCheck && !opts.prerequisiteCheck.allMet
        ? ['Complete prerequisite replay fixtures and behavioral suites before production promotion']
        : []),
    ],
  };

  return report;
}

/**
 * Save a promotion report to disk.
 *
 * @param {object} report - The promotion report.
 * @param {string} outputPath - File path for the output.
 */
function savePromotionReport(report, outputPath) {
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(outputPath, JSON.stringify(report, null, 2), 'utf8');
}

/* ---------------------------------------------------------------
   6. EXPORTS
----------------------------------------------------------------*/

module.exports = {
  PROMOTION_PREREQUISITES,
  PROMOTION_DECISIONS,
  checkPrerequisites,
  checkManifestBoundary,
  evaluateCandidate,
  generatePromotionReport,
  savePromotionReport,
};
