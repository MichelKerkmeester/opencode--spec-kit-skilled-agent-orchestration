'use strict';

const fs = require('node:fs');
const path = require('node:path');

const REPO_ROOT = path.resolve(__dirname, '../../../../..');

const CATEGORY_ORDER = [
  {
    key: 'READMEs',
    heading: '## 1. READMEs',
    description: null,
  },
  {
    key: 'Documents',
    heading: '## 2. Documents',
    description: '> Long-form markdown artifacts that are not READMEs: guides, specs, references, install docs, catalogs, playbooks.',
  },
  {
    key: 'Commands',
    heading: '## 3. Commands',
    description: '> `.opencode/command/**` and any runtime-specific command surfaces.',
  },
  {
    key: 'Agents',
    heading: '## 4. Agents',
    description: '> `.opencode/agent/**`, `.claude/agents/**`, `.codex/agents/**`, `.gemini/agents/**`.',
  },
  {
    key: 'Skills',
    heading: '## 5. Skills',
    description: '> `.opencode/skill/**` including `SKILL.md`, `references/`, `assets/`, `feature_catalog/`, `manual_testing_playbook/`, `scripts/`, `shared/`, `mcp_server/`.',
  },
  {
    key: 'Specs',
    heading: '## 6. Specs',
    description: '> `.opencode/specs/**` and `specs/**`. Takes precedence over `Config` for spec-folder JSON metadata.',
  },
  {
    key: 'Scripts',
    heading: '## 7. Scripts',
    description: '> Executable or build/test scripts: `.sh`, `.js`, `.ts`, `.mjs`, `.cjs`, `.py`.',
  },
  {
    key: 'Tests',
    heading: '## 8. Tests',
    description: '> Test files, fixtures, and snapshots. Tests take precedence over `Scripts`.',
  },
  {
    key: 'Config',
    heading: '## 9. Config',
    description: '> Machine-readable configuration: `.json`, `.jsonc`, `.yaml`, `.yml`, `.toml`, `.env.example`.',
  },
  {
    key: 'Meta',
    heading: '## 10. Meta',
    description: '> Repository-wide governance artifacts such as `AGENTS.md`, `CLAUDE.md`, `CODEX.md`, `GEMINI.md`, `LICENSE`, and root `README.md`.',
  },
];

const CATEGORY_KEYS = new Set(CATEGORY_ORDER.map((category) => category.key));
const SEVERITY_KEYS = ['P0', 'P1', 'P2'];
const META_BASENAMES = new Set([
  'AGENTS.md',
  'CLAUDE.md',
  'CODEX.md',
  'GEMINI.md',
  'LICENSE',
  'LICENSE.md',
  'CHANGELOG.md',
  'CHANGELOG',
]);
const SCRIPT_EXTENSIONS = new Set(['.sh', '.js', '.ts', '.mjs', '.cjs', '.py']);
const CONFIG_EXTENSIONS = new Set(['.json', '.jsonc', '.yaml', '.yml', '.toml']);

