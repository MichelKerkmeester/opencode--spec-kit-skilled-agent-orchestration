#!/usr/bin/env node
// ---------------------------------------------------------------
// MODULE: Trigger Phrase Residual Migration
// ---------------------------------------------------------------
// One-time corpus migration for Phase 6 PR-13. This utility re-sanitizes
// historical memory trigger_phrases using the live sanitizer plus bounded
// canonicalization rules for stale residual cleanup.

import * as crypto from 'node:crypto';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';

import {
  detectFrontmatter,
  parseSectionValue,
} from '../lib/frontmatter-migration.js';
import {
  isAllowlistedShortProductName,
  sanitizeTriggerPhrase,
} from '../lib/trigger-phrase-sanitizer.js';
import { dirnameFromImportMeta, isMainModule } from '../lib/esm-entry.js';

const moduleDir = dirnameFromImportMeta(import.meta.url);

type MigrationMode = 'dry-run' | 'apply';
type RemovalReason = 'empty_or_invalid' | 'sanitizer' | 'canonical_duplicate' | 'title_overlap';

export interface MigrationCliOptions {
  mode: MigrationMode;
  scanRoots: string[];
  reportPath: string | null;
}

interface TriggerPhraseRemoval {
  phrase: string;
  reason: RemovalReason;
  sanitizerReason?: string;
  duplicateOf?: string;
  matchedTitlePhrase?: string;
}

export interface TriggerPhraseFileReport {
  filePath: string;
  title: string;
  changed: boolean;
  originalCount: number;
  finalCount: number;
  removedPhrases: string[];
  removedDetails: TriggerPhraseRemoval[];
  preservedUsefulAnchors: string[];
  beforeTriggerPhrases: string[];
  afterTriggerPhrases: string[];
  auditRecord: {
    beforeHash: string;
    afterHash: string;
  };
}

export interface TriggerPhraseMigrationReport {
  generatedAt: string;
  mode: MigrationMode;
  options: {
    scanRoots: string[];
    reportPath: string | null;
    safetyLimit: number;
    discoveredFiles: number;
    truncatedBySafetyLimit: boolean;
  };
  summary: {
    scannedFiles: number;
    changedFiles: number;
    unchangedFiles: number;
    skippedFiles: number;
    removedPhraseCount: number;
    preservedUsefulAnchorCount: number;
    removedByReason: Record<RemovalReason, number>;
  };
  files: TriggerPhraseFileReport[];
  skippedFiles: Array<{
    filePath: string;
    reason: string;
  }>;
}

interface MemoryParseResult {
  title: string;
  triggerPhrases: string[];
  rewrittenContent: string | null;
}

interface TriggerResolution {
  kept: string[];
  removed: TriggerPhraseRemoval[];
  preservedUsefulAnchors: string[];
}

const SAFETY_FILE_LIMIT = 200;
const HELP_TEXT = `
migrate-trigger-phrase-residual — Phase 6 PR-13 residual trigger cleanup

Usage:
  node migrate-trigger-phrase-residual.js [options]

Modes:
  --dry-run            Preview changes only (default)
  --apply              Rewrite trigger_phrases in-place with atomic writes

Options:
  --path <directory>   Limit scanning to a directory (repeatable)
  --report <output>    Write JSON report to a file
  --help, -h           Show this help text

Default scan roots:
  .opencode/specs
  ~/.claude/projects/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/memory
`;

function resolveProjectRoot(): string {
  const candidates = [
    path.resolve(moduleDir, '../../../../../..'),
    path.resolve(moduleDir, '../../../..'),
    process.cwd(),
  ];

  for (const candidate of candidates) {
    const skillRoot = path.join(candidate, '.opencode', 'skill', 'system-spec-kit');
    if (fs.existsSync(skillRoot)) {
      return candidate;
    }
  }

  return candidates[0];
}

