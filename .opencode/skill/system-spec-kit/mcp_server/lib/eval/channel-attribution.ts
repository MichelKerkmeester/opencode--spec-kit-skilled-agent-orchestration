// ───────────────────────────────────────────────────────────────
// MODULE: Channel Attribution
// ───────────────────────────────────────────────────────────────
//
// Tags each search result with its source channel(s) for evaluation analysis.
// Computes Exclusive Contribution Rate: how often each channel is the SOLE
// Source for a result in top-K.
//
// Channels: vector, fts, bm25, graph, trigger (extensible).
//
// Design notes:
//   - Pure functions — no DB access, no side effects.
//   - Channel names are lowercase strings matching existing conventions
// (see rrf-fusion.ts SOURCE_TYPES and eval-logger.ts channel parameter).

/** @deprecated Never wired into production pipeline. Channel attribution superseded by ablation-framework.ts. */

/* --- 1. TYPES --- */

/** Known retrieval channels (extensible — any lowercase string accepted). */

// Feature catalog: Shadow scoring and channel attribution

export type ChannelName = 'vector' | 'fts' | 'bm25' | 'graph' | 'trigger' | string;

/** A single result with channel attribution tags. */
export interface AttributedResult {
  /** Memory ID. */
  memoryId: number;
  /** Score assigned by the search system. */
  score: number;
  /** 1-based rank position in the result list. */
  rank: number;
  /** Set of channels that contributed this result. */
  channels: Set<ChannelName>;
  /** True if this result came from exactly one channel. */
  isExclusive: boolean;
  /** The exclusive channel name, if isExclusive is true. */
  exclusiveChannel?: ChannelName;
}

/**
 * Per-channel source input: which memory IDs were returned by each channel.
 * Key = channel name, Value = array of memory IDs returned by that channel.
 */
export type ChannelSources = Record<ChannelName, number[]>;

/** Exclusive Contribution Rate for a single channel. */
export interface ChannelECR {
  /** Channel name. */
  channel: ChannelName;
  /** Number of results in top-K that came ONLY from this channel. */
  exclusiveCount: number;
  /** Total number of results in top-K. */
  totalInTopK: number;
  /**
   * Exclusive Contribution Rate = exclusiveCount / totalInTopK.
   * Range: [0, 1]. 0 = no exclusive contributions, 1 = all exclusive.
   */
  ecr: number;
}

/** Full channel attribution report for an eval run. */
export interface ChannelAttributionReport {
  /** Total results analyzed. */
  totalResults: number;
  /** K value used for top-K analysis. */
  k: number;
  /** Per-channel ECR metrics. */
  channelECRs: ChannelECR[];
  /** Results attributed to multiple channels (convergence). */
  multiChannelCount: number;
  /** Results attributed to exactly one channel (exclusive). */
  singleChannelCount: number;
  /** Results with no channel attribution (orphans). */
  unattributedCount: number;
  /** Channel distribution: how many top-K results each channel contributed to. */
  channelCoverage: Record<ChannelName, number>;
}

/* --- 2. INTERNAL HELPERS --- */

/** Sort results by rank ascending, return first k items. */
function topK<T extends { rank: number }>(results: T[], k: number): T[] {
  return [...results]
    .sort((a, b) => a.rank - b.rank)
    .slice(0, k);
}

/* --- 3. PUBLIC API --- */

/**
 * Tag each result with its contributing channel(s).
 *
 * For each result, determines which channels produced it based on the
 * channelSources mapping. A result may be tagged with multiple channels
 * (convergence) or a single channel (exclusive).
 *
 * @param results - Unattributed search results with memoryId, score, and rank.
 * @param channelSources - Per-channel memory ID lists (which IDs each channel returned).
 * @returns Array of AttributedResult with channel tags, preserving original order.
 */
