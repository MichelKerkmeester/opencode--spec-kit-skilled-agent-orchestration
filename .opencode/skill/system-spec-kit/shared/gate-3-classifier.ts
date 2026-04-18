// ---------------------------------------------------------------
// MODULE: Gate 3 Classifier
// ---------------------------------------------------------------
// Shared typed classifier for the Gate 3 (SPEC FOLDER QUESTION) trigger surface.
// Addresses findings R41-002, R45-001, R47-001 (T-DOC-02) and R48-001, R49-001,
// R50-001 (T-DOC-03) from the 016 foundational-runtime deep review.
//
// Runtime root docs (AGENTS.md, CLAUDE.md, GEMINI.md, CODEX.md) and the
// spec_kit command entry docs cite this module as the machine contract.
// The prose trigger lists in those docs remain as human-readable references
// but the authoritative list of tokens lives here.
// ---------------------------------------------------------------

import { canonicalFold } from './unicode-normalization.js';

function assertNever(value: never, label: string): never {
  throw new Error(`Unexpected ${label}: ${String(value)}`);
}

// ---------------------------------------------------------------
// 1. TRIGGER SCHEMA
// ---------------------------------------------------------------

/** Token categories consumed by the classifier. */
export type TriggerCategory =
  | 'file_write'        // Creating / modifying / deleting files
  | 'memory_save'       // save context / save memory / /memory:save
  | 'resume'            // resume / continue iteration (write-producing flows)
  | 'read_only';        // review / audit / inspect / explain (disqualifiers)

/** Exact phrase vs single-token matching. */
export type MatchKind = 'phrase' | 'token';

/** One row in the classifier vocabulary. */
export interface TriggerEntry {
  /** The exact string to match, lowercased. */
  pattern: string;
  /** Whether `pattern` should match as a phrase (whitespace-tolerant) or a single token. */
  kind: MatchKind;
  /** Category classification. */
  category: TriggerCategory;
  /** Short comment explaining rationale (docs-only). */
  note?: string;
}

/** Result of classifying a prompt. */
export interface ClassificationResult {
  /** Whether Gate 3 must be asked. */
  triggersGate3: boolean;
  /** Why (or why not). */
  reason: 'file_write_match' | 'memory_save_match' | 'resume_match' | 'read_only_override' | 'no_match';
  /** All trigger entries that matched. */
  matched: TriggerEntry[];
  /** All read-only disqualifiers that matched (may override file_write). */
  readOnlyMatched: TriggerEntry[];
}

// ---------------------------------------------------------------
// 2. CANONICAL TRIGGER VOCABULARY
// ---------------------------------------------------------------

/**
 * File-write positive triggers.
 *
 * These phrases/tokens indicate the prompt is asking for a file modification,
 * requiring a spec folder.
 */
export const FILE_WRITE_TRIGGERS: readonly TriggerEntry[] = Object.freeze([
  { pattern: 'create',     kind: 'token', category: 'file_write' },
  { pattern: 'add',        kind: 'token', category: 'file_write' },
  { pattern: 'remove',     kind: 'token', category: 'file_write' },
  { pattern: 'delete',     kind: 'token', category: 'file_write' },
  { pattern: 'rename',     kind: 'token', category: 'file_write' },
  { pattern: 'move',       kind: 'token', category: 'file_write' },
  { pattern: 'update',     kind: 'token', category: 'file_write' },
  { pattern: 'change',     kind: 'token', category: 'file_write' },
  { pattern: 'modify',     kind: 'token', category: 'file_write' },
  { pattern: 'edit',       kind: 'token', category: 'file_write' },
  { pattern: 'fix',        kind: 'token', category: 'file_write' },
  { pattern: 'patch',      kind: 'token', category: 'file_write' },
  { pattern: 'refactor',   kind: 'token', category: 'file_write' },
  { pattern: 'implement',  kind: 'token', category: 'file_write' },
  { pattern: 'build',      kind: 'token', category: 'file_write' },
  { pattern: 'write',      kind: 'token', category: 'file_write' },
  { pattern: 'rewrite',    kind: 'token', category: 'file_write' },
  { pattern: 'generate',   kind: 'token', category: 'file_write' },
  { pattern: 'configure',  kind: 'token', category: 'file_write' },
]);

/**
 * Memory save triggers.
 *
 * Gate 3 applies to memory save flows because they write canonical continuity
 * artifacts (description.json, graph-metadata.json, and continuity frontmatter).
 */