function emitResourceMap({ shape, deltas, packet, scope, createdAt }) {
  const normalizedShape = normalizeShape(shape);
  const normalizedDeltas = Array.isArray(deltas) ? deltas : [];
  const generatedAt = normalizeText(createdAt) || new Date().toISOString();
  const packetSummary = normalizePacket(packet);
  const normalizedScope = normalizeText(scope)
    || `${normalizedShape} evidence aggregated for ${packetSummary.scopeHint}`;

  const normalizedEntries = normalizedShape === 'review'
    ? normalizeReviewEntries(normalizedDeltas)
    : normalizeResearchEntries(normalizedDeltas);

  const rowsByCategory = new Map(CATEGORY_ORDER.map((category) => [category.key, []]));
  let missingOnDisk = 0;

  for (const entry of normalizedEntries.entries) {
    const categoryKey = classifyPath(entry.path);
    if (!CATEGORY_KEYS.has(categoryKey)) {
      throw new Error(`Unknown resource-map category: ${categoryKey}`);
    }
    rowsByCategory.get(categoryKey).push({
      path: entry.path,
      action: entry.action,
      status: entry.status,
      note: entry.note,
    });
    if (entry.status === 'MISSING') {
      missingOnDisk += 1;
    }
  }

  const countsByCategory = Object.fromEntries(
    CATEGORY_ORDER.map((category) => [category.key, rowsByCategory.get(category.key).length]),
  );

  const lines = [
    '---',
    `title: "Resource Map${packetSummary.title ? ` — ${escapeFrontmatter(packetSummary.title)}` : ''}"`,
    `description: "Auto-generated ${normalizedShape} resource map from convergence evidence."`,
    '---',
    '# Resource Map',
    '',
    '<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->',
    '',
    '---',
    '',
    '## Summary',
    '',
    `- **Total references**: ${normalizedEntries.entries.length}`,
    `- **By category**: READMEs=${countsByCategory.READMEs}, Documents=${countsByCategory.Documents}, Commands=${countsByCategory.Commands}, Agents=${countsByCategory.Agents}, Skills=${countsByCategory.Skills}, Specs=${countsByCategory.Specs}, Scripts=${countsByCategory.Scripts}, Tests=${countsByCategory.Tests}, Config=${countsByCategory.Config}, Meta=${countsByCategory.Meta}`,
    `- **Missing on disk**: ${missingOnDisk}`,
    `- **Scope**: ${normalizedScope}`,
    `- **Generated**: ${generatedAt}`,
  ];

  if (normalizedEntries.degradedCount > 0) {
    lines.push('- **Degraded**: true');
    lines.push(`- **Degraded rows skipped**: ${normalizedEntries.degradedCount}`);
  }

  lines.push(
    '',
    '> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.',
    '> **Status vocabulary**: `OK` · `MISSING` · `PLANNED`.',
    '',
  );

  for (const category of CATEGORY_ORDER) {
    const rows = rowsByCategory.get(category.key)
      .slice()
      .sort((left, right) => left.path.localeCompare(right.path, undefined, { numeric: true }));
    if (!rows.length) {
      continue;
    }
    lines.push(category.heading);
    lines.push('');
    if (category.description) {
      lines.push(category.description);
      lines.push('');
    }
    lines.push('| Path | Action | Status | Note |');
    lines.push('|------|--------|--------|------|');
    for (const row of rows) {
      lines.push(
        `| ${escapeTableCell(row.path)} | ${escapeTableCell(row.action)} | ${escapeTableCell(row.status)} | ${escapeTableCell(row.note)} |`,
      );
    }
    lines.push('');
    lines.push('---');
    lines.push('');
  }

  if (lines[lines.length - 1] === '') {
    lines.pop();
  }

  return `${lines.join('\n')}\n`;
}

function normalizeShape(shape) {
  if (shape === 'review' || shape === 'research') {
    return shape;
  }
  throw new Error(`emitResourceMap expected shape 'review' or 'research', received '${String(shape)}'`);
}

function normalizePacket(packet) {
  if (!packet || typeof packet !== 'object') {
    return {
      title: '',
      scopeHint: 'the current packet',
    };
  }

  const title = normalizeText(packet.title || packet.name || packet.packet || packet.packetId || '');
  const scopeHint = normalizeText(packet.scope || packet.specFolder || packet.packet || title || 'the current packet');
  return {
    title,
    scopeHint,
  };
}

