/**
 * Describes the AnchorChunk shape.
 */
export interface AnchorChunk {
    /** The text content of this chunk */
    content: string;
    /** Anchor IDs covered by this chunk (empty for fallback chunks) */
    anchorIds: string[];
    /** Human-readable label for this chunk */
    label: string;
    /** Approximate character count */
    charCount: number;
}
/**
 * Describes the ChunkingResult shape.
 */
export interface ChunkingResult {
    /** Strategy used: 'anchor' or 'structure' */
    strategy: 'anchor' | 'structure';
    /** The chunks produced */
    chunks: AnchorChunk[];
    /** Summary text for the parent record (first ~500 chars) */
    parentSummary: string;
}
/** Minimum file size (chars) to trigger chunking */
export declare const CHUNKING_THRESHOLD = 50000;
/**
 * Chunk a large memory file into smaller pieces for indexing.
 *
 * Strategy:
 * 1. Try anchor-based splitting first (files with ANCHOR tags)
 * 2. Fall back to structure-aware markdown splitting
 *
 * @param content - The full file content
 * @returns ChunkingResult with strategy info and chunk array
 */
export declare function chunkLargeFile(content: string): ChunkingResult;
/**
 * Check if a file's content exceeds the chunking threshold.
 */
export declare function needsChunking(content: string): boolean;
//# sourceMappingURL=anchor-chunker.d.ts.map