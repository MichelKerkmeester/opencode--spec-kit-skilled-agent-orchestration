// ───────────────────────────────────────────────────────────────
// MODULE: Channel Enforcement
// ───────────────────────────────────────────────────────────────
// Feature catalog: Channel min-representation
// Pipeline-ready wrapper around the channel min-representation check.
// Provides a single enforceChannelRepresentation() entry point for
// Use inside the hybrid-search pipeline after RRF/RSF fusion.
//
// Feature flag: SPECKIT_CHANNEL_MIN_REP (default: enabled / graduated)
// Delegates core logic to channel-representation.ts.
import {
  analyzeChannelRepresentation,
  isChannelMinRepEnabled,
} from './channel-representation.js';

// ───────────────────────────────────────────────────────────────
// 1. INTERFACES

// ───────────────────────────────────────────────────────────────
/** A fused result item returned from the search pipeline. */
interface FusedResult {
  id: number | string;
  score: number;
  source: string;
  sources?: string[];
  [key: string]: unknown;
}

/** A raw result from a single retrieval channel. */
interface ChannelResult {
  id: number | string;
  score: number;
  [key: string]: unknown;
}

interface PromotedChannelResult extends ChannelResult {
  source: string;
  promotedFrom: string;
  promotedRawScore: number;
}

/** Metadata describing what enforcement did (or did not do). */
interface EnforcementMetadata {
  /** True when the feature flag was enabled and enforcement was evaluated. */
  applied: boolean;
  /** Number of results promoted from under-represented channels. */
  promotedCount: number;
  /** Channel names that had results but were missing from the top-k window. */
  underRepresentedChannels: string[];
  /** Per-channel item count in the final result set. */
  channelCounts: Record<string, number>;
}

/** Return value of enforceChannelRepresentation(). */
export interface EnforcementResult {
  results: Array<FusedResult>;
  enforcement: EnforcementMetadata;
}

// ───────────────────────────────────────────────────────────────
// 2. MAIN EXPORT

// ───────────────────────────────────────────────────────────────
/**
 * Apply channel min-representation enforcement to a set of fused search results.
 *
 * Behaviour:
 *  - When the feature flag (SPECKIT_CHANNEL_MIN_REP) is disabled, passes
 *    results through unchanged with `enforcement.applied = false`.
 *  - When enabled, inspects the top `topK` results (defaulting to all
 *    results when topK is omitted) and promotes the best-qualifying result
 *    from any channel that returned results but is absent from that window.
 *  - Promoted items are appended, their raw per-channel scores are normalized
 *    into the existing fused score range, and the full result list is then
 *    re-sorted by score (descending) so callers always receive a score-ordered list.
 *  - Only results with score >= QUALITY_FLOOR (0.005) are eligible for
 *    promotion; channels whose best result is below the floor are noted
 *    in `underRepresentedChannels` but no item is injected.
 *
 * @param fusedResults      - Post-fusion results, ordered by score descending.
 * @param channelResultSets - Map of channel name → raw results from that channel.
 * @param topK              - Window size to inspect. When omitted, defaults to
 *                            fusedResults.length (i.e. the entire result list is
 *                            used as the inspection window).
 * @returns EnforcementResult with the (potentially extended) result list and metadata.
 */
export function enforceChannelRepresentation(
  fusedResults: Array<FusedResult>,
  channelResultSets: Map<string, Array<ChannelResult>>,
  topK?: number,
): EnforcementResult {
  // Determine the inspection window size.
  const windowSize = topK !== undefined ? Math.max(0, topK) : fusedResults.length;

  // ---- Feature flag disabled — pass through unchanged ----
  if (!isChannelMinRepEnabled()) {
    return {
      results: [...fusedResults],
      enforcement: {
        applied: false,
        promotedCount: 0,
        underRepresentedChannels: [],
        channelCounts: computeChannelCounts(fusedResults),
      },
    };
  }

  // ---- Slice the window for analysis ----
  const window = fusedResults.slice(0, windowSize);
  const tail = fusedResults.slice(windowSize);

  // ---- Delegate to core channel-representation logic ----
  const analysis = analyzeChannelRepresentation(window, channelResultSets);

  const normalizedPromotions = normalizePromotedItems(
    analysis.promoted,
    channelResultSets,
    fusedResults,
  );

  // Reassemble and globally re-sort by score to preserve strict ordering
  // Even when topK < fusedResults.length and promotions are inserted.
  const finalResults: Array<FusedResult> = [...window, ...tail, ...normalizedPromotions]
    .sort((a, b) => b.score - a.score) as Array<FusedResult>;

  return {
    results: finalResults,
    enforcement: {
      applied: true,
      promotedCount: analysis.promoted.length,
      underRepresentedChannels: analysis.underRepresentedChannels,
      channelCounts: computeChannelCounts(finalResults),
    },
  };
}

// ───────────────────────────────────────────────────────────────
// 3. HELPERS

// ───────────────────────────────────────────────────────────────
/**
 * Count how many items in a result array belong to each channel.
 * Uses the `source` field as the channel identifier.
 */
function computeChannelCounts(items: Array<FusedResult>): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const item of items) {
    counts[item.source] = (counts[item.source] ?? 0) + 1;
  }
  return counts;
}

function normalizePromotedItems(
  promoted: Array<PromotedChannelResult>,
  channelResultSets: Map<string, Array<ChannelResult>>,
  fusedResults: Array<FusedResult>,
): Array<FusedResult> {
  if (promoted.length === 0) {
    return [];
  }

  const fusedScoreRange = computeScoreRange(fusedResults);
  if (!fusedScoreRange) {
    return promoted.map(item => ({ ...item }));
  }

  return promoted.map(item => {
    const channelScoreRange = computeScoreRange(channelResultSets.get(item.promotedFrom) ?? []);
    const normalizedWithinChannel = normalizeScoreWithinRange(item.promotedRawScore, channelScoreRange);
    const score = projectIntoRange(normalizedWithinChannel, fusedScoreRange.min, fusedScoreRange.max);

    return {
      ...item,
      score,
    };
  });
}

function computeScoreRange(
  items: Array<{ score: number }>,
): { min: number; max: number } | null {
  let min = Infinity;
  let max = -Infinity;

  for (const item of items) {
    if (!Number.isFinite(item.score)) {
      continue;
    }
    min = Math.min(min, item.score);
    max = Math.max(max, item.score);
  }

  if (!Number.isFinite(min) || !Number.isFinite(max)) {
    return null;
  }

  return { min, max };
}

function normalizeScoreWithinRange(
  score: number,
  range: { min: number; max: number } | null,
): number {
  if (!range || !Number.isFinite(score)) {
    return 0;
  }

  const width = range.max - range.min;
  if (width <= 0) {
    return 0;
  }

  return Math.min(1, Math.max(0, (score - range.min) / width));
}

function projectIntoRange(normalizedScore: number, min: number, max: number): number {
  const width = max - min;
  if (!Number.isFinite(min) || !Number.isFinite(max) || width <= 0) {
    return min;
  }
  return min + (normalizedScore * width);
}
