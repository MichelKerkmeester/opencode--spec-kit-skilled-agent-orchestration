/**
 * @file topic-keywords.ts
 * @description Shared lexical helpers for topic extraction across script extractors.
 * @module scripts/lib/topic-keywords
 */

// --- MODULE: Topic Keywords ---
// Shared lexical helpers for topic extraction across script extractors.

const WORD_PATTERN = /\b[a-z][a-z0-9]+\b/g;

const BASE_VALID_SHORT_TERMS = [
  'ai', 'api', 'cd', 'ci', 'css', 'db', 'dom', 'go', 'id', 'io', 'ip', 'js',
  'mcp', 'ml', 'os', 'qa', 'rx', 'sql', 'ts', 'ui', 'ux', 'vm', 'wp',
];

export function tokenizeTopicWords(text: string): string[] {
  return text.toLowerCase().match(WORD_PATTERN) || [];
}

export function createValidShortTerms(extraTerms: string[] = []): Set<string> {
  return new Set([
    ...BASE_VALID_SHORT_TERMS,
    ...extraTerms.map((term) => term.toLowerCase()),
  ]);
}

export function shouldIncludeTopicWord(
  word: string,
  stopwords: Set<string>,
  validShortTerms: Set<string>
): boolean {
  return !stopwords.has(word) && (word.length >= 3 || validShortTerms.has(word));
}
