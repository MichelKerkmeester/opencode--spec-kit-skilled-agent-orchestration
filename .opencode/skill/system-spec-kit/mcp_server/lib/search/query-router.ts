// ───────────────────────────────────────────────────────────────
// MODULE: Query Router
// ───────────────────────────────────────────────────────────────
// Tier-to-channel-subset routing for query complexity
// Maps classifier tiers to channel subsets for selective pipeline execution.

import {
  classifyQueryComplexity,
  isComplexityRouterEnabled,
  type QueryComplexityTier,
  type ClassificationResult,
} from './query-classifier.js';
import { getStrategyForQuery } from './artifact-routing.js';
import { classifyIntent } from './intent-classifier.js';

// Feature catalog: Query complexity router


/* ───────────────────────────────────────────────────────────────
   1. TYPES & CONSTANTS
----------------------------------------------------------------*/

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
const ALL_CHANNELS: readonly ChannelName[] = ['vector', 'fts', 'bm25', 'graph', 'degree'] as const;

/** Minimum required channels for safe routing. */
const MIN_CHANNELS = 2;

/** Fallback channels used to pad configs that violate the minimum invariant. */
const FALLBACK_CHANNELS: readonly ChannelName[] = ['vector', 'fts'] as const;
const BM25_PRESERVING_ARTIFACTS = new Set([
  'spec',
  'plan',
  'tasks',
  'checklist',
  'decision-record',
  'implementation-summary',
  'research',
]);

/* ───────────────────────────────────────────────────────────────
   2. DEFAULT ROUTING CONFIG
----------------------------------------------------------------*/

/**
 * Default tier-to-channel mapping:
 * - simple:   2 channels (vector + fts) — fastest path
 * - moderate: 3 channels (vector + fts + bm25) — balanced
 * - complex:  5 channels (all) — full pipeline
 */
const DEFAULT_ROUTING_CONFIG: ChannelRoutingConfig = {
  simple: ['vector', 'fts'],
  moderate: ['vector', 'fts', 'bm25'],
  complex: ['vector', 'fts', 'bm25', 'graph', 'degree'],
};

/* ───────────────────────────────────────────────────────────────
   3. CHANNEL SUBSET RESOLUTION
----------------------------------------------------------------*/

/**
 * Enforce the minimum 2-distinct-channel invariant on a channel list.
 * If the list has fewer than MIN_CHANNELS entries, pad with
 * fallback channels (vector, fts) until the minimum is met.
 */
function enforceMinimumChannels(channels: ChannelName[]): ChannelName[] {
  const result = [...new Set(channels)] as ChannelName[];
  if (result.length >= MIN_CHANNELS) return result;

  for (const fallback of FALLBACK_CHANNELS) {
    if (result.length >= MIN_CHANNELS) break;
    if (!result.includes(fallback)) {
      result.push(fallback);
    }
  }

  return result;
}

/**
 * Get the channel subset for a given complexity tier.
 *
 * @param tier - The classified query complexity tier
 * @param config - Optional custom routing config (defaults to DEFAULT_ROUTING_CONFIG)
 * @returns Array of channel names to execute, guaranteed minimum 2 channels
 */
function getChannelSubset(
  tier: QueryComplexityTier,
  config?: ChannelRoutingConfig,
): ChannelName[] {
  const effectiveConfig = config ?? DEFAULT_ROUTING_CONFIG;
  const channels = effectiveConfig[tier] ?? [...ALL_CHANNELS];
  return enforceMinimumChannels([...channels]);
}

function shouldPreserveBm25(query: string): boolean {
  const intent = classifyIntent(query).intent;
  if (intent === 'find_spec' || intent === 'find_decision') {
    return true;
  }

  const artifact = getStrategyForQuery(query).detectedClass;
  return BM25_PRESERVING_ARTIFACTS.has(artifact);
}

/* ───────────────────────────────────────────────────────────────
   4. CONVENIENCE: CLASSIFY + ROUTE
----------------------------------------------------------------*/

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
function routeQuery(
  query: string,
  triggerPhrases?: string[],
): RouteResult {
  const classification = classifyQueryComplexity(query, triggerPhrases);

  // When feature flag is disabled, classifier returns 'complex' with 'fallback' confidence.
  // In that case, always return all channels (full pipeline — safe default).
  if (!isComplexityRouterEnabled()) {
    return {
      tier: classification.tier,
      channels: [...ALL_CHANNELS],
      classification,
    };
  }

  const channels = getChannelSubset(classification.tier);
  const adjustedChannels = classification.tier === 'simple' && shouldPreserveBm25(query)
    ? enforceMinimumChannels([...channels, 'bm25'])
    : channels;

  return {
    tier: classification.tier,
    channels: adjustedChannels,
    classification,
  };
}

/* ───────────────────────────────────────────────────────────────
   5. EXPORTS
----------------------------------------------------------------*/

export {
  // Types
  type ChannelName,
  type ChannelRoutingConfig,
  type RouteResult,

  // Constants
  DEFAULT_ROUTING_CONFIG,
  ALL_CHANNELS,
  MIN_CHANNELS,
  FALLBACK_CHANNELS,

  // Functions
  getChannelSubset,
  routeQuery,

  // Internal helpers (exported for testing)
  enforceMinimumChannels,
};