export function attributeChannels(
  results: Array<{ memoryId: number; score: number; rank: number }>,
  channelSources: ChannelSources,
): AttributedResult[] {
  // Build reverse mapping: memoryId → set of contributing channels
  const idToChannels = new Map<number, Set<ChannelName>>();

  for (const [channel, memoryIds] of Object.entries(channelSources)) {
    for (const id of memoryIds) {
      let channels = idToChannels.get(id);
      if (!channels) {
        channels = new Set();
        idToChannels.set(id, channels);
      }
      channels.add(channel);
    }
  }

  return results.map(r => {
    const channels = idToChannels.get(r.memoryId) ?? new Set<ChannelName>();
    const isExclusive = channels.size === 1;
    const exclusiveChannel = isExclusive ? [...channels][0] : undefined;

    return {
      memoryId: r.memoryId,
      score: r.score,
      rank: r.rank,
      channels,
      isExclusive,
      exclusiveChannel,
    };
  });
}

/**
 * Compute the Exclusive Contribution Rate for each channel.
 *
 * ECR(channel) = count of top-K results where channel is the SOLE source
 *              / total results in top-K
 *
 * High ECR means the channel provides unique value that no other channel delivers.
 * Low ECR means the channel's results are mostly duplicated by other channels.
 *
 * @param attributedResults - Results with channel attribution tags.
 * @param k - Top-K cutoff for analysis. Defaults to 10.
 * @returns Array of ChannelECR, one per channel found in the data.
 */
export function computeExclusiveContributionRate(
  attributedResults: AttributedResult[],
  k: number = 10,
): ChannelECR[] {
  const topResults = topK(attributedResults, k);
  const totalInTopK = topResults.length;

  if (totalInTopK === 0) return [];

  // Count exclusive contributions per channel
  const exclusiveCounts = new Map<ChannelName, number>();

  // Collect all channels seen
  const allChannels = new Set<ChannelName>();
  for (const r of topResults) {
    for (const ch of r.channels) {
      allChannels.add(ch);
    }
  }

  // Initialize counts
  for (const ch of allChannels) {
    exclusiveCounts.set(ch, 0);
  }

  // Count exclusives
  for (const r of topResults) {
    if (r.isExclusive && r.exclusiveChannel) {
      const current = exclusiveCounts.get(r.exclusiveChannel) ?? 0;
      exclusiveCounts.set(r.exclusiveChannel, current + 1);
    }
  }

  // Build ECR results
  const ecrs: ChannelECR[] = [];
  for (const channel of allChannels) {
    const exclusiveCount = exclusiveCounts.get(channel) ?? 0;
    ecrs.push({
      channel,
      exclusiveCount,
      totalInTopK,
      ecr: exclusiveCount / totalInTopK,
    });
  }

  // Sort by ECR descending for readability
  ecrs.sort((a, b) => b.ecr - a.ecr);

  return ecrs;
}

/**
 * Generate a full channel attribution report for an eval run.
 *
 * Combines attribution tagging with ECR computation and provides
 * a comprehensive breakdown of channel contributions.
 *
 * @param results - Unattributed search results.
 * @param channelSources - Per-channel memory ID lists.
 * @param k - Top-K cutoff for ECR analysis. Defaults to 10.
 * @returns ChannelAttributionReport with ECR metrics and coverage data.
 */
export function getChannelAttribution(
  results: Array<{ memoryId: number; score: number; rank: number }>,
  channelSources: ChannelSources,
  k: number = 10,
): ChannelAttributionReport {
  const attributed = attributeChannels(results, channelSources);
  const topResults = topK(attributed, k);

  // Compute ECR
  const channelECRs = computeExclusiveContributionRate(attributed, k);

  // Count categories
  let multiChannelCount = 0;
  let singleChannelCount = 0;
  let unattributedCount = 0;

  for (const r of topResults) {
    if (r.channels.size === 0) {
      unattributedCount++;
    } else if (r.channels.size === 1) {
      singleChannelCount++;
    } else {
      multiChannelCount++;
    }
  }

  // Channel coverage: how many top-K results each channel appears in
  const channelCoverage: Record<ChannelName, number> = {};
  for (const r of topResults) {
    for (const ch of r.channels) {
      channelCoverage[ch] = (channelCoverage[ch] ?? 0) + 1;
    }
  }

  return {
    totalResults: topResults.length,
    k,
    channelECRs,
    multiChannelCount,
    singleChannelCount,
    unattributedCount,
    channelCoverage,
  };
}
