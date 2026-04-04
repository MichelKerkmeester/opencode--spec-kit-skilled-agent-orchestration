import type Database from 'better-sqlite3';
interface SummarySearchResult {
    id: number;
    memoryId: number;
    similarity: number;
}
/**
 * Compute cosine similarity between two vectors.
 * Handles mismatched dimensions gracefully by returning 0.
 */
declare function cosineSimilarity(a: Float32Array | number[], b: Float32Array | number[]): number;
/**
 * Convert a Float32Array to a Buffer for SQLite BLOB storage.
 */
declare function float32ToBuffer(arr: Float32Array): Buffer;
/**
 * Convert a Buffer (SQLite BLOB) back to a Float32Array.
 */
declare function bufferToFloat32(buf: Buffer): Float32Array;
/**
 * Generate summary, compute embedding, store in memory_summaries.
 *
 * 1. Call generateSummary(content)
 * 2. If summary empty, return { stored: false, summary: '' }
 * 3. Call embeddingFn(summary) to get embedding
 * 4. INSERT OR REPLACE into memory_summaries
 * 5. Store embedding as Buffer (Float32Array -> Buffer)
 * 6. Store key_sentences as JSON string
 *
 * @param db - SQLite database instance
 * @param memoryId - ID of the memory to summarize
 * @param content - Raw content to generate summary from
 * @param embeddingFn - Async function to compute embedding vector
 * @returns Object with stored flag and summary text
 */
export declare function generateAndStoreSummary(db: Database.Database, memoryId: number, content: string, embeddingFn: (text: string) => Promise<Float32Array | null>): Promise<{
    stored: boolean;
    summary: string;
}>;
/**
 * Vector search on summary embeddings — parallel channel for stage1.
 *
 * 1. SELECT id, memory_id, summary_embedding FROM memory_summaries
 *    WHERE summary_embedding IS NOT NULL
 * 2. Compute cosine similarity between query embedding and each summary embedding
 * 3. Return top `limit` results sorted by similarity descending
 * 4. Convert BLOB back to Float32Array for comparison
 *
 * @param db - SQLite database instance
 * @param queryEmbedding - Query vector to compare against stored summaries
 * @param limit - Maximum number of results to return
 * @returns Array of summary search results sorted by similarity descending
 */
export declare function querySummaryEmbeddings(db: Database.Database, queryEmbedding: Float32Array | number[], limit: number): SummarySearchResult[];
/**
 * Runtime scale gate check: returns true when >5000 indexed memories.
 * Used to determine if the summary search channel should be activated
 * as an additional retrieval source.
 *
 * @param db - SQLite database instance
 * @returns True if indexed memory count exceeds 5000
 */
export declare function checkScaleGate(db: Database.Database): boolean;
/**
 * Internal functions exposed for unit testing.
 * Do NOT use in production code paths.
 *
 * @internal
 */
export declare const __testables: {
    cosineSimilarity: typeof cosineSimilarity;
    float32ToBuffer: typeof float32ToBuffer;
    bufferToFloat32: typeof bufferToFloat32;
};
export {};
//# sourceMappingURL=memory-summaries.d.ts.map