import type { AnchorChunk } from './anchor-chunker.js';
/**
 * Describes the ChunkScore shape.
 */
export interface ChunkScore {
    chunk: AnchorChunk;
    score: number;
    anchorScore: number;
    densityScore: number;
    retained: boolean;
}
/**
 * Describes the ThinningResult shape.
 */
export interface ThinningResult {
    original: AnchorChunk[];
    retained: AnchorChunk[];
    dropped: AnchorChunk[];
    scores: ChunkScore[];
}
declare const DEFAULT_THINNING_THRESHOLD = 0.3;
declare const ANCHOR_WEIGHT = 0.6;
declare const DENSITY_WEIGHT = 0.4;
/**
 * Score a chunk based on anchor presence and content density.
 */
export declare function scoreChunk(chunk: AnchorChunk): ChunkScore;
/**
 * Apply anchor-aware thinning to a set of chunks.
 *
 * Scores each chunk and drops those below the threshold.
 * Always retains at least 1 chunk (never empties the result set).
 */
export declare function thinChunks(chunks: AnchorChunk[], threshold?: number): ThinningResult;
export { DEFAULT_THINNING_THRESHOLD, ANCHOR_WEIGHT, DENSITY_WEIGHT };
//# sourceMappingURL=chunk-thinning.d.ts.map