const PROJECT_ROOT = resolveProjectRoot();
const LIVE_REPO_MEMORY_ROOT = path.join(PROJECT_ROOT, '.opencode', 'specs');
const GLOBAL_AUTO_MEMORY_ROOT = path.join(
  process.env.HOME || os.homedir(),
  '.claude',
  'projects',
  '-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public',
  'memory',
);
const TEMP_ROOT = path.resolve(os.tmpdir());

function normalizePath(filePath: string): string {
  return filePath.replace(/\\/g, '/');
}

function escapeRegex(value: string): string {
  return value.replace(/[|\\{}()[\]^$+?.]/g, '\\$&');
}

function normalizeTriggerValue(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, ' ');
}

function canonicalizePhraseKey(value: string): string {
  return normalizeTriggerValue(value)
    .replace(/[-_]+/g, ' ')
    .replace(/[^a-z0-9\s]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function canonicalizeTitleKey(title: string): string {
  return canonicalizePhraseKey(title).replace(/\b\d+\b/g, ' ').replace(/\s+/g, ' ').trim();
}

function isTempPath(candidatePath: string): boolean {
  const resolved = path.resolve(candidatePath);
  return resolved === TEMP_ROOT || resolved.startsWith(`${TEMP_ROOT}${path.sep}`);
}

function isRepoMemoryFile(filePath: string): boolean {
  const normalized = normalizePath(path.resolve(filePath));
  const repoRoot = normalizePath(path.resolve(LIVE_REPO_MEMORY_ROOT));
  return normalized.startsWith(`${repoRoot}/`)
    && normalized.includes('/memory/')
    && normalized.endsWith('.md')
    && !normalized.includes('/memory/.archive');
}

function isGlobalAutoMemoryFile(filePath: string): boolean {
  const normalized = normalizePath(path.resolve(filePath));
  const globalRoot = normalizePath(path.resolve(GLOBAL_AUTO_MEMORY_ROOT));
  return normalized.startsWith(`${globalRoot}/`)
    && normalized.endsWith('.md')
    && !normalized.includes('/.archive');
}

function isAllowedTargetFile(filePath: string): boolean {
  return isRepoMemoryFile(filePath)
    || isGlobalAutoMemoryFile(filePath)
    || isTempPath(filePath);
}

function isAllowedScanRoot(dirPath: string): boolean {
  const resolved = path.resolve(dirPath);
  const normalized = normalizePath(resolved);
  const repoRoot = normalizePath(path.resolve(LIVE_REPO_MEMORY_ROOT));
  const globalRoot = normalizePath(path.resolve(GLOBAL_AUTO_MEMORY_ROOT));
  return normalized === repoRoot
    || normalized.startsWith(`${repoRoot}/`)
    || normalized === globalRoot
    || normalized.startsWith(`${globalRoot}/`)
    || isTempPath(resolved);
}

function ensureAllowedScanRoot(dirPath: string): string {
  const resolved = path.resolve(PROJECT_ROOT, dirPath);
  if (!isAllowedScanRoot(resolved)) {
    throw new Error(`--path must resolve inside .opencode/specs, the global auto-memory directory, or a temp directory: ${dirPath}`);
  }
  return resolved;
}

function resolveReportPath(reportPath: string): string {
  if (path.isAbsolute(reportPath)) {
    return reportPath;
  }
  return path.resolve(PROJECT_ROOT, reportPath);
}

function parseArgs(argv: string[]): MigrationCliOptions {
  let mode: MigrationMode = 'dry-run';
  const scanRoots: string[] = [];
  let reportPath: string | null = null;

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === '--help' || arg === '-h') {
      console.log(HELP_TEXT);
      process.exit(0);
    }

    if (arg === '--dry-run') {
      mode = 'dry-run';
      continue;
    }

    if (arg === '--apply') {
      mode = 'apply';
      continue;
    }

    if (arg === '--path') {
      const value = argv[index + 1];
      if (!value || value.startsWith('--')) {
        throw new Error('--path requires a directory value');
      }
      scanRoots.push(ensureAllowedScanRoot(value));
      index += 1;
      continue;
    }

    if (arg === '--report') {
      const value = argv[index + 1];
      if (!value || value.startsWith('--')) {
        throw new Error('--report requires a file path');
      }
      reportPath = resolveReportPath(value);
      index += 1;
      continue;
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  return {
    mode,
    scanRoots: scanRoots.length > 0 ? scanRoots : [LIVE_REPO_MEMORY_ROOT, GLOBAL_AUTO_MEMORY_ROOT],
    reportPath,
  };
}

function walkFiles(rootDir: string): string[] {
  const results: string[] = [];
  const queue = [rootDir];

  while (queue.length > 0) {
    const currentDir = queue.pop();
    if (!currentDir) {
      continue;
    }

    let entries: fs.Dirent[];
    try {
      entries = fs.readdirSync(currentDir, { withFileTypes: true });
    } catch {
      continue;
    }

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === '.git' || entry.name === 'node_modules' || entry.name === 'dist' || entry.name.startsWith('.archive')) {
          continue;
        }
        queue.push(fullPath);
        continue;
      }

      if (!entry.isFile() || !entry.name.endsWith('.md')) {
        continue;
      }

      if (!isAllowedTargetFile(fullPath)) {
        continue;
      }

      if (isRepoMemoryFile(fullPath) || isGlobalAutoMemoryFile(fullPath) || isTempPath(fullPath)) {
        results.push(fullPath);
      }
    }
  }

  return results;
}

