// ---------------------------------------------------------------
// MODULE: Channel Enforcement (T003b)
// Pipeline-ready wrapper around the channel min-representation check.
// Provides a single enforceChannelRepresentation() entry point for
// use inside the hybrid-search pipeline after RRF/RSF fusion.
//
// Feature flag: SPECKIT_CHANNEL_MIN_REP (default: disabled)
// Delegates core logic to channel-representation.ts.
// ---------------------------------------------------------------

import {
  analyzeChannelRepresentation,
  isChannelMinRepEnabled,
} from './channel-representation';

/* ---------------------------------------------------------------
   1. INTERFACES
   --------------------------------------------------------------- */

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

/* ---------------------------------------------------------------
   2. MAIN EXPORT
   --------------------------------------------------------------- */

/**
 * Apply channel min-representation enforcement to a set of fused search results.
 *
 * Behaviour:
 *  - When the feature flag (SPECKIT_CHANNEL_MIN_REP) is disabled, passes
 *    results through unchanged with `enforcement.applied = false`.
 *  - When enabled, inspects the top `topK` results (defaulting to all
 *    results when topK is omitted) and promotes the best-qualifying result
 *    from any channel that returned results but is absent from that window.
 *  - Promoted items are APPENDED to the window slice and then the full
 *    result list is re-sorted by score (descending) so callers always
 *    receive a score-ordered list.
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

  // Reassemble and globally re-sort by score to preserve strict ordering
  // even when topK < fusedResults.length and promotions are inserted.
  const finalResults: Array<FusedResult> = [...analysis.topK, ...tail]
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

/* ---------------------------------------------------------------
   3. HELPERS
   --------------------------------------------------------------- */

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
