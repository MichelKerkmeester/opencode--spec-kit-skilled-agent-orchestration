// ───────────────────────────────────────────────────────────────
// MODULE: Derived Metadata Extractor
// ───────────────────────────────────────────────────────────────

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { basename, dirname, extname, join, relative, resolve } from 'node:path';
import { applyAntiStuffing } from './anti-stuffing.js';
import { computeProvenanceFingerprint, fileDependency, type ProvenanceBuckets } from './provenance.js';
import { sanitizeDerivedArray } from './sanitizer.js';
import type { DerivedSourceCategory } from './trust-lanes.js';

// ───────────────────────────────────────────────────────────────
// 1. TYPES
// ───────────────────────────────────────────────────────────────

export interface ExtractDerivedOptions {
  readonly workspaceRoot: string;
  readonly skillDir: string;
  readonly now?: Date;
}

export interface DerivedExtractionResult {
  readonly triggerPhrases: string[];
  readonly keywords: string[];
  readonly sourceDocs: string[];
  readonly keyFiles: string[];
  readonly buckets: ProvenanceBuckets;
  readonly provenanceFingerprint: string;
  readonly diagnostics: string[];
}

// ───────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────

const SKILL_MD = ['SKILL', 'md'].join('.');
const GRAPH_METADATA = 'graph-metadata.json';
const STOP_WORDS = new Set([
  'the', 'and', 'for', 'with', 'from', 'that', 'this', 'into', 'when', 'then', 'than', 'use',
  'uses', 'using', 'your', 'you', 'are', 'can', 'all', 'not', 'must', 'should', 'will', 'skill',
  'skills', 'file', 'files', 'code', 'system', 'workflow', 'workflows',
]);
const SOURCE_CATEGORIES: readonly DerivedSourceCategory[] = [
  'frontmatter',
  'headings',
  'body',
  'examples',
  'references',
  'assets',
  'intent_signals',
  'source_docs',
  'key_files',
];

// ───────────────────────────────────────────────────────────────
// 3. PARSING HELPERS
// ───────────────────────────────────────────────────────────────

function emptyBuckets(): Record<DerivedSourceCategory, string[]> {
  return {
    frontmatter: [],
    headings: [],
    body: [],
    examples: [],
    references: [],
    assets: [],
    intent_signals: [],
    source_docs: [],
    key_files: [],
  };
}

function readJson(filePath: string): Record<string, unknown> {
  if (!existsSync(filePath)) return {};
  const parsed: unknown = JSON.parse(readFileSync(filePath, 'utf8'));
  return typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed) ? parsed as Record<string, unknown> : {};
}

function splitSkillMarkdown(raw: string): { frontmatter: Record<string, string>; body: string; keywords: string[] } {
  const frontmatter: Record<string, string> = {};
  let body = raw;
  if (raw.startsWith('---\n')) {
    const end = raw.indexOf('\n---', 4);
    if (end > 4) {
      const frontmatterRaw = raw.slice(4, end);
      body = raw.slice(end + 4);
      for (const line of frontmatterRaw.split(/\r?\n/)) {
        const match = /^([A-Za-z0-9_-]+):\s*(.*)$/.exec(line);
        if (match) {
          frontmatter[match[1]] = match[2].replace(/^["']|["']$/g, '').trim();
        }
      }
    }
  }
  const keywordMatch = /<!--\s*Keywords:\s*([\s\S]*?)-->/i.exec(raw);
  const keywords = keywordMatch
    ? keywordMatch[1].split(',').map((entry) => entry.trim()).filter(Boolean)
    : [];
  return { frontmatter, body, keywords };
}

function markdownHeadings(markdown: string): string[] {
  const headings: string[] = [];
  let inFence = false;
  for (const line of markdown.split(/\r?\n/)) {
    if (/^\s*```/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const match = /^\s{0,3}#{1,6}\s+(.+?)\s*$/.exec(line);
    if (match) headings.push(match[1].replace(/[#*_`]/g, '').trim());
  }
  return headings;
}

function codeBlocks(markdown: string): string[] {
  const blocks: string[] = [];
  const regex = /```[A-Za-z0-9_-]*\n([\s\S]*?)```/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(markdown)) !== null) {
    blocks.push(match[1]);
  }
  return blocks;
}

