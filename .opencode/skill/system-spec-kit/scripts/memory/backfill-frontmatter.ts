#!/usr/bin/env node
// ---------------------------------------------------------------
// MODULE: Backfill Frontmatter
// ---------------------------------------------------------------
// ───────────────────────────────────────────────────────────────
// 1. BACKFILL FRONTMATTER
// ───────────────────────────────────────────────────────────────
// Bulk normalizes markdown frontmatter for templates, spec docs, and memories.

import * as fs from 'fs';
import * as path from 'path';
import {
  buildFrontmatterContent,
  classifyDocument,
  SPEC_DOC_BASENAMES,
  type ClassifiedDocument,
} from '../lib/frontmatter-migration';

/* ───────────────────────────────────────────────────────────────
   1. TYPES
------------------------------------------------------------------*/

interface CliOptions {
  dryRun: boolean;
  apply: boolean;
  includeArchive: boolean;
  skipTemplates: boolean;
  allowMalformed: boolean;
  roots: string[];
  reportPath: string | null;
}

interface ChangeEntry {
  filePath: string;
  kind: string;
  documentType: string;
  title: string;
  hadFrontmatter: boolean;
}

interface FailureEntry {
  filePath: string;
  error: string;
  category?: 'error' | 'malformed_frontmatter';
}

interface SkippedDirEntry {
  dirPath: string;
  error: string;
}

interface MigrationReport {
  generatedAt: string;
  mode: 'dry-run' | 'apply';
  options: {
    includeArchive: boolean;
    skipTemplates: boolean;
    allowMalformed: boolean;
    roots: string[];
  };
  summary: {
    total: number;
    changed: number;
    unchanged: number;
    failed: number;
    malformedSkipped: number;
    skippedDirs: number;
  };
  byKind: Record<string, { total: number; changed: number }>;
  changedFiles: ChangeEntry[];
  failedFiles: FailureEntry[];
  skippedDirs: SkippedDirEntry[];
}

/* ───────────────────────────────────────────────────────────────
   2. CONSTANTS
------------------------------------------------------------------*/

function resolveProjectRoot(): string {
  const candidates = [
    path.resolve(__dirname, '../../../../../..'),
    path.resolve(__dirname, '../../../..'),
    process.cwd(),
  ];

  for (const candidate of candidates) {
    const templates = path.join(candidate, '.opencode', 'skill', 'system-spec-kit', 'templates');
    if (fs.existsSync(templates)) {
      return candidate;
    }
  }

  return candidates[0];
}

const PROJECT_ROOT = resolveProjectRoot();
const TEMPLATES_ROOT = path.join(PROJECT_ROOT, '.opencode', 'skill', 'system-spec-kit', 'templates');

const HELP_TEXT = `
backfill-frontmatter — Normalize markdown frontmatter for templates/spec docs/memory files

Usage:
  node backfill-frontmatter.js [options]

Required mode:
  --dry-run            Preview changes (default if --apply is omitted)
  --apply              Apply changes in-place

Options:
  --roots <paths>      Comma-separated specs root paths (default: auto-discover all dirs named "specs")
  --include-archive    Include z_archive trees (default: excluded)
  --skip-templates     Skip templates root processing
  --allow-malformed    Continue without failing when malformed frontmatter is detected
  --report <path>      Write JSON report to file
  --help, -h           Show this help message

Examples:
  node backfill-frontmatter.js --dry-run --include-archive
  node backfill-frontmatter.js --apply --roots .opencode/specs,specs --report /tmp/frontmatter-report.json
`;

/* ───────────────────────────────────────────────────────────────
   3. ARG PARSING
------------------------------------------------------------------*/

function parseArgs(argv: string[]): CliOptions {
  let dryRun = true;
  let apply = false;
  let includeArchive = false;
  let skipTemplates = false;
  let allowMalformed = false;
  let roots: string[] = [];
  let reportPath: string | null = null;

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];

    if (arg === '--help' || arg === '-h') {
      console.log(HELP_TEXT);
      process.exit(0);
    }

    if (arg === '--dry-run') {
      dryRun = true;
      apply = false;
      continue;
    }

    if (arg === '--apply') {
      apply = true;
      dryRun = false;
      continue;
    }

    if (arg === '--include-archive') {
      includeArchive = true;
      continue;
    }

    if (arg === '--skip-templates') {
      skipTemplates = true;
      continue;
    }

    if (arg === '--allow-malformed') {
      allowMalformed = true;
      continue;
    }

    if (arg === '--roots') {
      const value = argv[i + 1];
      if (!value || value.startsWith('--')) {
        throw new Error('--roots requires a comma-separated value');
      }
      i += 1;
      roots = value
        .split(',')
        .map((entry) => entry.trim())
        .filter((entry) => entry.length > 0)
        .map((entry) => {
          const resolved = path.resolve(PROJECT_ROOT, entry);
          const relative = path.relative(PROJECT_ROOT, resolved);
          if (relative.startsWith('..') || path.isAbsolute(relative)) {
            throw new Error(`Path ${entry} is outside project boundary`);
          }
          return resolved;
        });
      continue;
    }

    if (arg === '--report') {
      const value = argv[i + 1];
      if (!value || value.startsWith('--')) {
        throw new Error('--report requires a file path');
      }
      i += 1;
      const resolvedReport = path.resolve(PROJECT_ROOT, value);
      const relative = path.relative(PROJECT_ROOT, resolvedReport);
      if (relative.startsWith('..') || path.isAbsolute(relative)) {
        throw new Error(`Path ${value} is outside project boundary`);
      }
      reportPath = resolvedReport;
      continue;
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  return {
    dryRun,
    apply,
    includeArchive,
    skipTemplates,
    allowMalformed,
    roots,
    reportPath,
  };
}

