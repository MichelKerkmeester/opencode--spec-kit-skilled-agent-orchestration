// ───────────────────────────────────────────────────────────────
// MODULE: Chunk Reassembly
// ───────────────────────────────────────────────────────────────
// Extracted from handlers/memory-search.ts
// Collapses chunk-level search results into parent-level results,
// reassembling content from sibling chunks stored in memory_index.
import { requireDb, toErrorMessage } from '../../utils/index.js';
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
function parseNullableInt(value) {
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
function collapseAndReassembleChunkResults(results) {
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
    const seenParents = new Set();
    const parentIds = new Set();
    const collapsed = [];
    let collapsedChunkHits = 0;
    for (const row of results) {
        // H14 FIX: Support both snake_case and camelCase chunk field names
        const parentId = parseNullableInt(row.parent_id ?? row.parentId);
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
                chunkIndex: parseNullableInt(row.chunk_index ?? row.chunkIndex),
                chunkLabel: typeof row.chunk_label === 'string' ? row.chunk_label : (typeof row.chunkLabel === 'string' ? row.chunkLabel : null),
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
    `).all(...ids);
        const byParent = new Map();
        for (const row of rows) {
            const list = byParent.get(row.parent_id);
            if (list) {
                list.push(row);
            }
            else {
                byParent.set(row.parent_id, [row]);
            }
        }
        let reassembled = 0;
        let fallback = 0;
        const withContent = collapsed.map((row) => {
            if (!row.isChunk || row.parentId == null)
                return row;
            const chunks = byParent.get(row.parentId) || [];
            const chunkCount = chunks.length;
            if (chunkCount === 0) {
                fallback++;
                return { ...row, chunkCount, contentSource: 'file_read_fallback' };
            }
            const normalizedChunks = chunks
                .slice()
                .sort((a, b) => (a.chunk_index ?? Number.MAX_SAFE_INTEGER) - (b.chunk_index ?? Number.MAX_SAFE_INTEGER));
            const hasMissingContent = normalizedChunks.some((chunk) => typeof chunk.content_text !== 'string' || chunk.content_text.trim().length === 0);
            if (hasMissingContent) {
                fallback++;
                return { ...row, chunkCount, contentSource: 'file_read_fallback' };
            }
            const reassembledContent = normalizedChunks
                .map((chunk) => chunk.content_text.trim())
                .filter(Boolean)
                .join('\n\n')
                .trim();
            if (!reassembledContent) {
                fallback++;
                return { ...row, chunkCount, contentSource: 'file_read_fallback' };
            }
            reassembled++;
            return {
                ...row,
                chunkCount,
                precomputedContent: reassembledContent,
                contentSource: 'reassembled_chunks',
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
    }
    catch (error) {
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
export { collapseAndReassembleChunkResults, parseNullableInt, };
//# sourceMappingURL=chunk-reassembly.js.map