#!/usr/bin/env node
// ---------------------------------------------------------------
// MODULE: Historical JSON-mode Memory Migration (dry-run only)
// ---------------------------------------------------------------
// PR-10 guardrail: this utility MUST remain dry-run only in Phase 5.
// Do not auto-heal D1/D2/D7 from historical file content, and do not add
// write-mode behavior without a separate operator-approved follow-up.

import * as fs from 'node:fs';
import * as path from 'node:path';

import { sanitizeTriggerPhrase } from '../lib/trigger-phrase-sanitizer';

type DefectId = 'D1' | 'D2' | 'D3' | 'D4' | 'D5' | 'D6' | 'D7' | 'D8';
type BucketName = 'fixed' | 'skipped-ambiguous' | 'unrecoverable';

interface CliOptions {
  dryRun: boolean;
  globPatterns: string[];
  perDefect: boolean;
  reportPath: string | null;
}

interface DetectionDetails {
  jsonModeSignals: string[];
  continuationPattern: string | null;
}

interface ReportEntry {
  filePath: string;
  bucket: BucketName;
  jsonModeSignalCount: number;
  jsonModeSignals: string[];
  safeDefects: DefectId[];
  ambiguousDefects: DefectId[];
  unrecoverableDefects: DefectId[];
  continuationPattern: string | null;
  notes: string[];
}

interface PerDefectSummary {
  fixed: Record<DefectId, number>;
  ambiguous: Record<DefectId, number>;
  unrecoverable: Record<DefectId, number>;
}

interface MigrationReport {
  generatedAt: string;
  mode: 'dry-run';
  options: {
    globPatterns: string[];
    perDefect: boolean;
    reportPath: string | null;
  };
  summary: {
    scannedFiles: number;
    candidateFiles: number;
    fixed: number;
    skippedAmbiguous: number;
    unrecoverable: number;
    ignored: number;
  };
  buckets: Record<BucketName, ReportEntry[]>;
  perDefect?: PerDefectSummary;
}

interface AnchorState {
  comment: string | null;
  closingComment: string | null;
  htmlId: string | null;
  tocTarget: string | null;
}

interface ParsedMemory {
  frontmatter: Record<string, string>;
  metadata: Record<string, string>;
  triggers: string[];
  title: string;
  overviewParagraph: string;
  decisionsSection: string;
  supersedes: string[];
  anchorState: AnchorState;
}

const HELP_TEXT = `
migrate-historical-json-mode-memories — Phase 5 PR-10 dry-run classifier

Usage:
  node migrate-historical-json-mode-memories.js [options]

Options:
  --dry-run            Preview only (default and only supported mode)
  --path <glob>        Limit scan to a project-relative glob (repeatable)
  --report <path>      Write JSON report to a project-relative file
  --per-defect         Include D1-D8 count summaries in the JSON report
  --help, -h           Show this help message

Examples:
  node migrate-historical-json-mode-memories.js --dry-run
  node migrate-historical-json-mode-memories.js --dry-run --path ".opencode/specs/**/memory/*.md"
  node migrate-historical-json-mode-memories.js --dry-run --report /tmp/pr10-report.json --per-defect
`;

