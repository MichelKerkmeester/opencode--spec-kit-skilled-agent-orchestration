// ───────────────────────────────────────────────────────────────
// MODULE: Memory Summaries
// ───────────────────────────────────────────────────────────────
// Feature catalog: Memory summary search channel
// Gated via SPECKIT_MEMORY_SUMMARIES

import type Database from 'better-sqlite3';
import { generateSummary } from './tfidf-summarizer.js';
import { isMemorySummariesEnabled } from './search-flags.js';

// ───────────────────────────────────────────────────────────────
// 1. INTERFACES

// ───────────────────────────────────────────────────────────────
interface SummarySearchResult {
  id: number;
  memoryId: number;
  similarity: number;
}

// ───────────────────────────────────────────────────────────────
// 2. HELPERS

// ───────────────────────────────────────────────────────────────
/**
 * Compute cosine similarity between two vectors.
 * Handles mismatched dimensions gracefully by returning 0.
 */
function cosineSimilarity(a: Float32Array | number[], b: Float32Array | number[]): number {
  const lenA = a.length;
  const lenB = b.length;

  // Mismatched dimensions: cannot compute meaningful similarity
  if (lenA !== lenB || lenA === 0) {
    return 0;
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < lenA; i++) {
    const valA = a[i];
    const valB = b[i];
    dotProduct += valA * valB;
    normA += valA * valA;
    normB += valB * valB;
  }

  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  if (denominator === 0) {
    return 0;
  }

  return dotProduct / denominator;
}

/**
 * Convert a Float32Array to a Buffer for SQLite BLOB storage.
 */
function float32ToBuffer(arr: Float32Array): Buffer {
  return Buffer.from(arr.buffer, arr.byteOffset, arr.byteLength);
}

/**
 * Convert a Buffer (SQLite BLOB) back to a Float32Array.
 */
function bufferToFloat32(buf: Buffer): Float32Array {
  // Create a copy to avoid alignment issues
  const copy = new ArrayBuffer(buf.length);
  const view = new Uint8Array(copy);
  for (let i = 0; i < buf.length; i++) {
    view[i] = buf[i];
  }
  return new Float32Array(copy);
}

// ───────────────────────────────────────────────────────────────
// 3. CORE FUNCTIONS

// ───────────────────────────────────────────────────────────────
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
export async function generateAndStoreSummary(
  db: Database.Database,
  memoryId: number,
  content: string,
  embeddingFn: (text: string) => Promise<Float32Array | null>
): Promise<{ stored: boolean; summary: string }> {
  if (!isMemorySummariesEnabled()) {
    return { stored: false, summary: '' };
  }

  try {
    const { summary, keySentences } = generateSummary(content);

    if (!summary) {
      return { stored: false, summary: '' };
    }

    const embedding = await embeddingFn(summary);
    const embeddingBlob = embedding ? float32ToBuffer(embedding) : null;
    const keySentencesJson = JSON.stringify(keySentences);
    const now = new Date().toISOString();

    const stmt = db.prepare(`
      INSERT OR REPLACE INTO memory_summaries
        (memory_id, summary_text, summary_embedding, key_sentences, created_at, updated_at)
      VALUES
        (?, ?, ?, ?, COALESCE((SELECT created_at FROM memory_summaries WHERE memory_id = ?), ?), ?)
    `);

    stmt.run(
      memoryId,
      summary,
      embeddingBlob,
      keySentencesJson,
      memoryId,
      now,
      now
    );

    return { stored: true, summary };
  } catch (error: unknown) {
    console.warn(
      `[memory-summaries] Failed to generate/store summary for memory ${memoryId}:`,
      error instanceof Error ? error.message : error
    );
    return { stored: false, summary: '' };
  }
}

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
export function querySummaryEmbeddings(
  db: Database.Database,
  queryEmbedding: Float32Array | number[],
  limit: number
): SummarySearchResult[] {
  try {
    // Cap rows fetched to avoid full-table scans on large databases.
    // Over-fetch by a factor so that after cosine ranking we can still return `limit` results.
    const fetchCap = Math.max(limit * 10, 1000);
    const rows = db.prepare(`
      SELECT id, memory_id, summary_embedding
      FROM memory_summaries
      WHERE summary_embedding IS NOT NULL
      LIMIT ?
    `).all(fetchCap) as Array<{ id: number; memory_id: number; summary_embedding: Buffer }>;

    const results: SummarySearchResult[] = [];

    for (const row of rows) {
      const storedEmbedding = bufferToFloat32(row.summary_embedding);
      const similarity = cosineSimilarity(queryEmbedding, storedEmbedding);

      results.push({
        id: row.id,
        memoryId: row.memory_id,
        similarity,
      });
    }

    // Sort by similarity descending, take top `limit`
    results.sort((a, b) => b.similarity - a.similarity);
    return results.slice(0, limit);
  } catch (error: unknown) {
    console.warn(
      '[memory-summaries] Failed to query summary embeddings:',
      error instanceof Error ? error.message : error
    );
    return [];
  }
}

/**
 * Runtime scale gate check: returns true when >5000 indexed memories.
 * Used to determine if the summary search channel should be activated
 * as an additional retrieval source.
 *
 * @param db - SQLite database instance
 * @returns True if indexed memory count exceeds 5000
 */
export function checkScaleGate(db: Database.Database): boolean {
  try {
    const row = db.prepare(`
      SELECT COUNT(*) AS cnt
      FROM memory_index
      WHERE embedding_status = 'success'
    `).get() as { cnt: number } | undefined;

    return (row?.cnt ?? 0) > 5000;
  } catch (error: unknown) {
    console.warn(
      '[memory-summaries] Failed to check scale gate:',
      error instanceof Error ? error.message : error
    );
    return false;
  }
}

// ───────────────────────────────────────────────────────────────
// 4. TEST EXPORTS

// ───────────────────────────────────────────────────────────────
/**
 * Internal functions exposed for unit testing.
 * Do NOT use in production code paths.
 *
 * @internal
 */
export const __testables = {
  cosineSimilarity,
  float32ToBuffer,
  bufferToFloat32,
};
