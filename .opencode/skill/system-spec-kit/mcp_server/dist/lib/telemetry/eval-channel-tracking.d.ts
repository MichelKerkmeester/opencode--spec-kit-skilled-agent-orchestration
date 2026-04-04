interface EvalChannelPayload {
    channel: string;
    resultMemoryIds: number[];
    scores: number[];
}
interface GraphWalkDiagnostics {
    rolloutState: 'off' | 'trace_only' | 'bounded_runtime';
    rowsWithGraphContribution: number;
    rowsWithAppliedBonus: number;
    capAppliedCount: number;
    maxRaw: number;
    maxNormalized: number;
    maxAppliedBonus: number;
}
/**
 * Resolve the best available numeric score from a result row.
 * Checks `score`, then `similarity`, then `rrfScore` — returns 0 if none found.
 */
declare function resolveEvalScore(row: Record<string, unknown>): number;
/**
 * Collect all eval channel attributions from a result row.
 * Checks `sources` (array), `source` (string), and `channelAttribution` (array).
 * Falls back to `['hybrid']` if no channels are found.
 */
declare function collectEvalChannelsFromRow(row: Record<string, unknown>): string[];
/**
 * Build per-channel eval payloads from an array of result rows.
 * Groups results by channel, deduplicates by memory ID (keeping highest score).
 */
declare function buildEvalChannelPayloads(rows: Array<Record<string, unknown>>): EvalChannelPayload[];
/**
 * Summarize graph walk diagnostics from result rows for telemetry.
 * Inspects `trace.graphContribution` on each row.
 */
declare function summarizeGraphWalkDiagnostics(rows: Array<Record<string, unknown>>): GraphWalkDiagnostics;
export { resolveEvalScore, collectEvalChannelsFromRow, buildEvalChannelPayloads, summarizeGraphWalkDiagnostics, };
export type { EvalChannelPayload, GraphWalkDiagnostics, };
//# sourceMappingURL=eval-channel-tracking.d.ts.map