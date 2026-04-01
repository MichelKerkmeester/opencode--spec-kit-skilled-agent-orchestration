// ───────────────────────────────────────────────────────────────
// MODULE: Embedding Expansion
// ───────────────────────────────────────────────────────────────
// Feature catalog: Encoding-intent capture at index time
// Semantic query expansion using embedding similarity.
//
// R12/R15 Mutual Exclusion:
// When the R15 query complexity classifier returns tier = "simple",
// Embedding expansion is suppressed entirely. This prevents unnecessary
// Latency on short, well-defined queries that benefit from exact matches
// Rather than semantic broadening.
//
// Feature Flag:
// Controlled by SPECKIT_EMBEDDING_EXPANSION (default: ON, graduated).
// Set to 'false' to disable. If disabled, expandQueryWithEmbeddings()
// Returns immediately with an identity result (original query only,
// No expanded terms).
import { isEmbeddingExpansionEnabled } from './search-flags.js';
import { classifyQueryComplexity } from './query-classifier.js';
import * as vectorIndex from './vector-index.js';

// Feature catalog: Query expansion


// ───────────────────────────────────────────────────────────────
// 1. TYPES

// ───────────────────────────────────────────────────────────────
/**
 * Result produced by embedding-based query expansion.
 *
 * - `original`      — The unchanged input query string.
 * - `expanded`      — Array of semantically related terms extracted from
 *                     similar memories. May be empty when expansion is
 *                     suppressed or yields no new terms.
 * - `combinedQuery` — A single enriched query string built by appending
 *                     the top expanded terms to the original. Ready for
 *                     use as a search query in downstream channels.
 */
export interface ExpandedQuery {
  original: string;
  expanded: string[];
  combinedQuery: string;
}

/** Options accepted by expandQueryWithEmbeddings(). */
export interface EmbeddingExpansionOptions {
  /**
   * Maximum number of similar memories to retrieve when mining terms.
   * Defaults to DEFAULT_CANDIDATE_LIMIT.
   */
  limit?: number;

  /**
   * Maximum number of expanded terms to append to the combined query.
   * Defaults to MAX_EXPANSION_TERMS.
   */
  maxTerms?: number;
}

// ───────────────────────────────────────────────────────────────
// 2. CONSTANTS

// ───────────────────────────────────────────────────────────────
/** Number of semantically similar memories to mine for expansion terms. */
const DEFAULT_CANDIDATE_LIMIT = 5;

/** Maximum distinct expanded terms appended to combinedQuery. */
const MAX_EXPANSION_TERMS = 8;

/** Minimum token length — short tokens (≤2 chars) add noise, not signal. */
const MIN_TERM_LENGTH = 3;

/** Stop-words that carry no semantic signal for expansion. */
const EXPANSION_STOP_WORDS: ReadonlySet<string> = new Set([
  'the', 'a', 'an', 'is', 'are', 'was', 'were',
  'in', 'on', 'at', 'to', 'for', 'of', 'and', 'or',
  'but', 'not', 'with', 'this', 'that', 'it', 'its',
  'from', 'by', 'as', 'be', 'has', 'had', 'have',
  'do', 'does', 'did', 'will', 'would', 'can', 'could',
  'should', 'may', 'might', 'also', 'then', 'than',
]);

/* ───────────────────────────────────────────────────────────────
   3. IDENTITY RESULT (no expansion applied)
   ──────────────────────────────────────────────────────────────── */

/**
 * Produce a no-op ExpandedQuery that preserves the original query unchanged.
 * Used when the feature flag is off, when R15 classifies the query as
 * "simple", or when expansion fails gracefully.
 *
 * @param query - The original query string.
 * @returns ExpandedQuery with empty `expanded` and combinedQuery === original.
 */
function identityResult(query: string): ExpandedQuery {
  return {
    original: query,
    expanded: [],
    combinedQuery: query,
  };
}

