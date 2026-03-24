// ───────────────────────────────────────────────────────────────
// MODULE: Rsf Fusion
// ───────────────────────────────────────────────────────────────
/**
 * @module rsf-fusion
 *
 * This module implements Relative Score Fusion (RSF) as a comparison/evaluation
 * utility. It is NOT actively used in the search pipeline for ranking. The only
 * remaining integration point is the `rsfShadow` metadata field in
 * `hybrid-search.ts` (`Sprint3PipelineMeta.rsfShadow`), which records RSF
 * scores for offline evaluation without affecting live result ordering.
 *
 * The `isRsfEnabled()` feature flag was removed as dead code.
 * The dead RSF branch in hybrid-search.ts was also removed at that time.
 *
 * The core fusion functions (`fuseResultsRsf`, `fuseResultsRsfMulti`,
 * `fuseResultsRsfCrossVariant`) are preserved for:
 * - Offline A/B evaluation against RRF via Kendall tau correlation
 * - Potential future activation if RSF outperforms RRF in evaluation
 *
 * @see feature_catalog/12--query-intelligence/02-relative-score-fusion-in-shadow-mode.md
 */

/** @deprecated RSF fusion dead code. isRsfEnabled() was removed in Sprint 10 audit. Core algorithms retained for reference only. */

import { canonicalRrfId } from '@spec-kit/shared/algorithms/rrf-fusion';

import type { RrfItem, RankedList } from '@spec-kit/shared/algorithms/rrf-fusion';

// Feature catalog: Relative score fusion in shadow mode


/* --- 1. INTERFACES --- */

/** Result of RSF fusion: an RrfItem augmented with normalized fused score and source tracking. */
interface RsfResult extends RrfItem {
  /** Relative Score Fusion score, clamped to [0, 1]. */
  rsfScore: number;
  /** Sources that contributed to this result. */
  sources: string[];
  /** Per-source normalized scores. */
  sourceScores: Record<string, number>;
}

/* --- 2. HELPERS --- */

/**
 * Extract a raw score from an RrfItem.
 * Checks for `score` first, then `similarity`, then falls back
 * to rank-based scoring: 1 - rank / total.
 *
 * @param item  - The result item to extract a score from.
 * @param rank  - Zero-based rank of the item in its source list.
 * @param total - Total number of items in the source list.
 * @returns Numeric score for the item.
 */
function extractScore(item: RrfItem, rank: number, total: number): number {
  if (typeof item.score === 'number' && isFinite(item.score)) {
    return item.score;
  }
  if (typeof item.similarity === 'number' && isFinite(item.similarity)) {
    // Normalize similarity to 0-1; some sources provide 0-100 scale
    return item.similarity > 1 ? item.similarity / 100 : item.similarity;
  }
  // Rank-based fallback ensures items without explicit scores still participate
  if (total <= 1) return 1.0;
  return 1 - rank / total;
}

/**
 * Min-max normalize a value within [min, max].
 * If max === min (all scores identical), returns 1.0.
 *
 * @param value - The raw value to normalize.
 * @param min   - Minimum value in the distribution.
 * @param max   - Maximum value in the distribution.
 * @returns Normalized value in [0, 1].
 */
function minMaxNormalize(value: number, min: number, max: number): number {
  // When all scores identical, normalize to 1.0 (not 0/0) — all equally relevant
  if (max === min) return 1.0;
  return (value - min) / (max - min);
}

/**
 * Clamp a value to [0, 1].
 *
 * @param value - The numeric value to clamp.
 * @returns Value clamped to the range [0, 1].
 */
function clamp01(value: number): number {
  if (value < 0) return 0;
  if (value > 1) return 1;
  return value;
}

/* --- 3. CORE FUNCTION --- */

/**
 * Fuse two ranked result lists using Relative Score Fusion (single-pair).
 *
 * Algorithm:
 * 1. For each list, extract raw scores and compute min/max
 * 2. Normalize each item's score within its source via min-max
 * 3. Items in both lists: fusedScore = (normalizedA + normalizedB) / 2
 * 4. Items in one list only: fusedScore = normalizedScore * 0.5 (single-source penalty)
 * 5. Sort descending by rsfScore
 * 6. All scores clamped to [0, 1]
 *
 * @param listA - First ranked result list with source label.
 * @param listB - Second ranked result list with source label.
 * @returns Fused RsfResult array sorted descending by rsfScore.
 */
