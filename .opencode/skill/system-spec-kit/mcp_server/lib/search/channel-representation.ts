// ───────────────────────────────────────────────────────────────
// MODULE: Channel Representation
// ───────────────────────────────────────────────────────────────
/* --- 1. CONSTANTS --- */

/** Minimum similarity / relevance score for a result to qualify for promotion.
 * QUALITY_FLOOR changed from 0.2 to 0.005 during calibration. The original 0.2
 * assumed normalized [0,1] scores, but raw RRF scores (~0.01-0.03) never exceeded that
 * threshold, causing channel-representation promotion to silently reject ALL RRF results.
 * The 0.005 floor prevents promoting genuinely irrelevant results while remaining
 * compatible with both raw RRF scores and normalized [0,1] scores. */

// Feature catalog: Channel min-representation
import { isChannelMinRepEnabled } from './search-flags.js';

export const QUALITY_FLOOR = 0.005;

/* --- 2. INTERFACES --- */

/** A single item that may appear in a top-k result set. */
interface TopKItem {
  id: number | string;
  score: number;
  source: string;
  sources?: string[];
  [key: string]: unknown;
}

/** A promoted item – a TopKItem augmented with the channel name it was lifted from. */
interface PromotedItem {
  id: number | string;
  score: number;
  source: string;
  promotedFrom: string;
  promotedRawScore: number;
  [key: string]: unknown;
}

/** A raw result from a single retrieval channel (no source field required). */
interface ChannelResult {
  id: number | string;
  score: number;
  [key: string]: unknown;
}

/**
 * Return value of `analyzeChannelRepresentation`.
 *
 * - `topK`                   — original top-k plus any promoted items appended at the end
 * - `promoted`               — items that were promoted from under-represented channels
 * - `underRepresentedChannels` — channel names that had 0 results in topK but did return results
 * - `channelCounts`          — per-channel result counts in the final (enhanced) topK
 */
export interface ChannelRepresentationResult {
  topK: Array<TopKItem>;
  promoted: Array<PromotedItem>;
  underRepresentedChannels: string[];
  channelCounts: Record<string, number>;
}

/* --- 3. CORE FUNCTION --- */

/**
 * Analyse a post-fusion top-k result set and, when the feature flag is
 * enabled, promote the best-scoring result from every channel that
 * contributed results but has zero representation in top-k.
 *
 * Rules:
 *  - Only checks channels that actually returned results (no phantom penalties).
 *  - A channel is under-represented when it has 0 results in topK.
 *  - Promotion only occurs for results with score >= QUALITY_FLOOR (0.005).
 *  - When the flag is disabled the function returns topK unchanged (no-op).
 *  - The `source` field of each topK item is the authoritative channel label.
 *    Items that carry a `sources` array (multi-channel convergence) are counted
 *    toward each channel listed in that array.
 *
 * @param topK              - Ordered top-k results from RRF fusion.
 * @param allChannelResults - Map of channel name → raw results for that channel.
 * @returns ChannelRepresentationResult with enhanced topK and promotion metadata.
 */
export function analyzeChannelRepresentation(
  topK: Array<TopKItem>,
  allChannelResults: Map<string, Array<ChannelResult>>,
): ChannelRepresentationResult {
  // Feature flag gate — return topK unchanged when disabled.
  if (!isChannelMinRepEnabled()) {
    return {
      topK: [...topK],
      promoted: [],
      underRepresentedChannels: [],
      channelCounts: computeChannelCounts(topK),
    };
  }

  // Edge case: nothing to analyse.
  if (topK.length === 0 || allChannelResults.size === 0) {
    return {
      topK: [...topK],
      promoted: [],
      underRepresentedChannels: [],
      channelCounts: {},
    };
  }

  // Compute which channels are represented in the current top-k.
  const representedChannels = new Set<string>();
  for (const item of topK) {
    // Count primary source
    representedChannels.add(item.source);
    // Also count any additional sources (multi-channel convergence)
    if (Array.isArray(item.sources)) {
      for (const s of item.sources) {
        representedChannels.add(s);
      }
    }
  }

  // Identify which channels that returned results are missing from top-k.
  const underRepresentedChannels: string[] = [];
  for (const [channelName, channelResults] of allChannelResults) {
    if (channelResults.length === 0) continue; // channel returned nothing — not penalised
    if (!representedChannels.has(channelName)) {
      underRepresentedChannels.push(channelName);
    }
  }

  // No gaps — nothing to promote.
  if (underRepresentedChannels.length === 0) {
    return {
      topK: [...topK],
      promoted: [],
      underRepresentedChannels: [],
      channelCounts: computeChannelCounts(topK),
    };
  }

  // Padding appends the best item from each missing channel to guarantee
  // Every contributing channel has at least one representative in the result set.
  const promoted: PromotedItem[] = [];
  const enhancedTopK: Array<TopKItem> = [...topK];

  for (const channelName of underRepresentedChannels) {
    const results = allChannelResults.get(channelName) ?? [];

    // Find the highest-scoring result that meets the quality floor.
    let best: ChannelResult | null = null;
    for (const r of results) {
      if (r.score < QUALITY_FLOOR) continue;
      if (best === null || r.score > best.score) {
        best = r;
      }
    }

    if (best === null) continue; // no qualifying result — skip channel

    const promotedItem: PromotedItem = {
      ...best,
      source: channelName,
      promotedFrom: channelName,
      promotedRawScore: best.score,
    };

    promoted.push(promotedItem);
    enhancedTopK.push({ ...promotedItem });
  }

  return {
    topK: enhancedTopK,
    promoted,
    underRepresentedChannels: [...underRepresentedChannels],
    channelCounts: computeChannelCounts(enhancedTopK),
  };
}

/* --- 5. HELPERS --- */

/**
 * Count how many items in an array belong to each channel.
 * Uses the `source` field as the channel identifier.
 *
 * @param items - Array of TopKItem results to tally.
 * @returns Record mapping channel name to item count.
 */
function computeChannelCounts(items: Array<TopKItem>): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const item of items) {
    counts[item.source] = (counts[item.source] ?? 0) + 1;
  }
  return counts;
}

export { isChannelMinRepEnabled };