const DECISION_PLACEHOLDER_PATTERN = /\b(?:observation|user)\s+decision\s+\d+\b/i;
const TERMINAL_PUNCTUATION_PATTERN = /[.!?…:;"')\]]$/u;
const CONTINUATION_PATTERNS: Array<{ label: string; pattern: RegExp }> = [
  { label: 'extended', pattern: /\bextended\b/i },
  { label: 'continuation', pattern: /\bcontinu(?:ation|e)\b/i },
  { label: 'resume', pattern: /\bresume\b/i },
  { label: 'follow_up', pattern: /\bfollow[- ]up\b/i },
  { label: 'part', pattern: /\bpart\s*\d+\b/i },
  { label: 'round', pattern: /\bround\s*\d+\b/i },
  { label: 'iteration', pattern: /\biter(?:ation)?\s*\d+\b/i },
  { label: 'iterations_total', pattern: /\b\d+[- ]*iterations?(?:[- ]*total[- ]*\d+)?\b/i },
];
const DEFAULT_GLOB_PATTERNS = ['**/memory/*.md'];
const SKIP_SEGMENTS = new Set(['node_modules', '.git', 'dist']);

function resolveProjectRoot(): string {
  const candidates = [
    path.resolve(__dirname, '../../../../../..'),
    path.resolve(__dirname, '../../../..'),
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

function normalizePath(filePath: string): string {
  return filePath.replace(/\\/g, '/');
}

function ensureProjectRelative(targetPath: string, flagName: string): string {
  const resolved = path.resolve(PROJECT_ROOT, targetPath);
  const relative = path.relative(PROJECT_ROOT, resolved);
  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new Error(`${flagName} must stay inside the project boundary: ${targetPath}`);
  }
  return resolved;
}

function parseArgs(argv: string[]): CliOptions {
  const options: CliOptions = {
    dryRun: true,
    globPatterns: [],
    perDefect: false,
    reportPath: null,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === '--help' || arg === '-h') {
      console.log(HELP_TEXT);
      process.exit(0);
    }

    if (arg === '--dry-run') {
      options.dryRun = true;
      continue;
    }

    if (arg === '--path') {
      const value = argv[index + 1];
      if (!value || value.startsWith('--')) {
        throw new Error('--path requires a glob value');
      }
      options.globPatterns.push(value);
      index += 1;
      continue;
    }

    if (arg === '--report') {
      const value = argv[index + 1];
      if (!value || value.startsWith('--')) {
        throw new Error('--report requires a file path');
      }
      options.reportPath = ensureProjectRelative(value, '--report');
      index += 1;
      continue;
    }

    if (arg === '--per-defect') {
      options.perDefect = true;
      continue;
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  return {
    ...options,
    globPatterns: options.globPatterns.length > 0 ? options.globPatterns : [...DEFAULT_GLOB_PATTERNS],
  };
}

function escapeRegex(value: string): string {
  return value.replace(/[|\\{}()[\]^$+?.]/g, '\\$&');
}

function globToRegExp(globPattern: string): RegExp {
  let regexSource = '^';

  for (let index = 0; index < globPattern.length; index += 1) {
    const char = globPattern[index];
    const next = globPattern[index + 1];

    if (char === '*') {
      if (next === '*') {
        regexSource += '.*';
        index += 1;
      } else {
        regexSource += '[^/]*';
      }
      continue;
    }

    if (char === '?') {
      regexSource += '.';
      continue;
    }

    regexSource += escapeRegex(char);
  }

  regexSource += '$';
  return new RegExp(regexSource, 'i');
}

function shouldSkipPath(relativePath: string): boolean {
  const normalized = normalizePath(relativePath);

  if (normalized.includes('/research/archive/')) {
    return true;
  }
  if (normalized.includes('/memory/.archive')) {
    return true;
  }

  return false;
}

function walkFiles(rootDir: string): string[] {
  const results: string[] = [];
  const queue: string[] = [rootDir];

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
        if (SKIP_SEGMENTS.has(entry.name)) {
          continue;
        }
        queue.push(fullPath);
        continue;
      }

      if (!entry.isFile()) {
        continue;
      }

      const relativePath = normalizePath(path.relative(PROJECT_ROOT, fullPath));
      if (shouldSkipPath(relativePath)) {
        continue;
      }

      results.push(fullPath);
    }
  }

  return results;
}

function parseFrontmatter(content: string): Record<string, string> {
  const lines = content.split('\n');
  const result: Record<string, string> = {};

  if (lines[0]?.trim() !== '---') {
    return result;
  }

  for (let index = 1; index < lines.length; index += 1) {
    const line = lines[index];
    if (line.trim() === '---') {
      break;
    }

    const colonIndex = line.indexOf(':');
    if (colonIndex <= 0) {
      continue;
    }

    const key = line.slice(0, colonIndex).trim();
    const value = line.slice(colonIndex + 1).trim();
    result[key] = value;
  }

  return result;
}