function normalizeReviewEntries(deltas) {
  const flattened = flattenRecords(deltas);
  const files = new Map();
  const findings = new Map();
  let degradedCount = flattened.degradedCount;

  for (let index = 0; index < flattened.records.length; index += 1) {
    const record = flattened.records[index];
    if (!record || typeof record !== 'object' || Array.isArray(record)) {
      degradedCount += 1;
      continue;
    }

    const iteration = coerceIteration(record, index + 1);
    const referencedFiles = collectCandidatePaths([
      record.file,
      record.path,
      record.filePath,
      record.source_path,
      record.sourcePath,
      record.target,
    ]);

    for (const filePath of referencedFiles) {
      ensureFileEntry(files, filePath).iterations.add(iteration);
    }

    const findingId = normalizeText(
      record.finding_id
      || record.findingId
      || record.id
      || record.finding
      || '',
    );
    if (!findingId) {
      continue;
    }

    const filePath = referencedFiles[0] || findings.get(findingId)?.path || null;
    if (!filePath) {
      continue;
    }

    const severity = normalizeSeverity(
      record.severity_after
      || record.severityAfter
      || record.severity
      || record.finalSeverity
      || '',
    );

    findings.set(findingId, {
      path: filePath,
      severity,
      iteration,
      order: index,
    });
  }

  for (const finding of findings.values()) {
    if (!finding || !finding.path) {
      continue;
    }
    const entry = ensureFileEntry(files, finding.path);
    entry.iterations.add(finding.iteration);
    if (finding.severity) {
      entry.findings[finding.severity] += 1;
    }
  }

  return {
    degradedCount,
    entries: Array.from(files.values()).map((entry) => ({
      path: entry.path,
      action: hasFindings(entry.findings) ? 'Analyzed' : 'Validated',
      status: determineStatus(entry.path),
      note: [
        `Findings P0=${entry.findings.P0} P1=${entry.findings.P1} P2=${entry.findings.P2}`,
        `Iterations=${entry.iterations.size}`,
      ].join('; '),
    })),
  };
}

function normalizeResearchEntries(deltas) {
  const flattened = flattenRecords(deltas);
  const files = new Map();
  let degradedCount = flattened.degradedCount;

  for (let index = 0; index < flattened.records.length; index += 1) {
    const record = flattened.records[index];
    if (!record || typeof record !== 'object' || Array.isArray(record)) {
      degradedCount += 1;
      continue;
    }

    const iteration = coerceIteration(record, index + 1);
    const referencedPaths = collectCandidatePaths([
      record.file,
      record.path,
      record.source_path,
      record.sourcePath,
      ...(Array.isArray(record.source_paths) ? record.source_paths : []),
      ...(Array.isArray(record.sourcePaths) ? record.sourcePaths : []),
      ...extractCitationPaths(record.citations),
      ...extractCitationPaths(record.sources),
    ]);

    for (const filePath of referencedPaths) {
      const entry = ensureResearchEntry(files, filePath);
      entry.iterations.add(iteration);
    }
  }

  return {
    degradedCount,
    entries: Array.from(files.values()).map((entry) => ({
      path: entry.path,
      action: 'Cited',
      status: determineStatus(entry.path),
      note: `Citations=${entry.iterations.size}; Iterations=${entry.iterations.size}`,
    })),
  };
}

function flattenRecords(deltas) {
  const records = [];
  let degradedCount = 0;

  for (const delta of deltas) {
    if (Array.isArray(delta)) {
      records.push(...delta);
      continue;
    }
    if (!delta || typeof delta !== 'object') {
      degradedCount += 1;
      continue;
    }
    if (Array.isArray(delta.records)) {
      records.push(...delta.records);
      continue;
    }
    if (Array.isArray(delta.events)) {
      records.push(...delta.events);
      continue;
    }
    records.push(delta);
  }

  return { records, degradedCount };
}

function collectCandidatePaths(values) {
  const unique = new Set();
  const results = [];

  for (const value of values) {
    if (Array.isArray(value)) {
      for (const nested of collectCandidatePaths(value)) {
        if (!unique.has(nested)) {
          unique.add(nested);
          results.push(nested);
        }
      }
      continue;
    }
    const candidate = normalizePathCandidate(value);
    if (!candidate || unique.has(candidate)) {
      continue;
    }
    unique.add(candidate);
    results.push(candidate);
  }

  return results;
}

function extractCitationPaths(citations) {
  if (!Array.isArray(citations)) {
    return [];
  }

  return citations.flatMap((citation) => {
    if (typeof citation === 'string') {
      return [citation];
    }
    if (!citation || typeof citation !== 'object') {
      return [];
    }
    return [
      citation.path,
      citation.file,
      citation.filePath,
      citation.sourcePath,
      citation.source_path,
    ];
  });
}

