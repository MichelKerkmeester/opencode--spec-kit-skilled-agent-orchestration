// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Candidate Scorer — 5-Dimension Evaluation Framework                     ║
// ╚══════════════════════════════════════════════════════════════════════════╝
// Usage:
//   node score-candidate.cjs --candidate=<path> [--baseline=<path>] [--output=<path>]
//
// When --baseline is present, the scorer evaluates both files and emits:
//   baselineScore: weighted baseline score
//   delta: total and per-dimension candidate-minus-baseline score deltas
//   thresholdDelta: comparison threshold from --thresholdDelta, manifest scoring,
//     or the default value of 2.
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

function parseArgs(argv) {
  const args = {};
  for (const entry of argv) {
    if (!entry.startsWith('--')) {
      continue;
    }
    const [key, ...rest] = entry.slice(2).split('=');
    args[key] = rest.length > 0 ? rest.join('=') : true;
  }
  return args;
}

function readUtf8(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function safeRead(filePath) {
  try {
    return readUtf8(filePath);
  } catch (error) {
    return { error: error.message };
  }
}

function stripJsonComments(content) {
  return content
    .replace(/^\s*\/\/.*$/gm, '')
    .replace(/\/\*[\s\S]*?\*\//g, '');
}

function loadManifest(manifestPath) {
  if (!manifestPath) {
    return null;
  }
  const raw = safeRead(manifestPath);
  if (typeof raw !== 'string') {
    return { error: raw.error };
  }
  try {
    return JSON.parse(stripJsonComments(raw));
  } catch (error) {
    return { error: `Manifest parse failed: ${error.message}` };
  }
}

function inferProfileId(targetPath, explicitProfile, manifest) {
  if (explicitProfile) {
    return explicitProfile;
  }
  const manifestTarget = manifest?.targets?.find((entry) => entry.path === targetPath);
  if (manifestTarget?.profileId) {
    return manifestTarget.profileId;
  }
  return 'dynamic';
}

function inferFamily(profileId, manifest, targetPath) {
  const manifestTarget = manifest?.targets?.find((entry) => entry.path === targetPath);
  if (manifestTarget?.family) {
    return manifestTarget.family;
  }
  return profileId;
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. DYNAMIC 5-DIMENSION SCORING
// ─────────────────────────────────────────────────────────────────────────────

const DIMENSION_WEIGHTS = {
  structural: 0.20,
  ruleCoherence: 0.25,
  integration: 0.25,
  outputQuality: 0.15,
  systemFitness: 0.15,
};

function runScript(scriptName, args) {
  const scriptPath = path.join(__dirname, scriptName);
  try {
    const out = execFileSync('node', [scriptPath, ...args], { encoding: 'utf8', timeout: 15000 });
    return JSON.parse(out);
  } catch (_err) {
    return null;
  }
}

function scoreDimStructural(profile, content) {
  const checks = profile.derivedChecks?.structural || [];
  if (checks.length === 0) { return { score: 100, details: [], maxPossible: 0 }; }
  const maxPossible = checks.reduce((s, c) => s + c.weight, 0);
  let earned = 0;
  const details = [];
  for (const check of checks) {
    const sectionName = check.description.replace('Agent has ', '').replace(' section', '').toUpperCase();
    const pass = new RegExp(`## \\d+\\.\\s+.*${sectionName.split(' ')[0]}`, 'i').test(content);
    if (pass) { earned += check.weight; }
    details.push({ id: check.id, pass, weight: check.weight });
  }
  return { score: maxPossible > 0 ? Math.round(100 * earned / maxPossible) : 100, details, maxPossible };
}

function scoreDimRuleCoherence(profile, content) {
  const rules = profile.derivedChecks?.ruleCoherence || [];
  if (rules.length === 0) { return { score: 100, details: [], maxPossible: 0 }; }
  const lower = content.toLowerCase();
  const maxPossible = rules.reduce((s, r) => s + r.weight, 0);
  let earned = 0;
  const details = [];
  for (const rule of rules) {
    const keywords = rule.rule.toLowerCase().split(/\s+/).filter((w) => w.length > 3).slice(0, 4);
    const matchCount = keywords.filter((kw) => lower.includes(kw)).length;
    const pass = keywords.length > 0 && matchCount >= Math.ceil(keywords.length * 0.5);
    if (pass) { earned += rule.weight; }
    details.push({ id: rule.id, type: rule.type, rule: rule.rule, pass, matchRatio: keywords.length > 0 ? matchCount / keywords.length : 0 });
  }
  return { score: maxPossible > 0 ? Math.round(100 * earned / maxPossible) : 100, details, maxPossible };
}

function scoreDimIntegration(agentName) {
  const report = runScript('scan-integration.cjs', [`--agent=${agentName}`]);
  if (!report || report.status !== 'complete') {
    return { score: 0, details: [{ id: 'scanner-failed', pass: false }], maxPossible: 100 };
  }
  const summary = report.summary;
  let mirrorScore = 100;
  for (const m of report.surfaces?.mirrors || []) {
    if (m.syncStatus === 'diverged') { mirrorScore -= 20; }
    else if (m.syncStatus === 'missing') { mirrorScore -= 30; }
  }
  mirrorScore = Math.max(0, mirrorScore);
  const commandScore = summary.commandCount > 0 ? 100 : 0;
  const skillScore = summary.skillCount > 0 ? 100 : 0;
  const score = Math.round(mirrorScore * 0.6 + commandScore * 0.2 + skillScore * 0.2);
  return {
    score,
    details: [
      { id: 'mirror-parity', pass: mirrorScore === 100, score: mirrorScore },
      { id: 'command-coverage', pass: commandScore > 0, count: summary.commandCount },
      { id: 'skill-coverage', pass: skillScore > 0, count: summary.skillCount },
    ],
    maxPossible: 100,
    raw: { mirrorScore, commandScore, skillScore, mirrorStatus: summary.mirrorSyncStatus },
  };
}

function scoreDimOutputQuality(profile, content) {
  const checks = profile.derivedChecks?.outputChecks || [];
  if (checks.length === 0) { return { score: 100, details: [], maxPossible: 0 }; }
  const lower = content.toLowerCase();
  const maxPossible = checks.reduce((s, c) => s + c.weight, 0);
  let earned = 0;
  const details = [];
  for (const check of checks) {
    const keywords = check.check.toLowerCase().split(/\s+/).filter((w) => w.length > 3).slice(0, 3);
    const pass = keywords.length > 0 && keywords.filter((kw) => lower.includes(kw)).length >= Math.ceil(keywords.length * 0.5);
    if (pass) { earned += check.weight; }
    details.push({ id: check.id, pass, check: check.check });
  }
  // Penalty for placeholder content
  const placeholders = (content.match(/\[YOUR_VALUE_HERE\]|\[TODO\]|\[TBD\]|\[PLACEHOLDER\]/gi) || []).length;
  const placeholderPenalty = Math.min(30, placeholders * 10);
  const raw = maxPossible > 0 ? Math.round(100 * earned / maxPossible) : 100;
  return { score: Math.max(0, raw - placeholderPenalty), details, maxPossible, placeholders };
}

function scoreDimSystemFitness(profile, content) {
  const details = [];
  let earned = 0;
  let maxPossible = 0;

  // Check permission-capability alignment
  const mismatches = profile.derivedChecks?.capabilityMismatches || [];
  maxPossible += 40;
  if (mismatches.length === 0) {
    earned += 40;
    details.push({ id: 'perm-capability-align', pass: true });
  } else {
    details.push({ id: 'perm-capability-align', pass: false, mismatches });
  }

  // Check for orphaned resource references
  const integration = profile.derivedChecks?.integrationPoints || {};
  const commands = integration.commands || [];
  const skills = integration.skills || [];
  maxPossible += 30;
  let refsValid = 0;
  let refsTotal = 0;
  for (const cmd of commands) {
    refsTotal++;
    const cmdPath = cmd.replace(/^\//, '').replace(/:/g, '/');
    if (fs.existsSync(`.opencode/command/${cmdPath}.md`)) { refsValid++; }
  }
  for (const sk of skills) {
    refsTotal++;
    if (fs.existsSync(`.opencode/skill/${sk}/SKILL.md`)) { refsValid++; }
  }
  const refScore = refsTotal > 0 ? Math.round(30 * refsValid / refsTotal) : 30;
  earned += refScore;
  details.push({ id: 'resource-refs-valid', pass: refsValid === refsTotal, valid: refsValid, total: refsTotal });

  // Check frontmatter completeness
  maxPossible += 30;
  const hasFrontmatter = /^---\n[\s\S]*?\n---/.test(content);
  const hasName = /^name:\s+\S/m.test(content);
  const hasMode = /^mode:\s+\S/m.test(content);
  const hasPermission = /^permission:\s*$/m.test(content);
  const fmScore = [hasFrontmatter, hasName, hasMode, hasPermission].filter(Boolean).length * 7.5;
  earned += fmScore;
  details.push({ id: 'frontmatter-complete', pass: fmScore >= 30, score: fmScore });

  return { score: maxPossible > 0 ? Math.round(100 * earned / maxPossible) : 100, details, maxPossible };
}

function scoreDynamic(candidateContent, agentName, profile, weights) {
  // Accept optional weights override; fall back to hardcoded defaults (ADR-005 backward compat)
  const effectiveWeights = weights || DIMENSION_WEIGHTS;

  const structural = scoreDimStructural(profile, candidateContent);
  const ruleCoherence = scoreDimRuleCoherence(profile, candidateContent);
  const integration = scoreDimIntegration(agentName);
  const outputQuality = scoreDimOutputQuality(profile, candidateContent);
  const systemFitness = scoreDimSystemFitness(profile, candidateContent);

  const dimensions = [
    { name: 'structural', score: structural.score, weight: effectiveWeights.structural, details: structural.details },
    { name: 'ruleCoherence', score: ruleCoherence.score, weight: effectiveWeights.ruleCoherence, details: ruleCoherence.details },
    { name: 'integration', score: integration.score, weight: effectiveWeights.integration, details: integration.details },
    { name: 'outputQuality', score: outputQuality.score, weight: effectiveWeights.outputQuality, details: outputQuality.details },
    { name: 'systemFitness', score: systemFitness.score, weight: effectiveWeights.systemFitness, details: systemFitness.details },
  ];

  const weightedScore = Math.round(
    dimensions.reduce((sum, d) => sum + d.score * d.weight, 0),
  );

  return { weightedScore, dimensions };
}

function dimensionDelta(candidateDimensions, baselineDimensions) {
  const baselineByName = new Map((baselineDimensions || []).map((entry) => [entry.name, entry]));
  return (candidateDimensions || []).map((entry) => {
    const baseline = baselineByName.get(entry.name);
    return {
      name: entry.name,
      score: entry.score,
      baselineScore: baseline ? baseline.score : null,
      delta: baseline ? entry.score - baseline.score : null,
      weight: entry.weight,
    };
  });
}

function resolveThresholdDelta(args, manifest) {
  const raw = args.thresholdDelta ?? manifest?.scoring?.thresholdDelta ?? manifest?.scoring?.minimumDelta ?? 2;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : 2;
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. MAIN
// ─────────────────────────────────────────────────────────────────────────────

function main() {
  const args = parseArgs(process.argv.slice(2));
  const candidatePath = args.candidate;
  const baselinePath = args.baseline;
  const manifestPath = args.manifest;
  const targetPath = args.target || candidatePath;
  const outputPath = args.output;

  if (!candidatePath) {
    process.stderr.write('Missing required --candidate argument\n');
    process.exit(2);
  }

  const candidateContent = safeRead(candidatePath);
  if (typeof candidateContent !== 'string') {
    const failure = {
      status: 'infra_failure',
      profileId: args.profile || null,
      family: null,
      evaluationMode: 'dynamic-5d',
      target: targetPath,
      candidate: candidatePath,
      error: candidateContent.error,
      failureModes: ['candidate-read-failure'],
    };
    if (outputPath) {
      writeJson(outputPath, failure);
    } else {
      process.stdout.write(`${JSON.stringify(failure, null, 2)}\n`);
    }
    process.exit(1);
  }

  // Dynamic mode is the only evaluation path. generate-profile.cjs + 5-dimension scoring.
  const manifest = loadManifest(manifestPath);
  if (manifest && manifest.error) {
    const failure = {
      status: 'infra_failure',
      profileId: args.profile || null,
      family: null,
      evaluationMode: 'dynamic-5d',
      target: targetPath,
      candidate: candidatePath,
      error: manifest.error,
      failureModes: ['manifest-parse-failure'],
    };
    if (outputPath) {
      writeJson(outputPath, failure);
    } else {
      process.stdout.write(`${JSON.stringify(failure, null, 2)}\n`);
    }
    process.exit(1);
  }

  const profile = runScript('generate-profile.cjs', [`--agent=${candidatePath}`]);
  if (!profile || !profile.id) {
    const failure = {
      status: 'infra_failure',
      evaluationMode: 'dynamic-5d',
      target: targetPath,
      candidate: candidatePath,
      error: 'Failed to generate dynamic profile',
      failureModes: ['profile-generation-failure'],
    };
    if (outputPath) {
      writeJson(outputPath, failure);
    } else {
      process.stdout.write(`${JSON.stringify(failure, null, 2)}\n`);
    }
    process.exit(1);
  }

  const manifestProfileId = inferProfileId(targetPath, args.profile, manifest);
  const resolvedProfileId = manifestProfileId !== 'dynamic' ? manifestProfileId : profile.id;
  const family = inferFamily(resolvedProfileId, manifest, targetPath);
  const agentName = profile.id;

  // Accept optional --weights=<json> to override DIMENSION_WEIGHTS (ADR-005)
  let weightsOverride = null;
  if (args.weights) {
    try {
      weightsOverride = JSON.parse(args.weights);
    } catch (_err) {
      process.stderr.write('Warning: failed to parse --weights JSON, using defaults\n');
    }
  }
  const dynamicResult = scoreDynamic(candidateContent, agentName, profile, weightsOverride);

  let baselineResult = null;
  let delta = null;
  let baselineScore = null;
  const thresholdDelta = resolveThresholdDelta(args, manifest);

  if (baselinePath) {
    const baselineContent = safeRead(baselinePath);
    if (typeof baselineContent !== 'string') {
      const failure = {
        status: 'infra_failure',
        profileId: args.profile || null,
        family: null,
        evaluationMode: 'dynamic-5d',
        target: targetPath,
        candidate: candidatePath,
        baseline: baselinePath,
        error: baselineContent.error,
        failureModes: ['baseline-read-failure'],
      };
      if (outputPath) {
        writeJson(outputPath, failure);
      } else {
        process.stdout.write(`${JSON.stringify(failure, null, 2)}\n`);
      }
      process.exit(1);
    }

    const baselineProfile = runScript('generate-profile.cjs', [`--agent=${baselinePath}`]);
    if (!baselineProfile || !baselineProfile.id) {
      const failure = {
        status: 'infra_failure',
        evaluationMode: 'dynamic-5d',
        target: targetPath,
        candidate: candidatePath,
        baseline: baselinePath,
        error: 'Failed to generate dynamic profile for baseline',
        failureModes: ['baseline-profile-generation-failure'],
      };
      if (outputPath) {
        writeJson(outputPath, failure);
      } else {
        process.stdout.write(`${JSON.stringify(failure, null, 2)}\n`);
      }
      process.exit(1);
    }

    baselineResult = scoreDynamic(baselineContent, baselineProfile.id, baselineProfile, weightsOverride);
    baselineScore = baselineResult.weightedScore;
    delta = {
      total: dynamicResult.weightedScore - baselineResult.weightedScore,
      dimensions: dimensionDelta(dynamicResult.dimensions, baselineResult.dimensions),
    };
  }

  const recommendation = baselineResult
    ? (delta.total >= thresholdDelta
        ? 'candidate-better'
        : (dynamicResult.weightedScore >= 70 ? 'candidate-acceptable' : 'keep-baseline'))
    : (dynamicResult.weightedScore >= 70 ? 'candidate-acceptable' : 'needs-improvement');

  const result = {
    status: 'scored',
    profileId: resolvedProfileId,
    family: family || profile.family,
    evaluationMode: 'dynamic-5d',
    target: targetPath,
    candidate: candidatePath,
    baseline: baselinePath || null,
    score: dynamicResult.weightedScore,
    baselineScore,
    delta,
    thresholdDelta,
    dimensions: dynamicResult.dimensions,
    legacyScore: null,
    recommendation,
    failureModes: dynamicResult.dimensions
      .filter((d) => d.score < 60)
      .map((d) => `weak-${d.name}`),
  };

  if (outputPath) {
    writeJson(outputPath, result);
  } else {
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  }
}

main();