function listCandidateFiles(scanRoots: string[]): { files: string[]; discoveredFiles: number; truncatedBySafetyLimit: boolean } {
  const allFiles = scanRoots
    .flatMap((rootDir) => walkFiles(rootDir))
    .filter((filePath, index, all) => all.indexOf(filePath) === index)
    .map((filePath) => ({ filePath, mtimeMs: fs.statSync(filePath).mtimeMs }))
    .sort((left, right) => right.mtimeMs - left.mtimeMs);

  const discoveredFiles = allFiles.length;
  const truncatedBySafetyLimit = discoveredFiles > SAFETY_FILE_LIMIT;
  const files = allFiles.slice(0, SAFETY_FILE_LIMIT).map((entry) => entry.filePath);

  return { files, discoveredFiles, truncatedBySafetyLimit };
}

function buildYamlArraySection(key: string, values: string[]): string[] {
  if (values.length === 0) {
    return [`${key}: []`];
  }

  return [
    `${key}:`,
    ...values.map((value) => `  - "${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`),
  ];
}

function trimTrailingBlankLines(lines: string[]): string[] {
  const nextLines = [...lines];
  while (nextLines.length > 0 && nextLines[nextLines.length - 1].trim() === '') {
    nextLines.pop();
  }
  return nextLines;
}

function locateFrontmatterSectionRange(rawBlock: string, key: string): { lines: string[]; start: number; end: number } | null {
  const lines = rawBlock.replace(/\r/g, '').split('\n');
  let start = -1;

  for (let index = 0; index < lines.length; index += 1) {
    const match = lines[index].match(/^([A-Za-z_][A-Za-z0-9_-]*)\s*:/);
    if (!match) {
      continue;
    }

    if (match[1] === key) {
      start = index;
      continue;
    }

    if (start >= 0) {
      return { lines, start, end: index };
    }
  }

  if (start >= 0) {
    return { lines, start, end: lines.length };
  }

  return null;
}

function rewriteTriggerPhraseSection(content: string, nextTriggers: string[]): string | null {
  const detection = detectFrontmatter(content);
  if (!detection.found) {
    return null;
  }

  const range = locateFrontmatterSectionRange(detection.rawBlock, 'trigger_phrases');
  if (!range) {
    return null;
  }

  const replacementLines = buildYamlArraySection('trigger_phrases', nextTriggers);
  const nextRawBlock = trimTrailingBlankLines([
    ...range.lines.slice(0, range.start),
    ...replacementLines,
    ...range.lines.slice(range.end),
  ]).join('\n');

  return `${content.slice(0, detection.start)}---\n${nextRawBlock}\n---\n${content.slice(detection.end)}`;
}

