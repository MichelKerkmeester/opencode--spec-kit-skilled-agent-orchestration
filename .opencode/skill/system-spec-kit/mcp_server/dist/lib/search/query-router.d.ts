import { type QueryComplexityTier, type ClassificationResult } from './query-classifier.js';
/** Channel names matching SOURCE_TYPES in rrf-fusion.ts */
type ChannelName = 'vector' | 'fts' | 'bm25' | 'graph' | 'degree';
/** Maps each complexity tier to the set of channels that should be executed. */
interface ChannelRoutingConfig {
    simple: ChannelName[];
    moderate: ChannelName[];
    complex: ChannelName[];
}
/** Result of the routeQuery convenience function. */
interface RouteResult {
    tier: QueryComplexityTier;
    channels: ChannelName[];
    classification: ClassificationResult;
}
/** All available channels in execution order. */
declare const ALL_CHANNELS: readonly ChannelName[];
/** Minimum required channels for safe routing. */
declare const MIN_CHANNELS = 2;
/** Fallback channels used to pad configs that violate the minimum invariant. */
declare const FALLBACK_CHANNELS: readonly ChannelName[];
/**
 * Default tier-to-channel mapping:
 * - simple:   2 channels (vector + fts) — fastest path
 * - moderate: 3 channels (vector + fts + bm25) — balanced
 * - complex:  5 channels (all) — full pipeline
 */
declare const DEFAULT_ROUTING_CONFIG: ChannelRoutingConfig;
/**
 * Enforce the minimum 2-distinct-channel invariant on a channel list.
 * If the list has fewer than MIN_CHANNELS entries, pad with
 * fallback channels (vector, fts) until the minimum is met.
 */
declare function enforceMinimumChannels(channels: ChannelName[]): ChannelName[];
/**
 * Get the channel subset for a given complexity tier.
 *
 * @param tier - The classified query complexity tier
 * @param config - Optional custom routing config (defaults to DEFAULT_ROUTING_CONFIG)
 * @returns Array of channel names to execute, guaranteed minimum 2 channels
 */
declare function getChannelSubset(tier: QueryComplexityTier, config?: ChannelRoutingConfig): ChannelName[];
/**
 * Classify a query's complexity and route it to the appropriate channel subset
 * in a single call.
 *
 * When the SPECKIT_COMPLEXITY_ROUTER feature flag is disabled, returns all 5 channels
 * (full pipeline) regardless of classification result.
 *
 * @param query - The search query to classify and route
 * @param triggerPhrases - Optional trigger phrases for simple-tier classification
 * @returns RouteResult with tier, channels, and full classification details
 */
declare function routeQuery(query: string, triggerPhrases?: string[]): RouteResult;
export { type ChannelName, type ChannelRoutingConfig, type RouteResult, DEFAULT_ROUTING_CONFIG, ALL_CHANNELS, MIN_CHANNELS, FALLBACK_CHANNELS, getChannelSubset, routeQuery, enforceMinimumChannels, };
//# sourceMappingURL=query-router.d.ts.map