function fuseResultsRsf(listA: RankedList, listB: RankedList): RsfResult[] {
  const itemsA = listA.results;
  const itemsB = listB.results;

  // Handle both-empty case
  if (itemsA.length === 0 && itemsB.length === 0) {
    return [];
  }

  // --- Step 1: Extract raw scores ---
  const scoresA = itemsA.map((item, i) => extractScore(item, i, itemsA.length));
  const scoresB = itemsB.map((item, i) => extractScore(item, i, itemsB.length));

  // --- Step 2: Compute min/max per source ---
  // Reduce avoids stack overflow on arrays >100K elements (spread pushes all onto call stack)
  const minA = scoresA.length > 0 ? scoresA.reduce((a, b) => Math.min(a, b), Infinity) : 0;
  const maxA = scoresA.length > 0 ? scoresA.reduce((a, b) => Math.max(a, b), -Infinity) : 0;
  const minB = scoresB.length > 0 ? scoresB.reduce((a, b) => Math.min(a, b), Infinity) : 0;
  const maxB = scoresB.length > 0 ? scoresB.reduce((a, b) => Math.max(a, b), -Infinity) : 0;

  // --- Step 3: Normalize and collect into maps ---
  const normalizedMapA = new Map<string, { item: RrfItem; normalizedScore: number }>();
  for (let i = 0; i < itemsA.length; i++) {
    const normalized = minMaxNormalize(scoresA[i], minA, maxA);
    normalizedMapA.set(canonicalRrfId(itemsA[i].id), { item: itemsA[i], normalizedScore: normalized });
  }

  const normalizedMapB = new Map<string, { item: RrfItem; normalizedScore: number }>();
  for (let i = 0; i < itemsB.length; i++) {
    const normalized = minMaxNormalize(scoresB[i], minB, maxB);
    normalizedMapB.set(canonicalRrfId(itemsB[i].id), { item: itemsB[i], normalizedScore: normalized });
  }

  // --- Step 4: Fuse ---
  const resultMap = new Map<string, RsfResult>();

  // All IDs from both lists
  const allIds = new Set<string>([
    ...normalizedMapA.keys(),
    ...normalizedMapB.keys(),
  ]);

  for (const id of allIds) {
    const entryA = normalizedMapA.get(id);
    const entryB = normalizedMapB.get(id);

    let rsfScore: number;
    const sources: string[] = [];
    const sourceScores: Record<string, number> = {};

    // Merge item properties (prefer A, overlay B)
    let mergedItem: RrfItem;

    if (entryA && entryB) {
      // Item in both lists: average the normalized scores
      rsfScore = (entryA.normalizedScore + entryB.normalizedScore) / 2;
      sources.push(listA.source, listB.source);
      sourceScores[listA.source] = entryA.normalizedScore;
      sourceScores[listB.source] = entryB.normalizedScore;
      mergedItem = { ...entryB.item, ...entryA.item };
    } else if (entryA) {
      // Single-source penalty 0.5 ensures dual-confirmed items rank higher
      rsfScore = entryA.normalizedScore * 0.5;
      sources.push(listA.source);
      sourceScores[listA.source] = entryA.normalizedScore;
      mergedItem = { ...entryA.item };
    } else {
      if (!entryB) continue;
      // Item in B only: apply single-source penalty
      rsfScore = entryB.normalizedScore * 0.5;
      sources.push(listB.source);
      sourceScores[listB.source] = entryB.normalizedScore;
      mergedItem = { ...entryB.item };
    }

    // Clamp to [0, 1]
    rsfScore = clamp01(rsfScore);

    resultMap.set(id, {
      ...mergedItem,
      rsfScore,
      sources,
      sourceScores,
    });
  }

  // --- Step 5: Sort descending by rsfScore ---
  return Array.from(resultMap.values())
    .sort((a, b) => b.rsfScore - a.rsfScore);
}

/* --- 4. MULTI-LIST VARIANT --- */

