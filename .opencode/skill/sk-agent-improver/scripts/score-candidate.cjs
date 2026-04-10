// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Candidate Scorer — 5-Dimension Evaluation Framework                     ║
// ╚══════════════════════════════════════════════════════════════════════════╝
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
  if (/context-prime/i.test(targetPath || '')) {
    return 'context-prime';
  }
  return 'handover';
}

function inferFamily(profileId, manifest, targetPath) {
  const manifestTarget = manifest?.targets?.find((entry) => entry.path === targetPath);
  if (manifestTarget?.family) {
    return manifestTarget.family;
  }
  return profileId === 'context-prime' ? 'session-bootstrap' : 'session-handover';
}

function buildScore(checkSpecs, content) {
  const lower = content.toLowerCase();
  const checks = [];
  const reasons = [];
  let total = 0;
  let hardReject = false;

  for (const spec of checkSpecs.weightedChecks) {
    const pass = spec.test(content, lower);
    checks.push({ key: spec.key, pass, weight: spec.weight });
    if (pass) {
      total += spec.weight;
    } else {
      reasons.push(`Missing or weak: ${spec.key}`);
      if (spec.hardReject) {
        reasons.push(`Hard reject: ${spec.key}`);
        hardReject = true;
      }
    }
  }

  for (const spec of checkSpecs.warningChecks) {
    const pass = spec.test(content, lower);
    checks.push({ key: spec.key, pass, weight: 0 });
    if (!pass) {
      reasons.push(`Warning: ${spec.key}`);
    }
  }

  for (const spec of checkSpecs.forbiddenChecks) {
    const pass = !spec.test(content, lower);
    checks.push({ key: spec.key, pass, weight: 0 });
    if (!pass) {
      reasons.push(`Hard reject: ${spec.key}`);
      hardReject = true;
    }
  }

  return {
    total,
    checks,
    reasons,
    hardReject,
  };
}

function createHandoverChecks() {
  return {
    weightedChecks: [
      {
        key: 'mentions-spec-files',
        weight: 15,
        hardReject: true,
        test: (_content, lower) => /spec\.md/.test(lower) && /plan\.md/.test(lower) && /tasks\.md/.test(lower),
      },
      {
        key: 'mentions-checklist-and-memory',
        weight: 15,
        hardReject: true,
        test: (_content, lower) => /checklist\.md/.test(lower) && /memory\//.test(lower),
      },
      {
        key: 'references-template',
        weight: 15,
        hardReject: true,
        test: (content) => /\.opencode\/skill\/system-spec-kit\/templates\/handover\.md/.test(content),
      },
      {
        key: 'leaf-only',
        weight: 10,
        test: (_content, lower) => /leaf-only/.test(lower) || /illegal nesting/.test(lower),
      },
      {
        key: 'no-fabrication-rule',
        weight: 10,
        test: (content) => /never create handovers without reading actual session state/i.test(content) || /never fabricate/i.test(content),
      },
      {
        key: 'path-convention',
        weight: 10,
        test: (content) => /path convention/i.test(content) && /\.opencode\/agent\/\*\.md/i.test(content),
      },
      {
        key: 'structured-output',
        weight: 10,
        test: (content, lower) => /"status"/.test(content) && /filepath/.test(lower) && /attempt_number/.test(lower),
      },
      {
        key: 'actual-source-reading',
        weight: 10,
        test: (_content, lower) => /read spec folder files before/i.test(lower) || /required context sources/i.test(lower),
      },
      {
        key: 'capability-scan',
        weight: 3,
        test: (_content, lower) => /capability scan/.test(lower),
      },
      {
        key: 'output-verification',
        weight: 3,
        test: (_content, lower) => /output verification/.test(lower) || /verification before return/.test(lower),
      },
      {
        key: 'related-resources',
        weight: 3,
        test: (_content, lower) => /related resources/.test(lower),
      },
      {
        key: 'simplicity',
        weight: 5,
        test: (content) => content.length < 14000,
      },
    ],
    warningChecks: [
      {
        key: 'placeholder-heavy',
        test: (content) => (content.match(/\[(actual extracted value|spec_path|spec_folder|action|task|N|extracted from context)\]/gi) || []).length <= 10,
      },
      {
        key: 'no-permissive-skip-context-language',
        test: (content) => !/(you may|can|should).{0,40}(skip reading|without reading)/i.test(content),
      },
    ],
    forbiddenChecks: [
      {
        key: 'nested-delegation',
        test: (content, lower) => /dispatch sub-agents/i.test(content) && !/illegal/.test(lower),
      },
    ],
  };
}