/* ───────────────────────────────────────────────────────────────
   4. DISCOVERY
------------------------------------------------------------------*/

function normalizePath(filePath: string): string {
  return filePath.replace(/\\/g, '/');
}

function recordSkippedDir(skippedDirs: SkippedDirEntry[], dirPath: string, error: unknown): void {
  const message = error instanceof Error ? error.message : String(error);
  skippedDirs.push({
    dirPath,
    error: message,
  });
}

function discoverSpecsRoots(baseDir: string, skippedDirs: SkippedDirEntry[] = []): string[] {
  const roots: string[] = [];
  const queue: string[] = [baseDir];

  const skipDirs = new Set([
    '.git',
    '.next',
    '.turbo',
    'node_modules',
    'dist',
    'build',
    '.cache',
    '.pytest_cache',
  ]);

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current) {
      continue;
    }

    let entries: fs.Dirent[] = [];
    try {
      entries = fs.readdirSync(current, { withFileTypes: true });
    } catch (error: unknown) {
      recordSkippedDir(skippedDirs, current, error);
      continue;
    }

    for (const entry of entries) {
      if (!entry.isDirectory()) {
        continue;
      }

      if (skipDirs.has(entry.name)) {
        continue;
      }

      const fullPath = path.join(current, entry.name);
      if (entry.name === 'specs') {
        roots.push(fullPath);
        continue;
      }

      queue.push(fullPath);
    }
  }

  const deduped = new Map<string, string>();
  for (const root of roots) {
    try {
      const realPath = fs.realpathSync(root);
      if (!deduped.has(realPath)) {
        deduped.set(realPath, root);
      }
    } catch (error: unknown) {
      if (error instanceof Error && !deduped.has(root)) {
        deduped.set(root, root);
        continue;
      }
      if (!deduped.has(root)) {
        deduped.set(root, root);
      }
    }
  }

  return Array.from(deduped.values()).sort();
}

function collectTemplateFiles(rootPath: string, skippedDirs: SkippedDirEntry[] = []): string[] {
  if (!fs.existsSync(rootPath)) {
    return [];
  }

  const files: string[] = [];
  const queue: string[] = [rootPath];

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current) {
      continue;
    }

    let entries: fs.Dirent[] = [];
    try {
      entries = fs.readdirSync(current, { withFileTypes: true });
    } catch (error: unknown) {
      recordSkippedDir(skippedDirs, current, error);
      continue;
    }

    for (const entry of entries) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        queue.push(fullPath);
        continue;
      }

      if (entry.isFile() && entry.name.toLowerCase().endsWith('.md')) {
        files.push(fullPath);
      }
    }
  }

  return files.sort();
}

function collectSpecFiles(rootPath: string, includeArchive: boolean, skippedDirs: SkippedDirEntry[] = []): string[] {
  if (!fs.existsSync(rootPath)) {
    return [];
  }

  const files: string[] = [];
  const queue: string[] = [rootPath];

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current) {
      continue;
    }

    let entries: fs.Dirent[] = [];
    try {
      entries = fs.readdirSync(current, { withFileTypes: true });
    } catch (error: unknown) {
      recordSkippedDir(skippedDirs, current, error);
      continue;
    }

    for (const entry of entries) {
      const fullPath = path.join(current, entry.name);
      const normalized = normalizePath(fullPath);

      if (entry.isDirectory()) {
        if (!includeArchive && normalized.includes('/z_archive/')) {
          continue;
        }

        queue.push(fullPath);
        continue;
      }

      if (!entry.isFile() || !entry.name.toLowerCase().endsWith('.md')) {
        continue;
      }

      const lowerName = entry.name.toLowerCase();
      if (normalized.includes('/memory/')) {
        files.push(fullPath);
        continue;
      }

      if (SPEC_DOC_BASENAMES.has(lowerName)) {
        files.push(fullPath);
      }
    }
  }

  return files.sort();
}

/* ───────────────────────────────────────────────────────────────
   5. MIGRATION
------------------------------------------------------------------*/

function initializeReport(options: CliOptions): MigrationReport {
  return {
    generatedAt: new Date().toISOString(),
    mode: options.apply ? 'apply' : 'dry-run',
    options: {
      includeArchive: options.includeArchive,
      skipTemplates: options.skipTemplates,
      allowMalformed: options.allowMalformed,
      roots: options.roots,
    },
    summary: {
      total: 0,
      changed: 0,
      unchanged: 0,
      failed: 0,
      malformedSkipped: 0,
      skippedDirs: 0,
    },
    byKind: {},
    changedFiles: [],
    failedFiles: [],
    skippedDirs: [],
  };
}

