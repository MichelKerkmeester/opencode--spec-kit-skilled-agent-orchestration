// ───────────────────────────────────────────────────────────────
// MODULE: Query Decomposer
// ───────────────────────────────────────────────────────────────
// Feature catalog: Query decomposition (D2 REQ-D2-001)
// Gated via SPECKIT_QUERY_DECOMPOSITION — deep-mode only.
//
// Bounded facet detection that decomposes multi-faceted questions
// into up to 3 sub-queries, then merges results by facet coverage.
//
// Design constraints:
//   - No LLM calls — purely rule-based heuristics
//   - Cap at MAX_FACETS (3) to bound latency
//   - Only active in deep mode (checked by caller in stage1-candidate-gen)
//   - Graceful fallback: any error returns only the original query

// ───────────────────────────────────────────────────────────────
// 1. CONSTANTS

// ───────────────────────────────────────────────────────────────

/** Maximum number of facets to extract from a multi-faceted query. */
export const MAX_FACETS = 3;

/**
 * Coordinating conjunctions that signal query boundary splits.
 * We look for these as standalone tokens (word-boundary matched).
 * NOTE: Do NOT use the `g` flag here — global regex with `.test()` is stateful.
 * Use factory functions below to produce fresh instances.
 */
const CONJUNCTION_PATTERN_SOURCE = '\\b(?:and|or|also|plus|as well as|along with)\\b';

/** Create a fresh (non-stateful) conjunction test regex. */
function conjunctionRegex(): RegExp {
  return new RegExp(CONJUNCTION_PATTERN_SOURCE, 'i');
}

/** Create a fresh global regex for split operations. */
function conjunctionGlobalRegex(): RegExp {
  return new RegExp(CONJUNCTION_PATTERN_SOURCE, 'gi');
}

/**
 * Wh-question words that indicate a distinct sub-question.
 * When a query contains two or more, it's likely multi-faceted.
 * NOTE: Do NOT use the `g` flag for `.test()`.
 */
const QUESTION_WORD_PATTERN_SOURCE = '\\b(?:what|where|when|why|how|who|which)\\b';

/** Create a fresh global regex for match operations. */
function questionWordGlobalRegex(): RegExp {
  return new RegExp(QUESTION_WORD_PATTERN_SOURCE, 'gi');
}

/**
 * Minimum token count to consider a split fragment valid.
 * Fragments shorter than this are discarded.
 */
const MIN_FRAGMENT_TOKEN_COUNT = 2;

/**
 * Minimum query length (characters) for multi-facet detection.
 * Very short queries are never decomposed.
 */
const MIN_QUERY_LENGTH_FOR_DECOMPOSITION = 15;

// ───────────────────────────────────────────────────────────────
// 2. TYPES

// ───────────────────────────────────────────────────────────────

/** A single candidate pool from one search variant, tagged by query. */
export interface FacetPool<T extends { id: number }> {
  query: string;
  results: T[];
}

// ───────────────────────────────────────────────────────────────
// 3. DETECTION

// ───────────────────────────────────────────────────────────────

/**
 * Heuristic detection: does the query span multiple distinct facets?
 *
 * A query is considered multi-faceted when ANY of these hold:
 *   1. Contains a coordinating conjunction (AND / OR / also / …)
 *   2. Contains 2+ distinct wh-question words (what … how … / where … why …)
 *   3. Sentence-boundary split ('. ' or '? ' or '; ') yields 2+ fragments
 *      each with at least MIN_FRAGMENT_TOKEN_COUNT tokens
 *
 * Short queries (< MIN_QUERY_LENGTH_FOR_DECOMPOSITION chars) are never
 * multi-faceted — avoids false positives on "what and how".
 *
 * @param query - The input search query.
 * @returns True when the query is detected as multi-faceted.
 */
export function isMultiFacet(query: string): boolean {
  if (typeof query !== 'string') return false;
  const trimmed = query.trim();
  if (trimmed.length < MIN_QUERY_LENGTH_FOR_DECOMPOSITION) return false;

  // Test 1: Coordinating conjunction present (fresh regex — no stateful lastIndex)
  if (conjunctionRegex().test(trimmed)) return true;

  // Test 2: Multiple distinct wh-question words
  const questionMatches = trimmed.match(questionWordGlobalRegex());
  if (questionMatches && new Set(questionMatches.map((w) => w.toLowerCase())).size >= 2) {
    return true;
  }

  // Test 3: Sentence-boundary split
  const sentenceFragments = trimmed
    .split(/[.?;]\s+/)
    .map((f) => f.trim())
    .filter((f) => f.split(/\s+/).length >= MIN_FRAGMENT_TOKEN_COUNT);
  if (sentenceFragments.length >= 2) return true;

  return false;
}

// ───────────────────────────────────────────────────────────────
// 4. DECOMPOSITION

// ───────────────────────────────────────────────────────────────

/**
 * Normalize whitespace and trim a fragment.
 */
function normalizeFragment(fragment: string): string {
  return fragment.replace(/\s+/g, ' ').trim();
}

/**
 * Split on coordinating conjunctions, returning non-empty fragments.
 * Uses a fresh regex instance to avoid stateful lastIndex issues.
 */
function splitOnConjunctions(query: string): string[] {
  return query
    .split(conjunctionGlobalRegex())
    .map(normalizeFragment)
    .filter((f) => f.split(/\s+/).length >= MIN_FRAGMENT_TOKEN_COUNT);
}

