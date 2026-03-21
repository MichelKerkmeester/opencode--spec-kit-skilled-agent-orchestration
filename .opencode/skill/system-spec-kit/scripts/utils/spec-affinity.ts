// ---------------------------------------------------------------
// MODULE: Spec Affinity
// ---------------------------------------------------------------

// ───────────────────────────────────────────────────────────────
// 1. SPEC AFFINITY
// ───────────────────────────────────────────────────────────────
// Builds spec-specific anchors from a target spec folder and evaluates
// whether captured-session content is actually about that spec rather
// than merely coming from the same workspace.

import * as fs from 'fs';
import * as path from 'path';
import type { CollectedDataSubset } from '../types/session-types';

const SPEC_ID_REGEX = /\b\d{3}-[a-z0-9][a-z0-9-]*\b/g;
const KEYWORD_STOPWORDS = new Set([
  'about',
  'after',
  'align',
  'aligned',
  'and',
  'before',
  'build',
  'change',
  'changes',
  'closure',
  'configuration',
  'context',
  'documentation',
  'feature',
  'file',
  'files',
  'flow',
  'from',
  'hardening',
  'implementation',
  'improve',
  'into',
  'management',
  'mode',
  'native',
  'note',
  'notes',
  'part',
  'path',
  'paths',
  'phase',
  'plan',
  'processing',
  'quality',
  'requirements',
  'save',
  'session',
  'spec',
  'specification',
  'state',
  'system',
  'task',
  'tests',
  'the',
  'their',
  'this',
  'through',
  'tool',
  'update',
  'workflow',
  'workflows',
]);

export interface SpecAffinityTargets {
  specFolderHint: string;
  resolvedSpecFolderPath: string | null;
  specId: string | null;
  exactPhrases: string[];
  strongKeywordTokens: string[];
  fileTargets: string[];
}

export interface SpecAffinityEvaluation {
  hasAnchor: boolean;
  matchedFileTargets: string[];
  matchedPhrases: string[];
  matchedKeywordTokens: string[];
  matchedSpecId: boolean;
  foreignSpecIds: string[];
}