function normalizeScalarValue(value: string | undefined): string {
  return (value || '')
    .trim()
    .replace(/\s+#.*$/u, '')
    .trim()
    .replace(/^['"]|['"]$/g, '');
}

function extractMemoryMetadataYaml(content: string): string {
  const match = content.match(/## MEMORY METADATA[\s\S]*?```yaml\s*([\s\S]*?)```/);
  return match?.[1] ?? '';
}

function parseMemoryMetadataBlock(content: string): Record<string, string> {
  const yamlBlock = extractMemoryMetadataYaml(content);
  if (!yamlBlock) {
    return {};
  }

  const result: Record<string, string> = {};
  for (const rawLine of yamlBlock.split('\n')) {
    const line = rawLine.trim();
    if (line.length === 0 || line.startsWith('#') || line.endsWith(':')) {
      continue;
    }

    const colonIndex = line.indexOf(':');
    if (colonIndex <= 0) {
      continue;
    }

    result[line.slice(0, colonIndex).trim()] = line.slice(colonIndex + 1).trim();
  }

  return result;
}

function parseFrontmatterArray(content: string, fieldName: string): string[] {
  const lines = content.split('\n');
  const results: string[] = [];
  let inFrontmatter = false;
  let foundField = false;

  for (const line of lines) {
    if (line.trim() === '---') {
      if (!inFrontmatter) {
        inFrontmatter = true;
        continue;
      }
      break;
    }

    if (!inFrontmatter) {
      continue;
    }

    if (line.startsWith(`${fieldName}:`)) {
      foundField = true;
      const inlineMatch = line.match(/:\s*\[(.+)\]/);
      if (inlineMatch) {
        return inlineMatch[1]
          .split(',')
          .map((entry) => normalizeScalarValue(entry))
          .filter(Boolean);
      }
      continue;
    }

    if (foundField) {
      if (/^\s+-\s+/.test(line)) {
        const value = line.replace(/^\s+-\s+/, '').trim();
        const normalized = normalizeScalarValue(value);
        if (normalized) {
          results.push(normalized);
        }
        continue;
      }
      break;
    }
  }

  return results;
}

function extractSection(content: string, sectionName: string): string {
  const escapedSectionName = sectionName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(
    `^##\\s+(?:\\d+\\.\\s+)?${escapedSectionName}\\s*$([\\s\\S]*?)(?=^##\\s+(?:\\d+\\.\\s+)?[^\\n]+$|\\Z)`,
    'im',
  );
  return pattern.exec(content)?.[1]?.trim() ?? '';
}

function stripSectionScaffolding(sectionContent: string): string {
  return sectionContent
    .split('\n')
    .filter((line) => !line.trim().startsWith('<!--') && !line.trim().startsWith('<a id='))
    .join('\n')
    .trim();
}

function extractSupersedesEntries(content: string): string[] {
  const yamlBlock = extractMemoryMetadataYaml(content);
  if (!yamlBlock) {
    return [];
  }

  const lines = yamlBlock.split('\n');
  const supersedesIndex = lines.findIndex((line) => line.trim() === 'supersedes:');
  if (supersedesIndex === -1) {
    return [];
  }

  const entries: string[] = [];
  for (let index = supersedesIndex + 1; index < lines.length; index += 1) {
    const line = lines[index];
    const trimmed = line.trim();

    if (trimmed.length === 0) {
      continue;
    }
    if (trimmed === '[]') {
      return [];
    }
    if (/^- /.test(trimmed)) {
      entries.push(normalizeScalarValue(trimmed.replace(/^- /, '')));
      continue;
    }
    if (!/^\s/.test(line)) {
      break;
    }
  }

  return entries.filter(Boolean);
}

function extractOverviewAnchorState(content: string): AnchorState {
  const tocTarget = Array.from(content.matchAll(/^- \[OVERVIEW\]\(#([^)]+)\)\s*$/gim))[0]?.[1] ?? null;
  const blockMatch = content.match(
    /<!-- ANCHOR:([a-z0-9-]+) -->\s*\n<a id="([^"]+)"><\/a>\s*\n(?:\s*\n)?##\s+(?:\d+\.\s+)?OVERVIEW[\s\S]*?<!-- \/ANCHOR:([a-z0-9-]+) -->/i,
  );

  return {
    comment: blockMatch?.[1] ?? null,
    htmlId: blockMatch?.[2] ?? null,
    closingComment: blockMatch?.[3] ?? null,
    tocTarget,
  };
}

function detectContinuationPattern(title: string): string | null {
  for (const candidate of CONTINUATION_PATTERNS) {
    if (candidate.pattern.test(title)) {
      return candidate.label;
    }
  }
  return null;
}

function parseMemory(content: string): ParsedMemory {
  const frontmatter = parseFrontmatter(content);
  const metadata = parseMemoryMetadataBlock(content);
  const title = normalizeScalarValue(frontmatter.title);
  const triggers = parseFrontmatterArray(content, 'trigger_phrases');
  const overviewSection = stripSectionScaffolding(extractSection(content, 'OVERVIEW'));
  const overviewParagraph = overviewSection.split(/\n\s*\n/u)[0]?.trim() ?? '';
  const decisionsSection = stripSectionScaffolding(extractSection(content, 'DECISIONS'));

  return {
    frontmatter,
    metadata,
    triggers,
    title,
    overviewParagraph,
    decisionsSection,
    supersedes: extractSupersedesEntries(content),
    anchorState: extractOverviewAnchorState(content),
  };
}

function hasEmptyProvenance(metadata: Record<string, string>): boolean {
  const headRef = normalizeScalarValue(metadata.head_ref);
  const commitRef = normalizeScalarValue(metadata.commit_ref);
  const repositoryState = normalizeScalarValue(metadata.repository_state).toLowerCase();

  return headRef.length === 0
    && commitRef.length === 0
    && repositoryState === 'unavailable';
}

function detectJsonModeSignals(parsed: ParsedMemory): DetectionDetails {
  const signals: string[] = [];

  if (Object.prototype.hasOwnProperty.call(parsed.frontmatter, '_sourceTranscriptPath')) {
    signals.push('_sourceTranscriptPath');
  }
  if (Object.prototype.hasOwnProperty.call(parsed.frontmatter, '_sourceSessionId')) {
    signals.push('_sourceSessionId');
  }
  if (normalizeScalarValue(parsed.frontmatter.quality_score) === '1.00') {
    signals.push('quality_score_1.00');
  }
  if (hasEmptyProvenance(parsed.metadata)) {
    signals.push('empty_provenance_bundle');
  }
  if (DECISION_PLACEHOLDER_PATTERN.test(parsed.decisionsSection)) {
    signals.push('generic_decision_placeholders');
  }
  if (parsed.triggers.some((phrase) => sanitizeTriggerPhrase(phrase).reason === 'path_fragment')) {
    signals.push('path_fragment_trigger');
  }

  return {
    jsonModeSignals: signals,
    continuationPattern: detectContinuationPattern(parsed.title),
  };
}

function detectD1(overviewParagraph: string): boolean {
  const normalized = overviewParagraph.trim();
  if (normalized.length < 450) {
    return false;
  }

  const lastToken = normalized.split(/\s+/u).pop() ?? '';
  return !TERMINAL_PUNCTUATION_PATTERN.test(normalized)
    && lastToken.length <= 4;
}

function detectD3(triggers: string[]): boolean {
  return triggers.some((phrase) => {
    const verdict = sanitizeTriggerPhrase(phrase);
    return verdict.keep === false
      && (
        verdict.reason === 'path_fragment'
        || verdict.reason === 'standalone_stopword'
        || verdict.reason === 'synthetic_bigram'
      );
  });
}

function detectD4(frontmatter: Record<string, string>, metadata: Record<string, string>): boolean {
  const frontmatterTier = normalizeScalarValue(frontmatter.importance_tier);
  const metadataTier = normalizeScalarValue(metadata.importance_tier);
  return frontmatterTier.length > 0
    && metadataTier.length > 0
    && frontmatterTier !== metadataTier;
}

function detectD6(triggers: string[]): boolean {
  const seen = new Set<string>();
  for (const trigger of triggers) {
    const normalized = trigger.trim().toLowerCase();
    if (!normalized) {
      continue;
    }
    if (seen.has(normalized)) {
      return true;
    }
    seen.add(normalized);
  }
  return false;
}

function detectD8(anchorState: AnchorState): boolean {
  const hasAnyAnchorSignal = anchorState.tocTarget !== null
    || anchorState.comment !== null
    || anchorState.closingComment !== null
    || anchorState.htmlId !== null;

  if (!hasAnyAnchorSignal) {
    return false;
  }

  return anchorState.tocTarget !== 'overview'
    || anchorState.comment !== 'overview'
    || anchorState.closingComment !== 'overview'
    || anchorState.htmlId !== 'overview';
}

function buildEntry(filePath: string, parsed: ParsedMemory, details: DetectionDetails): ReportEntry | null {
  if (details.jsonModeSignals.length < 2) {
    return null;
  }

  const safeDefects: DefectId[] = [];
  const ambiguousDefects: DefectId[] = [];
  const unrecoverableDefects: DefectId[] = [];
  const notes: string[] = [];

  if (detectD1(parsed.overviewParagraph)) {
    unrecoverableDefects.push('D1');
  }
  if (DECISION_PLACEHOLDER_PATTERN.test(parsed.decisionsSection)) {
    unrecoverableDefects.push('D2');
  }
  if (detectD3(parsed.triggers)) {
    safeDefects.push('D3');
  }
  if (detectD4(parsed.frontmatter, parsed.metadata)) {
    safeDefects.push('D4');
  }
  if (details.continuationPattern && parsed.supersedes.length === 0) {
    ambiguousDefects.push('D5');
  }
  if (detectD6(parsed.triggers)) {
    safeDefects.push('D6');
  }
  if (hasEmptyProvenance(parsed.metadata)) {
    unrecoverableDefects.push('D7');
  }
  if (detectD8(parsed.anchorState)) {
    safeDefects.push('D8');
  }

  if (safeDefects.length === 0 && ambiguousDefects.length === 0 && unrecoverableDefects.length === 0) {
    return null;
  }

  let bucket: BucketName;
  if (safeDefects.length > 0) {
    bucket = 'fixed';
    notes.push(`Safe-subset rewrites possible for ${safeDefects.join(', ')}`);
  } else if (ambiguousDefects.length > 0) {
    bucket = 'skipped-ambiguous';
    notes.push('Continuation signal exists without an unambiguous predecessor link');
  } else {
    bucket = 'unrecoverable';
    notes.push(`No safe mechanical rewrite for ${unrecoverableDefects.join(', ')}`);
  }

  if (ambiguousDefects.length > 0 && safeDefects.length > 0) {
    notes.push(`Ambiguous lineage remains for ${ambiguousDefects.join(', ')}`);
  }
  if (unrecoverableDefects.length > 0 && safeDefects.length > 0) {
    notes.push(`Do not auto-heal ${unrecoverableDefects.join(', ')} from historical file content`);
  }

  return {
    filePath: normalizePath(path.relative(PROJECT_ROOT, filePath)),
    bucket,
    jsonModeSignalCount: details.jsonModeSignals.length,
    jsonModeSignals: details.jsonModeSignals,
    safeDefects,
    ambiguousDefects,
    unrecoverableDefects,
    continuationPattern: details.continuationPattern,
    notes,
  };
}

function createPerDefectSummary(): PerDefectSummary {
  const zeroes = (): Record<DefectId, number> => ({
    D1: 0,
    D2: 0,
    D3: 0,
    D4: 0,
    D5: 0,
    D6: 0,
    D7: 0,
    D8: 0,
  });

  return {
    fixed: zeroes(),
    ambiguous: zeroes(),
    unrecoverable: zeroes(),
  };
}

function incrementCounts(target: Record<DefectId, number>, defectIds: DefectId[]): void {
  for (const defectId of defectIds) {
    target[defectId] += 1;
  }
}

function writeReport(reportPath: string, report: MigrationReport): void {
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
}

function main(): void {
  const options = parseArgs(process.argv.slice(2));
  const globMatchers = options.globPatterns.map((pattern) => globToRegExp(normalizePath(pattern)));
  const allFiles = walkFiles(PROJECT_ROOT);
  const candidateFiles = allFiles.filter((filePath) => {
    const relativePath = normalizePath(path.relative(PROJECT_ROOT, filePath));
    return relativePath.endsWith('.md')
      && globMatchers.some((matcher) => matcher.test(relativePath));
  });

  const report: MigrationReport = {
    // NOTE: `generatedAt` intentionally reflects wall-clock dry-run time, so the
    // report is not fixture-stable across runs. A fixture-locked harness for
    // this timestamped output remains follow-up work outside this advisory pass.
    generatedAt: new Date().toISOString(),
    mode: 'dry-run',
    options: {
      globPatterns: options.globPatterns,
      perDefect: options.perDefect,
      reportPath: options.reportPath ? normalizePath(path.relative(PROJECT_ROOT, options.reportPath)) : null,
    },
    summary: {
      scannedFiles: candidateFiles.length,
      candidateFiles: 0,
      fixed: 0,
      skippedAmbiguous: 0,
      unrecoverable: 0,
      ignored: 0,
    },
    buckets: {
      fixed: [],
      'skipped-ambiguous': [],
      unrecoverable: [],
    },
  };

  const perDefect = createPerDefectSummary();

  for (const filePath of candidateFiles) {
    const content = fs.readFileSync(filePath, 'utf8');
    const parsed = parseMemory(content);
    const detectionDetails = detectJsonModeSignals(parsed);
    const entry = buildEntry(filePath, parsed, detectionDetails);

    if (!entry) {
      report.summary.ignored += 1;
      continue;
    }

    report.summary.candidateFiles += 1;
    report.buckets[entry.bucket].push(entry);
    if (entry.bucket === 'fixed') {
      report.summary.fixed += 1;
    } else if (entry.bucket === 'skipped-ambiguous') {
      report.summary.skippedAmbiguous += 1;
    } else {
      report.summary.unrecoverable += 1;
    }

    incrementCounts(perDefect.fixed, entry.safeDefects);
    incrementCounts(perDefect.ambiguous, entry.ambiguousDefects);
    incrementCounts(perDefect.unrecoverable, entry.unrecoverableDefects);
  }

  if (options.perDefect) {
    report.perDefect = perDefect;
  }

  if (options.reportPath) {
    writeReport(options.reportPath, report);
  }

  console.log('PR-10 historical JSON-mode migration dry run completed');
  console.log(`Scanned files: ${report.summary.scannedFiles}`);
  console.log(`JSON-mode candidates: ${report.summary.candidateFiles}`);
  console.log(`fixed: ${report.summary.fixed}`);
  console.log(`skipped-ambiguous: ${report.summary.skippedAmbiguous}`);
  console.log(`unrecoverable: ${report.summary.unrecoverable}`);
  console.log(`ignored: ${report.summary.ignored}`);
  if (options.reportPath) {
    console.log(`Report: ${normalizePath(path.relative(PROJECT_ROOT, options.reportPath))}`);
  }
}

main();