function parseMemoryContent(content: string): MemoryParseResult {
  const detection = detectFrontmatter(content);
  if (!detection.found) {
    throw new Error('Frontmatter not found');
  }

  const titleSection = detection.sections.find((section) => section.key === 'title');
  const triggerSection = detection.sections.find((section) => section.key === 'trigger_phrases');
  const titleValue = titleSection ? parseSectionValue(titleSection) : undefined;
  const triggerValue = triggerSection ? parseSectionValue(triggerSection) : undefined;
  const title = typeof titleValue === 'string' ? titleValue : '';
  const triggerPhrases = Array.isArray(triggerValue)
    ? triggerValue.filter((value): value is string => typeof value === 'string')
    : [];

  return {
    title,
    triggerPhrases,
    rewrittenContent: null,
  };
}

function resolveTriggerPhrases(triggerPhrases: string[], title: string): TriggerResolution {
  const titleKey = canonicalizeTitleKey(title);
  const kept: string[] = [];
  const removed: TriggerPhraseRemoval[] = [];
  const preservedUsefulAnchors: string[] = [];
  const seenCanonicalKeys = new Map<string, string>();

  for (const originalPhrase of triggerPhrases) {
    const normalized = normalizeTriggerValue(originalPhrase);
    if (!normalized) {
      removed.push({ phrase: originalPhrase, reason: 'empty_or_invalid' });
      continue;
    }

    const sanitizerVerdict = sanitizeTriggerPhrase(normalized);
    if (!sanitizerVerdict.keep) {
      removed.push({
        phrase: normalized,
        reason: 'sanitizer',
        sanitizerReason: sanitizerVerdict.reason,
      });
      continue;
    }

    const canonicalKey = canonicalizePhraseKey(normalized);
    if (!canonicalKey) {
      removed.push({ phrase: normalized, reason: 'empty_or_invalid' });
      continue;
    }

    if (seenCanonicalKeys.has(canonicalKey)) {
      removed.push({
        phrase: normalized,
        reason: 'canonical_duplicate',
        duplicateOf: seenCanonicalKeys.get(canonicalKey) || undefined,
      });
      continue;
    }

    const titleOverlap = titleKey.length > 0
      && !isAllowlistedShortProductName(normalized)
      && new RegExp(`(?:^| )${escapeRegex(canonicalKey)}(?:$| )`, 'i').test(titleKey);
    if (titleOverlap) {
      removed.push({
        phrase: normalized,
        reason: 'title_overlap',
        matchedTitlePhrase: canonicalKey,
      });
      continue;
    }

    kept.push(normalized);
    seenCanonicalKeys.set(canonicalKey, normalized);

    if (isAllowlistedShortProductName(normalized)) {
      preservedUsefulAnchors.push(normalized);
    }
  }

  return {
    kept,
    removed,
    preservedUsefulAnchors,
  };
}

function hashTriggerPhrases(triggerPhrases: string[]): string {
  return crypto.createHash('sha1').update(JSON.stringify(triggerPhrases)).digest('hex');
}

function writeAtomic(filePath: string, content: string): void {
  const dirPath = path.dirname(filePath);
  const tempPath = path.join(
    dirPath,
    `.${path.basename(filePath)}.tmp-${process.pid}-${Date.now()}`
  );
  fs.writeFileSync(tempPath, content, 'utf8');
  fs.renameSync(tempPath, filePath);
}

function writeReport(reportPath: string, report: TriggerPhraseMigrationReport): void {
  const dirPath = path.dirname(reportPath);
  fs.mkdirSync(dirPath, { recursive: true });
  fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
}