export const MEMORY_SAVE_TRIGGERS: readonly TriggerEntry[] = Object.freeze([
  { pattern: 'save context',  kind: 'phrase', category: 'memory_save' },
  { pattern: 'save memory',   kind: 'phrase', category: 'memory_save' },
  { pattern: '/memory:save',  kind: 'phrase', category: 'memory_save' },
]);

/**
 * Resume / continue triggers.
 *
 * `/spec_kit:resume` and deep-research `resume` produce writes (iteration-NNN.md
 * and JSONL appends), so they require Gate 3 even though the surface name sounds
 * read-only.
 */
export const RESUME_TRIGGERS: readonly TriggerEntry[] = Object.freeze([
  { pattern: '/spec_kit:resume',    kind: 'phrase', category: 'resume' },
  { pattern: '/spec_kit:deep-research', kind: 'phrase', category: 'resume' },
  { pattern: 'spec_kit:deep-research',  kind: 'phrase', category: 'resume' },
  { pattern: '/spec_kit:deep-review',   kind: 'phrase', category: 'resume' },
  { pattern: 'spec_kit:deep-review',    kind: 'phrase', category: 'resume' },
  { pattern: 'resume the packet',        kind: 'phrase', category: 'resume' },
  { pattern: 'resume the phase folder',  kind: 'phrase', category: 'resume' },
  { pattern: 'reconstruct continuity',   kind: 'phrase', category: 'resume' },
  { pattern: ':auto',               kind: 'phrase', category: 'resume', note: 'Only matches with spec_kit prefix.' },
  { pattern: 'deep-research',       kind: 'phrase', category: 'resume' },
  { pattern: 'deep research',       kind: 'phrase', category: 'resume' },
  { pattern: 'deep-review',         kind: 'phrase', category: 'resume' },
  { pattern: 'deep review',         kind: 'phrase', category: 'resume' },
  { pattern: 'deep-loop',           kind: 'phrase', category: 'resume' },
  { pattern: 'research loop',       kind: 'phrase', category: 'resume' },
  { pattern: 'review loop',         kind: 'phrase', category: 'resume' },
  { pattern: 'iteration loop',      kind: 'phrase', category: 'resume' },
  { pattern: 'research sweep',      kind: 'phrase', category: 'resume' },
  { pattern: 'research cycle',      kind: 'phrase', category: 'resume' },
  { pattern: 'research run',        kind: 'phrase', category: 'resume' },
  { pattern: 'research wave',       kind: 'phrase', category: 'resume' },
  { pattern: 'review wave',         kind: 'phrase', category: 'resume' },
  { pattern: 'looped investigation',kind: 'phrase', category: 'resume' },
  { pattern: 'keep iterating',      kind: 'phrase', category: 'resume' },
  { pattern: 'autoresearch',        kind: 'phrase', category: 'resume' },
  { pattern: 'convergence',         kind: 'phrase', category: 'resume' },
  { pattern: 'resume iteration',    kind: 'phrase', category: 'resume' },
  { pattern: 'resume deep research',kind: 'phrase', category: 'resume' },
  { pattern: 'resume deep review',  kind: 'phrase', category: 'resume' },
  { pattern: 'continue iteration',  kind: 'phrase', category: 'resume' },
]);

/**
 * Read-only disqualifiers.
 *
 * These tokens, when present WITHOUT a corresponding file-write / memory-save /
 * resume trigger, mark the request as read-only. This prevents false positives
 * for prompts like "analyze the decomposition phase" or "review / audit / inspect
 * the code".
 *
 * Note: `analyze`, `decompose`, `phase` were previously positive triggers but
 * false-positived on read-only review prompts. They are intentionally omitted
 * from positive triggers; `analyze` is included here as a read-only disqualifier.
 */
export const READ_ONLY_DISQUALIFIERS: readonly TriggerEntry[] = Object.freeze([
  { pattern: 'review',  kind: 'token', category: 'read_only' },
  { pattern: 'audit',   kind: 'token', category: 'read_only' },
  { pattern: 'inspect', kind: 'token', category: 'read_only' },
  { pattern: 'analyze', kind: 'token', category: 'read_only' },
  { pattern: 'explain', kind: 'token', category: 'read_only' },
]);

/** Full canonical vocabulary, exported for docs / linting. */
export const GATE_3_VOCABULARY = Object.freeze({
  fileWrite:           FILE_WRITE_TRIGGERS,
  memorySave:          MEMORY_SAVE_TRIGGERS,
  resume:              RESUME_TRIGGERS,
  readOnlyDisqualifier:READ_ONLY_DISQUALIFIERS,
});