function createContextPrimeChecks() {
  return {
    weightedChecks: [
      {
        key: 'session-bootstrap-tools',
        weight: 20,
        hardReject: true,
        test: (_content, lower) => /session_bootstrap/.test(lower) && /session_health/.test(lower),
      },
      {
        key: 'read-only-contract',
        weight: 15,
        hardReject: true,
        test: (content, lower) => /read-only/.test(lower) || /cannot modify files/.test(lower),
      },
      {
        key: 'prime-package-format',
        weight: 15,
        hardReject: true,
        test: (content) =>
          content.includes('## Session Context') &&
          content.includes('## System Health') &&
          content.includes('## Structural Context') &&
          content.includes('## Recommended Next Steps') &&
          content.includes('## Tool Routing'),
      },
      {
        key: 'urgency-skip',
        weight: 10,
        test: (_content, lower) => /urgent/.test(lower) && /skip bootstrap/.test(lower),
      },
      {
        key: 'time-budget',
        weight: 10,
        test: (_content, lower) => /under 15 seconds/.test(lower),
      },
      {
        key: 'graceful-failure',
        weight: 10,
        test: (_content, lower) => /unavailable/.test(lower) && /never block/i.test(lower),
      },
      {
        key: 'bootstrap-fallback',
        weight: 5,
        test: (_content, lower) => /session_resume/.test(lower) && /fallback/.test(lower),
      },
      {
        key: 'routing-guidance',
        weight: 5,
        test: (_content, lower) => /mcp__cocoindex_code__search/.test(lower) && /code_graph_query/.test(lower),
      },
      {
        key: 'no-indexing',
        weight: 5,
        test: (_content, lower) => /never trigger indexing/.test(lower) || /no code_graph_scan/.test(lower),
      },
      {
        key: 'simplicity',
        weight: 5,
        test: (content) => content.length < 13000,
      },
    ],
    warningChecks: [
      {
        key: 'placeholder-heavy',
        test: (content) => (content.match(/\[(your_value_here|actual extracted value)\]/gi) || []).length === 0,
      },
    ],
    forbiddenChecks: [
      {
        key: 'resume-primary-bootstrap',
        test: (_content, lower) =>
          /2-step bootstrap:\s*session_resume\s*\+\s*session_health/.test(lower) ||
          /\|\s*`session_resume`\s*\|[^\n]{0,80}always\s*[—-]\s*step 1/i.test(_content),
      },
      {
        key: 'writes-files',
        test: (_content, lower) =>
          /(write files|edit files|modify(?: any)? files)/.test(lower) &&
          !/(read-only|never modify(?: any)? files|cannot modify(?: any)? files|can't modify(?: any)? files|no file modification|no file modifications)/.test(lower),
      },
      {
        key: 'runs-indexing',
        test: (_content, lower) =>
          /(code_graph_scan|memory_save)/.test(lower) &&
          !/(no code_graph_scan|never trigger indexing|only check status|no memory_save|skip unchanged files)/.test(lower),
      },
    ],
  };
}

function scorePrompt(content, manifestTarget, profileId) {
  const profileChecks = profileId === 'context-prime' ? createContextPrimeChecks() : createHandoverChecks();
  const result = buildScore(profileChecks, content);

  if (manifestTarget && manifestTarget.mutableInPhase1 === true) {
    result.reasons.push('Hard reject: manifest allows phase-1 mutation for target; current packet expects bounded runs only');
    result.hardReject = true;
  }

  if (manifestTarget?.classification === 'fixed' || manifestTarget?.classification === 'forbidden') {
    result.reasons.push(`Hard reject: manifest marks target as ${manifestTarget.classification}`);
    result.hardReject = true;
  }

  return result;
}

function collectFailureModes(scoreResult) {
  return scoreResult.checks
    .filter((entry) => !entry.pass)
    .map((entry) => entry.key);
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

// ─────────────────────────────────────────────────────────────────────────────
// 6. MAIN
// ─────────────────────────────────────────────────────────────────────────────

function main() {
  const args = parseArgs(process.argv.slice(2));
  const candidatePath = args.candidate;
  const baselinePath = args.baseline;
  const manifestPath = args.manifest;
  const targetPath = args.target || '.opencode/agent/handover.md';
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
      evaluationMode: 'prompt-surface',
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

  // Dynamic mode: use generate-profile.cjs + 5-dimension scoring
  if (args.dynamic) {
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
      if (outputPath) { writeJson(outputPath, failure); } else { process.stdout.write(`${JSON.stringify(failure, null, 2)}\n`); }
      process.exit(1);
    }
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

    // Also run legacy scoring if profile matches a known profile
    let legacyScore = null;
    if (profile.id === 'handover' || profile.id === 'context-prime') {
      legacyScore = scorePrompt(candidateContent, null, profile.id);
    }

    const result = {
      status: 'scored',
      profileId: profile.id,
      family: profile.family,
      evaluationMode: 'dynamic-5d',
      target: targetPath,
      candidate: candidatePath,
      score: dynamicResult.weightedScore,
      dimensions: dynamicResult.dimensions,
      legacyScore: legacyScore ? { total: legacyScore.hardReject ? 0 : legacyScore.total, checks: legacyScore.checks } : null,
      recommendation: dynamicResult.weightedScore >= 70 ? 'candidate-acceptable' : 'needs-improvement',
      failureModes: dynamicResult.dimensions
        .filter((d) => d.score < 60)
        .map((d) => `weak-${d.name}`),
    };

    if (outputPath) { writeJson(outputPath, result); } else { process.stdout.write(`${JSON.stringify(result, null, 2)}\n`); }
    return;
  }

  const baselineContent = baselinePath ? safeRead(baselinePath) : null;
  const manifest = loadManifest(manifestPath);
  if (manifest && manifest.error) {
    const failure = {
      status: 'infra_failure',
      profileId: args.profile || null,
      family: null,
      evaluationMode: 'prompt-surface',
      target: targetPath,
      candidate: candidatePath,
      baseline: baselinePath || null,
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

  const profileId = inferProfileId(targetPath, args.profile, manifest);
  const family = inferFamily(profileId, manifest, targetPath);
  const manifestTarget = manifest?.targets?.find((entry) => entry.path === targetPath) || null;
  const candidateScore = scorePrompt(candidateContent, manifestTarget, profileId);
  const baselineScore =
    typeof baselineContent === 'string'
      ? scorePrompt(baselineContent, manifestTarget, profileId)
      : null;

  const candidateTotal = candidateScore.hardReject ? 0 : candidateScore.total;
  const baselineTotal = baselineScore ? (baselineScore.hardReject ? 0 : baselineScore.total) : null;
  const delta = baselineTotal === null ? null : candidateTotal - baselineTotal;

  let recommendation = 'candidate-better';
  if (candidateScore.hardReject) {
    recommendation = 'reject-candidate';
  } else if (baselineTotal !== null && delta < 0) {
    recommendation = 'keep-baseline';
  } else if (baselineTotal !== null && delta === 0) {
    recommendation = 'tie';
  }

  const result = {
    status: 'scored',
    profileId,
    family,
    evaluationMode: 'prompt-surface',
    target: targetPath,
    candidate: candidatePath,
    baseline: baselinePath || null,
    score: candidateTotal,
    totals: {
      candidate: candidateTotal,
      baseline: baselineTotal,
    },
    delta,
    recommendation,
    checks: {
      candidate: candidateScore.checks,
      baseline: baselineScore ? baselineScore.checks : [],
    },
    reasons: {
      candidate: candidateScore.reasons,
      baseline: baselineScore ? baselineScore.reasons : [],
    },
    failureModes: collectFailureModes(candidateScore),
  };

  if (outputPath) {
    writeJson(outputPath, result);
  } else {
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  }
}

main();