/**
 * Fuse multiple ranked result lists using Relative Score Fusion (multi-list variant).
 *
 * Algorithm:
 * 1. For each list, extract raw scores and compute per-source min/max
 * 2. Normalize each item's score within its source via min-max
 * 3. For each unique item, average its normalized scores across all sources it appears in
 * 4. Items appearing in only 1 source get a penalty: avgScore * (1 / totalSources)
 *    — penalised proportionally to how many sources they are missing from
 * 5. Sort descending by rsfScore, clamp to [0, 1]
 *
 * @param lists - Array of RankedList sources to fuse.
 * @returns Fused RsfResult array sorted descending by rsfScore.
 */
function fuseResultsRsfMulti(lists: RankedList[]): RsfResult[] {
  if (lists.length === 0) return [];

  // Filter out empty lists; only active channels should affect coverage penalties.
  const nonEmptyLists = lists.filter(l => l.results.length > 0);
  if (nonEmptyLists.length === 0) return [];

  const totalSources = nonEmptyLists.length;

  // --- Step 1 & 2: Extract raw scores and build per-source normalized maps ---
  const sourceMaps: Array<{
    list: RankedList;
    normalizedMap: Map<number | string, { item: RrfItem; normalizedScore: number }>;
  }> = [];

  for (const list of nonEmptyLists) {
    const items = list.results;
    const rawScores = items.map((item, i) => extractScore(item, i, items.length));
    // Reduce avoids stack overflow on arrays >100K elements (spread pushes all onto call stack)
    const minScore = rawScores.reduce((a, b) => Math.min(a, b), Infinity);
    const maxScore = rawScores.reduce((a, b) => Math.max(a, b), -Infinity);

    const normalizedMap = new Map<number | string, { item: RrfItem; normalizedScore: number }>();
    for (let i = 0; i < items.length; i++) {
      const normalized = minMaxNormalize(rawScores[i], minScore, maxScore);
      // L4 FIX: Canonicalize IDs to prevent 42 vs "42" split in RSF maps
      normalizedMap.set(canonicalRrfId(items[i].id), { item: items[i], normalizedScore: normalized });
    }
    sourceMaps.push({ list, normalizedMap });
  }

  // --- Step 3: Collect all unique IDs across all lists ---
  const allIds = new Set<number | string>();
  for (const { normalizedMap } of sourceMaps) {
    for (const id of normalizedMap.keys()) {
      allIds.add(id);
    }
  }

  // --- Step 4: Compute fused scores ---
  const results: RsfResult[] = [];

  for (const id of allIds) {
    let scoreSum = 0;
    let countPresent = 0;
    const sources: string[] = [];
    const sourceScores: Record<string, number> = {};
    let mergedItem: RrfItem | undefined;

    for (const { list, normalizedMap } of sourceMaps) {
      const entry = normalizedMap.get(id);
      if (entry) {
        scoreSum += entry.normalizedScore;
        countPresent++;
        sources.push(list.source);
        sourceScores[list.source] = entry.normalizedScore;
        // Merge items: later sources are used as base, earlier sources overlay
        mergedItem = mergedItem ? { ...mergedItem, ...entry.item } : { ...entry.item };
      }
    }

    const avgScore = scoreSum / countPresent;

    // Apply single-source penalty: items missing from sources get proportional penalty
    let rsfScore: number;
    if (countPresent === totalSources) {
      // Present in all sources — no penalty
      rsfScore = avgScore;
    } else {
      // Proportional penalty scales with missing sources
      rsfScore = avgScore * (countPresent / totalSources);
    }

    rsfScore = clamp01(rsfScore);

    results.push({
      ...(mergedItem as RrfItem),
      rsfScore,
      sources,
      sourceScores,
    });
  }

  // --- Step 5: Sort descending by rsfScore ---
  return results.sort((a, b) => b.rsfScore - a.rsfScore);
}

/* --- 5. CROSS-VARIANT VARIANT --- */

/**
 * Fuse multiple query variants' result sets using Relative Score Fusion (cross-variant).
 *
 * Algorithm:
 * 1. Fuse each variant's lists independently using fuseResultsRsfMulti
 * 2. Track which variants each item appeared in
 * 3. Merge all variant results, averaging rsfScores across variants
 * 4. Apply cross-variant bonus: items in multiple variants get +0.10 per additional variant
 * 5. Sort descending, clamp to [0, 1]
 *
 * @param variantLists - Array of variant result sets, each containing multiple RankedLists
 * @returns Fused results with cross-variant convergence bonuses
 */
