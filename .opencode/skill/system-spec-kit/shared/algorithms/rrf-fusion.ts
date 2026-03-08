// ---------------------------------------------------------------
// MODULE: RRF Fusion
// ---------------------------------------------------------------
// Reciprocal Rank Fusion for combining search results
// P3-11: TypeScript source (previously orphaned .js only)

/* --- 1. CONSTANTS --- */

const SOURCE_TYPES = {
  VECTOR: 'vector',
  FTS: 'fts',
  BM25: 'bm25',
  GRAPH: 'graph',
  DEGREE: 'degree',
  KEYWORD: 'keyword',
} as const;

// AI-WHY: K=60 is the standard RRF constant from Cormack et al. (2009); higher K
// flattens rank differences, reducing the dominance of top-1 results. 60 balances
// discrimination vs. stability for our typical 10-50 candidate lists.
const DEFAULT_K = 60;
const CONVERGENCE_BONUS = 0.10;
// AI-WHY: Graph channel gets 1.5x boost when no explicit weight is supplied because
// graph edges encode curated human decisions (causal links) that are high-signal.
const GRAPH_WEIGHT_BOOST = 1.5;

/** Minimum character length for a query term to be considered for term matching. */
const MIN_QUERY_TERM_LENGTH = 2;

/* --- 2. INTERFACES --- */

/** A single item from a ranked retrieval list, identified by its unique ID. */
interface RrfItem {
  id: number | string;
  [key: string]: unknown;
}

/** Result of RRF fusion: an RrfItem augmented with fused score, source tracking, and convergence bonus. */
interface FusionResult extends RrfItem {
  /**
   * Reciprocal Rank Fusion score. Combines rankings from multiple retrieval
   * methods using the formula `1/(k + rank)`. Higher values indicate the
   * result was ranked highly by more methods. Includes convergence bonus
   * when a result appears in multiple ranked lists.
   */
  rrfScore: number;
  sources: string[];
  sourceScores: Record<string, number>;
  convergenceBonus: number;
}

/** A ranked result list from a single retrieval source (e.g., vector, BM25, graph). */
interface RankedList {
  source: string;
  results: RrfItem[];
  weight?: number;
}

/** Configuration options for multi-list RRF fusion. */
interface FuseMultiOptions {
  k?: number;
  convergenceBonus?: number;
  graphWeightBoost?: number;
}

/** Configuration options for advanced score fusion with term matching. */
interface FuseAdvancedOptions {
  termMatchBonus?: number;
}

/** A search function descriptor: source label, async retrieval function, and optional weight. */
interface SearchFunction {
  source: string;
  fn: () => Promise<RrfItem[]>;
  weight?: number;
}

/** Canonical key for cross-channel deduplication (`42`, `"42"`, `"mem:42"` -> `"42"`). */
function canonicalRrfId(id: number | string): string {
  if (typeof id === 'number') {
    return String(id);
  }

  const raw = String(id).trim();
  const memPrefixed = /^mem:(\d+)$/i.exec(raw);
  if (memPrefixed) {
    return String(Number(memPrefixed[1]));
  }

  if (/^\d+$/.test(raw)) {
    return String(Number(raw));
  }

  return raw;
}

/* --- 3. CORE FUNCTIONS --- */

/**
 * Fuse two ranked result lists using Reciprocal Rank Fusion.
 * @param listA - First ranked result list.
 * @param listB - Second ranked result list.
 * @param k - RRF smoothing constant (default 60).
 * @param sourceA - Source label for listA (default 'vector').
 * @param sourceB - Source label for listB (default 'fts').
 * @returns Fused results sorted by descending RRF score.
 */