function stripMarkdown(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/[>#*_~()[\]{}:]/g, ' ');
}

function normalizePhrase(value: string): string {
  return value
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_./-]+/g, ' ')
    .replace(/[^A-Za-z0-9 ]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function ngrams(text: string): string[] {
  const tokens = normalizePhrase(text)
    .split(' ')
    .filter((token) => token.length >= 3 && !STOP_WORDS.has(token));
  const phrases: string[] = [];
  for (let size = 1; size <= 3; size += 1) {
    for (let index = 0; index <= tokens.length - size; index += 1) {
      phrases.push(tokens.slice(index, index + size).join(' '));
    }
  }
  return phrases;
}

function walkFiles(root: string): string[] {
  if (!existsSync(root)) return [];
  const found: string[] = [];
  const stack = [root];
  while (stack.length > 0) {
    // stack.length was checked immediately before popping the next directory.
    const current = stack.pop()!;
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      const path = join(current, entry.name);
      if (entry.isDirectory()) stack.push(path);
      if (entry.isFile()) found.push(path);
    }
  }
  return found.sort((left, right) => left.localeCompare(right));
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((entry): entry is string => typeof entry === 'string') : [];
}

// ───────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ───────────────────────────────────────────────────────────────

export function extractDerivedMetadata(options: ExtractDerivedOptions): DerivedExtractionResult {
  const workspaceRoot = resolve(options.workspaceRoot);
  const skillDir = resolve(options.skillDir);
  const skillMdPath = join(skillDir, SKILL_MD);
  const graphMetadataPath = join(skillDir, GRAPH_METADATA);
  const rawSkill = existsSync(skillMdPath) ? readFileSync(skillMdPath, 'utf8') : '';
  const parsedSkill = splitSkillMarkdown(rawSkill);
  const graphMetadata = readJson(graphMetadataPath);
  const priorDerived = typeof graphMetadata.derived === 'object' && graphMetadata.derived !== null
    ? graphMetadata.derived as Record<string, unknown>
    : {};
  const buckets = emptyBuckets();

  buckets.frontmatter.push(...Object.values(parsedSkill.frontmatter), ...parsedSkill.keywords);
  buckets.headings.push(...markdownHeadings(parsedSkill.body));
  buckets.body.push(...ngrams(stripMarkdown(parsedSkill.body)));
  buckets.examples.push(...codeBlocks(parsedSkill.body).flatMap((block) => ngrams(block)));

  const referenceFiles = walkFiles(join(skillDir, 'references')).filter((file) => extname(file).toLowerCase() === '.md');
  for (const file of referenceFiles) {
    buckets.references.push(...markdownHeadings(readFileSync(file, 'utf8')));
  }

  const assetFiles = walkFiles(join(skillDir, 'assets'));
  buckets.assets.push(...assetFiles.map((file) => basename(file, extname(file))));
  buckets.intent_signals.push(...stringArray(graphMetadata.intent_signals));
  buckets.source_docs.push(...stringArray(priorDerived.source_docs));
  buckets.key_files.push(...stringArray(priorDerived.key_files));

  const rawTriggerCandidates = [
    ...buckets.frontmatter,
    ...buckets.headings,
    ...buckets.references,
    ...buckets.intent_signals,
    ...buckets.assets,
    ...buckets.source_docs,
    ...buckets.key_files,
  ].flatMap((value) => [value, ...ngrams(value)]).map(normalizePhrase);
  const rawKeywordCandidates = [
    ...rawTriggerCandidates,
    ...buckets.body,
    ...buckets.examples,
  ].map(normalizePhrase);

  const sourceDocs = sanitizeDerivedArray([
    SKILL_MD,
    ...referenceFiles.map((file) => relative(skillDir, file)),
    ...stringArray(priorDerived.source_docs),
  ], 'graph-metadata', 64);
  const keyFiles = sanitizeDerivedArray([
    relative(workspaceRoot, skillMdPath),
    relative(workspaceRoot, graphMetadataPath),
    ...assetFiles.map((file) => relative(workspaceRoot, file)),
    ...stringArray(priorDerived.key_files),
  ], 'graph-metadata', 64);

  const antiStuffing = applyAntiStuffing(rawTriggerCandidates, rawKeywordCandidates);
  const dependencies = [
    fileDependency(workspaceRoot, relative(workspaceRoot, skillMdPath)),
    fileDependency(workspaceRoot, relative(workspaceRoot, graphMetadataPath)),
    ...referenceFiles.map((file) => fileDependency(workspaceRoot, relative(workspaceRoot, file))),
    ...assetFiles.filter((file) => statSync(file).isFile()).map((file) => fileDependency(workspaceRoot, relative(workspaceRoot, file))),
    ...stringArray(priorDerived.key_files).map((file) => fileDependency(workspaceRoot, file)),
  ];
  const provenance = computeProvenanceFingerprint(buckets, dependencies);

  return {
    triggerPhrases: antiStuffing.triggerPhrases,
    keywords: antiStuffing.keywords,
    sourceDocs,
    keyFiles,
    buckets,
    provenanceFingerprint: provenance.provenanceFingerprint,
    diagnostics: antiStuffing.diagnostics,
  };
}
