// ───────────────────────────────────────────────────────────────
// MODULE: Result Explainability
// ───────────────────────────────────────────────────────────────
// REQ-D5-002: Two-Tier Explainability
//
// PURPOSE: Attach natural-language "why" explanations to each
// search result, composed from the scoring signals applied during
// Stage 2 fusion. Two tiers:
//   - slim (default): why.summary + topSignals — always present when flag ON
//   - debug (opt-in): adds channelContribution map
//
// FEATURE FLAG: SPECKIT_RESULT_EXPLAIN_V1 (default ON, graduated)
//
// OUTPUT SHAPE (per result):
// {
//   "why": {
//     "summary": "Ranked first because semantic, reranker, decision-anchor agreed",
//     "topSignals": ["semantic_match", "anchor:decisions"],
//     "channelContribution": { "vector": 0.44, "fts": 0.12, "graph": 0.06 }
//   }
// }
//
// The channelContribution map is only included when debug.enabled=true.

import type { PipelineRow } from './pipeline/types.js';
import { resolveEffectiveScore } from './pipeline/types.js';

// ── Types ──────────────────────────────────────────────────────

/** Named signal labels used in topSignals and summary composition. */
export type SignalLabel =
  | 'semantic_match'
  | 'lexical_match'
  | 'graph_boosted'
  | 'session_boosted'
  | 'causal_boosted'
  | 'community_boosted'
  | 'reranker_support'
  | 'feedback_boosted'
  | 'validation_quality'
  | `anchor:${string}`;

/** Per-channel score contribution breakdown (debug tier). */
export interface ChannelContribution {
  vector: number;
  fts: number;
  graph: number;
}

/** Slim explainability payload — always present when flag ON. */
export interface WhySlim {
  summary: string;
  topSignals: SignalLabel[];
}

/** Full explainability payload — includes channelContribution when debug ON. */
export interface WhyFull extends WhySlim {
  channelContribution?: ChannelContribution;
}

/** Result row augmented with explainability data. */
export interface ResultWithWhy extends Record<string, unknown> {
  id: number;
  why?: WhyFull;
}

/** Options controlling explainability attachment. */
export interface ExplainabilityOptions {
  /** Whether to include channelContribution (debug tier). Default: false. */
  debugEnabled?: boolean;
}

// ── Feature flag ──────────────────────────────────────────────

import { isResultExplainEnabled } from './search-flags.js';

/**
 * Returns true when SPECKIT_RESULT_EXPLAIN_V1 is enabled.
 * Default: ON (graduated). Set SPECKIT_RESULT_EXPLAIN_V1=false to disable.
 */
export { isResultExplainEnabled };

// ── Internal helpers ──────────────────────────────────────────

/**
 * Extract the list of active scoring signals from a PipelineRow.
 * Returns labels in descending order of influence.
 */
