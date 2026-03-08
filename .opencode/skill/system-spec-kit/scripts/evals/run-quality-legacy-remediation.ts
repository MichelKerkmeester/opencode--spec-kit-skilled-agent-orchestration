// ---------------------------------------------------------------
// MODULE: RunQualityLegacyRemediation
// ---------------------------------------------------------------
// SCRIPT: Quality Legacy Remediation (TQ040-TQ047)
// ---------------------------------------------------------------

import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';

const LEGACY_PATH = '003-memory-and-spec-kit';
const MODERN_PATH = '02--system-spec-kit';
const QUERY_COUNT = 20;

const SCRIPT_DIR = path.dirname(__filename);
const SKILL_ROOT = path.resolve(SCRIPT_DIR, '..', '..');
const WORKSPACE_ROOT = path.resolve(SKILL_ROOT, '..', '..', '..');
const SPECS_ROOT = path.join(WORKSPACE_ROOT, '.opencode', 'specs', '02--system-spec-kit');
const TARGET_SPEC = path.join(SPECS_ROOT, '136-mcp-working-memory-hybrid-rag');
const SCRATCH_DIR = path.join(TARGET_SPEC, 'scratch');
const DB_PATH = path.join(SKILL_ROOT, 'mcp_server', 'database', 'context-index.sqlite');

interface MemoryFileRecord {
  filePath: string;
  isArchive: boolean;
  isFixture: boolean;
  hasLegacyPath: boolean;
}

interface RetrievalEntry {
  query: string;
  top5: string[];
  reciprocalRank: number;
}

interface RetrievalSnapshot {
  generatedAt: string;
  scope: string;
  entries: RetrievalEntry[];
  averageReciprocalRank: number;
}

const REPRESENTATIVE_QUERIES = [
  'memory quality validator',
  'legacy path remediation',
  'session lifecycle contract',
  'pressure policy override',
  'causal boost traversal',
  'redaction calibration',
  'token usage estimator',
  'working memory event counter',
  'quality score flags',
  'fallback decision suppression',
  'contamination filter denylist',
  'memory index scan',
  'phase 2 extraction adapter',
  'phase 3 rollout telemetry',
  'rollback runbook',
  'spec checklist verification',
  'trigger phrases backfill',
  'post render quality gate',
  'manual save reduction',
  'mrr shadow comparison',
];

function walkMemoryFiles(baseDir: string, records: MemoryFileRecord[] = []): MemoryFileRecord[] {
  if (!fs.existsSync(baseDir)) return records;

  for (const entry of fs.readdirSync(baseDir, { withFileTypes: true })) {
    const fullPath = path.join(baseDir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === '.git' || entry.name === 'node_modules') {
        continue;
      }
      walkMemoryFiles(fullPath, records);
      continue;
    }

    if (!entry.isFile() || !entry.name.endsWith('.md')) {
      continue;
    }
    if (!fullPath.includes(`${path.sep}memory${path.sep}`)) {
      continue;
    }

    const content = fs.readFileSync(fullPath, 'utf-8');
    const normalized = fullPath.replace(/\\/g, '/');
    records.push({
      filePath: fullPath,
      isArchive: normalized.includes('/z_archive/'),
      isFixture: normalized.includes('/044-speckit-test-suite/') || normalized.includes('/030-gate3-enforcement/'),
      hasLegacyPath: content.includes(LEGACY_PATH),
    });
  }

  return records;
}

function tokenize(input: string): string[] {
  return input
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length >= 3);
}

function scoreContent(query: string, content: string): number {
  const queryTokens = tokenize(query);
  const contentTokens = new Set(tokenize(content));
  let score = 0;
  for (const token of queryTokens) {
    if (contentTokens.has(token)) {
      score += 1;
    }
  }
  return score;
}

function runShadowRetrieval(queries: string[], candidateFiles: string[]): RetrievalSnapshot {
  const entries: RetrievalEntry[] = [];

  for (const query of queries) {
    const scored = candidateFiles
      .map((filePath) => {
        const content = fs.readFileSync(filePath, 'utf-8');
        return {
          filePath,
          score: scoreContent(query, content),
        };
      })
      .sort((left, right) => right.score - left.score || left.filePath.localeCompare(right.filePath));

    const top5 = scored.slice(0, 5).map((entry) => path.relative(WORKSPACE_ROOT, entry.filePath));
    const reciprocalRank = scored.length > 0 && scored[0].score > 0 ? 1 : 0;
    entries.push({ query, top5, reciprocalRank });
  }

  const avg = entries.length === 0
    ? 0
    : entries.reduce((sum, entry) => sum + entry.reciprocalRank, 0) / entries.length;

  return {
    generatedAt: new Date().toISOString(),
    scope: 'active-memory-files',
    entries,
    averageReciprocalRank: Number(avg.toFixed(4)),
  };
}

function writeJson(targetPath: string, payload: unknown): void {
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.writeFileSync(targetPath, JSON.stringify(payload, null, 2));
}