/**
 * Split on sentence boundaries (.  ?  ;).
 */
function splitOnSentences(query: string): string[] {
  return query
    .split(/[.?;]\s+/)
    .map(normalizeFragment)
    .filter((f) => f.split(/\s+/).length >= MIN_FRAGMENT_TOKEN_COUNT);
}

/**
 * Decompose a multi-faceted query into distinct sub-query facets.
 *
 * Strategy (applied in order, first non-trivial split wins):
 *   1. Split on coordinating conjunctions (and / or / also / …)
 *   2. Split on sentence boundaries (. ? ;)
 *
 * The result is capped at MAX_FACETS. Duplicate fragments are removed.
 * If splitting produces only the original query, an empty array is returned
 * (caller should not add facets when decomposition adds no value).
 *
 * @param query - The input search query.
 * @returns Array of distinct sub-query facets (max MAX_FACETS), possibly empty.
 */
export function decompose(query: string): string[] {
  if (typeof query !== 'string') return [];
  const trimmed = query.trim();
  if (trimmed.length === 0) return [];

  // Strategy 1: Conjunction split
  const conjunctionFragments = splitOnConjunctions(trimmed);
  if (conjunctionFragments.length >= 2) {
    const unique = [...new Set(conjunctionFragments)];
    return unique.slice(0, MAX_FACETS);
  }

  // Strategy 2: Sentence boundary split
  const sentenceFragments = splitOnSentences(trimmed);
  if (sentenceFragments.length >= 2) {
    const unique = [...new Set(sentenceFragments)];
    return unique.slice(0, MAX_FACETS);
  }

  // No meaningful split found
  return [];
}

// ───────────────────────────────────────────────────────────────
// 5. MERGE BY FACET COVERAGE

// ───────────────────────────────────────────────────────────────

/**
 * Merge result pools from multiple facet searches, prioritising items that
 * appear across the most facets (cross-facet coverage) and deduplicating by ID.
 *
 * Algorithm:
 *   1. Count how many pools each item ID appears in (coverage count).
 *   2. Sort all unique items: first by coverage (descending), then by their
 *      best score within any pool (descending).
 *   3. Return the deduplicated list.
 *
 * The "score" used for tie-breaking is resolved from `score`, `rrfScore`,
 * `similarity`, or 0 — mirroring the pipeline's resolveEffectiveScore logic.
 *
 * @param pools - Array of facet pools, each containing a query and results.
 * @returns Merged, deduplicated, coverage-ranked result array.
 */
export function mergeByFacetCoverage<T extends { id: number; score?: number; rrfScore?: number; similarity?: number }>(
  pools: FacetPool<T>[]
): T[] {
  if (pools.length === 0) return [];

  // Coverage counter: id -> number of pools it appears in
  const coverageCount = new Map<number, number>();
  // Best score per id
  const bestScore = new Map<number, number>();
  // First-seen item reference (for output)
  const itemMap = new Map<number, T>();

  for (const pool of pools) {
    const seenInPool = new Set<number>();
    for (const item of pool.results) {
      const id = item.id;

      // Track first-seen reference
      if (!itemMap.has(id)) {
        itemMap.set(id, item);
      }

      // Coverage: count each pool at most once per id
      if (!seenInPool.has(id)) {
        seenInPool.add(id);
        coverageCount.set(id, (coverageCount.get(id) ?? 0) + 1);
      }

      // Best score
      const itemScore = resolveItemScore(item);
      const existing = bestScore.get(id) ?? 0;
      if (itemScore > existing) {
        bestScore.set(id, itemScore);
      }
    }
  }

  // Sort: coverage desc, then best score desc
  const sortedIds = Array.from(itemMap.keys()).sort((a, b) => {
    const covA = coverageCount.get(a) ?? 0;
    const covB = coverageCount.get(b) ?? 0;
    if (covB !== covA) return covB - covA;
    const scoreA = bestScore.get(a) ?? 0;
    const scoreB = bestScore.get(b) ?? 0;
    return scoreB - scoreA;
  });

  return sortedIds.map((id) => itemMap.get(id)!);
}

/**
 * Resolve a numeric score from a result item using the pipeline's fallback chain.
 * Handles both percentage similarity (>1) and fractional scores (0-1).
 */
function resolveItemScore(item: { score?: number; rrfScore?: number; similarity?: number }): number {
  if (typeof item.score === 'number' && Number.isFinite(item.score))
    return Math.max(0, Math.min(1, item.score));
  if (typeof item.rrfScore === 'number' && Number.isFinite(item.rrfScore))
    return Math.max(0, Math.min(1, item.rrfScore));
  if (typeof item.similarity === 'number' && Number.isFinite(item.similarity)) {
    // Similarity values >1 are percentage-scale (0–100); normalise to [0, 1]
    const raw = item.similarity;
    return raw > 1 ? Math.max(0, Math.min(1, raw / 100)) : Math.max(0, Math.min(1, raw));
  }
  return 0;
}

// ───────────────────────────────────────────────────────────────
// 6. TEST EXPORTS

// ───────────────────────────────────────────────────────────────

/**
 * Internal functions exposed for unit testing.
 * Do NOT use in production code paths.
 *
 * @internal
 */
export const __testables = {
  MAX_FACETS,
  MIN_FRAGMENT_TOKEN_COUNT,
  MIN_QUERY_LENGTH_FOR_DECOMPOSITION,
  splitOnConjunctions,
  splitOnSentences,
  resolveItemScore,
};