function addKindCounters(
  report: MigrationReport,
  classification: ClassifiedDocument,
  changed: boolean
): void {
  const key = `${classification.kind}:${classification.documentType}`;
  if (!report.byKind[key]) {
    report.byKind[key] = { total: 0, changed: 0 };
  }
  report.byKind[key].total += 1;
  if (changed) {
    report.byKind[key].changed += 1;
  }
}

function writeReport(report: MigrationReport, reportPath: string): void {
  const dir = path.dirname(reportPath);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf-8');
}

function printSummary(report: MigrationReport): void {
  console.log('\n=== Frontmatter Migration Summary ===');
  console.log(`Mode:      ${report.mode}`);
  console.log(`Total:     ${report.summary.total}`);
  console.log(`Changed:   ${report.summary.changed}`);
  console.log(`Unchanged: ${report.summary.unchanged}`);
  console.log(`Failed:    ${report.summary.failed}`);
  console.log(`Malformed: ${report.summary.malformedSkipped}`);
  console.log(`Skipped:   ${report.summary.skippedDirs}`);

  console.log('\nBy kind:');
  const keys = Object.keys(report.byKind).sort();
  for (const key of keys) {
    const bucket = report.byKind[key];
    console.log(`  ${key} -> ${bucket.changed}/${bucket.total} changed`);
  }

  if (report.summary.failed > 0) {
    console.log('\nFailures:');
    for (const failed of report.failedFiles.slice(0, 20)) {
      console.log(`  ${failed.filePath}`);
      console.log(`    ${failed.error}`);
    }
    if (report.failedFiles.length > 20) {
      console.log(`  ... and ${report.failedFiles.length - 20} more`);
    }
  }

  if (report.summary.skippedDirs > 0) {
    console.log('\nSkipped directories:');
    for (const skipped of report.skippedDirs.slice(0, 20)) {
      console.log(`  ${skipped.dirPath}`);
      console.log(`    ${skipped.error}`);
    }
    if (report.skippedDirs.length > 20) {
      console.log(`  ... and ${report.skippedDirs.length - 20} more`);
    }
  }
}

function run(): void {
  const options = parseArgs(process.argv.slice(2));
  const skippedDirs: SkippedDirEntry[] = [];

  const roots = options.roots.length > 0
    ? options.roots
    : discoverSpecsRoots(PROJECT_ROOT, skippedDirs);

  options.roots = roots;

  if (!options.skipTemplates && !fs.existsSync(TEMPLATES_ROOT)) {
    throw new Error(`Templates root not found: ${TEMPLATES_ROOT}`);
  }

  const allTargets: string[] = [];

  if (!options.skipTemplates) {
    allTargets.push(...collectTemplateFiles(TEMPLATES_ROOT, skippedDirs));
  }

  for (const root of roots) {
    allTargets.push(...collectSpecFiles(root, options.includeArchive, skippedDirs));
  }

  const deduped = Array.from(new Set(allTargets.map((entry) => path.resolve(entry)))).sort();

  const report = initializeReport(options);
  report.skippedDirs.push(...skippedDirs);
  report.summary.skippedDirs = report.skippedDirs.length;

  for (const filePath of deduped) {
    report.summary.total += 1;

    let originalContent = '';
    try {
      originalContent = fs.readFileSync(filePath, 'utf-8');

      const result = buildFrontmatterContent(
        originalContent,
        { templatesRoot: TEMPLATES_ROOT },
        filePath
      );

      if (result.malformedFrontmatter) {
        report.summary.malformedSkipped += 1;
        const reason = result.malformedReason || 'Malformed frontmatter detected';

        if (options.allowMalformed) {
          report.summary.unchanged += 1;
        } else {
          report.summary.failed += 1;
          report.failedFiles.push({
            filePath,
            error: reason,
            category: 'malformed_frontmatter',
          });
        }

        continue;
      }

      addKindCounters(report, result.classification, result.changed);

      if (result.changed) {
        report.summary.changed += 1;
        report.changedFiles.push({
          filePath,
          kind: result.classification.kind,
          documentType: result.classification.documentType,
          title: result.managed.title,
          hadFrontmatter: result.hadFrontmatter,
        });

        if (options.apply) {
          fs.writeFileSync(filePath, result.content, 'utf-8');
        }
      } else {
        report.summary.unchanged += 1;
      }
    } catch (error: unknown) {
      report.summary.failed += 1;
      const message = error instanceof Error ? error.message : String(error);
      report.failedFiles.push({ filePath, error: message });
    }
  }

  printSummary(report);

  if (options.reportPath) {
    writeReport(report, options.reportPath);
    console.log(`\nReport: ${options.reportPath}`);
  }

  if (report.summary.failed > 0) {
    process.exit(1);
  }
}

if (require.main === module) {
  try {
    run();
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[backfill-frontmatter] ${message}`);
    process.exit(1);
  }
}

export { run, parseArgs, discoverSpecsRoots, collectSpecFiles, collectTemplateFiles, classifyDocument };