function fuseResults(
  listA: RrfItem[],
  listB: RrfItem[],
  k: number = DEFAULT_K,
  sourceA: string = SOURCE_TYPES.VECTOR,
  sourceB: string = SOURCE_TYPES.FTS,
): FusionResult[] {
  if (k < 0) throw new Error('RRF k parameter must be non-negative');
  const scoreMap = new Map<string, FusionResult>();

  // Process list A
  for (let i = 0; i < listA.length; i++) {
    const item = listA[i];
    const rrfScore = 1 / (k + i + 1);
    const key = canonicalRrfId(item.id);
    const existing = scoreMap.get(key);
    if (existing) {
      existing.rrfScore += rrfScore;
      existing.sourceScores[sourceA] = rrfScore;
      existing.sources.push(sourceA);
    } else {
      scoreMap.set(key, {
        ...item,
        rrfScore,
        sources: [sourceA],
        sourceScores: { [sourceA]: rrfScore },
        convergenceBonus: 0,
      });
    }
  }

  // Process list B
  for (let i = 0; i < listB.length; i++) {
    const item = listB[i];
    const rrfScore = 1 / (k + i + 1);
    const key = canonicalRrfId(item.id);
    const existing = scoreMap.get(key);
    if (existing) {
      existing.rrfScore += rrfScore;
      existing.sourceScores[sourceB] = rrfScore;
      existing.sources.push(sourceB);
      // AI: Fix F16 — apply convergence bonus only once per ID.
      if (existing.convergenceBonus === 0) {
        existing.convergenceBonus = CONVERGENCE_BONUS;
        existing.rrfScore += CONVERGENCE_BONUS;
      }
    } else {
      scoreMap.set(key, {
        ...item,
        rrfScore,
        sources: [sourceB],
        sourceScores: { [sourceB]: rrfScore },
        convergenceBonus: 0,
      });
    }
  }

  return Array.from(scoreMap.values())
    .sort((a, b) => b.rrfScore - a.rrfScore);
}

/**
 * Fuse multiple ranked result lists with optional source weights.
 * @param lists - Array of ranked lists, each with a source label and optional weight.
 * @param options - Optional k value, convergence bonus, and graph weight boost overrides.
 * @returns Fused results sorted by descending RRF score, optionally normalized to [0,1].
 */
function fuseResultsMulti(
  lists: RankedList[],
  options: FuseMultiOptions = {}
): FusionResult[] {
  // Use ?? (not ||) so callers can explicitly pass 0 without falling back to defaults
  const rawK = options.k;
  const k = typeof rawK === 'number' && Number.isFinite(rawK) && rawK > 0 ? rawK : DEFAULT_K;
  const rawConvergenceBonus = options.convergenceBonus;
  const convergenceBonus = typeof rawConvergenceBonus === 'number' && Number.isFinite(rawConvergenceBonus) && rawConvergenceBonus >= 0
    ? rawConvergenceBonus
    : 0;
  const rawGraphWeightBoost = options.graphWeightBoost;
  const graphWeightBoost = typeof rawGraphWeightBoost === 'number' && Number.isFinite(rawGraphWeightBoost) && rawGraphWeightBoost >= 0
    ? rawGraphWeightBoost
    : 0;

  const scoreMap = new Map<string, FusionResult>();

  for (const list of lists) {
    // AI-WHY: Use ?? so explicit weight=0 is honoured (|| would treat 0 as falsy).
    // Graph source gets GRAPH_WEIGHT_BOOST when no weight is given because curated
    // causal edges are higher-signal than unweighted lexical/vector channels.
    const rawWeight = list.weight ?? (list.source === SOURCE_TYPES.GRAPH ? graphWeightBoost : 1.0);
    const weight = typeof rawWeight === 'number' && Number.isFinite(rawWeight) && rawWeight >= 0 ? rawWeight : 0;
    for (let i = 0; i < list.results.length; i++) {
      const item = list.results[i];
      const rrfScore = weight * (1 / (k + i + 1));
      const key = canonicalRrfId(item.id);
      const existing = scoreMap.get(key);
      if (existing) {
        existing.rrfScore += rrfScore;
        existing.sources.push(list.source);
        existing.sourceScores[list.source] = rrfScore;
      } else {
        scoreMap.set(key, {
          ...item,
          rrfScore,
          sources: [list.source],
          sourceScores: { [list.source]: rrfScore },
          convergenceBonus: 0,
        });
      }
    }
  }

  // Apply convergence bonus for multi-source matches
  for (const result of scoreMap.values()) {
    // AI-WHY: Deduplicate sources before counting — a source can appear multiple
    // times when the same channel contributes via different code paths.
    const uniqueSourceCount = new Set(result.sources).size;
    if (uniqueSourceCount >= 2) {
      const bonus = convergenceBonus * (uniqueSourceCount - 1);
      result.convergenceBonus = bonus;
      result.rrfScore += bonus;
    }
  }

  const results = Array.from(scoreMap.values())
    .sort((a, b) => b.rrfScore - a.rrfScore);

  // T004: Normalize RRF scores to [0,1] when enabled
  if (isScoreNormalizationEnabled()) {
    normalizeRrfScores(results);
  }

  return results;
}