type SpecAffinityCollectedData = CollectedDataSubset<'userPrompts' | 'recentContext' | 'observations' | 'FILES' | 'SUMMARY'>;

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizePathLike(value: string): string {
  return value
    .replace(/\\/g, '/')
    .replace(/`/g, '')
    .trim()
    .replace(/\/+/g, '/')
    .replace(/^\.\/+/, '')
    .replace(/\/+$/, '')
    .toLowerCase();
}

function uniqueStrings(values: Array<string | null | undefined>): string[] {
  const seen = new Set<string>();
  const ordered: string[] = [];

  for (const value of values) {
    if (!value) {
      continue;
    }

    const trimmed = value.trim();
    if (!trimmed || seen.has(trimmed)) {
      continue;
    }

    seen.add(trimmed);
    ordered.push(trimmed);
  }

  return ordered;
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function containsWordBoundary(normalizedText: string, phrase: string): boolean {
  if (!normalizedText || !phrase) {
    return false;
  }

  const normalizedPhrase = phrase.trim();
  if (!normalizedPhrase) {
    return false;
  }

  const pattern = new RegExp(`(^| )${escapeRegex(normalizedPhrase)}(?= |$)`);
  return pattern.test(normalizedText);
}

function extractSpecIds(value: string): string[] {
  return Array.from(new Set((value.match(SPEC_ID_REGEX) || []).map((specId) => specId.toLowerCase())));
}

function resolveSpecFolderPathCandidates(specFolderHint: string): string[] {
  if (!specFolderHint.trim()) {
    return [];
  }

  const cwd = process.cwd();
  const rawCandidates = [
    specFolderHint,
    path.resolve(specFolderHint),
    path.join(cwd, specFolderHint),
    path.join(cwd, 'specs', specFolderHint),
    path.join(cwd, '.opencode', 'specs', specFolderHint),
  ];

  return uniqueStrings(rawCandidates.map((candidate) => path.resolve(candidate)))
    .filter((candidate) => {
      try {
        return fs.statSync(candidate).isDirectory();
      } catch {
        return false;
      }
    });
}

function readFileSafe(filePath: string): string | null {
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch {
    return null;
  }
}

function parseFrontmatterValue(content: string | null, keyName: string): string[] {
  if (!content) {
    return [];
  }

  const blockMatch = content.match(/^---\s*\n([\s\S]*?)\n---\s*\n?/);
  if (!blockMatch) {
    return [];
  }

  const lines = blockMatch[1].split('\n');
  const values: string[] = [];
  let collectingList = false;

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();
    const kvMatch = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);

    if (kvMatch) {
      collectingList = kvMatch[1] === keyName && kvMatch[2].trim().length === 0;
      if (kvMatch[1] === keyName && kvMatch[2].trim().length > 0) {
        values.push(kvMatch[2].trim().replace(/^['"]|['"]$/g, ''));
      }
      continue;
    }

    if (!collectingList) {
      continue;
    }

    const itemMatch = line.match(/^\s*-\s+(.*)$/);
    if (itemMatch) {
      values.push(itemMatch[1].trim().replace(/^['"]|['"]$/g, ''));
      continue;
    }

    if (line.trim() !== '') {
      collectingList = false;
    }
  }

  return values;
}

function extractFilesToChange(content: string | null): string[] {
  if (!content) {
    return [];
  }

  const filesSection = content.match(/###\s+Files to Change[\s\S]*?(?=\n###\s+|\n##\s+|$)/i)?.[0] || '';
  const rows = Array.from(filesSection.matchAll(/\|\s*`?([^`|\n]+?)`?\s*\|\s*[^|\n]*\|\s*([^|\n]+?)\s*\|/g));

  return uniqueStrings(rows.map(([_, rawPath]) => normalizePathLike(rawPath)))
    .filter((rawPath) => rawPath.length > 0 && !/^(file path|-+)$/.test(rawPath));
}

function readSpecMetadata(specFolderHint: string): {
  resolvedSpecFolderPath: string | null;
  titleCandidates: string[];
  triggerPhraseCandidates: string[];
  fileTargets: string[];
} {
  const resolvedSpecFolderPath = resolveSpecFolderPathCandidates(specFolderHint)[0] || null;
  if (!resolvedSpecFolderPath) {
    return {
      resolvedSpecFolderPath: null,
      titleCandidates: [],
      triggerPhraseCandidates: [],
      fileTargets: [],
    };
  }

  const specDoc = readFileSafe(path.join(resolvedSpecFolderPath, 'spec.md'));
  const descriptionDoc = readFileSafe(path.join(resolvedSpecFolderPath, 'description.json'));

  let descriptionTitle = '';
  let descriptionTriggerPhrases: string[] = [];
  if (descriptionDoc) {
    try {
      const parsed = JSON.parse(descriptionDoc) as Record<string, unknown>;
      if (typeof parsed.title === 'string') {
        descriptionTitle = parsed.title;
      } else if (typeof parsed.name === 'string') {
        descriptionTitle = parsed.name;
      }

      if (Array.isArray(parsed.triggerPhrases)) {
        descriptionTriggerPhrases = parsed.triggerPhrases.filter((value): value is string => typeof value === 'string');
      }
    } catch {
      // Ignore malformed description.json for affinity hints.
    }
  }

  const frontmatterTitles = parseFrontmatterValue(specDoc, 'title');
  const triggerPhrases = parseFrontmatterValue(specDoc, 'trigger_phrases');

  return {
    resolvedSpecFolderPath,
    titleCandidates: uniqueStrings([descriptionTitle, ...frontmatterTitles]),
    triggerPhraseCandidates: uniqueStrings([...triggerPhrases, ...descriptionTriggerPhrases]),
    fileTargets: extractFilesToChange(specDoc),
  };
}

function buildSlugCandidates(specFolderHint: string): string[] {
  // O4-11: Extract slug candidates from ALL path segments, not just the last one
  const segments = specFolderHint
    .replace(/\\/g, '/')
    .split('/')
    .filter(Boolean);

  const slugCandidates: string[] = [];
  for (const segment of segments) {
    const slug = segment.replace(/^\d{3}-/, '').trim();
    if (slug.length >= 6) {
      slugCandidates.push(slug);
    }
  }

  const allCandidates: string[] = [];
  for (const slug of slugCandidates) {
    const normalizedSlug = normalizeText(slug);
    allCandidates.push(slug, slug.replace(/-/g, ' '), normalizedSlug);
  }

  return uniqueStrings(allCandidates).filter((value) => normalizeText(value).length >= 6);
}

function buildStrongKeywordTokens(values: string[]): string[] {
  const tokens = new Set<string>();

  for (const value of values) {
    const normalized = normalizeText(value);
    for (const token of normalized.split(' ')) {
      if (token.length < 4 || KEYWORD_STOPWORDS.has(token)) {
        continue;
      }
      tokens.add(token);
    }
  }

  return Array.from(tokens);
}

export function buildSpecAffinityTargets(specFolderHint?: string | null): SpecAffinityTargets {
  const safeHint = typeof specFolderHint === 'string' ? specFolderHint.trim() : '';
  const specId = safeHint ? extractSpecIds(safeHint).at(-1) || null : null;
  const metadata = safeHint
    ? readSpecMetadata(safeHint)
    : {
        resolvedSpecFolderPath: null,
        titleCandidates: [],
        triggerPhraseCandidates: [],
        fileTargets: [],
      };

  const slugCandidates = safeHint ? buildSlugCandidates(safeHint) : [];
  const exactPhrases = uniqueStrings(
    [
      specId,
      ...slugCandidates,
      ...metadata.titleCandidates,
      ...metadata.triggerPhraseCandidates,
    ]
      .filter((value): value is string => typeof value === 'string')
      .map((value) => normalizeText(value))
  ).filter((value) => {
    if (value.length < 6) {
      return false;
    }

    const words = value.split(' ').filter(Boolean);
    if (words.length === 1 && KEYWORD_STOPWORDS.has(words[0])) {
      return false;
    }

    return true;
  });

  return {
    specFolderHint: safeHint,
    resolvedSpecFolderPath: metadata.resolvedSpecFolderPath,
    specId,
    exactPhrases,
    strongKeywordTokens: buildStrongKeywordTokens([
      ...slugCandidates,
      ...metadata.titleCandidates,
      ...metadata.triggerPhraseCandidates,
    ]),
    fileTargets: metadata.fileTargets,
  };
}

export function matchesSpecAffinityFilePath(filePath: string, targets: SpecAffinityTargets): boolean {
  const normalizedPath = normalizePathLike(filePath);
  if (!normalizedPath) {
    return false;
  }

  return targets.fileTargets.some((target) => (
    normalizedPath === target
    || normalizedPath.endsWith(`/${target}`)
    || normalizedPath.includes(`/${target}/`)
  ));
}

function countKeywordMatches(normalizedText: string, strongKeywordTokens: string[]): string[] {
  return strongKeywordTokens.filter((token) => containsWordBoundary(normalizedText, token));
}

export function evaluateSpecAffinityText(text: string, targets: SpecAffinityTargets): {
  matchedFileTargets: string[];
  matchedPhrases: string[];
  matchedKeywordTokens: string[];
  matchedSpecId: boolean;
  foreignSpecIds: string[];
} {
  const rawText = typeof text === 'string' ? text : '';
  const normalizedText = normalizeText(rawText);
  const normalizedPathText = normalizePathLike(rawText);

  const matchedFileTargets = targets.fileTargets.filter((target) => (
    normalizedPathText.includes(target)
    || normalizedPathText.endsWith(`/${target}`)
  ));
  const matchedPhrases = targets.exactPhrases.filter((phrase) => containsWordBoundary(normalizedText, phrase));
  const matchedKeywordTokens = countKeywordMatches(normalizedText, targets.strongKeywordTokens);
  const discoveredIds = extractSpecIds(rawText);
  const matchedSpecId = Boolean(targets.specId && discoveredIds.includes(targets.specId));
  const foreignSpecIds = discoveredIds.filter((specId) => specId !== targets.specId);

  return {
    matchedFileTargets,
    matchedPhrases,
    matchedKeywordTokens,
    matchedSpecId,
    foreignSpecIds,
  };
}

export function matchesSpecAffinityText(text: string, targets: SpecAffinityTargets): boolean {
  const evaluation = evaluateSpecAffinityText(text, targets);
  return (
    evaluation.matchedFileTargets.length > 0
    || evaluation.matchedPhrases.length > 0
    || evaluation.matchedSpecId
    || evaluation.matchedKeywordTokens.length >= 3
  );
}

function gatherCollectedDataText(data: SpecAffinityCollectedData): string[] {
  const texts: string[] = [];

  for (const prompt of data.userPrompts || []) {
    if (typeof prompt?.prompt === 'string') {
      texts.push(prompt.prompt);
    }
  }

  for (const context of data.recentContext || []) {
    if (typeof context?.request === 'string') {
      texts.push(context.request);
    }
    if (typeof context?.learning === 'string') {
      texts.push(context.learning);
    }
  }

  for (const observation of data.observations || []) {
    if (typeof observation?.title === 'string') {
      texts.push(observation.title);
    }
    if (typeof observation?.narrative === 'string') {
      texts.push(observation.narrative);
    }

    for (const fact of observation?.facts || []) {
      if (typeof fact === 'string') {
        texts.push(fact);
      } else if (fact && typeof fact.text === 'string') {
        texts.push(fact.text);
      }
    }
  }

  for (const file of data.FILES || []) {
    if (typeof file?.DESCRIPTION === 'string') {
      texts.push(file.DESCRIPTION);
    } else if (typeof file?.description === 'string') {
      texts.push(file.description);
    }
  }

  if (typeof data.SUMMARY === 'string') {
    texts.push(data.SUMMARY);
  }

  return texts;
}

function gatherCollectedDataPaths(data: SpecAffinityCollectedData): string[] {
  const paths: string[] = [];

  for (const observation of data.observations || []) {
    for (const filePath of observation?.files || []) {
      if (typeof filePath === 'string') {
        paths.push(filePath);
      }
    }
  }

  for (const file of data.FILES || []) {
    const filePath = typeof file?.FILE_PATH === 'string'
      ? file.FILE_PATH
      : (typeof file?.path === 'string' ? file.path : '');
    if (filePath) {
      paths.push(filePath);
    }
  }

  return paths;
}

export function evaluateCollectedDataSpecAffinity(
  data: SpecAffinityCollectedData,
  targetsOrHint: SpecAffinityTargets | string,
): SpecAffinityEvaluation {
  const targets = typeof targetsOrHint === 'string'
    ? buildSpecAffinityTargets(targetsOrHint)
    : targetsOrHint;

  const matchedFileTargets = new Set<string>();
  const matchedPhrases = new Set<string>();
  const matchedKeywordTokens = new Set<string>();
  const foreignSpecIds = new Set<string>();
  let matchedSpecId = false;

  for (const filePath of gatherCollectedDataPaths(data)) {
    if (matchesSpecAffinityFilePath(filePath, targets)) {
      matchedFileTargets.add(normalizePathLike(filePath));
    }

    const filePathEvaluation = evaluateSpecAffinityText(filePath, targets);
    for (const target of filePathEvaluation.matchedFileTargets) {
      matchedFileTargets.add(target);
    }
    for (const phrase of filePathEvaluation.matchedPhrases) {
      matchedPhrases.add(phrase);
    }
    for (const token of filePathEvaluation.matchedKeywordTokens) {
      matchedKeywordTokens.add(token);
    }
    if (filePathEvaluation.matchedSpecId) {
      matchedSpecId = true;
    }
    for (const specId of filePathEvaluation.foreignSpecIds) {
      foreignSpecIds.add(specId);
    }
  }

  for (const text of gatherCollectedDataText(data)) {
    const evaluation = evaluateSpecAffinityText(text, targets);
    for (const target of evaluation.matchedFileTargets) {
      matchedFileTargets.add(target);
    }
    for (const phrase of evaluation.matchedPhrases) {
      matchedPhrases.add(phrase);
    }
    if (evaluation.matchedKeywordTokens.length >= 2) {
      for (const token of evaluation.matchedKeywordTokens) {
        matchedKeywordTokens.add(token);
      }
    }
    if (evaluation.matchedSpecId) {
      matchedSpecId = true;
    }
    for (const specId of evaluation.foreignSpecIds) {
      foreignSpecIds.add(specId);
    }
  }

  const hasAnchor = (
    matchedFileTargets.size > 0
    || matchedPhrases.size > 0
    || matchedSpecId
    || matchedKeywordTokens.size >= 2
  );

  return {
    hasAnchor,
    matchedFileTargets: Array.from(matchedFileTargets),
    matchedPhrases: Array.from(matchedPhrases),
    matchedKeywordTokens: Array.from(matchedKeywordTokens),
    matchedSpecId,
    foreignSpecIds: Array.from(foreignSpecIds),
  };
}

export {
  extractSpecIds,
  normalizePathLike,
  normalizeText,
};