// ---------------------------------------------------------------
// 3. NORMALIZATION
// ---------------------------------------------------------------

/**
 * Normalize a prompt for matching: lowercase and collapse whitespace, but
 * preserve `/` and `:` so command forms like `/spec_kit:resume` survive.
 */
export function normalizePrompt(prompt: string): string {
  return canonicalFold(prompt)
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

/** Tokenize a normalized prompt into alphanumeric + `/` + `:` words. */
export function tokenizePrompt(normalized: string): string[] {
  return normalized.split(/[^a-z0-9:/_-]+/).filter(Boolean);
}

// ---------------------------------------------------------------
// 4. CORE CLASSIFIER
// ---------------------------------------------------------------

/** Check if a single trigger entry matches a normalized prompt. */
export function matchesEntry(entry: TriggerEntry, normalized: string, tokens: string[]): boolean {
  if (entry.kind === 'phrase') {
    if (entry.pattern === ':auto' && entry.category === 'resume') {
      return normalized.includes(':auto') && normalized.includes('spec_kit');
    }
    return normalized.includes(entry.pattern);
  }
  // token match — must appear as a standalone word
  return tokens.includes(entry.pattern);
}

function triggerIndex(entry: TriggerEntry, normalized: string): number {
  return normalized.indexOf(entry.pattern);
}

function hasMixedWriteTail(
  normalized: string,
  writeMatches: TriggerEntry[],
  readOnlyMatches: TriggerEntry[],
): boolean {
  for (const readOnlyEntry of readOnlyMatches) {
    const readIndex = triggerIndex(readOnlyEntry, normalized);
    if (readIndex < 0) {
      continue;
    }

    for (const writeEntry of writeMatches) {
      const writeIndex = triggerIndex(writeEntry, normalized);
      if (writeIndex <= readIndex) {
        continue;
      }

      const between = normalized.slice(readIndex + readOnlyEntry.pattern.length, writeIndex);
      if (/\b(then|and|if)\b/.test(between) || between.includes(',')) {
        return true;
      }
    }
  }

  return false;
}

function hasWorkflowInvocationMarker(normalized: string): boolean {
  return /\b(run|use|start|begin|continue|resume|append|kick off|keep|launch)\b/.test(normalized);
}

function hasNegatedWriteAction(normalized: string, writeMatches: TriggerEntry[]): boolean {
  for (const writeEntry of writeMatches) {
    const writeIndex = triggerIndex(writeEntry, normalized);
    if (writeIndex < 0) {
      continue;
    }

    const prefix = normalized.slice(Math.max(0, writeIndex - 32), writeIndex);
    if (/\b(do not|don't|dont|without|no need to)\b/.test(prefix)) {
      return true;
    }
  }

  return /\bdo not (change|edit|save|write|update)\b/.test(normalized);
}

function hasFileTarget(normalized: string): boolean {
  return /`[^`]+\.(md|jsonl|json|ts|tsx|js|py|sh|txt|toml|ya?ml)`/.test(normalized)
    || /\b(file|folder|readme|docs?|corpus|checklist|implementation-summary|research\.md|tasks\.md)\b/.test(normalized);
}

function isPromptOnlyGeneration(normalized: string): boolean {
  if (!/\b(prompt|phrasing)\b/.test(normalized)) {
    return false;
  }
  if (hasFileTarget(normalized)) {
    return false;
  }
  return /\b(inline|in chat only|show it|just show|better phrasing|cleaner user prompt|prompt variant|prompt package|stronger system prompt)\b/.test(normalized)
    || /\b(create|generate|build|write)\b.*\b(prompt|phrasing)\b/.test(normalized);
}

/**
 * Classify a prompt against the Gate 3 trigger vocabulary.
 *
 * Decision order:
 * 1. Test positive triggers (file_write, memory_save, resume).
 * 2. If a resume or memory_save trigger matches → Gate 3 ALWAYS required
 *    (read_only disqualifiers cannot override).
 * 3. If only file_write triggers match:
 *    a. If any read_only disqualifier matches AND no file_write token is
 *       explicitly paired with a file target, Gate 3 is SUPPRESSED.
 *    b. Otherwise Gate 3 is required.
 * 4. If no positive trigger matches → Gate 3 not required.
 */
export function classifyPrompt(prompt: string): ClassificationResult {
  const normalized = normalizePrompt(prompt);
  const tokens = tokenizePrompt(normalized);

  const matched: TriggerEntry[] = [];
  const readOnlyMatched: TriggerEntry[] = [];

  let hasMemorySave = false;
  let hasResume = false;
  let hasFileWrite = false;

  for (const entry of MEMORY_SAVE_TRIGGERS) {
    if (matchesEntry(entry, normalized, tokens)) {
      matched.push(entry);
      hasMemorySave = true;
    }
  }
  for (const entry of RESUME_TRIGGERS) {
    if (matchesEntry(entry, normalized, tokens)) {
      matched.push(entry);
      hasResume = true;
    }
  }
  for (const entry of FILE_WRITE_TRIGGERS) {
    if (matchesEntry(entry, normalized, tokens)) {
      matched.push(entry);
      hasFileWrite = true;
    }
  }
  for (const entry of READ_ONLY_DISQUALIFIERS) {
    if (matchesEntry(entry, normalized, tokens)) {
      readOnlyMatched.push(entry);
    }
  }

  const fileWriteMatched = matched.filter((entry) => entry.category === 'file_write');
  const hasRecoverableMixedWriteTail = hasMixedWriteTail(normalized, fileWriteMatched, readOnlyMatched);
  if (hasFileWrite && (hasNegatedWriteAction(normalized, fileWriteMatched) || isPromptOnlyGeneration(normalized))) {
    return { triggersGate3: false, reason: readOnlyMatched.length > 0 ? 'read_only_override' : 'no_match', matched, readOnlyMatched };
  }

  // Memory save / resume: Gate 3 ALWAYS required (writes produced regardless).
  if (hasMemorySave) {
    return { triggersGate3: true, reason: 'memory_save_match', matched, readOnlyMatched };
  }
  if (hasResume) {
    if (readOnlyMatched.length > 0 && !hasWorkflowInvocationMarker(normalized) && !hasRecoverableMixedWriteTail) {
      return { triggersGate3: false, reason: hasFileWrite ? 'read_only_override' : 'no_match', matched, readOnlyMatched };
    }
    return { triggersGate3: true, reason: 'resume_match', matched, readOnlyMatched };
  }

  // File-write: read-only disqualifiers can override ONLY when there is no
  // direct file-write action (i.e., the file-write token appears alongside
  // a read-only verb like "review", "audit", "inspect").
  if (hasFileWrite) {
    if (readOnlyMatched.length > 0) {
      if (hasRecoverableMixedWriteTail) {
        return { triggersGate3: true, reason: 'file_write_match', matched, readOnlyMatched };
      }
      return { triggersGate3: false, reason: 'read_only_override', matched, readOnlyMatched };
    }
    return { triggersGate3: true, reason: 'file_write_match', matched, readOnlyMatched };
  }

  return { triggersGate3: false, reason: 'no_match', matched, readOnlyMatched };
}

// ---------------------------------------------------------------
// 5. JSON EXPORT (for non-TS consumers)
// ---------------------------------------------------------------

/** Serializable JSON snapshot of the vocabulary (for Python / YAML consumers). */
export interface Gate3VocabularySnapshot {
  version: string;
  fileWrite: readonly { pattern: string; kind: MatchKind }[];
  memorySave: readonly { pattern: string; kind: MatchKind }[];
  resume: readonly { pattern: string; kind: MatchKind }[];
  readOnlyDisqualifier: readonly { pattern: string; kind: MatchKind }[];
}

export const GATE_3_SCHEMA_VERSION = '1.0.0';

function getEntriesForCategory(category: TriggerCategory): readonly TriggerEntry[] {
  switch (category) {
    case 'file_write':
      return FILE_WRITE_TRIGGERS;
    case 'memory_save':
      return MEMORY_SAVE_TRIGGERS;
    case 'resume':
      return RESUME_TRIGGERS;
    case 'read_only':
      return READ_ONLY_DISQUALIFIERS;
    default:
      return assertNever(category, 'trigger-category');
  }
}

/** Return the vocabulary as a plain JSON snapshot. */
export function toJsonSnapshot(): Gate3VocabularySnapshot {
  const pick = (entries: readonly TriggerEntry[]) =>
    entries.map(({ pattern, kind }) => ({ pattern, kind }));
  return {
    version: GATE_3_SCHEMA_VERSION,
    fileWrite: pick(getEntriesForCategory('file_write')),
    memorySave: pick(getEntriesForCategory('memory_save')),
    resume: pick(getEntriesForCategory('resume')),
    readOnlyDisqualifier: pick(getEntriesForCategory('read_only')),
  };
}
