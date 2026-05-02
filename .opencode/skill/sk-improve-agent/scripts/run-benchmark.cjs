// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Benchmark Runner — Fixture and Integration Scoring                       ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const path = require('node:path');

// ─────────────────────────────────────────────────────────────────────────────
// 2. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const entry = argv[index];
    if (!entry.startsWith('--')) {
      continue;
    }
    const [key, ...rest] = entry.slice(2).split('=');
    if (rest.length > 0) {
      args[key] = rest.join('=');
    } else if (argv[index + 1] && !argv[index + 1].startsWith('--')) {
      args[key] = argv[index + 1];
      index += 1;
    } else {
      args[key] = true;
    }
  }
  return args;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function appendJsonl(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.appendFileSync(filePath, `${JSON.stringify(value)}\n`, 'utf8');
}

function listJsonFiles(dir) {
  return fs.readdirSync(dir)
    .filter((entry) => entry.endsWith('.json'))
    .sort()
    .map((entry) => path.join(dir, entry));
}

function resolveMaybeRelative(value, baseDir) {
  if (path.isAbsolute(value)) {
    return value;
  }
  const fromCwd = path.resolve(process.cwd(), value);
  if (fs.existsSync(fromCwd)) {
    return fromCwd;
  }
  return path.resolve(baseDir, value);
}

function loadProfile(profileArg, profilesDir) {
  const directPath = path.resolve(process.cwd(), profileArg);
  const profilePath = fs.existsSync(directPath)
    ? directPath
    : path.join(profilesDir, `${profileArg}.json`);
  return {
    data: readJson(profilePath),
    path: profilePath,
  };
}

function fixturePathFor(fixtureRef, fixtureDir) {
  const fileName = fixtureRef.endsWith('.json') ? fixtureRef : `${fixtureRef}.json`;
  return path.join(fixtureDir, fileName);
}

function loadFixtures(profile, profilePath) {
  const profileDir = path.dirname(profilePath);
  const fixtureDir = resolveMaybeRelative(profile.fixtureDir || profile.benchmark?.fixtureDir, profileDir);
  const fixtureRefs = profile.fixtures || profile.benchmark?.fixtures || null;
  const fixtureFiles = Array.isArray(fixtureRefs)
    ? fixtureRefs.map((fixtureRef) => fixturePathFor(fixtureRef, fixtureDir))
    : listJsonFiles(fixtureDir);
  return fixtureFiles.map((filePath) => readJson(filePath));
}

function inferStateLogPath(outputsDir) {
  let current = path.resolve(process.cwd(), outputsDir);
  while (current !== path.dirname(current)) {
    if (path.basename(current) === 'improvement') {
      return path.join(current, 'agent-improvement-state.jsonl');
    }
    current = path.dirname(current);
  }
  return null;
}

