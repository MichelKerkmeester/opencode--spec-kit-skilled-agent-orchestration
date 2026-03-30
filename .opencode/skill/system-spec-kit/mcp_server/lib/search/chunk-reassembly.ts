// ───────────────────────────────────────────────────────────────
// MODULE: Chunk Reassembly
// ───────────────────────────────────────────────────────────────
// Extracted from handlers/memory-search.ts
// Collapses chunk-level search results into parent-level results,
// reassembling content from sibling chunks stored in memory_index.

import { requireDb, toErrorMessage } from '../../utils/index.js';

/* ───────────────────────────────────────────────────────────────
   1. TYPES
──────────────────────────────────────────────────────────────── */

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

/* ───────────────────────────────────────────────────────────────
   2. HELPERS
──────────────────────────────────────────────────────────────── */

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
function parseNullableInt(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value) && Number.isInteger(value)) {
    return value;
  }
  if (typeof value === 'string' && value.trim().length > 0) {
    const parsed = Number(value);
    if (Number.isFinite(parsed) && Number.isInteger(parsed)) {
      return parsed;
    }
  }
  return null;
}

/* ───────────────────────────────────────────────────────────────
   3. MAIN FUNCTION
──────────────────────────────────────────────────────────────── */

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
function collapseAndReassembleChunkResults(results: ChunkableSearchRow[]): ChunkReassemblyResult {
  if (!Array.isArray(results) || results.length === 0) {
    return {
      results: [],
      stats: {
        collapsedChunkHits: 0,
        chunkParents: 0,
        reassembled: 0,
        fallback: 0,
      },
    };
  }

  const seenParents = new Set<number>();
  const parentIds = new Set<number>();
  const collapsed: ChunkableSearchRow[] = [];
  let collapsedChunkHits = 0;

  for (const row of results) {
    // H14 FIX: Support both snake_case and camelCase chunk field names
    const parentId = parseNullableInt(row.parent_id ?? (row as Record<string, unknown>).parentId);
    if (parentId !== null) {
      if (seenParents.has(parentId)) {
        collapsedChunkHits++;
        continue;
      }
      seenParents.add(parentId);
      parentIds.add(parentId);
      collapsed.push({
        ...row,
        isChunk: true,
        parentId,
        chunkIndex: parseNullableInt(row.chunk_index ?? (row as Record<string, unknown>).chunkIndex),
        chunkLabel: typeof row.chunk_label === 'string' ? row.chunk_label : (typeof (row as Record<string, unknown>).chunkLabel === 'string' ? (row as Record<string, unknown>).chunkLabel as string : null),
        chunkCount: null,
        contentSource: 'file_read_fallback',
      });
      continue;
    }

    collapsed.push({
      ...row,
      isChunk: false,
      parentId: null,
      chunkIndex: null,
      chunkLabel: null,
      chunkCount: null,
    });
  }

  if (parentIds.size === 0) {
    return {
      results: collapsed,
      stats: {
        collapsedChunkHits,
        chunkParents: 0,
        reassembled: 0,
        fallback: 0,
      },
    };
  }

  try {
    const database = requireDb();
    const ids = Array.from(parentIds);
    const placeholders = ids.map(() => '?').join(', ');
    const rows = database.prepare(`
      SELECT parent_id, chunk_index, chunk_label, content_text
      FROM memory_index
      WHERE parent_id IN (${placeholders})
      ORDER BY parent_id ASC, chunk_index ASC
    `).all(...ids) as Array<{
      parent_id: number;
      chunk_index: number | null;
      chunk_label: string | null;
      content_text: string | null;
    }>;

    const byParent = new Map<number, Array<{
      chunk_index: number | null;
      chunk_label: string | null;
      content_text: string | null;
    }>>();

    for (const row of rows) {
      const list = byParent.get(row.parent_id);
      if (list) {
        list.push(row);
      } else {
        byParent.set(row.parent_id, [row]);
      }
    }

    let reassembled = 0;
    let fallback = 0;
    const withContent: ChunkableSearchRow[] = collapsed.map((row): ChunkableSearchRow => {
      if (!row.isChunk || row.parentId == null) return row;

      const chunks = byParent.get(row.parentId) || [];
      const chunkCount = chunks.length;
      if (chunkCount === 0) {
        fallback++;
        return { ...row, chunkCount, contentSource: 'file_read_fallback' as const };
      }

      const normalizedChunks = chunks
        .slice()
        .sort((a, b) => (a.chunk_index ?? Number.MAX_SAFE_INTEGER) - (b.chunk_index ?? Number.MAX_SAFE_INTEGER));

      const hasMissingContent = normalizedChunks.some(
        (chunk) => typeof chunk.content_text !== 'string' || chunk.content_text.trim().length === 0
      );

      if (hasMissingContent) {
        fallback++;
        return { ...row, chunkCount, contentSource: 'file_read_fallback' as const };
      }

      const reassembledContent = normalizedChunks
        .map((chunk) => (chunk.content_text as string).trim())
        .filter(Boolean)
        .join('\n\n')
        .trim();

      if (!reassembledContent) {
        fallback++;
        return { ...row, chunkCount, contentSource: 'file_read_fallback' as const };
      }

      reassembled++;
      return {
        ...row,
        chunkCount,
        precomputedContent: reassembledContent,
        contentSource: 'reassembled_chunks' as const,
      };
    });

    return {
      results: withContent,
      stats: {
        collapsedChunkHits,
        chunkParents: parentIds.size,
        reassembled,
        fallback,
      },
    };
  } catch (error: unknown) {
    const message = toErrorMessage(error);
    console.warn('[memory-search] Failed to reassemble chunked results, falling back to file reads:', message);
    return {
      results: collapsed,
      stats: {
        collapsedChunkHits,
        chunkParents: parentIds.size,
        reassembled: 0,
        fallback: parentIds.size,
      },
    };
  }
}

/* ───────────────────────────────────────────────────────────────
   4. EXPORTS
──────────────────────────────────────────────────────────────── */

export {
  collapseAndReassembleChunkResults,
  parseNullableInt,
};

export type {
  ChunkableSearchRow,
  ChunkReassemblyResult,
};
