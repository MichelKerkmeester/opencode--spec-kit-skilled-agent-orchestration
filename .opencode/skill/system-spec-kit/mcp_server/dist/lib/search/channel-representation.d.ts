/** Minimum similarity / relevance score for a result to qualify for promotion.
 * QUALITY_FLOOR changed from 0.2 to 0.005 during calibration. The original 0.2
 * assumed normalized [0,1] scores, but raw RRF scores (~0.01-0.03) never exceeded that
 * threshold, causing channel-representation promotion to silently reject ALL RRF results.
 * The 0.005 floor prevents promoting genuinely irrelevant results while remaining
 * compatible with both raw RRF scores and normalized [0,1] scores. */
import { isChannelMinRepEnabled } from './search-flags.js';
export declare const QUALITY_FLOOR = 0.005;
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
export declare function analyzeChannelRepresentation(topK: Array<TopKItem>, allChannelResults: Map<string, Array<ChannelResult>>): ChannelRepresentationResult;
export { isChannelMinRepEnabled };
//# sourceMappingURL=channel-representation.d.ts.map