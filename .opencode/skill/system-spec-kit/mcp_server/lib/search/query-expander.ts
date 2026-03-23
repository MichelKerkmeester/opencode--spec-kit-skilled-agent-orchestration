// ───────────────────────────────────────────────────────────────
// MODULE: Query Expander
// ───────────────────────────────────────────────────────────────
// Feature catalog: Query expansion
// Rule-based synonym expansion for mode="deep" multi-query RAG.
// No LLM calls — purely rule-based template substitution.

// ───────────────────────────────────────────────────────────────
// 1. CONSTANTS

// ───────────────────────────────────────────────────────────────
const MAX_VARIANTS = 3;

/** Escape special regex characters in user input to prevent ReDoS (P1-6). */
function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Domain vocabulary map for server-side synonym expansion.
 * No LLM calls — purely rule-based template substitution.
 */
export const DOMAIN_VOCABULARY_MAP: Record<string, string[]> = {
  // Auth domain
  login: ['authentication', 'sign-in'],
  auth: ['authentication', 'authorization'],
  password: ['credential', 'secret'],
  token: ['jwt', 'session-key'],
  // Error domain
  error: ['exception', 'failure'],
  bug: ['defect', 'issue'],
  crash: ['fatal-error', 'unhandled-exception'],
  fix: ['patch', 'resolve'],
  // Architecture domain
  api: ['endpoint', 'route'],
  database: ['db', 'datastore'],
  cache: ['memoize', 'store'],
  deploy: ['release', 'ship'],
  // Code domain
  refactor: ['restructure', 'clean-up'],
  test: ['spec', 'assertion'],
  config: ['configuration', 'settings'],
  // Memory system domain
  memory: ['context', 'knowledge'],
  spec: ['specification', 'requirement'],
  embedding: ['vector', 'representation'],
  tier: ['importance', 'priority'],
  causal: ['relationship', 'dependency'],
  checkpoint: ['snapshot', 'backup'],
  indexing: ['ingestion', 'cataloging'],
  search: ['retrieval', 'query'],
  decision: ['adr', 'rationale'],
  session: ['conversation', 'context-window'],
  trigger: ['activation', 'match-phrase'],
  fusion: ['merge', 'combine'],
};

// ───────────────────────────────────────────────────────────────
// 2. CORE FUNCTION

// ───────────────────────────────────────────────────────────────
/**
 * Expand a query into multiple search variants using synonym maps.
 *
 * - Original query is always included as the first variant.
 * - Splits compound terms via word boundary matching.
 * - Looks up synonyms from `DOMAIN_VOCABULARY_MAP` (case-insensitive).
 * - Returns at most `MAX_VARIANTS` (3) strings.
 *
 * @param query - The input search query string.
 * @returns Array of query variants, original first, max 3 total.
 * @throws {TypeError} If called with a non-string value at runtime.
 * @example
 * ```ts
 * expandQuery('auth error');
 * // ['auth error', 'authentication error', 'auth exception']
 * ```
 */
export function expandQuery(query: string): string[] {
  const words = query.toLowerCase().match(/\b\w+\b/g) || [];
  const variants: Set<string> = new Set([query]);

  for (const word of words) {
    if (variants.size >= MAX_VARIANTS) break;
    const synonyms = DOMAIN_VOCABULARY_MAP[word];
    if (synonyms && synonyms.length > 0) {
      // Keep one expansion per matched word to avoid over-expanding simple queries.
      for (const synonym of synonyms) {
        if (variants.size >= MAX_VARIANTS) break;
        const expanded = query.replace(new RegExp(`\\b${escapeRegExp(word)}\\b`, 'i'), synonym);
        const beforeSize = variants.size;
        variants.add(expanded);
        if (variants.size > beforeSize) {
          break;
        }
      }
    }
  }

  return Array.from(variants).slice(0, MAX_VARIANTS);
}
