// ───────────────────────────────────────────────────────────────
// MODULE: Chunk Thinning
// ───────────────────────────────────────────────────────────────
// Scores chunks by anchor presence + content density, then
// Applies a thinning threshold to drop low-quality chunks.
// Used BEFORE indexing to filter out low-value chunks.
import type { AnchorChunk } from './anchor-chunker.js';

// Feature catalog: Anchor-aware chunk thinning


/* ───────────────────────────────────────────────────────────────
   1. TYPES
──────────────────────────────────────────────────────────────── */

/**
 * Describes the ChunkScore shape.
 */
export interface ChunkScore {
  chunk: AnchorChunk;
  score: number;        // 0-1 composite score
  anchorScore: number;  // 0 or 1 based on anchor presence
  densityScore: number; // 0-1 based on content density
  retained: boolean;    // true if above threshold
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

/* ───────────────────────────────────────────────────────────────
   2. CONSTANTS
──────────────────────────────────────────────────────────────── */

// Default threshold — chunks below this composite score are dropped
const DEFAULT_THINNING_THRESHOLD = 0.3;

// Weights for composite score
const ANCHOR_WEIGHT = 0.6;   // Anchor presence is primary signal
const DENSITY_WEIGHT = 0.4;  // Content density is secondary
const MIN_ANCHORED_DENSITY = 0.1;
const MIN_ANCHORED_MEANINGFUL_CHARS = 24;

/* ───────────────────────────────────────────────────────────────
   3. DENSITY COMPUTATION
──────────────────────────────────────────────────────────────── */

function getMeaningfulContent(content: string): string {
  return content
    .replace(/<!--[\s\S]*?-->/g, '')    // HTML comments
    .replace(/\s+/g, ' ')               // collapse whitespace
    .trim();
}

/**
 * Compute content density for a chunk.
 * Returns 0-1 based on ratio of meaningful content.
 */
function computeContentDensity(content: string): number {
  if (!content || content.length === 0) return 0;

  // Strip HTML comments, anchor markers, excessive whitespace
  const stripped = getMeaningfulContent(content);

  if (stripped.length === 0) return 0;

  // Density = meaningful chars / total chars
  const ratio = stripped.length / content.length;

  // Penalize very short chunks (< 100 chars after stripping)
  const lengthFactor = stripped.length < 100 ? stripped.length / 100 : 1.0;

  // Count meaningful content markers (headings, code blocks, lists)
  const headings = (content.match(/^#{1,6}\s/gm) || []).length;
  // Divide by 2: each code block has an opening and closing ```, so pair count = match count / 2
  const codeBlocks = (content.match(/```/g) || []).length / 2;
  const listItems = (content.match(/^[-*]\s/gm) || []).length;
  const structureBonus = Math.min(0.2, (headings + codeBlocks + listItems) * 0.05);

  return Math.min(1.0, (ratio * lengthFactor) + structureBonus);
}

function hasAnchoredSignal(chunk: AnchorChunk, densityScore: number): boolean {
  if (chunk.anchorIds.length === 0) {
    return true;
  }

  const meaningfulLength = getMeaningfulContent(chunk.content).length;
  return densityScore >= MIN_ANCHORED_DENSITY && meaningfulLength >= MIN_ANCHORED_MEANINGFUL_CHARS;
}

/* ───────────────────────────────────────────────────────────────
   4. CHUNK SCORING
──────────────────────────────────────────────────────────────── */

/**
 * Score a chunk based on anchor presence and content density.
 */
export function scoreChunk(chunk: AnchorChunk): ChunkScore {
  // Anchor score: 1.0 if chunk has anchors, 0.0 if not
  const anchorScore = chunk.anchorIds.length > 0 ? 1.0 : 0.0;

  // Density score: ratio of non-whitespace content to total size
  // Also penalize very short chunks and boilerplate-heavy chunks
  const densityScore = computeContentDensity(chunk.content);

  const score = (ANCHOR_WEIGHT * anchorScore) + (DENSITY_WEIGHT * densityScore);
  const retained = hasAnchoredSignal(chunk, densityScore) && score >= DEFAULT_THINNING_THRESHOLD;

  return {
    chunk,
    score,
    anchorScore,
    densityScore,
    retained,
  };
}

/* ───────────────────────────────────────────────────────────────
   5. THINNING
──────────────────────────────────────────────────────────────── */

/**
 * Apply anchor-aware thinning to a set of chunks.
 *
 * Scores each chunk and drops those below the threshold.
 * Always retains at least 1 chunk (never empties the result set).
 */
export function thinChunks(
  chunks: AnchorChunk[],
  threshold: number = DEFAULT_THINNING_THRESHOLD,
): ThinningResult {
  if (chunks.length <= 1) {
    return {
      original: chunks,
      retained: chunks,
      dropped: [],
      scores: chunks.map(c => ({ ...scoreChunk(c), retained: true })),
    };
  }

  const scores = chunks.map(c => {
    const s = scoreChunk(c);
    return { ...s, retained: hasAnchoredSignal(c, s.densityScore) && s.score >= threshold };
  });

  const retained = scores.filter(s => s.retained).map(s => s.chunk);
  const dropped = scores.filter(s => !s.retained).map(s => s.chunk);

  // Safety: always retain at least 1 chunk
  if (retained.length === 0 && chunks.length > 0) {
    // Keep the highest-scoring chunk
    scores.sort((a, b) => b.score - a.score);
    scores[0].retained = true;
    return {
      original: chunks,
      retained: [scores[0].chunk],
      dropped: scores.slice(1).map(s => s.chunk),
      scores,
    };
  }

  return { original: chunks, retained, dropped, scores };
}

export { DEFAULT_THINNING_THRESHOLD, ANCHOR_WEIGHT, DENSITY_WEIGHT };
