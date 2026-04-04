export interface EnrichmentResult {
    /** Enrichment hints appended to the response */
    hints: string[];
    /** Total estimated tokens added */
    tokenCount: number;
    /** Wall-clock time spent enriching */
    latencyMs: number;
    /** Whether enrichment was skipped */
    skipped: boolean;
    skipReason?: string;
}
interface EnrichmentOptions {
    /** Max wall-clock time in ms (default: 250) */
    deadlineMs?: number;
    /** Max tokens to inject (default: 200) */
    tokenBudget?: number;
}
/**
 * Extract file paths mentioned in the response text.
 * Returns up to 5 unique paths to keep enrichment bounded.
 */
declare function extractMentionedPaths(text: string): string[];
/**
 * Run the passive enrichment pipeline on a tool response.
 *
 * @param responseText - The stringified tool response to enrich
 * @param options      - Deadline and token budget overrides
 * @returns EnrichmentResult with hints and metadata
 */
export declare function runPassiveEnrichment(responseText: string, options?: EnrichmentOptions): Promise<EnrichmentResult>;
/**
 * Extract mentioned file paths from text (exported for testing).
 */
export { extractMentionedPaths };
//# sourceMappingURL=passive-enrichment.d.ts.map