export async function runTriggerPhraseResidualMigration(options: MigrationCliOptions): Promise<TriggerPhraseMigrationReport> {
  const candidateFiles = listCandidateFiles(options.scanRoots);
  const reportFiles: TriggerPhraseFileReport[] = [];
  const skippedFiles: Array<{ filePath: string; reason: string }> = [];
  const removedByReason: Record<RemovalReason, number> = {
    empty_or_invalid: 0,
    sanitizer: 0,
    canonical_duplicate: 0,
    title_overlap: 0,
  };

  for (const filePath of candidateFiles.files) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const parsed = parseMemoryContent(content);
      const resolution = resolveTriggerPhrases(parsed.triggerPhrases, parsed.title);
      const rewrittenContent = rewriteTriggerPhraseSection(content, resolution.kept);
      const changed = rewrittenContent !== null && JSON.stringify(parsed.triggerPhrases) !== JSON.stringify(resolution.kept);

      for (const removed of resolution.removed) {
        removedByReason[removed.reason] += 1;
      }

      if (options.mode === 'apply' && changed) {
        if (!isAllowedTargetFile(filePath)) {
          throw new Error(`Refusing to modify file outside approved boundaries: ${filePath}`);
        }
        writeAtomic(filePath, rewrittenContent as string);
      }

      reportFiles.push({
        filePath,
        title: parsed.title,
        changed,
        originalCount: parsed.triggerPhrases.length,
        finalCount: resolution.kept.length,
        removedPhrases: resolution.removed.map((entry) => entry.phrase),
        removedDetails: resolution.removed,
        preservedUsefulAnchors: resolution.preservedUsefulAnchors,
        beforeTriggerPhrases: parsed.triggerPhrases,
        afterTriggerPhrases: resolution.kept,
        auditRecord: {
          beforeHash: hashTriggerPhrases(parsed.triggerPhrases),
          afterHash: hashTriggerPhrases(resolution.kept),
        },
      });
    } catch (error: unknown) {
      skippedFiles.push({
        filePath,
        reason: error instanceof Error ? error.message : String(error),
      });
    }
  }

  const report: TriggerPhraseMigrationReport = {
    generatedAt: new Date().toISOString(),
    mode: options.mode,
    options: {
      scanRoots: options.scanRoots.map((entry) => normalizePath(path.resolve(entry))),
      reportPath: options.reportPath,
      safetyLimit: SAFETY_FILE_LIMIT,
      discoveredFiles: candidateFiles.discoveredFiles,
      truncatedBySafetyLimit: candidateFiles.truncatedBySafetyLimit,
    },
    summary: {
      scannedFiles: reportFiles.length,
      changedFiles: reportFiles.filter((entry) => entry.changed).length,
      unchangedFiles: reportFiles.filter((entry) => !entry.changed).length,
      skippedFiles: skippedFiles.length,
      removedPhraseCount: reportFiles.reduce((sum, entry) => sum + entry.removedPhrases.length, 0),
      preservedUsefulAnchorCount: reportFiles.reduce((sum, entry) => sum + entry.preservedUsefulAnchors.length, 0),
      removedByReason,
    },
    files: reportFiles,
    skippedFiles,
  };

  if (options.reportPath) {
    writeReport(options.reportPath, report);
  }

  return report;
}

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));
  const report = await runTriggerPhraseResidualMigration(options);
  const summary = [
    `mode=${report.mode}`,
    `scanned=${report.summary.scannedFiles}`,
    `changed=${report.summary.changedFiles}`,
    `removed=${report.summary.removedPhraseCount}`,
    `useful_preserved=${report.summary.preservedUsefulAnchorCount}`,
  ].join(' ');
  console.log(summary);
  if (report.options.truncatedBySafetyLimit) {
    console.log(`safety_limit_applied=${SAFETY_FILE_LIMIT} discovered=${report.options.discoveredFiles}`);
  }
  if (options.reportPath) {
    console.log(`report=${options.reportPath}`);
  }
}

if (isMainModule(import.meta.url)) {
  void main().catch((error: unknown) => {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[migrate-trigger-phrase-residual] ${message}`);
    process.exit(1);
  });
}
