// ---------------------------------------------------------------
// MODULE: Session Activity Signal
// ---------------------------------------------------------------

// ───────────────────────────────────────────────────────────────
// 1. SESSION ACTIVITY SIGNAL
// ───────────────────────────────────────────────────────────────
// Aggregates spec-relevant session activity that can help spec-folder
// auto-detection prefer the folder that is actually being worked on.

import type { CollectedDataBase, FactValue, Observation } from '../types/session-types';

/* ───────────────────────────────────────────────────────────────
   1. INTERFACES & CONSTANTS
------------------------------------------------------------------*/

export interface SessionActivitySignal {
  toolCallPaths: string[];
  gitChangedFiles: string[];
  transcriptMentions: string[];
  confidenceBoost: number;
}

const TOOL_FACT_RE = /\btool:\s*([a-z_ -]+)/i;
const TOOL_PATH_RE = /\b(?:file|path):\s*([^\s,;]+)/ig;
// REQ-004: 0.2 boost for read-like tools only (grep, glob are read-equivalent)
const TOOL_READ_SET = new Set(['read', 'grep', 'glob']);
// Inspect-like tools get a lower boost (0.1) to avoid inflating affinity signals
const TOOL_INSPECT_SET = new Set(['bash', 'view', 'task']);
const TOOL_WRITE_SET = new Set(['edit', 'write']);
const ACTIVITY_STOPWORDS = new Set([
  'system',
  'spec',
  'kit',
  'memory',
  'context',
  'session',
  'perfect',
  'capturing',
  'phase',
  'child',
  'parent',
]);

