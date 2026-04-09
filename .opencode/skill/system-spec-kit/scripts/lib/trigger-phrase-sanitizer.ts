// ---------------------------------------------------------------
// MODULE: Trigger Phrase Sanitizer
// ---------------------------------------------------------------
// Empirical authority for this module is iteration-015:
// `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/
// 003-memory-quality-issues/research/iterations/iteration-015.md`
// Keep the blocklist and allowlist narrow, shape-based, and aligned to that
// frozen corpus guidance.

export type TriggerPhraseSanitizeReason =
  | 'empty'
  | 'contamination'
  | 'control_character'
  | 'path_fragment'
  | 'standalone_stopword'
  | 'suspicious_prefix'
  | 'synthetic_bigram'
  | 'too_long';

export type TriggerPhraseSource = 'manual' | 'extracted';

export interface TriggerPhraseSanitizeResult {
  keep: boolean;
  reason?: TriggerPhraseSanitizeReason;
}

export interface TriggerPhraseSanitizeOptions {
  source?: TriggerPhraseSource;
}

const PATH_FRAGMENT_PATTERN = /[\\/]/;
const PATH_LIKE_SLUG_PATTERN = /^\d{3}-[a-z0-9_-]+$/i;
const MANUAL_FINDING_ID_PREFIX_PATTERN = /^DR-\d{3}-I\d{3}-P\d-\d{3}\b/i;
const SUSPICIOUS_PREFIX_PATTERN = /^(?:(?:f|q)\d+|ac-?\d+|phase\s+\d+|iter(?:ation)?\s+\d+)\b/i;
const CONTROL_CHARACTER_PATTERN = /[\x00-\x1F\x7F-\x9F]/;
const CONTAMINATION_PATTERN = /<[^>]+>|\b(?:ignore previous|system prompt|developer message|tool state|tool output|assistant:|user:)\b/i;
const MAX_TRIGGER_PHRASE_LENGTH = 200;

const SHORT_PRODUCT_ALLOWLIST = new Set([
  'ai',
  'api',
  'cd',
  'ci',
  'cli',
  'db',
  'js',
  'llm',
  'mcp',
  'pr',
  'qa',
  'rag',
  'sdk',
  'sql',
  'ts',
  'ui',
  'ux',
]);

const STANDALONE_STOPWORD_BLOCKLIST = new Set([
  'a',
  'an',
  'and',
  'as',
  'at',
  'be',
  'by',
  'for',
  'from',
  'graph',
  'in',
  'into',
  'is',
  'issue',
  'issues',
  'of',
  'on',
  'or',
  'phases',
  'research',
  'the',
  'to',
  'via',
  'with',
]);

const SYNTHETIC_BIGRAM_BLOCKLIST = new Set([
  'and testing',
  'full level',
  'level spec',
  'session for',
  'spec set',
  'tiers full',
  'with phases',
  'with research',
  'with timeout',
]);

function normalizeUnicodeForm(phrase: string): string {
  return phrase.normalize('NFC');
}

function normalizePhrase(phrase: string): string {
  return normalizeUnicodeForm(phrase).trim().toLowerCase().replace(/\s+/g, ' ');
}

function normalizeComparisonKey(phrase: string): string {
  return normalizePhrase(phrase).replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim();
}

export function isAllowlistedShortProductName(phrase: string): boolean {
  return SHORT_PRODUCT_ALLOWLIST.has(normalizePhrase(phrase));
}

export function sanitizeTriggerPhrase(
  phrase: string,
  options: TriggerPhraseSanitizeOptions = {},
): TriggerPhraseSanitizeResult {
  const source: TriggerPhraseSource = options.source ?? 'extracted';
  const unicodeNormalized = normalizeUnicodeForm(phrase);

  if (unicodeNormalized.length > MAX_TRIGGER_PHRASE_LENGTH) {
    return { keep: false, reason: 'too_long' };
  }

  if (CONTROL_CHARACTER_PATTERN.test(unicodeNormalized)) {
    return { keep: false, reason: 'control_character' };
  }

  const normalized = normalizePhrase(unicodeNormalized);

  if (!normalized) {
    return { keep: false, reason: 'empty' };
  }

  if (SHORT_PRODUCT_ALLOWLIST.has(normalized)) {
    return { keep: true };
  }

  if (CONTAMINATION_PATTERN.test(normalized)) {
    return { keep: false, reason: 'contamination' };
  }

  if (
    source === 'manual'
    && MANUAL_FINDING_ID_PREFIX_PATTERN.test(unicodeNormalized.trim())
  ) {
    return { keep: true };
  }

  if (source === 'manual') {
    return { keep: true };
  }

  if (PATH_FRAGMENT_PATTERN.test(normalized) || PATH_LIKE_SLUG_PATTERN.test(normalized)) {
    return { keep: false, reason: 'path_fragment' };
  }

  if (source === 'extracted' && SUSPICIOUS_PREFIX_PATTERN.test(normalized)) {
    return { keep: false, reason: 'suspicious_prefix' };
  }

  if (source === 'extracted' && SYNTHETIC_BIGRAM_BLOCKLIST.has(normalized)) {
    return { keep: false, reason: 'synthetic_bigram' };
  }

  if (source === 'extracted' && !normalized.includes(' ') && STANDALONE_STOPWORD_BLOCKLIST.has(normalized)) {
    return { keep: false, reason: 'standalone_stopword' };
  }

  return { keep: true };
}

export function sanitizeTriggerPhrases(
  phrases: string[],
  options: TriggerPhraseSanitizeOptions = {},
): string[] {
  const sanitized: string[] = [];
  const seen = new Set<string>();

  for (const phrase of phrases) {
    if (typeof phrase !== 'string') {
      continue;
    }

    const verdict = sanitizeTriggerPhrase(phrase, options);
    if (!verdict.keep) {
      continue;
    }

    const normalized = normalizePhrase(phrase);
    const comparisonKey = normalizeComparisonKey(normalized);
    const shadowedByExistingPhrase = !isAllowlistedShortProductName(normalized) && sanitized.some((existingPhrase) => {
      if (isAllowlistedShortProductName(existingPhrase)) {
        return false;
      }
      const existingKey = normalizeComparisonKey(existingPhrase);
      return existingKey.length >= comparisonKey.length && existingKey.includes(comparisonKey);
    });
    if (seen.has(comparisonKey) || shadowedByExistingPhrase) {
      continue;
    }

    sanitized.push(normalized);
    seen.add(comparisonKey);
  }

  return sanitized;
}
