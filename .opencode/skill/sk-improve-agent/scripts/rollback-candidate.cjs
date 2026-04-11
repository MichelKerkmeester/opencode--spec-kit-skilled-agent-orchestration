// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Canonical Rollback Helper                                                ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');

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

function readJsonc(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(raw.replace(/^\s*\/\/.*$/gm, ''));
}

function resolveAllowedCanonicalTarget(manifestPath) {
  const manifest = readJsonc(manifestPath);
  const canonicalTargets = (manifest.targets || [])
    .filter((target) => target.classification === 'canonical')
    .map((target) => target.path);
  if (canonicalTargets.length !== 1) {
    process.stderr.write(`Cannot roll back: expected exactly one canonical target in manifest, found ${canonicalTargets.length}\n`);
    process.exit(1);
  }
  return canonicalTargets[0];
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. MAIN
// ─────────────────────────────────────────────────────────────────────────────

function main() {
  const args = parseArgs(process.argv.slice(2));
  const target = args.target;
  const backup = args.backup;
  const configPath = args.config;
  const manifestPath = args.manifest;

  if (!target || !backup || !configPath || !manifestPath) {
    process.stderr.write('Usage: node rollback-candidate.cjs --target=... --backup=... --config=... --manifest=...\n');
    process.exit(2);
  }

  const config = readJson(configPath);
  const allowedCanonicalTarget = resolveAllowedCanonicalTarget(manifestPath);

  if (config?.target && target !== config.target) {
    process.stderr.write(`Cannot roll back: target ${target} does not match runtime config target ${config.target}\n`);
    process.exit(1);
  }

  if (target !== allowedCanonicalTarget) {
    process.stderr.write(`Cannot roll back: target ${target} is not the single allowed canonical target ${allowedCanonicalTarget}\n`);
    process.exit(1);
  }

  fs.copyFileSync(backup, target);
  process.stdout.write(`${JSON.stringify({ status: 'rolled_back', target, backup }, null, 2)}\n`);
}

main();
