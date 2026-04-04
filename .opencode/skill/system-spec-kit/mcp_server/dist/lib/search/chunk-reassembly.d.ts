/**
 * Internal search result row — enriched DB row used within the search handler.
 * Mirrors the MemorySearchRow shape from memory-search.ts for chunk fields.
 */
interface ChunkableSearchRow extends Record<string, unknown> {
    id: number;
    parent_id?: number | null;
    chunk_index?: number | null;
    chunk_label?: string | null;
    isChunk?: boolean;
    parentId?: number | null;
    chunkIndex?: number | null;
    chunkLabel?: string | null;
    chunkCount?: number | null;
    contentSource?: 'reassembled_chunks' | 'file_read_fallback';
    precomputedContent?: string;
}
interface ChunkReassemblyResult {
    results: ChunkableSearchRow[];
    stats: {
        collapsedChunkHits: number;
        chunkParents: number;
        reassembled: number;
        fallback: number;
    };
}
/**
 * Parse a nullable integer from unknown input.
 *
 * @param value - Value to coerce into an integer.
 * @returns Parsed integer value, or `null` when the input is missing or invalid.
 * @example
 * ```ts
 * parseNullableInt('42');
 * // 42
 * ```
 */
declare function parseNullableInt(value: unknown): number | null;
/**
 * Collapse chunk-level search hits into parent-level results.
 *
 * When multiple chunks of the same parent memory appear in results,
 * this function:
 * 1. Deduplicates by parent_id (keeps only the first/best-scoring chunk per parent)
 * 2. Fetches all sibling chunks from the DB
 * 3. Reassembles the full content by joining chunks in order
 * 4. Falls back to file_read_fallback when chunks have missing content
 *
 * @param results - Raw search rows that may include chunk-level hits.
 * @returns Parent-collapsed search rows plus reassembly statistics.
 * @example
 * ```ts
 * const collapsed = collapseAndReassembleChunkResults(results);
 * ```
 */
declare function collapseAndReassembleChunkResults(results: ChunkableSearchRow[]): ChunkReassemblyResult;
export { collapseAndReassembleChunkResults, parseNullableInt, };
export type { ChunkableSearchRow, ChunkReassemblyResult, };
//# sourceMappingURL=chunk-reassembly.d.ts.map