function compilePatterns(patterns) {
  return (patterns || []).map((value) => new RegExp(value, 'i'));
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. FIXTURE SCORING
// ─────────────────────────────────────────────────────────────────────────────

function scoreFixture(fixture, outputPath) {
  if (!fs.existsSync(outputPath)) {
    return {
      id: fixture.id,
      outputPath,
      score: 0,
      maxScore: 100,
      passed: false,
      missingHeadings: fixture.requiredHeadings || [],
      missingPatterns: fixture.requiredPatterns || [],
      forbiddenMatches: [],
      failureModes: ['missing-output'],
    };
  }

  const content = fs.readFileSync(outputPath, 'utf8');
  const missingHeadings = (fixture.requiredHeadings || []).filter((heading) => !content.includes(heading));
  const patternRegexes = compilePatterns(fixture.requiredPatterns);
  const missingPatterns = patternRegexes
    .map((regex, index) => ({ regex, source: fixture.requiredPatterns[index] }))
    .filter((entry) => !entry.regex.test(content))
    .map((entry) => entry.source);
  const forbiddenRegexes = compilePatterns(fixture.forbiddenPatterns);
  const forbiddenMatches = forbiddenRegexes
    .map((regex, index) => ({ regex, source: fixture.forbiddenPatterns[index] }))
    .filter((entry) => entry.regex.test(content))
    .map((entry) => entry.source);

  const headingScore =
    (fixture.requiredHeadings || []).length === 0
      ? 45
      : Math.round(45 * (((fixture.requiredHeadings || []).length - missingHeadings.length) / (fixture.requiredHeadings || []).length));
  const patternScore =
    (fixture.requiredPatterns || []).length === 0
      ? 35
      : Math.round(35 * (((fixture.requiredPatterns || []).length - missingPatterns.length) / (fixture.requiredPatterns || []).length));
  const cleanScore =
    (fixture.forbiddenPatterns || []).length === 0
      ? 20
      : Math.round(20 * (((fixture.forbiddenPatterns || []).length - forbiddenMatches.length) / (fixture.forbiddenPatterns || []).length));

  const score = headingScore + patternScore + cleanScore;
  const failureModes = [];
  if (missingHeadings.length > 0) {
    failureModes.push('missing-headings');
  }
  if (missingPatterns.length > 0) {
    failureModes.push('missing-required-patterns');
  }
  if (forbiddenMatches.length > 0) {
    failureModes.push('forbidden-patterns');
  }

  return {
    id: fixture.id,
    outputPath,
    score,
    maxScore: 100,
    passed: failureModes.length === 0,
    missingHeadings,
    missingPatterns,
    forbiddenMatches,
    failureModes,
  };
}

function aggregateFailureModes(fixtures) {
  const counts = {};
  for (const fixture of fixtures) {
    for (const mode of fixture.failureModes || []) {
      counts[mode] = (counts[mode] || 0) + 1;
    }
  }
  return Object.entries(counts)
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
    .map(([mode]) => mode);
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. INTEGRATION SCORING
// ─────────────────────────────────────────────────────────────────────────────

function scoreIntegration(integrationReportPath) {
  const data = readJson(integrationReportPath);

  // Normalize scanner output: scan-integration.cjs emits surfaces.mirrors/commands/skills
  // while this function historically expects top-level mirrors/commandReferences/skillReferences.
  const mirrors = data.mirrors || (data.surfaces && data.surfaces.mirrors) || [];
  const commandRefs = data.commandReferences || (data.surfaces && data.surfaces.commands) || [];
  const skillRefs = data.skillReferences || (data.surfaces && data.surfaces.skills) || [];

  // --- Mirror sync score (base 100, penalize diverged/missing) ---
  let mirrorScore = 100;
  for (const mirror of mirrors) {
    const mStatus = mirror.status || mirror.syncStatus;
    if (mStatus === 'missing') {
      mirrorScore -= 30;
    } else if (mStatus === 'diverged') {
      mirrorScore -= 20;
    }
  }
  mirrorScore = Math.max(0, mirrorScore);
  const mirrorStatus =
    mirrorScore === 100
      ? 'all-aligned'
      : mirrors.some((entry) => (entry.status || entry.syncStatus) === 'missing')
        ? 'has-missing'
        : 'has-divergence';

  // --- Command coverage (binary: at least 1 reference = 10 pts) ---
  const commandCount = commandRefs.length;
  const commandScore = commandCount >= 1 ? 100 : 0;

  // --- Skill coverage (binary: at least 1 reference = 10 pts) ---
  const skillCount = skillRefs.length;
  const skillScore = skillCount >= 1 ? 100 : 0;

  // --- Weighted average (mirror: 60%, command: 20%, skill: 20%) ---
  const integrationScore = Math.round(
    mirrorScore * 0.6 + commandScore * 0.2 + skillScore * 0.2
  );

  return {
    integrationScore,
    integrationDetails: {
      mirrorScore,
      commandScore,
      skillScore,
      mirrorStatus,
      commandCount,
      skillCount,
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. MAIN
// ─────────────────────────────────────────────────────────────────────────────

function main() {
  const args = parseArgs(process.argv.slice(2));
  const profileArg = args.profile;
  const outputsDir = args['outputs-dir'];
  const outputPath = args.output || (outputsDir ? path.join(outputsDir, 'report.json') : null);
  const profilesDir = args['profiles-dir'] || '.opencode/skill/sk-improve-agent/assets/target-profiles';
  const integrationReportPath = args['integration-report'] || null;

  if (!profileArg || !outputsDir || !outputPath) {
    process.stderr.write('Usage: node run-benchmark.cjs --profile <path-or-id> --outputs-dir <path> [--output <path>] [--state-log <path>] [--label <string>] [--profiles-dir <path>] [--integration-report <path>]\n');
    process.exit(2);
  }

  let profileId = profileArg;
  const stateLogPath = args['state-log'] || inferStateLogPath(outputsDir);
  const label = args.label || `${path.basename(profileArg, '.json')}-benchmark`;

  try {
    const loadedProfile = loadProfile(profileArg, profilesDir);
    const profile = loadedProfile.data;
    profileId = profile.profileId || profile.id || profileId;
    const fixtures = loadFixtures(profile, loadedProfile.path);
    const results = fixtures.map((fixture) => scoreFixture(fixture, path.join(outputsDir, `${fixture.id}.md`)));
    const aggregateScore = results.length === 0
      ? 0
      : Math.round(results.reduce((sum, entry) => sum + entry.score, 0) / results.length);
    const minimumFixtureScore = profile.benchmark?.minimumFixtureScore ?? 70;
    const aggregateThreshold = profile.benchmark?.requiredAggregateScore ?? 80;
    const passCount = results.filter((entry) => entry.passed).length;
    const passRate = results.length === 0 ? 0 : passCount / results.length;
    const delta = aggregateScore / 100 - Number(profile.thresholdDelta || 0);
    const recommendation =
      aggregateScore >= aggregateThreshold && results.every((entry) => entry.score >= minimumFixtureScore)
        ? 'benchmark-pass'
        : 'benchmark-fail';
    const report = {
      status: 'benchmark-complete',
      profileId,
      family: profile.family,
      target: profile.targetPath,
      label,
      aggregateScore,
      maxScore: 100,
      totals: {
        score: aggregateScore,
        delta,
        pass_rate: passRate,
        fixtures: results.length,
        passed: passCount,
      },
      recommendation,
      thresholds: {
        requiredAggregateScore: aggregateThreshold,
        minimumFixtureScore,
        repeatabilityTolerance: profile.benchmark?.repeatabilityTolerance ?? 0,
        thresholdDelta: Number(profile.thresholdDelta || 0),
      },
      rows: results,
      fixtures: results,
      failureModes: aggregateFailureModes(results),
    };

    if (integrationReportPath) {
      const integration = scoreIntegration(integrationReportPath);
      report.integrationScore = integration.integrationScore;
      report.integrationDetails = integration.integrationDetails;
    }

    writeJson(outputPath, report);

    if (stateLogPath) {
      appendJsonl(stateLogPath, {
        type: 'benchmark_run',
        profileId,
        family: profile.family,
        target: profile.targetPath,
        label,
        outputDir: outputsDir,
        report: outputPath,
        aggregateScore,
        totals: report.totals,
        rows: results,
        recommendation,
        failureModes: report.failureModes,
      });
    }
  } catch (error) {
    const failure = {
      status: 'infra_failure',
      profileId,
      family: null,
      evaluationMode: 'benchmark',
      outputsDir,
      error: error.message,
      failureModes: ['benchmark-runner-failure'],
    };
    writeJson(outputPath, failure);
    if (stateLogPath) {
      appendJsonl(stateLogPath, {
        type: 'infra_failure',
        profileId,
        family: null,
        recommendation: 'infra_failure',
        error: error.message,
        failureModes: ['benchmark-runner-failure'],
      });
    }
    process.exit(1);
  }
}

main();
