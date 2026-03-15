#!/usr/bin/env node
// ---------------------------------------------------------------
// MODULE: Historical Memory Remediation
// ---------------------------------------------------------------
// Audits and remediates historical memory files for frontmatter compliance.

import * as fs from 'node:fs';
import * as path from 'node:path';
import {
  detectFrontmatter,
  parseSectionValue,
  type FrontmatterSection,
} from '../lib/frontmatter-migration';
import {
  containsLegacyGenericTriggerPhrase,
  deriveMemoryDescription,
  deriveMemoryTriggerPhrases,
  GENERIC_MEMORY_DESCRIPTION,
  hasGenericMemoryDescription,
  hasLegacyGenericTriggerPhrases,
  sanitizeMemoryFrontmatterTitle,
} from '../utils/memory-frontmatter';
import {
  validateMemoryTemplateContract,
  type MemoryTemplateContractResult,
} from '@spec-kit/shared/parsing/memory-template-contract';

type HistoricalIssue =
  | 'legacy_generic_trigger_phrases'
  | 'generic_description'
  | 'raw_mustache_literal'
  | 'literal_anchor_example'
  | 'corrupted_title'
  | 'low_signal_content'
  | 'malformed_frontmatter'
  | 'legacy_template_banner'
  | 'duplicate_body_separator'
  | 'missing_standard_anchor_scaffolding';

type HistoricalClassification =
  | 'clean'
  | 'repair_in_place'
  | 'regenerate_from_authoritative_evidence'
  | 'quarantine';

export interface HistoricalMemoryAuditEntry {
  path: string;
  specFolder: string;
  issues: HistoricalIssue[];
  classification: HistoricalClassification;
  repairStrategy: 'none' | 'frontmatter_normalization' | 'pipeline_regeneration' | 'quarantine_move';
  indexAction: 'keep' | 'reindex' | 'regenerate_then_reindex' | 'deindex';
  quarantinePath: string | null;
  templateContract: MemoryTemplateContractResult;
}

export interface HistoricalMemoryAuditManifest {
  generatedAt: string;
  root: string;
  summary: {
    total: number;
    clean: number;
    repair_in_place: number;
    regenerate_from_authoritative_evidence: number;
    quarantine: number;
  };
  bySpecFolder: Record<string, {
    total: number;
    repair_in_place: number;
    regenerate_from_authoritative_evidence: number;
    quarantine: number;
  }>;
  files: HistoricalMemoryAuditEntry[];
}

interface HistoricalMemoryFrontmatter {
  title: string | null;
  description: string | null;
  triggerPhrases: string[];
  importanceTier: string | null;
  contextType: string | null;
  unknownSections: FrontmatterSection[];
}

interface RunOptions {
  root: string;
  reportDir: string;
  apply: boolean;
}

interface TriggerPhraseSection {
  headingLine: string;
  startOffset: number;
  endOffset: number;
  triggerPhrases: string[];
}

interface StandardAnchorRule {
  anchorId: string;
  commentId: string;
  headingPattern: RegExp;
  includeHtmlId: boolean;
}

const MANAGED_FRONTMATTER_KEYS = new Set([
  'title',
  'description',
  'trigger_phrases',
  'triggerphrases',
  'importance_tier',
  'importancetier',
  'contexttype',
  'context_type',
]);

