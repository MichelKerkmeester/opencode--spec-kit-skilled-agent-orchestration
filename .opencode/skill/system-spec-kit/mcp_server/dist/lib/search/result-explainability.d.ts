import type { PipelineRow } from './pipeline/types.js';
/** Named signal labels used in topSignals and summary composition. */
export type SignalLabel = 'semantic_match' | 'lexical_match' | 'graph_boosted' | 'session_boosted' | 'causal_boosted' | 'community_boosted' | 'reranker_support' | 'feedback_boosted' | 'validation_quality' | `anchor:${string}`;
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
import { isResultExplainEnabled } from './search-flags.js';
/**
 * Returns true when SPECKIT_RESULT_EXPLAIN_V1 is enabled.
 * Default: ON (graduated). Set SPECKIT_RESULT_EXPLAIN_V1=false to disable.
 */
export { isResultExplainEnabled };
/**
 * Extract the list of active scoring signals from a PipelineRow.
 * Returns labels in descending order of influence.
 */
declare function extractSignals(row: PipelineRow): SignalLabel[];
/**
 * Select the 2–4 most influential signals from the full list.
 * Prioritises: semantic/lexical first, then boosts, then meta.
 */
declare function selectTopSignals(signals: SignalLabel[]): SignalLabel[];
/**
 * Compose a natural-language summary sentence from the top signals.
 */
declare function composeSummary(topSignals: SignalLabel[], rank: number): string;
/**
 * Extract channel contribution scores from a PipelineRow.
 * Uses channelAttribution array and graphContribution.totalDelta to
 * distribute the effective score across vector, fts, and graph channels.
 *
 * Falls back to a score-proportional distribution when data is sparse.
 */
declare function extractChannelContribution(row: PipelineRow): ChannelContribution;
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
export declare function attachResultExplainability(row: PipelineRow, rank: number, options?: ExplainabilityOptions): PipelineRow & {
    why: WhyFull;
};
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
export declare function attachExplainabilityToResults(results: PipelineRow[], options?: ExplainabilityOptions, forceEnabled?: boolean): Array<PipelineRow & {
    why?: WhyFull;
}>;
export declare const __testables: {
    extractSignals: typeof extractSignals;
    selectTopSignals: typeof selectTopSignals;
    composeSummary: typeof composeSummary;
    extractChannelContribution: typeof extractChannelContribution;
};
//# sourceMappingURL=result-explainability.d.ts.map