function fuseResultsRsfCrossVariant(variantLists: RankedList[][]): RsfResult[] {
  if (variantLists.length === 0) return [];

  // 0.10 cross-variant bonus rewards query interpretation convergence
  const CROSS_VARIANT_BONUS = 0.10;

  // --- Step 1: Fuse each variant's lists independently ---
  const perVariantFused: RsfResult[][] = variantLists.map(lists =>
    fuseResultsRsfMulti(lists)
  );

  // --- Step 2: Track which variants each ID appeared in ---
  // L4 FIX: Canonicalize IDs in cross-variant tracking
  const variantAppearances = new Map<number | string, Set<number>>();
  for (let vi = 0; vi < perVariantFused.length; vi++) {
    for (const result of perVariantFused[vi]) {
      const cid = canonicalRrfId(result.id);
      let variants = variantAppearances.get(cid);
      if (!variants) {
        variants = new Set<number>();
        variantAppearances.set(cid, variants);
      }
      variants.add(vi);
    }
  }

  // --- Step 3: Merge all variant results, averaging rsfScores across variants ---
  const mergedMap = new Map<number | string, {
    result: RsfResult;
    scoreSum: number;
    variantCount: number;
    sourceScoreSums: Record<string, number>;
    sourceScoreCounts: Record<string, number>;
    /** O(1) dedup tracking for sources (A3-P2-2) */
    sourcesSet: Set<string>;
  }>();

  for (const variantResults of perVariantFused) {
    for (const result of variantResults) {
      const canonicalId = canonicalRrfId(result.id);
      const existing = mergedMap.get(canonicalId);
      if (existing) {
        existing.scoreSum += result.rsfScore;
        existing.variantCount++;
        // Merge sources (deduplicate via Set for O(1) lookup)
        for (const src of result.sources) {
          if (!existing.sourcesSet.has(src)) {
            existing.sourcesSet.add(src);
            existing.result.sources.push(src);
          }
        }
        // Accumulate sourceScores sums and counts for true average
        for (const [key, val] of Object.entries(result.sourceScores)) {
          existing.sourceScoreSums[key] = (existing.sourceScoreSums[key] ?? 0) + val;
          existing.sourceScoreCounts[key] = (existing.sourceScoreCounts[key] ?? 0) + 1;
        }
      } else {
        mergedMap.set(canonicalId, {
          result: { ...result, sources: [...result.sources], sourceScores: { ...result.sourceScores } },
          scoreSum: result.rsfScore,
          variantCount: 1,
          sourceScoreSums: { ...result.sourceScores },
          sourceScoreCounts: Object.fromEntries(Object.keys(result.sourceScores).map(k => [k, 1])),
          sourcesSet: new Set(result.sources),
        });
      }
    }
  }

  // Compute true average for sourceScores
  for (const { result, sourceScoreSums, sourceScoreCounts } of mergedMap.values()) {
    for (const key of Object.keys(sourceScoreSums)) {
      result.sourceScores[key] = sourceScoreSums[key] / sourceScoreCounts[key];
    }
  }

  // Compute average rsfScore across variants and apply cross-variant bonus
  const finalResults: RsfResult[] = [];
  for (const [id, { result, scoreSum, variantCount }] of mergedMap) {
    const avgScore = scoreSum / variantCount;
    const variantSetSize = variantAppearances.get(id)?.size ?? 1;

    // --- Step 4: Apply cross-variant bonus (+0.10 per additional variant) ---
    let rsfScore = avgScore;
    if (variantSetSize >= 2) {
      rsfScore += CROSS_VARIANT_BONUS * (variantSetSize - 1);
    }

    // Clamp to [0, 1]
    rsfScore = clamp01(rsfScore);

    finalResults.push({
      ...result,
      rsfScore,
    });
  }

  // --- Step 5: Sort descending by rsfScore ---
  return finalResults.sort((a, b) => b.rsfScore - a.rsfScore);
}

/* --- 6. EXPORTS --- */

export {
  fuseResultsRsf,
  fuseResultsRsfMulti,
  fuseResultsRsfCrossVariant,
  extractScore,
  minMaxNormalize,
  clamp01,
};

export type {
  RsfResult,
};
