import { type AllocationResult } from './budget-allocator.js';
import { type PreMergeSelectionMetadata, type SharedPayloadEnvelope } from '../context/shared-payload.js';
/** Input from each context source */
export interface MergeInput {
    constitutional: string;
    codeGraph: string;
    cocoIndex: string;
    triggered: string;
    sessionState: string;
}
/** Per-source freshness metadata */
export interface SourceFreshness {
    source: string;
    lastUpdated: string | null;
    staleness: 'fresh' | 'recent' | 'stale' | 'unknown';
}
/** Merged compact brief with metadata */
export interface MergedBrief {
    text: string;
    sections: {
        name: string;
        content: string;
        tokenEstimate: number;
        source: string;
    }[];
    allocation: AllocationResult;
    payloadContract: SharedPayloadEnvelope;
    metadata: {
        totalTokenEstimate: number;
        sourceCount: number;
        mergedAt: string;
        mergeDurationMs: number;
        deduplicatedFiles: number;
        freshness: SourceFreshness[];
        selection?: PreMergeSelectionMetadata;
    };
}
/**
 * Merge context from multiple sources into a compact brief.
 *
 * Strategy:
 * 1. Allocate budget across sources (floor + overflow)
 * 2. Truncate each source to its granted budget
 * 3. Deduplicate at file level (same file from multiple sources → keep highest priority)
 * 4. Render sections in priority order with headers
 */
export declare function mergeCompactBrief(input: MergeInput, totalBudget?: number, freshness?: SourceFreshness[], selection?: PreMergeSelectionMetadata): MergedBrief;
//# sourceMappingURL=compact-merger.d.ts.map