// ───────────────────────────────────────────────────────────────
// 3. TERM EXTRACTION

// ───────────────────────────────────────────────────────────────
/**
 * Extract candidate expansion terms from an array of memory content strings.
 *
 * Strategy:
 *   1. Tokenise each content string on word boundaries.
 *   2. Lowercase and deduplicate.
 *   3. Remove stop-words and tokens shorter than MIN_TERM_LENGTH.
 *   4. Remove tokens that already appear in the original query (case-insensitive).
 *   5. Return at most `maxTerms` results, preserving frequency-of-occurrence order
 *      (most-common first) so the highest-signal terms surface first.
 *
 * @param contents    - Raw text content from similar memories.
 * @param queryTokens - Set of lowercased tokens from the original query.
 * @param maxTerms    - Maximum number of terms to return.
 * @returns Ordered array of candidate expansion terms.
 */
function extractTermsFromContents(
  contents: string[],
  queryTokens: Set<string>,
  maxTerms: number,
): string[] {
  const freq = new Map<string, number>();

  for (const text of contents) {
    if (!text || typeof text !== 'string') continue;
    const tokens = text.toLowerCase().match(/\b[a-z][a-z0-9_-]*\b/g) ?? [];
    for (const token of tokens) {
      if (token.length < MIN_TERM_LENGTH) continue;
      if (EXPANSION_STOP_WORDS.has(token)) continue;
      if (queryTokens.has(token)) continue;
      freq.set(token, (freq.get(token) ?? 0) + 1);
    }
  }

  // Sort by frequency descending, then alphabetically for stable ordering
  return Array.from(freq.entries())
    .sort(([aKey, aCount], [bKey, bCount]) =>
      bCount !== aCount ? bCount - aCount : aKey.localeCompare(bKey)
    )
    .slice(0, maxTerms)
    .map(([term]) => term);
}

// ───────────────────────────────────────────────────────────────
// 4. MAIN EXPANSION FUNCTION

// ───────────────────────────────────────────────────────────────
/**
 * Expand a query using embedding-based similarity to find semantically
 * related terms from the memory index.
 *
 * Guard conditions (returns identity result immediately if any apply):
 *   1. `SPECKIT_EMBEDDING_EXPANSION` flag is off (default).
 *   2. R15 mutual exclusion — query classified as "simple" by
 *      `classifyQueryComplexity()`. Simple queries benefit from exact-match
 *      retrieval; broadening them degrades precision without recall gain.
 *   3. Embedding vector is invalid (zero-length or non-finite values).
 *   4. Vector search returns no candidates with content.
 *
 * When expansion proceeds:
 *   a. Run a vector similarity search using the provided embedding.
 *   b. Collect `content` strings from the top-K similar memories.
 *   c. Extract high-frequency, non-trivial terms absent from the original query.
 *   d. Append the top expanded terms to the original query → `combinedQuery`.
 *
 * @param query     - Original query string.
 * @param embedding - Pre-computed query embedding (Float32Array from the
 *                    embeddings provider). Must not be empty.
 * @param options   - Optional tuning parameters (limit, maxTerms).
 * @returns ExpandedQuery with original, expanded terms, and combinedQuery.
 *
 * @throws Never — all errors are caught and logged; identity result returned.
 */
