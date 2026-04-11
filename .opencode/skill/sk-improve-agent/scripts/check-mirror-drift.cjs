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

function safeReadBody(file) {
  try {
    return stripFrontmatter(fs.readFileSync(file, 'utf8'));
  } catch (_err) {
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. MAIN
// ─────────────────────────────────────────────────────────────────────────────

function main() {
  const args = parseArgs(process.argv.slice(2));
  // Canonical + mirrors are optional now. When absent, the scanner operates
  // purely on the manifest contents (dynamic-mode friendly).
  const canonical = args.canonical || null;
  const mirrors = (args.mirrors || '').split(',').filter(Boolean);
  const output = args.output;
  const manifestPath = args.manifest;

  if (!output) {
    process.stderr.write('Usage: node check-mirror-drift.cjs --output=... [--canonical=...] [--mirrors=a,b,c] [--manifest=...]\n');
    process.exit(2);
  }

  const canonicalBody = canonical && fs.existsSync(canonical)
    ? stripFrontmatter(fs.readFileSync(canonical, 'utf8'))
    : null;
  const lines = ['# Mirror Drift Report', ''];
  if (canonical) {
    lines.push(`Canonical target: \`${canonical}\``);
    lines.push('');
  } else {
    lines.push('Canonical target: not specified (manifest-driven scan).');
    lines.push('');
  }

  const manifest = manifestPath && fs.existsSync(manifestPath) ? parseJsonc(manifestPath) : null;
  const declared = new Set();
  if (canonical) {
    declared.add(canonical);
  }
  for (const mirror of mirrors) {
    declared.add(mirror);
  }
  if (manifest) {
    for (const target of manifest.targets || []) {
      if (target?.path) {
        declared.add(target.path);
      }
    }
    for (const fixed of manifest.fixed || []) {
      declared.add(fixed);
    }
    for (const forbidden of manifest.forbidden || []) {
      declared.add(forbidden);
    }
  }

  lines.push('## Surface Coverage');
  lines.push('');
  lines.push(`- Declared surfaces: ${declared.size}`);
  lines.push(`- Manifest targets: ${(manifest?.targets || []).length}`);
  lines.push(`- Manifest fixed entries: ${(manifest?.fixed || []).length}`);
  lines.push(`- Manifest forbidden entries: ${(manifest?.forbidden || []).length}`);
  lines.push('');
  lines.push('## Declared Surfaces');
  lines.push('');
  if (declared.size === 0) {
    lines.push('- none');
  } else {
    for (const file of [...declared].sort()) {
      const exists = fs.existsSync(file) ? 'present' : 'missing';
      lines.push(`- \`${file}\` — ${exists}`);
    }
  }
  lines.push('');

  if (mirrors.length > 0) {
    lines.push('## Known Mirrors');
    lines.push('');
    for (const mirror of mirrors) {
      let status;
      const body = safeReadBody(mirror);
      if (body === null) {
        status = 'missing';
      } else if (canonicalBody) {
        // Generic similarity check: count shared non-trivial paragraphs.
        const canonicalChunks = canonicalBody
          .split(/\n\n+/)
          .map((chunk) => chunk.trim())
          .filter((chunk) => chunk.length > 40);
        const shared = canonicalChunks.filter((chunk) => body.includes(chunk)).length;
        status = shared >= 2 ? 'aligned-in-intent' : 'manual-review-required';
      } else {
        status = 'manual-review-required';
      }
      lines.push(`- \`${mirror}\`: ${status}`);
    }
    lines.push('');
  }

  lines.push('Policy: mirrors remain derived surfaces and are not experiment targets. ' +
    'All evaluation runs through dynamic mode; promotion requires explicit per-target approval.');
  fs.writeFileSync(output, `${lines.join('\n')}\n`, 'utf8');
}

main();