/**
 * Advanced score fusion with original term match counting.
 * @param results - Pre-fused results to augment with term-match bonuses.
 * @param query - Original query string for term extraction.
 * @param options - Optional termMatchBonus multiplier (default 0.05 per match).
 * @returns Augmented results with termMatches count, re-sorted by adjusted RRF score.
 */
function fuseScoresAdvanced(
  results: FusionResult[],
  query: string,
  options: FuseAdvancedOptions = {}
): Array<FusionResult & { termMatches: number }> {
  const termMatchBonus = options.termMatchBonus ?? 0.05;
  const queryTerms = query.toLowerCase().split(/\s+/).filter(t => t.length >= MIN_QUERY_TERM_LENGTH);

  return results.map(r => {
    const termMatches = countOriginalTermMatches(r, queryTerms);
    const bonus = termMatches * termMatchBonus;
    return {
      ...r,
      rrfScore: r.rrfScore + bonus,
      termMatches,
    };
  }).sort((a, b) => b.rrfScore - a.rrfScore);
}

/**
 * Count how many query terms match in the result's text fields.
 * @param result - A search result record with title, trigger_phrases, and file_path fields.
 * @param queryTerms - Lowercased query terms to match against.
 * @returns Number of query terms found in the result's searchable text.
 */
function countOriginalTermMatches(
  result: Record<string, unknown>,
  queryTerms: string[]
): number {
  const searchableText = [
    (result.title as string) || '',
    (result.trigger_phrases as string) || '',
    (result.file_path as string) || '',
  ].join(' ').toLowerCase();

  let matches = 0;
  for (const term of queryTerms) {
    if (searchableText.includes(term)) {
      matches++;
    }
  }
  return matches;
}

/**
 * Unified search that combines vector, FTS, and BM25 results via RRF.
 * @param searchFunctions - Array of search descriptors with source label, async function, and optional weight.
 * @param options - Fusion configuration (k, convergence bonus, graph weight boost).
 * @returns Fused results from all successful search channels.
 */
async function unifiedSearch(
  searchFunctions: SearchFunction[],
  options: FuseMultiOptions = {}
): Promise<FusionResult[]> {
  const lists: RankedList[] = await Promise.all(
    searchFunctions.map(async (sf) => {
      try {
        const results = await sf.fn();
        return { source: sf.source, results, weight: sf.weight };
      } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : String(error);
        console.warn(`[rrf-fusion] ${sf.source} search failed: ${msg}`);
        return { source: sf.source, results: [], weight: sf.weight };
      }
    })
  );
  return fuseResultsMulti(lists, options);
}

/**
 * C138-P3: Cross-Variant RRF Fusion for multi-query RAG.
 *
 * Accepts multi-dimensional arrays (one RankedList[] per query variant),
 * groups identical memory IDs across variants, and applies a +0.10
 * cross-variant convergence bonus when the same ID appears in results
 * from different query variants.
 *
 * @param variantLists - Array of variant result sets, each containing
 *                       multiple RankedLists (e.g., vector + fts per variant)
 * @param options - Standard fusion options
 * @returns Fused results with cross-variant convergence bonuses
 */