export async function expandQueryWithEmbeddings(
  query: string,
  embedding: Float32Array,
  options?: EmbeddingExpansionOptions,
): Promise<ExpandedQuery> {
  // -- Guard 1: Feature flag --------------------------------------------------
  if (!isEmbeddingExpansionEnabled()) {
    return identityResult(query);
  }

  // -- Guard 2: R15 mutual exclusion -----------------------------------------
  // ClassifyQueryComplexity() returns "complex" when SPECKIT_COMPLEXITY_ROUTER
  // Is disabled (its own feature flag). When R15 is active and classifies the
  // Query as "simple", R12 expansion is suppressed to avoid latency overhead
  // On short, high-precision queries.
  const complexityResult = classifyQueryComplexity(query);
  if (complexityResult.tier === 'simple') {
    return identityResult(query);
  }

  // -- Guard 3: Valid embedding -----------------------------------------------
  if (!embedding || embedding.length === 0) {
    console.warn('[embedding-expansion] Received empty embedding — skipping expansion');
    return identityResult(query);
  }

  const limit = options?.limit ?? DEFAULT_CANDIDATE_LIMIT;
  const maxTerms = Math.min(options?.maxTerms ?? MAX_EXPANSION_TERMS, MAX_EXPANSION_TERMS);

  try {
    // -- Step a: Vector similarity search --------------------------------------
    // Use the query embedding to find semantically similar memories.
    // IncludeConstitutional=false keeps expansion focused on regular content;
    // Constitutional memories are injected separately in Stage 1.
    const similarMemories = vectorIndex.vectorSearch(embedding, {
      limit,
      includeConstitutional: false,
    }) as Array<Record<string, unknown>>;

    // -- Guard 4: No candidates -------------------------------------------------
    if (!similarMemories || similarMemories.length === 0) {
      return identityResult(query);
    }

    // -- Step b: Collect content strings ---------------------------------------
    const contents: string[] = [];
    for (const mem of similarMemories) {
      // D3-fix: DB rows use content_text, not content
      const contentField = (mem.content_text ?? mem.content) as string | undefined;
      if (typeof contentField === 'string' && contentField.length > 0) {
        contents.push(contentField);
      }
      if (typeof mem.title === 'string' && mem.title.length > 0) {
        contents.push(mem.title);
      }
      // D3-fix: trigger_phrases may be string[] (parsed) or string (raw JSON)
      const triggers = mem.trigger_phrases;
      if (Array.isArray(triggers) && triggers.length > 0) {
        contents.push(triggers.join(' '));
      } else if (typeof triggers === 'string' && triggers.length > 0) {
        contents.push(triggers);
      }
    }

    if (contents.length === 0) {
      return identityResult(query);
    }

    // -- Step c: Extract expansion terms ---------------------------------------
    // Build the set of tokens already present in the original query so we
    // Don't redundantly add terms that are already covered.
    const queryTokens = new Set(
      (query.toLowerCase().match(/\b[a-z][a-z0-9_-]*\b/g) ?? []).filter(
        t => t.length >= MIN_TERM_LENGTH && !EXPANSION_STOP_WORDS.has(t)
      )
    );

    const expanded = extractTermsFromContents(contents, queryTokens, maxTerms);

    if (expanded.length === 0) {
      return identityResult(query);
    }

    // -- Step d: Combine -------------------------------------------------------
    // Append the top expanded terms to the original query.
    // A space-separated suffix keeps the combined query compatible with both
    // FTS and embedding re-encoding without requiring a separator token.
    const combinedQuery = `${query} ${expanded.join(' ')}`;

    return {
      original: query,
      expanded,
      combinedQuery,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn(`[embedding-expansion] Expansion failed, using original query: ${msg}`);
    return identityResult(query);
  }
}

/* ───────────────────────────────────────────────────────────────
   6. UTILITY: Check whether expansion is active for a query
   ──────────────────────────────────────────────────────────────── */

/**
 * Synchronous predicate that returns true when R12 embedding expansion
 * would actually run for a given query.
 *
 * Useful in Stage 1 for conditional branching without triggering the
 * full async expansion path.
 *
 * Conditions for expansion to be active:
 *   - SPECKIT_EMBEDDING_EXPANSION flag is on.
 *   - R15 complexity classification is NOT "simple".
 *
 * @param query - The candidate search query.
 * @returns True when embedding expansion should be applied.
 */
export function isExpansionActive(query: string): boolean {
  if (!isEmbeddingExpansionEnabled()) return false;
  const result = classifyQueryComplexity(query);
  return result.tier !== 'simple';
}
