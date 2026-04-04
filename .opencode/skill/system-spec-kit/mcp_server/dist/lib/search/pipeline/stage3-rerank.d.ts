import { resolveEffectiveScore } from './types.js';
import type { Stage3Input, Stage3Output, PipelineRow } from './types.js';
/**
 * Aggregated statistics from the MPAB chunk-collapse pass.
 */
interface ChunkReassemblyStats {
    /** Number of child chunk rows removed from the result set. */
    collapsedChunkHits: number;
    /** Number of distinct parent IDs encountered among chunk hits. */
    chunkParents: number;
    /** Number of parents whose content was successfully reassembled from DB. */
    reassembled: number;
    /** Number of parents that fell back to using best-chunk content. */
    fallback: number;
}
/**
 * Internal representation of a chunk group — all chunks belonging
 * to a single parent, ready for collapse and reassembly.
 */
interface ChunkGroup {
    parentId: number;
    chunks: PipelineRow[];
    /** The chunk with the highest similarity/score — the representative row. */
    bestChunk: PipelineRow;
    /** Parent-level score derived from all chunk scores with a best-chunk floor. */
    parentScore: number;
}
type RerankProvider = 'cross-encoder' | 'local-gguf' | 'fallback-sort' | 'none';
/**
 * Execute Stage 3: Rerank + Aggregate.
 *
 * Applies cross-encoder reranking (if enabled) and then collapses
 * chunked memory hits into their parent documents (MPAB). The order
 * is intentional: cross-encoder scores are computed on the raw chunks
 * (fine-grained text), then parent reassembly aggregates the results.
 *
 * @param input - Stage 3 input containing scored results from Stage 2
 *   and the shared pipeline configuration.
 * @returns Stage 3 output with reranked, aggregated results and metadata.
 */
export declare function executeStage3(input: Stage3Input): Promise<Stage3Output>;
/**
 * Apply cross-encoder reranking to a list of pipeline results.
 *
 * Returns the original array unchanged if:
 *   - The `rerank` option is not set
 *   - The `SPECKIT_CROSS_ENCODER` feature flag is disabled
 *   - There are fewer than {@link MIN_RESULTS_FOR_RERANK} results
 *
 * On any reranker error, logs a warning and returns the original
 * results unmodified (graceful degradation).
 *
 * @param query       - The user's search query string.
 * @param results     - Pipeline rows from Stage 2 fusion.
 * @param options     - Rerank configuration flags.
 * @returns Object with reranked rows, whether reranking was applied, and the
 * reranker path that executed.
 */
declare function applyCrossEncoderReranking(query: string, results: PipelineRow[], options: {
    rerank: boolean;
    applyLengthPenalty: boolean;
    limit: number;
}): Promise<{
    rows: PipelineRow[];
    applied: boolean;
    provider: RerankProvider;
}>;
/**
 * Resolve the content string used for cross-encoder scoring for a given row.
 * Prefers `content` over `file_path`; falls back to an empty string if
 * neither is available (rare edge case for index-only entries).
 *
 * This value is placed into the `content` field of the RerankDocument sent
 * to the cross-encoder module.
 *
 * @param row - A pipeline result row.
 * @returns Content string for the cross-encoder.
 */
declare function resolveDisplayText(row: PipelineRow): string;
/**
 * Collapse chunk-level hits and reassemble parent memory documents.
 *
 * MPAB (Multi-Part Aggregation + Backfill) algorithm:
 *   1. Separate rows into chunks (has `parent_id`) and non-chunks.
 *   2. Group chunks by `parent_id`.
 *   3. For each group, elect the best chunk (highest score).
 *   4. Attempt to load the full parent content from the database.
 *   5. If the DB query succeeds, emit a reassembled parent row.
 *   6. If the DB query fails, fall back to the best-chunk content.
 *   7. Merge non-chunks + reassembled parents, sort by score descending.
 *
 * Pipeline position constraint: this function MUST NOT be called before
 * RRF fusion (Stage 2). It is intentionally placed in Stage 3.
 *
 * @param results - Scored pipeline rows from (optionally reranked) Stage 3.
 * @returns Object with aggregated rows and chunk reassembly statistics.
 */
declare function collapseAndReassembleChunkResults(results: PipelineRow[]): Promise<{
    results: PipelineRow[];
    stats: ChunkReassemblyStats;
}>;
/**
 * Elect the best representative chunk from a chunk group.
 * Selection criteria: highest `score`, breaking ties by `similarity`.
 *
 * @param chunks - All chunk rows for a single parent.
 * @returns The chunk with the highest effective score.
 */
declare function electBestChunk(chunks: PipelineRow[]): PipelineRow;
/**
 * Attempt to reassemble a full parent memory row from the database.
 *
 * On success, returns a PipelineRow that merges:
 *   - All best-chunk fields as the base
 *   - Parent-level content from the DB (if available)
 *   - `contentSource: 'reassembled_chunks'` to mark provenance
 *
 * On failure, returns the best-chunk row with
 *   `contentSource: 'file_read_fallback'`.
 *
 * @param group  - The chunk group (parentId + chunks + bestChunk).
 * @param stats  - Mutable stats object updated in place.
 * @returns A PipelineRow representing the parent document.
 */
declare function reassembleParentRow(group: ChunkGroup, stats: ChunkReassemblyStats): Promise<PipelineRow>;
/**
 * Mark a pipeline row as a chunk-content fallback.
 * Clears chunk-specific identity fields and marks the content source.
 *
 * @param chunk - The elected best-chunk row.
 * @param parentScore - Parent-level score after MPAB aggregation.
 * @returns A new PipelineRow annotated as a fallback parent representation.
 */
declare function markFallback(chunk: PipelineRow, parentScore: number): PipelineRow;
/**
 * Internal functions exported for unit testing.
 * Do not rely on these in production code — the API is not stable.
 *
 * @internal
 */
export declare const __testables: {
    applyCrossEncoderReranking: typeof applyCrossEncoderReranking;
    collapseAndReassembleChunkResults: typeof collapseAndReassembleChunkResults;
    electBestChunk: typeof electBestChunk;
    effectiveScore: typeof resolveEffectiveScore;
    resolveDisplayText: typeof resolveDisplayText;
    reassembleParentRow: typeof reassembleParentRow;
    markFallback: typeof markFallback;
};
export {};
//# sourceMappingURL=stage3-rerank.d.ts.map