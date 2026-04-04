// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Guarded Canonical Promotion Helper                                       ║
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
  for (const entry of argv) {
    if (!entry.startsWith('--')) {
      continue;
    }
    const [key, ...rest] = entry.slice(2).split('=');
    args[key] = rest.length > 0 ? rest.join('=') : true;
  }
  return args;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function readOptionalJson(filePath) {
  if (!filePath || !fs.existsSync(filePath)) {
    return null;
  }
  return readJson(filePath);
}

function readJsonc(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(raw.replace(/^\s*\/\/.*$/gm, ''));
}

function ensureParent(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. VALIDATION CHECKS
// ─────────────────────────────────────────────────────────────────────────────

function resolveAllowedCanonicalTarget(manifestPath) {
  const manifest = readJsonc(manifestPath);
  const canonicalTargets = (manifest.targets || [])
    .filter((target) => target.classification === 'canonical')
    .map((target) => target.path);
  if (canonicalTargets.length !== 1) {
    process.stderr.write(`Cannot promote: expected exactly one canonical target in manifest, found ${canonicalTargets.length}\n`);
    process.exit(1);
  }
  return canonicalTargets[0];
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. MAIN
// ─────────────────────────────────────────────────────────────────────────────

function main() {
  const args = parseArgs(process.argv.slice(2));
  const candidate = args.candidate;
  const target = args.target;
  const scorePath = args.score;
  const benchmarkReportPath = args['benchmark-report'];
  const repeatabilityReportPath = args['repeatability-report'];
  const configPath = args.config;
  const manifestPath = args.manifest;
  const archiveDir = args['archive-dir'];
  const approve = args.approve === true || args.approve === 'true';

  if (!candidate || !target || !scorePath || !benchmarkReportPath || !configPath || !manifestPath || !archiveDir || !approve) {
    process.stderr.write('Usage: node promote-candidate.cjs --candidate=... --target=... --score=... --benchmark-report=... [--repeatability-report=...] --config=... --manifest=... --archive-dir=... --approve\n');
    process.exit(2);
  }

  const score = readJson(scorePath);
  const benchmarkReport = readJson(benchmarkReportPath);
  const resolvedRepeatabilityReportPath = repeatabilityReportPath || path.join(path.dirname(benchmarkReportPath), 'repeatability.json');
  const repeatabilityReport = readOptionalJson(resolvedRepeatabilityReportPath);
  const config = readJson(configPath);
  const allowedCanonicalTarget = resolveAllowedCanonicalTarget(manifestPath);
  const threshold = Number(config?.scoring?.thresholdDelta || 1);
  const proposalOnly = config?.proposalOnly;
  const promotionEnabled = config?.promotionEnabled;

  if (score.status !== 'scored') {
    process.stderr.write('Cannot promote: score file is not in scored state\n');
    process.exit(1);
  }

  if (proposalOnly !== false) {
    process.stderr.write('Cannot promote: runtime config is still in proposal-only mode\n');
    process.exit(1);
  }

  if (promotionEnabled !== true) {
    process.stderr.write('Cannot promote: promotionEnabled is not true in runtime config\n');
    process.exit(1);
  }

  if (config?.target && target !== config.target) {
    process.stderr.write(`Cannot promote: target ${target} does not match runtime config target ${config.target}\n`);
    process.exit(1);
  }

  if (config?.targetProfile && benchmarkReport.profileId !== config.targetProfile) {
    process.stderr.write(`Cannot promote: benchmark profile ${benchmarkReport.profileId} does not match runtime config target profile ${config.targetProfile}\n`);
    process.exit(1);
  }

  if (benchmarkReport.status !== 'benchmark-complete') {
    process.stderr.write('Cannot promote: benchmark report is not in benchmark-complete state\n');
    process.exit(1);
  }

  if (benchmarkReport.target !== target) {
    process.stderr.write(`Cannot promote: benchmark report target ${benchmarkReport.target} does not match requested target ${target}\n`);
    process.exit(1);
  }

  if (benchmarkReport.recommendation !== 'benchmark-pass') {
    process.stderr.write(`Cannot promote: benchmark recommendation is ${benchmarkReport.recommendation}\n`);
    process.exit(1);
  }

  if (!repeatabilityReport) {
    process.stderr.write(`Cannot promote: repeatability report not found at ${resolvedRepeatabilityReportPath}\n`);
    process.exit(1);
  }

  if (repeatabilityReport.profileId !== benchmarkReport.profileId) {
    process.stderr.write(`Cannot promote: repeatability profile ${repeatabilityReport.profileId} does not match benchmark profile ${benchmarkReport.profileId}\n`);
    process.exit(1);
  }

  if (repeatabilityReport.passed !== true) {
    process.stderr.write('Cannot promote: repeatability check did not pass\n');
    process.exit(1);
  }

  if (target !== allowedCanonicalTarget) {
    process.stderr.write(`Cannot promote: target ${target} is not the single allowed canonical target ${allowedCanonicalTarget}\n`);
    process.exit(1);
  }

  if (score.recommendation !== 'candidate-better') {
    process.stderr.write(`Cannot promote: recommendation is ${score.recommendation}\n`);
    process.exit(1);
  }

  if (Number(score.delta || 0) < threshold) {
    process.stderr.write(`Cannot promote: delta ${score.delta} below threshold ${threshold}\n`);
    process.exit(1);
  }

  ensureParent(path.join(archiveDir, 'placeholder'));
  const timestamp = new Date().toISOString().replace(/[:]/g, '-');
  const backupPath = path.join(archiveDir, `${path.basename(target)}.${timestamp}.bak`);

  fs.copyFileSync(target, backupPath);
  fs.copyFileSync(candidate, target);

  const result = {
    status: 'promoted',
    target,
    candidate,
    backupPath,
    benchmarkReport: benchmarkReportPath,
    repeatabilityReport: resolvedRepeatabilityReportPath,
    delta: score.delta,
    threshold,
    timestamp: new Date().toISOString(),
  };

  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}

main();