function normalizePath(value: string): string {
  return value.replace(/\\/g, '/').replace(/^\.\//, '').trim();
}

function uniqueStrings(values: string[]): string[] {
  return [...new Set(values.filter((value) => typeof value === 'string' && value.trim().length > 0))];
}

function coerceFactText(fact: FactValue): string {
  if (typeof fact === 'string') {
    return fact;
  }

  if (fact && typeof fact === 'object' && typeof fact.text === 'string') {
    return fact.text;
  }

  return '';
}

function collectFactFiles(fact: FactValue): string[] {
  if (!fact || typeof fact !== 'object' || Array.isArray(fact) || !Array.isArray(fact.files)) {
    return [];
  }

  return fact.files
    .map((file) => (typeof file === 'string' ? normalizePath(file) : ''))
    .filter(Boolean);
}

function extractObservationToolType(observation: Observation): string | null {
  if (!Array.isArray(observation.facts)) {
    return null;
  }

  for (const fact of observation.facts) {
    const factText = coerceFactText(fact);
    const match = factText.match(TOOL_FACT_RE);
    if (match?.[1]) {
      const normalized = match[1].trim().toLowerCase();
      const [toolType] = normalized.split(/\s+/);
      return toolType || null;
    }
  }

  return null;
}

function collectObservationPaths(observation: Observation): string[] {
  const paths = new Set<string>();

  for (const filePath of observation.files || []) {
    const normalized = normalizePath(filePath);
    if (normalized) {
      paths.add(normalized);
    }
  }

  for (const fact of observation.facts || []) {
    for (const filePath of collectFactFiles(fact)) {
      paths.add(filePath);
    }

    const factText = coerceFactText(fact);
    for (const match of factText.matchAll(TOOL_PATH_RE)) {
      const normalized = normalizePath(match[1] || '');
      if (normalized) {
        paths.add(normalized);
      }
    }
  }

  return [...paths];
}

/* ───────────────────────────────────────────────────────────────
   2. PATH MATCHING
------------------------------------------------------------------*/

function buildCandidateMatchers(candidateRelativePath: string): string[] {
  const normalized = normalizePath(candidateRelativePath).toLowerCase();
  const segments = normalized.split('/').filter(Boolean);
  const tokens = new Set<string>();

  for (const segment of segments) {
    tokens.add(segment);
    tokens.add(segment.replace(/^\d+[-_]?/, ''));

    for (const token of segment.replace(/^\d+[-_]?/, '').split(/[^a-z0-9]+/)) {
      if (token.length >= 3 && !ACTIVITY_STOPWORDS.has(token)) {
        tokens.add(token);
      }
    }
  }

  return [...tokens].filter((token) => token.length > 0);
}

function pathMatchesCandidate(filePath: string, candidateMatchers: string[]): boolean {
  const normalized = normalizePath(filePath).toLowerCase();
  return candidateMatchers.some((matcher) => (
    normalized.includes(matcher)
    || normalized.endsWith(`/${matcher}`)
  ));
}

function textMentionsCandidate(text: string, candidateMatchers: string[]): boolean {
  const normalized = text.toLowerCase();
  return candidateMatchers.some((matcher) => normalized.includes(matcher));
}

function buildTranscriptCorpus(collectedData: CollectedDataBase | null): string[] {
  if (!collectedData) {
    return [];
  }

  const texts: string[] = [];

  for (const prompt of collectedData.userPrompts || []) {
    if (typeof prompt.prompt === 'string') {
      texts.push(prompt.prompt);
    }
  }

  for (const observation of collectedData.observations || []) {
    if (typeof observation.title === 'string') {
      texts.push(observation.title);
    }
    if (typeof observation.narrative === 'string') {
      texts.push(observation.narrative);
    }
  }

  for (const context of collectedData.recentContext || []) {
    if (typeof context.request === 'string') {
      texts.push(context.request);
    }
    if (typeof context.learning === 'string') {
      texts.push(context.learning);
    }
  }

  return texts.filter(Boolean);
}

function normalizeGitChangedFiles(collectedData: CollectedDataBase | null): string[] {
  if (!collectedData) {
    return [];
  }

  const files: string[] = [];

  for (const entry of collectedData.filesModified || []) {
    if (typeof entry === 'string') {
      files.push(normalizePath(entry));
      continue;
    }

    if (entry && typeof entry === 'object' && typeof entry.path === 'string') {
      files.push(normalizePath(entry.path));
    }
  }

  return uniqueStrings(files);
}

function scoreToolPath(toolType: string | null): number {
  if (!toolType) {
    return 0;
  }

  if (TOOL_WRITE_SET.has(toolType)) {
    return 0.3;
  }

  if (TOOL_READ_SET.has(toolType)) {
    return 0.2;
  }

  if (TOOL_INSPECT_SET.has(toolType)) {
    return 0.1;
  }

  return 0;
}

function roundBoost(value: number): number {
  return Number(value.toFixed(3));
}

/* ───────────────────────────────────────────────────────────────
   3. SIGNAL BUILDING
------------------------------------------------------------------*/

function buildSessionActivitySignal(
  collectedData: CollectedDataBase | null,
  candidateRelativePath: string,
): SessionActivitySignal {
  const candidateMatchers = buildCandidateMatchers(candidateRelativePath);
  if (!collectedData || candidateMatchers.length === 0) {
    return {
      toolCallPaths: [],
      gitChangedFiles: [],
      transcriptMentions: [],
      confidenceBoost: 0,
    };
  }

  const toolCallPaths = new Set<string>();
  const gitChangedFiles = new Set<string>();
  const transcriptMentions = new Set<string>();
  let confidenceBoost = 0;

  for (const observation of collectedData.observations || []) {
    const toolType = extractObservationToolType(observation);
    const matchingPaths = collectObservationPaths(observation)
      .filter((filePath) => pathMatchesCandidate(filePath, candidateMatchers));

    if (matchingPaths.length === 0) {
      continue;
    }

    const toolWeight = scoreToolPath(toolType);
    for (const matchingPath of matchingPaths) {
      if (!toolCallPaths.has(matchingPath)) {
        toolCallPaths.add(matchingPath);
        confidenceBoost += toolWeight;
      }
    }
  }

  for (const filePath of normalizeGitChangedFiles(collectedData)) {
    if (!pathMatchesCandidate(filePath, candidateMatchers)) {
      continue;
    }

    if (!gitChangedFiles.has(filePath)) {
      gitChangedFiles.add(filePath);
      confidenceBoost += 0.25;
    }
  }

  for (const text of buildTranscriptCorpus(collectedData)) {
    if (!textMentionsCandidate(text, candidateMatchers)) {
      continue;
    }

    const snippet = text.trim().slice(0, 120);
    if (!transcriptMentions.has(snippet)) {
      transcriptMentions.add(snippet);
      confidenceBoost += 0.1;
    }
  }

  // O4-15: Cap confidence boost to prevent unbounded accumulation
  confidenceBoost = Math.min(confidenceBoost, 1.0);

  return {
    toolCallPaths: [...toolCallPaths],
    gitChangedFiles: [...gitChangedFiles],
    transcriptMentions: [...transcriptMentions],
    confidenceBoost: roundBoost(confidenceBoost),
  };
}

/* ───────────────────────────────────────────────────────────────
   4. EXPORTS
------------------------------------------------------------------*/

export {
  buildSessionActivitySignal,
};
