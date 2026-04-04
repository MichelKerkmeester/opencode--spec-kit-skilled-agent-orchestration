// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Derived Surface Drift Report                                             ║
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

function parseJsonc(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const normalized = raw.replace(/^\s*\/\/.*$/gm, '');
  return JSON.parse(normalized);
}

function stripFrontmatter(content) {
  return content.replace(/^---[\s\S]*?---\n/, '');
}

function walk(dir, acc) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === '.git') {
      continue;
    }
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, acc);
    } else {
      acc.push(full);
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. MAIN
// ─────────────────────────────────────────────────────────────────────────────

function main() {
  const args = parseArgs(process.argv.slice(2));
  const canonical = args.canonical;
  const mirrors = (args.mirrors || '').split(',').filter(Boolean);
  const output = args.output;
  const manifestPath = args.manifest;

  if (!canonical || mirrors.length === 0 || !output) {
    process.stderr.write('Usage: node check-mirror-drift.cjs --canonical=... --mirrors=a,b,c --output=... [--manifest=...]\n');
    process.exit(2);
  }

  const canonicalBody = stripFrontmatter(fs.readFileSync(canonical, 'utf8'));
  const lines = ['# Mirror Drift Report', '', `Canonical target: \`${canonical}\``, ''];

  const repoRoot = process.cwd();
  const files = [];
  for (const root of ['.opencode', '.claude', '.codex', '.gemini', '.agents']) {
    if (fs.existsSync(root)) {
      walk(root, files);
    }
  }
  const relevantRoots = [
    '.opencode/agent/',
    '.claude/agents/',
    '.codex/agents/',
    '.gemini/agents/',
    '.agents/agents/',
    '.opencode/command/spec_kit/',
    '.agents/commands/spec_kit/',
    '.gemini/commands/spec_kit/',
    '.opencode/skill/system-spec-kit/templates/',
  ];
  const discovered = files
    .filter((file) => /handover(\.md|\.toml)$/i.test(file))
    .filter((file) => relevantRoots.some((root) => file.startsWith(root)))
    .sort();
  const manifest = manifestPath ? parseJsonc(manifestPath) : null;
  const declared = new Set([canonical, ...mirrors]);
  if (manifest) {
    for (const target of manifest.targets || []) {
      declared.add(target.path);
    }
    for (const fixed of manifest.fixed || []) {
      declared.add(fixed);
    }
    for (const forbidden of manifest.forbidden || []) {
      declared.add(forbidden);
    }
  }
  const undisclosed = discovered.filter((file) => !declared.has(file));

  lines.push('## Surface Coverage');
  lines.push('');
  lines.push(`- Declared surfaces: ${declared.size}`);
  lines.push(`- Discovered handover surfaces: ${discovered.length}`);
  lines.push(`- Undisclosed surfaces: ${undisclosed.length}`);
  if (undisclosed.length > 0) {
    for (const extra of undisclosed) {
      lines.push(`- Undisclosed: \`${extra}\``);
    }
  }
  lines.push('');
  lines.push('## Discovered Surfaces');
  lines.push('');
  for (const file of discovered) {
    lines.push(`- \`${file}\``);
  }
  lines.push('');
  lines.push('## Known Mirrors');
  lines.push('');

  for (const mirror of mirrors) {
    let status = 'manual-review-required';
    if (fs.existsSync(mirror)) {
      const body = stripFrontmatter(fs.readFileSync(mirror, 'utf8'));
      const signalCount = [
        'Session handover specialist responsible for creating continuation documents',
        'Never create handovers without reading actual session state',
        '.opencode/skill/system-spec-kit/templates/handover.md',
      ].filter((signal) => canonicalBody.includes(signal) && body.includes(signal)).length;
      status = signalCount >= 2 ? 'aligned-in-intent' : 'manual-review-required';
    } else {
      status = 'missing';
    }
    lines.push(`- \`${mirror}\`: ${status}`);
  }

  lines.push('', 'Policy: mirrors remain derived surfaces and are not experiment targets in phase 1.');
  fs.writeFileSync(output, `${lines.join('\n')}\n`, 'utf8');
}

main();