function extractSignals(row: PipelineRow): SignalLabel[] {
  const signals: SignalLabel[] = [];

  // Semantic match: the primary similarity score
  const score = resolveEffectiveScore(row);
  if (score > 0) {
    signals.push('semantic_match');
  }

  // Lexical match: only present if the row came through FTS channel
  // We detect this via channelAttribution on the row (Stage 4 annotation)
  const channelAttribution = Array.isArray(row.channelAttribution)
    ? row.channelAttribution as string[]
    : [];
  if (channelAttribution.includes('fts') || channelAttribution.includes('bm25')) {
    signals.push('lexical_match');
  }

  // Graph-related boosts
  const graphContrib = (row.graphContribution && typeof row.graphContribution === 'object')
    ? row.graphContribution as Record<string, unknown>
    : null;

  if (graphContrib) {
    const causalDelta = typeof graphContrib.causalDelta === 'number' ? graphContrib.causalDelta : 0;
    const coActDelta = typeof graphContrib.coActivationDelta === 'number' ? graphContrib.coActivationDelta : 0;
    const commDelta = typeof graphContrib.communityDelta === 'number' ? graphContrib.communityDelta : 0;
    const sigDelta = typeof graphContrib.graphSignalDelta === 'number' ? graphContrib.graphSignalDelta : 0;

    if (causalDelta > 0) signals.push('causal_boosted');
    if (coActDelta > 0) signals.push('graph_boosted');
    if (commDelta > 0) signals.push('community_boosted');
    if (sigDelta > 0 && !signals.includes('graph_boosted')) signals.push('graph_boosted');
  }

  // Session boost
  const sessionBoost = typeof row.sessionBoost === 'number' ? row.sessionBoost : 0;
  if (sessionBoost > 0) {
    signals.push('session_boosted');
  }

  // Reranker support: row has a rerankerScore distinct from stage2Score
  const rerankerScore = typeof row.rerankerScore === 'number' ? row.rerankerScore : null;
  const stage2Score = typeof row.stage2Score === 'number' ? row.stage2Score : null;
  if (rerankerScore !== null && stage2Score !== null && rerankerScore !== stage2Score) {
    signals.push('reranker_support');
  }

  // Feedback boost (learned trigger weight)
  const learnedBoost = typeof row.learnedBoost === 'number' ? row.learnedBoost : 0;
  if (learnedBoost > 0) {
    signals.push('feedback_boosted');
  }

  // Validation quality
  const validationMeta = (row.validationMetadata && typeof row.validationMetadata === 'object')
    ? row.validationMetadata as Record<string, unknown>
    : null;
  if (validationMeta) {
    const qualityScore = typeof validationMeta.qualityScore === 'number'
      ? validationMeta.qualityScore
      : 0;
    if (qualityScore > 0.7) {
      signals.push('validation_quality');
    }
  }

  // Anchor matches: look for anchorMetadata on the row
  const anchorMeta = Array.isArray(row.anchorMetadata) ? row.anchorMetadata : [];
  for (const anchor of anchorMeta) {
    if (anchor && typeof anchor === 'object') {
      const label = (anchor as Record<string, unknown>).label;
      if (typeof label === 'string' && label.trim()) {
        const anchorSignal: SignalLabel = `anchor:${label.toLowerCase().replace(/\s+/g, '-')}`;
        signals.push(anchorSignal);
      }
    }
  }

  return signals;
}

/**
 * Select the 2–4 most influential signals from the full list.
 * Prioritises: semantic/lexical first, then boosts, then meta.
 */
function selectTopSignals(signals: SignalLabel[]): SignalLabel[] {
  // Already ordered by influence — take up to 4 unique
  const seen = new Set<string>();
  const top: SignalLabel[] = [];
  for (const s of signals) {
    if (!seen.has(s)) {
      seen.add(s);
      top.push(s);
      if (top.length === 4) break;
    }
  }
  // Ensure at least 2 if available
  return top;
}

/**
 * Compose a natural-language summary sentence from the top signals.
 */
function composeSummary(topSignals: SignalLabel[], rank: number): string {
  if (topSignals.length === 0) {
    return rank === 0
      ? 'Ranked first by composite score'
      : `Ranked #${rank + 1} by composite score`;
  }

  const rankPhrase = rank === 0 ? 'Ranked first because' : `Ranked #${rank + 1} because`;

  // Build human-readable signal descriptions
  const descriptions = topSignals.map((signal) => {
    if (signal === 'semantic_match') return 'semantic similarity';
    if (signal === 'lexical_match') return 'keyword match';
    if (signal === 'graph_boosted') return 'graph co-activation';
    if (signal === 'session_boosted') return 'session attention';
    if (signal === 'causal_boosted') return 'causal graph';
    if (signal === 'community_boosted') return 'community detection';
    if (signal === 'reranker_support') return 'reranker confirmation';
    if (signal === 'feedback_boosted') return 'learned trigger';
    if (signal === 'validation_quality') return 'high spec quality';
    if (signal.startsWith('anchor:')) {
      const anchorName = signal.slice('anchor:'.length);
      return `${anchorName} anchor match`;
    }
    return signal;
  });

  if (descriptions.length === 1) {
    return `${rankPhrase} ${descriptions[0]}`;
  }

  const last = descriptions[descriptions.length - 1];
  const rest = descriptions.slice(0, -1);
  return `${rankPhrase} ${rest.join(', ')} and ${last}`;
}

/**
 * Extract channel contribution scores from a PipelineRow.
 * Uses channelAttribution array and graphContribution.totalDelta to
 * distribute the effective score across vector, fts, and graph channels.
 *
 * Falls back to a score-proportional distribution when data is sparse.
 */