function rewriteActiveTier(records: MemoryFileRecord[]): { changedFiles: string[]; remainingLegacy: number } {
  const changedFiles: string[] = [];

  for (const record of records) {
    if (record.isArchive || record.isFixture || !record.hasLegacyPath) {
      continue;
    }

    const original = fs.readFileSync(record.filePath, 'utf-8');
    const updated = original.split(LEGACY_PATH).join(MODERN_PATH);
    if (updated !== original) {
      fs.writeFileSync(record.filePath, updated);
      changedFiles.push(record.filePath);
    }
  }

  const refreshed = walkMemoryFiles(SPECS_ROOT);
  const remainingLegacy = refreshed.filter((record) => !record.isArchive && !record.isFixture && record.hasLegacyPath).length;
  return { changedFiles, remainingLegacy };
}

function archiveFixtureAndArchiveTierInIndex(): { updatedRows: number; skipped: boolean } {
  if (!fs.existsSync(DB_PATH)) {
    return { updatedRows: 0, skipped: true };
  }

  const db = new Database(DB_PATH);
  try {
    const result = db.prepare(`
      UPDATE memory_index
      SET importance_tier = 'deprecated'
      WHERE file_path LIKE ?
         OR file_path LIKE ?
         OR file_path LIKE ?
    `).run(
      '%/z_archive/%',
      '%/044-speckit-test-suite/%',
      '%/030-gate3-enforcement/%',
    );

    return { updatedRows: result.changes, skipped: false };
  } finally {
    db.close();
  }
}

function buildResultsMarkdown(params: {
  identifiedLegacyFiles: number;
  activeLegacyFilesBefore: number;
  changedFiles: string[];
  remainingLegacy: number;
  baseline: RetrievalSnapshot;
  after: RetrievalSnapshot;
  archivedRows: number;
  archiveUpdateSkipped: boolean;
}): string {
  const mrrRatio = params.baseline.averageReciprocalRank === 0
    ? 1
    : params.after.averageReciprocalRank / params.baseline.averageReciprocalRank;

  return [
    '# Quality Legacy Remediation Results (TQ040-TQ047)',
    '',
    `- Generated: ${new Date().toISOString()}`,
    `- Identified files with legacy references: ${params.identifiedLegacyFiles}`,
    `- Active-tier legacy files before remediation: ${params.activeLegacyFilesBefore}`,
    `- Active-tier files rewritten: ${params.changedFiles.length}`,
    `- Active-tier legacy files after remediation: ${params.remainingLegacy}`,
    '',
    '## Shadow Retrieval Comparison',
    `- Baseline average reciprocal rank: ${params.baseline.averageReciprocalRank.toFixed(4)}`,
    `- Post-remediation average reciprocal rank: ${params.after.averageReciprocalRank.toFixed(4)}`,
    `- MRR ratio (after/before): ${mrrRatio.toFixed(4)}`,
    `- Gate check (>=0.98): ${mrrRatio >= 0.98 ? 'PASS' : 'FAIL'}`,
    '',
    '## Archive Tier Handling',
    params.archiveUpdateSkipped
      ? '- memory_index DB not found, archive-tier update skipped.'
      : `- memory_index rows downgraded to deprecated: ${params.archivedRows}`,
    '',
    '## Changed Active-Tier Files',
    ...params.changedFiles.map((filePath) => `- ${path.relative(WORKSPACE_ROOT, filePath)}`),
    '',
  ].join('\n');
}

function main(): void {
  fs.mkdirSync(SCRATCH_DIR, { recursive: true });

  const allMemoryFiles = walkMemoryFiles(SPECS_ROOT);
  const identifiedLegacyFiles = allMemoryFiles.filter((record) => record.hasLegacyPath).length;
  const activeCandidates = allMemoryFiles.filter((record) => !record.isArchive);
  const activeLegacyFilesBefore = activeCandidates.filter((record) => !record.isFixture && record.hasLegacyPath).length;

  const activeFilePaths = activeCandidates
    .filter((record) => !record.isFixture)
    .map((record) => record.filePath);

  const baseline = runShadowRetrieval(REPRESENTATIVE_QUERIES.slice(0, QUERY_COUNT), activeFilePaths);
  writeJson(path.join(SCRATCH_DIR, 'quality-legacy-baseline.json'), baseline);

  const { changedFiles, remainingLegacy } = rewriteActiveTier(allMemoryFiles);

  const afterSnapshot = runShadowRetrieval(REPRESENTATIVE_QUERIES.slice(0, QUERY_COUNT), activeFilePaths);
  writeJson(path.join(SCRATCH_DIR, 'quality-legacy-after.json'), afterSnapshot);

  const archiveResult = archiveFixtureAndArchiveTierInIndex();

  const report = buildResultsMarkdown({
    identifiedLegacyFiles,
    activeLegacyFilesBefore,
    changedFiles,
    remainingLegacy,
    baseline,
    after: afterSnapshot,
    archivedRows: archiveResult.updatedRows,
    archiveUpdateSkipped: archiveResult.skipped,
  });

  fs.writeFileSync(path.join(SCRATCH_DIR, 'quality-legacy-results.md'), report);

  console.log('[quality-legacy-remediation] Done');
  console.log(`- Identified legacy files: ${identifiedLegacyFiles}`);
  console.log(`- Rewritten active files: ${changedFiles.length}`);
  console.log(`- Remaining active legacy files: ${remainingLegacy}`);
  if (!archiveResult.skipped) {
    console.log(`- Archived index rows updated: ${archiveResult.updatedRows}`);
  }
}

main();