function normalizePathCandidate(value) {
  const normalized = normalizeText(value);
  if (!normalized) {
    return null;
  }
  if (/^https?:\/\//i.test(normalized)) {
    return null;
  }
  if (
    !normalized.includes('/')
    && !normalized.includes('\\')
    && !normalized.includes('.')
    && !/^[A-Z0-9_-]+$/i.test(normalized)
  ) {
    return null;
  }

  const normalizedPath = path.posix.normalize(normalized.replace(/\\/g, '/').replace(/^\.\/+/, ''));
  if (normalizedPath === '..' || normalizedPath.startsWith('../')) {
    return null;
  }
  // Strip trailing `:NNN` or `:NNN-NNN` line anchor — review deltas carry
  // `file: "path:line"` per the prompt-pack contract, and the suffix would
  // otherwise make the existence check chase a nonexistent path.
  return normalizedPath.replace(/^\.\/+/, '').replace(/:\d+(?:-\d+)?$/, '');
}

function ensureFileEntry(map, filePath) {
  if (!map.has(filePath)) {
    map.set(filePath, {
      path: filePath,
      iterations: new Set(),
      findings: { P0: 0, P1: 0, P2: 0 },
    });
  }
  return map.get(filePath);
}

function ensureResearchEntry(map, filePath) {
  if (!map.has(filePath)) {
    map.set(filePath, {
      path: filePath,
      iterations: new Set(),
    });
  }
  return map.get(filePath);
}

function hasFindings(findings) {
  return SEVERITY_KEYS.some((severity) => findings[severity] > 0);
}

function coerceIteration(record, fallback) {
  const numeric = Number(record.iteration ?? record.run ?? fallback);
  return Number.isFinite(numeric) && numeric > 0 ? numeric : fallback;
}

function normalizeSeverity(value) {
  const normalized = normalizeText(value).toUpperCase();
  return SEVERITY_KEYS.includes(normalized) ? normalized : null;
}

function determineStatus(resourcePath) {
  const candidatePath = path.isAbsolute(resourcePath)
    ? resourcePath
    : path.resolve(REPO_ROOT, resourcePath);
  return fs.existsSync(candidatePath) ? 'OK' : 'MISSING';
}

function classifyPath(resourcePath) {
  const normalized = String(resourcePath).replace(/\\/g, '/').replace(/^\.\/+/, '');
  const basename = path.posix.basename(normalized);
  const extension = path.posix.extname(normalized).toLowerCase();

  if (
    META_BASENAMES.has(basename)
    || normalized === 'README.md'
  ) {
    return 'Meta';
  }

  if (normalized.startsWith('.opencode/command/')) {
    return 'Commands';
  }

  if (
    normalized.startsWith('.opencode/agent/')
    || normalized.startsWith('.claude/agents/')
    || normalized.startsWith('.codex/agents/')
    || normalized.startsWith('.gemini/agents/')
  ) {
    return 'Agents';
  }

  if (normalized.startsWith('.opencode/skill/')) {
    return 'Skills';
  }

  if (normalized.startsWith('.opencode/specs/') || normalized.startsWith('specs/')) {
    return 'Specs';
  }

  if (/^README(?:\.[^.]+)?\.md$/i.test(basename) || /^README$/i.test(basename)) {
    return 'READMEs';
  }

  if (isTestPath(normalized)) {
    return 'Tests';
  }

  if (SCRIPT_EXTENSIONS.has(extension)) {
    return 'Scripts';
  }

  if (
    CONFIG_EXTENSIONS.has(extension)
    || basename === '.env'
    || basename.endsWith('.env.example')
    || basename.endsWith('.env.sample')
  ) {
    return 'Config';
  }

  if (extension === '.md') {
    return 'Documents';
  }

  return 'Documents';
}

function isTestPath(resourcePath) {
  if (resourcePath.includes('/tests/') || resourcePath.includes('/__tests__/')) {
    return true;
  }
  return /\.(vitest|test|spec)\.[^/]+$/i.test(resourcePath);
}

function escapeTableCell(value) {
  return String(value || '').replace(/\|/g, '\\|');
}

function escapeFrontmatter(value) {
  return String(value || '').replace(/"/g, '\\"');
}

function normalizeText(value) {
  if (value === null || value === undefined) {
    return '';
  }
  return String(value).replace(/\s+/g, ' ').trim();
}

module.exports = {
  emitResourceMap,
};