function extractChannelContribution(row: PipelineRow): ChannelContribution {
  const effectiveScore = resolveEffectiveScore(row);

  // Prefer explicit channel scores when available
  const vectorScore = typeof row.vectorScore === 'number' && Number.isFinite(row.vectorScore)
    ? Math.max(0, Math.min(1, row.vectorScore))
    : null;
  const ftsScore = typeof row.ftsScore === 'number' && Number.isFinite(row.ftsScore)
    ? Math.max(0, Math.min(1, row.ftsScore))
    : null;

  const graphContrib = (row.graphContribution && typeof row.graphContribution === 'object')
    ? row.graphContribution as Record<string, unknown>
    : null;
  const graphTotal = typeof graphContrib?.totalDelta === 'number'
    ? Math.abs(graphContrib.totalDelta as number)
    : 0;

  if (vectorScore !== null && ftsScore !== null) {
    // Both explicit scores available — normalise
    const graphContribution = Math.min(graphTotal, effectiveScore);
    return {
      vector: Math.round(vectorScore * 100) / 100,
      fts: Math.round(ftsScore * 100) / 100,
      graph: Math.round(graphContribution * 100) / 100,
    };
  }

  // Fallback: distribute score proportionally based on available signals
  const channelAttribution = Array.isArray(row.channelAttribution)
    ? row.channelAttribution as string[]
    : [];
  const hasFTS = channelAttribution.includes('fts') || channelAttribution.includes('bm25');
  const hasGraph = graphTotal > 0;

  if (hasFTS && hasGraph) {
    const graphShare = Math.min(graphTotal, effectiveScore * 0.15);
    const remaining = effectiveScore - graphShare;
    return {
      vector: Math.round(remaining * 0.75 * 100) / 100,
      fts: Math.round(remaining * 0.25 * 100) / 100,
      graph: Math.round(graphShare * 100) / 100,
    };
  }

  if (hasFTS) {
    return {
      vector: Math.round(effectiveScore * 0.78 * 100) / 100,
      fts: Math.round(effectiveScore * 0.22 * 100) / 100,
      graph: 0,
    };
  }

  if (hasGraph) {
    const graphShare = Math.min(graphTotal, effectiveScore * 0.15);
    return {
      vector: Math.round((effectiveScore - graphShare) * 100) / 100,
      fts: 0,
      graph: Math.round(graphShare * 100) / 100,
    };
  }

  // Vector-only fallback
  return { vector: Math.round(effectiveScore * 100) / 100, fts: 0, graph: 0 };
}

// ── Public API ─────────────────────────────────────────────────

/**
 * Attach a `why` explanation object to a single result row.
 *
 * When debugEnabled=false (default), only summary and topSignals are included.
 * When debugEnabled=true, channelContribution is also included.
 *
 * @param row     - Pipeline result row
 * @param rank    - Zero-based rank position (0 = first result)
 * @param options - Explainability options
 * @returns The row with a `why` field attached
 */
export function attachResultExplainability(
  row: PipelineRow,
  rank: number,
  options: ExplainabilityOptions = {}
): PipelineRow & { why: WhyFull } {
  const signals = extractSignals(row);
  const topSignals = selectTopSignals(signals);
  const summary = composeSummary(topSignals, rank);

  const why: WhyFull = { summary, topSignals };

  if (options.debugEnabled) {
    why.channelContribution = extractChannelContribution(row);
  }

  return { ...row, why };
}

/**
 * Attach explainability to all results in a list.
 * Rank is automatically assigned by array position.
 *
 * No-op when SPECKIT_RESULT_EXPLAIN_V1 is not set and no explicit override.
 *
 * @param results       - Ordered list of pipeline rows
 * @param options       - Explainability options
 * @param forceEnabled  - Override flag check (for testing)
 * @returns Results with `why` fields attached, or original list if flag is OFF
 */
export function attachExplainabilityToResults(
  results: PipelineRow[],
  options: ExplainabilityOptions = {},
  forceEnabled?: boolean
): Array<PipelineRow & { why?: WhyFull }> {
  const enabled = forceEnabled !== undefined ? forceEnabled : isResultExplainEnabled();
  if (!enabled) return results;

  return results.map((row, index) =>
    attachResultExplainability(row, index, options)
  );
}

// ── Test surface ───────────────────────────────────────────────

export const __testables = {
  extractSignals,
  selectTopSignals,
  composeSummary,
  extractChannelContribution,
};
