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

const PROMOTION_AUDIT_DIR = path.resolve(__dirname, 'audit', 'promotion-reports');

function isPathWithin(candidatePath, rootPath) {
  const relative = path.relative(rootPath, candidatePath);
  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
}

function ensureCanonicalDirectory(dirPath, label) {
  fs.mkdirSync(dirPath, { recursive: true });
  const resolvedPath = path.resolve(dirPath);
  const realPath = fs.realpathSync(dirPath);

  if (path.normalize(realPath) !== path.normalize(resolvedPath)) {
    throw new Error(`${label} must not traverse symlinks`);
  }

  return realPath;
}

function resolvePromotionAuditPath(outputPath) {
  const auditRoot = ensureCanonicalDirectory(PROMOTION_AUDIT_DIR, 'Promotion audit directory');
  const candidatePath = path.isAbsolute(outputPath)
    ? path.resolve(outputPath)
    : path.resolve(auditRoot, outputPath);

  if (!isPathWithin(candidatePath, auditRoot)) {
    throw new Error(`Promotion reports must be saved under ${auditRoot}`);
  }

  const parentDir = ensureCanonicalDirectory(path.dirname(candidatePath), 'Promotion audit parent directory');
  if (!isPathWithin(parentDir, auditRoot)) {
    throw new Error(`Promotion report parent directory must stay under ${auditRoot}`);
  }

  if (fs.existsSync(candidatePath) && fs.lstatSync(candidatePath).isSymbolicLink()) {
    throw new Error('Promotion report output path must not be a symlink');
  }

  return candidatePath;
}

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
 * (not locked contract fields), and validate value types and ranges
 * against the manifest definitions.
 *
 * @param {object} candidate - The candidate config.
 * @param {object} manifest - The optimizer manifest.
 * @returns {{ valid: boolean; violations: string[] }}
 */
function checkManifestBoundary(candidate, manifest) {
  if (!candidate || typeof candidate !== 'object' || !manifest || typeof manifest !== 'object') {
    return { valid: false, violations: ['Candidate and manifest objects are required'] };
  }
  const violations = [];
  const tunableFieldMap = new Map();
  for (const f of manifest.tunableFields || []) {
    const name = f.name || f;
    tunableFieldMap.set(name, f);
  }
  const lockedFields = new Set(
    (manifest.lockedFields || []).map((f) => f.name || f),
  );

  for (const [field, value] of Object.entries(candidate)) {
    if (lockedFields.has(field)) {
      violations.push(`Field "${field}" is a locked contract field and cannot be modified by the optimizer`);
    } else if (!tunableFieldMap.has(field)) {
      violations.push(`Field "${field}" is not listed as tunable in the optimizer manifest`);
    } else {
      // Validate type and range against manifest definition
      const def = tunableFieldMap.get(field);
      if (def && typeof def === 'object') {
        // Type validation
        if (def.type === 'number' || def.type === 'integer') {
          if (typeof value !== 'number') {
            violations.push(`Field "${field}" must be a ${def.type}, got ${typeof value}`);
          } else if (def.type === 'integer' && !Number.isInteger(value)) {
            violations.push(`Field "${field}" must be an integer, got ${value}`);
          }
        }
        // Range validation
        if (def.range && typeof value === 'number') {
          if (def.range.min !== undefined && value < def.range.min) {
            violations.push(`Field "${field}" value ${value} is below manifest minimum ${def.range.min}`);
          }
          if (def.range.max !== undefined && value > def.range.max) {
            violations.push(`Field "${field}" value ${value} is above manifest maximum ${def.range.max}`);
          }
        }
      }
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
 * @param {object} options.manifest - Optimizer manifest for boundary checking.
 * @returns {{ decision: string; improved: boolean; regressions: string[]; improvements: string[]; manifestCheck: object|null; prerequisiteCheck: object; advisoryOnly: boolean }}
 */
function evaluateCandidate(candidate, baselineScore, options) {
  if (!candidate || typeof candidate !== 'object' || !candidate.score || !baselineScore || typeof baselineScore !== 'object') {
    return {
      decision: PROMOTION_DECISIONS.BLOCKED,
      improved: false,
      regressions: ['Candidate and baselineScore are required'],
      improvements: [],
      manifestCheck: null,
      prerequisiteCheck: checkPrerequisites(),
      advisoryOnly: true,
    };
  }
  const opts = options || {};

  // Always check prerequisites
  const prerequisiteCheck = checkPrerequisites(opts.prerequisites || {});
  // Manifest governance: promotionMode is advisory-only and autoPromotionAllowed is false.
  // advisoryOnly is ALWAYS true regardless of prerequisite state.
  const advisoryOnly = true;

  let manifestCheck;
  if (!opts.manifest || typeof opts.manifest !== 'object') {
    manifestCheck = {
      valid: false,
      violations: ['Canonical optimizer manifest is required'],
    };
  } else {
    manifestCheck = checkManifestBoundary(candidate.config, opts.manifest);
  }
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
  if (!score || typeof score !== 'object') {
    score = { composite: 0, perDimension: {}, unavailableDimensions: [] };
  }
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
  if (!report || typeof report !== 'object' || typeof outputPath !== 'string' || !outputPath) {
    return false;
  }
  const resolvedOutputPath = resolvePromotionAuditPath(outputPath);
  fs.writeFileSync(resolvedOutputPath, JSON.stringify(report, null, 2), 'utf8');
  return true;
}

/* ---------------------------------------------------------------
   6. EXPORTS
----------------------------------------------------------------*/

module.exports = {
  PROMOTION_PREREQUISITES,
  PROMOTION_DECISIONS,
  PROMOTION_AUDIT_DIR,
  checkPrerequisites,
  checkManifestBoundary,
  evaluateCandidate,
  generatePromotionReport,
  savePromotionReport,
};
