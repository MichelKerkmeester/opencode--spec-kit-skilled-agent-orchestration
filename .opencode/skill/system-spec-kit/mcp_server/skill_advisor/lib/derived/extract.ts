// ───────────────────────────────────────────────────────────────
// MODULE: Derived Metadata Extractor
// ───────────────────────────────────────────────────────────────

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { basename, extname, join, relative, resolve } from 'node:path';
import { applyAntiStuffing } from './anti-stuffing.js';
import { computeProvenanceFingerprint, fileDependency, workspaceRelativeFilePath, type ProvenanceBuckets } from './provenance.js';
import { sanitizeDerivedArray } from './sanitizer.js';
import { readJsonObject } from '../utils/json-guard.js';
import { parseSkillFrontmatter } from '../utils/skill-markdown.js';
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
  return readJsonObject(filePath) ?? {};
}

function splitSkillMarkdown(raw: string): { frontmatter: Record<string, string>; body: string; keywords: string[] } {
  return parseSkillFrontmatter(raw);
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

function workspaceKeyFiles(workspaceRoot: string, value: unknown): string[] {
  return stringArray(value)
    .map((entry) => workspaceRelativeFilePath(workspaceRoot, entry))
    .filter((entry): entry is string => entry !== null);
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
  const priorKeyFiles = workspaceKeyFiles(workspaceRoot, priorDerived.key_files);
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
  // Note: priorDerived.source_docs and priorKeyFiles are merged into the final
  // `sourceDocs` and `keyFiles` arrays below to preserve stickiness, but they
  // are NOT pushed into the buckets here. Re-feeding them into the bucket
  // pipeline produces path-derived ngrams in trigger_phrases/keywords on every
  // resync, breaking idempotence for unchanged SKILL.md content.

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
    ...priorKeyFiles,
  ], 'graph-metadata', 64);

  const antiStuffing = applyAntiStuffing(rawTriggerCandidates, rawKeywordCandidates);
  // graph-metadata.json is intentionally excluded from the provenance hash:
  // syncDerivedMetadata writes the derived block back into it, so including
  // its hash would break idempotence (the second sync would see a different
  // hash because the first sync mutated the file). Authored graph-metadata
  // content (e.g. intent_signals) is already represented in the buckets.
  // Dependencies are deduplicated by path so priorKeyFiles entries that
  // overlap with the explicit SKILL.md / reference / asset list don't
  // double-count in the fingerprint.
  const graphMetadataRel = relative(workspaceRoot, graphMetadataPath);
  const dependencyMap = new Map<string, ReturnType<typeof fileDependency>>();
  const addDep = (relPath: string): void => {
    if (relPath === graphMetadataRel) return;
    if (dependencyMap.has(relPath)) return;
    dependencyMap.set(relPath, fileDependency(workspaceRoot, relPath));
  };
  addDep(relative(workspaceRoot, skillMdPath));
  for (const file of referenceFiles) addDep(relative(workspaceRoot, file));
  for (const file of assetFiles) {
    if (statSync(file).isFile()) addDep(relative(workspaceRoot, file));
  }
  for (const file of priorKeyFiles) addDep(file);
  const dependencies = [...dependencyMap.values()];
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