const SUMMARY_GENERIC_PATTERNS = [
  /^session focused on implementing and testing features\.?$/i,
  /^let me read /i,
  /^i['’]?m starting with /i,
  /^i['’]?ll start by /i,
];

const MANUAL_QUARANTINE_SUFFIXES = new Set([
  '010-perfect-session-capturing/memory/15-03-26_12-25__how-is-used-later-in-the-template-to-match-th.md',
  '010-perfect-session-capturing/memory/15-03-26_12-27__i-m-starting-with-the-repo-s-own-runbook-and.md',
  '015-skill-alignment/memory/15-03-26_11-31__manual-context-save.md',
]);

const STANDARD_ANCHOR_RULES: StandardAnchorRule[] = [
  { anchorId: 'preflight', commentId: 'preflight', headingPattern: /^##\s+PREFLIGHT BASELINE\s*$/i, includeHtmlId: false },
  { anchorId: 'continue-session', commentId: 'continue-session', headingPattern: /^##\s+CONTINUE SESSION\s*$/i, includeHtmlId: true },
  { anchorId: 'project-state-snapshot', commentId: 'project-state-snapshot', headingPattern: /^##\s+PROJECT STATE SNAPSHOT\s*$/i, includeHtmlId: true },
  { anchorId: 'implementation-guide', commentId: 'task-guide', headingPattern: /^##\s+(?:\d+\.\s+)?IMPLEMENTATION GUIDE\s*$/i, includeHtmlId: true },
  { anchorId: 'overview', commentId: 'summary', headingPattern: /^##\s+(?:\d+\.\s+)?OVERVIEW\s*$/i, includeHtmlId: true },
  { anchorId: 'detailed-changes', commentId: 'detailed-changes', headingPattern: /^##\s+(?:\d+\.\s+)?DETAILED CHANGES\s*$/i, includeHtmlId: true },
  { anchorId: 'workflow-visualization', commentId: 'workflow-visualization', headingPattern: /^##\s+(?:\d+\.\s+)?WORKFLOW VISUALIZATION\s*$/i, includeHtmlId: true },
  { anchorId: 'decisions', commentId: 'decisions', headingPattern: /^##\s+(?:\d+\.\s+)?DECISIONS\s*$/i, includeHtmlId: true },
  { anchorId: 'conversation', commentId: 'session-history', headingPattern: /^##\s+(?:\d+\.\s+)?CONVERSATION\s*$/i, includeHtmlId: true },
  { anchorId: 'recovery-hints', commentId: 'recovery-hints', headingPattern: /^##\s+RECOVERY HINTS\s*$/i, includeHtmlId: true },
  { anchorId: 'postflight-learning-delta', commentId: 'postflight', headingPattern: /^##\s+POSTFLIGHT LEARNING DELTA\s*$/i, includeHtmlId: true },
  { anchorId: 'memory-metadata', commentId: 'metadata', headingPattern: /^##\s+MEMORY METADATA\s*$/i, includeHtmlId: true },
];

function printHelp(): void {
  console.log(`
historical-memory-remediation — audit and remediate legacy memory files

Usage:
  node historical-memory-remediation.js [options]

Options:
  --root <path>        Root folder to audit (default: 022-hybrid-rag-fusion)
  --report-dir <path>  Directory for manifest + summary output
  --apply              Apply repairs and quarantine moves
  --help, -h           Show this help
`);
}

function parseArgs(argv: string[]): RunOptions {
  let root = path.resolve(process.cwd(), '.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion');
  let reportDir = path.resolve(
    process.cwd(),
    '.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/scratch/historical-memory-remediation'
  );
  let apply = false;

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === '--help' || arg === '-h') {
      printHelp();
      process.exit(0);
    }

    if (arg === '--apply') {
      apply = true;
      continue;
    }

    if (arg === '--root') {
      const value = argv[index + 1];
      if (!value || value.startsWith('--')) {
        throw new Error('--root requires a value');
      }
      root = path.resolve(process.cwd(), value);
      index += 1;
      continue;
    }

    if (arg === '--report-dir') {
      const value = argv[index + 1];
      if (!value || value.startsWith('--')) {
        throw new Error('--report-dir requires a value');
      }
      reportDir = path.resolve(process.cwd(), value);
      index += 1;
      continue;
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  return { root, reportDir, apply };
}

function normalizePath(value: string): string {
  return value.replace(/\\/g, '/');
}

function getRelativeSpecPath(filePath: string, root: string): string {
  return normalizePath(path.relative(root, filePath));
}

function getSpecFolderFromMemoryPath(filePath: string, root: string): string {
  const relativePath = getRelativeSpecPath(filePath, root);
  const parts = relativePath.split('/');
  const memoryIndex = parts.indexOf('memory');
  if (memoryIndex <= 0) {
    return path.basename(path.dirname(filePath));
  }
  return parts.slice(0, memoryIndex).join('/');
}

function discoverMemoryFiles(root: string): string[] {
  const results: string[] = [];
  const queue: string[] = [root];

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current) {
      continue;
    }

    const entries = fs.readdirSync(current, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        queue.push(fullPath);
        continue;
      }
      if (!entry.isFile() || !entry.name.endsWith('.md')) {
        continue;
      }
      const normalized = normalizePath(fullPath);
      if (normalized.includes('/memory/') && !normalized.includes('/memory/quarantine/')) {
        results.push(fullPath);
      }
    }
  }

  return results.sort();
}

function parseFrontmatterSections(content: string): HistoricalMemoryFrontmatter {
  const detection = detectFrontmatter(content);
  if (!detection.found) {
    return {
      title: null,
      description: null,
      triggerPhrases: [],
      importanceTier: null,
      contextType: null,
      unknownSections: [],
    };
  }

  const sectionValueByKey = (keys: string[]): string | string[] | undefined => {
    const lookup = new Set(keys.map((key) => key.toLowerCase()));
    for (const section of detection.sections) {
      if (!lookup.has(section.key.toLowerCase())) {
        continue;
      }
      const value = parseSectionValue(section);
      if (value !== undefined) {
        return value;
      }
    }
    return undefined;
  };

  const titleValue = sectionValueByKey(['title']);
  const descriptionValue = sectionValueByKey(['description']);
  const triggerValue = sectionValueByKey(['trigger_phrases', 'triggerPhrases']);
  const importanceValue = sectionValueByKey(['importance_tier', 'importanceTier']);
  const contextValue = sectionValueByKey(['contextType', 'context_type']);

  const triggerPhrases = Array.isArray(triggerValue)
    ? triggerValue.map((entry) => String(entry).trim()).filter(Boolean)
    : typeof triggerValue === 'string'
      ? triggerValue.split(',').map((entry) => entry.trim()).filter(Boolean)
      : [];

  const unknownSections = detection.sections.filter((section) => !MANAGED_FRONTMATTER_KEYS.has(section.key.toLowerCase()));

  return {
    title: typeof titleValue === 'string' ? titleValue.trim() : null,
    description: typeof descriptionValue === 'string' ? descriptionValue.trim() : null,
    triggerPhrases,
    importanceTier: typeof importanceValue === 'string' ? importanceValue.trim() : null,
    contextType: typeof contextValue === 'string' ? contextValue.trim() : null,
    unknownSections,
  };
}

function extractBody(content: string): string {
  const detection = detectFrontmatter(content);
  if (!detection.found) {
    return content;
  }
  return content.slice(detection.end);
}

function extractHeading(body: string): string | null {
  const match = body.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : null;
}

function extractSummary(body: string): string | null {
  const summaryMatch = body.match(/^\*\*Summary:\*\*\s+(.+)$/m);
  if (summaryMatch) {
    return summaryMatch[1].trim();
  }

  const recentMatch = body.match(/^##\s+1\.\s+OVERVIEW[\s\S]*?\n\n([^#\n][^\n]+)/m);
  if (recentMatch) {
    return recentMatch[1].trim();
  }

  return null;
}

function extractMetric(body: string, label: string): number | null {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = body.match(new RegExp(`\\|\\s*${escaped}\\s*\\|\\s*([^|\\n]+)\\|`, 'i'));
  if (!match) {
    return null;
  }

  const numeric = Number.parseInt(match[1].trim(), 10);
  return Number.isFinite(numeric) ? numeric : null;
}

function parseTriggerPhraseValue(line: string): string | null {
  const trimmed = line.trim();
  if (!trimmed.startsWith('-')) {
    return null;
  }

  const value = trimmed
    .replace(/^-+\s*/, '')
    .replace(/^"/, '')
    .replace(/"$/, '')
    .trim();

  return value || null;
}

function findTriggerPhraseSection(body: string): TriggerPhraseSection | null {
  const lines = body.split('\n');
  let offset = 0;

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const headingMatch = line.match(/^\s{0,3}(#{1,6})\s+Trigger Phrases\b.*$/i);
    const lineStart = offset;
    offset += line.length + 1;

    if (!headingMatch) {
      continue;
    }

    let cursor = index + 1;
    while (cursor < lines.length && lines[cursor].trim() === '') {
      cursor += 1;
    }

    if (cursor >= lines.length || !/^\s*trigger_phrases\s*:/i.test(lines[cursor])) {
      continue;
    }

    const triggerPhrases: string[] = [];
    let endIndex = cursor;
    const triggerLine = lines[cursor].trim();
    if (/^\s*trigger_phrases\s*:\s*\[\s*\]\s*$/i.test(triggerLine)) {
      endIndex = cursor;
    } else {
      for (let listIndex = cursor + 1; listIndex < lines.length; listIndex += 1) {
        const candidate = lines[listIndex];
        if (candidate.trim() === '') {
          endIndex = listIndex;
          break;
        }
        if (/^\s{0,3}#{1,6}\s+/.test(candidate)) {
          endIndex = listIndex - 1;
          break;
        }

        const parsed = parseTriggerPhraseValue(candidate);
        if (parsed) {
          triggerPhrases.push(parsed);
          endIndex = listIndex;
          continue;
        }

        endIndex = listIndex - 1;
        break;
      }
    }

    let startOffset = 0;
    for (let position = 0; position < index; position += 1) {
      startOffset += lines[position].length + 1;
    }

    let endOffset = 0;
    for (let position = 0; position <= endIndex; position += 1) {
      endOffset += lines[position].length + 1;
    }
    if (endOffset > body.length) {
      endOffset = body.length;
    }

    return {
      headingLine: `${headingMatch[1]} Trigger Phrases (auto-extracted for fast <50ms matching)`,
      startOffset,
      endOffset,
      triggerPhrases,
    };
  }

  return null;
}

function extractBodyTriggerPhrases(body: string): string[] {
  return findTriggerPhraseSection(body)?.triggerPhrases ?? [];
}

function hasRawMustacheLiteral(body: string): boolean {
  return /\{\{[#\/]?[A-Z0-9_:-]+\}\}/.test(body);
}

function hasLiteralAnchorExample(body: string): boolean {
  return /<!--\s*\/?ANCHOR:id\s*-->/.test(body);
}

function hasLegacyTemplateBanner(body: string): boolean {
  return /^\s*<!-- TEMPLATE: context_template\.md v[0-9.]+ - DO NOT EDIT GENERATED FILES -->/m.test(body)
    || /<!-- Constitutional Tier Promotion:/m.test(body);
}

function hasDuplicateBodySeparator(body: string): boolean {
  return /(?:^|\n)---\s*\n(?:\s*\n)+---(?:\s*\n|$)/.test(body);
}

function stripLegacyTemplateBanner(body: string): string {
  let result = body;

  result = result.replace(
    /^\s*<!-- TEMPLATE: context_template\.md v[0-9.]+ - DO NOT EDIT GENERATED FILES -->\s*\n?/,
    ''
  );
  result = result.replace(
    /^\s*<!-- Constitutional Tier Promotion:[\s\S]*?-->\s*\n?/,
    ''
  );

  return result;
}

function stripDuplicateBodySeparator(body: string): string {
  return body.replace(/(?:^|\n)---\s*\n(?:\s*\n)+---(?=\s*\n|$)/g, '\n---');
}

function hasMissingStandardAnchorScaffolding(body: string): boolean {
  const lines = body.split('\n');

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const rule = STANDARD_ANCHOR_RULES.find((candidate) => candidate.headingPattern.test(line));
    if (!rule) {
      continue;
    }

    let cursor = index - 1;
    while (cursor >= 0 && lines[cursor].trim() === '') {
      cursor -= 1;
    }

    const expectedId = `<a id="${rule.anchorId}"></a>`;
    const hasId = rule.includeHtmlId && cursor >= 0 && lines[cursor].trim() === expectedId;
    if (rule.includeHtmlId && hasId) {
      cursor -= 1;
      while (cursor >= 0 && lines[cursor].trim() === '') {
        cursor -= 1;
      }
    }

    const hasComment = cursor >= 0 && lines[cursor].trim() === `<!-- ANCHOR:${rule.commentId} -->`;
    if (!hasComment || (rule.includeHtmlId && !hasId)) {
      return true;
    }
  }

  return false;
}

function normalizeStandardAnchorScaffolding(body: string): string {
  const lines = body.split('\n');

  for (let index = 0; index < lines.length; index += 1) {
    const rule = STANDARD_ANCHOR_RULES.find((candidate) => candidate.headingPattern.test(lines[index]));
    if (!rule) {
      continue;
    }

    let replaceStart = index;
    while (replaceStart > 0 && lines[replaceStart - 1].trim() === '') {
      replaceStart -= 1;
    }
    if (replaceStart > 0 && /^<a id="[^"]+"><\/a>$/.test(lines[replaceStart - 1].trim())) {
      replaceStart -= 1;
    }
    if (replaceStart > 0 && /^<!-- ANCHOR:[^>]+ -->$/.test(lines[replaceStart - 1].trim())) {
      replaceStart -= 1;
    }

    const replacement = [`<!-- ANCHOR:${rule.commentId} -->`];
    if (rule.includeHtmlId) {
      replacement.push(`<a id="${rule.anchorId}"></a>`);
    }
    replacement.push('', lines[index]);

    lines.splice(replaceStart, index - replaceStart + 1, ...replacement);
    index = replaceStart + replacement.length - 1;
  }

  return lines.join('\n');
}

function normalizeMetadataSectionAnchors(body: string): string {
  const lines = body.split('\n');
  const headingIndex = lines.findIndex((line) => /^##\s+MEMORY METADATA\s*$/i.test(line.trim()));
  if (headingIndex === -1) {
    return body;
  }

  let sectionEnd = lines.length;
  for (let index = headingIndex + 1; index < lines.length; index += 1) {
    const trimmed = lines[index].trim();
    if (trimmed === '---' || trimmed.startsWith('*Generated by ')) {
      sectionEnd = index;
      break;
    }
  }

  for (let index = sectionEnd - 1; index > headingIndex; index -= 1) {
    if (lines[index].trim() === '<!-- ANCHOR:metadata -->') {
      lines.splice(index, 1);
      sectionEnd -= 1;
    }
  }
  for (let index = lines.length - 1; index > headingIndex; index -= 1) {
    if (lines[index].trim() === '<!-- /ANCHOR:metadata -->') {
      lines.splice(index, 1);
      if (index < sectionEnd) {
        sectionEnd -= 1;
      }
    }
  }

  while (sectionEnd > headingIndex && lines[sectionEnd - 1].trim() === '') {
    sectionEnd -= 1;
  }
  lines.splice(sectionEnd, 0, '', '<!-- /ANCHOR:metadata -->');

  return lines.join('\n');
}

function requiresAuthoritativeRegeneration(issues: HistoricalIssue[]): boolean {
  return issues.includes('malformed_frontmatter')
    || issues.includes('raw_mustache_literal')
    || issues.includes('literal_anchor_example');
}

function isLowSignalMemory(body: string, title: string | null): boolean {
  const summary = extractSummary(body) || '';
  const totalMessages = extractMetric(body, 'Total Messages');
  const toolExecutions = extractMetric(body, 'Tool Executions');
  const decisionsMade = extractMetric(body, 'Decisions Made');
  const normalizedTitle = sanitizeMemoryFrontmatterTitle(title);

  if (
    totalMessages !== null &&
    toolExecutions !== null &&
    decisionsMade !== null &&
    totalMessages <= 1 &&
    toolExecutions === 0 &&
    decisionsMade === 0
  ) {
    return true;
  }

  if (SUMMARY_GENERIC_PATTERNS.some((pattern) => pattern.test(summary))) {
    return true;
  }

  if (/^how\s+is used later/i.test(normalizedTitle)) {
    return true;
  }

  return false;
}

function buildFrontmatter(
  frontmatter: HistoricalMemoryFrontmatter,
  specFolder: string,
  body: string
): { frontmatterBlock: string; triggerPhrases: string[] } {
  const heading = extractHeading(body);
  const summary = extractSummary(body);
  const title = sanitizeMemoryFrontmatterTitle(frontmatter.title || heading || path.basename(specFolder))
    || sanitizeMemoryFrontmatterTitle(heading)
    || 'Session Memory';
  const description = hasGenericMemoryDescription(frontmatter.description)
    ? deriveMemoryDescription({ summary, heading, title })
    : deriveMemoryDescription({
        summary: frontmatter.description || summary,
        heading,
        title,
      });
  const triggerPhrases = deriveMemoryTriggerPhrases({
    title,
    description,
    summary,
    specFolder,
    existing: frontmatter.triggerPhrases,
  });
  const importanceTier = frontmatter.importanceTier || 'normal';
  const contextType = frontmatter.contextType || 'general';

  const lines: string[] = [
    '---',
    `title: "${title.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`,
    `description: "${description.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`,
  ];

  if (triggerPhrases.length === 0) {
    lines.push('trigger_phrases: []');
  } else {
    lines.push('trigger_phrases:');
    for (const phrase of triggerPhrases) {
      lines.push(`  - "${phrase.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`);
    }
  }

  lines.push(`importance_tier: "${importanceTier}"`);
  lines.push(`contextType: "${contextType}"`);

  for (const section of frontmatter.unknownSections) {
    lines.push(...section.lines);
  }

  lines.push('---', '');
  return {
    frontmatterBlock: lines.join('\n'),
    triggerPhrases,
  };
}

function renderTriggerPhraseSection(triggerPhrases: string[], headingLine = '# Trigger Phrases (auto-extracted for fast <50ms matching)'): string {
  const lines = [headingLine];
  if (triggerPhrases.length === 0) {
    lines.push('trigger_phrases: []');
    return `${lines.join('\n')}\n`;
  }

  lines.push('trigger_phrases:');
  for (const phrase of triggerPhrases) {
    lines.push(`  - "${phrase.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`);
  }

  return `${lines.join('\n')}\n`;
}

function normalizeTriggerPhraseSection(body: string, triggerPhrases: string[]): string {
  const section = findTriggerPhraseSection(body);
  if (!section) {
    return body;
  }

  const renderedSection = renderTriggerPhraseSection(triggerPhrases, section.headingLine).trimEnd();
  return `${body.slice(0, section.startOffset)}${renderedSection}${body.slice(section.endOffset)}`;
}

function moveToQuarantine(filePath: string, quarantinePath: string): void {
  fs.mkdirSync(path.dirname(quarantinePath), { recursive: true });
  if (fs.existsSync(quarantinePath)) {
    fs.rmSync(quarantinePath, { force: true });
  }
  fs.renameSync(filePath, quarantinePath);
}

export function auditHistoricalMemoryFile(filePath: string, root: string, content: string): HistoricalMemoryAuditEntry {
  const relativePath = getRelativeSpecPath(filePath, root);
  const specFolder = getSpecFolderFromMemoryPath(filePath, root);
  const detection = detectFrontmatter(content);
  const frontmatter = parseFrontmatterSections(content);
  const body = extractBody(content);
  const bodyTriggerPhrases = extractBodyTriggerPhrases(body);
  const issues: HistoricalIssue[] = [];

  if (detection.malformed) {
    issues.push('malformed_frontmatter');
  }
  if (
    hasLegacyGenericTriggerPhrases(frontmatter.triggerPhrases)
    || containsLegacyGenericTriggerPhrase(frontmatter.triggerPhrases)
    || hasLegacyGenericTriggerPhrases(bodyTriggerPhrases)
    || containsLegacyGenericTriggerPhrase(bodyTriggerPhrases)
  ) {
    issues.push('legacy_generic_trigger_phrases');
  }
  if (hasGenericMemoryDescription(frontmatter.description)) {
    issues.push('generic_description');
  }
  if (hasRawMustacheLiteral(body)) {
    issues.push('raw_mustache_literal');
  }
  if (hasLiteralAnchorExample(body)) {
    issues.push('literal_anchor_example');
  }
  if (hasLegacyTemplateBanner(body)) {
    issues.push('legacy_template_banner');
  }
  const bodyWithoutBanner = stripLegacyTemplateBanner(body);
  if (hasDuplicateBodySeparator(bodyWithoutBanner)) {
    issues.push('duplicate_body_separator');
  }
  if (hasMissingStandardAnchorScaffolding(bodyWithoutBanner)) {
    issues.push('missing_standard_anchor_scaffolding');
  }

  const sanitizedTitle = sanitizeMemoryFrontmatterTitle(frontmatter.title);
  if (frontmatter.title && sanitizedTitle && sanitizedTitle !== frontmatter.title) {
    issues.push('corrupted_title');
  }
  if (isLowSignalMemory(body, frontmatter.title)) {
    issues.push('low_signal_content');
  }
  const templateContract = validateMemoryTemplateContract(content);
  if (!templateContract.valid && templateContract.missingAnchors.length > 0 && !issues.includes('missing_standard_anchor_scaffolding')) {
    issues.push('missing_standard_anchor_scaffolding');
  }

  let classification: HistoricalClassification = 'clean';
  if (issues.length > 0 || !templateContract.valid) {
    classification = 'repair_in_place';
  }

  if (classification === 'repair_in_place' && requiresAuthoritativeRegeneration(issues)) {
    classification = 'regenerate_from_authoritative_evidence';
  }

  if (
    issues.includes('malformed_frontmatter') ||
    issues.includes('low_signal_content') ||
    MANUAL_QUARANTINE_SUFFIXES.has(relativePath)
  ) {
    classification = 'quarantine';
  }

  return {
    path: filePath,
    specFolder,
    issues,
    classification,
    repairStrategy: classification === 'repair_in_place'
      ? 'frontmatter_normalization'
      : classification === 'regenerate_from_authoritative_evidence'
        ? 'pipeline_regeneration'
      : classification === 'quarantine'
        ? 'quarantine_move'
        : 'none',
    indexAction: classification === 'repair_in_place'
      ? 'reindex'
      : classification === 'regenerate_from_authoritative_evidence'
        ? 'regenerate_then_reindex'
      : classification === 'quarantine'
        ? 'deindex'
        : 'keep',
    quarantinePath: classification === 'quarantine' || classification === 'regenerate_from_authoritative_evidence'
      ? path.join(path.dirname(path.dirname(filePath)), 'scratch', 'legacy-memory-quarantine', path.basename(filePath))
      : null,
    templateContract,
  };
}

export function buildHistoricalMemoryAuditManifest(root: string, files: HistoricalMemoryAuditEntry[]): HistoricalMemoryAuditManifest {
  const bySpecFolder: HistoricalMemoryAuditManifest['bySpecFolder'] = {};
  for (const entry of files) {
    const current = bySpecFolder[entry.specFolder] || {
      total: 0,
      repair_in_place: 0,
      regenerate_from_authoritative_evidence: 0,
      quarantine: 0,
    };
    current.total += 1;
    if (entry.classification === 'repair_in_place') {
      current.repair_in_place += 1;
    } else if (entry.classification === 'regenerate_from_authoritative_evidence') {
      current.regenerate_from_authoritative_evidence += 1;
    } else if (entry.classification === 'quarantine') {
      current.quarantine += 1;
    }
    bySpecFolder[entry.specFolder] = current;
  }

  return {
    generatedAt: new Date().toISOString(),
    root,
    summary: {
      total: files.length,
      clean: files.filter((entry) => entry.classification === 'clean').length,
      repair_in_place: files.filter((entry) => entry.classification === 'repair_in_place').length,
      regenerate_from_authoritative_evidence: files.filter(
        (entry) => entry.classification === 'regenerate_from_authoritative_evidence'
      ).length,
      quarantine: files.filter((entry) => entry.classification === 'quarantine').length,
    },
    bySpecFolder,
    files,
  };
}

function serializeSummary(manifest: HistoricalMemoryAuditManifest): string {
  const lines = [
    '# Historical Memory Remediation Summary',
    '',
    `Generated: ${manifest.generatedAt}`,
    `Root: ${manifest.root}`,
    '',
    `- Total memory files: ${manifest.summary.total}`,
    `- Clean: ${manifest.summary.clean}`,
    `- Repair in place: ${manifest.summary.repair_in_place}`,
    `- Regenerate from authoritative evidence: ${manifest.summary.regenerate_from_authoritative_evidence}`,
    `- Quarantine: ${manifest.summary.quarantine}`,
    '',
    '## By Spec Folder',
    '',
    '| Spec Folder | Total | Repair | Regenerate | Quarantine |',
    '|-------------|-------|--------|------------|------------|',
  ];

  for (const [specFolder, counts] of Object.entries(manifest.bySpecFolder).sort(([left], [right]) => left.localeCompare(right))) {
    lines.push(
      `| ${specFolder} | ${counts.total} | ${counts.repair_in_place} | ${counts.regenerate_from_authoritative_evidence} | ${counts.quarantine} |`
    );
  }

  lines.push('', '## Non-Clean Files', '');
  for (const entry of manifest.files.filter((file) => file.classification !== 'clean')) {
    const detail = entry.issues.length > 0
      ? entry.issues.join(', ')
      : entry.templateContract.violations.map((violation: { code: string }) => violation.code).join(', ');
    lines.push(`- ${getRelativeSpecPath(entry.path, manifest.root)} :: ${entry.classification} :: ${detail}`);
  }

  return `${lines.join('\n')}\n`;
}

export function repairHistoricalMemoryContent(filePath: string, root: string, content: string): string {
  const specFolder = getSpecFolderFromMemoryPath(filePath, root);
  const frontmatter = parseFrontmatterSections(content);
  const body = extractBody(content);
  const cleanedBody = normalizeMetadataSectionAnchors(
    normalizeStandardAnchorScaffolding(
      stripDuplicateBodySeparator(stripLegacyTemplateBanner(body))
    )
  ).replace(/^\n+/, '');
  const { frontmatterBlock, triggerPhrases } = buildFrontmatter(frontmatter, specFolder, cleanedBody);
  const normalizedBody = normalizeTriggerPhraseSection(cleanedBody, triggerPhrases);
  return `${frontmatterBlock}\n${normalizedBody}`;
}

export function runHistoricalMemoryRemediation(options: RunOptions): HistoricalMemoryAuditManifest {
  const files = discoverMemoryFiles(options.root);
  const auditEntries = files.map((filePath) => auditHistoricalMemoryFile(filePath, options.root, fs.readFileSync(filePath, 'utf-8')));
  const manifest = buildHistoricalMemoryAuditManifest(options.root, auditEntries);

  fs.mkdirSync(options.reportDir, { recursive: true });
  fs.writeFileSync(path.join(options.reportDir, 'manifest.json'), JSON.stringify(manifest, null, 2));
  fs.writeFileSync(path.join(options.reportDir, 'summary.md'), serializeSummary(manifest));

  if (!options.apply) {
    return manifest;
  }

  for (const entry of auditEntries) {
    if (entry.classification === 'repair_in_place') {
      const original = fs.readFileSync(entry.path, 'utf-8');
      const repaired = repairHistoricalMemoryContent(entry.path, options.root, original);
      const repairedContract = validateMemoryTemplateContract(repaired);
      if (!repairedContract.valid) {
        const quarantinePath = entry.quarantinePath
          ?? path.join(path.dirname(path.dirname(entry.path)), 'scratch', 'legacy-memory-quarantine', path.basename(entry.path));
        moveToQuarantine(entry.path, quarantinePath);
        continue;
      }
      if (repaired !== original) {
        fs.writeFileSync(entry.path, repaired, 'utf-8');
      }
      continue;
    }

    if (entry.classification === 'regenerate_from_authoritative_evidence' && entry.quarantinePath) {
      moveToQuarantine(entry.path, entry.quarantinePath);
      continue;
    }

    if (entry.classification === 'quarantine' && entry.quarantinePath) {
      moveToQuarantine(entry.path, entry.quarantinePath);
    }
  }

  return manifest;
}

if (require.main === module) {
  try {
    const options = parseArgs(process.argv.slice(2));
    const manifest = runHistoricalMemoryRemediation(options);
    console.log(JSON.stringify(manifest.summary, null, 2));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(message);
    process.exit(1);
  }
}