function fuseResultsCrossVariant(
  variantLists: RankedList[][],
  options: FuseMultiOptions = {}
): FusionResult[] {
  // Use ?? so callers can explicitly pass 0 convergence bonus without falling back to default
  const convergenceBonusPerVariant = options.convergenceBonus ?? CONVERGENCE_BONUS;
  const k = options.k ?? DEFAULT_K;
  if (k < 0) throw new Error('RRF k parameter must be non-negative');

  if (variantLists.length === 0) return [];

  // Step 1: Fuse each variant's lists independently
  const perVariantFused: FusionResult[][] = variantLists.map(lists =>
    fuseResultsMulti(lists, options)
  );

  // Step 2: Track which variants each ID appeared in
  const variantAppearances = new Map<string, Set<number>>();
  for (let vi = 0; vi < perVariantFused.length; vi++) {
    for (const result of perVariantFused[vi]) {
      const key = canonicalRrfId(result.id);
      let variants = variantAppearances.get(key);
      if (!variants) {
        variants = new Set<number>();
        variantAppearances.set(key, variants);
      }
      variants.add(vi);
    }
  }

  // Step 3: Merge all variant results, accumulating RRF scores.
  // AI: Fix F1 — do not subtract raw convergenceBonus from normalized scores.
  const mergedMap = new Map<string, FusionResult>();
  for (const variantResults of perVariantFused) {
    for (const result of variantResults) {
      const key = canonicalRrfId(result.id);
      const existing = mergedMap.get(key);
      if (existing) {
        existing.rrfScore += result.rrfScore;
        for (const src of result.sources) {
          if (!existing.sources.includes(src)) {
            existing.sources.push(src);
          }
        }
        for (const [key, val] of Object.entries(result.sourceScores)) {
          existing.sourceScores[key] = (existing.sourceScores[key] || 0) + val;
        }
      } else {
        mergedMap.set(key, { ...result, rrfScore: result.rrfScore, convergenceBonus: 0 });
      }
    }
  }

  // Step 4: Apply cross-variant convergence bonus (clean, no double-counting)
  for (const [id, result] of mergedMap) {
    const variantCount = variantAppearances.get(id)?.size || 1;
    if (variantCount >= 2) {
      const crossVariantBonus = convergenceBonusPerVariant * (variantCount - 1);
      result.convergenceBonus = crossVariantBonus;
      result.rrfScore += crossVariantBonus;
    }
  }

  const results = Array.from(mergedMap.values())
    .sort((a, b) => b.rrfScore - a.rrfScore);

  // T004: Normalize RRF scores to [0,1] when enabled
  if (isScoreNormalizationEnabled()) {
    normalizeRrfScores(results);
  }

  return results;
}

/**
 * Check if RRF fusion is enabled.
 * @returns True unless SPECKIT_RRF env var is explicitly set to 'false'.
 */
function isRrfEnabled(): boolean {
  return process.env.SPECKIT_RRF !== 'false';
}

/**
 * Check if score normalization is enabled.
 * AI-WHY: Graduated-ON semantics — normalization is active unless explicitly disabled.
 * Aligned with composite-scoring.ts which uses the same !== 'false' convention.
 * Normalizes RRF scores to [0,1] range for consistent downstream comparison.
 * @returns True unless SPECKIT_SCORE_NORMALIZATION is explicitly 'false'.
 */
function isScoreNormalizationEnabled(): boolean {
  return process.env.SPECKIT_SCORE_NORMALIZATION !== 'false';
}

/**
 * Apply min-max normalization to RRF scores in a result array, mapping to [0,1].
 * Mutates the results in place.
 *
 * - If all scores are equal, they normalize to 1.0.
 * - If a single result, it normalizes to 1.0.
 * - No-op when the array is empty.
 *
 * @param results - Array of fusion results to normalize in place.
 */
function normalizeRrfScores(results: FusionResult[]): void {
  if (results.length === 0) return;

  // AI-WHY: Avoid Math.max(...scores) / Math.min(...scores) — spread on large
  // arrays can exceed the JS engine call-stack argument limit and throw
  // "Maximum call stack size exceeded". A simple for-loop is O(n) and safe.
  let maxScore = -Infinity;
  let minScore = Infinity;
  const invalidResults = new Set<FusionResult>();
  for (const r of results) {
    if (!Number.isFinite(r.rrfScore)) {
      r.rrfScore = 0; // AI: Fix F2 — guard against NaN/Infinity weights.
      invalidResults.add(r);
      continue;
    }
    if (r.rrfScore > maxScore) maxScore = r.rrfScore;
    if (r.rrfScore < minScore) minScore = r.rrfScore;
  }
  if (maxScore === -Infinity || minScore === Infinity) return;
  const range = maxScore - minScore;

  if (range > 0) {
    for (const result of results) {
      if (invalidResults.has(result)) continue;
      result.rrfScore = (result.rrfScore - minScore) / range;
    }
  } else {
    // All same score (or single result) — normalize to 1.0
    for (const result of results) {
      if (invalidResults.has(result)) continue;
      result.rrfScore = 1.0;
    }
  }
}

/* --- 4. EXPORTS --- */

export {
  SOURCE_TYPES,
  DEFAULT_K,
  CONVERGENCE_BONUS,
  GRAPH_WEIGHT_BOOST,

  fuseResults,
  fuseResultsMulti,
  fuseResultsCrossVariant,
  fuseScoresAdvanced,
  countOriginalTermMatches,
  unifiedSearch,
  isRrfEnabled,
  isScoreNormalizationEnabled,
  normalizeRrfScores,
};

export type {
  RrfItem,
  FusionResult,
  RankedList,
  FuseMultiOptions,
  FuseAdvancedOptions,
  SearchFunction,
};
